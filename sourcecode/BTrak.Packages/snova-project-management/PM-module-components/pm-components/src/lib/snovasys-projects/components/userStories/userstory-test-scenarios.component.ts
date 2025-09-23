import { Component, ChangeDetectionStrategy, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from "../../store/reducers/index";
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserStoryActionTypes } from "../../store/actions/userStory.actions";
import { GoalActionTypes } from "../../store/actions/goal.actions";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { TestCase, TestCaseTitle } from '@snovasys/snova-testrepo';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { TestCaseDropdownList } from '@snovasys/snova-testrepo';
import { TestCaseActionTypes, LoadTestCaseTitleTriggered, LoadTestCasesByUserStoryIdTriggered } from "@snovasys/snova-testrepo";
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import * as testRailModuleReducer from "@snovasys/snova-testrepo"
import { FeatureIds } from '../../../globaldependencies/constants/feature-ids';
@Component({
    selector: "userstory-test-scenarios",
    templateUrl: "userstory-test-scenarios.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserStoryTestScenarios extends AppFeatureBaseComponent implements OnInit {
    @Input("userStoryData")
    set _userStoryData(data: any) {
        if (data) {
            if (data.testSuiteSectionId) {
                this.userStoryData = data;
                this.showScenarios = true;
                this.loadTestCases();
                this.cdRef.markForCheck();
            }
            else {
                this.showScenarios = false;
                this.loadScenarios = true;
                this.goalEdit = false;
                this.cdRef.markForCheck();
            }
        }
    }

    @Input("isSprintUserStories") 
    set _isSprintUserStories(data: boolean ) {
        this.isSprintUserStories = data;
    }

    public ngDestroyed$ = new Subject();

    testCases$: Observable<TestCase[]>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    anyOperationInProgress$: Observable<boolean>;
    userStoryData: any;
    testCaseName: string;
    selectedCaseId: string;
    isSprintUserStories:boolean;
    casesCount: number = 0;
    disableAddCase: boolean = false;
    isAddTestCaseOpened: boolean = false;
    showScenarios: boolean = false;
    goalEdit: boolean = false;
    loadScenarios: boolean = false;
    statusList: TestCaseDropdownList[];
    canAccess_feature_CanSubmitCustomFieldsForProjectManagement: Boolean;
    softLabels: SoftLabelConfigurationModel[];
    
    constructor(private testrailStore: Store<testRailModuleReducer.State>, 
        private actionUpdates$: Actions, private cdRef: ChangeDetectorRef) {
        super();

        this.anyOperationInProgress$ = this.testrailStore.pipe(select(testRailModuleReducer.getTestCasesByUserStoryIdLoading));
        this.selectedCaseId = null;

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(GoalActionTypes.CreateGoalTriggered),
            tap(() => {
                this.goalEdit = true;
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(UserStoryActionTypes.GetUniqueUserStoryByIdTriggered),
            tap((result: any) => {
                if (result && this.userStoryData && result.userStoryId == this.userStoryData.userStoryId && this.goalEdit) {
                    this.loadScenarios = false;
                    this.cdRef.markForCheck();
                }
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(UserStoryActionTypes.CreateUserStoryCompleted),
            tap((result: any) => {
                if (result && this.userStoryData && result.userStoryId == this.userStoryData.userStoryId) {
                    this.loadScenarios = false;
                    this.cdRef.markForCheck();
                }
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadMultipleTestCasesByUserStoryIdCompleted),
            tap(() => {
                this.disableAddCase = false;
                this.testCaseName = '';
                this.isAddTestCaseOpened = false;
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadTestCasesByUserStoryIdTriggered),
            tap(() => {
                this.testCaseName = '';
                this.isAddTestCaseOpened = false;
                this.goalEdit = false;
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadTestCasesByUserStoryIdCompleted),
            tap(() => {
                this.testCases$ = this.testrailStore.pipe(select(testRailModuleReducer.getTestCasesByUserStoryIdAll));
                this.testCases$.subscribe(result => {
                    this.casesCount = result.length;
                });
                this.loadScenarios = true;
                this.goalEdit = false;
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadTestCaseFailed),
            tap(() => {
                this.disableAddCase = false;
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

    handleClick(data) {
        this.selectedCaseId = data.testCaseId;
    }

    openAddTestCase() {
        this.testCaseName = '';
        this.isAddTestCaseOpened = !this.isAddTestCaseOpened;
    }

    addTestCase() {
        this.disableAddCase = true;
        let newCaseTitle = new TestCaseTitle();
        newCaseTitle.title = this.testCaseName;
        newCaseTitle.testSuiteId = this.userStoryData.testSuiteId;
        newCaseTitle.sectionId = this.userStoryData.testSuiteSectionId;
        newCaseTitle.userStoryId = this.userStoryData.userStoryId;
        this.testrailStore.dispatch(new LoadTestCaseTitleTriggered(newCaseTitle));
    }

    loadTestCases() {
        let testCaseSearch = new TestCase();
        testCaseSearch.userStoryId = this.userStoryData.userStoryId;
        testCaseSearch.isArchived = false;
        this.testrailStore.dispatch(new LoadTestCasesByUserStoryIdTriggered(testCaseSearch));
        this.testCases$ = this.testrailStore.pipe(select(testRailModuleReducer.getTestCasesByUserStoryIdAll));
    }
}