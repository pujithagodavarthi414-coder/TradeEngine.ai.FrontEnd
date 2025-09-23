// tslint:disable-next-line: ordered-imports
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
// tslint:disable-next-line: ordered-imports
import { SatPopover } from "@ncstate/sat-popover";
// tslint:disable-next-line: ordered-imports
import { Actions, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
// tslint:disable-next-line: ordered-imports
import { select, Store } from "@ngrx/store";
// tslint:disable-next-line: ordered-imports
import { Guid } from "guid-typescript";
// tslint:disable-next-line: ordered-imports
import { DragulaService } from "ng2-dragula";
// tslint:disable-next-line: ordered-imports
import { Subject, Subscription } from "rxjs";
import { combineLatest } from "rxjs/index";
import { Observable } from "rxjs/Observable";
// tslint:disable-next-line: ordered-imports
import { map, take, takeUntil, tap } from "rxjs/operators";
import * as _ from "underscore";
import * as ProjectState from "../../store/reducers/index";
import { GoalModel } from "../../models/GoalModel";
import { ArchivedkanbanModel } from "../../models/kanbanViewstatusModel";
// tslint:disable-next-line: ordered-imports
import { UserStory } from "../../models/userStory";
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import { WorkflowStatus } from "../../models/workflowStatus";
import { WorkFlowStatusTransitionTableData } from "../../models/workFlowStatusTransitionTableData";
// tslint:disable-next-line: ordered-imports
import * as userStoryActions from "../../store/actions/userStory.actions";
import { ArchivekanbanGoalsTriggered, UserStoryActionTypes } from "../../store/actions/userStory.actions";
import { LoadworkflowStatusTransitionTriggered } from "../../store/actions/work-flow-status-transitions.action";
// tslint:disable-next-line: ordered-imports
import { LoadworkflowStatusTriggered, workFlowStatusActionTypes } from "../../store/actions/work-flow-status.action";
import { State } from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";
import { SprintModel } from "../../models/sprints-model";
import { GetSprintWorkItemTriggered, SprintWorkItemActionTypes, GetSprintWorkItemByIdTriggered, UpsertSprintWorkItemTriggered, ArchiveKanbanSprintsTriggered } from "../../store/actions/sprint-userstories.action";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { EntityRoleFeatureModel } from '../../models/entityRoleFeature';
import { BoardTypeIds } from '../../../globaldependencies/constants/board-types';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { UserStoryLogTimeModel } from '../../models/userStoryLogTimeModel';
import { InsertAutoLogTimeTriggered } from '../../store/actions/userStory-logTime.action';
import { EntityTypeFeatureIds } from '../../../globaldependencies/constants/entitytype-feature-ids';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { UserStorySubTasksTagsPipe } from "../../pipes/subtasks-tags-filter.pipes";

@Component({
  selector: "app-pm-component-kanbanviewstatus",
  templateUrl: "kanbanViewStatus.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class KanbanViewStatusComponent extends AppFeatureBaseComponent implements OnInit {
  @Output() openUniquePage = new EventEmitter<any>();

  userStories: UserStory[];
  @Input("goal")
  set _goal(data) {
    this.goal = data;
    if (this.goal) {
      this.projectId = this.goal.projectId;
      this.setGoalParams();
    }
  }

  @Input("sprint")
  set _sprint(data: SprintModel) {
    this.sprint = data;
    if (this.sprint) {
      this.projectId = this.sprint.projectId;
      this.setSprintParams();
    }
  }



  @Input("userStorySearchCriteria")
  set setGoalSearchCriteria(
    userStorySearchCriteria: UserStorySearchCriteriaInputModel
  ) {
    this.userStorySearchCriteria = userStorySearchCriteria;
    if (this.userStorySearchCriteria.goalId) {
      this.isFromSprint = false;
    } else {
      this.isFromSprint = true;
    }
    this.checkPermissionsForUserStory();
    this.workflowStatus$.pipe(
      take(1))
      .subscribe((s) => {
        (this.workflowStatusList = s);
      });

    if (this.workflowStatusList && this.workflowStatusList.length > 0) {
      if (this.userStorySearchCriteria.refreshUserStoriesCall) {
        if (!this.isFromSprint) {
          this.store.dispatch(new userStoryActions.SearchUserStories(this.userStorySearchCriteria));
        } else {
          this.store.dispatch(new GetSprintWorkItemTriggered(this.userStorySearchCriteria));
        }
      }
    } else {
      this.store.dispatch(new LoadworkflowStatusTriggered(this.workFlowModel));
    }
  }

  @Input("searchText")
  set _searchText(data) {
    this.searchText = data;
  }

  @Input("versionNamesearchText")
  set _versionNamesearchText(data) {
    this.versionNamesearchText = data;
  }

  @Input("searchTags")
  set _searchTags(data) {
    this.searchTags = data;
  }

  @Input("ownerUserList")
  set _ownerUserList(data) {
    this.ownerUserList = data;
  }

  @Input("bugPriorityIdList")
  set _bugPriorityIdList(data) {
    this.bugPriorityIdList = data;
  }

  @Input("componentList")
  set _componentList(data) {
    this.componentList = data;
  }
  @Input("selectedUserStoryId")
  set _selectedUserStoryId(data) {
    this.selectedUserStoryId = data;
  }
  @Input("userStoryStatusIdList")
  set _userStoryStatusIdList(data) {
    this.userStoryStatusIdList = data;
  }
  @Input("userStoryTypeList")
  set _userStoryTypeList(data) {
    this.userStoryTypeList = data;
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

  @Input("goalReplanId")
  set _goalReplanId(data: string) {
    this.goalReplanId = data;
  }

  userStorySearchCriteria: UserStorySearchCriteriaInputModel;
  anyOperationInProgressForAutoLogging$: Observable<boolean>;
  @Output() selectedUserStory = new EventEmitter<UserStory>();
  @Output() updateUserStoryGoal = new EventEmitter<UserStory>();
  @ViewChildren("addKanbanUserStoryPopover") addUserStoryPopUp;
  @ViewChild("editUserStoryPopover") editUserStory: SatPopover;
  @ViewChildren("archiveAllCompleteUserStoryPopUp") archiveAllCompleteUserStory;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  userStories$: Observable<UserStory[]>;
  workflowStatus$: Observable<WorkflowStatus[]>;
  workflowStatusTransitions$: Observable<WorkFlowStatusTransitionTableData[]>;
  entityRolePermisisons$: Observable<EntityRoleFeatureModel[]>;
  entityRolePermisisons: EntityRoleFeatureModel[];
  anyOperationInProgress$: Observable<boolean>;
  createUserstoryLoading$: Observable<boolean>;
  sprintUserstoryLoading$: Observable<boolean>;
  archiveUserStoriesInProgress$: Observable<boolean>;
  updateUserStoryGoalIsInProgress$: Observable<boolean>;
  getUserStoriesLoading$: Observable<boolean>;
  filteredListOfCompletedUserStories: UserStory[];
  filteredListOfVerifiedUserStories: UserStory[];
  workflowStatusList: WorkflowStatus[];
  goal: GoalModel;
  isFromSprint: boolean;
  sprint: SprintModel;
  userStoryId: string;
  sprintId: string;
  isDeleteSprint: boolean;
  goalId: string;
  searchText: string;
  versionNamesearchText: string;
  bugPriorityIdList: string;
  ownerUserList: string;
  userStoryStatusIdList: string;
  userStoryTypeList: string;
  searchTags: string;
  componentList: string;
  isActiveGoalStatusId: boolean;
  isAnyOperationIsInprogress: boolean;
  isPermissionForUserStory: boolean;
  workFlowModel: WorkflowStatus;
  estimatedTime: string;
  // tslint:disable-next-line: ban-types
  canMoveUserStoryFromOneGoalToAnother: Boolean;
  isSuperagileBoard: boolean;
  isListViewType: boolean;
  KanbanUserStoryForm: FormGroup;
  userStory: UserStory;
  addUserStory: boolean;
  isPermisisontoChangeGoal: boolean;
  isPermissionForAddUserStory: boolean;
  KanbanForm: boolean;
  userStoryStatusId: string;
  goalReplanId: string;
  selectedUserStoryId: string;
  tab: string;
  projectId: string;
  isAddUserStory = true;
  isDraggable: boolean;
  notFromAudits: boolean = true;
  isGoalsFiltersVisible: boolean = false;
  ArchivedGoalUserStory = false;
  ParkedGoalUserStory = false;
  isInlineEdit: boolean;
  isInlineEditForEstimatedTime: boolean;
  isInlineEditForUserStoryStatus: boolean;
  isInlineEditForUserStoryOwner: boolean;
  isParkUserStory: boolean;
  isArchiveUserStory: boolean;
  titleText: string;
  kanbanBoardFlexPercentage = "10.7";
  userStoriesIntoDictionaryByWorkflowStatusId: any;
  isKanbanArchived: boolean;
  timeStamp: any;
  isArchived = false;
  subs = new Subscription();
  isGoalUserStory: boolean;
  maxOrderId: number;
  isUserStorySelected: boolean;
  workFlowStatuses: WorkflowStatus[];
  doneTaskStatusId: string;
  verificationCompletedTaskStatusId: string;

  public ngDestroyed$ = new Subject();
  dragulaBoardUniqueId: string;

  private acceptDragulaCallback = (el, target, source, sibling) => {
    let workflowStatusTransitions: WorkFlowStatusTransitionTableData[];
    this.userStoryId = el.attributes["data-userStoryId"].nodeValue;
    let currentUserStories: UserStory[];
    this.userStories$
      .subscribe((s) => (currentUserStories = s));
    // tslint:disable-next-line:only-arrow-functions
    const filteredListOfUserStories = currentUserStories.filter(function (userStoryInner) {
      return (userStoryInner.userStoryId ===
        el.attributes["data-userStoryId"].nodeValue);
    });

    this.workflowStatusTransitions$
      .subscribe((s) => (workflowStatusTransitions = s));

    const fromUserStoryStatus = el.attributes["data-userstoryStatusId"].nodeValue;
    const toUserStoryStatus =
      target.attributes["data-userstoryStatusId"].nodeValue;

    if (fromUserStoryStatus === toUserStoryStatus) {
      return this.isActiveGoalStatusId && true;
    } else {
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = workflowStatusTransitions.filter(function (
        statusTansition
      ) {
        return (
          (statusTansition.fromWorkflowUserStoryStatusId === fromUserStoryStatus &&
            statusTansition.toWorkflowUserStoryStatusId === toUserStoryStatus) ||
          fromUserStoryStatus === toUserStoryStatus
        );
      });

      // tslint:disable-next-line:max-line-length
      const canAccept = filteredList.length > 0 && this.isActiveGoalStatusId && !filteredListOfUserStories[0].userStoryArchivedDateTime && !filteredListOfUserStories[0].userStoryParkedDateTime;

      return canAccept;
    }
  };

  constructor(
    private dragulaService: DragulaService,
    private store: Store<ProjectState.State>,
    private actionUpdates$: Actions,
    private route: ActivatedRoute,
    private router: Router,
    private subTasksPipe: UserStorySubTasksTagsPipe
  ) {
    super();
    this.handleDragulaDropActions(dragulaService);    
    //this.sharedStore.dispatch(new CompanyWorkItemStartFunctionalityRequired());

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(workFlowStatusActionTypes.LoadworkflowStatusCompleted),
        tap(() => {
          if (this.userStorySearchCriteria.refreshUserStoriesCall) {
            if (this.isFromSprint) {
              this.store.dispatch(new GetSprintWorkItemTriggered(this.userStorySearchCriteria));
            } else {
              this.store.dispatch(new userStoryActions.SearchUserStories(this.userStorySearchCriteria));
            }
          }
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(UserStoryActionTypes.CreateUserStoryFailed),
        tap(() => {
          if (this.userStoryId) {
            this.store.dispatch(new userStoryActions.GetUserStoryByIdTriggered(this.userStoryId));
          }
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.UpsertSprintWorkItemFailed),
        tap(() => {
          if (this.userStoryId) {
            this.store.dispatch(new GetSprintWorkItemByIdTriggered(this.userStoryId, true));
          }
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(UserStoryActionTypes.SearchUserStoriesComplete),
        tap(() => {
          this.userStories$ = this.store.pipe(
            select(projectModuleReducer.getAllUserStories),
            tap((userStoriesList) => {
              this.userStories = userStoriesList;
              const selectedWorkFlowOrderId = this.workFlowStatuses[this.workFlowStatuses.length - 1].userStoryStatusId;

              this.filteredListOfCompletedUserStories = _.where(userStoriesList, {
                userStoryStatusId: selectedWorkFlowOrderId
              });
              this.convertUserStoriesIntoDictionaryByWorkflowStatusId(
                userStoriesList
              );
            })
          );
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.GetSprintWorkItemCompleted),
        tap(() => {
          this.userStories$ = this.store.pipe(
            select(projectModuleReducer.getSprintWorkItemsAll),
            tap((userStoriesList) => {
              const selectedWorkFlowOrderId = this.workFlowStatuses[this.workFlowStatuses.length - 1].userStoryStatusId;

              this.filteredListOfCompletedUserStories = _.where(userStoriesList, {
                userStoryStatusId: selectedWorkFlowOrderId
              });
              this.convertUserStoriesIntoDictionaryByWorkflowStatusId(
                userStoriesList
              );
            })
          );
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(UserStoryActionTypes.ArchivekanbanGoalsCompleted),
        tap(() => {
          this.archiveAllCompleteUserStory.forEach((p) => p.closePopover());
        })
      )
      .subscribe();

  }

  private handleDragulaDropActions(dragulaService: DragulaService) {
    this.dragulaBoardUniqueId = Guid.create().toString();
    dragulaService.createGroup(this.dragulaBoardUniqueId, {
      accepts: this.acceptDragulaCallback,
      // removeOnSpill: true,
      revertOnSpill: true
    });

    this.subs.add(this.dragulaService
      .dropModel(this.dragulaBoardUniqueId)
      .subscribe(({ name, el, target, source }) => {
        // tslint:disable-next-line: prefer-const
        let fromStatus = source.attributes["data-userstoryStatusId"].nodeValue;
        // tslint:disable-next-line: prefer-const
        let toStatus = target.attributes["data-userstoryStatusId"].nodeValue;
        if (fromStatus !== toStatus) {
          let currentUserStories: UserStory[];
          this.userStories$
            .subscribe((s) => (currentUserStories = s));

          // tslint:disable-next-line: only-arrow-functions
          const filteredListOfUserStories = currentUserStories.filter(function (userStoryInner) {
            return (userStoryInner.userStoryId ===
              el.attributes["data-userStoryId"].nodeValue);
          });
          if (filteredListOfUserStories &&
            filteredListOfUserStories.length > 0) {
            this.userStoryId = el.attributes["data-userStoryId"].nodeValue;
            if (this.isFromSprint) {
              this.store.dispatch(new UpsertSprintWorkItemTriggered({
                ...filteredListOfUserStories[0],
                userStoryStatusId: target.attributes["data-userstoryStatusId"].nodeValue,
                isStatusChanged: false,
                isNewUserStory: false,
                oldOwnerUserId:  filteredListOfUserStories[0].ownerUserId
              }));
            } else {
              this.store.dispatch(new userStoryActions.CreateUserStoryTriggered({
                ...filteredListOfUserStories[0],
                userStoryStatusId: target.attributes["data-userstoryStatusId"].nodeValue,
                isStatusChanged: false,
                isNewUserStory: false,
                oldOwnerUserId:  filteredListOfUserStories[0].ownerUserId
              }));
            }
          }
        } else {
          this.dragulaService.find(this.dragulaBoardUniqueId).drake.cancel(true);
        }
      }));

    this.subs.add(this.dragulaService.removeModel(this.dragulaBoardUniqueId)
      .subscribe(({ el, container, source }) => {
        console.log("out", container);
        this.userStoryId = el.attributes["data-userStoryId"].nodeValue;
        let currentUserStories: UserStory[];
        this.userStories$
          .subscribe((s) => (currentUserStories = s));
        // tslint:disable-next-line: only-arrow-functions
        const filteredListOfUserStories = currentUserStories.filter(function (userStoryInner) {
          return (userStoryInner.userStoryId ===
            el.attributes["data-userStoryId"].nodeValue);
        });
        if (filteredListOfUserStories.length > 0) {
          // tslint:disable-next-line: prefer-const
          let userStoryModel = new UserStory();
          userStoryModel.userStoryId = this.userStoryId;
          userStoryModel.userStoryName = filteredListOfUserStories[0].userStoryName;
          userStoryModel.timeStamp = filteredListOfUserStories[0].timeStamp;
          userStoryModel.userStoryUniqueName = filteredListOfUserStories[0].userStoryUniqueName;
          userStoryModel.oldGoalId = filteredListOfUserStories[0].goalId;
          if (this.isPermisisontoChangeGoal || this.canMoveUserStoryFromOneGoalToAnother) {
            this.updateUserStoryGoal.emit(userStoryModel);
          } else {
            this.dragulaService.find(this.dragulaBoardUniqueId).drake.cancel(true);
            this.store.dispatch(new userStoryActions.GetUserStoryByIdTriggered(this.userStoryId));
          }
        } else {
          this.dragulaService.find(this.dragulaBoardUniqueId).drake.cancel(true);
          this.store.dispatch(new userStoryActions.GetUserStoryByIdTriggered(this.userStoryId));
        }

      })
    );
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabelConfigurations();
    
    this.verificationCompletedTaskStatusId = BoardTypeIds.VerificationCompletedTaskStatusId.toLowerCase();
    this.doneTaskStatusId = BoardTypeIds.DoneTaskStatusId.toLowerCase();

    this.anyOperationInProgressForAutoLogging$ = this.store.pipe(
      select(projectModuleReducer.insertAutoLogTimeLoading)
    );

    this.userStories$ = this.store.pipe(
      select(projectModuleReducer.getAllUserStories),
      tap((userStoriesList) => {
        this.userStories = userStoriesList;
        this.convertUserStoriesIntoDictionaryByWorkflowStatusId(
          userStoriesList
        );
      })
    );

    this.workflowStatusTransitions$ = this.store.pipe(
      select(projectModuleReducer.getworkflowStatusTransitionAll)
    );

    const getworkflowStatusLoading$ = this.store.pipe(
      select(projectModuleReducer.getworkflowStatusLoading)
    );
    const workflowStatusTransitionsLoading$ = this.store.pipe(
      select(projectModuleReducer.getworkflowStatusTransitionLoading)
    );
    this.getUserStoriesLoading$ = this.store.pipe(
      select(projectModuleReducer.userStoriesLoading)
    );
    const sprintUserStoriesLoading$ = this.store.pipe(
      select(projectModuleReducer.getSprintWorkItemsLoading)
    );
    this.createUserstoryLoading$ = this.store.pipe(
      select(projectModuleReducer.createUserStoryLoading)
    );

    this.sprintUserstoryLoading$ = this.store.pipe(
      select(projectModuleReducer.upsertSprintworkItemsLoading)
    );
    this.updateUserStoryGoalIsInProgress$ = this.store.pipe(
      select(projectModuleReducer.updateUserStoryGoalInProgress)
    );

    this.anyOperationInProgress$ = combineLatest(
      getworkflowStatusLoading$,
      workflowStatusTransitionsLoading$,
      sprintUserStoriesLoading$

    ).pipe(
      map(
        ([
          getworkflowStatusLoading,
          workflowStatusTransitionsLoading,
          getSprintWorkItemsLoading
        ]) =>
          getworkflowStatusLoading ||
          workflowStatusTransitionsLoading ||
          getSprintWorkItemsLoading

      )
    );

   const archiveUserStoriesInProgress$ = this.store.pipe(select(projectModuleReducer.archiveUserStoriesLoading));
   const archiveKanbanInProgress$ = this.store.pipe(select(projectModuleReducer.archiveWorkItemsLoading));

   this.archiveUserStoriesInProgress$ =  combineLatest(
    archiveUserStoriesInProgress$,
    archiveKanbanInProgress$
  
  ).pipe(
    map(
      ([
        archiveUserStoriesLoading,
        archiveWorkItemsLoading,
       
      ]) =>
      archiveUserStoriesLoading ||
      archiveWorkItemsLoading 
    )
  );

  }

  setGoalParams() {
    this.isFromSprint = false;
    if (this.goal.goalStatusId === ConstantVariables.ActiveGoalStatusId.toLowerCase()) {
      this.isActiveGoalStatusId = true;
    } else {
      this.isActiveGoalStatusId = false;
    }
    const workflowStatus = new WorkflowStatus();
    workflowStatus.workFlowId = this.goal.workflowId;
    this.workFlowModel = workflowStatus;
    this.workflowStatus$ = this.store.pipe(
      select(projectModuleReducer.getworkflowStatusAllByWorkflowId, { workflowId: workflowStatus.workFlowId }),
      tap((workflowStatuses) => {
        this.userStoriesIntoDictionaryByWorkflowStatusId = {};
        this.workFlowStatuses = workflowStatuses;
        // tslint:disable-next-line: no-shadowed-variable
        for (const workflowStatus of workflowStatuses) {
          this.maxOrderId = workflowStatus.maxOrder;
          this.userStoriesIntoDictionaryByWorkflowStatusId[
            workflowStatus.userStoryStatusId
          ] = [];
        }

        this.kanbanBoardFlexPercentage = "" + 97 / workflowStatuses.length;
      })
    );

    const workflowTransitionTransitionFetchInput = new WorkFlowStatusTransitionTableData();
    workflowTransitionTransitionFetchInput.goalId = this.goal.goalId;
    this.store.dispatch(
      new LoadworkflowStatusTransitionTriggered(
        workflowTransitionTransitionFetchInput
      )
    );

    if (!this.goal.isBugBoard || this.goal.boardTypeUiId === BoardTypeIds.BoardViewKey) {
      this.KanbanForm = true;
      this.isSuperagileBoard = false;
    } else if (this.goal.isBugBoard || this.goal.boardTypeUiId === BoardTypeIds.BoardViewKey) {
      this.KanbanForm = false;
      this.isSuperagileBoard = false;
    } else {
      this.isSuperagileBoard = true;
    }

    this.isListViewType = this.goal.isSuperAgileBoard ? true : false;

    if (this.goal.inActiveDateTime != null || this.goal.parkedDateTime != null) {
      this.isGoalUserStory = false;
    } else {
      this.isGoalUserStory = true;
    }
  }

  setSprintParams() {
    this.isFromSprint = true;
    if (this.sprint.sprintStartDate && !this.sprint.isReplan) {
      this.isActiveGoalStatusId = true;
    } else {
      this.isActiveGoalStatusId = false;
    }
    if(!this.sprint.isComplete && !this.sprint.inActiveDateTime) {
      this.isDeleteSprint = false;
    } else {
      this.isDeleteSprint = true;
    }
    const workflowStatus = new WorkflowStatus();
    workflowStatus.workFlowId = this.sprint.workFlowId;
    this.workFlowModel = workflowStatus;
    this.workflowStatus$ = this.store.pipe(
      select(projectModuleReducer.getworkflowStatusAllByWorkflowId, { workflowId: workflowStatus.workFlowId }),
      tap((workflowStatuses) => {
        this.userStoriesIntoDictionaryByWorkflowStatusId = {};
        this.workFlowStatuses = workflowStatuses;
        // tslint:disable-next-line: no-shadowed-variable
        if (workflowStatuses) {
          for (const workflowStatus of workflowStatuses) {
            this.maxOrderId = workflowStatus.maxOrder;
            this.userStoriesIntoDictionaryByWorkflowStatusId[
              workflowStatus.userStoryStatusId
            ] = [];
          }
          this.kanbanBoardFlexPercentage = "" + 97 / workflowStatuses.length;
        }
      })
    );

    const workflowTransitionTransitionFetchInput = new WorkFlowStatusTransitionTableData();
    workflowTransitionTransitionFetchInput.sprintId = this.sprint.sprintId;
    this.store.dispatch(
      new LoadworkflowStatusTransitionTriggered(
        workflowTransitionTransitionFetchInput
      )
    );

    if (!this.sprint.isBugBoard || this.sprint.boardTypeUiId === BoardTypeIds.BoardViewKey) {
      this.KanbanForm = true;
      this.isSuperagileBoard = false;
    } else if (this.sprint.isBugBoard || this.sprint.boardTypeUiId === BoardTypeIds.BoardViewKey) {
      this.KanbanForm = false;
      this.isSuperagileBoard = false;
    } else {
      this.isSuperagileBoard = true;
    }

    this.isListViewType = this.sprint.isSuperAgileBoard ? true : false;

    if (this.sprint.inActiveDateTime) {
      this.isGoalUserStory = false;
    } else {
      this.isGoalUserStory = true;
    }
  }

  closeDialog() {
    this.archiveAllCompleteUserStory.forEach((p) => p.closePopover());
  }

  getSubChildFilters(userStories, searchText, search) {
    let subUserStories = [];
    const childUserStories = [];
    let filteredChildUserStories = [];
    let parentUserStories = [];
    parentUserStories = userStories;
    // tslint:disable-next-line: prefer-const
    // tslint:disable-next-line: only-arrow-functions
    const userStoriesList = userStories.filter(function (userStory) {
      return userStory.subUserStories != null
    })

    userStoriesList.forEach((subTasks) => {
      subUserStories = subTasks.subUserStoriesList;
      if (subUserStories.length > 0) {

        if (search === "isUserStoryNameSearch") {
          // tslint:disable-next-line: only-arrow-functions
          filteredChildUserStories = _.filter(subUserStories, function (s) {
            return s.userStoryName.toLowerCase().includes(searchText.toLowerCase().trim());
          });
        } else if (search === "tags") {
          filteredChildUserStories = this.subTasksPipe.transform(subUserStories,searchText);
          // tslint:disable-next-line: only-arrow-functions
        } else if (search === "userStoryStatus") {
          // tslint:disable-next-line: prefer-const
          let userStoryStatus = searchText.split(",");
          // tslint:disable-next-line: only-arrow-functions
          filteredChildUserStories = _.filter(subUserStories, function (s) {
            if (s.userStoryStatusId) {
              return userStoryStatus.includes(s.userStoryStatusId.toLowerCase());
            }
          });
        } else if (search === "ownerUser") {
          const ownerUsers = searchText.split(",");
          // tslint:disable-next-line: only-arrow-functions
          filteredChildUserStories = _.filter(subUserStories, function (s) {
            if (s.ownerUserId) {
              return ownerUsers.includes(s.ownerUserId.toLowerCase());
            }
          });
        } else if (search === "userStoryType") {
          // tslint:disable-next-line: prefer-const
          let userStoryType = searchText.split(",");
          // tslint:disable-next-line: only-arrow-functions
          filteredChildUserStories = _.filter(subUserStories, function (s) {
            if (s.userStoryTypeId) {
              return userStoryType.includes(s.userStoryTypeId.toLowerCase());
            }
          });
        }
        if (filteredChildUserStories.length > 0) {
          filteredChildUserStories.forEach((userStory) => {
            childUserStories.push(userStory.parentUserStoryId.toLowerCase());
          })
        }
      }
    })
    // tslint:disable-next-line: only-arrow-functions
    const childUserStoriesList = _.filter(parentUserStories, function (s) {
      return childUserStories.includes(s.userStoryId);
    });
    return childUserStoriesList;
  }

  archiveAllCompleteUserStoryPopoveropen() {
    this.goalId = this.goal ? this.goal.goalId : null;
    this.sprintId = this.sprint ? this.sprint.sprintId : null;
  }

  navigateToUserStoriesPage(userStoryId) {
    this.router.navigate([
      "projects/userstory",
      userStoryId
    ]);
  }

  getUserStoryStatusId(statusId) {
    this.userStoryStatusId = statusId;
  }

  getSoftLabelConfigurations() {
   this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  ArchiveAllUserStories() {
    var workflowStatus = this.workFlowStatuses;
    let userStories = this.userStories;
    let selectedWorkFlowOrder = workflowStatus.filter((function(status: any) {
      return status.canDelete == true
    }))

    this.filteredListOfCompletedUserStories = _.where(userStories, {
      userStoryStatusId: selectedWorkFlowOrder[0].userStoryStatusId
    });
    this.isAnyOperationIsInprogress = true;
    const archivedkanbanModel = new ArchivedkanbanModel();
    archivedkanbanModel.goalId = this.goal ? this.goal.goalId : null;
    archivedkanbanModel.sprintId = this.sprint ? this.sprint.sprintId : null;
    archivedkanbanModel.isFromSprint = this.isFromSprint;
    const ownerUserList = this.ownerUserList;
    const bugPriorityList = this.bugPriorityIdList;
    const componentList = this.componentList;
    const userStoryTypeList = this.userStoryTypeList;
    const searchText = this.searchText;
    const versionName = this.versionNamesearchText;
    const searchTags = this.searchTags;
    const userStoriesList = this.filteredListOfCompletedUserStories;
    if (this.ownerUserList) {
      // tslint:disable-next-line: only-arrow-functions
      this.filteredListOfCompletedUserStories = _.filter(userStoriesList, function (s) {
        return ownerUserList.includes(s.ownerUserId);
      });
      const filteredChildsList = this.getSubChildFilters(userStoriesList, this.ownerUserList, "ownerUser");
      if (filteredChildsList.length > 0) {
        this.filteredListOfCompletedUserStories = _.uniq(this.filteredListOfCompletedUserStories.concat(filteredChildsList));
      } else {
        this.filteredListOfCompletedUserStories = this.filteredListOfCompletedUserStories;
      }
    }

    if (this.bugPriorityIdList) {
      // tslint:disable-next-line: only-arrow-functions
      this.filteredListOfCompletedUserStories = _.filter(userStoriesList, function (s) {
        return bugPriorityList.includes(s.bugPriorityId);
      });
    }

    if (this.componentList) {
      // tslint:disable-next-line: only-arrow-functions
      this.filteredListOfCompletedUserStories = _.filter(userStoriesList, function (s) {
        return componentList.includes(s.projectFeatureName);
      });
    }

    if (this.searchText) {
      // tslint:disable-next-line: only-arrow-functions
      this.filteredListOfCompletedUserStories = userStoriesList.filter(function (userStoryInner) {
        return (userStoryInner.userStoryName.includes(searchText.trim()));
      });
      const filteredChildsList = this.getSubChildFilters(userStoriesList, this.searchText, "isUserStoryNameSearch");
      if (filteredChildsList.length > 0) {
        this.filteredListOfCompletedUserStories = _.uniq(this.filteredListOfCompletedUserStories.concat(filteredChildsList));
      } else {
        this.filteredListOfCompletedUserStories = this.filteredListOfCompletedUserStories;
      }
    }

    if (this.versionNamesearchText) {
      // tslint:disable-next-line: no-shadowed-variable
      let userStories: UserStory[] = [];
      userStories = userStoriesList.filter((x: any) => {
        if (x.versionName) {
          return x.versionName.toLowerCase().includes(versionName.toLowerCase().trim())
        }
      })
      this.filteredListOfCompletedUserStories = userStories;
    }

    if (this.searchTags) {
      let userStories: UserStory[] = [];
      userStories = this.subTasksPipe.transform(this.userStories,searchText);
      this.filteredListOfCompletedUserStories = userStories;
      const filteredChildsList = this.getSubChildFilters(userStoriesList, this.searchTags, "tag");
      if (filteredChildsList.length > 0) {
        this.filteredListOfCompletedUserStories = _.uniq(this.filteredListOfCompletedUserStories.concat(filteredChildsList));
      } else {
        this.filteredListOfCompletedUserStories = this.filteredListOfCompletedUserStories;
      }
    }

    if (this.userStoryTypeList) {
      // tslint:disable-next-line: only-arrow-functions
      this.filteredListOfCompletedUserStories = _.filter(userStoriesList, function (s) {
        return userStoryTypeList.includes(s.userStoryTypeId);
      });
      const filteredChildsList = this.getSubChildFilters(userStoriesList, this.searchText, "userStoryType");
      if (filteredChildsList.length > 0) {
        this.filteredListOfCompletedUserStories = _.uniq(this.filteredListOfCompletedUserStories.concat(filteredChildsList));
      } else {
        this.filteredListOfCompletedUserStories = this.filteredListOfCompletedUserStories;
      }
    }
    // tslint:disable-next-line: prefer-const
    let userstoryIds = this.filteredListOfCompletedUserStories.map((item) => item.userStoryId);
    archivedkanbanModel.userStories = userstoryIds;
    archivedkanbanModel.userStoryStatusId = this.userStoryStatusId;
    if (this.isFromSprint) {
      this.store.dispatch(new ArchiveKanbanSprintsTriggered(archivedkanbanModel));
    } else {
      this.store.dispatch(new ArchivekanbanGoalsTriggered(archivedkanbanModel));
    }
  }

  objectKey(obj) {
    return Object.keys(obj);
  }

  convertUserStoriesIntoDictionaryByWorkflowStatusId(userStories: UserStory[]) {
    const objectKeys = this.objectKey(
      this.userStoriesIntoDictionaryByWorkflowStatusId
    );
    for (const userStoryStatus of objectKeys) {
      // tslint:disable-next-line: prefer-const
      // tslint:disable-next-line: only-arrow-functions
      const filteredUserStories = userStories.filter(function (userStory) {
        if (userStory.userStoryStatusId === userStoryStatus) {
          return true;
        }
        return false;
      });

      for (const userStoryInner of filteredUserStories) {
        this.userStoriesIntoDictionaryByWorkflowStatusId[userStoryStatus].push(
          userStoryInner
        );
      }
    }
  }

  addNewUserStory(addKanbanUserStoryPopoverOpen) {
    addKanbanUserStoryPopoverOpen.openPopover();
    this.addUserStory = true;
    const userstory = new UserStory();
    this.userStory = userstory;

  }

  closeUserStoryDialog() {
    this.addUserStoryPopUp.forEach((p) => p.closePopover());
    this.addUserStory = false;
  }

  handleUserStorySelected(userStory) {
    this.selectedUserStoryId = userStory.userStoryId;
    this.isUserStorySelected = true;
    this.selectedUserStory.emit(userStory);
  }

  selectUserStory(userStoryId) {
    if (userStoryId) {
      this.selectedUserStoryId = userStoryId;
    } else {
      this.selectedUserStoryId = null;
    }
  }

  getOpenUniquePage(data) {
    this.openUniquePage.emit(data);
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.subs.unsubscribe();
    this.dragulaService.destroy(this.dragulaBoardUniqueId);
    this.ngDestroyed$.next();
  }

  LogAction(event)
  { 
    event.userStoryLogTime.parentUserStoryId = null;
    if(!event.userStoryLogTime.endTime)
    {
       var userStory = this.userStories.find(obj => { return (obj.startTime != null ||  obj.startTime != undefined) && !obj.endTime });
      if(!userStory) { userStory = this.findSubUserstoryTime(); }
      if(userStory && (event.userStoryLogTime.userStoryId != userStory.userStoryId))
      {
      var userStoryLogTime = new UserStoryLogTimeModel();
      userStoryLogTime.userStoryId = userStory.userStoryId;
      userStoryLogTime.startTime = userStory.startTime;
      userStoryLogTime.endTime = new Date();
      userStoryLogTime.parentUserStoryId = null;
      this.store.dispatch(new InsertAutoLogTimeTriggered(userStoryLogTime));  
      }  
    }
    this.store.dispatch(new InsertAutoLogTimeTriggered(event.userStoryLogTime));
  }
  findSubUserstoryTime()
    {
     var susy;
     this.userStories.forEach( (us) => {
     if(us.subUserStoriesList) {
     return  us.subUserStoriesList.forEach((sus) => {
         if( sus.startTime &&(sus.startTime != null || sus.startTime != undefined) && !sus.endTime) {
           susy = sus;
         }
       });
     }
     });
     return susy;
    } 

  checkPermissionsForUserStory() {
    if (!this.isFromSprint && this.goal.goalId === "00000000-0000-0000-0000-000000000000" && this.projectId) {
      return false;
    } else {
      if (this.userStorySearchCriteria.isGoalsPage) {
        let projectId = this.projectId;
        let entityRolefeatures = JSON.parse(localStorage.getItem(LocalStorageProperties.UserRoleFeatures));
        if(entityRolefeatures && entityRolefeatures.length > 0) {
          this.entityRolePermisisons = entityRolefeatures.filter(function (role: any) {
            return role.projectId == projectId
          })
          let featurePermissions = [];
          featurePermissions = this.entityRolePermisisons;
          if (featurePermissions.length > 0) {
            const entityTypeFeatureForAddOrUpdateUpdateUserStory = EntityTypeFeatureIds.EntityTypeFeature_AddOrUpdateWorkItem.toString().
              toLowerCase();
            // tslint:disable-next-line: prefer-const
            // tslint:disable-next-line: only-arrow-functions
            const addOrUpdateUserStoryPermisisonsList = _.filter(featurePermissions, function (permission) {
              return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForAddOrUpdateUpdateUserStory)
            })
            if (addOrUpdateUserStoryPermisisonsList.length > 0) {
              this.isPermissionForAddUserStory = true;
            } else {
              this.isPermissionForAddUserStory = false;
            }
  
            // tslint:disable-next-line: max-line-length
            const entityTypeFeatureForUserStoryGoal = EntityTypeFeatureIds.EntityTypeFeature_CanMoveWorkItemToAnotherGoal.toString().toLowerCase();
            // tslint:disable-next-line: prefer-const
            // tslint:disable-next-line: only-arrow-functions
            const userStoryChangeGoalPermisisonsList = _.filter(featurePermissions, function (permission) {
              return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForUserStoryGoal)
            })
            if (userStoryChangeGoalPermisisonsList.length > 0) {
              this.isPermisisontoChangeGoal = true;
            } else {
              this.isPermisisontoChangeGoal = false;
            }
          }
        }
      }
        }
  }

  checkFilter() {
    if (this.searchText || this.versionNamesearchText || this.searchTags || this.ownerUserList || this.bugPriorityIdList || this.componentList || this.userStoryStatusIdList || this.userStoryTypeList)
      return true;
    else return false;
  }

  setHeights() {
    let value = this.checkFilter();
    if (!this.userStorySearchCriteria.isGoalsPage && value) {
      let styles = {
        height: 'calc(100vh - 256px)'
      }
      return styles;
    }
    else if (!this.userStorySearchCriteria.isGoalsPage && !value) {
      let styles = {
        height: 'calc(100vh - 208px)'
      }
      return styles;
    }
    else if (!this.isGoalsFiltersVisible && this.userStorySearchCriteria && this.userStorySearchCriteria.isGoalsPage && !value) {
      let styles = {
        height: 'calc(100vh - 274px)'
      }
      return styles;
    }
    else if (!this.isGoalsFiltersVisible && this.userStorySearchCriteria && this.userStorySearchCriteria.isGoalsPage && value) {
      let styles = {
        height: 'calc(100vh - 303px)'
      }
      return styles;
    }
    else if (this.isGoalsFiltersVisible && this.userStorySearchCriteria && this.userStorySearchCriteria.isGoalsPage && !value) {
      let styles = {
        height: 'calc(100vh - 298px)'
      }
      return styles;
    }
    else if (this.isGoalsFiltersVisible && this.userStorySearchCriteria && this.userStorySearchCriteria.isGoalsPage && value) {
      let styles = {
        height: 'calc(100vh - 346px)'
      }
      return styles;
    }
  }

  setHeightForIcon(workflow) {
    if(workflow.canAdd && workflow.canDelete) {
      let styles = {
        "right": '17px'
      };
      return styles;
    } else {
      let styles = {
        "right": '5px'
      };
      return styles;
    }
  }
}