import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { AppsettingsModel } from '../../models/hr-models/appsetting-model';
import { MasterDataManagementService } from '../../services/master-data-management.service';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: 'app-fm-component-appsetting',
    templateUrl: `appsetting.component.html`
})

export class AppsettingsComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("appsettingsPopup") upsertAppsettingsPopover;
    @ViewChildren("deleteappsettingsPopup") deleteappsettingsPopup;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    isFiltersVisible: boolean;
    isAnyOperationIsInprogress: boolean = false;
    settings: AppsettingsModel[];
    isAppsettingsArchived: boolean;
    isArchived: boolean = false;
    validationMessage: string;
    timeStamp: any;
    searchText: string;
    temp: any;
    isThereAnError: boolean = false;
    appsettingsId: string;
    appsettingsName: string;
    appSettingsValue: string;
    isSystemLevel: boolean;
    appsettingModel: AppsettingsModel;
    appsettingForm: FormGroup;
    appsettings: string;

    constructor(private masterSettings: MasterDataManagementService,
        private snackbar: MatSnackBar, private translateService: TranslateService,
         private cdRef: ChangeDetectorRef) { super();
            
             }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllAppSettings();
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    getAllAppSettings() {
        this.isAnyOperationIsInprogress = true;
        var appsettingsModel = new AppsettingsModel();
        appsettingsModel.isArchived = this.isArchived;
        this.masterSettings.getAllAppSettings(appsettingsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.settings = response.data;
                this.settings.forEach((element) => {
                    if (element.isSystemLevel) {
                        element.dummyIsSystemLevel = "Yes"
                    }
                    else {
                        element.dummyIsSystemLevel = "No";
                    }
                })
                this.temp = this.settings;
                this.clearForm();
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


    clearForm() {
        this.appsettingsId = null;
        this.validationMessage = null;
        this.appsettingsName = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.appsettingModel = null;
        this.timeStamp = null;
        this.searchText = null;
        this.appsettingForm = new FormGroup({
            appsettingsName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            appSettingsValue: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            isSystemLevel: new FormControl(null, []
            ),
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

        const temp = this.temp.filter((settings => (settings.appsettingsName.toLowerCase().indexOf(this.searchText) > -1)
        || (settings.dummyIsSystemLevel && settings.dummyIsSystemLevel.toLowerCase().indexOf(this.searchText) > -1) 
        || (settings.appSettingsValue && settings.appSettingsValue.toLowerCase().indexOf(this.searchText) > -1)));
        this.settings = temp;
    }

    closeSearch() {
        this.searchText = ''
        this.filterByName(null);
    }


    createAppsettings(appsettingsPopup) {
        appsettingsPopup.openPopover();
        this.appsettings = this.translateService.instant('APPSETTINGS.ADDAPPSETTINGSTITLE');
    }

    closeUpsertAppsettingsPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm(); ``
        this.clearForm();
        this.upsertAppsettingsPopover.forEach((p) => p.closePopover());
    }

    upsertAppsettings(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let appsettings = new AppsettingsModel();
        appsettings = this.appsettingForm.getRawValue();
        appsettings.appSettingsId = this.appsettingsId;
        appsettings.timeStamp = this.timeStamp;
        this.masterSettings.upsertAppsettings(appsettings).subscribe((response: any) => {
            this.isAnyOperationIsInprogress = false;
            if (response.success == true) {
                this.upsertAppsettingsPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllAppSettings();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    editAppsettings(rowDetails, appsettingsPopup) {
        this.appsettingForm.patchValue(rowDetails);
        this.appsettingForm.get('appsettingsName').disable();
        if (rowDetails.isSystemLevel) {
            this.appsettingForm.get('appSettingsValue').disable();
            this.appsettingForm.get('isSystemLevel').disable();
        }
        else {
            this.appsettingForm.get('appSettingsValue').enable();
            this.appsettingForm.get('isSystemLevel').enable();
        }
        this.appsettingsId = rowDetails.appsettingsId;
        this.appsettingsName = rowDetails.appsettingsName;
        this.appsettings = this.translateService.instant('APPSETTINGS.EDITAPPSETTINGSTITLE');
        appsettingsPopup.openPopover();
        this.timeStamp = rowDetails.timeStamp;
    }

    closeDeleteAppsettingsPopup() {
        this.clearForm();
        this.deleteappsettingsPopup.forEach((p) => p.closePopover());
    }


    deleteAppsettingsPopUpOpen(row, deleteappsettingsPopup) {
        this.appsettingsId = row.appsettingsId;
        this.appsettingsName = row.appsettingsName;
        this.appSettingsValue = row.appSettingsValue;
        this.isSystemLevel = row.isSystemLevel;
        this.timeStamp = row.timeStamp;
        this.isAppsettingsArchived = !this.isArchived;
        deleteappsettingsPopup.openPopover();
    }

    deleteAppsettings() {
        this.isAnyOperationIsInprogress = true;
        let appsettings = new AppsettingsModel();
        appsettings.appSettingsId = this.appsettingsId;
        appsettings.appsettingsName = this.appsettingsName;
        appsettings.appSettingsValue = this.appSettingsValue;
        appsettings.timeStamp = this.timeStamp;
        appsettings.isSystemLevel = this.isSystemLevel;
        appsettings.isArchived = this.isAppsettingsArchived;
        this.masterSettings.upsertAppsettings(appsettings).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteappsettingsPopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllAppSettings();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    changeSystemLevel(event) {
        if (event.checked) {
            this.appsettingForm.get('appSettingsValue').disable();
        } else {
            this.appsettingForm.get('appSettingsValue').enable();
        }
    }
}