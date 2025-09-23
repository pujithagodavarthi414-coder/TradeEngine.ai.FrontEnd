// tslint:disable-next-line: ordered-imports
import { Component, Input, OnInit, ChangeDetectionStrategy, EventEmitter, Output, ViewChild, ChangeDetectorRef } from "@angular/core";
// tslint:disable-next-line: ordered-imports
import { Store, select } from "@ngrx/store";
// tslint:disable-next-line: ordered-imports
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil, tap } from "rxjs/operators";
// tslint:disable-next-line: ordered-imports
import { Subject, Observable } from "rxjs";
import * as _ from 'underscore';
import { take } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { SatPopover } from "@ncstate/sat-popover";
import * as userStoryActions from "../../store/actions/userStory.actions";
import { UserStory } from "../../models/userStory";
import { UserStoryReplanModel } from "../../models/userStoryReplanModel";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

import { ProjectSummaryTriggered } from "../../store/actions/project-summary.action";
import * as projectModuleReducers from "../../store/reducers/index";
import { GetUniqueUserStoryByIdTriggered } from "../../store/actions/userStory.actions";

import { LoadMemberProjectsTriggered, ProjectMembersActionTypes } from "../../store/actions/project-members.actions";
import { workFlowStatusActionTypes, LoadworkflowStatusTriggered } from "../../store/actions/work-flow-status.action";

import { ProjectMember } from "../../models/projectMember";
import { WorkflowStatus } from "../../models/workflowStatus";
import { UserStoryTypesModel } from "../../models/userStoryTypesModel";
import { UserStoryTypesActionTypes, LoadUserStoryTypesTriggered } from "../../store/actions/user-story-types.action";
import { ProjectGoalsService } from "../../services/goals.service";
import { GetUniqueSprintWorkItemByIdTriggered, SprintWorkItemActionTypes, UpsertSprintWorkItemTriggered, InsertSprintWorkItemReplanTriggered, GetSprintWorkItemByIdTriggered, UpdateSingleSprintUserStoryForBugsTriggered } from "../../store/actions/sprint-userstories.action";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { EntityRoleFeatureModel } from '../../models/entityRoleFeature';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { SoftLabelPipe } from '../../../globaldependencies/pipes/softlabels.pipes';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { BoardTypeIds } from '../../../globaldependencies/constants/board-types';
import { TestCase } from '@snovasys/snova-testrepo';
import { EntityTypeFeatureIds } from '../../../globaldependencies/constants/entitytype-feature-ids';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import * as testRailModuleReducers from "@snovasys/snova-testrepo";
import { LoadBugsByUserStoryIdTriggered, LoadBugsByGoalIdTriggered } from '@snovasys/snova-testrepo';
import { UserStorySearchCriteriaInputModel } from '../../models/userStorySearchInput';
import { userStoryUpdates } from '../../models/userStoryUpdates';
import { WorkFlowService } from '../../services/workFlow.Services';
import { DatePipe } from "@angular/common";
import * as moment_ from 'moment';
const moment = moment_;

