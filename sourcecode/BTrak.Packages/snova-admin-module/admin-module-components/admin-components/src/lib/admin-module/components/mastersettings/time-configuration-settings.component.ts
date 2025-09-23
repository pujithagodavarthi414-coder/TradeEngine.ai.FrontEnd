import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { ToastrService } from 'ngx-toastr';
import { TimeConfiguration } from '../../models/hr-models/time-configuration-model';
import { CompanysettingsModel } from '../../models/company-model';
import { MasterDataManagementService } from '../../services/master-data-management.service';
import { ConstantVariables } from '../../helpers/constant-variables';
import { SoftLabelConfigurationModel } from '../../models/hr-models/softlabels-model';

@Component({
    selector: 'app-fm-component-time-configuration-settings',
    templateUrl: `time-configuration-settings.component.html`
})

export class TimeConfigurationSettingsComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("configurationEditPopover") configurationEditsPopover;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }
    companySettingsModel: any[];
    dashboardFilters: DashboardFilterModel;
    configurationForm: FormGroup;
    configurations: any;
    filterConfigurations: any;
    timeStamp: any;
    configurationId: string;
    configurationName: string;
    searchText: string;
    validationMessage: string;
    isTestTrailEnable: boolean = true;
    isFiltersVisible: boolean;
    isArchivedTypes: boolean = false;
    isThereAnError: boolean = false;
    isAnyOperationIsInprogress: boolean = false;
    softLabels: SoftLabelConfigurationModel[];

    constructor(private masterSettings: MasterDataManagementService,
        private snackbar: MatSnackBar, private translateService: TranslateService, private toastr: ToastrService, private cdRef: ChangeDetectorRef) {
        super();


        this.clearForm();
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    }

    ngOnInit() {
        super.ngOnInit();
        this.getAllCompanySettings();
        this.clearForm();
        this.getConfigurations();
    }

    getAllCompanySettings() {
        this.isAnyOperationIsInprogress = true;
        var companysettingsModel = new CompanysettingsModel();
        companysettingsModel.isArchived = this.isArchivedTypes;
        companysettingsModel.isSystemApp = true;
        this.masterSettings.getAllCompanySettings(companysettingsModel).subscribe((response: any) => {
            if (response.success) {
                let companySettingsModel: any[] = [];
                companySettingsModel = response.data;
                if (companySettingsModel.length > 0) {
                    let companyResult = companySettingsModel.filter(item => item.key.trim() == "EnableTestcaseManagement");
                    if (companyResult.length > 0) {
                        this.isTestTrailEnable = companyResult[0].value == "1" ? true : false;
                        this.cdRef.detectChanges();
                    }
                }
            }
        });
    }

    getConfigurations() {
        this.isAnyOperationIsInprogress = true;
        let configurationModel = new TimeConfiguration();
        configurationModel.isArchived = false;
        this.masterSettings.getTimeConfigurationSettings(configurationModel).subscribe((response: any) => {
            if (response.success == true) {
                this.configurations = response.data;
                this.filterConfigurations = this.configurations;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.toastr.error(this.validationMessage);
                this.cdRef.detectChanges();
            }
        });
    }

    editConfiguration(data, configurationEditPopover) {
        this.configurationId = data.testRailConfigurationId;
        this.configurationName = data.configurationName;
        this.timeStamp = data.timeStamp;
        this.configurationForm.patchValue({
            configurationTime: data.configurationTime
        });
        configurationEditPopover.openPopover();
    }

    upsertConfiguration() {
        this.isAnyOperationIsInprogress = true;
        if (this.configurationForm.value.configurationTime >= 0 && this.configurationForm.value.configurationTime <= 60) {
            let configurationModel = new TimeConfiguration();
            configurationModel = this.configurationForm.value;
            configurationModel.testRailConfigurationId = this.configurationId;
            configurationModel.configurationName = this.configurationName;
            configurationModel.timeStamp = this.timeStamp;
            this.masterSettings.upsertTimeConfigurationSettings(configurationModel).subscribe((response: any) => {
                if (response.success == true) {
                    this.configurationEditsPopover.forEach((p) => p.closePopover());
                    this.clearForm();
                    this.getConfigurations();
                    this.isAnyOperationIsInprogress = false;
                }
                else {
                    this.isThereAnError = true;
                    this.validationMessage = response.apiResponseMessages[0].message;
                    this.isAnyOperationIsInprogress = false;
                    this.toastr.error(this.validationMessage);
                }
            });
        }
        else if (this.configurationForm.value.configurationTime == '' || this.configurationForm.value.configurationTime == null) {
            this.isAnyOperationIsInprogress = false;
            this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForWrongTimeConfiguration));
        }
        else {
            this.isAnyOperationIsInprogress = false;
            this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForExceedingTimeConfiguration));
        }
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
        let temp = this.filterConfigurations.filter(config => config.configurationName.toLowerCase().indexOf(this.searchText) > -1 ||
            config.configurationTime.toString().toLowerCase().indexOf(this.searchText) > -1);
        this.configurations = temp;
    }

    clearForm() {
        this.configurationId = null;
        this.configurationName = null;
        this.timeStamp = null;
        this.validationMessage = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.configurationForm = new FormGroup({
            // configurationTime: new FormControl(0, Validators.compose([Validators.pattern(/^[0-9]{1,7}$/)]))
            configurationTime: new FormControl(0, Validators.compose([Validators.pattern(/^\d+(\.\d{1,2})?$/)]))
        })
    }

    closeUpsertConfigurationDialog() {
        this.configurationEditsPopover.forEach((p) => p.closePopover());
    }

    closeSearch() {
        this.filterByName(null);
    }
}