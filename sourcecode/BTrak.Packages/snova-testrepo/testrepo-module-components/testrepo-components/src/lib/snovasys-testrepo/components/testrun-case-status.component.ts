import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef, OnInit, ViewChildren, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _ from "underscore";

import "../../globaldependencies/helpers/fontawesome-icons";

import { State } from "../store/reducers/index";
import * as testRailModuleReducer from "../store/reducers/index";

import { LoadTestCaseStatusListTriggered } from '../store/actions/testcasestatuses.actions';
import { LoadTestRunUsersListTriggered } from '../store/actions/testrunusers.actions';
import { LoadTestCaseStatusTriggered, TestCaseActionTypes } from '../store/actions/testcaseadd.actions';

import { TestCaseDropdownList } from '../models/testcasedropdown';
import { TestCase } from '../models/testcase';
import { TestRun } from '../models/testrun';

import { SatPopover } from '@ncstate/sat-popover';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { ConstantVariables } from '../constants/constant-variables';
import { CompanysettingsModel } from '../models/company-model';
import { MaterSettingService } from '../services/master-setting.services';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { EntityTypeFeatureIds } from '../constants/entitytype-feature-ids';

const testCaseSteps = ConstantVariables.TestCaseSteps;
const failedStatusId = ConstantVariables.FailedStatusId;
const failedStatusShortName = ConstantVariables.FailedStatusShortName;

