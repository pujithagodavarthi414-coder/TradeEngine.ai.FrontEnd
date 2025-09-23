import { Component, ChangeDetectionStrategy, ViewChildren, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

import { TestCaseDropdownList } from '../models/testcasedropdown';
import { TestCase } from '../models/testcase';

import { State } from "../store/reducers/index";
import * as testRailModuleReducer from "../store/reducers/index";

import { LoadTestCaseSectionListTriggered } from "../store/actions/testcasesections.actions";
import { LoadTestCaseTypeListTriggered } from "../store/actions/testcasetypes.actions";
import { LoadTestCasePriorityListTriggered } from "../store/actions/testcasepriorities.actions";
import { LoadTestCaseTemplateListTriggered } from "../store/actions/testcasetemplates.actions";
import { LoadTestCaseAutomationListTriggered } from "../store/actions/testcaseautomationtypes.actions";
import { LoadTestCaseTriggered, TestCaseActionTypes, LoadSingleTestCaseBySectionIdTriggered, LoadTestCaseStepTriggered } from '../store/actions/testcaseadd.actions';

import { ConstantVariables } from '../constants/constant-variables';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';

const exploratorySession = ConstantVariables.ExploratorySession;
const testCaseSteps = ConstantVariables.TestCaseSteps;
const testCaseText = ConstantVariables.TestCaseText;

@Component({
    selector: 'testcase-edit',
    templateUrl: './testcase-edit.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestCaseEditComponent {
    @ViewChildren('deleteStepPopover') deleteStepsPopover;
    @ViewChildren("testSuiteFileUploadPopup") testSuiteFileUploadPopup;
    @Output() closePreview = new EventEmitter<any>();

    @Input("testCaseDetails")
    set _testCaseDetails(data: any) {
        if (data) {
            this.testCaseDetail = data;
            this.timeStamp = this.testCaseDetail.timeStamp;
            this.loadDropdowns();
            this.loadCaseDetails(this.testCaseDetail);
        }
    }

    testCaseSectionsList$: Observable<TestCaseDropdownList[]>;
    testCaseTypesList$: Observable<TestCaseDropdownList[]>;
    testCasePrioritiesList$: Observable<TestCaseDropdownList[]>;
    testCaseTemplatesList$: Observable<TestCaseDropdownList[]>;
    testCaseAutomationsList$: Observable<TestCaseDropdownList[]>;
    testCaseDetails$: Observable<TestCase>;
    testCases$: Observable<TestCase[]>;
    anyOperationInProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();

    testCaseDetails: TestCase;
    testCaseInfo: TestCase;
    templatesList: TestCaseDropdownList[];
    sectionsList: TestCaseDropdownList[];
    typesList: TestCaseDropdownList[];
    prioritiesList: TestCaseDropdownList[];
    automationsList: TestCaseDropdownList[];
    dropDownList: TestCaseDropdownList;
    testCase: TestCase;
    testCaseDetail: any;
    softLabels: SoftLabelConfigurationModel[];

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
    preFilePath = [];
    stepMostFilePath = [];
    expectedMostFilePath = [];
    projectId: string;
    testSuiteId: string;
    tabIndex: number;
    testCaseId: string;
    removableIndex: number;
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

    constructor(private store: Store<State>, private actionUpdates$: Actions, private formBuilder: FormBuilder, private toastr: ToastrService, private translateService: TranslateService, private cdRef: ChangeDetectorRef) {
        this.anyOperationInProgress$ = this.store.pipe(select(testRailModuleReducer.getSingleTestCaseDetailsLoading));

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadSingleTestCaseBySectionIdTriggered),
            tap(() => {
                this.loadDetails = false;
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadSingleTestCaseBySectionIdCompleted),
            tap(() => {
                this.testCaseDetails$.subscribe(result => {
                    if (result) {
                        let casedetails = result;
                        this.testCaseInfo = result;
                        if (casedetails.preConditionFilePath != null)
                            this.preFilePath = casedetails.preConditionFilePath.split(',');
                        else
                            this.preFilePath = [];
                        if (casedetails.stepsFilePath != null)
                            this.stepMostFilePath = casedetails.stepsFilePath.split(',');
                        else
                            this.stepMostFilePath = [];
                        if (casedetails.expectedResultFilePath != null)
                            this.expectedMostFilePath = casedetails.expectedResultFilePath.split(',');
                        else
                            this.expectedMostFilePath = [];
                        this.timeStamp = casedetails.timeStamp;
                        this.initializeTestCaseForm(casedetails);
                        this.convertTimeToSuitableFormat(casedetails.estimate);
                        if (casedetails.testCaseSteps) {
                            this.testCaseSteps = this.addTestCaseForm.get('testCaseSteps') as FormArray;
                            casedetails.testCaseSteps.forEach(x => {
                                this.testCaseSteps.push(this.formBuilder.group({
                                    stepId: x.stepId,
                                    stepText: x.stepText,
                                    stepTextFilePath: x.stepTextFilePath,
                                    stepExpectedResult: x.stepExpectedResult,
                                    stepExpectedResultFilePath: x.stepExpectedResultFilePath,
                                    stepActualResult: x.stepActualResult,
                                    stepStatusId: x.stepStatusId,
                                    stepCreated: 0
                                }))
                            })
                        }
                        this.changeTemplate(casedetails.templateName);
                        this.cdRef.markForCheck();
                    }
                })
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.TestCaseEditWithInPlaceUpdate),
            tap(() => {
                this.disabledTestCase = false;
                this.testCases$ = this.store.pipe(select(testRailModuleReducer.getTestCaseEditDetailsByTestCaseId, { testCaseId: this.testCaseDetail.testCaseId }));
                this.testCases$.subscribe(result => {
                    if (result && result.length > 0) {
                        let caseData = result[0];
                        this.timeStamp = caseData.timeStamp;
                    }
                })
                this.cdRef.detectChanges();
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
            )
            .subscribe();

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
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }

    loadDropdowns() {
        this.dropDownList = new TestCaseDropdownList();
        this.dropDownList.isArchived = false;

        this.store.dispatch(new LoadTestCaseTemplateListTriggered(this.dropDownList));
        this.testCaseTemplatesList$ = this.store.pipe(select(testRailModuleReducer.getTestCaseTemplateAll));

        this.store.dispatch(new LoadTestCaseSectionListTriggered(this.testCaseDetail.testSuiteId));
        this.testCaseSectionsList$ = this.store.pipe(select(testRailModuleReducer.getTestCaseSectionAll));

        this.store.dispatch(new LoadTestCaseTypeListTriggered(this.dropDownList));
        this.testCaseTypesList$ = this.store.pipe(select(testRailModuleReducer.getTestCaseTypeAll));

        this.store.dispatch(new LoadTestCasePriorityListTriggered(this.dropDownList));
        this.testCasePrioritiesList$ = this.store.pipe(select(testRailModuleReducer.getTestCasePriorityAll));

        this.store.dispatch(new LoadTestCaseAutomationListTriggered(this.dropDownList));
        this.testCaseAutomationsList$ = this.store.pipe(select(testRailModuleReducer.getTestCaseAutomationAll));

        // this.anyOperationInProgress$ = this.store.pipe(select(testRailModuleReducer.getTestCaseAutomateTypesLoading));
    }

    onChangeTemplate(event: any) {
        this.selectedTemplate = event.source.selected._element.nativeElement.innerText.trim();
        this.changeTemplate(this.selectedTemplate);
    }

    loadCaseDetails(caseDetails) {
        let testCaseSearch = new TestCase();
        testCaseSearch.sectionId = caseDetails.sectionId;
        testCaseSearch.testCaseId = caseDetails.testCaseId;
        testCaseSearch.isArchived = false;
        this.store.dispatch(new LoadSingleTestCaseBySectionIdTriggered(testCaseSearch));
        this.testCaseDetails$ = this.store.pipe(select(testRailModuleReducer.getSingleTestCaseDetailsByCaseId));
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
            stepOrder: 0,
            stepCreated: 1
        });
    }

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
            this.testCase.timeStamp = this.timeStamp;
            this.store.dispatch(new LoadTestCaseTriggered(this.testCase));
            this.convertTimeToSuitableFormat(timeInSeconds);
        }
        else {
            this.disabledTestCase = false;
            this.toastr.error(this.translateService.instant(ConstantVariables.ErrorMessageForExceedingTestCaseHours));
            this.cdRef.detectChanges();
        }
    }

    getStepControls() {
        return (this.addTestCaseForm.get('testCaseSteps') as FormArray).controls;
    }

    getControlsLength() {
        this.addItem((this.addTestCaseForm.get('testCaseSteps') as FormArray).length - 1);
    }

    validateStepsLength() {
        let length = (this.addTestCaseForm.get('testCaseSteps') as FormArray).length;
        if (length == 0)
            return true;
        else
            return false;
    }

    removeItem(index, deleteStepPopover) {
        if (this.addTestCaseForm.value.title == '' || this.addTestCaseForm.value.title == null) {
            this.toastr.warning(this.translateService.instant(ConstantVariables.PleaseFillTestCaseTitle));
        }
        else if (this.addTestCaseForm.value.title.length > 500) {
            this.toastr.warning(this.translateService.instant(ConstantVariables.TestCaseTitleShouldNotExceed500Characters));
        }
        else if (!this.disabledTestCase) {
            this.removableIndex = index;
            deleteStepPopover.openPopover();
        }
    }

    removeItemAtIndex() {
        this.testCaseSteps.removeAt(this.removableIndex);
        this.addNewTestCaseStep();
        this.closeDeleteStepDialog();
    }

    getStepTextImagesArray(index) {
        let data = this.testCaseSteps.at(index).get('stepTextFilePath').value;
        return data.split(',');
    }

    getStepResultImagesArray(index) {
        let data = this.testCaseSteps.at(index).get('stepExpectedResultFilePath').value;
        return data.split(',');
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
            templateId: new FormControl(caseDetails.templateId, Validators.compose([Validators.required])),
            typeId: new FormControl(caseDetails.typeId, Validators.compose([Validators.required])),
            priorityId: new FormControl(caseDetails.priorityId, Validators.compose([Validators.required])),
            estimate: new FormControl('', Validators.compose([Validators.pattern(/^[0-9]{1,3}[d][0-9]{1,3}[h][0-9]{1,3}[m][0-9]{1,3}[s]$|^[0-9]{1,3}[d][0-9]{1,3}[h][0-9]{1,3}[m]$|^[0-9]{1,3}[d][0-9]{1,3}[h][0-9]{1,3}[s]$|^[0-9]{1,3}[d][0-9]{1,3}[h]$|^[0-9]{1,3}[d][0-9]{1,3}[m][0-9]{1,3}[s]$|^[0-9]{1,3}[d][0-9]{1,3}[m]$|^[0-9]{1,3}[d][0-9]{1,3}[s]$|^[0-9]{1,3}[d]$|^[0-9]{1,3}[h][0-9]{1,3}[m][0-9]{1,3}[s]$|^[0-9]{1,3}[h][0-9]{1,3}[m]$|^[0-9]{1,3}[h][0-9]{1,3}[s]$|^[0-9]{1,3}[h]$|^[0-9]{1,3}[m][0-9]{1,3}[s]$|^[0-9]{1,3}[m]$|^[0-9]{1,3}[s]$/)])),
            automationTypeId: new FormControl(caseDetails.automationTypeId, Validators.compose([Validators.required])),
            precondition: new FormControl(caseDetails.precondition, []),
            preConditionFilePath: new FormControl(caseDetails.preConditionFilePath, []),
            steps: new FormControl(caseDetails.steps, []),
            stepsFilePath: new FormControl(caseDetails.stepsFilePath, []),
            expectedResult: new FormControl(caseDetails.expectedResult, []),
            expectedResultFilePath: new FormControl(caseDetails.expectedResultFilePath, []),
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
        this.closePreview.emit('');
    }

    openTestCasePopover(testSuiteFileUploadPopover) {
        this.fileUploadPopover = !this.fileUploadPopover;
        testSuiteFileUploadPopover.openPopover();
        this.referenceTypeId = ConstantVariables.TestSuiteCaseReferenceTypeId;
        this.referenceId = this.testCaseDetail.testCaseId;
    }

    closeTestSuitePopup() {
        this.testSuiteFileUploadPopup.forEach((p) => p.closePopover());
        this.referenceTypeId = null
        this.referenceId = null;
        this.fileUploadPopover = false;
    }

    openStepDescriptionPopover(index, testSuiteFileUploadPopover) {
        this.fileUploadPopover = !this.fileUploadPopover;
        testSuiteFileUploadPopover.openPopover();
        const stepId = this.testCaseSteps.at(index).get("stepId").value;
        this.referenceTypeId = ConstantVariables.TestSuiteStepDescriptionReferenceTypeId;
        this.referenceId = stepId;
    }

    openStepExpectedPopover(index, testSuiteFileUploadPopover) {
        this.fileUploadPopover = !this.fileUploadPopover;
        testSuiteFileUploadPopover.openPopover();
        const stepId = this.testCaseSteps.at(index).get("stepId").value;
        this.referenceTypeId = ConstantVariables.TestSuiteStepExpectedReferenceTypeId;
        this.referenceId = stepId;
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
            this.store.dispatch(new LoadTestCaseStepTriggered(this.testCase));
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

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}
