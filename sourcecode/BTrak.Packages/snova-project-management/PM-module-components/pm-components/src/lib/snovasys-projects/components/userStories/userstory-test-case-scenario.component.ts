import { Component, ChangeDetectionStrategy, Input, ViewChildren, Output, EventEmitter, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { UniqueUserstoryDialogComponent } from './unique-userstory-dialog.component';
import { GetSprintWorkItemByIdTriggered } from '../../store/actions/sprint-userstories.action';
import * as userStoryActions from "../../store/actions/userStory.actions";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { TestCase } from '@snovasys/snova-testrepo';
import { TestSuiteList } from '../../models/testsuite';
import { TestCaseDropdownList } from '@snovasys/snova-testrepo';
import { TestCaseActionTypes, LoadTestCaseScenarioDeleteTriggered, LoadBugsByUserStoryIdTriggered,LoadTestCaseStatusListTriggered } from "@snovasys/snova-testrepo"
import { LoadBugsCountByUserStoryIdTriggered } from '../../store/actions/comments.actions';
import * as testRailModuleReducer from "@snovasys/snova-testrepo"
import {State} from "../../store/reducers/index"
import { UserStory } from '../../models/userStory';
const activeGoalStatusId = ConstantVariables.ActiveGoalStatusId;

@Component({
    selector: 'userstory-test-case-scenario',
    templateUrl: 'userstory-test-case-scenario.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserStoryTestCaseScenarioComponent extends AppFeatureBaseComponent implements OnInit {
    @ViewChildren('editTestCasePopover') editTestCasesPopover;
    @ViewChildren('caseScenarioStatusPopover') caseScenarioStatusesPopover;
    @ViewChildren('scenarioBugsPopover') scenarioBugPopover;
    @ViewChildren('deleteCasePopover') deleteCasesPopover;
    @ViewChild("testSuiteCaseTitle") testSuiteCaseTitleStatus: ElementRef;
    @ViewChildren("inLineEditUserStoryPopup") inLineEditPopUps;

    @Input() caseSelected: boolean;

    @Input("userStoryData")
    set _userStoryData(data: any) {
        if (data)
            this.userStoryData = data;
    }

    @Input("caseDetails")
    set _caseDetails(data: any) {
        if (data)
            this.caseDetail = data;
    }

    @Input("isSprintUserStories")
    set _isSprintUserStories(data: boolean) {
        this.isSprintUserStories = data;
    }

    public ngDestroyed$ = new Subject();

    scenarioBugs$: Observable<TestCase[]>;
    testCaseBugs : TestCase[];
    anyOperationInProgress$: Observable<boolean>;
    workItemInProgress: boolean;
    deleteCase: TestCase;
    searchTestSuite: TestSuiteList;
    caseDetail: any;
    userStoryData: any;
    width: any;
    goalReplanId: string;
    isAllGoalsPage: boolean;
    isEditFromProjects: boolean;
    goalActiveId: string = activeGoalStatusId;
    isSprintUserStories: boolean;
    disableDeleteTestCase: boolean = false;
    loadEditTestCase: boolean = false;
    loadEditTestCaseStatusScenario: boolean = false;
    showTitleTooltip: boolean = false;
    showBugs: boolean = false;
    dropDownList: TestCaseDropdownList;
    testCaseStatusList$: Observable<TestCaseDropdownList[]>;
    statusList: TestCaseDropdownList[];
    inLineUserStory : UserStory;
    isFromBugsCount : boolean;
    titleText: string;
    isInlineEdit: boolean;
    isInlineEditForEstimatedTime: boolean;
    isInlineEditForUserStoryStatus: boolean;
    isInlineEditForUserStoryOwner: boolean;
    isInlineEditForSprintEstimatedTime: boolean;
    isBugsTab: boolean;

    constructor(private testrailStore: Store<testRailModuleReducer.State>, 
    private actionUpdates$: Actions,
         public dialog: MatDialog, private cdRef: ChangeDetectorRef
         ,private translateService: TranslateService,
         private store: Store<State>) {
        super();
        this.getStatuses();

       this.anyOperationInProgress$ = this.testrailStore.pipe(select(testRailModuleReducer.getBugsByUserStoryIdLoading));

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadTestCaseScenarioDeleteCompleted),
            tap(() => {
                if (this.deleteCase != undefined && this.deleteCase.testCaseId == this.caseDetail.testCaseId) {
                    this.closeDeleteCaseDialog();
                    this.disableDeleteTestCase = false;
                    this.cdRef.markForCheck();
                }
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadTestCaseFailed),
            tap(() => {
                this.disableDeleteTestCase = false;
                this.cdRef.markForCheck();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadBugsByUserStoryIdCompleted),
            tap(() => {
                 this.scenarioBugs$ = this.testrailStore.pipe(select(testRailModuleReducer.getBugsByUserStoryId));
                 this.scenarioBugs$.subscribe(result => {
                    this.testCaseBugs = (result != undefined && result != null ) ? result.filter(x=> x.testCaseId == this.caseDetail.testCaseId) : [];
                 });
                this.cdRef.markForCheck();
            })
        ).subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    getStatuses() {
        this.dropDownList = new TestCaseDropdownList();
        this.dropDownList.isArchived = false;
         this.testrailStore.dispatch(new LoadTestCaseStatusListTriggered(this.dropDownList));
         this.testCaseStatusList$ = this.testrailStore.pipe(select(testRailModuleReducer.getTestCaseStatusAll),
          tap(result => {
             if (result) {
                     this.statusList = result;
                 }
             }));
    }

    previewTestcase(caseScenarioStatusPopover) {
        this.loadEditTestCaseStatusScenario = true;
        caseScenarioStatusPopover.openPopover();
    }

    closeEditTestCaseStatusScenarioDialog() {
        this.loadEditTestCaseStatusScenario = false;
        this.caseScenarioStatusesPopover.forEach((p) => p.closePopover());
    }

    editTestCaseScenario(editTestCasePopover) {
        this.loadEditTestCase = true;
        editTestCasePopover.openPopover();
    }

    closeEditTestCaseDialog() {
        this.loadEditTestCase = false;
        this.editTestCasesPopover.forEach((p) => p.closePopover());
    }

    closeUserStoryDialogWindow() {
        this.isInlineEdit = false;
        this.isInlineEditForEstimatedTime = false;
        this.isInlineEditForUserStoryStatus = false;
        this.isInlineEditForUserStoryOwner = false;
        this.isBugsTab = false;
        this.inLineEditPopUps.forEach((p) => p.closePopover());
    }

    deleteCases(cases, deleteCasePopover) {
        deleteCasePopover.openPopover();
        this.deleteCase = new TestCase();
        this.deleteCase = Object.assign({}, cases);
        this.deleteCase.isArchived = true;
    }
    // closeUserStoryDialogWindow(){
    //     this.editTestCasesPopover.forEach((p) => p.closePopover());
    // }

    removeTestCase() {
        this.disableDeleteTestCase = true;
        this.testrailStore.dispatch(new LoadTestCaseScenarioDeleteTriggered(this.deleteCase));
    }

    closeDeleteCaseDialog() {
        this.deleteCasesPopover.forEach((p) => p.closePopover());
    }

    loadBugs() {
        let testCaseSearch = new TestCase();
        testCaseSearch.scenarioId = this.caseDetail.testCaseId;
         testCaseSearch.userStoryId = this.userStoryData.userStoryId;
         this.testrailStore.dispatch(new LoadBugsByUserStoryIdTriggered(testCaseSearch));
         this.scenarioBugs$ = this.testrailStore.pipe(select(testRailModuleReducer.getBugsByUserStoryId));
    }

    openBugsPopover(bugPopover) {
        this.loadBugs();
        bugPopover.openPopover();
    }

    setColorForBugPriorityTypes(color) {
        let styles = {
            "color": color
        };
        return styles;
    }

    closeBugPopover() {
        this.scenarioBugPopover.forEach((p) => p.closePopover());
    }

    checkTitleTooltipStatus() {
        if (this.testSuiteCaseTitleStatus.nativeElement.scrollWidth > this.testSuiteCaseTitleStatus.nativeElement.clientWidth)
            this.showTitleTooltip = true;
        else
            this.showTitleTooltip = false;
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
    saveUserStoryStatus(inLineEditUserStoryPopup, bug) {
        this.titleText = this.translateService.instant('USERSTORY.EDITUSERSTORYSTATUS');
        this.isInlineEdit = false;
        this.isInlineEditForEstimatedTime = false;
        this.isInlineEditForUserStoryStatus = true;
        this.isBugsTab = true;
        this.isInlineEditForUserStoryOwner = false;
        this.isInlineEditForSprintEstimatedTime = false;
        if (bug != undefined) {
          this.inLineUserStory = bug;
          this.isFromBugsCount = true;
        }
  
        else {
          this.inLineUserStory = bug;
          this.isFromBugsCount = false;
        }
        inLineEditUserStoryPopup.openPopover();
    }

    getSelectedBugUserStory(userstory) {
        let dialogId = "unique-userstory-dialog";
        const dialogRef = this.dialog.open(UniqueUserstoryDialogComponent, {
          height: "90vh",
          width: "70%",
          direction: 'ltr',
          id: dialogId,
          data: { userStory: userstory, isFromBugsCount: true, isFromSprints: this.isSprintUserStories, dialogId: dialogId },
          disableClose: true,
          panelClass: 'userstory-dialog-scroll'
        });
        dialogRef.afterClosed().subscribe((result: any) => {
            let bugsCountsModel = new TestCase();
            bugsCountsModel.userStoryId = this.userStoryData.userStoryId;
            this.store.dispatch(new LoadBugsCountByUserStoryIdTriggered(bugsCountsModel));
      
            if (this.userStoryData.userStoryId && this.userStoryData.isFromSprint) {
              this.store.dispatch(new GetSprintWorkItemByIdTriggered(this.userStoryData.userStoryId, true));
            }
            else
              this.store.dispatch(new userStoryActions.UpdateSingleUserStoryForBugsTriggered(this.userStoryData.userStoryId));
            this.loadBugs();
        });
      }
}