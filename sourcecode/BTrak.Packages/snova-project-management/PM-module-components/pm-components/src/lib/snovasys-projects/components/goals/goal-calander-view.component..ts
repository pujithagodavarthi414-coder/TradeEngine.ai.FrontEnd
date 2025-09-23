// tslint:disable-next-line:ordered-imports
// tslint:disable-next-line:ordered-imports
import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, TemplateRef } from "@angular/core";
// tslint:disable-next-line:ordered-imports
import { MatDialog } from "@angular/material/dialog";
// tslint:disable-next-line:ordered-imports
import { select, Store } from "@ngrx/store";
import { SchedulerEvent } from "@progress/kendo-angular-scheduler";
// tslint:disable-next-line:ordered-imports
// tslint:disable-next-line:ordered-imports
// tslint:disable-next-line:ordered-imports
import { Observable } from "rxjs";
import * as _ from "underscore";
import { UserStory } from "../../models/userStory";
// tslint:disable-next-line:ordered-imports
import { BugPriorityFilterPipe } from "../../pipes/bugPriorityFilter.pipes";
import { ComponentFilterPipe } from "../../pipes/componentFilter.pipe";
// tslint:disable-next-line:ordered-imports
import { ResultFilterPipe } from "../../pipes/result.pipes";
// tslint:disable-next-line:ordered-imports
import { SearchFilterPipe } from "../../pipes/searchfilter.pipe";
// tslint:disable-next-line:ordered-imports
import { UserStoryTagsPipe } from "../../pipes/userstory-tags.pipes";
import { UserstoryFilterPipe } from "../../pipes/userstoryFilter.pipes";
import { VersionNameFilterPipe } from "../../pipes/versionName.pipe";
import { WorkItemTypesFilterPipe } from "../../pipes/work-item-types.pipes";
import * as projectModuleReducers from "../../store/reducers/index";
import { AdhocUserstoryDetailDialogComponent } from "../userStories/adhoc-userstory-detail-dialog.component";
import { UniqueUserstoryDialogComponent } from "../userStories/unique-userstory-dialog.component";
import { SprintModel } from "../../models/sprints-model";
import { EstimateTimeRemoval } from '../../../globaldependencies/pipes/estimateTimeRemoval.pipe';
import * as ProjectState from "../../store/reducers/index";
import { TimeFilterPipe } from '../../../globaldependencies/pipes/timefilter.pipe';
import { LeaveHistoryScheduler } from '../../models/leave-history-schduler.model';
import { UserStorySearchCriteriaInputModel } from '../../models/userStorySearchInput';
import { SearchUserStories } from '../../store/actions/userStory.actions';
import { ProjectGoalsService } from '../../services/goals.service';
@Component({
  selector: "app-goal-component-calender-view-detail",
  templateUrl: "goal-calander-view.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoalCalenderViewComponent implements OnInit {
  goal;
  @Input("goal")
  set _goal(data) {
    if (data) {
      this.isFromSprints = false;
      this.goal = data;
      if (this.goal) {
        this.getGoalUserStories();
      }
    }
  }

  @Input("isFromAllWorkItems")
  set _isFromAllWorkItems(data) {
    if (data) {
      this.isFromAllWorkItems = data;
    }
    else {
      this.isFromAllWorkItems = null;
    }
  }

  @Input("sprint")
  set _sprint(data: SprintModel) {
    if (data) {
      this.isFromSprints = true;
      this.sprint = data;
      if (this.sprint) {
        this.getSprintUserStories();
      }
    }

  }

  @Input("selectedViewType")
  set _selectedViewType(data) {
    if (data) {
      this.selectedViewType = data;
    }
  }

  workItemList: UserStory[];
  @Input("workItemList")
  set _workItemList(data) {
    if (data) {
      this.workItemList = data;
      this.defaultFilterByAssignee();
    }
  }

  @Input('notFromAudits')
  set _notFromAudits(data: boolean) {
    if (data || data == false) {
      this.notFromAudits = data;
    }
    else
      this.notFromAudits = true;
  }

  @Output() getGoalCalenderView = new EventEmitter<string>();
  @Output() getGoalRelatedBurnDownCharts = new EventEmitter<string>();
  @Output() getDocumentStore = new EventEmitter<string>();
  @Output() getReportsBoard = new EventEmitter<boolean>();
  @Output() eventClicked = new EventEmitter<any>();
  @Output() completeUserStory = new EventEmitter<string>();
  @Output() removeUserStory = new EventEmitter<string>();
  @Output() selectedViewIndex = new EventEmitter<any>();
  @Output() getGoalEmployeeTaskBoard = new EventEmitter<any>();
  @ViewChild("uniqueUserstoryDialog") private uniqueUserstoryDialog: TemplateRef<any>;
  @ViewChild("adhocUserstoryDetailDialog") private adhocUserstoryDetailDialog: TemplateRef<any>;
  isTheBoardLayoutKanban: boolean;
  showCheckBox: boolean;
  isFromSprints: boolean;
  ownerUserList: string;
  isCalenderView = true;
  isReportsPage = false;
  isEmployeeTaskBoardPage: boolean = false;
  notFromAudits: boolean = true;
  userStories$: Observable<UserStory[]>;
  userStories: UserStory[];
  userStoriesDummy: UserStory[];
  sprint: SprintModel;
  userStoryEvent: SchedulerEvent[] = [];
  scheduler: SchedulerEvent;
  loadingInProgress: boolean;
  bugPriorityIdList: string;
  versionNamesearchText: string;
  searchTags: string;
  searchText: string;
  componentList: string;
  userStoryStatusIdList: string;
  userStoryTypeList: string;
  selectedUserStoryId: string;
  ownerUserId: string;
  length: number;
  selectedViewType = 0;
  viewTypes: any;
  isFromAllWorkItems: boolean;
  calendar: string="calendar";

  // tslint:disable-next-line:max-line-length
  constructor(private store: Store<ProjectState.State>, private timeFilterPipe: EstimateTimeRemoval, private versionNameFilterPipe: VersionNameFilterPipe,
    // tslint:disable-next-line:max-line-length
    private resultFilterPipe: ResultFilterPipe, private bugPriorityFilterPipe: BugPriorityFilterPipe, private componentFilterPipe: ComponentFilterPipe,
    // tslint:disable-next-line:max-line-length
    private workItemTypesFilterPipe: WorkItemTypesFilterPipe, private userStoryTagsPipe: UserStoryTagsPipe, private userstoryFilterPipe: UserstoryFilterPipe,
    // tslint:disable-next-line:max-line-length
    private searchFilterPipe: SearchFilterPipe, private cdRef: ChangeDetectorRef, public dialog: MatDialog, public datepipe: DatePipe, private estimatePipe: TimeFilterPipe,
    private goalService: ProjectGoalsService) {

    this.viewTypes = [
      { viewType: "Day", viewTypeId: 0 },
      { viewType: "Agenda", viewTypeId: 1 },
      { viewType: "Week", viewTypeId: 2 },
      { viewType: "Month", viewTypeId: 3 }
    ]
  }

  ngOnInit() {
    this.bugPriorityIdList = null;
    this.versionNamesearchText = null;
    this.searchTags = null;
    this.searchText = null;
    this.componentList = null;
    this.userStoryStatusIdList = null;
    this.userStoryTypeList = null;
    this.selectedUserStoryId = null;
    this.ownerUserId = null;
    this.userStoriesDummy = this.userStories;
    this.defaultFilterByAssignee();
  }

  getSchedulerView() {
    if (this.userStories != null && this.userStories.length > 0) {
      this.length = this.userStories.length;
    }
    else {
      this.length = 0;
    }
    if (this.length) {
      this.userStoryEvent = [];
      this.userStories.forEach((element: UserStory) => {
        const leaveHistorySchedulerEvent = new LeaveHistoryScheduler();
        leaveHistorySchedulerEvent.id = element.userStoryId;
        leaveHistorySchedulerEvent.title = element.userStoryName;
        const start = this.timeFilterPipe.transform(new Date(element.deadLineDate), element.estimatedTime);
        const end = this.timeFilterPipe.transform(new Date(element.deadLineDate), 0);
        leaveHistorySchedulerEvent.start = this.timeFilterPipe.transform(new Date(element.deadLineDate), element.estimatedTime);
        leaveHistorySchedulerEvent.end = this.timeFilterPipe.transform(new Date(element.deadLineDate), 0);
        // tslint:disable-next-line:max-line-length

        const calenderDescription = element.userStoryName + "," + "[" + this.datepipe.transform(start, "medium") + "-" + this.datepipe.transform(end, "medium") + "]" + "," + element.userStoryStatusName + "," + (element.estimatedTime ? this.estimatePipe.transform(element.estimatedTime) : "0");
        leaveHistorySchedulerEvent.description = calenderDescription;
        leaveHistorySchedulerEvent.dataItem = element;
        if (element.deadLineDate) {
          this.userStoryEvent.push(leaveHistorySchedulerEvent);
        }
      });
      this.loadingInProgress = false;
      this.cdRef.markForCheck();
    }
    else {
      this.loadingInProgress = false;
    }
  }

  getLog(event) {
    this.selectedUserStoryId = event.dataItem.dataItem.userStoryId;
    if (!event.dataItem.dataItem.isAdhocUserStory) {
      let dialogId = "unique-userstory-dialog";
      const dialogRef = this.dialog.open(this.uniqueUserstoryDialog, {
        height: "85%",
        width: "85%",
        direction: "ltr",
        id: dialogId,
        data: { userStory: event.dataItem.dataItem, notFromAudits: this.notFromAudits, isFromSprints: this.isFromSprints, dialogId: dialogId },
        disableClose: true,
        panelClass: "userstory-dialog-scroll"
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (this.goal && !this.isFromSprints) {
          this.loadingInProgress = true;
          this.getGoalUserStories();
          this.defaultFilterByAssignee();
        } else if (!this.goal && !this.isFromSprints) {
          this.loadingInProgress = true;
          if (result.success == "yes") {
            this.removeUserStory.emit(this.selectedUserStoryId);
          }
          else if (result.success == "no") {
            this.completeUserStory.emit(this.selectedUserStoryId);
          }
          else {
            this.completeUserStory.emit(this.selectedUserStoryId);
          }
        } else if (this.sprint && this.isFromSprints) {
          this.loadingInProgress = true;
          this.getSprintUserStories();
          this.defaultFilterByAssignee();
        } else if (!this.sprint && this.isFromSprints) {
          this.loadingInProgress = true;
          if (result.success === "yes") {
            this.removeUserStory.emit(this.selectedUserStoryId);
          }
          if (result.success === "no") {
            this.completeUserStory.emit(this.selectedUserStoryId);
          }
        }
        else {
          this.completeUserStory.emit(this.selectedUserStoryId);
        }
      });
    }


    if (event.dataItem.dataItem.isAdhocUserStory) {
      let dialogId = "unique-adhoc-dialog";
      const dialogRef = this.dialog.open(this.adhocUserstoryDetailDialog, {
        height: "80%",
        width: "60%",
        direction: "ltr",
        id: dialogId,
        data: { userStory: event.dataItem.dataItem, dialogId: dialogId },
        disableClose: true,
        panelClass: "userstory-dialog-scroll"
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result.success) {
          this.loadingInProgress = true;
          this.completeUserStory.emit(this.selectedUserStoryId);
        }
      });
    }
    this.cdRef.markForCheck();
  }

  scheduler_navigate(event) {
    if (event.action.view) {
      // tslint:disable-next-line:max-line-length
      const selectedView = this.viewTypes.find((x) => x.viewType.toString().toLowerCase() === event.action.view.name.toString().toLowerCase());
      if (selectedView) {
        this.selectedViewIndex.emit(selectedView.viewTypeId);
      }
    }
    // console.log(event.action.view.name);
  }

  getCalanderView(event) {
    this.getGoalCalenderView.emit("");
  }

  getBurnDownCharts() {
    this.getGoalRelatedBurnDownCharts.emit("");
  }

  getDocumentView(event) {
    this.getDocumentStore.emit('');
  }

  boardChange(event) {
    this.eventClicked.emit(event);
  }

  reportsBoardClicked() {
    this.getReportsBoard.emit(true);
  }

  getEmployeeTaskBoard(event) {
    this.getGoalEmployeeTaskBoard.emit('');
  }

  filterUserStoriesByBugPriorities(bugPriorityId) {
    this.bugPriorityIdList = bugPriorityId;
    this.filter();
  }

  searchUserStoriesBasedOnUserStoryName(searchText) {
    this.searchText = searchText;
    this.filter();
  }

  searchUserStoriesBasedOnVersionName(versionNamesearchText) {
    this.versionNamesearchText = versionNamesearchText;
    this.filter();
  }

  filterUserStoriesBySelectedComponent(projectFeatureId) {
    this.componentList = projectFeatureId;
    this.filter();
  }

  filterUserStoryStatusComponent(userStoryStatusId) {
    this.userStoryStatusIdList = userStoryStatusId;
    this.filter();
  }

  searchUserStoriesBasedOnTags(searchTags) {
    this.searchTags = searchTags;
    this.filter();
  }

  filterUserStoryTypesComponent(userStoryTypeId) {
    this.userStoryTypeList = userStoryTypeId;
    this.filter();
  }

  filterUserStoriesByAssignee(ownerUserId) {
    this.ownerUserList = ownerUserId;
    this.filter();
  }

  defaultFilterByAssignee() {
    if (!this.goal && !this.isFromSprints) {
      this.userStories = this.workItemList
      this.getSchedulerView();
    }
    else {
      if (this.userStories != null && this.userStories.length > 0) {
        this.ownerUserList = this.userStories[0].ownerUserId;
        this.ownerUserId = this.ownerUserList;
      }
      this.filter();
    }
  }

  filter() {
    if (this.userStoriesDummy != null) {
      this.loadingInProgress = true;
      this.userStories = this.bugPriorityFilterPipe.transform(this.userStoriesDummy, null, this.bugPriorityIdList);
      this.userStories = this.userstoryFilterPipe.transform(this.userStories, null, this.ownerUserList);
      this.userStories = this.userStoryTagsPipe.transform(this.userStories, this.searchTags);
      this.userStories = this.workItemTypesFilterPipe.transform(this.userStories, null, this.userStoryTypeList);
      this.userStories = this.searchFilterPipe.transform(this.userStories, this.userStoryStatusIdList);
      this.userStories = this.componentFilterPipe.transform(this.userStories, null, this.componentList);
      this.userStories = this.versionNameFilterPipe.transform(this.userStories, this.versionNamesearchText);
      this.userStories = this.resultFilterPipe.transform(this.userStories, this.searchText, "userStoryName");
      this.getSchedulerView();
    }
    else {
      this.loadingInProgress = false;
    }
  }

  ClickAfterEvent(event) {
    this.eventClicked.emit(event);
  }

  setHeight() {
    if (this.isFromAllWorkItems) {
      if (this.selectedViewType != 3) {
        return 'all-work-calender-height';
      }
      else {
        return 'all-work-month-height';
      }
    }
    else {
      if (this.selectedViewType != 3) {
        return 'goal-calender-height';
      }
      else {
        return 'goal-calender-month-height';
      }
    }
  }

  getGoalUserStories() {
    var userStorySearchCriteria = new UserStorySearchCriteriaInputModel();
    userStorySearchCriteria.goalId = this.goal ? this.goal.goalId : null;
    userStorySearchCriteria.isUserStoryArchived = false;
    userStorySearchCriteria.isUserStoryParked = false;
    this.goalService.searchUserStories(userStorySearchCriteria).subscribe((x: any) => {
      var userStories = x.data;
      var filterUserStories = this.getFilterUserStories(userStories);
      // filterUserStories.forEach((userStory) => {
      //   if (userStory.subUserStoriesList.length > 0) {
      //     var subTasks = userStory.subUserStoriesList;
      //     subTasks.forEach((task) => {
      //       if (task.deadLineDate) {
      //         var subUserStory = new UserStory();
      //         subUserStory = task;
      //         var idx = userStories.indexOf(subUserStory);
      //         if (idx == -1) {
      //           userStories.push(subUserStory);
      //         }
      //       }
      //     })
      //   }
      // })
      this.userStories = userStories;
      this.length = this.userStories.length;
      this.userStoriesDummy = this.userStories;
      this.defaultFilterByAssignee();
    })
  }

  getSprintUserStories() {
    var userStorySearchCriteria = new UserStorySearchCriteriaInputModel();
    userStorySearchCriteria.sprintId = this.sprint ? this.sprint.sprintId : null;
    userStorySearchCriteria.isArchived = false;
    userStorySearchCriteria.isParked = false;
    this.goalService.searchSprintUserStories(userStorySearchCriteria).subscribe((x: any) => {
      var userStories = x.data;
      var filterUserStories = this.getFilterUserStories(userStories);
      filterUserStories.forEach((userStory) => {
        if (userStory.subUserStoriesList.length > 0) {
          var subTasks = userStory.subUserStoriesList;
          subTasks.forEach((task) => {
            if (task.deadLineDate) {
              var subUserStory = new UserStory();
              subUserStory = task;
              var idx = userStories.indexOf(subUserStory);
              if (idx == -1) {
                userStories.push(subUserStory);
              }
            }
          })
        }
      })
      this.userStories = userStories;
      this.length = this.userStories.length;
      this.userStoriesDummy = this.userStories;
      this.defaultFilterByAssignee();
    })
  }

  getFilterUserStories(userStories) {
    userStories.forEach(userStory => {
      userStory.subUserStoriesList = [];
      if (userStory.subUserStories) {
        var subLists = [];
        let featuresListJson = JSON.parse(userStory.subUserStories);
        var subUserStoriesList = featuresListJson.ChildUserStories;
        subUserStoriesList.forEach((userStory) => {
          var userStoryModel = new UserStory();
          userStoryModel = userStory;
          subLists.push(userStoryModel);
        })
        userStory.subUserStoriesList = subLists;
      }
      else {
        userStory.subUserStoriesList = [];
      }
    })
    return userStories;
  }
}