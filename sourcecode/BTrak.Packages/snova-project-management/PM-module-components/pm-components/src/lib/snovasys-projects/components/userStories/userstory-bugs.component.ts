import { Component, ChangeDetectionStrategy, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef, ViewChildren } from "@angular/core";
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TestCaseActionTypes, LoadBugsByUserStoryIdTriggered, LoadSingleTestRunCaseBySectionIdTriggered, LoadTestCasesBySectionAndRunIdTriggered } from "@snovasys/snova-testrepo";
import * as testRailModuleReducer from "@snovasys/snova-testrepo"
import { ProjectGoalsService } from "../../services/goals.service";
import { GetSprintWorkItemByIdTriggered, UpdateSingleSprintUserStoryForBugsTriggered } from "../../store/actions/sprint-userstories.action";
import * as userStoryActions from "../../store/actions/userStory.actions";
import { UniqueUserstoryDialogComponent } from "./unique-userstory-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { TestCase } from '@snovasys/snova-testrepo';
import * as projectModuleReducer from "../../store/reducers/index"
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { LoadBugsCountByUserStoryIdTriggered, LoadLinksCountByUserStoryIdTriggered } from '../../store/actions/comments.actions';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import "../../../globaldependencies/helpers/fontawesome-icons";
import { UserStory } from '../../models/userStory';
import { LinkUserStoryInputModel } from '../../models/link-userstory-input-model';
import { LoadUserstoryLinksTriggered } from '../../store/actions/userstory-links.action';
@Component({
    selector: "userstory-bugs",
    templateUrl: "userstory-bugs.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserStoryBugsComponent extends AppFeatureBaseComponent implements OnInit {
    @ViewChildren('addBugPopover') addBugsPopover;
    @ViewChild("bugTitle") bugTitleStatus: ElementRef;
    @ViewChildren("inLineEditUserStoryPopup") inLineEditPopUps;


    @Input("userStoryData")
    set _userStoryData(data: any) {
        if (data) {
            this.fromProjects = true;
            this.userStoryData = data;
            this.isEnableBugBoards = this.userStoryData.isEnableBugBoards;
        }
    }

    @Input("caseDetailData")
    set _caseDetailData(data: any) {
        if (data) {
            this.fromProjects = false;
            this.caseDetailData = data;
            this.loadBugs();
        }
    }

    @Input("isSprintUserStories")
    set _isSprintUserStories(data: boolean) {
        this.isSprintUserStories = data;
        this.loadBugs()
    }
    @Input("isInline")
    set _isInline(data: boolean) {
        this.isInline = data;
    }

    @Input("isUniquePage")
    set _isUniquePage(data: boolean) {
        this.isUniquePage = data;
    }

    @Input("isDetailPage")
    set _isDetailPage(data: boolean) {
        this.isDetailPage = data;
    }
    
    @Input("isGoalsPage")
    set _isGoalsPage(data: boolean) {
        this.isGoalsPage = data;
    }

    userStoryBugs$: Observable<TestCase[]>;
    anyOperationInProgress$: Observable<boolean>;
    isUniquePage: boolean;
    public ngDestroyed$ = new Subject();
    isActiveGoalsPage: boolean;
    isInline: boolean;
    isDetailPage: boolean;
    isGoalsPage: boolean;
    userStoryData: any;
    caseDetailData: any;
    selectedCaseId: string;
    casesCount: number = 0;
    softLabels: SoftLabelConfigurationModel[];
    showBugs: boolean;
    isEnableBugBoards: boolean;
    fromProjects: boolean;
    showTitleTooltip: boolean = false;
    loadBug: boolean = false;
    isBugFromTestRail: boolean = false;
    isBugFromUserStory: boolean = true;
    isSprintUserStories: boolean;
    inLineUserStory: UserStory;
    isFromBugsCount: boolean;
    titleText: string;
    isInlineEdit: boolean;
    isInlineEditForEstimatedTime: boolean;
    isInlineEditForUserStoryStatus: boolean;
    isInlineEditForUserStoryOwner: boolean;
    isInlineEditForSprintEstimatedTime: boolean;
    workItemInProgress: boolean;
    goalReplanId: string;
    isAllGoalsPage: boolean;
    isBugsTab: boolean;
    constructor(private testrailStore: Store<testRailModuleReducer.State>,
        private store: Store<projectModuleReducer.State>,
        private actionUpdates$: Actions,
        private cdRef: ChangeDetectorRef
        , private goalService: ProjectGoalsService,
        public dialog: MatDialog
        , private translateService: TranslateService) {
        super();

        this.anyOperationInProgress$ = this.testrailStore.pipe(select(testRailModuleReducer.getBugsByUserStoryIdLoading));
        this.selectedCaseId = null;

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(TestCaseActionTypes.LoadBugsByUserStoryIdCompleted),
            tap(() => {
                this.userStoryBugs$ = this.testrailStore.pipe(select(testRailModuleReducer.getBugsByUserStoryId));
                this.userStoryBugs$.subscribe(result => {
                    this.inLineUserStory = null;
                    this.isInlineEditForUserStoryStatus = null;
                    this.isBugsTab = false;
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
            testCaseSearch.userStoryId = this.userStoryData.userStoryId;
            testCaseSearch.sectionId = this.userStoryData.testSuiteSectionId;
        }
        else {
            testCaseSearch.scenarioId = this.caseDetailData ? this.caseDetailData.testCaseId : null;
            testCaseSearch.isSprintUserStories = this.isSprintUserStories;
            testCaseSearch.isArchived = false;
        }
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

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    checkGoalStatus(bug) {
        if (this.isSprintUserStories) {
            if (bug && bug.sprintStartDate && !bug.isReplan) {
                this.isActiveGoalsPage = true;
            } else {
                this.isActiveGoalsPage = false;
            }

        } else {
            if (bug && bug.goalStatusId == ConstantVariables.ActiveGoalStatusId.toLowerCase()) {
                this.isActiveGoalsPage = true;
            } else {
                this.isActiveGoalsPage = false;
            }
        }

    }

    unlinkBug(bug) {
        this.goalService.deleteLinkedBugs(bug.userStoryId).subscribe((result: any) => {

            if (this.userStoryData != undefined && this.fromProjects) {
                let bugsCountsModel = new TestCase();
                bugsCountsModel.userStoryId = this.userStoryData.userStoryId;
                this.testrailStore.dispatch(new LoadBugsCountByUserStoryIdTriggered(bugsCountsModel));


                if(!this.isInline) {
                    if (this.userStoryData.userStoryId && this.isSprintUserStories) {
                        if(this.userStoryData.parentUserStoryId) {
                            this.store.dispatch(new UpdateSingleSprintUserStoryForBugsTriggered(this.userStoryData.parentUserStoryId));
                        } else {
                            this.store.dispatch(new UpdateSingleSprintUserStoryForBugsTriggered(this.userStoryData.userStoryId));
                        }
                    }
                    else {
                        if(this.userStoryData.parentUserStoryId) {
                            if(this.isGoalsPage) {
                                this.store.dispatch(new userStoryActions.UpdateUniquePageUserStories(this.userStoryData.parentUserStoryId));
                            } else {
                                this.store.dispatch(new userStoryActions.UpdateSingleUserStoryForBugsTriggered(this.userStoryData.parentUserStoryId));
                            }
                        } else {
                            if(this.isGoalsPage) {
                                this.store.dispatch(new userStoryActions.UpdateUniquePageUserStories(this.userStoryData.userStoryId));
                            } else {
                                this.store.dispatch(new userStoryActions.UpdateSingleUserStoryForBugsTriggered(this.userStoryData.userStoryId));
                            }
                        }
                     
                    }
                }
              

            }
            else {
                this.loadCaseDetails(this.caseDetailData);
                this.loadTestCases(this.caseDetailData)
            }
            this.loadBugs();
            this.loadLinks();
        });
    }

    getSelectedBugUserStory(userstory) {
        if (!this.fromProjects || this.isUniquePage)
            return;
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
            this.loadBugs();
            this.testrailStore.dispatch(new LoadBugsCountByUserStoryIdTriggered(bugsCountsModel));
        });
    }

    loadLinks() {
        this.store.dispatch(new LoadLinksCountByUserStoryIdTriggered(this.userStoryData.userStoryId, this.userStoryData.isFromSprint));
        var linkUserStoryModel = new LinkUserStoryInputModel();
        linkUserStoryModel.userStoryId = this.userStoryData.userStoryId;
        linkUserStoryModel.isSprintUserStories = this.isSprintUserStories;
        this.store.dispatch(new LoadUserstoryLinksTriggered(linkUserStoryModel));
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
            this.isBugsTab = true;
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
    }
    closeUserStoryDialogWindow() {
        this.isInlineEdit = false;
        this.isInlineEditForEstimatedTime = false;
        this.isInlineEditForUserStoryStatus = false;
        this.isInlineEditForUserStoryOwner = false;
        this.isBugsTab = false;
        this.inLineEditPopUps.forEach((p) => p.closePopover());
    }

    loadCaseDetails(caseDetails) {
        let testCaseSearch = new TestCase();
        testCaseSearch.testRunId = caseDetails.testRunId;
        testCaseSearch.testCaseId = caseDetails.testCaseId;
        testCaseSearch.sectionId = caseDetails.sectionId;
        testCaseSearch.isArchived = false;
        this.testrailStore.dispatch(new LoadSingleTestRunCaseBySectionIdTriggered(testCaseSearch));
    }

    loadTestCases(caseDetails) {

        let testCaseSearch = new TestCase();
        testCaseSearch.sectionId = caseDetails.sectionId;
        testCaseSearch.testRunId = caseDetails.testRunId;
        testCaseSearch.isArchived = false;
        this.testrailStore.dispatch(new LoadTestCasesBySectionAndRunIdTriggered(testCaseSearch));
    }

    loadingEvent(event) {
        this.workItemInProgress = event;
    }
}