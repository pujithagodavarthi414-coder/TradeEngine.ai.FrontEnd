import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from "@ngrx/store";
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { SatPopover } from '@ncstate/sat-popover';

import "../../globaldependencies/helpers/fontawesome-icons";

import { Section } from '../models/sectionlist';
import { Template } from '../models/templatelist';
import { Type } from '../models/typelist';
import { Priority } from '../models/prioritylist';
import { Automation } from '../models/automationlist';
import { TestCaseDropdownList } from '../models/testcasedropdown';
import { TestCase } from '../models/testcase';

import { State } from "../store/reducers/index";
import * as testRailModuleReducer from "../store/reducers/index";

import { LoadTestCaseSectionListTriggered, TestCaseSectionActionTypes } from "../store/actions/testcasesections.actions";
import { LoadTestCaseTypeListTriggered, TestCasesActionTypes } from "../store/actions/testcasetypes.actions";
import { LoadTestCasePriorityListTriggered, TestCasePriorityActionTypes } from "../store/actions/testcasepriorities.actions";
import { LoadTestCaseTemplateListTriggered, TestCaseTemplateActionTypes } from "../store/actions/testcasetemplates.actions";
import { LoadTestCaseAutomationListTriggered, TestCaseAutomationActionTypes } from "../store/actions/testcaseautomationtypes.actions";
import { LoadTestCaseTriggered, TestCaseActionTypes, LoadTestCaseDetailsTriggered } from '../store/actions/testcaseadd.actions';

import { ConstantVariables } from '../constants/constant-variables';

const exploratorySession = ConstantVariables.ExploratorySession;
const testCaseSteps = ConstantVariables.TestCaseSteps;
const testCaseText = ConstantVariables.TestCaseText;
const testCaseType = ConstantVariables.TestCaseDefaultType;
const testCasePriority = ConstantVariables.TestCaseDefaultPriority;
const testCaseAutomation = ConstantVariables.TestCaseDefaultAutomation;

