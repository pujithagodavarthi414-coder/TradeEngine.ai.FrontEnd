import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { HRManagementService } from '../../services/hr-management.service';
import { EmploymentStatusModel } from '../../models/hr-models/employment-status-model';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: 'app-fm-component-employment-status',
    templateUrl: `employment-status.component.html`
})

export class EmploymentStatusComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("deleteEmploymentStatusPopUp") deleteEmploymentStatusPopUp;
    @ViewChildren("upsertEmploymentStatusPopUp") upsertEmploymentStatusPopUp;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    isAnyOperationIsInprogress: boolean = false;
    isArchived: boolean = false;
    isFiltersVisible: boolean;
    isThereAnError: boolean;
    employmentStatuses: EmploymentStatusModel[];
    validationMessage: string;
    employmentStatusId: string;
    employmentStatusName: string;
    searchText: string;
    temp: any;
    employmentStatusModel: EmploymentStatusModel;
    employment: string;
    timeStamp: any;
    isPermanent: any;

    employmentStatusForm: FormGroup;

    constructor(public hrManagementService: HRManagementService,
        private translateService: TranslateService,
        private snackbar: MatSnackBar,private cdRef: ChangeDetectorRef) {super();
            
             }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllEmploymentStatuses();
    }

    getAllEmploymentStatuses() {
        this.isAnyOperationIsInprogress = true;
        let employmentStatusModel = new EmploymentStatusModel();
        employmentStatusModel.isArchived = this.isArchived;
        this.hrManagementService.getEmploymentStatuses(employmentStatusModel).subscribe((response: any) => {
            if (response.success == true) {
                this.employmentStatuses = response.data;
                this.temp = this.employmentStatuses;
                this.clearForm();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    createEmploymentStatusPopupOpen(upsertEmploymentStatusPopUp) {
        upsertEmploymentStatusPopUp.openPopover();
        this.employment = this.translateService.instant('EMPLOYMENTSTATUS.ADDEMPLOYMENTSTATUSTITLE');
    }

    editEmploymentStatusPopupOpen(row, upsertEmploymentStatusPopUp) {
        this.employmentStatusForm.patchValue(row);
        this.employmentStatusId = row.employmentStatusId;
        this.employment = this.translateService.instant('EMPLOYMENTSTATUS.EDITEMPLOYMENTSTATUSTITLE');
        this.timeStamp = row.timeStamp;
        this.isPermanent = row.isPermanent;
        upsertEmploymentStatusPopUp.openPopover();
    }

    deleteEmploymentStatusPopUpOpen(row, deleteEmploymentStatusPopUp) {
        this.employmentStatusId = row.employmentStatusId;
        this.employmentStatusName = row.employmentStatusName;
        this.timeStamp = row.timeStamp;
        this.isPermanent = row.isPermanent;
        deleteEmploymentStatusPopUp.openPopover();
    }

    closeUpsertEmploymentStatusPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertEmploymentStatusPopUp.forEach((p) => p.closePopover());
    }

    closeDeleteEmploymentStatusDialog() {
        this.clearForm();
        this.deleteEmploymentStatusPopUp.forEach((p) => p.closePopover());
    }

    upsertEmploymentStatus(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.employmentStatusModel = this.employmentStatusForm.value;
        this.employmentStatusModel.employmentStatusName = this.employmentStatusModel.employmentStatusName.trim();
        this.employmentStatusModel.employmentStatusId = this.employmentStatusId;
        this.employmentStatusModel.timeStamp = this.timeStamp;

        this.hrManagementService.upsertEmploymentStatus(this.employmentStatusModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertEmploymentStatusPopUp.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllEmploymentStatuses();
                this.cdRef.detectChanges();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    deleteEmploymentStatus() {
        this.isAnyOperationIsInprogress = true;

        this.employmentStatusModel = new EmploymentStatusModel();
        this.employmentStatusModel.employmentStatusId = this.employmentStatusId;
        this.employmentStatusModel.employmentStatusName = this.employmentStatusName;
        this.employmentStatusModel.timeStamp = this.timeStamp;
        this.employmentStatusModel.isArchived = !this.isArchived
        this.employmentStatusModel.isPermanent = this.isPermanent;

        this.hrManagementService.upsertEmploymentStatus(this.employmentStatusModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteEmploymentStatusPopUp.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllEmploymentStatuses();
                this.cdRef.detectChanges();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    clearForm() {
        this.isThereAnError = false;
        this.validationMessage = null;
        this.isAnyOperationIsInprogress = false;
        this.employmentStatusId = null;
        this.employmentStatusName = null;
        this.timeStamp = null;
        this.isPermanent = null;
        this.searchText = null;
        this.employmentStatusForm = new FormGroup({
            employmentStatusName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            isPermanent: new FormControl(null)
        })
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter((employmentStatus => (employmentStatus.employmentStatusName.toLowerCase().indexOf(this.searchText) > -1)));
        this.employmentStatuses = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
