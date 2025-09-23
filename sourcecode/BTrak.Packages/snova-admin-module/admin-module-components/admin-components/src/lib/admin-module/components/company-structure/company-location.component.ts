import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { CompanyLocationModel } from '../../models/company-location-model';
import { CompanyManagementService } from '../../services/company-management.service';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: 'app-fm-component-company-location',
    templateUrl: `company-location.component.html`
})

export class CompanyLocationComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("deleteCompanyLocationPopUp") deleteCompanyLocationPopover;
    @ViewChildren("upsertCompanyLocationPopUp") upsertCompanyLocationPopover;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    isAnyOperationIsInprogress: boolean = false;
    isArchivedLocations: boolean = false;
    isFiltersVisible: boolean;
    isThereAnError: boolean;
    companyLocationDetails: CompanyLocationModel[];
    companyLocationId: string;
    validationMessage: string;
    locationName: string;
    latitude: string;
    longitude: string;
    address: string;
    timeStamp: any;
    temp: any;
    searchText: string;
    companyLocationForm: FormGroup;
    companyLocationModel: CompanyLocationModel;
    companyLocationEdit: string;

    constructor(private cdRef: ChangeDetectorRef, private translateService: TranslateService,
        private companyManagementService: CompanyManagementService, private snackbar: MatSnackBar) {
            super();
        
        
    }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getCompanyLocations();
    }

    getCompanyLocations() {
        this.isAnyOperationIsInprogress = true;

        var companyLocationsModel = new CompanyLocationModel();
        companyLocationsModel.isArchived = this.isArchivedLocations;

        this.companyManagementService.getAllCompanyLocations(companyLocationsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.companyLocationDetails = response.data;
                this.temp = this.companyLocationDetails;
                this.clearForm();
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    deleteCompanyLocationPopUpOpen(row, deleteCompanyLocationPopUp) {
        this.companyLocationId = row.companyLocationId;
        this.locationName = row.locationName;
        this.latitude = row.latitude;
        this.longitude = row.longitude;
        this.address = row.address;
        this.timeStamp = row.timeStamp;
        deleteCompanyLocationPopUp.openPopover();
    }

    closeDeleteCompanyLocationPopUp() {
        this.clearForm();
        this.deleteCompanyLocationPopover.forEach((p) => p.closePopover());
    }

    deleteCompanyLocation() {
        this.isAnyOperationIsInprogress = true;

        this.companyLocationModel = new CompanyLocationModel();
        this.companyLocationModel.companyLocationId = this.companyLocationId;
        this.companyLocationModel.locationName = this.locationName;
        this.companyLocationModel.latitude = this.latitude;
        this.companyLocationModel.longitude = this.longitude;
        this.companyLocationModel.address = this.address;
        this.companyLocationModel.timeStamp = this.timeStamp;
        this.companyLocationModel.isArchived = !this.isArchivedLocations;

        this.companyManagementService.upsertCompanyLocation(this.companyLocationModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteCompanyLocationPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getCompanyLocations();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    editCompanyLocationPopupOpen(row, upsertCompanyLocationPopUp) {
        this.companyLocationForm.patchValue(row);
        this.companyLocationId = row.companyLocationId;
        this.timeStamp = row.timeStamp;
        this.companyLocationEdit = this.translateService.instant('COMPANYLOCATION.EDITCOMPANYLOCATION');
        upsertCompanyLocationPopUp.openPopover();
    }

    closeUpsertCompanyLocationPopup(formDirective: FormGroupDirective) {
        this.clearForm();
        formDirective.resetForm();
        this.upsertCompanyLocationPopover.forEach((p) => p.closePopover());
    }

    upsertCompanyLocation(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;

        this.companyLocationModel = this.companyLocationForm.value;
        this.companyLocationModel.companyLocationId = this.companyLocationId;
        this.companyLocationModel.locationName = this.companyLocationModel.locationName.trim();
        this.companyLocationModel.address = this.companyLocationModel.address.trim();
        this.companyLocationModel.timeStamp = this.timeStamp;

        this.companyManagementService.upsertCompanyLocation(this.companyLocationModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertCompanyLocationPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getCompanyLocations();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    createCompanyLocationPopupOpen(upsertCompanyLocationPopUp) {
        this.clearForm();
        this.companyLocationEdit = this.translateService.instant('COMPANYLOCATION.ADDCOMPANYLOCATION');
        upsertCompanyLocationPopUp.openPopover();
    }

    clearForm() {
        this.companyLocationId = null;
        this.locationName = null;
        this.address = null;
        this.latitude = null;
        this.longitude = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.isAnyOperationIsInprogress = false;
        this.searchText = null;
        this.companyLocationForm = new FormGroup({
            locationName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            address: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(250)
                ])
            ),
            latitude: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            longitude: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
        })
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
            return false;
        }
        this.isThereAnError = false;
        return true;

    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter(company => (company.locationName.toLowerCase().indexOf(this.searchText) > -1)
            || (company.address.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (company.latitude.toString().indexOf(this.searchText) > -1)
            || (company.longitude.toString().indexOf(this.searchText) > -1));
        this.companyLocationDetails = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