@Component({
  selector: "app-inline-editing-userstory-component",
  templateUrl: "inline-edit-userstory.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InlineEditUserStoryComponent extends AppFeatureBaseComponent implements OnInit {

  isUserStoryStatusDisabledForActive: boolean;
  @Input("userStory")
  set _userStory(data: UserStory) {
    this.userStory = data;
  }

  isFromBugsCount
  @Input("isFromBugsCount")
  set _isFromBugsCount(data: string) {
    this.isFromBugsCount = data;
  }

  goalReplanId;
  @Input("goalReplanId")
  set _goalReplanId(data: string) {
    this.goalReplanId = data;
  }


  @Input("isSprintsView")
  set _isSprintsView(data: boolean) {
    this.isSprintsView = data;
  }

  isInlineEditForUserStoryStatus;
  @Input("isInlineEditForUserStoryStatus")
  set _isInlineEditForUserStoryStatus(data: boolean) {
    this.isInlineEditForUserStoryStatus = data;
  }

  isInlineEditForUserStoryOwner;
  @Input("isInlineEditForUserStoryOwner")
  set _isInlineEditForUserStoryOwner(data: boolean) {
    this.isInlineEditForUserStoryOwner = data;
    if (data) {
      this.isUserStoryOwnerEdit = true;
    }
    else {
      this.isUserStoryOwnerEdit = false;
    }
  }

  isAllGoalsPage
  @Input("isAllGoalsPage")
  set _isAllGoalsPage(data: boolean) {
    this.isAllGoalsPage = data;
  }


  @Input("isBugsTab")
  set _isBugsTab(data: boolean) {
    this.isBugsTab = data;
    if (this.isBugsTab) {
      this.userStoryStatusId = null;
      this.loadUserStory();
    } else {
      this.loadData();
    }
  }

  @Input("isEditFromProjects")
  set _isEditFromProjects(data: boolean) {
    if (data === false) {
      this.isEditFromProjects = false;
    }
    else {
      this.isEditFromProjects = true;
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

  @Input("isDetailPage")
  set _isDetailPage(data: boolean) {
    this.isDetailPage = data;
  }

  @Input("isChildUserStory")
  set _isChildUserStory(data: string) {
    this.isChildUserStory = data;
  }


  @Input() isInlineEdit: boolean;
  @Input() isInlineEditForEstimatedTime: boolean;
  @Input() isInlineEditForSprintEstimatedTime: boolean;
  @Output() completeUserStory = new EventEmitter<string>();
  @Output() workItemsLoader = new EventEmitter<string>();
  @Output() stopLoader = new EventEmitter<string>();
  @Output() loadingUserStory = new EventEmitter<boolean>();
  @Output() closeUserStoryDialog = new EventEmitter<string>();
  @Output() updateUserStoryData = new EventEmitter<object>();
  @ViewChild("projectMemberPopover") projectMemberPopUp: SatPopover;
  anyOperationInProgress$: Observable<boolean>;
  userStoryIsInProgress$: Observable<boolean>;
  userStory$: Observable<UserStory>;
  entityRolePermisisons$: Observable<EntityRoleFeatureModel[]>;
  entityRolePermisisons: EntityRoleFeatureModel[];
  workflowStatus$: Observable<WorkflowStatus[]>;
  projectMembers$: Observable<ProjectMember[]>;
  userStoryTypes$: Observable<UserStoryTypesModel[]>;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  projectMembers: ProjectMember[];
  workflowStatus: WorkflowStatus[] = [];
  userStoryUpdates: userStoryUpdates[] = [];
  isUserStoryStatus: boolean;
  loading: boolean;
  isSprintsView: boolean;
  isChildUserStory: string;
  isDetailPage: boolean;
  deadlineDate: Date;
  estimatedTime: string;
  isDateTimeConfiguration: boolean;
  userStoryStatusId: string;
  userStory: UserStory;
  ownerUserId: string;
  isBugsTab: boolean;
  validationMessage: string;
  sprintEstimatedTime: any;
  isReplan: boolean;
  tag: string;
  dependencyUserId: string;
  userStoryReplanTypeId: string;
  replanDeadlineDate: Date;
  replanOwnerUserId: string;
  replanEstimatedTime: string;
  replanDependencyUserId: string;
  tab: string;
  estimatedTimeSet: any;
  isDeadlineDate: boolean;
  isEstimatedTime: boolean;
  rAGStatus: string;
  isUserStoryOwner: boolean;
  loadprojectMember: boolean;
  clearProjectMemberForm: boolean;
  isStatusChanged: boolean;
  public ngDestroyed$ = new Subject();
  isKanbanBoard: boolean;
  isSuperagileBoard: boolean;
  userStoryTypeId: string;
  isGoalEdit: boolean;
  isValidation: boolean;
  isUserStoryStatusDisabled: boolean;
  isInlineEditForEstimatedTimeInActive: boolean;
  isInlineEditForUserStoryDeadlineDateInActive: boolean;
  isInlineEditForUserStoryOwnerInActive: boolean;
  isInlineEditForEstimatedTimeBacklog: boolean;
  isInlineEditForUserStoryDeadlineDateInBacklog: boolean;
  isInlineEditForUserStoryOwnerInBacklog: boolean;
  isInlineEditForEstimatedTimeInReplan: boolean;
  isInlineEditForUserStoryDeadlineDateInReplan: boolean;
  isInlineEditForUserStoryOwnerInReplan: boolean;
  canEditUserStoryInSuperagileGoal: boolean;
  isActiveGoalStatusId: boolean;
  isBacklogGoalStatusId: boolean;
  isReplanGoalStatusId: boolean;
  isButtonDisabled: boolean;
  onboardProcessDate: Date;
  selectedMember: string;
  replanSprintEstimatedTime: any;
  orderId: number;
  userStoryTypes: UserStoryTypesModel[];
  bugUserStoryTypeModel: UserStoryTypesModel;
  userStoryTypeModel: UserStoryTypesModel;
  isUserStoryOwnerEdit: boolean;
  isEditFromProjects: boolean = true;
  notFromAudits: boolean = true;
  isMainUSApproved: boolean;
  parentUserStoryId: string;
  description: string;
  constructor(
    private store: Store<projectModuleReducers.State>,
    private testRailStore: Store<testRailModuleReducers.State>,
    private actionUpdates$: Actions,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private projectGoalsService: ProjectGoalsService,
    private cdRef: ChangeDetectorRef,
    private softLabelsPipe: SoftLabelPipe,
    private workflowService: WorkFlowService,
    private datePipe: DatePipe
  ) {

    super();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.CreateUserStoryCompleted),
        tap(() => {
          if (!this.isFromBugsCount && this.isEditFromProjects)
            this.completeUserStory.emit('');
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.UpsertSprintWorkItemCompleted),
        tap(() => {
          if (!this.isFromBugsCount && this.isEditFromProjects)
            this.completeUserStory.emit('');
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.InsertUserStoryReplanCompleted),
        tap(() => {
          if (this.isEditFromProjects)
            this.completeUserStory.emit('');
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.UpsertSprintSubTaskCompleted),
        tap(() => {
          if (this.isEditFromProjects)
            this.completeUserStory.emit('');
          if (this.userStory.userStoryId) {
            this.store.dispatch(new GetSprintWorkItemByIdTriggered(this.userStory.userStoryId, true));
          }
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.InsertSprintWorkItemReplanCompleted),
        tap(() => {
          if (this.isEditFromProjects)
            this.completeUserStory.emit('');
        })
      )
      .subscribe();

        this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(SprintWorkItemActionTypes.InsertSprintWorkItemReplanCompleted),
        tap(() => {
          if (this.isEditFromProjects)
            this.completeUserStory.emit('');
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(userStoryActions.UserStoryActionTypes.CreateUserStoryCompletedWithInPlaceUpdate),
        tap(() => {
          this.userStory$ = this.store.pipe(select(projectModuleReducers.getUserStoryById));
          this.userStory$.subscribe(x => this.userStory = x);

        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(workFlowStatusActionTypes.LoadworkflowStatusCompleted),
        tap(() => {
          this.workflowStatus$ = this.store.pipe(select(projectModuleReducers.getworkflowStatusAllByWorkflowId, { workflowId: this.userStory.workFlowId }));
          this.workflowStatus$
            .subscribe(s => {
              this.workflowStatus = s;
              this.loadUserStoryData();
            })
        })
      )
      .subscribe();


    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(ProjectMembersActionTypes.LoadProjectMembersCompleted),
        tap(() => {
          this.bindingAssigneeValue();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(UserStoryTypesActionTypes.LoadUserStoryTypesCompleted),
        tap(() => {
          this.userStoryTypes$ = this.store.pipe(select(projectModuleReducers.getUserStoryTypesAll));
          this.userStoryTypes$.subscribe((x) => this.userStoryTypes = x);
          this.bugUserStoryTypeModel = this.userStoryTypes.find(x => x.isBug);
          this.userStoryTypeModel = this.userStoryTypes.find(x => x.isUserStory);
        })
      )
      .subscribe();


    this.route.params.subscribe(params => {
      this.tab = params["tab"];
      if (this.tab === 'backlog-goals' || this.tab === 'replan-goals') {
        this.isUserStoryStatus = true;
      }
      else {
        this.isUserStoryStatus = false;
      }
    });
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabelConfigurations();
    //  this.searchUserStoryTypes();
    this.anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducers.createUserStoryLoading)
    );
  }

  loadData() {
    if (this.isSprintsView) {
      if (this.isUserStoryOwnerEdit && this.isAllGoalsPage) {
        this.store.dispatch(new LoadMemberProjectsTriggered(this.userStory.projectId));
      }

      // this.workflowStatus$ = this.store.pipe(select(projectModuleReducers.getworkflowStatusAllByWorkflowId, { workflowId: this.userStory.workFlowId }));
      // this.workflowStatus$
      //   .subscribe(s => {
      //     this.workflowStatus = s;
      //   });
      // if (!this.workflowStatus || this.workflowStatus.length === 0) {
      //   var workflowStatus = new WorkflowStatus();
      //   workflowStatus.workFlowId = this.userStory.workFlowId;
      //   this.store.dispatch(new LoadworkflowStatusTriggered(workflowStatus));
      // }
      this.loadWorkflowStatus();

      if (this.userStory.sprintStartDate && !this.userStory.isReplan) {
        this.isActiveGoalStatusId = true;
      } else if (!this.userStory.sprintStartDate && !this.userStory.isReplan) {
        this.isBacklogGoalStatusId = true;
      } else {
        this.isReplanGoalStatusId = true;
      }
      this.setRolePermissionsForUserStory();

      //Bind UserStoryData 
      this.loadUserStoryData();

    }
    else {
      if (this.userStory.goalStatusId && this.userStory.goalStatusId.toLowerCase() === ConstantVariables.ActiveGoalStatusId.toLowerCase()) {
        this.isUserStoryStatusDisabledForActive = true;
        this.isActiveGoalStatusId = true;
      }
      else if (this.userStory.goalStatusId && this.userStory.goalStatusId.toLowerCase() === ConstantVariables.BacklogGoalStatusId.toLowerCase()) {
        this.isBacklogGoalStatusId = true;
      }
      else if (this.userStory.goalStatusId && this.userStory.goalStatusId.toLowerCase() === ConstantVariables.ReplanGoalStatusId.toLowerCase()) {
        this.isReplanGoalStatusId = true;
      }
      if (this.isUserStoryOwnerEdit && this.isAllGoalsPage) {
        this.store.dispatch(new LoadMemberProjectsTriggered(this.userStory.projectId));
      }

      if (this.userStory.isBacklog == true) {
        this.isBacklogGoalStatusId = true;
      }

      // this.workflowStatus$ = this.store.pipe(select(projectModuleReducers.getworkflowStatusAllByWorkflowId, { workflowId: this.userStory.workFlowId }));
      // this.workflowStatus$
      //   .subscribe(s => {
      //     this.workflowStatus = s;
      //   });
      // if (!this.workflowStatus || this.workflowStatus.length === 0) {
      //   var workflowStatus = new WorkflowStatus();
      //   workflowStatus.workFlowId = this.userStory.workFlowId;
      //   this.store.dispatch(new LoadworkflowStatusTriggered(workflowStatus));
      // }
      this.loadWorkflowStatus();
      this.setRolePermissionsForUserStory();

      //Bind UserStoryData 
      this.loadUserStoryData();
    }
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels))
  }

  searchUserStoryTypes() {
    var userStoryTypesModel = new UserStoryTypesModel();
    userStoryTypesModel.isArchived = false;
    //  this.store.dispatch(new LoadUserStoryTypesTriggered(userStoryTypesModel))

  }

   loadWorkflowStatus() {
    var workflowStatus = new WorkflowStatus();
    workflowStatus.workFlowId = this.userStory.workFlowId;
    this.workflowService.GetAllWorkFlowStatus(workflowStatus).subscribe((status:any) => {
      if(status.success) {
        this.workflowStatus = status.data;
        this.loadUserStoryData();
      }
    })
   }


  bindingAssigneeValue() {
    this.projectMembers$ = this.store.pipe(
      select(projectModuleReducers.getProjectMembersAll)
    );
    this.projectMembers$
      .subscribe(s => (this.projectMembers = s));
    var assignee = this.ownerUserId;
    var projectMembers = this.projectMembers;

    if (this.userStory && this.userStory.ownerUserId) {
      var ownerFilteredList = _.find(projectMembers, function (member) {
        return member.projectMember.id == assignee;
      })
      if (ownerFilteredList) {
        this.selectedMember = ownerFilteredList.projectMember.name;
        this.cdRef.markForCheck();
      }
      else {
        this.selectedMember = null;
      }
    }
  }

  changeDeadline() {
    if (
      this.userStory.goalStatusId.toLowerCase() === ConstantVariables.ReplanGoalStatusId.toLowerCase() &&
      (this.goalReplanId === null || this.goalReplanId === undefined)
    ) {
      this.toastr.error("", ConstantVariables.ValidationForDeadlineDateReplanType);
    } else if (
      this.userStory.goalStatusId.toLowerCase() === ConstantVariables.ReplanGoalStatusId.toLowerCase() &&
      (this.goalReplanId !== null || this.goalReplanId !== undefined)
    ) {
      this.userStoryReplanTypeId = ConstantVariables.UserStoryReplanTypeIdForDeadlineDate;
      this.replanDeadlineDate = this.deadlineDate;
      this.replanOwnerUserId = null;
      this.replanEstimatedTime = null;
      this.replanDependencyUserId = null;
      this.replanSprintEstimatedTime = null;
      this.saveReplanUserStory();
    } else {
      this.isStatusChanged = false;
      this.saveUserStory();
    }
  }

  changeEstimatedTime(estimatedTime) {
    if (estimatedTime === 'null') {
      this.estimatedTimeSet = null;
    }
    else {
      this.estimatedTimeSet = estimatedTime;
    }
    if (this.estimatedTimeSet != null) {
      if (
        ((!this.isSprintsView && this.userStory.goalStatusId.toLowerCase() ===
          ConstantVariables.ReplanGoalStatusId.toLowerCase()) || (this.isSprintsView && this.isReplanGoalStatusId)) && (!this.goalReplanId)
      ) {
        this.toastr.error("", ConstantVariables.ValidationForEstimatedTimeReplanType);
      } else if (this.goalReplanId) {
        this.userStoryReplanTypeId =
          ConstantVariables.UserStoryReplanTypeIdForEstimatedTime;
        this.replanEstimatedTime = this.estimatedTimeSet;
        this.replanDeadlineDate = null;
        this.replanOwnerUserId = null;
        this.replanSprintEstimatedTime = null;
        this.replanDependencyUserId = null;
        this.saveReplanUserStory();
      } else {
        this.isStatusChanged = false;
        this.saveUserStory();
      }
    }
  }

  getUserStoryStatusChange(event) {
    this.userStoryStatusId = event;
    let selectedStatus = this.workflowStatus.find(x => x.userStoryStatusId == this.userStoryStatusId);
    let taskStatusId = selectedStatus.taskStatusId;
      if (taskStatusId == BoardTypeIds.DoneTaskStatusId.toLowerCase() || taskStatusId == BoardTypeIds.VerificationCompletedTaskStatusId.toLowerCase()) {
        if (this.isMainUSApproved) {
          this.userStoryStatusId = event;
          this.isStatusChanged = false;
          this.saveUserStory();
        } else {
          this.userStoryStatusId = this.userStory.userStoryStatusId;
          this.toastr.warning('', this.softLabelsPipe.transform(this.translateService.instant('USERDETAIL.PLEASEAPPROVESUBTASKSS'), this.softLabels));
        }
      } else {
        this.userStoryStatusId = event;
        this.isStatusChanged = false;
        this.saveUserStory();
      }
  }

  changeAssignee(event) {
    if (event === "0") {
      event = null;
    }
    this.ownerUserId = event;
    var projectMembers = this.projectMembers;
    if (this.ownerUserId) {
      var ownerFilteredList = _.find(projectMembers, function (member) {
        return member.projectMember.id == event;
      })
      if (ownerFilteredList) {
        this.selectedMember = ownerFilteredList.projectMember.name;
      }
    }
    this.isStatusChanged = false;
    this.saveUserStory();

  }

  setRolePermissionsForUserStory() {
    let entityRolefeatures = JSON.parse(localStorage.getItem(LocalStorageProperties.UserRoleFeatures));
    let projectId = this.userStory.projectId;
    if(projectId) {
      this.entityRolePermisisons = entityRolefeatures.filter(function (role: any) {
        return role.projectId == projectId.toLowerCase()
      })
    }
    this.checkPermissionsForUserStory();

  }

  saveEstimatedTime() {
    if (this.sprintEstimatedTime > 99) {
      this.isValidation = true;
    } else {
      this.isValidation = false;
      if (((!this.isSprintsView && this.userStory.goalStatusId.toLowerCase() ===
        ConstantVariables.ReplanGoalStatusId.toLowerCase()) || (this.isSprintsView && this.isReplanGoalStatusId)) && (!this.goalReplanId)
      ) {
        this.toastr.error("", ConstantVariables.ValidationForEstimatedTimeReplanType);
        this.sprintEstimatedTime = this.userStory.sprintEstimatedTime;
      } else if (this.goalReplanId) {
        this.userStoryReplanTypeId = ConstantVariables.UserStoryReplanTypeIdForEstimatedTimeInSP;
        this.replanSprintEstimatedTime = this.sprintEstimatedTime;
        this.replanDeadlineDate = null;
        this.replanOwnerUserId = null;
        this.replanDependencyUserId = null;
        this.replanEstimatedTime = null;
        this.saveReplanUserStory();
      } else {
        this.saveUserStory();
      }
    }
  }

  saveUserStory() {

    let deadline = null;
    let startDate = null;

    if(this.isDateTimeConfiguration){
      if(this.deadlineDate){
        deadline = new Date(this.deadlineDate);
      }
      if(this.userStory.userStoryStartDate){
        startDate = new Date(this.userStory.userStoryStartDate);
      }
  
      if(startDate > deadline && deadline != null && startDate != null){
        this.toastr.error(this.translateService.instant("GOALS.STARTDATEANDDEADLINEMESSAGE"));
        return;
      }
    }
    else{
      if(this.deadlineDate){
        deadline = moment(moment(this.deadlineDate).format('MM/DD/yyyy')).toDate();
      }
      if(this.userStory.userStoryStartDate){
        startDate = moment(moment(this.userStory.userStoryStartDate).format('MM/DD/yyyy')).toDate();
      }
  
      if(startDate > deadline && deadline != null && startDate != null){
        this.toastr.error(this.translateService.instant("GOALS.STARTDATEANDDEADLINEMESSAGE"));
        return;
      }
    }

    const userStory = new UserStory();
    userStory.goalId = this.userStory.goalId;
    userStory.projectId = this.userStory.projectId;
    userStory.auditProjectId = this.userStory.projectId;
    userStory.actionCategoryId = this.userStory.actionCategoryId;
    userStory.userStory = this.userStory.userStoryName;
    userStory.versionName = this.userStory.versionName;
    userStory.userStoryId = this.userStory.userStoryId;
    userStory.oldOwnerUserId = this.userStory.ownerUserId;
    userStory.ownerUserId = this.ownerUserId;
    userStory.userStoryStatusId = this.userStoryStatusId;
    userStory.estimatedTime = this.estimatedTimeSet;
    userStory.deadLineDate = this.deadlineDate;
    if(this.isDateTimeConfiguration){
    userStory.deadLine =this.covertTimeIntoUtcTime(this.deadlineDate);
    }
    else{
      userStory.deadLine =this.covertTimeIntoUtcTimes(this.deadlineDate);
    }
    userStory.timeZoneOffSet = (-(new Date(this.deadlineDate).getTimezoneOffset()));
    userStory.userStoryName = this.userStory.userStoryName;
    userStory.description = this.description;
    userStory.userStoryTypeId = this.userStory.userStoryTypeId;
    userStory.projectFeatureId = this.userStory.projectFeatureId;
    userStory.bugPriorityId = this.userStory.bugPriorityId;
    userStory.bugCausedUserId = this.userStory.bugCausedUserId;
    userStory.parentUserStoryId = this.userStory.parentUserStoryId;
    userStory.testCaseId = this.userStory.testCaseId;
    userStory.testSuiteSectionId = this.userStory.testSuiteSectionId;
    userStory.isStatusChanged = this.isStatusChanged;
    userStory.timeStamp = this.userStory.timeStamp;
    userStory.dependencyUserId = this.userStory.dependencyUserId;
    userStory.order = this.userStory.order;
    userStory.tag = this.userStory.tag;
    userStory.parentUserStoryId = this.userStory.parentUserStoryId;
    userStory.isBugBoard = this.userStory.isBugBoard;
    userStory.sprintId = this.userStory.sprintId;
    userStory.sprintEstimatedTime = this.sprintEstimatedTime;
    userStory.rAGStatus = this.rAGStatus;
    userStory.isGoalsPage = this.isAllGoalsPage;
    userStory.userStoryStartDate = this.userStory.userStoryStartDate;


    if (!this.isFromBugsCount) {
      if (this.isEditFromProjects) {
        if (this.isSprintsView) {
          this.store.dispatch(
            new UpsertSprintWorkItemTriggered(userStory)
          );
        } else {
          this.store.dispatch(
            new userStoryActions.CreateUserStoryTriggered(userStory)
          );
        }
      }
      else {
        this.workItemsLoader.emit('');
        this.projectGoalsService.UpsertUserStory(userStory).subscribe((result: any) => {
          if (result.success) {
            this.completeUserStory.emit('');
          }
          else {
            this.stopLoader.emit('');
            this.validationMessage = result.apiResponseMessages[0].message;
            this.toastr.error(this.validationMessage);
          }
        });
      }
    }
    else {
      this.projectGoalsService.UpsertUserStory(userStory).subscribe((result: any) => {
        this.loadLinkedBugs(userStory);
        if (this.isDetailPage) {
          if (this.isSprintsView) {
            if (this.isChildUserStory) {
              this.store.dispatch(new UpdateSingleSprintUserStoryForBugsTriggered(this.isChildUserStory));
            } else {
              this.store.dispatch(new UpdateSingleSprintUserStoryForBugsTriggered(this.userStory.parentUserStoryId))
            }
          } else {
            if (this.isChildUserStory) {
              this.store.dispatch(new userStoryActions.UpdateSingleUserStoryForBugsTriggered(this.isChildUserStory));
            } else {
              this.store.dispatch(new userStoryActions.UpdateSingleUserStoryForBugsTriggered(this.userStory.parentUserStoryId));
            }

          }
        }
        this.closeUserStoryDialog.emit('');
      });
    }
  }

  loadLinkedBugs(userStory) {
    let testCaseSearch = new TestCase();
    testCaseSearch.parentUserStoryId = userStory.parentUserStoryId;
    if (this.isEditFromProjects) {
      testCaseSearch.userStoryId = userStory.parentUserStoryId;
      // testCaseSearch.testSuiteId = this.userStoryData.testSuiteId;
      // testCaseSearch.sectionId = this.userStoryData.testSuiteSectionId;
    }
    else
      testCaseSearch.scenarioId = this.userStory.testCaseId;
    testCaseSearch.isSprintUserStories = userStory.isFromSprint;
    testCaseSearch.isArchived = false;
    this.testRailStore.dispatch(new LoadBugsByUserStoryIdTriggered(testCaseSearch));
    this.testRailStore.dispatch(new LoadBugsByGoalIdTriggered(testCaseSearch));
  }

  saveReplanUserStory() {
    const userStoryReplan = new UserStoryReplanModel();
    userStoryReplan.userStoryId = this.userStory.userStoryId;
    userStoryReplan.goalReplanId = this.goalReplanId;
    userStoryReplan.userStoryName = null;
    userStoryReplan.userStoryReplanTypeId = this.userStoryReplanTypeId;
    userStoryReplan.userStoryDeadLine = this.replanDeadlineDate;
    userStoryReplan.deadLine =this.covertTimeIntoUtcTime(this.replanDeadlineDate);
    userStoryReplan.timeZoneOffSet = (-(new Date(this.replanDeadlineDate).getTimezoneOffset()));
    userStoryReplan.userStoryDependencyId = this.replanDependencyUserId;
    userStoryReplan.userStoryOwnerId = this.replanOwnerUserId;
    userStoryReplan.estimatedTime = this.replanEstimatedTime;
    userStoryReplan.sprintEstimatedTime = this.sprintEstimatedTime;
    userStoryReplan.goalId = this.userStory.goalId;
    userStoryReplan.timeStamp = this.userStory.timeStamp;
    userStoryReplan.order = this.userStory.order;
    userStoryReplan.parentUserStoryId = this.userStory.parentUserStoryId;
    if (this.isEditFromProjects) {
      if (this.isSprintsView) {
        userStoryReplan.sprintId = this.userStory.sprintId;
        userStoryReplan.isFromSprint = true;
        this.store.dispatch(
          new InsertSprintWorkItemReplanTriggered(userStoryReplan)
        );
      } else {
        this.store.dispatch(
          new userStoryActions.InsertUserStoryReplanTriggered(userStoryReplan)
        );
      }
    }
    else {
      this.workItemsLoader.emit('');
      this.projectGoalsService.UpsertUserStoryReplan(userStoryReplan).subscribe((result: any) => {
        if (result.success) {
          this.completeUserStory.emit('');
        }
        else {
          this.stopLoader.emit('');
          this.validationMessage = result.apiResponseMessages[0].message;
          this.toastr.error(this.validationMessage);
        }
      });
    }
  }

  createProjectMember() {
    this.loadprojectMember = true;
    this.clearProjectMemberForm = true;
  }

  closeProjectMemberDialog() {
    let popover = this.projectMemberPopUp;
    if (popover) {
      popover.close();
    }
  }

  getProjectMembersCount() {
    this.store.dispatch(new ProjectSummaryTriggered(this.userStory.projectId));
  }

  loadUserStoryData() {
    if (this.userStory) {
      this.deadlineDate = this.userStory.deadLineDate;
      this.estimatedTime = this.userStory.estimatedTime;
      this.estimatedTimeSet = this.estimatedTime;
      this.userStoryStatusId = this.userStory.userStoryStatusId.toLowerCase();
      this.orderId = this.userStory.order;
      if(this.userStory.ownerUserId) {
        this.ownerUserId = this.userStory.ownerUserId.toLowerCase();
      } else {
        this.ownerUserId = null;
      }
      
      this.dependencyUserId = this.userStory.dependencyUserId;
      this.onboardProcessDate = this.userStory.onboardProcessDate;
      this.parentUserStoryId = this.userStory.parentUserStoryId;
      this.isDateTimeConfiguration = this.userStory.isDateTimeConfiguration;
      this.description = this.userStory.description;
      this.sprintEstimatedTime = this.userStory.sprintEstimatedTime;
      this.rAGStatus = this.userStory.ragStatus;
      this.tag = this.userStory.tag;
      this.isReplan = this.userStory.isReplan;
      this.bindingAssigneeValue();
      if ((this.userStory.isBugBoard && this.userStory.boardTypeUiId === BoardTypeIds.BoardViewKey.toLowerCase())
        || (this.userStory.isBugBoard && this.userStory.boardTypeUiId === BoardTypeIds.ListViewKey.toLowerCase())) {
        this.isKanbanBoard = true;
        this.isSuperagileBoard = false;
        this.userStoryTypeId = this.bugUserStoryTypeModel ? this.bugUserStoryTypeModel.userStoryTypeId : null;
      }
      else if (!this.userStory.isBugBoard && this.userStory.boardTypeUiId === BoardTypeIds.BoardViewKey.toLowerCase()) {
        this.isKanbanBoard = false;
        this.isSuperagileBoard = false;
        this.userStoryTypeId = this.userStoryTypeModel ? this.userStoryTypeModel.userStoryTypeId : null;
      }
      if (!this.isSprintsView) {
        if (this.userStory.goalStatusId && this.userStory.goalStatusId.toLowerCase() === ConstantVariables.ActiveGoalStatusId.toLowerCase()) {
          this.isUserStoryStatusDisabled = false;
        }
        else {
          this.isUserStoryStatusDisabled = true;
        }
      } else {
        if (this.userStory.sprintStartDate && !this.isReplan) {
          this.isUserStoryStatusDisabled = false;
        } else if (!this.userStory.sprintStartDate || this.isReplan) {
          this.isUserStoryStatusDisabled = true;
        }
      }

      if (this.userStory.goalArchivedDateTime || this.userStory.goalParkedDateTime || this.userStory.sprintInActiveDateTime) {
        this.isGoalEdit = false;
      }
      else {
        this.isGoalEdit = true;
      }
      this.checkMainUsIsQAApproved(this.userStory.subUserStoriesList);
      this.cdRef.markForCheck();
    }
  }


  checkMainUsIsQAApproved(subUserStories) {
    if (subUserStories != undefined && subUserStories.length > 0) {
      var filteredUserstories = subUserStories.filter(function (userStory) {
        return (userStory.taskStatusOrder == 4 || userStory.taskStatusOrder == 6)
      })
      if (filteredUserstories.length == subUserStories.length) {
        this.isMainUSApproved = true;
      } else {
        this.isMainUSApproved = false;
      }
    } else {
      this.isMainUSApproved = true;
    }
  }

  checkPermissionsForUserStory() {
    if (this.userStory.goalId == "00000000-0000-0000-0000-000000000000") {
      return false;
    }
    else {
      let featurePermissions = [];
      if (this.entityRolePermisisons.length > 0) {
        featurePermissions = this.entityRolePermisisons;
        if (featurePermissions.length > 0) {
          //For Estimated Time
          //In Active
          let entityTypeFeatureForEstimatedTimeInActive = EntityTypeFeatureIds.EntityTypeFeature_EditActiveGoalEstimatedTime.toString().toLowerCase();
          var editEstimatedTimePermisisonsListInActive = _.filter(featurePermissions, function (permission: any) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForEstimatedTimeInActive)
          })
          if (editEstimatedTimePermisisonsListInActive.length > 0) {
            this.isInlineEditForEstimatedTimeInActive = true;
          }
          else {
            this.isInlineEditForEstimatedTimeInActive = false;
          }
          //In Backlog
          let entityTypeFeatureForEstimatedTimeInBacklog = EntityTypeFeatureIds.EntityTypeFeature_EditBacklogGoalEstimatedTime.toString().toLowerCase();
          var editEstimatedTimePermisisonsListInBacklog = _.filter(featurePermissions, function (permission: any) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForEstimatedTimeInBacklog)
          })
          if (editEstimatedTimePermisisonsListInBacklog.length > 0) {
            this.isInlineEditForEstimatedTimeBacklog = true;
          }
          else {
            this.isInlineEditForEstimatedTimeBacklog = false;
          }
          //In Replan
          let entityTypeFeatureForEstimatedTimeInReplan = EntityTypeFeatureIds.EntityTypeFeature_EditReplanGoalEstimatedTime.toString().toLowerCase();
          var editEstimatedTimePermisisonsListInReplan = _.filter(featurePermissions, function (permission: any) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForEstimatedTimeInReplan)
          })
          if (editEstimatedTimePermisisonsListInReplan.length > 0) {
            this.isInlineEditForEstimatedTimeInReplan = true;
          }
          else {
            this.isInlineEditForEstimatedTimeInReplan = false;
          }

          //For Deadline Date 
          //In Active
          let entityTypeFeatureForDeadlineDateInActive = EntityTypeFeatureIds.EntityTypeFeature_EditActiveGoalDeadlineDate.toString().toLowerCase();
          var editDeadlineDatePermisisonsListInActive = _.filter(featurePermissions, function (permission: any) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForDeadlineDateInActive)
          })
          if (editDeadlineDatePermisisonsListInActive.length > 0) {
            this.isInlineEditForUserStoryDeadlineDateInActive = true;
          }
          else {
            this.isInlineEditForUserStoryDeadlineDateInActive = false;
          }
          //In Backlog
          let entityTypeFeatureForDeadlineDateInBacklog = EntityTypeFeatureIds.EntityTypeFeature_EditBacklogGoalDeadlineDate.toString().toLowerCase();
          var editDeadlineDatePermisisonsListInBacklog = _.filter(featurePermissions, function (permission: any) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForDeadlineDateInBacklog)
          })
          if (editDeadlineDatePermisisonsListInBacklog.length > 0) {
            this.isInlineEditForUserStoryDeadlineDateInBacklog = true;
          }
          else {
            this.isInlineEditForUserStoryDeadlineDateInBacklog = false;
          }
          //In Replan
          let entityTypeFeatureForDeadlineDateInReplan = EntityTypeFeatureIds.EntityTypeFeature_EditReplanGoalDeadlineDate.toString().toLowerCase();
          var editDeadlineDatePermisisonsListInReplan = _.filter(featurePermissions, function (permission: any) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForDeadlineDateInReplan)
          })
          if (editDeadlineDatePermisisonsListInReplan.length > 0) {
            this.isInlineEditForUserStoryDeadlineDateInReplan = true;
          }
          else {
            this.isInlineEditForUserStoryDeadlineDateInReplan = false;
          }

          //For UserStory owner
          //In Active
          let entityTypeFeatureForUserStoryOwnerInActive = EntityTypeFeatureIds.EntityTypeFeature_EditActiveGoalAssignee.toString().toLowerCase();
          var editUserStoryOwnerPermisisonsListInActive = _.filter(featurePermissions, function (permission: any) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForUserStoryOwnerInActive)
          })
          if (editUserStoryOwnerPermisisonsListInActive.length > 0) {
            this.isInlineEditForUserStoryOwnerInActive = true;
          }
          else {
            this.isInlineEditForUserStoryOwnerInActive = false;
          }
          //In Backlog
          let entityTypeFeatureForUserStoryOwnerInBacklog = EntityTypeFeatureIds.EntityTypeFeature_EditBacklogGoalAssignee.toString().toLowerCase();
          var editDeadlineDatePermisisonsListInBacklog = _.filter(featurePermissions, function (permission: any) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForUserStoryOwnerInBacklog)
          })
          if (editDeadlineDatePermisisonsListInBacklog.length > 0) {
            this.isInlineEditForUserStoryOwnerInBacklog = true;
          }
          else {
            this.isInlineEditForUserStoryOwnerInBacklog = false;
          }
          //In Replan
          let entityTypeFeatureForUserStoryOwnerInReplan = EntityTypeFeatureIds.EntityTypeFeature_EditReplanGoalAssignee.toString().toLowerCase();
          var editUserStoryOwnerPermisisonsListInReplan = _.filter(featurePermissions, function (permission: any) {
            return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForUserStoryOwnerInReplan)
          })
          if (editUserStoryOwnerPermisisonsListInReplan.length > 0) {
            this.isInlineEditForUserStoryOwnerInReplan = true;
          }
          else {
            this.isInlineEditForUserStoryOwnerInReplan = false;
          }

        }
      }
    }
  }

  checkDeadlineDateIsDisabled(activeDeadlineDate, backlogDeadlineDate, replanDeadlineDate) {
    if (this.isGoalEdit) {
      if (this.isAllGoalsPage) {
        if (this.isInlineEditForUserStoryDeadlineDateInActive && this.isSuperagileBoard && this.isActiveGoalStatusId) {
          return true;
        }
        else if (this.isInlineEditForUserStoryDeadlineDateInActive && !this.isSuperagileBoard) {
         return false;
        }
        else if ((this.isInlineEditForUserStoryDeadlineDateInBacklog && this.isBacklogGoalStatusId) || (this.isInlineEditForUserStoryDeadlineDateInReplan && this.isReplanGoalStatusId)) {
          return false;
        }
        else {
          return true;
        }

      }
      else {
        if (activeDeadlineDate && this.isActiveGoalStatusId) {
          if (this.isSuperagileBoard) {
            return true;
          }
          else if (!this.isSuperagileBoard) {
            return false;
          }
          else if (!this.notFromAudits) {
            return false;
          }
          else {
            return true;
          }
        }
        else if ((backlogDeadlineDate && this.isBacklogGoalStatusId) || (replanDeadlineDate && this.isReplanGoalStatusId)) {
          return false;
        }
        else if (!this.notFromAudits) {
          return false;
        }
        else {
          return true;
        }
      }
    }
    else {
      return true;
    }

  }

  checkUserStoryAssigneeIsDisabled(activeUserStoryAssignee, backloUserStoryAssignee, replanUserStoryAssignee) {
    if (this.isGoalEdit) {
      if (this.isAllGoalsPage) {
        if ((this.isActiveGoalStatusId && this.isInlineEditForUserStoryOwnerInActive) || (this.isBacklogGoalStatusId && this.isInlineEditForUserStoryOwnerInBacklog) || (this.isReplanGoalStatusId && this.isInlineEditForUserStoryOwnerInReplan)) {
          return false;
        }
        else {
          return true;
        }
      }
      else {
        if (!this.notFromAudits) {
          return false;
        }
        else if (this.isActiveGoalStatusId && !activeUserStoryAssignee) {
          return true;
        }
        else if (this.isBacklogGoalStatusId && !backloUserStoryAssignee) {
          return true;
        }
        else if (this.isReplanGoalStatusId && !replanUserStoryAssignee) {
          return true;
        }
        else {
          return false;
        }
      }
    }
    else {
      return true;
    }
  }

  checkUserStoryEstimatedIsDisabled(activeEstimatedTime, backlogEstimatedTime, replanEstimatedTime) {
    let workflowStatusList = this.workflowStatus;
    if (this.isGoalEdit) {
      if (this.isAllGoalsPage) {
        if (this.isInlineEditForEstimatedTimeInActive && this.isSuperagileBoard && this.isActiveGoalStatusId) {
          return true;
        }
        else if (this.isInlineEditForEstimatedTimeInActive && !this.isSuperagileBoard) {
            return false;
        }
        else if ((this.isInlineEditForEstimatedTimeBacklog && this.isBacklogGoalStatusId) || (this.isInlineEditForEstimatedTimeInReplan && this.isReplanGoalStatusId)) {
          return false;
        }
        else {
          return true;
        }

      }
      else {
        if (activeEstimatedTime && this.isActiveGoalStatusId) {
          if (this.isSuperagileBoard) {
            return true;
          }
          else if (!this.isSuperagileBoard) {
            return false;
          }
          else {
            return true;
          }
        }
        else if ((backlogEstimatedTime && this.isBacklogGoalStatusId) || (replanEstimatedTime && this.isReplanGoalStatusId)) {
          return false;
        }
        else {
          return true;
        }
      }
    }
    else {
      return true;
    }
  }


  FillUserStoryDetails(userStory) {
    this.userStory = userStory;
    if (this.userStory.goalStatusId && this.userStory.goalStatusId.toLowerCase() === ConstantVariables.ActiveGoalStatusId.toLowerCase()) {
      this.isUserStoryStatusDisabledForActive = true;
      this.isActiveGoalStatusId = true;
    }
    else if (this.userStory.goalStatusId && this.userStory.goalStatusId.toLowerCase() === ConstantVariables.BacklogGoalStatusId.toLowerCase()) {
      this.isBacklogGoalStatusId = true;
    }
    else if (this.userStory.goalStatusId && this.userStory.goalStatusId.toLowerCase() === ConstantVariables.ReplanGoalStatusId.toLowerCase()) {
      this.isReplanGoalStatusId = true;
    }
    if (this.isUserStoryOwnerEdit && this.isAllGoalsPage) {
      this.store.dispatch(new LoadMemberProjectsTriggered(this.userStory.projectId));
    }

    if (this.userStory.isBacklog == true) {
      this.isBacklogGoalStatusId = true;
    }

    // this.workflowStatus$ = this.store.pipe(select(projectModuleReducers.getworkflowStatusAllByWorkflowId, { workflowId: this.userStory.workFlowId.toLowerCase() }));
    // this.workflowStatus$
    //   .subscribe(s => {
    //     this.workflowStatus = s;
    //   });
    // if (!this.workflowStatus || this.workflowStatus.length === 0) {
    //   var workflowStatus = new WorkflowStatus();
    //   workflowStatus.workFlowId = this.userStory.workFlowId.toLowerCase();
    //   this.store.dispatch(new LoadworkflowStatusTriggered(workflowStatus));
    // }
    this.loadWorkflowStatus();

    this.setRolePermissionsForUserStory();

    //Bind UserStoryData 
    this.loadUserStoryData();
  }

  loadUserStory() {
    this.loading = true;
    this.loadingUserStory.emit(this.loading);
    if (this.isSprintsView) {
      this.projectGoalsService.searchSprintUserStoryById(this.userStory.userStoryId,null).subscribe((x: any) => {
        if (x.success) {
          this.loading = false;
          this.loadingUserStory.emit(this.loading);
          this.userStory = x.data;
          this.FillUserStoryDetails(this.userStory);
        } else {
          this.loading = false;
          this.loadingUserStory.emit(this.loading);
        }
      })
    } else {
      this.projectGoalsService.GetUserStoryById(this.userStory.userStoryId).subscribe((x: any) => {
        if (x.success) {
          this.loading = false;
          this.loadingUserStory.emit(this.loading);
          this.userStory = x.data;
          this.FillUserStoryDetails(this.userStory);
        } else {
          this.loading = false;
          this.loadingUserStory.emit(this.loading);
        }
      })
    }
  }
  getTimeZoneName(deadLine){
    return /\((.*)\)/.exec(deadLine.toString())[1];
   }
   covertTimeIntoUtcTime(inputTime): string {
    if (inputTime == null || inputTime == "")
      return null;

    // var dateNow = new Date(inputTime);
    // var timeSplit = inputTime.toString().split(":");
    // dateNow.setHours(+timeSplit[0], +timeSplit[1], null, null);
    return this.datePipe.transform(inputTime, "yyyy-MM-dd HH:mm")
  }
  covertTimeIntoUtcTimes(inputTime): string {
    if (inputTime == null || inputTime == "")
      return null;
    return this.datePipe.transform(inputTime, "yyyy-MM-dd")
  }
}