@Component({
  selector: 'app-testrail-component-testsuitesaddnewtestcasesview',
  templateUrl: './testsuites-addnew-testcase.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestSuitesCasesAddCaseViewComponent {
  @ViewChildren('deleteStepPopover') deleteStepsPopover;

  @Input() sections: Section[];
  @Input() templates: Template[];
  @Input() types: Type[];
  @Input() priorities: Priority[];
  @Input() automations: Automation[];

  testCaseSectionsList$: Observable<TestCaseDropdownList[]>;
  testCaseTypesList$: Observable<TestCaseDropdownList[]>;
  testCasePrioritiesList$: Observable<TestCaseDropdownList[]>;
  testCaseTemplatesList$: Observable<TestCaseDropdownList[]>;
  testCaseAutomationsList$: Observable<TestCaseDropdownList[]>;
  testCaseDetails$: Observable<TestCase>;
  anyOperationInProgress$: Observable<boolean>;

  testCaseDetails: TestCase;
  templatesList: TestCaseDropdownList[];
  sectionsList: TestCaseDropdownList[];
  typesList: TestCaseDropdownList[];
  prioritiesList: TestCaseDropdownList[];
  automationsList: TestCaseDropdownList[];
  dropDownList: TestCaseDropdownList;
  testCase: TestCase;

  addTestCaseForm: FormGroup;
  testCaseSteps: FormArray;

  uploadSaveUrl = 'saveUrl';
  uploadRemoveUrl = 'removeUrl';
  textShow: boolean = true;
  exploratoryShow: boolean = false;
  stepsShow: boolean = false;
  showStepsCard: boolean = false;
  editTestCase: boolean = false;
  disabledTestCase: boolean = false;
  selectedTemplate: string = '';
  selectedSection: string = '';
  selectedType: string = '';
  selectedPriorityType: string = '';
  selectedAutomationType: string = '';
  projectId: string;
  testSuiteId: string;
  tabIndex: number;
  testCaseId: string;
  removableIndex: number;
  exploratoryId: string;
  testCaseStepsId: string;
  testCaseTextId: string;

  constructor(private store: Store<State>, private actionUpdates$: Actions, private routes: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef) {
    this.route.params.subscribe(routeParams => {
      this.projectId = routeParams.id;
      this.tabIndex = routeParams.tab;
      this.testSuiteId = routeParams.testsuiteid;
      this.testCaseId = routeParams.testcaseid;
    });

    this.initializeTestCaseForm();

    this.dropDownList = new TestCaseDropdownList();
    this.dropDownList.isArchived = false;

    this.store.dispatch(new LoadTestCaseTemplateListTriggered(this.dropDownList));
    this.testCaseTemplatesList$ = this.store.pipe(select(testRailModuleReducer.getTestCaseTemplateAll));

    this.store.dispatch(new LoadTestCaseSectionListTriggered(this.testSuiteId));
    this.testCaseSectionsList$ = this.store.pipe(select(testRailModuleReducer.getTestCaseSectionAll));

    this.store.dispatch(new LoadTestCaseTypeListTriggered(this.dropDownList));
    this.testCaseTypesList$ = this.store.pipe(select(testRailModuleReducer.getTestCaseTypeAll));

    this.store.dispatch(new LoadTestCasePriorityListTriggered(this.dropDownList));
    this.testCasePrioritiesList$ = this.store.pipe(select(testRailModuleReducer.getTestCasePriorityAll));

    this.store.dispatch(new LoadTestCaseAutomationListTriggered(this.dropDownList));
    this.testCaseAutomationsList$ = this.store.pipe(select(testRailModuleReducer.getTestCaseAutomationAll));

    if (this.testCaseId) {
      this.editTestCase = true;
      this.store.dispatch(new LoadTestCaseDetailsTriggered(this.testCaseId));
      this.testCaseDetails$ = this.store.pipe(select(testRailModuleReducer.getTestCaseDetailsById));
      this.anyOperationInProgress$ = this.store.pipe(select(testRailModuleReducer.getTestCaseDetailsLoading));
    }
    else
      this.anyOperationInProgress$ = this.store.pipe(select(testRailModuleReducer.getTestCaseAutomateTypesLoading));

    this.actionUpdates$.pipe(
      ofType(TestCaseActionTypes.LoadTestCaseDetailsCompleted),
      tap(() => {
        this.testCaseDetails$.subscribe(result => {
          this.testCaseDetails = result;
          // this.onChangeTemplate(this.testCaseDetails.templateId);
          if (this.testCaseDetails.templateName == testCaseText) {
            this.textShow = true;
            this.exploratoryShow = false;
            this.stepsShow = false;
            this.showStepsCard = false;
          }
          if (this.testCaseDetails.templateName == exploratorySession) {
            this.textShow = false;
            this.exploratoryShow = true;
            this.stepsShow = false;
            this.showStepsCard = false;
          }
          if (this.testCaseDetails.templateName == testCaseSteps) {
            this.textShow = false;
            this.exploratoryShow = false;
            this.stepsShow = true;
            this.showStepsCard = false;
          }
          this.addTestCaseForm.patchValue({
            title: this.testCaseDetails.title,
            sectionId: this.testCaseDetails.sectionId,
            templateId: this.testCaseDetails.templateId,
            typeId: this.testCaseDetails.typeId,
            priorityId: this.testCaseDetails.priorityId,
            estimate: this.testCaseDetails.estimate,
            automationTypeId: this.testCaseDetails.automationTypeId,
            precondition: this.testCaseDetails.precondition,
            steps: this.testCaseDetails.steps,
            expectedResult: this.testCaseDetails.expectedResult,
            mission: this.testCaseDetails.mission,
            goals: this.testCaseDetails.goals
          });
          if (this.testCaseDetails.testCaseSteps) {
            this.testCaseSteps = this.addTestCaseForm.get('testCaseSteps') as FormArray;
            this.testCaseDetails.testCaseSteps.forEach(x => {
              this.testCaseSteps.push(this.formBuilder.group({
                stepText: x.stepText,
                stepExpectedResult: x.stepExpectedResult
              }))
            })
          }
          this.cdRef.detectChanges();
        });
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      ofType(TestCaseTemplateActionTypes.LoadTestCaseTemplateListCompleted),
      tap(() => {
        this.testCaseTemplatesList$.subscribe(result => {
          this.templatesList = result;
          this.exploratoryId = this.templatesList[this.templatesList.findIndex(x => x.value == exploratorySession)].id;
          this.testCaseStepsId = this.templatesList[this.templatesList.findIndex(x => x.value == testCaseSteps)].id;
          this.testCaseTextId = this.templatesList[this.templatesList.findIndex(x => x.value == testCaseText)].id;
          if (!this.testCaseId) {
            this.selectedTemplate = this.testCaseTextId;
            this.initializeTestCaseForm();
          }
        });
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      ofType(TestCasesActionTypes.LoadTestCaseTypeListCompleted),
      tap(() => {
        this.testCaseTypesList$.subscribe(result => {
          this.typesList = result;
          if (!this.testCaseId) {
            this.selectedType = this.typesList[this.typesList.findIndex(x => x.value == testCaseType)].id;
            this.initializeTestCaseForm();
          }
        });
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      ofType(TestCasePriorityActionTypes.LoadTestCasePriorityListCompleted),
      tap(() => {
        this.testCasePrioritiesList$.subscribe(result => {
          this.prioritiesList = result;
          if (!this.testCaseId) {
            this.selectedPriorityType = this.prioritiesList[this.prioritiesList.findIndex(x => x.value == testCasePriority)].id;
            this.initializeTestCaseForm();
          }
        });
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      ofType(TestCaseAutomationActionTypes.LoadTestCaseAutomationListCompleted),
      tap(() => {
        this.testCaseAutomationsList$.subscribe(result => {
          this.automationsList = result;
          if (!this.testCaseId) {
            this.selectedAutomationType = this.automationsList[this.automationsList.findIndex(x => x.value == testCaseAutomation)].id;
            this.initializeTestCaseForm();
          }
        });
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      ofType(TestCaseSectionActionTypes.LoadTestCaseSectionListCompleted),
      tap(() => {
        this.testCaseSectionsList$.subscribe(result => {
          this.sectionsList = result;
          if (!this.testCaseId) {
            this.selectedSection = this.sectionsList[0].id;
            this.initializeTestCaseForm();
          }
        });
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      ofType(TestCaseActionTypes.LoadTestCaseCompleted),
      tap(() => {
        this.initializeTestCaseForm();
        this.disabledTestCase = false;
        this.textShow = true;
        this.exploratoryShow = false;
        this.stepsShow = false;
        this.editTestCase = false;
        this.routes.navigateByUrl('testrail/testrailprojectview/' + this.projectId + '/' + 4 + '/testsuitesview/' + this.testSuiteId);
      })
    ).subscribe();

    this.actionUpdates$
      .pipe(
        ofType(TestCaseActionTypes.LoadTestCaseFailed),
        tap(() => {
          this.disabledTestCase = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe();
  }

  onChangeTemplate(value) {
    if (value == this.testCaseTextId) {
      this.textShow = true;
      this.exploratoryShow = false;
      this.stepsShow = false;
      this.showStepsCard = false;
    }
    if (value == this.exploratoryId) {
      this.textShow = false;
      this.exploratoryShow = true;
      this.stepsShow = false;
      this.showStepsCard = false;
    }
    if (value == this.testCaseStepsId) {
      this.textShow = false;
      this.exploratoryShow = false;
      this.stepsShow = true;
      this.showStepsCard = false;
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
      stepStatusId: ''
    });
  }

  addItem(index): void {
    this.testCaseSteps = this.addTestCaseForm.get('testCaseSteps') as FormArray;
    this.testCaseSteps.insert(index + 1, this.createItem());//     push(this.createItem());
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
    this.removableIndex = index;
    deleteStepPopover.openPopover();
  }

  removeItemAtIndex() {
    this.testCaseSteps.removeAt(this.removableIndex);
    this.closeDeleteStepDialog();
  }

  addNewTestCase() {
    this.disabledTestCase = true;
    this.testCase = new TestCase();
    this.testCase = this.addTestCaseForm.value;
    if (this.testCaseId)
      this.testCase.testCaseId = this.testCaseId;
    this.testCase.testSuiteId = this.testSuiteId;
    if (this.editTestCase)
      this.testCase.timeStamp = this.testCaseDetails.timeStamp;
    this.store.dispatch(new LoadTestCaseTriggered(this.testCase));
  }

  initializeTestCaseForm() {
    this.addTestCaseForm = new FormGroup({
      title: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(500)])),
      sectionId: new FormControl(this.selectedSection, Validators.compose([Validators.required])),
      templateId: new FormControl(this.selectedTemplate, Validators.compose([Validators.required])),
      typeId: new FormControl(this.selectedType, Validators.compose([Validators.required])),
      priorityId: new FormControl(this.selectedPriorityType, Validators.compose([Validators.required])),
      estimate: new FormControl("", []),
      automationTypeId: new FormControl(this.selectedAutomationType, Validators.compose([Validators.required])),
      precondition: new FormControl("", []),
      steps: new FormControl("", []),
      expectedResult: new FormControl("", []),
      mission: new FormControl("", []),
      goals: new FormControl("", []),
      testCaseSteps: this.formBuilder.array([])
    });
  }

  closeDeleteStepDialog() {
    this.deleteStepsPopover.forEach((p) => p.closePopover());
  }

  backToSections() {
    this.routes.navigateByUrl('testrail/testrailprojectview/' + this.projectId + '/' + this.tabIndex + '/testsuitesview/' + this.testSuiteId);
  }
}