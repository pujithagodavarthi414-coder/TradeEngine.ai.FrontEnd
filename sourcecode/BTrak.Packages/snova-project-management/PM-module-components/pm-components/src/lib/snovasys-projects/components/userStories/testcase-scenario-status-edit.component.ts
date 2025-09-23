import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter, Input, OnInit, ViewChild, ElementRef, ViewChildren } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';

import { DomSanitizer } from '@angular/platform-browser';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { TestCaseDropdownList } from '@snovasys/snova-testrepo';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { TestCaseActionTypes, LoadTestCaseScenarioStatusTriggered, LoadMultipleTestCasesByUserStoryIdTriggered, LoadTestCaseStatusListTriggered } from "@snovasys/snova-testrepo";
import { TestCase } from '@snovasys/snova-testrepo';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import * as testRailModuleReducer from "@snovasys/snova-testrepo";
const exploratorySession = ConstantVariables.ExploratorySession;
const testCaseSteps = ConstantVariables.TestCaseSteps;
const testCaseText = ConstantVariables.TestCaseText;
const failedStatusId = ConstantVariables.FailedStatusId;
const failedStatusShortName = ConstantVariables.FailedStatusShortName;
const activeGoalStatusId = ConstantVariables.ActiveGoalStatusId;

@Component({
    selector: 'testcase-scenario-status-edit',
    templateUrl: 'testcase-scenario-status-edit.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestCaseScenarioStatusEditComponent extends AppFeatureBaseComponent implements OnInit {
    @ViewChildren('addBugPopover') addBugsPopover;
    @ViewChildren('addStepBugPopover') addStepBugsPopover;
    @ViewChild("testCaseScenarioTitle") testCaseScenarioTitleStatus: ElementRef;
    @Output() closeEditTestCaseStatusScenario = new EventEmitter<any>();

    @Input("testCaseStatuses")
    set _testCaseStatuses(data) {
        if (data) {
            this.statusList = data;
        }
    }

    @Input("testCaseDetails")
    set _testCaseDetails(data: any) {
        if (data) {
            this.initializeStatusForm();
            this.statusForm.patchValue(data);
            this.testCaseDetail = data;
            if (this.testCaseDetail.testCaseFilePath != null)
                this.testCaseFilePath = this.testCaseDetail.testCaseFilePath.split(',');
            else
                this.testCaseFilePath = [];
            if (this.testCaseDetail.preConditionFilePath != null)
                this.preFilePath = this.testCaseDetail.preConditionFilePath.split(',');
            else
                this.preFilePath = [];
            if (this.testCaseDetail.testCaseStepDescriptionFilePath != null)
                this.stepMostFilePath = this.testCaseDetail.testCaseStepDescriptionFilePath.split(',');
            else
                this.stepMostFilePath = [];
            if (this.testCaseDetail.expectedResultFilePath != null)
                this.expectedMostFilePath = this.testCaseDetail.expectedResultFilePath.split(',');
            else
                this.expectedMostFilePath = [];
            if (this.testCaseDetail.testCaseMissionFilePath != null)
                this.testCaseMissionFilePath = this.testCaseDetail.testCaseMissionFilePath.split(',');
            else
                this.testCaseMissionFilePath = [];
            if (this.testCaseDetail.testCaseGoalFilePath != null)
                this.testCaseGoalFilePath = this.testCaseDetail.testCaseGoalFilePath.split(',');
            else
                this.testCaseGoalFilePath = [];
            this.loadStatuses();
            this.changeTemplate();
            if (this.testCaseDetail.testCaseSteps && this.testCaseDetail.templateName == testCaseSteps) {
                this.isTestCaseStatuses = true;
                this.stepStatus = this.statusForm.get('stepStatus') as FormArray;
                this.testCaseDetail.testCaseSteps.forEach((x, i) => {
                    this.stepStatus.push(this.formBuilder.group({
                        stepId: x.stepId,
                        stepText: x.stepText,
                        stepShortName: false,
                        stepStatusId: x.stepStatusId,
                        stepStatusName: x.stepStatusName,
                        stepStatusColor: x.stepStatusColor,
                        stepExpectedResult: x.stepExpectedResult,
                        stepActualResult: x.stepActualResult,
                        stepTextFilePath: x.stepTextFilePath,
                        stepExpectedResultFilePath: x.stepExpectedResultFilePath,
                        viewActualresult: false
                    }))
                    this.checkIsStepCaseFailed(this.stepStatus.at(i).get('stepStatusId').value, i);
                })

            }
            else
                this.isTestCaseStatuses = false;
        }
    }

    @Input("userStoryData")
    set _userStoryData(data: any) {
        if (data)
            this.userStoryData = data;
            
    }
    @Input("isSprintUserStories")
    set _isSprintUserStories(data: boolean) {
        this.isSprintUserStories = data;
        this.hidestatusChange();
    }

    statusList$: Observable<TestCaseDropdownList[]>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;

    softLabels: SoftLabelConfigurationModel[];

    public ngDestroyed$ = new Subject();

    statusForm: FormGroup;
    stepStatus: FormArray;

    testCaseDetail: any;
    userStoryData: any;
    statusList: TestCaseDropdownList[];
    statusFailedId: string = failedStatusId;
    statusFailedShortName: string = failedStatusShortName;
    goalActiveId: string = activeGoalStatusId;
    showExploratory: boolean = false;
    isShowDropdown: boolean;
    isSprintUserStories: boolean;
    showSteps: boolean = false;
    showText: boolean = false;
    isTestCaseStatuses: boolean = false;
    showTitleTooltip: boolean = false;
    loadBug: boolean = false;
    isBugFromTestRail: boolean = false;
    isBugFromUserStory: boolean = false;
    closeStatusDialog: boolean = false;
    disabledTestCaseStatusScenario: boolean = false;
    isStepCaseFailed: boolean = false;
    isCaseFailed: boolean = false;

    preFilePath = [];
    stepMostFilePath = [];
    expectedMostFilePath = [];
    testCaseGoalFilePath = [];
    testCaseMissionFilePath = [];
    testCaseFilePath = [];

    constructor(private testrailStore: Store<testRailModuleReducer.State>, 
        private actionUpdates$: Actions, private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef, private _sanitizer: DomSanitizer) {
        super();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.TestCaseEditWithInPlaceUpdate),
            tap(() => {
                this.disabledTestCaseStatusScenario = false;
                this.closeTestCaseStatusScenarioEditDialog();
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(TestCaseActionTypes.LoadTestCaseFailed),
                tap(() => {
                    this.disabledTestCaseStatusScenario = false;
                    this.cdRef.markForCheck();
                })
            ).subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabels();
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels))
    }

    loadStatuses() {
        let dropDownList = new TestCaseDropdownList();
        dropDownList.isArchived = false;
         this.testrailStore.dispatch(new LoadTestCaseStatusListTriggered(dropDownList));
         this.statusList$ = this.testrailStore.pipe(select(testRailModuleReducer.getTestCaseStatusAll),
             tap(result => {
                 if (result) {
                     this.statusList = result;
                    this.checkIsFailed(this.testCaseDetail.statusId);
                     this.cdRef.markForCheck();
                 }
             }));
    }

    hidestatusChange() {
        if(this.isSprintUserStories) {
            if(( this.userStoryData && (!this.userStoryData.sprintStartDate && !this.userStoryData.isReplan)) || this.userStoryData.isReplan) {
                this.isShowDropdown = true;
            } else {
               this.isShowDropdown = false;
            }

        } else {
            if(this.userStoryData && this.userStoryData.goalStatusId != ConstantVariables.ActiveGoalStatusId.toLowerCase()) {
                this.isShowDropdown = true;
            } else {
                this.isShowDropdown =  false;
            }
        }
    }

    checkIsFailed(value) {
        let testCaseStatusId = value;
        if (this.statusList && this.statusList.length > 0) {
            let index = this.statusList.findIndex(x => x.id == testCaseStatusId);
            let selectedCase = this.statusList[index].statusShortName;
            if (selectedCase) {
                if (selectedCase.toLowerCase() == this.statusFailedShortName.toLowerCase())
                    this.isCaseFailed = true;
                else
                    this.isCaseFailed = false;
            }
        }
    }

    checkIsStepCaseFailed(value, i) {
        this.stepStatus = this.statusForm.get('stepStatus') as FormArray;
        let testCaseStatusId = value;
        if (this.statusList && this.statusList.length > 0) {
            let index = this.statusList.findIndex(x => x.id == testCaseStatusId);
            let selectedCase = this.statusList[index].statusShortName;
            if (selectedCase) {
                if (selectedCase.toLowerCase() == this.statusFailedShortName.toLowerCase())
                    //this.isStepCaseFailed = true;
                    this.stepStatus.at(i).patchValue({
                        stepShortName: true
                    });
                else
                    this.stepStatus.at(i).patchValue({
                        stepShortName: false
                    });
            }
        }
    }

    changeTemplate() {
        if (this.testCaseDetail.templateName == testCaseSteps) {
            this.showSteps = true;
            this.showText = false;
            this.showExploratory = false;
        }
        else if (this.testCaseDetail.templateName == testCaseText) {
            this.showSteps = false;
            this.showText = true;
            this.showExploratory = false;
        }
        else if (this.testCaseDetail.templateName == exploratorySession) {
            this.showSteps = false;
            this.showText = false;
            this.showExploratory = true;
        }
    }

    editTestCaseScenarioStatuses() {
        this.disabledTestCaseStatusScenario = true;
        let testCase = new TestCase();
        testCase = this.statusForm.value;
        testCase.testCaseId = this.testCaseDetail.testCaseId;
        testCase.testSuiteId = this.testCaseDetail.testSuiteId;
        testCase.sectionId = this.testCaseDetail.sectionId;
        testCase.userStoryId = this.testCaseDetail.userStoryId;
        testCase.userStoryScenarioTimeStamp = this.testCaseDetail.userStoryScenarioTimeStamp;
        this.testrailStore.dispatch(new LoadTestCaseScenarioStatusTriggered(testCase));
    }

    initializeStatusForm() {
        this.statusForm = new FormGroup({
            statusId: new FormControl("", Validators.compose([])),
            stepStatus: this.formBuilder.array([])
        });
    }

    closeTestCaseStatusScenarioEditDialog() {
        let testCase = new TestCase();
        testCase.testCaseId = this.testCaseDetail.testCaseId;
        testCase.testSuiteId = this.testCaseDetail.testSuiteId;
        testCase.sectionId = this.testCaseDetail.sectionId;
        testCase.userStoryId = this.testCaseDetail.userStoryId;
        testCase.isBugAdded = true;
        this.testrailStore.dispatch(new LoadMultipleTestCasesByUserStoryIdTriggered(testCase));
        this.closeEditTestCaseStatusScenario.emit('');
    }

    openBugPopover(addBugPopover) {
        this.loadBug = true;
        addBugPopover.openPopover();
    }

    openStepBugPopover(addStepBugPopover) {
        this.loadBug = true;
        addStepBugPopover.openPopover();
    }

    closeBugPopover() {
        this.loadBug = false;
        this.addBugsPopover.forEach((p) => p.closePopover());
        this.addStepBugsPopover.forEach((p) => p.closePopover());
    }

    setColorForStatusTypes(color) {
        let styles = {
            "color": color
        };
        return styles;
    }

    setCaseStatusColor() {
        let value = this.statusForm.get('statusId').value;
        let styles;
        let index = -1;
        let color = '';
        if (this.statusList && this.statusList.length > 0) {
            index = this.statusList.findIndex(x => x.statusHexValue == value);
            color = this.statusList[index].statusHexValue;
        }
        if (index == -1) {
            styles = {
                "backgroung": "#ebebeb"
            };
        }
        else {
            styles = {
                "backgroung": color
            };
        }
        return styles;
    }

    onChangeCaseStatus(value) {
        this.setCaseStatusColor();
    }

    checkTitleTooltipStatus() {
        if (this.testCaseScenarioTitleStatus.nativeElement.scrollWidth > this.testCaseScenarioTitleStatus.nativeElement.clientWidth)
            this.showTitleTooltip = true;
        else
            this.showTitleTooltip = false;
    }

    navigateToReferencePage(referenceUrl) {
        if (!referenceUrl.includes("http")) {
            referenceUrl = 'http://' + referenceUrl;
        }
        window.open(referenceUrl, '_blank');
    }

    sanitizeUrl(imgUrl) {
        return this._sanitizer.bypassSecurityTrustUrl(imgUrl);
    }


    getStepTextImagesArray(data) {
        return data.split(',');
    }

    getStepResultImagesArray(data) {
        return data.split(',');
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    getStepControls() {
        return (this.statusForm.get('stepStatus') as FormArray).controls;
    }
}