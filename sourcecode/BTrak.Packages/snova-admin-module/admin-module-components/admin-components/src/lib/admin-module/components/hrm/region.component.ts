import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { HRManagementService } from '../../services/hr-management.service';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { RegionsModel } from '../../models/hr-models/region-model';
import { CountryModel } from '../../models/hr-models/country-model';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: 'app-fm-component-region',
    templateUrl: `region.component.html`

})

export class RegionComponent extends CustomAppBaseComponent implements OnInit {
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    @ViewChildren("upsertRegionPopUp") upsertRegionPopover;
    @ViewChildren("deleteRegionPopUp") deleteRegionPopover;
    public isArchived: boolean = false;
    isAnyOperationIsInprogress: boolean = false;
    isThereAnError: boolean = false;
    validationMessage: string;
    region: RegionsModel;
    regions: RegionsModel[];
    regionForm: FormGroup;
    regionId: string;
    timeStamp: any;
    isFiltersVisible: boolean;
    regionName: string;
    countryId: string;
    countries: string;
    temp: any;
    searchText: string;
    regionEdit: string;

    constructor(private translateService: TranslateService,private regionService: HRManagementService, public snackbar: MatSnackBar, private cdRef: ChangeDetectorRef) { super();
        
         }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllRegions();
        this.getAllCountries();
    }


    getAllRegions() {
        this.isAnyOperationIsInprogress = true;

        var regionModel = new RegionsModel();
        regionModel.isArchived = this.isArchived;
        this.regionService.getRegions(regionModel).subscribe((response: any) => {
            if (response.success == true) {
                this.regions = response.data;
                this.temp = this.regions;
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

    upsertRegion(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.region = this.regionForm.value;
        this.region.regionName = this.region.regionName.trim();
        this.region.regionId = this.regionId;
        this.region.timeStamp = this.timeStamp;

        this.regionService.upsertRegions(this.region).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertRegionPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllRegions();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    deleteRegion() {
        this.isAnyOperationIsInprogress = true;

        this.region = new RegionsModel();
        this.region.regionId = this.regionId;
        this.region.regionName = this.regionName;
        this.region.timeStamp = this.timeStamp;
        this.region.countryId = this.countryId;
        this.region.isArchived = !this.isArchived

        this.regionService.upsertRegions(this.region).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteRegionPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllRegions();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    getAllCountries() {
        this.regionService.getCountries(new CountryModel()).subscribe((responseData: any) => {
            this.countries = responseData.data;
        });
    }

    createRegionPopupOpen(upsertRegionPopUp) {
        upsertRegionPopUp.openPopover();
        this.regionEdit = this.translateService.instant('REGION.ADDREGION');
    }

    closeUpsertRegionPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertRegionPopover.forEach((p) => p.closePopover());
    }

    deleteRegionPopUpOpen(row, deleteRegionPopUp) {
        this.regionId = row.regionId;
        this.regionName = row.regionName;
        this.countryId = row.countryId;
        this.timeStamp = row.timeStamp;
        deleteRegionPopUp.openPopover();
    }

    closeDeletePayGradeDialog() {
        this.isThereAnError = false;
        this.deleteRegionPopover.forEach((p) => p.closePopover());
    }

    editregionPopupOpen(row, upsertRegionPopUp) {
        this.regionForm.patchValue(row);
        this.regionId = row.regionId;
        this.countryId = row.countryId;
        this.regionName = row.branchName;
        this.timeStamp = row.timeStamp;
        this.regionEdit = this.translateService.instant('REGION.EDITREGION');
        upsertRegionPopUp.openPopover();
    }

    clearForm() {
        this.regionId = null;
        this.region = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.timeStamp = null;
        this.regionId = null;
        this.searchText = null;
        this.isAnyOperationIsInprogress = false;
        this.regionForm = new FormGroup({
            regionName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            countryId: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
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
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter(region => (region.regionName.toLowerCase().indexOf(this.searchText) > -1)
            || (region.countryName.toString().toLowerCase().indexOf(this.searchText) > -1));
        this.regions = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
