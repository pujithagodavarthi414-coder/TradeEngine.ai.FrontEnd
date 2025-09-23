import { Component, OnInit, ViewChildren, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { EmployeeTaxAllowanceDetailsModel } from '../models/EmployeeTaxAllowanceDetailsModel';
import { PayRollService } from '../services/PayRollService'
import * as moment_ from 'moment';
const moment = moment_;
import { TaxAllowanceModel } from '../models/TaxAllowanceModel';
import { Moment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { TranslateService } from '@ngx-translate/core';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { AppsettingsModel } from '../models/appsetting-model';
import { PayRollManagementState } from '../store/reducers/index';
import { GetReferenceIdOfFile } from '@snovasys/snova-file-uploader';
import { CdkFooterCell } from '@angular/cdk/table';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';

export const MY_FORMATS = {
    parse: {
        dateInput: 'YYYY',
    },
    display: {
        dateInput: 'YYYY',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};


@Component({
    selector: 'app-employeetaxallowancedetails',
    templateUrl: `employeetaxallowancedetails.component.html`,
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})

export class EmployeeTaxAllowanceDetailsComponent extends CustomAppBaseComponent implements OnInit {
    ownerPanNumber: string;
    isApproved: boolean;
    relatedToMetroCity: boolean;
    isPopupOpen: boolean = false;

    @Input("selectedEmployeeId")
    set selectedEmployeeId(data: string) {
        if (data != null && data !== undefined && this.employeeId !== data) {
            this.employeeId = data;
            this.getAllEmployeeTaxAllowanceDetails();
        }
    }

    @ViewChildren("upsertEmployeeTaxAllowanceDetailsPopUp") upsertEmployeeTaxAllowanceDetailsPopover;
    @ViewChildren("deleteEmployeeTaxAllowanceDetailsPopUp") deleteEmployeeTaxAllowanceDetailsPopover;
    @ViewChildren("approveEmployeeTaxAllowanceDetailsPopUp") approveEmployeeTaxAllowanceDetailsPopover;

    isFiltersVisible: boolean;
    isAnyOperationIsInprogress: boolean = false;
    temp: any;
    validationMessage: string;
    isArchived: boolean = false;
    isThereAnError: boolean = false;
    employeeId: string;
    timeStamp: any;
    searchText: string;
    employeeTaxAllowanceDetailsForm: FormGroup;
    employeeTaxAllowanceDetailsModel: EmployeeTaxAllowanceDetailsModel;
    isEmployeeTaxAllowanceDetailsArchived: boolean = false;
    isVariablePay: boolean;
    componentName: string;
    isArchivedTypes: boolean = false;
    isDeduction: boolean;
    employeeTaxAllowanceDetailsList: EmployeeTaxAllowanceDetailsModel[];
    employeeTaxAllowanceId: string;
    taxAllowanceId: string;
    isPercentage: boolean;
    investedAmount: number;
    isAutoApproved: boolean;
    isOnlyEmployee: boolean;
    relatedToEmployeeValue: number;
    taxAllowances: TaxAllowanceModel[];
    moduleTypeId = 12;
    referenceTypeId = ConstantVariables.EmployeeTaxAllowanceProofsReferenceTypeId;
    employeeTaxAllowanceReferenceId: string;
    selectedStoreId: null;
    selectedParentFolderId: null;
    fileTypes = 'image/*,application/*,text/*';
    isFileExist: boolean = false;
    employeeTaxAllowanceDetails: string;
    isRelatedToHRA: boolean;
    selectedYear: string;
    year: any = new Date().getFullYear();
    seeArchivedItems = this.translateService.instant('PAYROLLTEMPLATE.SEEARCHIVEDITEMS');
    seeUnArchivedItems = this.translateService.instant('PAYROLLTEMPLATE.SEEUNARCHIVEDITEMS');
    settings: AppsettingsModel[];
    appsettingsModelRecord: AppsettingsModel;
    maxRentalAmount: number = 0;
    maxEmployeeAmount: number = 0;
    isToUploadFiles: boolean = false;
    softLabels: SoftLabelConfigurationModel[];

    @ViewChild("formDirective") formDirective: FormGroupDirective;

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getSoftLabelConfigurations();
        this.getAllTaxAllowances();
        this.getRentalMaxExceedAmount();
        this.getOnlyEmployeeMaxExceedAmountAmount();
        this.getAllEmployeeTaxAllowanceDetails();

    }

    constructor(private payRollService: PayRollService,
        private cdRef: ChangeDetectorRef, private store: Store<PayRollManagementState>,
        private translateService: TranslateService) { super() }


    getSoftLabelConfigurations() {
        if (localStorage.getItem(LocalStorageProperties.SoftLabels)) {
            this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
        }
    }


    getAllEmployeeTaxAllowanceDetails() {
        this.isAnyOperationIsInprogress = true;
        var employeeTaxAllowanceDetailsModel = new EmployeeTaxAllowanceDetailsModel();
        employeeTaxAllowanceDetailsModel.isArchived = this.isArchivedTypes;
        employeeTaxAllowanceDetailsModel.employeeId = this.employeeId;
        this.payRollService.getAllEmployeeTaxAllowanceDetails(employeeTaxAllowanceDetailsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.employeeTaxAllowanceDetailsList = response.data;
                this.temp = this.employeeTaxAllowanceDetailsList;
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.cdRef.detectChanges();
            this.isAnyOperationIsInprogress = false;
        });
    }

    getAllTaxAllowances() {
        var taxAllowanceModel = new TaxAllowanceModel();
        taxAllowanceModel.isArchived = this.isArchivedTypes;
        taxAllowanceModel.isMainPage = false;
        taxAllowanceModel.employeeId = this.employeeId;
        this.payRollService.getAllTaxAllowances(taxAllowanceModel).subscribe((response: any) => {
            if (response.success == true) {
                this.taxAllowances = response.data;
                this.taxAllowances = this.taxAllowances.filter(taxAllowance => taxAllowance.parentId != null);
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    getRentalMaxExceedAmount() {
        this.isAnyOperationIsInprogress = true;
        var appsettingsModel = new AppsettingsModel();
        appsettingsModel.isArchived = this.isArchived;
        appsettingsModel.appsettingsName = "RentalMaxExceedAmount";

        this.payRollService.getAllAppSettings(appsettingsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.appsettingsModelRecord = response.data[0];
                if (this.appsettingsModelRecord)
                    this.maxRentalAmount = Number(this.appsettingsModelRecord.appSettingsValue);
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }


    getOnlyEmployeeMaxExceedAmountAmount() {
        this.isAnyOperationIsInprogress = true;
        var appsettingsModel = new AppsettingsModel();
        appsettingsModel.isArchived = this.isArchived;
        appsettingsModel.appsettingsName = "OnlyEmployeeMaxExceedAmount";

        this.payRollService.getAllAppSettings(appsettingsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.appsettingsModelRecord = response.data[0];
                if (this.appsettingsModelRecord)
                    this.maxEmployeeAmount = Number(this.appsettingsModelRecord.appSettingsValue);
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });
    }

    filesExist(event) {
        this.isFileExist = event;
        if (this.isFileExist = true) {
            this.validationMessage = null;
        }
    }

    closeFilePopup() {
        this.upsertEmployeeTaxAllowanceDetailsPopover.forEach((p) => p.closePopover());
        this.clearForm();
        this.formDirective.resetForm();
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    clearForm() {
        this.employeeTaxAllowanceId = null;
        this.taxAllowanceId = null
        this.investedAmount = null
        this.isAutoApproved = null
        this.isOnlyEmployee = null
        this.isFiltersVisible = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.searchText = null;
        this.isFileExist = null;
        this.isAnyOperationIsInprogress = false;
        this.isRelatedToHRA = false;
        this.relatedToMetroCity = false;
        this.employeeTaxAllowanceDetailsForm = new FormGroup({
            taxAllowanceId: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            investedAmount: new FormControl(null,
            ),
            isAutoApproved: new FormControl(null,
            ),
            relatedToEmployeeValue: new FormControl(null,
            ),
            comments: new FormControl(null,
            ),
            ownerPanNumber: new FormControl(null, []
            ),
            relatedToMetroCity: new FormControl(null, []
            )
        })
    }
    editEmployeeTaxAllowanceDetailsPopupOpen(row, upsertEmployeeTaxAllowanceDetailsPopUp) {
        this.isToUploadFiles = false;
        this.isPopupOpen = true;
        this.employeeTaxAllowanceDetailsForm.patchValue(row);
        if (row.isOnlyEmployee == true) {
            this.employeeTaxAllowanceDetailsForm.controls['relatedToEmployeeValue'].setValue('1');
        }
        else if (row.isRelatedToHRA == true) {
            this.employeeTaxAllowanceDetailsForm.controls['relatedToEmployeeValue'].setValue('2');
        }
        this.employeeTaxAllowanceId = row.employeeTaxAllowanceId;
        this.employeeTaxAllowanceReferenceId = row.employeeTaxAllowanceId;
        this.timeStamp = row.timeStamp;
        this.employeeTaxAllowanceDetails = 'EMPLOYEETAXALLOWANCEDETAILS.EDITEMPLOYEETAXALLOWANCEDETAILS';
        this.changeInvestedAmount('amount');
        upsertEmployeeTaxAllowanceDetailsPopUp.openPopover();
    }


    closeUpsertEmployeeTaxAllowanceDetailsPopup(formDirective: FormGroupDirective) {
        this.isPopupOpen = false;
        formDirective.resetForm();
        this.clearForm();
        this.upsertEmployeeTaxAllowanceDetailsPopover.forEach((p) => p.closePopover());
    }

    createEmployeeTaxAllowanceDetailsPopupOpen(upsertEmployeeTaxAllowanceDetailsPopUp) {
        this.isPopupOpen = true;
        this.isToUploadFiles = false;
        this.employeeTaxAllowanceReferenceId = null;
        this.cdRef.detectChanges();
        this.clearForm();
        upsertEmployeeTaxAllowanceDetailsPopUp.openPopover();
        this.employeeTaxAllowanceDetails = 'EMPLOYEETAXALLOWANCEDETAILS.ADDEMPLOYEETAXALLOWANCEDETAILS';
    }

    upsertEmployeeTaxAllowanceDetails(formDirective: FormGroupDirective) {
        this.isToUploadFiles = false;

        this.isAnyOperationIsInprogress = true;
        this.employeeTaxAllowanceDetailsModel = this.employeeTaxAllowanceDetailsForm.value;
        this.employeeTaxAllowanceDetailsModel.employeeId = this.employeeId;
        this.employeeTaxAllowanceDetailsModel.isFilesExist = this.isFileExist;

        if (this.employeeTaxAllowanceDetailsModel.relatedToEmployeeValue == 1) {
            this.employeeTaxAllowanceDetailsModel.isOnlyEmployee = true;
            this.employeeTaxAllowanceDetailsModel.isRelatedToHRA = false;
            this.employeeTaxAllowanceDetailsModel.relatedToMetroCity = false;
        }
        else if (this.employeeTaxAllowanceDetailsModel.relatedToEmployeeValue == 2) {
            this.employeeTaxAllowanceDetailsModel.isRelatedToHRA = true;
            this.employeeTaxAllowanceDetailsModel.isOnlyEmployee = false;
        }
        if (this.employeeTaxAllowanceId) {
            this.employeeTaxAllowanceDetailsModel.employeeTaxAllowanceId = this.employeeTaxAllowanceId;
            this.employeeTaxAllowanceDetailsModel.timeStamp = this.timeStamp;
        }
        this.payRollService.upsertEmployeeTaxAllowanceDetails(this.employeeTaxAllowanceDetailsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.employeeTaxAllowanceReferenceId = response.data;
                this.isToUploadFiles = true;
                this.cdRef.detectChanges();
                if (!this.isFileExist) {
                    this.upsertEmployeeTaxAllowanceDetailsPopover.forEach((p) => p.closePopover());
                    this.clearForm();
                    formDirective.resetForm();
                }
                this.getAllEmployeeTaxAllowanceDetails();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.isToUploadFiles = false;
            }
            this.cdRef.detectChanges();
        });
        this.isAnyOperationIsInprogress = false;
    }
    deleteEmployeeTaxAllowanceDetailsPopUpOpen(row, deleteEmployeeTaxAllowanceDetailsPopUp) {
        this.employeeTaxAllowanceDetailsModel = new EmployeeTaxAllowanceDetailsModel();
        this.employeeTaxAllowanceDetailsModel = row;
        this.isEmployeeTaxAllowanceDetailsArchived = !this.isArchivedTypes;
        this.employeeTaxAllowanceDetailsModel.isArchived = !this.isArchivedTypes;
        deleteEmployeeTaxAllowanceDetailsPopUp.openPopover();
    }


    approveEmployeeTaxAllowanceDetailsPopUpOpen(row, approveEmployeeTaxAllowanceDetailsPopUp) {
        this.employeeTaxAllowanceDetailsModel = new EmployeeTaxAllowanceDetailsModel();
        this.employeeTaxAllowanceDetailsModel = row;
        this.isApproved = !row.isApproved;
        this.employeeTaxAllowanceDetailsModel.IsApproved = !row.isApproved;
        approveEmployeeTaxAllowanceDetailsPopUp.openPopover();
    }

    deleteEmployeeTaxAllowanceDetails() {
        this.isAnyOperationIsInprogress = true;

        this.payRollService.upsertEmployeeTaxAllowanceDetails(this.employeeTaxAllowanceDetailsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteEmployeeTaxAllowanceDetailsPopover.forEach((p) => p.closePopover());
                this.approveEmployeeTaxAllowanceDetailsPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllEmployeeTaxAllowanceDetails();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    closeApproveEmployeeTaxAllowanceDialog() {
        this.isThereAnError = false;
        this.approveEmployeeTaxAllowanceDetailsPopover.forEach((p) => p.closePopover());
    }

    closeDeleteEmployeeTaxAllowanceDetailsDialog() {
        this.clearForm();
        this.deleteEmployeeTaxAllowanceDetailsPopover.forEach((p) => p.closePopover());
    }

    changeIsRelatedToHRA(event) {
        this.isRelatedToHRA = event.checked;
    }

    chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
        this.year = normalizedYear.toDate();
        this.selectedYear = moment(this.year).format("YYYY").toString();
        datepicker.close();
        this.filterByYear();
    }

    filterByYear() {
        const temp = this.temp.filter(employeeTaxAllowanceDetailsList =>
            (employeeTaxAllowanceDetailsList.submittedDate == null ? null : employeeTaxAllowanceDetailsList.submittedDate.toString().toLowerCase().indexOf(this.selectedYear) > -1)
        );

        this.employeeTaxAllowanceDetailsList = temp;
    }

    resetAllFilters() {
        this.year = null;
        this.selectedYear = "";
        this.filterByYear();
    }

    changeInvestedAmount(value) {
        if (this.employeeTaxAllowanceDetailsForm.get('investedAmount').value != null) {
            let investedAmount = this.employeeTaxAllowanceDetailsForm.get('investedAmount').value;

            if ((investedAmount > this.maxRentalAmount) && ((value == "amount" && this.employeeTaxAllowanceDetailsForm.get('relatedToEmployeeValue').value == 2) || value == "2")) {
                this.employeeTaxAllowanceDetailsForm.controls["ownerPanNumber"].setValidators(Validators.compose([
                    Validators.required,
                    Validators.pattern("^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$")
                ]));
                this.employeeTaxAllowanceDetailsForm.get("ownerPanNumber").updateValueAndValidity();
            }
            else {
                this.employeeTaxAllowanceDetailsForm.controls['ownerPanNumber'].setValue(null);
                this.employeeTaxAllowanceDetailsForm.controls["ownerPanNumber"].clearValidators();
                this.employeeTaxAllowanceDetailsForm.get("ownerPanNumber").updateValueAndValidity();
            }
        }
    }
} 