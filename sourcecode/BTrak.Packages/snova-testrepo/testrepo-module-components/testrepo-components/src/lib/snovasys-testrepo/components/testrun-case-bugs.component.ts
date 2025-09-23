import { Component, ChangeDetectionStrategy, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef, ViewChildren } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as testRailModuleReducer from "../store/reducers/index"
import { TranslateService } from "@ngx-translate/core";
import { TestCase } from '../models/testcase';
import { CustomAppFeatureBaseComponent } from '../constants/featurecomponentbase';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { TestCaseActionTypes, LoadBugsByUserStoryIdTriggered, LoadTestCaseBySectionAndRunIdAfterBugStatusTriggered, LoadTestCaseBySectionAndRunIdAfterStatusTriggered } from '../store/actions/testcaseadd.actions';
import { ConstantVariables } from '../constants/constant-variables';
import { TestRailService } from '../services/testrail.service';
import { WorkflowStatus } from '../models/workflowStatus';
import { ToastrService } from 'ngx-toastr';
import { UserStory } from '../models/userStory';

@Component({
    selector: "testrun-case-bugs",
    templateUrl: "testrun-case-bugs.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestRunCaseBugsComponent extends CustomAppFeatureBaseComponent implements OnInit {
    @ViewChildren('addBugPopover') addBugsPopover;
    @ViewChild("bugTitle") bugTitleStatus: ElementRef;
    @ViewChildren("inLineEditUserStoryPopup") inLineEditPopUps;

    @Input("caseDetailData")
    set _caseDetailData(data: any) {
        if (data) {
            this.fromProjects = false;
            this.caseDetailData = data;
            this.loadBugs();
        }
    }

    userStoryBugs$: Observable<TestCase[]>;
    anyOperationInProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();
    isActiveGoalsPage: boolean;
    userStoryData: any;
    userStory: any;
    caseDetailData: any;
    selectedCaseId: string;
    casesCount: number = 0;
    softLabels: SoftLabelConfigurationModel[];
    workflowStatus: WorkflowStatus[];
    showBugs: boolean;
    fromProjects: boolean = false;
    showTitleTooltip: boolean = false;
    loadBug: boolean = false;
    isBugFromTestRail: boolean = false;
    isBugFromUserStory: boolean = true;
    isSprintUserStories: boolean = false;
    inLineUserStoryId: string;
    userStoryStatusId: string;
    validationMessage: string;
    isFromBugsCount: boolean;
    titleText: string;
    isInlineEdit: boolean;
    isInlineEditForEstimatedTime: boolean;
    isInlineEditForUserStoryStatus: boolean;
    isInlineEditForUserStoryOwner: boolean;
    isInlineEditForSprintEstimatedTime: boolean;
    workItemInProgress: boolean = false;
    goalReplanId: string;
    isAllGoalsPage: boolean;

    constructor(private testrailStore: Store<testRailModuleReducer.State>, private actionUpdates$: Actions, private testRailService: TestRailService, private toastr: ToastrService, private cdRef: ChangeDetectorRef, private translateService: TranslateService) {
        super();

        this.anyOperationInProgress$ = this.testrailStore.pipe(select(testRailModuleReducer.getBugsByUserStoryIdLoading));
        this.selectedCaseId = null;

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadBugsByUserStoryIdCompleted),
            tap(() => {
                this.userStoryBugs$ = this.testrailStore.pipe(select(testRailModuleReducer.getBugsByUserStoryId));
                this.userStoryBugs$.subscribe(result => {
                    this.casesCount = result.length;
                    if (this.casesCount == 0)
                        this.showBugs = false;
                    else
                        this.showBugs = true;
                    this.cdRef.markForCheck();
                });
            })
        ).subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    loadBugs() {
        let testCaseSearch = new TestCase();
        if (this.fromProjects) {
            testCaseSearch.parentUserStoryId = this.userStoryData.userStoryId;
            testCaseSearch.testSuiteId = this.userStoryData.testSuiteId;
            testCaseSearch.sectionId = this.userStoryData.testSuiteSectionId;
        }
        else
            testCaseSearch.scenarioId = this.caseDetailData.testCaseId;
        testCaseSearch.isSprintUserStories = false;
        testCaseSearch.isArchived = false;
        this.testrailStore.dispatch(new LoadBugsByUserStoryIdTriggered(testCaseSearch));
        this.userStoryBugs$ = this.testrailStore.pipe(select(testRailModuleReducer.getBugsByUserStoryId));
    }

    checkTitleTooltipStatus() {
        if (this.bugTitleStatus.nativeElement.scrollWidth > this.bugTitleStatus.nativeElement.clientWidth)
            this.showTitleTooltip = true;
        else
            this.showTitleTooltip = false;
    }

    setColorForBugPriorityTypes(color) {
        let styles = {
            "color": color
        };
        return styles;
    }

    openBugPopover(addBugPopover) {
        this.loadBug = true;
        addBugPopover.openPopover();
    }

    closeBugPopover() {
        this.loadBug = false;
        this.addBugsPopover.forEach((p) => p.closePopover());
    }

    checkGoalStatus(bug) {
        if (bug && bug.goalStatusId == ConstantVariables.ActiveGoalStatusId.toLowerCase()) {
            this.isActiveGoalsPage = true;
            this.cdRef.markForCheck();
        }
        else {
            this.isActiveGoalsPage = false;
            this.cdRef.markForCheck();
        }
    }

    unlinkBug(bug) {
        this.testRailService.deleteLinkedBugs(bug.userStoryId).subscribe((result: any) => {
            if(result.success) {
                this.loadBugs();

                let searchTestCase = new TestCase();
                searchTestCase.testRunId = this.caseDetailData.testRunId;
                searchTestCase.testCaseId = this.caseDetailData.testCaseId;
                searchTestCase.isBugAdded = false;
                searchTestCase.isArchived = false;
                this.testrailStore.dispatch(new LoadTestCaseBySectionAndRunIdAfterStatusTriggered(searchTestCase));
                


            } else {
                this.toastr.error('',result.apiResponseMessages[0].message);
            }
        }) 
    }

    saveUserStoryStatus(inLineEditUserStoryPopup, bug) {
        this.titleText = this.translateService.instant('USERSTORY.EDITUSERSTORYSTATUS');
        this.checkGoalStatus(bug);
        if (this.isActiveGoalsPage) {
            this.isInlineEdit = false;
            this.isInlineEditForEstimatedTime = false;
            this.isInlineEditForUserStoryStatus = true;
            this.isInlineEditForUserStoryOwner = false;
            this.isInlineEditForSprintEstimatedTime = false;
            if (bug != undefined) {
                this.inLineUserStoryId = bug.userStoryId;
                this.isFromBugsCount = true;
            }
            else {
                this.inLineUserStoryId = bug.userStoryId;
                this.isFromBugsCount = false;
            }
            this.getUserStoryById(this.inLineUserStoryId);
            inLineEditUserStoryPopup.openPopover();
        }
    }

    getUserStoryById(userStoryId) {
        this.testRailService.GetUserStoryById(userStoryId).subscribe((result: any) => {
            if (result.success) {
                this.userStory = result.data;
                this.getWorkflowStatuses(this.userStory.workFlowId);
                this.cdRef.markForCheck();
            }
            else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
        });
    }

    getWorkflowStatuses(workFlowId) {
        let workflowStatus = new WorkflowStatus();
        workflowStatus.workFlowId = workFlowId;
        this.testRailService.GetAllWorkFlowStatus(workflowStatus).subscribe((result: any) => {
            if (result.success) {
                this.workflowStatus = result.data;
                this.userStoryStatusId = this.userStory.userStoryStatusId;
                this.cdRef.markForCheck();
            }
            else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
        });
    }

    getUserStoryStatusChange(event) {
        this.workItemInProgress = true;
        this.userStoryStatusId = event;
        let model = new UserStory();
        model = Object.assign({}, this.userStory);
        model.userStoryStatusId = this.userStoryStatusId;
        this.testRailService.UpsertUserStory(model).subscribe((result: any) => {
            if (result.success) {
                let testCaseSearch = new TestCase();
                testCaseSearch.scenarioId = this.userStory.testCaseId;
                testCaseSearch.isSprintUserStories = false;
                testCaseSearch.isArchived = false;
                this.workItemInProgress = false;
                this.closeUserStoryDialogWindow();
                this.cdRef.markForCheck();
                let searchTestCase = new TestCase();
                searchTestCase.testRunId = this.caseDetailData.testRunId;
                searchTestCase.testCaseId = this.caseDetailData.testCaseId;
                searchTestCase.isArchived = false;
                this.testrailStore.dispatch(new LoadTestCaseBySectionAndRunIdAfterBugStatusTriggered(searchTestCase));
                this.testrailStore.dispatch(new LoadBugsByUserStoryIdTriggered(testCaseSearch));
            }
            else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.workItemInProgress = false;
                this.cdRef.markForCheck();
            }
        });
    }

    closeUserStoryDialogWindow() {
        this.isInlineEdit = false;
        this.isInlineEditForEstimatedTime = false;
        this.isInlineEditForUserStoryStatus = false;
        this.isInlineEditForUserStoryOwner = false;
        this.userStoryStatusId = null;
        this.cdRef.markForCheck();
        this.inLineEditPopUps.forEach((p) => p.closePopover());
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}