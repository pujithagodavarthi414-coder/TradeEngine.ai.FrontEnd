import { Component, EventEmitter, Inject, OnInit, ViewChild, ChangeDetectorRef, Input, Output } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar} from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ConstantVariables } from "../../../../globaldependencies/constants/constant-variables";
import { CustomAppBaseComponent } from "../../../../globaldependencies/components/componentbase";

import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserModel } from "../models/user";
import { Observable } from "rxjs";
import { UserService } from "../services/user.Service";
import { RoleManagementService } from '../../../services/role-management.service';
import { GenericFormSubmitted } from "../models/generic-form-submitted.model";
import { GenericFormService } from "../services/generic-form.service";

export interface DialogData {
    application: GenericFormSubmitted;
}

@Component({
    selector: "generic-application-form-popup",
    templateUrl: "./generic-application.html"
})

export class GenericApplicationComponent extends CustomAppBaseComponent implements OnInit {
    isEdit: any;
    isEditMain: any;
    isApproved: boolean;
    dataSourceId: any;
    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            this.isFormLoading = false;
            this.genericFormSubmittedId = this.matData.application.genericFormSubmittedId;
            this.formId = this.matData.application.customApplicationId;
            this.isApproved = this.matData.application.isApproved;
            this.dataSourceId = this.matData.application.dataSourceId;
            this.isEdit = this.matData.isEdit;
            this.selectedFormId = this.matData.application.formId;
            this.genericForm = this.matData.application;
            this.formSrc = this.genericForm.formJson;
            this.isAbleToLogin = this.matData.application.isAbleToLogin;
            this.allowAnnonymous = this.matData.allowAnnonymous;
            this.isEdit = this.matData.isEdit;
            this.isEditMain = this.matData.isEditMain;
            if (this.isAbleToLogin && !this.genericFormSubmittedId) {
                this.initializeUserForm();
            }
            if(this.allowAnnonymous)
            {
                this.getDataSubmittedUnAuth();
            }
            else{
            this.getDataSubmitted();
            }
            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        }
    }
    @ViewChild("formio") formio;
    @Output() submitFinished = new EventEmitter<any>();
    formId: string;
    selectedFormId: string;
    genericForm: GenericFormSubmitted;
    formSrc: string;
    isFormLoading = true;
    disableSubmit = false;
    formData: any = { data: {} };
    submittedData: any;
    formObject: any;
    submitTrigger: any;
    genericFormDetails: any;
    isAbleToLogin: boolean = false;
    updateForm: FormGroup;
    upsertUserData: UserModel;
    upsertUserDat: any;
    UpdateOperationInProgress$: Observable<boolean>;
    rolesDropDown: any[];
    genericFormSubmittedId: string;
    isAllowSpecialCharacterForLastName: boolean;
    isAllowSpecialCharacterForFirstName: boolean;
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    oldFormJson: string;
    allowAnnonymous:boolean =false;

    constructor(private dialogRef: MatDialogRef<GenericApplicationComponent>, @Inject(MAT_DIALOG_DATA) private data: DialogData,
        public dialog: MatDialog,
        private snackbar: MatSnackBar, private toastr: ToastrService, private translateService: TranslateService,
        private genericFormService: GenericFormService, private cdRef: ChangeDetectorRef,
        private userService: UserService, private roleManagementService: RoleManagementService) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getAllRoles();
        
        this.submitTrigger = new EventEmitter();
    }

    getDataSubmitted(){
        if (this.matData.application.genericFormSubmittedId) {
            const genericFormData = new GenericFormSubmitted();
            this.isFormLoading = true;
            genericFormData.genericFormSubmittedId = this.matData.application.genericFormSubmittedId;
            genericFormData.isArchived = false;
            this.genericFormService.getSubmittedReportByFormReportId(genericFormData).subscribe((responses: any) => {
                this.genericFormDetails = responses.data[0];
                const genericFormDetails = responses.data[0].formJson;
                 this.oldFormJson = responses.data[0].formJson;
                this.formData.data = JSON.parse(genericFormDetails);
                this.isFormLoading = false;
                this.cdRef.detectChanges();
            });
        }
    
    }

    getDataSubmittedUnAuth(){
        if (this.matData.application.genericFormSubmittedId) {
            const genericFormData = new GenericFormSubmitted();
            this.isFormLoading = true;
            genericFormData.genericFormSubmittedId = this.matData.application.genericFormSubmittedId;
            genericFormData.isArchived = false;
            this.genericFormService.getSubmittedReportByFormReportId(genericFormData).subscribe((responses: any) => {
                this.genericFormDetails = responses.data[0];
                const genericFormDetails = responses.data[0].formJson;
                 this.oldFormJson = responses.data[0].formJson;
                this.formData.data = JSON.parse(genericFormDetails);
                this.isFormLoading = false;
                this.cdRef.detectChanges();
            });
        }
    
    }
   
    initializeUserForm() {
        this.updateForm = new FormGroup({
            password: new FormControl('', Validators.compose([
                Validators.required,
                Validators.maxLength(20)])),
            firstName: new FormControl('', Validators.compose([
                Validators.required,
                Validators.maxLength(50)])
            ),
            surName: new FormControl('',
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)])
            ),
            email: new FormControl('',
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
                ])
            ),
            mobileNo: new FormControl('',
                Validators.compose([
                    Validators.maxLength(20)])
            ),
            roleIds: new FormControl('', [
            ]),
        })
    }

    submitTheForm() {
        this.submittedData = this.formio.formio.data;
        this.createAStatusReport();
    }

    onSubmit(data) {
        console.log(data);
        this.submitTheForm();
    }

    ngAfterViewInit() {
        // (document.querySelector(".mat-dialog-padding") as HTMLElement).parentElement.parentElement.style.padding = "0px";
    }

    onClose() {
        this.currentDialog.close();
        this.submitFinished.emit();
    }

    createAStatusReport() {
        this.disableSubmit = true;
        this.genericForm = new GenericFormSubmitted();
        this.genericForm.oldFormJson = this.oldFormJson;
        this.genericForm.formJson = JSON.stringify(this.submittedData);
        this.genericForm.customApplicationId = this.formId;
        this.genericForm.formId = this.selectedFormId;
        this.genericForm.isAbleToLogin = this.isAbleToLogin;
        this.genericForm.isApproved = this.isApproved;
        //this.genericForm.dataSourceId = this.dataSourceId;
        if (this.matData.application.genericFormSubmittedId) {
            this.genericForm.genericFormSubmittedId = this.matData.application.genericFormSubmittedId;
            this.genericForm.timeStamp = this.genericFormDetails.timeStamp;
        }

        if(this.allowAnnonymous)
        {
            this.genericFormService.submitGenericApplicationUnAuth(this.genericForm).subscribe((result: any) => {
                if (result.success == true) {
                    if (this.isAbleToLogin && !this.genericFormSubmittedId && this.updateForm.valid) {
                        this.updateUser();
                    }
                    this.disableSubmit = false;
                    // tslint:disable-next-line: max-line-lengthelse
                    this.snackbar.open(this.translateService.instant(ConstantVariables.SuccessMessageForFormSubmission), "Ok", { duration: 3000 });
                    this.formData = null;
                    this.onClose();
                    this.submitFinished.emit();
                }
                if (result.success == false) {
                    this.disableSubmit = false;
                    const validationMessage = result.apiResponseMessages[0].message;
                    this.toastr.error(validationMessage);
                }
            })
        }
       else{
        this.genericFormService.submitGenericApplication(this.genericForm).subscribe((result: any) => {
            if (result.success == true) {
                if (this.isAbleToLogin && !this.genericFormSubmittedId && this.updateForm.valid) {
                    this.updateUser();
                }
                this.disableSubmit = false;
                // tslint:disable-next-line: max-line-lengthelse
                this.snackbar.open(this.translateService.instant(ConstantVariables.SuccessMessageForFormSubmission), "Ok", { duration: 3000 });
                this.formData = null;
                this.onClose();
                this.submitFinished.emit();
            }
            if (result.success == false) {
                this.disableSubmit = false;
                const validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(validationMessage);
            }
        })
    }
    }

    getAllRoles() {
        this.roleManagementService.getAllRoles().subscribe((responseData: any) => {
            this.rolesDropDown = responseData.data;
        })
    }

    removeSpecialCharacterForFirstName() {
        if (this.updateForm.value.firstName) {
            const firstName = this.updateForm.value.firstName;
            const charCode = firstName.charCodeAt(0);
            if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode === 8 || charCode === 32 ||
                (charCode >= 48 && charCode <= 57)) {
                this.isAllowSpecialCharacterForFirstName = true;
                this.cdRef.detectChanges();
            } else {
                this.isAllowSpecialCharacterForFirstName = false;
                this.cdRef.detectChanges();
            }

        } else {
            this.isAllowSpecialCharacterForFirstName = true;
        }
    }

    removeSpecialCharacterForLastName() {
        if (this.updateForm.value.surName) {
            const surName = this.updateForm.value.surName;
            const charCode = surName.charCodeAt(0);
            if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode === 8 || charCode === 32 ||
                (charCode >= 48 && charCode <= 57)) {
                this.isAllowSpecialCharacterForLastName = true;
                this.cdRef.detectChanges();
            } else {
                this.isAllowSpecialCharacterForLastName = false;
                this.cdRef.detectChanges();
            }

        } else {
            this.isAllowSpecialCharacterForLastName = true;
        }
    }

    updateUser() {
        this.upsertUserData = this.updateForm.value;
        this.upsertUserData.isActive = true;
        this.upsertUserDat = this.upsertUserData;
        let roles = this.upsertUserDat.roleIds;
        const index2 = roles.indexOf(0);
        if (index2 > -1) {
            roles.splice(index2, 1)
        }
        this.upsertUserData.roleId = roles.toString();
        this.upsertUserData.isAdmin = false;
        this.userService
            .UpsertUser(this.upsertUserData)
            .subscribe((userId: any) => {
                if (userId.success === true) {

                }
            });

    }
}
