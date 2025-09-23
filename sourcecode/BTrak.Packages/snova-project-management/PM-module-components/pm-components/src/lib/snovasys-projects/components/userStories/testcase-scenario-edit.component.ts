import { Component, ChangeDetectionStrategy, Inject, ViewChildren, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { TestCaseDropdownList } from '@snovasys/snova-testrepo';
import { TestCase } from '@snovasys/snova-testrepo';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { TestCaseActionTypes, LoadTestCaseTemplateListTriggered, LoadTestCaseSectionListTriggered, LoadTestCaseTypeListTriggered, LoadTestCasePriorityListTriggered, LoadTestCaseAutomationListTriggered, LoadTestCaseStepTriggered, LoadTestCaseTriggered } from '@snovasys/snova-testrepo';
import * as testRailModuleReducer from "@snovasys/snova-testrepo"
const exploratorySession = ConstantVariables.ExploratorySession;
const testCaseSteps = ConstantVariables.TestCaseSteps;
const testCaseText = ConstantVariables.TestCaseText;

@Component({
    selector: 'testcase-scenario-edit',
    templateUrl: 'testcase-scenario-edit.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestCaseScenarioEditComponent {
    @ViewChildren('deleteStepPopover') deleteStepsPopover;
    @ViewChildren("testSuiteFileUploadPopup") testSuiteFileUploadPopup;

    @Output() closeEditTestCase = new EventEmitter<any>();

    @Input("testCaseDetails")
    set _testCaseDetails(data: any) {
        if (data) {
            this.testCaseDetail = data;
            this.timeStamp = this.testCaseDetail.timeStamp;
            this.loadDropdowns();
            this.initializeTestCaseForm(this.testCaseDetail);
            this.convertTimeToSuitableFormat(this.testCaseDetail.estimate);
            if (this.testCaseDetail.testCaseSteps) {
                this.testCaseSteps = this.addTestCaseForm.get('testCaseSteps') as FormArray;
                this.testCaseDetail.testCaseSteps.forEach(x => {
                    this.testCaseSteps.push(this.formBuilder.group({
                        stepId: x.stepId,
                        stepText: x.stepText,
                        stepExpectedResult: x.stepExpectedResult,
                        stepActualResult: x.stepActualResult,
                        stepStatusId: x.stepStatusId
                    }))
                })
                this.stepsCount = this.testCaseSteps.controls.length;
            }
            else
                this.stepsCount = 0;
            this.changeTemplate(this.testCaseDetail.templateName);
        }
    }

    @Input("isSprintUserStories")
    set _isSprintUserStories(data: boolean) {
        this.isSprintUserStories = data;
    }

    testCaseSectionsList$: Observable<TestCaseDropdownList[]>;
    testCaseTypesList$: Observable<TestCaseDropdownList[]>;
    testCasePrioritiesList$: Observable<TestCaseDropdownList[]>;
    testCaseTemplatesList$: Observable<TestCaseDropdownList[]>;
    testCaseAutomationsList$: Observable<TestCaseDropdownList[]>;
    testCaseDetails$: Observable<TestCase>;
    testCases$: Observable<TestCase[]>;
    anyOperationInProgress$: Observable<boolean>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    isSprintUserStories: boolean;
    public ngDestroyed$ = new Subject();

    softLabels: SoftLabelConfigurationModel[];
    testCaseDetails: TestCase;
    templatesList: TestCaseDropdownList[];
    sectionsList: TestCaseDropdownList[];
    typesList: TestCaseDropdownList[];
    prioritiesList: TestCaseDropdownList[];
    automationsList: TestCaseDropdownList[];
    dropDownList: TestCaseDropdownList;
    testCase: TestCase;
    testCaseDetail: any;

    addTestCaseForm: FormGroup;
    testCaseSteps: FormArray;

    uploadSaveUrl = 'saveUrl';
    uploadRemoveUrl = 'removeUrl';
    noOfMinutesInADay: number = 480;
    noOfMinutesInAnHour: number = 60;
    noOfSecondsInADay: number = 28800;
    noOfSecondsInAnHour: number = 3600;
    noOfSecondsInAMinute: number = 60;
    maxEstimateMinutes: number = 5940;
    maxEstimateSeconds: number = 356400;
    textShow: boolean = true;
    exploratoryShow: boolean = false;
    stepsShow: boolean = false;
    showStepsCard: boolean = false;
    editTestCase: boolean = false;
    disabledTestCase: boolean = false;
    changeTestCase: boolean = false;
    loadDetails: boolean = false;
    selectedSection: string = '';
    selectedType: string = '';
    selectedPriorityType: string = '';
    selectedAutomationType: string = '';
    projectId: string;
    testSuiteId: string;
    tabIndex: number;
    testCaseId: string;
    removableIndex: number;
    stepsCount: number = -1;
    exploratoryId: string;
    testCaseStepsId: string;
    testCaseTextId: string;
    selectedTemplate: any;
    timeStamp: any;

    fileUploadPopover: boolean = false;
    selectedStoreId: null;
    moduleTypeId: number = 6;
    isButtonVisible: boolean = true;
    referenceTypeId: string;
    referenceId: string;
    testSuiteCaseMissionReferenceTypeId = ConstantVariables.TestSuiteCaseMissionReferenceTypeId;
    testSuiteCaseGoalReferenceTypeId = ConstantVariables.TestSuiteCaseGoalReferenceTypeId;
    testSuiteCasePreconditionReferenceTypeId = ConstantVariables.TestSuiteCasePreconditionReferenceTypeId;
    testSuiteTextDescriptionReferenceTypeId = ConstantVariables.TestSuiteTextDescriptionReferenceTypeId;
    testSuiteTextExpectedReferenceTypeId = ConstantVariables.TestSuiteTextExpectedReferenceTypeId;
    testSuiteCaseReferenceTypeId = ConstantVariables.TestSuiteCaseReferenceTypeId;
    testSuiteStepDescriptionReferenceTypeId = ConstantVariables.TestSuiteStepDescriptionReferenceTypeId;
    testSuiteStepExpectedReferenceTypeId = ConstantVariables.TestSuiteStepExpectedReferenceTypeId;

    constructor(private testrailStore: Store<testRailModuleReducer.State>,
         private actionUpdates$: Actions, private formBuilder: FormBuilder, private toastr: ToastrService, private translateService: TranslateService, private cdRef: ChangeDetectorRef) {
        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.TestCaseEditWithInPlaceUpdate),
            tap(() => {
                this.disabledTestCase = false;
                this.closeTestCaseEditDialog();
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(TestCaseActionTypes.LoadTestCaseFailed),
                tap(() => {
                    this.disabledTestCase = false;
                    this.cdRef.markForCheck();
                })
            ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadTestCaseStepAfterEditCompleted),
            tap((result: any) => {
                if (result.searchSingleAddCaseDetails) {
                    let caseData = result.searchSingleAddCaseDetails;
                    if (caseData.testCaseSteps) {
                        this.testCaseSteps = this.addTestCaseForm.get('testCaseSteps') as FormArray;
                        caseData.testCaseSteps.forEach((x, i) => {
                            this.testCaseSteps.at(i).patchValue({
                                stepId: x.stepId
                            });
                        });
                    }
                    this.timeStamp = caseData.timeStamp;
                    this.disabledTestCase = false;
                    this.cdRef.detectChanges();
                }
            })
        ).subscribe();
    }

    ngOnInit() {
        this.getSoftLabels();
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    loadDropdowns() {
        this.dropDownList = new TestCaseDropdownList();
        this.dropDownList.isArchived = false;

         this.testrailStore.dispatch(new LoadTestCaseTemplateListTriggered(this.dropDownList));
         this.testCaseTemplatesList$ = this.testrailStore.pipe(select(testRailModuleReducer.getTestCaseTemplateAll));

         this.testrailStore.dispatch(new LoadTestCaseSectionListTriggered(this.testCaseDetail.testSuiteId));
         this.testCaseSectionsList$ = this.testrailStore.pipe(select(testRailModuleReducer.getTestCaseSectionAll));

         this.testrailStore.dispatch(new LoadTestCaseTypeListTriggered(this.dropDownList));
         this.testCaseTypesList$ = this.testrailStore.pipe(select(testRailModuleReducer.getTestCaseTypeAll));

         this.testrailStore.dispatch(new LoadTestCasePriorityListTriggered(this.dropDownList));
         this.testCasePrioritiesList$ = this.testrailStore.pipe(select(testRailModuleReducer.getTestCasePriorityAll));

         this.testrailStore.dispatch(new LoadTestCaseAutomationListTriggered(this.dropDownList));
         this.testCaseAutomationsList$ = this.testrailStore.pipe(select(testRailModuleReducer.getTestCaseAutomationAll));

         this.anyOperationInProgress$ = this.testrailStore.pipe(select(testRailModuleReducer.getTestCaseAutomateTypesLoading));
    }

    onChangeTemplate(event: any) {
        this.selectedTemplate = event.source.selected._element.nativeElement.innerText.trim();
        this.changeTemplate(this.selectedTemplate);
    }

    onChangeSectionId(value) {
        if (value != this.testCaseDetail.sectionId) {
            this.changeTestCase = true;
            this.addTestCaseForm.patchValue({
                sectionId: value
            });
        }
        else
            this.changeTestCase = false;
    }

    changeTemplate(value) {
        if (value == testCaseSteps) {
            this.stepsShow = true;
            this.textShow = false;
            this.exploratoryShow = false;
        }
        else if (value == testCaseText) {
            this.stepsShow = false;
            this.textShow = true;
            this.exploratoryShow = false;
        }
        else if (value == exploratorySession) {
            this.stepsShow = false;
            this.textShow = false;
            this.exploratoryShow = true;
        }
    }

    showSteps() {
        this.showStepsCard = true;
    }

    createItem(): FormGroup {
        return this.formBuilder.group({
            stepId: '',
            stepText: '',
            stepExpectedResult: '',
            stepActualResult: '',
            stepStatusId: '',
            stepOrder: 0
        });
    }

    // addItem(index): void {
    //     this.testCaseSteps = this.addTestCaseForm.get('testCaseSteps') as FormArray;
    //     this.testCaseSteps.insert(index + 1, this.createItem());
    //     this.stepsCount = this.testCaseSteps.controls.length;
    // }
    

    addItem(index): void {
        if (this.addTestCaseForm.value.title == '' || this.addTestCaseForm.value.title == null) {
            this.toastr.warning(this.translateService.instant(ConstantVariables.PleaseFillTestCaseTitle));
        }
        else if (this.addTestCaseForm.value.title.length > 500) {
            this.toastr.warning(this.translateService.instant(ConstantVariables.TestCaseTitleShouldNotExceed500Characters));
        }
        else if (!this.disabledTestCase) {
            this.testCaseSteps = this.addTestCaseForm.get('testCaseSteps') as FormArray;
            this.testCaseSteps.insert(index + 1, this.createItem());
            this.stepsCount = this.testCaseSteps.controls.length;
            this.addNewTestCaseStep();
        }
    }

    addNewTestCase() {
        this.disabledTestCase = true;
        this.testCase = new TestCase();
        this.testCase = this.addTestCaseForm.value;
        let timeInSeconds = this.convertEstimateToSeconds(this.testCase.estimate);
        if (timeInSeconds != 'false') {
            if (this.changeTestCase)
                this.testCase.changeSection = true;
            if (this.testCase.testCaseSteps.length > 0) {
                this.testCase.testCaseSteps.forEach((x, i) => {
                    x.stepOrder = i + 1;
                });
            }
            this.testCase.estimate = timeInSeconds;
            this.testCase.testCaseId = this.testCaseDetail.testCaseId;
            this.testCase.testSuiteId = this.testCaseDetail.testSuiteId;
            this.testCase.oldSectionId = this.testCaseDetail.sectionId;
            this.testCase.sectionId = this.testCaseDetail.sectionId;
            this.testCase.userStoryId = this.testCaseDetail.userStoryId;
            this.testCase.timeStamp = this.timeStamp;
            this.testrailStore.dispatch(new LoadTestCaseTriggered(this.testCase));
            this.convertTimeToSuitableFormat(timeInSeconds);
        }
        else {
            this.disabledTestCase = false;
            this.toastr.error(this.translateService.instant(ConstantVariables.ErrorMessageForExceedingTestCaseHours));
            this.cdRef.detectChanges();
        }
    }

    removeItem(index, deleteStepPopover) {
        this.removableIndex = index;
        deleteStepPopover.openPopover();
    }

    removeItemAtIndex() {
        this.testCaseSteps.removeAt(this.removableIndex);
        this.stepsCount = this.testCaseSteps.controls.length;
        this.closeDeleteStepDialog();
    }

    convertEstimateToSeconds(estimateTime) {
        if (estimateTime && estimateTime != '') {
            let estimate;
            if (estimateTime.includes('d') && estimateTime.includes('h') && estimateTime.includes('m') && estimateTime.includes('s')) {
                estimate = this.getTimeInDayHourMinSec(estimateTime);
            }
            else if (estimateTime.includes('d') && estimateTime.includes('h') && estimateTime.includes('m')) {
                estimate = this.getTimeInDayHourMin(estimateTime);
            }
            else if (estimateTime.includes('d') && estimateTime.includes('h') && estimateTime.includes('s')) {
                estimate = this.getTimeInDayHourSec(estimateTime);
            }
            else if (estimateTime.includes('d') && estimateTime.includes('h')) {
                estimate = this.getTimeInDayHour(estimateTime);
            }
            else if (estimateTime.includes('d') && estimateTime.includes('m') && estimateTime.includes('s')) {
                estimate = this.getTimeInDayMinSec(estimateTime);
            }
            else if (estimateTime.includes('d') && estimateTime.includes('m')) {
                estimate = this.getTimeInDayMin(estimateTime);
            }
            else if (estimateTime.includes('d') && estimateTime.includes('s')) {
                estimate = this.getTimeInDaySec(estimateTime);
            }
            else if (estimateTime.includes('d')) {
                estimate = this.getTimeInDay(estimateTime);
            }
            else if (estimateTime.includes('h') && estimateTime.includes('m') && estimateTime.includes('s')) {
                estimate = this.getTimeInHourMinSec(estimateTime);
            }
            else if (estimateTime.includes('h') && estimateTime.includes('m')) {
                estimate = this.getTimeInHourMin(estimateTime);
            }
            else if (estimateTime.includes('h') && estimateTime.includes('s')) {
                estimate = this.getTimeInHourSec(estimateTime);
            }
            else if (estimateTime.includes('h')) {
                estimate = this.getTimeInHour(estimateTime);
            }
            else if (estimateTime.includes('m') && estimateTime.includes('s')) {
                estimate = this.getTimeInMinSec(estimateTime);
            }
            else if (estimateTime.includes('m')) {
                estimate = this.getTimeInMin(estimateTime);
            }
            else if (estimateTime.includes('s')) {
                estimate = this.getTimeInSec(estimateTime);
            }
            if (estimate > this.maxEstimateSeconds)
                return 'false';
            else
                return estimate;
        }
    }

    getTimeInDayHourMinSec(estimateTime) {
        let days = estimateTime.substring(0, estimateTime.indexOf("d"));
        let hours = estimateTime.substring(estimateTime.lastIndexOf("d") + 1, estimateTime.lastIndexOf("h"));
        let minutes = estimateTime.substring(estimateTime.lastIndexOf("h") + 1, estimateTime.lastIndexOf("m"));
        let secs = estimateTime.substring(estimateTime.lastIndexOf("m") + 1, estimateTime.lastIndexOf("s"));
        let totalSeconds = ((days * this.noOfSecondsInADay) + (hours * this.noOfSecondsInAnHour) + (minutes * this.noOfSecondsInAMinute) + (secs * 1));
        return totalSeconds;
    }

    getTimeInDayHourMin(estimateTime) {
        let days = estimateTime.substring(0, estimateTime.indexOf("d"));
        let hours = estimateTime.substring(estimateTime.lastIndexOf("d") + 1, estimateTime.lastIndexOf("h"));
        let minutes = estimateTime.substring(estimateTime.lastIndexOf("h") + 1, estimateTime.lastIndexOf("m"));
        let totalSeconds = ((days * this.noOfSecondsInADay) + (hours * this.noOfSecondsInAnHour) + (minutes * this.noOfSecondsInAMinute));
        return totalSeconds;
    }

    getTimeInDayHourSec(estimateTime) {
        let days = estimateTime.substring(0, estimateTime.indexOf("d"));
        let hours = estimateTime.substring(estimateTime.lastIndexOf("d") + 1, estimateTime.lastIndexOf("h"));
        let secs = estimateTime.substring(estimateTime.lastIndexOf("h") + 1, estimateTime.lastIndexOf("s"));
        let totalSeconds = ((days * this.noOfSecondsInADay) + (hours * this.noOfSecondsInAnHour) + (secs * 1));
        return totalSeconds;
    }

    getTimeInDayHour(estimateTime) {
        let days = estimateTime.substring(0, estimateTime.indexOf("d"));
        let hours = estimateTime.substring(estimateTime.lastIndexOf("d") + 1, estimateTime.lastIndexOf("h"));
        let totalSeconds = ((days * this.noOfSecondsInADay) + (hours * this.noOfSecondsInAnHour));
        return totalSeconds;
    }

    getTimeInDayMinSec(estimateTime) {
        let days = estimateTime.substring(0, estimateTime.indexOf("d"));
        let minutes = estimateTime.substring(estimateTime.lastIndexOf("d") + 1, estimateTime.lastIndexOf("m"));
        let secs = estimateTime.substring(estimateTime.lastIndexOf("m") + 1, estimateTime.lastIndexOf("s"));
        let totalSeconds = ((days * this.noOfSecondsInADay) + (minutes * this.noOfSecondsInAMinute) + (secs * 1));
        return totalSeconds;
    }

    getTimeInDayMin(estimateTime) {
        let days = estimateTime.substring(0, estimateTime.indexOf("d"));
        let minutes = estimateTime.substring(estimateTime.lastIndexOf("d") + 1, estimateTime.lastIndexOf("m"));
        let totalSeconds = ((days * this.noOfSecondsInADay) + (minutes * this.noOfSecondsInAMinute));
        return totalSeconds;
    }

    getTimeInDaySec(estimateTime) {
        let days = estimateTime.substring(0, estimateTime.indexOf("d"));
        let secs = estimateTime.substring(estimateTime.lastIndexOf("d") + 1, estimateTime.lastIndexOf("s"));
        let totalSeconds = ((days * this.noOfSecondsInADay) + (secs * 1));
        return totalSeconds;
    }

    getTimeInDay(estimateTime) {
        let days = estimateTime.substring(0, estimateTime.indexOf("d"));
        let totalSeconds = days * this.noOfSecondsInADay;
        return totalSeconds;
    }

    getTimeInHourMinSec(estimateTime) {
        let hours = estimateTime.substring(0, estimateTime.indexOf("h"));
        let minutes = estimateTime.substring(estimateTime.lastIndexOf("h") + 1, estimateTime.lastIndexOf("m"));
        let secs = estimateTime.substring(estimateTime.lastIndexOf("m") + 1, estimateTime.lastIndexOf("s"));
        let totalSeconds = ((hours * this.noOfSecondsInAnHour) + (minutes * this.noOfSecondsInAMinute) + (secs * 1));
        return totalSeconds;
    }

    getTimeInHourMin(estimateTime) {
        let hours = estimateTime.substring(0, estimateTime.indexOf("h"));
        let minutes = estimateTime.substring(estimateTime.lastIndexOf("h") + 1, estimateTime.lastIndexOf("m"));
        let totalSeconds = ((hours * this.noOfSecondsInAnHour) + (minutes * this.noOfSecondsInAMinute));
        return totalSeconds;
    }

    getTimeInHourSec(estimateTime) {
        let hours = estimateTime.substring(0, estimateTime.indexOf("h"));
        let secs = estimateTime.substring(estimateTime.lastIndexOf("h") + 1, estimateTime.lastIndexOf("s"));
        let totalSeconds = ((hours * this.noOfSecondsInAnHour) + (secs * 1));
        return totalSeconds;
    }

    getTimeInHour(estimateTime) {
        let hours = estimateTime.substring(0, estimateTime.indexOf("h"));
        let totalSeconds = hours * this.noOfSecondsInAnHour;
        return totalSeconds;
    }

    getTimeInMinSec(estimateTime) {
        let minutes = estimateTime.substring(0, estimateTime.indexOf("m"));
        let secs = estimateTime.substring(estimateTime.lastIndexOf("m") + 1, estimateTime.lastIndexOf("s"));
        let totalSeconds = ((minutes * this.noOfSecondsInAMinute) + (secs * 1));
        return totalSeconds;
    }

    getTimeInMin(estimateTime) {
        let minutes = estimateTime.substring(0, estimateTime.indexOf("m"));
        let totalSeconds = minutes * this.noOfSecondsInAMinute;
        return totalSeconds;
    }

    getTimeInSec(estimateTime) {
        let secs = estimateTime.substring(0, estimateTime.indexOf("s"));
        let totalSeconds = secs * 1;
        return totalSeconds;
    }

    convertTimeToSuitableFormat(estimateTime) {
        if (estimateTime != null && estimateTime != undefined && estimateTime != '' && estimateTime != 0) {
            let finalString = '';
            let remainingTime = estimateTime;
            let days = Math.floor(remainingTime / this.noOfSecondsInADay);
            remainingTime = remainingTime - (days * this.noOfSecondsInADay);
            let hours = Math.floor(remainingTime / this.noOfSecondsInAnHour);
            remainingTime = remainingTime - (hours * this.noOfSecondsInAnHour);
            if (days > 0)
                finalString = finalString + days + 'd';
            if (hours > 0)
                finalString = finalString + hours + 'h';
            if (remainingTime > 0) {
                let minutes = Math.floor(remainingTime / 60);
                remainingTime = remainingTime - (minutes * this.noOfSecondsInAMinute);
                if (minutes > 0)
                    finalString = finalString + minutes + 'm';
                if (remainingTime > 0) {
                    finalString = finalString + remainingTime + 's';
                }
            }
            this.addTestCaseForm.patchValue({
                estimate: finalString
            });
        }
        else {
            this.addTestCaseForm.patchValue({
                estimate: ''
            });
        }
    }

    initializeTestCaseForm(caseDetails) {
        this.addTestCaseForm = new FormGroup({
            title: new FormControl(caseDetails.title, Validators.compose([Validators.required, Validators.maxLength(500)])),
            sectionId: new FormControl(caseDetails.sectionId, Validators.compose([Validators.required])),
            sectionName: new FormControl(caseDetails.sectionName, Validators.compose([])),
            templateId: new FormControl(caseDetails.templateId, Validators.compose([Validators.required])),
            typeId: new FormControl(caseDetails.typeId, Validators.compose([Validators.required])),
            priorityId: new FormControl(caseDetails.priorityId, Validators.compose([Validators.required])),
            estimate: new FormControl('', Validators.compose([Validators.pattern(/^[0-9]{1,3}[d][0-9]{1,3}[h][0-9]{1,3}[m][0-9]{1,3}[s]$|^[0-9]{1,3}[d][0-9]{1,3}[h][0-9]{1,3}[m]$|^[0-9]{1,3}[d][0-9]{1,3}[h][0-9]{1,3}[s]$|^[0-9]{1,3}[d][0-9]{1,3}[h]$|^[0-9]{1,3}[d][0-9]{1,3}[m][0-9]{1,3}[s]$|^[0-9]{1,3}[d][0-9]{1,3}[m]$|^[0-9]{1,3}[d][0-9]{1,3}[s]$|^[0-9]{1,3}[d]$|^[0-9]{1,3}[h][0-9]{1,3}[m][0-9]{1,3}[s]$|^[0-9]{1,3}[h][0-9]{1,3}[m]$|^[0-9]{1,3}[h][0-9]{1,3}[s]$|^[0-9]{1,3}[h]$|^[0-9]{1,3}[m][0-9]{1,3}[s]$|^[0-9]{1,3}[m]$|^[0-9]{1,3}[s]$/)])),
            automationTypeId: new FormControl(caseDetails.automationTypeId, Validators.compose([Validators.required])),
            precondition: new FormControl(caseDetails.precondition, []),
            steps: new FormControl(caseDetails.steps, []),
            expectedResult: new FormControl(caseDetails.expectedResult, []),
            mission: new FormControl(caseDetails.mission, []),
            goals: new FormControl(caseDetails.goals, []),
            assignToId: new FormControl(caseDetails.assignToId, []),
            assignToComment: new FormControl(caseDetails.assignToComment, []),
            statusId: new FormControl(caseDetails.statusId, []),
            statusName: new FormControl(caseDetails.statusName, []),
            statusComment: new FormControl(caseDetails.statusComment, []),
            statusColor: new FormControl(caseDetails.statusColor, []),
            testCaseSteps: this.formBuilder.array([]),
            references: new FormControl(caseDetails.references, [])
        });
    }

    closeDeleteStepDialog() {
        this.deleteStepsPopover.forEach((p) => p.closePopover());
    }

    closeTestCaseEditDialog() {
        this.closeEditTestCase.emit('');
    }

    addNewTestCaseStep() {
        this.disabledTestCase = true;
        this.testCase = new TestCase();
        this.testCase = this.addTestCaseForm.value;
        let timeInSeconds = this.convertEstimateToSeconds(this.testCase.estimate);
        if (timeInSeconds != 'false') {
            if (this.changeTestCase)
                this.testCase.changeSection = true;
            if (this.testCase.testCaseSteps.length > 0) {
                this.testCase.testCaseSteps.forEach((x, i) => {
                    x.stepOrder = i + 1;
                });
            }
            this.testCase.estimate = timeInSeconds;
            this.testCase.testCaseId = this.testCaseDetail.testCaseId;
            this.testCase.testSuiteId = this.testCaseDetail.testSuiteId;
            this.testCase.oldSectionId = this.testCaseDetail.sectionId;
            this.testCase.timeStamp = this.timeStamp;
            this.testrailStore.dispatch(new LoadTestCaseStepTriggered(this.testCase));
            this.convertTimeToSuitableFormat(timeInSeconds);
        }
        else {
            this.disabledTestCase = false;
            this.toastr.error(this.translateService.instant(ConstantVariables.ErrorMessageForExceedingTestCaseHours));
            this.cdRef.detectChanges();
        }
    }

    openFileUploadPopover(referenceId, referenceTypeId, testSuiteFileUploadPopover) {
        this.fileUploadPopover = !this.fileUploadPopover;
        testSuiteFileUploadPopover.openPopover();
        this.referenceTypeId = referenceTypeId;
        this.referenceId = referenceId;
    }

    closeFileUploadPopover() {
        this.testSuiteFileUploadPopup.forEach((p) => p.closePopover());
        this.referenceTypeId = null
        this.referenceId = null;
        this.fileUploadPopover = false;
    }

    addNewItem() {
        this.addItem((this.addTestCaseForm.get('testCaseSteps') as FormArray).length - 1);
        this.addItem(this.addItem((this.addTestCaseForm.get('testCaseSteps') as FormArray).length - 1));
    }

    getStepControls() {
        return (this.addTestCaseForm.get('testCaseSteps') as FormArray).controls;
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}