import { Component, OnInit, Input, Inject, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, TemplateRef } from "@angular/core";
import {  MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { MatSnackBar} from "@angular/material/snack-bar";
import { FormControl, Validators } from "@angular/forms";
import { CreateGenericForm } from "../models/createGenericForm";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { ConstantVariables } from '../../../../globaldependencies/constants/constant-variables';
import { CustomAppBaseComponent } from "../../../../globaldependencies/components/componentbase";
import { TranslateService } from "@ngx-translate/core";
import { RoleModel } from "../../../models/role.model";
import * as formUtils from 'formiojs/utils/formUtils.js';
import { DashboardFilterModel } from "../../../models/dashboard-filter.model";
import { GenericFormService } from '../services/generic-form.service';

const msg = ConstantVariables.FormNameMaxLength100;

@Component({
    selector: "app-form-creator",
    templateUrl: "./form-creator.component.html",
})
export class FormCreatorComponent extends CustomAppBaseComponent implements OnInit {
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }
    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            this.isFromModal = this.matData.isFromModal;
            this.editFormId = this.matData.formId;
            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        }
    }

    @ViewChild("formTypeDialogComponent") formTypeDialogComponent: TemplateRef<any>;

    matData: any;
    isFromModal: boolean = false;
    dashboardFilters: DashboardFilterModel;
    formObject: any;
    formName: string = "";
    workflowTrigger: string = "";
    formTypes: any;
    selectedFormType: any;
    timeStamp: any;
    isFormEdit: boolean = false;
    isFormCompleted: boolean = false;
    msgConst = msg;
    currentDialogId: any;

    public basicForm = { components: [] };

    public defaultForm = {
        components: [
            {
                input: true,
                tableView: true,
                inputType: "text",
                inputMask: "",
                label: "Text Field",
                key: "textField",
                placeholder: "",
                prefix: "",
                suffix: "",
                multiple: false,
                defaultValue: "",
                protected: false,
                unique: false,
                persistent: true,
                validate: {
                    required: false,
                    minLength: "",
                    maxLength: "",
                    pattern: "",
                    custom: "",
                    customPrivate: false
                },
                conditional: {
                    show: false,
                    when: null,
                    eq: ""
                },
                type: "textfield",
                $$hashKey: "object:249",
                autofocus: false,
                hidden: false,
                clearOnHide: true,
                spellcheck: true
            }
        ]
    };
    selectedType = new FormControl("", [Validators.required]);
    nameFormControl = new FormControl("", [
        Validators.required,
        Validators.maxLength(100)
    ]);
    isAbleToLogin = new FormControl("", []);
    workflowTriggerField = new FormControl("", []);
    createGenericForm: CreateGenericForm;
    genericFormListDetails: any;
    formButtonDisable: boolean = false;
    editFormId: any;
    forms = { components: [] };
    formFromMyProfile: any;
    currentDialog: any;

    rolesList: RoleModel[];

    constructor(
        public formCreateDialog: MatDialogRef<FormCreatorComponent>,
        public dialog: MatDialog,
        private genericFormService: GenericFormService,
        private snackbar: MatSnackBar,
        private toastr: ToastrService,
        private route: Router,
        private translateService: TranslateService,
        private activatedRoute: ActivatedRoute,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        super();
        this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        // if (data) {
        //     this.isFromModal = data.isFromModal;
        //     this.editFormId = data.formId;
        // }
    }

    ngOnInit() {
        super.ngOnInit();
        this.activatedRoute.params.subscribe(routeParams => {
            this.createGenericForm = new CreateGenericForm();
            this.createGenericForm.Id = this.editFormId ? this.editFormId : routeParams.id;
            this.formFromMyProfile = routeParams.profile;
            this.editFormId = this.editFormId ? this.editFormId : routeParams.id;
            this.formObject = Object.assign({}, this.basicForm);
            this.genericFormService.GetFormTypes().subscribe((response: any) => {
                this.formTypes = response.data;
            });
            if (this.createGenericForm.Id) {
                this.isFormEdit = true;
                this.genericFormService
                    .GetGenericForms(this.createGenericForm)
                    .subscribe((result: any) => {
                        console.log(result);
                        this.genericFormListDetails = result.data;
                        this.selectedFormType = this.genericFormListDetails[0].formTypeId;
                        this.formName = this.genericFormListDetails[0].formName;
                        this.workflowTrigger = this.genericFormListDetails[0].workflowTrigger;
                        this.timeStamp = this.genericFormListDetails[0].timeStamp;
                        this.isAbleToLogin.setValue(this.genericFormListDetails[0].isAbleToLogin);
                        this.formObject = JSON.parse(this.genericFormListDetails[0].formJson);
                    });
            }
        });
    }

    onNoClick() {
        this.currentDialog.close();
    }

    onSubmit(event) {
        console.log(event);
    }

    createFormType() {
        let dialogId = "create-form-type-dialog-component";
        const dialogRef = this.dialog.open(this.formTypeDialogComponent, {
            minWidth: "85vw",
            minHeight: "85vh",
            height: "70%",
            id: dialogId,
            data: { formPhysicalId: dialogId }
        });

        dialogRef.afterClosed().subscribe(() => {
            this.genericFormService.GetFormTypes().subscribe((response: any) => {
                this.formTypes = response.data;
            });
        });
    }

    onChange(event) {
        if (event.form != undefined) this.formObject = event.form;
    }

    checkDisable() {
        if (this.formButtonDisable == true) return true;
        if (this.selectedFormType && this.formName && this.formName.length <= 100)
            return false;
        else return true;
    }

    createAGenericForm() {
        this.formButtonDisable = true;
        this.createGenericForm = new CreateGenericForm();
        if (this.editFormId) {
            this.createGenericForm.Id = this.editFormId;
            this.createGenericForm.TimeStamp = this.timeStamp;
        }
        this.createGenericForm.FormTypeId = this.selectedFormType;
        this.createGenericForm.formName = this.formName;
        this.createGenericForm.workflowTrigger = this.workflowTrigger;
        this.createGenericForm.isAbleToLogin = this.isAbleToLogin.value;

        var formKeys = [];
        formUtils.eachComponent(this.formObject.components, function (component) {
            formKeys.push({ key: component.key, label: component.label,type: component.type });
        }, false);

        this.createGenericForm.formJson = JSON.stringify(this.formObject);
        this.createGenericForm.formKeys = JSON.stringify(formKeys);
        this.genericFormService
            .UpsertGenericForm(this.createGenericForm)
            .subscribe((response: any) => {
                if (response.success == true) {
                    if (this.isFormEdit == true)
                        this.snackbar.open(this.translateService.instant(ConstantVariables.FormUpdationMessage), "ok", {
                            duration: 3000
                        });
                    else
                        this.snackbar.open(this.translateService.instant(ConstantVariables.FormCreationMessage), "ok", {
                            duration: 3000
                        });
                    this.selectedType = new FormControl("", [Validators.required]);
                    this.nameFormControl = new FormControl("", [
                        Validators.required,
                        Validators.maxLength(100)
                    ]);
                    this.isAbleToLogin = new FormControl("", []);
                    this.forms = { components: [] };
                    // this.forms.components.push(this.basicForm.components[0]);
                    this.formButtonDisable = false;
                    this.selectedFormType = null;
                    this.formName = null;
                    this.workflowTrigger = null;
                    this.timeStamp = null;
                    this.isFormCompleted = true;
                    this.formObject = Object.assign({}, this.basicForm);
                    this.editFormId = null;
                    if (!this.isFromModal) {
                        if (this.formFromMyProfile == true)
                            this.route.navigate(["/applications/create-form"]);
                        if (this.isFormEdit == true) {
                            this.isFormEdit = false;
                            this.route.navigate(["/applications/view-forms"]);
                        } else this.route.navigate(["/applications/create-form"]);
                    } else {
                        this.currentDialog.close();
                    }


                }
                if (response.success == false) {
                    this.formButtonDisable = false;
                    var validationmessage = response.apiResponseMessages[0].message;
                    this.toastr.error(validationmessage);
                }
            });
    }
    formSubmitted(){
        if (!this.isFromModal) {
            if (this.formFromMyProfile == true)
                this.route.navigate(["/applications/create-form"]);
            if (this.isFormEdit == true) {
                this.isFormEdit = false;
                this.route.navigate(["/applications/view-forms"]);
            } else this.route.navigate(["/applications/create-form"]);
        } else {
            this.currentDialog.close();
        }
    }
}