@Component({
    selector: 'testrun-case-status',
    templateUrl: './testrun-case-status.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestRunCaseStatusComponent implements OnInit {
    @ViewChildren('addBugPopover') addBugsPopover;
    @ViewChildren('addStepBugPopover') addStepBugsPopover;
    @ViewChildren("fileUploadPopup") fileUploadPopover;
    @ViewChildren("testStepPopup") testStepPopup;
    @Output() closeOperations = new EventEmitter<string>();

    @Input("projectId")
    set _projectId(data: string) {
        if (data) {
            this.projectsId = data;
            this.loadUsersList();
        }
    }

    @Input("testCaseStatuses")
    set _testCaseStatuses(data) {
        if (data) {
            this.statusList = data;
        }
    }

    @Input("testRunId")
    set _testRunId(data: string) {
        if (data) {
            this.testRunsId = data;
        }
    }

    @Input("testCaseDetails")
    set _testCaseDetails(data: any) {
        this.testCaseDetail = data;
        this.initializeStatusForm();
        this.checkIsFailed(this.testCaseDetail.statusId);
        this.statusForm.patchValue(this.testCaseDetail);
        this.initializeTestCaseDetails();
    }

    usersList$: Observable<TestCaseDropdownList[]>;

    public ngDestroyed$ = new Subject();

    public initSettings = {
        plugins: "paste",
        branding: false,
        //powerpaste_allow_local_images: true,
        //powerpaste_word_import: 'prompt',
        //powerpaste_html_import: 'prompt',
        toolbar: 'link image code'
    };

    statusForm: FormGroup;
    stepStatus: FormArray;

    statusList: TestCaseDropdownList[];
    dropDownList: TestCaseDropdownList;
    addNewStatus: TestCase;
    searchTestRun: TestRun;

    testCaseDetail: any;
    projectsId: string;
    testRunsId: string;
    statusFailedId: string = failedStatusId;
    statusFailedShortName: string = failedStatusShortName;
    disableStatus: boolean = false;
    isTestCaseStatuses: boolean = false;
    hideStatus: boolean = false;
    hideAssign: boolean = false;
    loadBug: boolean = false;
    isBugBoardEnable: boolean = false;
    isStatusUpdated: boolean = false;
    isBugFromTestRail: boolean = true;
    isBugFromUserStory: boolean = false;
    isCaseFailed: boolean = false;
    isStepCaseFailed: boolean = false;
    updateStatus: boolean;
    // statusCommentFilePath = [];
    // assigneeCommentFilePath = [];

    selectedStoreId: null;
    moduleTypeId: number = 7;
    isButtonVisible: boolean = true;
    isFileUploadPopover: boolean = false;
    isTestStepPopover: boolean = false;
    testRunSelectedStepId: string = null;
    testRunStatusReferenceTypeId = ConstantVariables.TestRunStatusCommentReferenceTypeId;
    testRunAssigneeReferenceTypeId = ConstantVariables.TestRunAssigneeCommentReferenceTypeId;
    testRunActualResultReferenceTypeId = ConstantVariables.TestRunActualResultReferenceTypeId;
    referenceTypeId: string;
    referenceId: string;

    constructor(private store: Store<State>, private actionUpdates$: Actions, private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef, private _sanitizer: DomSanitizer,
        private masterSettingsService: MaterSettingService) {
        // super(sharedStore);

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(TestCaseActionTypes.TestCaseStatusEditWithInPlaceUpdateForStatus),
                tap(() => {
                    this.disableStatus = false;
                    this.isStatusUpdated = false;
                    this.cdRef.markForCheck();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(TestCaseActionTypes.LoadTestCaseFailed),
                tap(() => {
                    this.disableStatus = false;
                    this.cdRef.detectChanges();
                })
            ).subscribe();

        var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.EntityRoleFeatures));
        this.updateStatus = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateStatus.toString().toLowerCase(); }) != null;
        this.cdRef.markForCheck();
    }

    ngOnInit() {
        // super.ngOnInit();
        this.getCompanySettings();
    }

    loadUsersList() {
        this.store.dispatch(new LoadTestRunUsersListTriggered(this.projectsId));
        this.usersList$ = this.store.pipe(select(testRailModuleReducer.getTestRunUserAll));
    }

    getCompanySettings() {
        var companysettingsModel = new CompanysettingsModel();
        companysettingsModel.isArchived = false;
        this.masterSettingsService.getAllCompanySettingsDetails(companysettingsModel).subscribe((response: any) => {
            if (response.success == true && response.data.length > 0) {
                let companyResult = response.data.filter(item => item.key.trim() == "EnableBugBoard");
                if (companyResult.length > 0) {
                    this.isBugBoardEnable = companyResult[0].value == "1" ? true : false;
                    this.cdRef.detectChanges();
                }
            }
        });
    }

    addStatus() {
        this.disableStatus = true;
        this.isStatusUpdated = true;
        this.addNewStatus = new TestCase();
        this.addNewStatus = this.statusForm.value;
        this.addNewStatus.testCaseId = this.testCaseDetail.testCaseId;
        this.addNewStatus.testRunId = this.testCaseDetail.testRunId;
        this.addNewStatus.isBugAdded = this.isStatusUpdated;
        this.addNewStatus.timeStamp = this.testCaseDetail.timeStamp;
        this.store.dispatch(new LoadTestCaseStatusTriggered(this.addNewStatus));
    }

    addStatusFromBug() {
        this.disableStatus = true;
        this.addNewStatus = new TestCase();
        this.addNewStatus = this.statusForm.value;
        this.addNewStatus.testCaseId = this.testCaseDetail.testCaseId;
        this.addNewStatus.testRunId = this.testCaseDetail.testRunId;
        this.addNewStatus.isBugAdded = this.isStatusUpdated;
        this.addNewStatus.timeStamp = this.testCaseDetail.timeStamp;
        this.store.dispatch(new LoadTestCaseStatusTriggered(this.addNewStatus));
    }

    cancelStatus() {
        this.closeOperations.emit('');
    }

    openBugPopover(addBugPopover) {
        this.loadBug = true;
        addBugPopover.openPopover();
    }

    openStepBugPopover(addStepBugPopover) {
        this.loadBug = true;
        addStepBugPopover.openPopover();
    }

    closeBugPopover(event) {
        this.loadBug = false;
        this.addBugsPopover.forEach((p) => p.closePopover());
        this.addStepBugsPopover.forEach((p) => p.closePopover());
        if (event == 'yes') {
            this.isStatusUpdated = false;
            this.addStatusFromBug();
            this.disableStatus = false;
            this.cdRef.markForCheck();
        }
    }

    initializeStatusForm() {
        this.statusForm = new FormGroup({
            statusId: new FormControl("", Validators.compose([Validators.required])),
            assignToId: new FormControl("", Validators.compose([])),
            statusComment: new FormControl("", Validators.compose([])),
            stepStatus: this.formBuilder.array([]),
            assignToComment: new FormControl("", Validators.compose([]))
        });
    }

    initializeTestCaseDetails() {
        if (this.testCaseDetail.testCaseSteps && this.testCaseDetail.templateName == testCaseSteps) {
            this.isTestCaseStatuses = true;
            this.stepStatus = this.statusForm.get('stepStatus') as FormArray;
            this.testCaseDetail.testCaseSteps.forEach((x, i) => {
                this.stepStatus.push(this.formBuilder.group({
                    stepId: x.stepId,
                    testRunSelectedStepId: x.testRunSelectedStepId,
                    stepText: x.stepText,
                    stepStatusId: x.stepStatusId,
                    stepStatusName: x.stepStatusName,
                    stepShortName: false,
                    stepExpectedResult: x.stepExpectedResult,
                    stepActualResult: x.stepActualResult,
                    viewActualresult: false,
                    stepTextFilePath: x.stepTextFilePath,
                    stepExpectedResultFilePath: x.stepExpectedResultFilePath
                }));
                this.checkIsStepCaseFailed(this.stepStatus.at(i).get('stepStatusId').value, i);
            })
            // if (this.testCaseDetail.statusCommentFilePath != null)
            //     this.statusCommentFilePath = this.testCaseDetail.statusCommentFilePath.split(',');
            // else
            //     this.statusCommentFilePath = [];
            // if (this.testCaseDetail.assigneeCommentFilePath != null)
            //     this.assigneeCommentFilePath = this.testCaseDetail.assigneeCommentFilePath.split(',');
            // else
            //     this.assigneeCommentFilePath = [];
        }
        else
            this.isTestCaseStatuses = false;
    }

    getStepControls() {
        return (this.statusForm.get('stepStatus') as FormArray).controls;
    }

    checkIsFailed(value) {
        let testCaseStatusId = value;
        if (this.statusList && this.statusList.length > 0) {
            let index = this.statusList.findIndex(x => x.id == testCaseStatusId);
            let selectedCase = this.statusList[index].statusShortName;
            if (selectedCase) {
                if (selectedCase.toLowerCase() == this.statusFailedShortName.toLowerCase()) {
                    this.isCaseFailed = true;
                    this.cdRef.markForCheck();
                }
                else {
                    this.isCaseFailed = false;
                    this.cdRef.markForCheck();
                }
            }
        }
    }

    checkIsStepCaseFailed(value, ind) {
        this.stepStatus = this.statusForm.get('stepStatus') as FormArray;
        let testCaseStatusId = value;
        if (this.statusList && this.statusList.length > 0) {
            let index = this.statusList.findIndex(x => x.id == testCaseStatusId);
            let selectedCase = this.statusList[index].statusShortName;
            if (selectedCase) {
                if (selectedCase.toLowerCase() == this.statusFailedShortName.toLowerCase()) {
                    // this.isStepCaseFailed = true;
                    this.stepStatus.at(ind).patchValue({
                        stepShortName: true
                    });
                }
                else {
                    this.stepStatus.at(ind).patchValue({
                        stepShortName: false
                    });
                }
            }
        }
    }

    openFileUploadPopover(referenceTypeId, fileUploadPopup) {
        this.isFileUploadPopover = !this.isFileUploadPopover;
        fileUploadPopup.openPopover();
        this.referenceTypeId = referenceTypeId;
        this.referenceId = this.testCaseDetail.testRunSelectedCaseId;
    }

    closeFileUploadPopover() {
        this.fileUploadPopover.forEach((p) => p.closePopover());
        this.isFileUploadPopover = !this.isFileUploadPopover;
        this.referenceTypeId = null;
        this.referenceId = null;
    }

    selectedTestStep(testRunSelectedStepId, testStepPopover) {
        this.isTestStepPopover = !this.isTestStepPopover;
        testStepPopover.openPopover();
        this.testRunSelectedStepId = testRunSelectedStepId;
    }

    closeTestStepPopup() {
        this.testStepPopup.forEach((p) => p.closePopover());
        this.isTestStepPopover = !this.isTestStepPopover;
    }

    sanitizeUrl(imgUrl) {
        return this._sanitizer.bypassSecurityTrustUrl(imgUrl);
    }

    getStepImagesArray(data) {
        return data.split(',');
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}
