import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { HRManagementService } from '../../services/hr-management.service';
import { CountryModel } from '../../models/hr-models/country-model';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: "app-fm-component-country",
    templateUrl: `country.component.html`
})
export class CountryComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("upsertCountryPopUp") upsertCountryPopover;
    @ViewChildren("deleteCountryPopUp") deleteCountryPopover;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    isAnyOperationIsInprogress = false;
    countries: CountryModel[];
    temp: any;
    public isArchived = false;
    isThereAnError = false;
    validationMessage: string;
    countryId: string;
    countryForm: FormGroup;
    searchText: string;
    timeStamp: any;
    countryName: string;
    countryCode: any;
    isFiltersVisible: boolean;
    country: CountryModel;
    countryEdit: string;

    constructor(
        private translateService: TranslateService, private countryService: HRManagementService,
        public snackbar: MatSnackBar, private cdRef: ChangeDetectorRef) {
        super();
        
        
    }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getCountries();
    }

    getCountries() {
        this.isAnyOperationIsInprogress = true;
        const countryModel = new CountryModel();
        countryModel.isArchived = this.isArchived;
        this.countryService.getCountries(countryModel).subscribe((response: any) => {
            if (response.success === true) {
                this.countries = response.data;
                this.temp = this.countries;
                this.clearForm();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    clearForm() {
        this.countryId = null;
        this.countryName = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.timeStamp = null;
        this.countryCode = null;
        this.isAnyOperationIsInprogress = false;
        this.searchText = null;
        this.countryForm = new FormGroup({
            countryName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            countryCode: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.CountryCodeLength)
                ])
            )
        })
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }
        const temp = this.temp.filter(((country) =>
            (country.countryCode.toLowerCase().indexOf(this.searchText) > -1) || (country.countryName.toLowerCase().indexOf(this.searchText) > -1)));
        this.countries = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }

    createCountryPopupOpen(upsertCountryPopUp) {
        upsertCountryPopUp.openPopover();
        this.countryEdit = this.translateService.instant("COUNTRY.ADDCOUNTRYTITLE");
    }

    closeUpsertCountryPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertCountryPopover.forEach((p) => p.closePopover());
    }

    upsertCountry(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let countryModel = new CountryModel();
        countryModel = this.countryForm.value;
        countryModel.countryName = countryModel.countryName.toString().trim();
        countryModel.countryCode = countryModel.countryCode.toString().trim();
        countryModel.countryId = this.countryId;
        countryModel.timeStamp = this.timeStamp;
        this.countryService.upsertCountry(countryModel).subscribe((response: any) => {
            if (response.success === true) {
                this.upsertCountryPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getCountries();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    closeDeleteCountryDialog() {
        this.isThereAnError = false;
        this.deleteCountryPopover.forEach((p) => p.closePopover());
    }

    editCountryPopupOpen(row, upsertCountryPopUp) {
        this.countryForm.patchValue(row);
        this.countryCode = row.countryCode;
        this.countryId = row.countryId;
        this.countryName = row.countryName;
        this.timeStamp = row.timeStamp;
        this.countryEdit = this.translateService.instant("COUNTRY.EDITCOUNTRY");
        upsertCountryPopUp.openPopover();
    }

    deleteCountryPopUpOpen(row, deleteCountryPopUp) {
        this.countryId = row.countryId;
        this.countryName = row.countryName;
        this.timeStamp = row.timeStamp;
        this.countryCode = row.countryCode;
        deleteCountryPopUp.openPopover();
    }

    deleteCountry() {
        this.isAnyOperationIsInprogress = true;
        this.country = new CountryModel();
        this.country.countryId = this.countryId;
        this.country.countryCode = this.countryCode;
        this.country.countryName = this.countryName;
        this.country.timeStamp = this.timeStamp;
        this.country.isArchived = !this.isArchived;
        this.countryService.upsertCountry(this.country).subscribe((response: any) => {
            if (response.success === true) {
                this.deleteCountryPopover.forEach((p) => p.closePopover());
                this.isThereAnError = false;
                this.clearForm();
                this.getCountries();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }
    omit_special_char(event) {
      var inp = String.fromCharCode(event.keyCode);
      // Allow only alpahbets
      if (/[a-zA-Z]/.test(inp)) {
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }
}
