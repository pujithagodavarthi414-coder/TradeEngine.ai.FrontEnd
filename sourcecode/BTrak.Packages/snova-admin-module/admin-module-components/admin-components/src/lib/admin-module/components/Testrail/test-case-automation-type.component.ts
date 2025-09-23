import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { OnInit, Component, Input, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { FormGroup, FormGroupDirective, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TestCaseAutomationTypeModel } from '../../models/test-case-automation-type-model';
import { CompanysettingsModel } from '../../models/company-model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MasterDataManagementService } from '../../services/master-data-management.service';
import { TestrailManagementService } from '../../services/testrail-management.service';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: 'app-fm-component-test-case-automation-type',
    templateUrl: `test-case-automation-type.component.html`
})

export class TestcaseAutomationType extends CustomAppBaseComponent implements OnInit {
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    @ViewChildren("deleteTestCaseAutomationTypePopUp") deleteTestCaseAutomationTypePopover;
    @ViewChildren("upsertTestCaseAutomationTypePopUp") upsertTestCaseAutomationTypePopover;
    companySettingsModel$: any[];
    testCaseAutomationTypeForm: FormGroup;
    isFiltersVisible: boolean = false;
    isArchivedTypes: boolean = false;
    isThereAnError: boolean = false;
    testCaseAutomationTypeId: string;
    automationTypeName: string;
    validationMessage: string;
    testCaseAutomationType: TestCaseAutomationTypeModel;
    isAnyOperationIsInprogress: boolean = false;
    testCaseAutomationTypes: TestCaseAutomationTypeModel[];
    timeStamp: any;
    temp: any;
    searchText: string;
    isTestTrailEnable: boolean = true;
    testcaseautomation: string;
    isDefault: string;

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getCompanySettings();
        this.getAllTestCaseAutomationTypes();
    }

    constructor(private cdRef: ChangeDetectorRef, private translateService: TranslateService,
        private testrailManagementService: TestrailManagementService, private snackbar: MatSnackBar,
        private masterSettings: MasterDataManagementService) {
        super();


    }

    getCompanySettings() {
        var companysettingsModel = new CompanysettingsModel();
        companysettingsModel.isArchived = false;
        this.masterSettings.getAllCompanySettingsDetails(companysettingsModel).subscribe((response: any) => {
            if (response.success == true && response.data.length > 0) {
                let companyResult = response.data.filter(item => item.key.trim() == "EnableTestcaseManagement");
                if (companyResult.length > 0) {
                    this.isTestTrailEnable = companyResult[0].value == "1" ? true : false;
                }
            }
        });
    }

    getAllTestCaseAutomationTypes() {
        this.isAnyOperationIsInprogress = true;

        var testCaseAutomationTypeModel = new TestCaseAutomationTypeModel();
        testCaseAutomationTypeModel.isArchived = this.isArchivedTypes;

        this.testrailManagementService.getAllTestCaseAutomationTypes(testCaseAutomationTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.testCaseAutomationTypes = response.data;
                this.temp = this.testCaseAutomationTypes;
                this.isAnyOperationIsInprogress = false;
                this.clearForm();
                this.cdRef.detectChanges();
            }
            if (response.success == false) {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });

    }

    deleteTestCaseAutomationTypePopUpOpen(row, deleteTestCaseAutomationTypePopUp) {
        this.testCaseAutomationTypeId = row.id;
        this.automationTypeName = row.automationTypeName;
        this.timeStamp = row.timeStamp;
        deleteTestCaseAutomationTypePopUp.openPopover();
    }

    closeDeleteTestCaseAutomationTypeDialog() {
        this.clearForm();
        this.deleteTestCaseAutomationTypePopover.forEach((p) => p.closePopover());
    }

    upsertTestCaseAutomationType(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;

        this.testCaseAutomationType = this.testCaseAutomationTypeForm.value;
        this.testCaseAutomationType.automationTypeName = this.testCaseAutomationType.automationTypeName.toString().trim();
        this.testCaseAutomationType.testCaseAutomationTypeId = this.testCaseAutomationTypeId;
        this.testCaseAutomationType.isDefault = this.testCaseAutomationType.isDefault == true ? true : false;
        this.testCaseAutomationType.timeStamp = this.timeStamp;

        this.testrailManagementService.upsertTestCaseAutomationType(this.testCaseAutomationType).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertTestCaseAutomationTypePopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllTestCaseAutomationTypes();
            }
            else {
                this.isThereAnError = true;
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.cdRef.detectChanges();
            }
        });

    }


    deleteTestCaseAutomationType() {
        this.isAnyOperationIsInprogress = true;
        this.testCaseAutomationType = new TestCaseAutomationTypeModel();
        this.testCaseAutomationType.testCaseAutomationTypeId = this.testCaseAutomationTypeId;
        this.testCaseAutomationType.automationTypeName = this.automationTypeName;
        this.testCaseAutomationType.timeStamp = this.timeStamp;
        this.testCaseAutomationType.isArchived = !this.isArchivedTypes;

        this.testrailManagementService.upsertTestCaseAutomationType(this.testCaseAutomationType).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteTestCaseAutomationTypePopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllTestCaseAutomationTypes();
            }
            else {
                this.isThereAnError = true;
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.cdRef.detectChanges();
            }
        });

    }

    editTestCaseAutomationType(row, upsertTestCaseAutomationTypePopUp) {
        this.testCaseAutomationTypeForm.patchValue(row);
        this.testCaseAutomationTypeId = row.id;
        this.timeStamp = row.timeStamp;
        this.isDefault = row.isDefault;
        this.testcaseautomation = this.translateService.instant('TESTCASEAUTOMATIONTYPE.EDITTESTCASEAUTOMATIONTYPE');
        upsertTestCaseAutomationTypePopUp.openPopover();
    }

    closeUpsertTestCaseAutomationTypePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertTestCaseAutomationTypePopover.forEach((p) => p.closePopover());
    }

    createTestCaseAutomationType(upsertTestCaseAutomationTypePopUp) {
        upsertTestCaseAutomationTypePopUp.openPopover();
        this.testcaseautomation = this.translateService.instant('TESTCASEAUTOMATIONTYPE.ADDTESTCASEAUTOMATIONTYPE');
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    clearForm() {
        this.testCaseAutomationType = null;
        this.testCaseAutomationTypeId = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.isAnyOperationIsInprogress = false;
        this.searchText = null;
        this.testCaseAutomationTypeForm = new FormGroup({
            automationTypeName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            isDefault: new FormControl(null,
                Validators.compose([
                ])
            ),
        });
        this.cdRef.detectChanges();
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter(automation => automation.automationTypeName.toLowerCase().indexOf(this.searchText) > -1);
        this.testCaseAutomationTypes = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
