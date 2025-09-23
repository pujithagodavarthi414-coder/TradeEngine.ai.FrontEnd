import { Component, Input, ViewChild, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { Observable } from "rxjs";
import { EmployeeAccountDetailsModel } from "../models/employeeaccountdetailsmodel";
import { Router } from "@angular/router";
import { PayRollService } from "../services/PayRollService";
import { ToastrService } from "ngx-toastr";
import { CookieService } from "ngx-cookie-service";
import { UserModel } from '../models/user';
import * as $_ from 'jquery';
const $ = $_;

@Component({
    selector: "app-hr-employeeacountdetails",
    templateUrl: "employeeaccountdetails.component.html"
})

export class EmployeeAccountDetailsComponent extends CustomAppBaseComponent {
    @ViewChild("formDirective") formDirective: FormGroupDirective;

    @Input("selectedEmployeeId")
    set selectedEmployeeId(data: string) {
        if (data != null && data !== undefined && this.employeeId !== data) {
            this.employeeId = data;
            this.getAllEmployeeAccountDetails();
        }
    }

    @Input("isPermission")
    set isPermission(data: boolean) {
        this.permission = data;
    }

    employeeAccountDetailsForm: FormGroup;
    employeeId: string;
    selectedCountryId: string = "";
    selectedStateId: string = "";
    isThereAnError: boolean;
    isView: boolean = true;
    isForm: boolean = false;
    isData: boolean = true;
    isNoData: boolean = false;
    permission: boolean = false;
    employeeAccountDetailsModel: EmployeeAccountDetailsModel;
    selectedEmployeeAccountDetailsData: EmployeeAccountDetailsModel;
    isAnyOperationIsInprogress: boolean = false;
    validationMessage: string;
    selectedUserId: string;
    userData$: Observable<UserModel>;

    constructor(private payRollService: PayRollService, private toastr: ToastrService,
        private cdRef: ChangeDetectorRef, private router: Router, private cookieService: CookieService) {
        super()
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getAllEmployeeAccountDetails();
        this.selectedEmployeeAccountDetailsData = null;
    }

    getAllEmployeeAccountDetails() {
        this.isNoData = false;
        this.isAnyOperationIsInprogress = true;
        var employeeAccountDetailsModel = new EmployeeAccountDetailsModel();

        employeeAccountDetailsModel.employeeId = this.employeeId;
        this.payRollService.getAllEmployeeAccountDetails(employeeAccountDetailsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.selectedEmployeeAccountDetailsData = response.data[0];
                if (this.selectedEmployeeAccountDetailsData) {
                    this.employeeAccountDetailsForm.patchValue(this.selectedEmployeeAccountDetailsData);
                }
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.isData = false;
            if (response.data[0] == null || response.data[0] == []) {
                this.isNoData = true
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    enableDisableForm() {
        this.isForm = true;
        this.isView = false;
    }

    clearForm() {
        this.employeeAccountDetailsForm = new FormGroup({
            pfNumber: new FormControl("", []
            ),
            uanNumber: new FormControl("", []
            ),
            esiNumber: new FormControl("", []
            ),
            panNumber: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.pattern("^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$")
                ])
            )
        })
    }


    saveEmployeeAccountDetails() {
        this.isAnyOperationIsInprogress = true;
        this.employeeAccountDetailsModel = this.employeeAccountDetailsForm.value;
        this.employeeAccountDetailsModel.employeeId = this.employeeId;
        if (this.selectedEmployeeAccountDetailsData) {
            this.employeeAccountDetailsModel.employeeAccountDetailsId = this.selectedEmployeeAccountDetailsData.employeeAccountDetailsId;
            this.employeeAccountDetailsModel.timeStamp = this.selectedEmployeeAccountDetailsData.timeStamp;
        }
        this.payRollService.upsertEmployeeAccountDetails(this.employeeAccountDetailsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.isForm = false;
                this.isView = true;
                this.getAllEmployeeAccountDetails();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    close(value) {
        this.formDirective.resetForm();
        if (this.selectedEmployeeAccountDetailsData) {
            this.employeeAccountDetailsForm.patchValue(this.selectedEmployeeAccountDetailsData);
        } else {
            this.employeeAccountDetailsForm.reset();
        }
        if (value == 'cancel') {
            this.isView = true;
            this.isForm = false;
        }
    }

    fitContent(optionalParameters: any) {
        if(optionalParameters['gridsterView']) {
            $(optionalParameters['gridsterViewSelector'] + ' .account-details-form').height($(optionalParameters['gridsterViewSelector']).height() - 90);
        }
    }
}
