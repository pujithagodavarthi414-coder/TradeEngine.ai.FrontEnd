import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import "../../globaldependencies/helpers/fontawesome-icons";

import { CaseDetails } from '../models/testcasedetails'
import { TestCase } from '../models/testcase';
import { TestCaseDropdownList } from '../models/testcasedropdown';

import { LoadTestCaseDetailsTriggered, TestCaseActionTypes } from '../store/actions/testcaseadd.actions';
import { LoadTestCaseTemplateListTriggered, TestCaseTemplateActionTypes } from '../store/actions/testcasetemplates.actions';

import { State } from '../store/reducers/index';
import * as testRailModuleReducer from "../store/reducers/index";

import { ConstantVariables } from '../constants/constant-variables';

const exploratorySession = ConstantVariables.ExploratorySession;
const testCaseSteps = ConstantVariables.TestCaseSteps;
const testCaseText = ConstantVariables.TestCaseText;

@Component({
  selector: 'app-testrail-component-testcasedetailsview',
  templateUrl: './testsuite-casedetails-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestsuitecasedetailsviewComponent {
  @Input() caseDetails: CaseDetails;

  testCaseTemplatesList$: Observable<TestCaseDropdownList[]>;
  testCaseDetails$: Observable<TestCase>;
  anyOperationInProgress$: Observable<boolean>;

  testCaseDetails: TestCase;
  templatesList: TestCaseDropdownList[];
  dropDownList: TestCaseDropdownList;

  projectId: string;
  testSuiteId: string;
  tabIndex: number;
  testCaseId: string;
  exploratoryId: string;
  testCaseStepsId: string;
  testCaseTextId: string;
  showExploratory: boolean = false;
  showSteps: boolean = false;
  showText: boolean = false;

  constructor(private store: Store<State>, private actionUpdates$: Actions, private routes: Router, private route: ActivatedRoute, private cdRef: ChangeDetectorRef) {
    this.route.params.subscribe(routeParams => {
      this.projectId = routeParams.id;
      this.tabIndex = routeParams.tab;
      this.testSuiteId = routeParams.testsuiteid;
      this.testCaseId = routeParams.testcaseid;
    });

    this.dropDownList = new TestCaseDropdownList();
    this.dropDownList.isArchived = false;

    this.store.dispatch(new LoadTestCaseTemplateListTriggered(this.dropDownList));
    this.testCaseTemplatesList$ = this.store.pipe(select(testRailModuleReducer.getTestCaseTemplateAll));

    if (this.testCaseId) {
      this.store.dispatch(new LoadTestCaseDetailsTriggered(this.testCaseId));
      this.testCaseDetails$ = this.store.pipe(select(testRailModuleReducer.getTestCaseDetailsById));
    }

    this.actionUpdates$.pipe(
      ofType(TestCaseTemplateActionTypes.LoadTestCaseTemplateListCompleted),
      tap(() => {
        this.testCaseTemplatesList$.subscribe(result => {
          this.templatesList = result;
          var exp = this.templatesList.findIndex(x => x.value == exploratorySession);
          this.exploratoryId = this.templatesList[exp].id;
          var steps = this.templatesList.findIndex(x => x.value == testCaseSteps);
          this.testCaseStepsId = this.templatesList[steps].id;
          var text = this.templatesList.findIndex(x => x.value == testCaseText);
          this.testCaseTextId = this.templatesList[text].id;
        });
      })
    ).subscribe();

    this.actionUpdates$.pipe(
      ofType(TestCaseActionTypes.LoadTestCaseDetailsCompleted),
      tap(() => {
        this.testCaseDetails$.subscribe(result => {
          this.testCaseDetails = result;
          if (this.testCaseDetails.templateId == this.exploratoryId)
            this.showExploratory = true;
          if (this.testCaseDetails.templateId == this.testCaseStepsId)
            this.showSteps = true;
          if (this.testCaseDetails.templateId == this.testCaseTextId)
            this.showText = true;
          this.cdRef.detectChanges();
        });
      })
    ).subscribe();

    this.anyOperationInProgress$ = this.store.pipe(select(testRailModuleReducer.getTestCaseDetailsLoading));
  }

  backToSections() {
    this.routes.navigateByUrl('testrail/testrailprojectview/' + this.projectId + '/' + this.tabIndex + '/testsuitesview/' + this.testSuiteId);
  }

  editTestCase() {
    this.routes.navigateByUrl('testrail/testrailprojectview/' + this.projectId + '/' + this.tabIndex + '/testsuitesview/' + this.testSuiteId + '/testcaseedit/' + this.testCaseId);
  }
}
