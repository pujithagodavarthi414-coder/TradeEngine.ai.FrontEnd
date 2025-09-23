import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { HRManagementService } from '../../services/hr-management.service';
import { LicenseTypeModel } from '../../models/hr-models/licenseTypeModel';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: "app-fm-component-license-type",
    templateUrl: `license-type.component.html`
})
export class LicenseTypeComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("deleteLicenseTypePopUp") deleteLicenseTypePopover;
    @ViewChildren("upsertLicenseTypePopUp") upsertLicenseTypePopover;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    licenceTypeForm: FormGroup;
    isFiltersVisible = false;
    isArchivedTypes = false;
    isLicenseTypeArchived: boolean;
    isThereAnError = false;
    licenceTypeId: string;
    licenceTypeName: string;
    validationMessage: string;
    searchText: string;
    temp: any;
    licenceType: LicenseTypeModel;
    isAnyOperationIsInprogress = false;
    licenceTypes: LicenseTypeModel[];
    timeStamp: any;
    licence: string;
    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllLicenseTypes();
    }
    constructor(
        private cdRef: ChangeDetectorRef,
        private translateService: TranslateService,
        private hrManagementService: HRManagementService, private snackbar: MatSnackBar) {
        super();
        
        
    }

    getAllLicenseTypes() {
        this.isAnyOperationIsInprogress = true;
        const licenseTypeModel = new LicenseTypeModel();
        licenseTypeModel.isArchived = this.isArchivedTypes;
        this.hrManagementService.getAllLicenseTypes(licenseTypeModel).subscribe((response: any) => {
            if (response.success === true) {
                this.licenceTypes = response.data;
                this.temp = this.licenceTypes;
                this.clearForm();
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });

    }

    deleteLicenseTypePopUpOpen(row, deleteLicenseTypePopUp) {
        this.licenceTypeId = row.licenceTypeId;
        this.licenceTypeName = row.licenceTypeName;
        this.isLicenseTypeArchived = !row.isArchived;
        this.timeStamp = row.timeStamp;
        deleteLicenseTypePopUp.openPopover();
    }

    closeDeleteLicenseTypeDialog() {
        this.clearForm();
        this.deleteLicenseTypePopover.forEach((p) => p.closePopover());
    }

    upsertLicenseType(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.licenceType = this.licenceTypeForm.value;
        this.licenceType.licenceTypeName = this.licenceType.licenceTypeName.trim();
        this.licenceType.licenceTypeId = this.licenceTypeId;
        this.licenceType.timeStamp = this.timeStamp;
        this.hrManagementService.upsertLicenseType(this.licenceType).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertLicenseTypePopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllLicenseTypes();

            } else {
                this.isThereAnError = true;
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.cdRef.detectChanges();
        });
    }

    deleteLicenseType() {
        this.isAnyOperationIsInprogress = true;
        this.licenceType = new LicenseTypeModel();
        this.licenceType.licenceTypeId = this.licenceTypeId;
        this.licenceType.licenceTypeName = this.licenceTypeName;
        this.licenceType.timeStamp = this.timeStamp;
        this.licenceType.isArchived = this.isLicenseTypeArchived;
        this.hrManagementService.upsertLicenseType(this.licenceType).subscribe((response: any) => {
            if (response.success === true) {
                this.deleteLicenseTypePopover.forEach((p) => p.closePopover());
                this.isThereAnError = false;
                this.clearForm();
                this.getAllLicenseTypes();
            } else {
                this.isThereAnError = true;
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
            this.cdRef.detectChanges();
        });

    }

    editLicenseType(row, upsertLicenseTypePopUp) {
        this.licenceTypeForm.patchValue(row);
        this.licenceTypeId = row.licenceTypeId;
        this.timeStamp = row.timeStamp;
        this.licence = this.translateService.instant("LICENSETYPE.EDITLICENSETYPE");
        upsertLicenseTypePopUp.openPopover();
    }

    createLicenseType(upsertLicenseTypePopUp) {
        upsertLicenseTypePopUp.openPopover();
        this.licence = this.translateService.instant("LICENSETYPE.ADDLICENCETITLE");
    }
    closeUpsertLicenseTypePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertLicenseTypePopover.forEach((p) => p.closePopover());
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    clearForm() {
        this.licenceType = null;
        this.licenceTypeId = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.isAnyOperationIsInprogress = false;
        this.searchText = null;
        this.licenceTypeForm = new FormGroup({
            licenceTypeName: new FormControl(null,
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

        const temp = this.temp.filter(((licenceType) => (licenceType.licenceTypeName.toLowerCase().indexOf(this.searchText) > -1)));
        this.licenceTypes = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
