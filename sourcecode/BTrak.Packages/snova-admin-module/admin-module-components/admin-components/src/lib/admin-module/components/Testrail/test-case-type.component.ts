import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { OnInit, Component, Input, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { FormGroup, FormGroupDirective, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MasterDataManagementService } from '../../services/master-data-management.service';
import { TesttypeModel } from '../../models/testtype-model';
import { CompanysettingsModel } from '../../models/company-model';

@Component({
    selector: 'app-fm-component-test-case-type',
    templateUrl: `test-case-type.component.html`

})
export class TestcaseTypeComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("testcasePopup") upsertTestcasePopover;
    @ViewChildren("deletetestcasePopup") deletetestcasePopup;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }
    dashboardFilters: DashboardFilterModel;
    isAnyOperationIsInprogress: boolean = false;
    isArchived: boolean = false;
    testCaseTypes: TesttypeModel[];
    isThereAnError: boolean;
    validationMessage: any;
    testtypeModel: TesttypeModel;
    testTypeForm: FormGroup;
    isTestTrailEnable: boolean = true;
    id: string;
    isTestcaseArchived: boolean;
    value: any;
    testType: TesttypeModel;
    timeStamp: any;
    isFiltersVisible: boolean;
    temp: any;
    searchText: string;
    testCaseTypeEdit: string;
    isDefault: string;
    checked: true;

    constructor(private cdRef: ChangeDetectorRef, private translateService: TranslateService,
        private masterDataManagementService: MasterDataManagementService, private snackbar: MatSnackBar) {
            super();

    }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getCompanySettings();
        this.getAllTestCaseTypes();
    }

    getCompanySettings() {
        var companysettingsModel = new CompanysettingsModel();
        companysettingsModel.isArchived = false;
        this.masterDataManagementService.getAllCompanySettingsDetails(companysettingsModel).subscribe((response: any) => {
            if (response.success == true && response.data.length > 0) {
                let companyResult = response.data.filter(item => item.key.trim() == "EnableTestcaseManagement");
                if (companyResult.length > 0) {
                    this.isTestTrailEnable = companyResult[0].value == "1" ? true : false;
                }
            }
        });
    }

    getAllTestCaseTypes() {
        this.isAnyOperationIsInprogress = true;
        var testtypeModel = new TesttypeModel();
        testtypeModel.isArchived = this.isArchived;

        this.masterDataManagementService.getAllTestCaseTypes(testtypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.testCaseTypes = response.data;
                this.temp = this.testCaseTypes;
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
        this.id = null;
        this.testType = null;
        this.validationMessage = null;
        this.isThereAnError = false;
        this.isAnyOperationIsInprogress = false;
        this.testtypeModel = null;
        this.searchText = null;
        this.testTypeForm = new FormGroup({
            testCaseType: new FormControl(null,
                Validators.compose([
                    Validators.min(0),
                    Validators.maxLength(50)
                ])
            ),
            isDefault: new FormControl(null,
                Validators.compose([

                ])
            ),
        });
        this.cdRef.detectChanges();
    }

    createTestcase(testcasePopup) {
        testcasePopup.openPopover();
        this.testCaseTypeEdit = this.translateService.instant('TESTCASETYPE.ADDTESTCASETYPE');
    }
    closeupsertTestcasePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertTestcasePopover.forEach((p) => p.closePopover());
    }
    editTestcase(row, testcasePopup) {
        this.testTypeForm.patchValue(row);
        this.id = row.id;
        this.testCaseTypeEdit = this.translateService.instant('TESTCASETYPE.EDITTESTCASETYPE');
        this.isDefault = row.isDefault;
        this.timeStamp = row.timeStamp;
        testcasePopup.openPopover();
    }

    upsertTestcase(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.testType = this.testTypeForm.value;
        this.testType.id = this.id;
        this.testType.value = this.testType.testCaseType;
        this.testType.isDefault = this.testType.isDefault;
        this.testType.timeStamp = this.timeStamp;
        this.masterDataManagementService.upsertTestcase(this.testType).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertTestcasePopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllTestCaseTypes();
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
    deleteTestcasePopUpOpen(row, deletetestcasePopup) {
        this.id = row.id;
        this.value = row.testCaseType;
        this.timeStamp = row.timeStamp;
        this.isTestcaseArchived = !this.isArchived;
        deletetestcasePopup.openPopover();
    }
    deleteTestcase() {
        this.isAnyOperationIsInprogress = true;
        let testtypeModel = new TesttypeModel();
        testtypeModel.id = this.id;
        testtypeModel.value = this.value;
        testtypeModel.timeStamp = this.timeStamp;
        testtypeModel.isArchived = this.isTestcaseArchived;
        this.masterDataManagementService.upsertTestcase(testtypeModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deletetestcasePopup.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllTestCaseTypes();
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
        this.deletetestcasePopup.forEach((p) => p.closePopover());
    }
    closeTestcasePopupOpen() {
        this.clearForm();
        this.deletetestcasePopup.forEach((p) => p.closePopover());
    }
    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }
        const temp = this.temp.filter(testCase => testCase.value.toLowerCase().indexOf(this.searchText) > -1);
        this.testCaseTypes = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
