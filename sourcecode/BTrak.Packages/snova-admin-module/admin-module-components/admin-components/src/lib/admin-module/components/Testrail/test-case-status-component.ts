import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { OnInit, Component, Input, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { FormGroup, FormGroupDirective, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CompanysettingsModel } from '../../models/company-model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MasterDataManagementService } from '../../services/master-data-management.service';
import { TesttypeModel } from '../../models/testtype-model';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: 'app-fm-component-test-case-status',
    templateUrl: `test-case-status.component.html`
})

export class TestcaseStatusComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("testcasePopup") upsertTestCasePopover;
    @ViewChildren("deletetestcasePopup") deleteTestCasePopup;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }
    dashboardFilters: DashboardFilterModel;
    isAnyOperationIsInprogress: boolean = false;
    isArchived: boolean = false;
    isThereAnError: boolean;
    isFiltersVisible: boolean;
    isTestcaseArchived: boolean;
    validationMessage: string;
    searchText: string;
    isTestTrailEnable: boolean = true;
    statusId: string;
    timeStamp: any;
    temp: any;
    testCaseStatus: string;
    testCaseStatusName: string;
    testtypeModel: TesttypeModel;
    testTypeForm: FormGroup;
    public color = "";
    testCaseStatuseEdit: string;
    statusHexValue: string;
    constructor(private cdRef: ChangeDetectorRef, private translateService: TranslateService,
        private masterDataManagementService: MasterDataManagementService, private snackbar: MatSnackBar,
        private masterSettings: MasterDataManagementService) {
        super();


    }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getCompanySettings();
        this.getAllTestCaseStatus();
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

    getAllTestCaseStatus() {
        this.isAnyOperationIsInprogress = true;
        var testtypeModel = new TesttypeModel();
        testtypeModel.isArchived = this.isArchived;

        this.masterDataManagementService.getAllTestCaseStatus(testtypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.testCaseStatus = response.data;
                this.temp = this.testCaseStatus;
                this.clearForm();
                this.isAnyOperationIsInprogress = false;
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
        this.validationMessage = null;
        this.isThereAnError = false;
        this.timeStamp = null;
        this.isAnyOperationIsInprogress = false;
        this.testtypeModel = null;
        this.searchText = null;
        this.statusId = null;
        this.color = null;
        this.testTypeForm = new FormGroup({
            testCaseStatus: new FormControl(null,
                Validators.compose([
                    Validators.min(0),
                    Validators.maxLength(50)
                ])
            ),
            statusHexValue: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            )
        });
        this.cdRef.detectChanges();
    }

    upsertTestcasestatus(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.testtypeModel = this.testTypeForm.value;
        this.testtypeModel.statusId = this.statusId;
        this.testtypeModel.status = this.testtypeModel.testCaseStatus.toString().trim();
        this.testtypeModel.timeStamp = this.timeStamp;
        this.masterDataManagementService.upsertTestcasestatus(this.testtypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertTestCasePopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllTestCaseStatus();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        }); 
    }

    createTestcase(testcasePopup) {
        testcasePopup.openPopover();
        this.testCaseStatuseEdit = this.translateService.instant('TESTCASESTATUS.ADDTESTCASETYPE');
    }

    closeupsertTestcasePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertTestCasePopover.forEach((p) => p.closePopover());
    }

    editTestcase(row, testcasePopup) {
        this.testTypeForm.patchValue(row);
        this.statusId = row.id;
        this.statusHexValue = row.statusHexValue;
        this.testCaseStatuseEdit = this.translateService.instant('TESTCASESTATUS.EDITTESTCASETYPE');
        this.timeStamp = row.timeStamp;
        testcasePopup.openPopover();
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    deleteTestcasePopUpOpen(row, deletetestcasePopup) {
        this.statusId = row.id;
        this.testCaseStatusName = row.value;
        this.color = row.statusHexValue;
        this.timeStamp = row.timeStamp;
        this.isTestcaseArchived = !this.isArchived;
        deletetestcasePopup.openPopover();
    }

    deleteTestcase() {
        this.isAnyOperationIsInprogress = true;
        let testTypeModel = new TesttypeModel();
        testTypeModel.statusId = this.statusId;
        testTypeModel.statusHexValue = this.color;
        testTypeModel.status = this.testCaseStatusName;
        testTypeModel.timeStamp = this.timeStamp;
        testTypeModel.isArchived = this.isTestcaseArchived;
        this.masterDataManagementService.upsertTestcasestatus(testTypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteTestCasePopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllTestCaseStatus();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    closeTestcasePopup() {
        this.clearForm();
        this.deleteTestCasePopup.forEach((p) => p.closePopover());
    }
 
    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText =  "";
        }

        const temp = this.temp.filter(testCase => testCase.value.toLowerCase().indexOf(this.searchText) > -1);
        this.testCaseStatus = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}