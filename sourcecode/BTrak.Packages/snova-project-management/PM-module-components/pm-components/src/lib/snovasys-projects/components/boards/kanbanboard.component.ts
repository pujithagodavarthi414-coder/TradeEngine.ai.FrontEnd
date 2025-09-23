import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnInit } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { ActivatedRoute } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil, take } from "rxjs/operators";
import { Store, select } from "@ngrx/store";
import { Subject } from "rxjs";
import * as _ from "underscore";
import { UserStory } from "../../models/userStory";
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import { WorkflowStatus } from "../../models/workflowStatus";
import * as userStoryActions from "../../store/actions/userStory.actions";
import { State } from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { EntityRoleFeatureModel } from '../../models/entityRoleFeature';
import { EntityTypeFeatureIds } from '../../../globaldependencies/constants/entitytype-feature-ids';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Component({
  selector: "app-pm-kanbanboard",
  templateUrl: "./kanbanboard.component.template.html",
  encapsulation: ViewEncapsulation.None
})
export class KanbanboardComponent extends AppFeatureBaseComponent implements OnInit {
  @Output() openUniquePage = new EventEmitter<any>();
  @Output() getGoalReplanId = new EventEmitter<string>();
  userStorySearchCriteria: UserStorySearchCriteriaInputModel;
  goal;
  goalUniqueDetailPage: boolean;
  @Input("goal")
  set _goal(data) {
    this.goal = data;
    this.checkViewUserStoryPermission();
    this.ownerUserList = null;
    this.searchText = null;
    this.versionNamesearchText = null;
    this.bugPriorityIdList = null;
    this.componentList = null;
    this.searchTags = null;
    this.userStoryTypeList = null;
  }

  @Input("userStorySearchCriteria")
  set setGoalSearchCriteria(
    userStorySearchCriteria: UserStorySearchCriteriaInputModel
  ) {
    this.userStorySearchCriteria = userStorySearchCriteria;
    this.checkViewUserStoryPermission();
  }

  isTheBoardLayoutKanban;
  @Input("isTheBoardLayoutKanban")
  set _isTheBoardLayoutKanban(isTheBoardLayoutKanban: boolean) {
    this.isTheBoardLayoutKanban = isTheBoardLayoutKanban;
  }
  @Input("goalUniqueDetailPage")
  set _goalUniqueDetailPage(data: boolean) {
    this.goalUniqueDetailPage = data;
  }

  @Input('notFromAudits')
  set _notFromAudits(data: boolean) {
    if (data || data == false) {
      this.notFromAudits = data;
    }
    else
      this.notFromAudits = true;
  }

  @Input("isGoalsFiltersVisible")
  set _isFiltersVisible(data: boolean) {
    if (data || data == false) {
      this.isGoalsFiltersVisible = data;
    }
  }

  @Output() eventClicked = new EventEmitter<any>();
  @Output() selectedUserStory = new EventEmitter<UserStory>();
  @Output() getGoalRelatedBurnDownCharts = new EventEmitter<string>();
  @Output() getGoalCalenderView = new EventEmitter<string>();
  @Output() updateUserStoryGoalEvent = new EventEmitter<UserStory>();
  @Output() getDocumentStore = new EventEmitter<string>();
  @Output() getGoalEmployeeTaskBoard = new EventEmitter<any>();

