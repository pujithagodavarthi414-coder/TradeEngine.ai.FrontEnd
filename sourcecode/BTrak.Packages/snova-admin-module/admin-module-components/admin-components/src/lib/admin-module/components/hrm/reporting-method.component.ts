import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { HRManagementService } from '../../services/hr-management.service';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { ReportingMethodModel } from '../../models/hr-models/reporting-method-model';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: "app-fm-component-reporting-method",
    templateUrl: `reporting-method.component.html`
})

export class ReportingMethodComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("deleteReportingMethodPopUp") deleteReportingMethodPopUp;
    @ViewChildren("upsertReportingMethodPopUp") upsertReportingMethodPopUp;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    isAnyOperationIsInprogress = false;
    isArchived = false;
    isFiltersVisible: boolean;
    isThereAnError: boolean;
    reportingMethods: ReportingMethodModel[];
    validationMessage: string;
    reportingMethodId: string;
    reportingMethodName: string;
    reportingMethod: ReportingMethodModel;
    timeStamp: any;
    temp: any;
    searchText: string;
    reportingEdit: string;
    reportingMethodForm: FormGroup;

    constructor(
        public hrManagementService: HRManagementService, private translateService: TranslateService,
        private snackbar: MatSnackBar,
        private cdRef: ChangeDetectorRef) { super();
            
             }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllReportingMethods();
    }

    getAllReportingMethods() {
        this.isAnyOperationIsInprogress = true;
        const reportingMethodModel = new ReportingMethodModel();
        reportingMethodModel.isArchived = this.isArchived;
        this.hrManagementService.getReportingMethods(reportingMethodModel).subscribe((response: any) => {
            if (response.success === true) {
                this.reportingMethods = response.data;
                this.temp = this.reportingMethods;
                this.clearForm();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    createReprotingMethodPopupOpen(upsertReportingMethodPopUp) {
        upsertReportingMethodPopUp.openPopover();
        this.reportingEdit = this.translateService.instant("REPORTINGMETHOD.ADDREPORTINGMETHODTITLE");
    }

    editReportingMethodPopupOpen(row, upsertReportingMethodPopUp) {
        this.reportingMethodForm.patchValue(row);
        this.reportingMethodId = row.reportingMethodId;
        this.timeStamp = row.timeStamp;
        this.reportingEdit = this.translateService.instant("REPORTINGMETHOD.EDITREPORTINGMETHODTITLE");
        upsertReportingMethodPopUp.openPopover();
    }

    deleteReportingMethodPopUpOpen(row, deleteReportingMethodPopUp) {
        this.reportingMethodId = row.reportingMethodId;
        this.reportingMethodName = row.reportingMethodName;
        this.timeStamp = row.timeStamp;
        deleteReportingMethodPopUp.openPopover();
    }

    closeUpsertReportingMethodPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertReportingMethodPopUp.forEach((p) => p.closePopover());
    }

    closeDeleteReportingMethodDialog() {
        this.clearForm();
        this.deleteReportingMethodPopUp.forEach((p) => p.closePopover());
    }

    upsertReportingMethod(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.reportingMethod = this.reportingMethodForm.value;
        this.reportingMethod.reportingMethodName = this.reportingMethod.reportingMethodName.trim();
        this.reportingMethod.reportingMethodId = this.reportingMethodId;
        this.reportingMethod.timeStamp = this.timeStamp;
        this.hrManagementService.upsertReportingMethod(this.reportingMethod).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertReportingMethodPopUp.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllReportingMethods();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    deleteReportingMethod() {
        this.isAnyOperationIsInprogress = true;
        this.reportingMethod = new ReportingMethodModel();
        this.reportingMethod.reportingMethodId = this.reportingMethodId;
        this.reportingMethod.reportingMethodName = this.reportingMethodName;
        this.reportingMethod.timeStamp = this.timeStamp;
        this.reportingMethod.isArchived = !this.isArchived
        this.hrManagementService.upsertReportingMethod(this.reportingMethod).subscribe((response: any) => {
            if (response.success === true) {
                this.deleteReportingMethodPopUp.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllReportingMethods();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    clearForm() {
        this.isThereAnError = false;
        this.validationMessage = null;
        this.isAnyOperationIsInprogress = false;
        this.reportingMethodId = null;
        this.reportingMethodName = null;
        this.timeStamp = null;
        this.searchText = null;
        this.reportingMethodForm = new FormGroup({
            reportingMethodName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            )
        })
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter((reporting) => reporting.reportingMethodName.toLowerCase().indexOf(this.searchText) > -1);
        this.reportingMethods = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