  entityRolePermisisons$: Observable<EntityRoleFeatureModel[]>;
  entityRolePermisisons: EntityRoleFeatureModel[];
  anyOperationInProgress$: Observable<boolean>;
  workflowStatus$: Observable<WorkflowStatus[]>;
  userStories$: Observable<UserStory[]>;
  isPermissionForViewStories: boolean;
  searchText: string;
  versionNamesearchText: string;
  userStoryTypeList: string;
  searchTags: string;
  ownerId: string;
  selectedUserStoryId: string;
  goalReplanId: string;
  sortType: string;
  bugPriorityId: string;
  userStories: UserStory[];
  selectedUserStories = [];
  userStoryChecked: boolean;
  showCheckBox: boolean;
  ownerUserList: string;
  bugPriorityIdList: string;
  userStoryStatusIdList: string;
  isReportsPage = false;
  notFromAudits: boolean = true;
  isGoalsFiltersVisible: boolean = false;
  componentList: string;
  allUserStorieSelected: boolean;
  superAgile:string="kanban";
  public ngDestroyed$ = new Subject();
  constructor(
    private store: Store<State>,
    private route: ActivatedRoute,
    private actionUpdates$: Actions) {
    super();
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.SearchUserStoriesComplete),
        tap(() => {
          this.userStories$.subscribe(
            (userStory) => (this.userStories = userStory)
          );
        })
      )
      .subscribe();
  }

  ngOnInit() {
    super.ngOnInit();
    this.anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducer.userStoriesLoading)
    );
    this.userStories$ = this.store.pipe(
      select(projectModuleReducer.getUserStorySearchResults)
    );

  }

  afterClicked(selectedItem) {
    this.eventClicked.emit(selectedItem);
  }

  HandleSelectedUserStory(userStory) {
    this.selectedUserStory.emit(userStory);
  }

  searchUserStoriesBasedOnUserStoryName(searchText) {
    this.searchText = searchText;
  }

  searchUserStoriesBasedOnVersionName(versionNamesearchText) {
    this.versionNamesearchText = versionNamesearchText;
  }

  searchUserStoriesBasedOnTags(searchTags) {
    this.searchTags = searchTags;
  }

  searchUserStoriesBasedOnOwnerId(userId) {
    this.ownerId = userId;
  }
  searchUserStoriesBasedOnBugPriorities(bugPriorityId) {
    this.bugPriorityId = bugPriorityId;
  }

  filterUserStoriesByAssignee(ownerUserId) {
    this.ownerUserList = ownerUserId;
  }

  filterUserStoriesByBugPriorities(bugPriorityId) {
    this.bugPriorityIdList = bugPriorityId;
  }

  filterUserStoryStatusComponent(userStoryStatusId) {
    this.userStoryStatusIdList = userStoryStatusId;
  }

  filterUserStoryTypesComponent(userStoryTypeId) {
    this.userStoryTypeList = userStoryTypeId;
  }
  searchRecordsBasedOnSort(sortId) {
    this.sortType = sortId;
  }

  saveTransitionForMultipleUserStories(userStoryModel) {
    this.saveMultipleUserStories(userStoryModel);
  }

  saveMultipleUserStories(userStoryModel) {
    userStoryModel.ProjectId = this.goal.projectId;
    userStoryModel.UserStoryIds = this.selectedUserStories;
    userStoryModel.goalId = this.goal.goalId;
    this.store.dispatch(
      new userStoryActions.CreateMultipleUserStoriestriggered(userStoryModel)
    );
  }

  amendUserStoryDeadlineEvent(userStoryModel) {
    userStoryModel.userStoryIds = this.selectedUserStories;
    userStoryModel.amendBy = true;
    this.store.dispatch(
      new userStoryActions.AmendUserStoryDeadlineTriggered(userStoryModel)
    );
  }

  filterUserStoriesBySelectedComponent(projectFeatureId) {
    this.componentList = projectFeatureId;
  }
  checkAllUserStories(checked) {
    if (checked) {
      this.userStoryChecked = true;
      this.showCheckBox = true;
      this.selectedUserStories = this.userStories.map((item) => item.userStoryId);
    } else {
      this.userStoryChecked = false;
      this.showCheckBox = false;
      this.selectedUserStories = [];
    }
  }

  checkViewUserStoryPermission() {
    if(this.goal){
    if (this.goal.goalId !== "00000000-0000-0000-0000-000000000000") {
      let projectId = this.goal.projectId;
      let entityRolefeatures = JSON.parse(localStorage.getItem(LocalStorageProperties.UserRoleFeatures));
      if(entityRolefeatures && entityRolefeatures.length > 0) {
        this.entityRolePermisisons = entityRolefeatures.filter(function (role: any) {
          return role.projectId == projectId
        })
        let featurePermissions = [];
      if (this.entityRolePermisisons && this.entityRolePermisisons.length > 0) {
        featurePermissions = this.entityRolePermisisons;
        if (featurePermissions.length > 0) {
          const entityTypeFeatureForViewUserStories = EntityTypeFeatureIds.EntityTypeFeature_ViewWorkItem.toString().toLowerCase();
          // tslint:disable-next-line: only-arrow-functions
          const viewUserStoryPermisisonsList = _.filter(featurePermissions, function (permission) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForViewUserStories)
          })
          if (viewUserStoryPermisisonsList.length > 0) {
            this.isPermissionForViewStories = true;
          } else {
            this.isPermissionForViewStories = false;
          }
        }
      }
      }
    } else if (this.goal.goalId === "00000000-0000-0000-0000-000000000000") {
      this.isPermissionForViewStories = true;
    }
  }
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.ngDestroyed$.next();
  }

  getChartDetails(event) {
    this.getGoalRelatedBurnDownCharts.emit("");
  }

  getCalanderView(event) {
    this.getGoalCalenderView.emit("");
  }

  getDocumentView(event) {
    this.getDocumentStore.emit('');
  }

  getEmployeeTaskBoard(event) {
    this.getGoalEmployeeTaskBoard.emit('');
  }

  updateUserStoryGoal(userStory) {
    this.updateUserStoryGoalEvent.emit(userStory);
  }

  getOpenUniquePage(data) {
    this.openUniquePage.emit(data);
  }

  goalReplanStarted(event) {
    this.goalReplanId = event;
    this.getGoalReplanId.emit(event);
  }
}
