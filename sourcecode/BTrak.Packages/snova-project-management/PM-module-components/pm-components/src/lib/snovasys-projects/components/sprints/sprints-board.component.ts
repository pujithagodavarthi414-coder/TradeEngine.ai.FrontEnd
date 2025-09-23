import { ChangeDetectionStrategy, Component, HostListener, Input, OnInit, Output, EventEmitter, ElementRef, ViewChild, NgModuleRef, NgModuleFactoryLoader, ViewContainerRef, Type, NgModuleFactory, ChangeDetectorRef, ComponentFactoryResolver, Compiler, Inject } from "@angular/core";
import { SprintModel } from "../../models/sprints-model";
import { Observable, Subject } from "rxjs";
import { UserStory } from "../../models/userStory";
import { Store, select } from "@ngrx/store";
import { State } from "../../store/reducers/index";
import * as projectModuleReducers from "../../store/reducers/index";
import { tap, takeUntil } from "rxjs/operators";
import * as _ from "underscore";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { SatPopover } from "@ncstate/sat-popover";
import { ReplanSprintTriggered, SprintActionTypes, SprintStartTriggered, GetSprintsByIdTriggered } from "../../store/actions/sprints.action";
import { Actions, ofType } from "@ngrx/effects";
import { Router } from "@angular/router";
import { GoalReplanModel } from "../../models/goalReplanModel";
import { LoadGoalReplanActionsTriggered, InsertGoalReplanTriggered } from "../../store/actions/goal-replan-types.action";
import { UserStoryTypesModel } from "../../models/userStoryTypesModel";
import { LoadUserStoryTypesTriggered, UserStoryTypesActionTypes } from "../../store/actions/user-story-types.action";
import { GoalReplan } from "../../models/goalReplan";
import { ProjectMember } from "../../models/projectMember";
import { LoadMemberProjectsTriggered, ProjectMembersActionTypes } from "../../store/actions/project-members.actions";
import { UserStoryActionTypes } from "../../store/actions/userStory.actions"
import { SprintWorkItemActionTypes } from "../../store/actions/sprint-userstories.action";
import { StatusesModel, WorkflowStatusesModel } from "../../models/workflowStatusesModel";
import { LoadworkflowStatusCompleted, LoadworkflowStatusTriggered, workFlowStatusActionTypes } from "../../store/actions/work-flow-status.action";
import { WorkflowStatus } from "../../models/workflowStatus";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { SoftLabelConfigurationModel, WorkspaceDashboardFilterModel, WorkspaceDashboardFilterDropdown } from '../../../globaldependencies/models/softlabels-models';
import { FeatureIds } from '../../../globaldependencies/constants/feature-ids';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { WorkItemUploadPopupComponent } from '../dialogs/work-item-upload.component';
import { ProjectGoalsService } from '../../services/goals.service';
import * as FileSaver from 'file-saver';
import { LoadBugPriorityTypesTriggered } from '../../store/actions/bug-priority.action';
import { BugPriorityDropDownData } from '../../models/bugPriorityDropDown';
import { ProjectFeature } from '../../models/projectFeature';
import { LoadFeatureProjectsTriggered } from '../../store/actions/project-features.actions';
import { MatDialog } from '@angular/material/dialog';
import { MatOption } from '@angular/material/core';
import * as  XLSX from "xlsx";
import { BoardTypeIds } from '../../../globaldependencies/constants/board-types';
import { UserStorySearchCriteriaInputModel } from '../../models/userStorySearchInput';
import { ToastrService } from 'ngx-toastr';
import { WidgetService } from '../../services/widget.service';
import { ProjectModulesService } from '../../services/project.modules.service';
import { WorkFlowService } from '../../services/workFlow.Services';
import { WorkFlowStatusTransitionTableData } from '../../models/workFlowStatusTransitionTableData';
import { LoadworkflowStatusTransitionTriggered } from '../../store/actions/work-flow-status-transitions.action';
import { LoadUserStoryStatusTriggered } from "../../store/actions/userStoryStatus.action";
import { WorkFlowManagementPageComponent } from "@snovasys/snova-admin-module";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };



@Component({
    selector: "app-pm-sprints-board",
    templateUrl: "sprints-board.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SprintsBoardComponent extends AppFeatureBaseComponent implements OnInit {

    @Input("sprint")
    set _isSprint(data: SprintModel) {
        this.sprint = data;
        this.projectId = this.sprint.projectId;
        this.isSelected = [];
        this.isSelectedMembers = [];
        this.userNames = null;
        this.selectedNames = [];
        this.selectedAssigneelist = [];
        this.selectUserStoryStatus = this.fb.group({
            userStoryStatus: new FormControl("")
        });
        this.isBugFilters = this.sprint.isBugBoard;
        this.isListView = this.sprint.isSuperAgileBoard ? true : false;
        this.ownerId = null;
        this.minDate = this.sprint.sprintStartDate;
        if (this.sprint.isReplan) {
            this.store.dispatch(new LoadGoalReplanActionsTriggered());
        }
        const workflowStatus = new WorkflowStatus();
        if (this.sprint && this.sprint.workFlowId && this.sprint.sprintId != '00000000-0000-0000-0000-000000000000') {
            this.workflowId = this.sprint.workFlowId;
            workflowStatus.workFlowId = this.sprint.workFlowId;
            this.workflowStatus$ = this.store.pipe(
                select(projectModuleReducers.getworkflowStatusAllByWorkflowId, { workflowId: workflowStatus.workFlowId })
            );
            this.workflowStatus$
                .subscribe((s) => (this.workflowStatusList = s));
            if (this.workflowStatusList && this.workflowStatusList.length === 0) {
                this.store.dispatch(new LoadworkflowStatusTriggered(workflowStatus));
            } else {
                this.workflowName = this.workflowStatusList[0].workflowName;
            }
        }
        if (this.sprint.sprintId != '00000000-0000-0000-0000-000000000000') {
            this.store.dispatch(new LoadUserStoryStatusTriggered());
        }
        this.setSprintstatus();
    }
    @Input("isBoardLayout")
    set _isBoardLayout(data: boolean) {
        this.isBoardLayout = data;
    }
    @Input("isReportsBoard")
    set _isReportsBoard(data: boolean) {
        this.isReportsBoard = data;
    }
    @Input("isDocumentView")
    set _isDocumentView(data: boolean) {
        this.isDocumentView = data;
    }
    @Input("isCalenderView")
    set _isCalenderView(data: boolean) {
        this.isCalenderView = data;
    }
    @Input("showHeader")
    set _showHeader(data: boolean) {
        this.showHeader = data;
        if (this.showHeader) {
            this.store.dispatch(new LoadMemberProjectsTriggered(this.sprint.projectId));
        }
    }
    @ViewChild("allUserStoryStatusSelected") private allUserStoryStatusSelected: MatOption;
    @Output() eventClicked = new EventEmitter<boolean>();
    @Output() reportsBoardClicked = new EventEmitter<boolean>();
    @Output() getDocumentDetails = new EventEmitter<boolean>();
    @Output() getCalenderViewClicked = new EventEmitter<boolean>();
    @Output() selectedOwnerUserId = new EventEmitter<string>();
    @Output() emitReplanId = new EventEmitter<string>();
    @Output() saveAsDefaultPersistance = new EventEmitter<string>();
    @Output() resetToDefaultDashboardPersistance = new EventEmitter<string>();
    @Output() saveMultipleUserStories = new EventEmitter<UserStory>();
    @Output() refreshDashboard = new EventEmitter<string>();
    @Output() openAppsSettings = new EventEmitter<boolean>();
    @Output() emitAppListView = new EventEmitter<boolean>();
    @Output() selectedUserStoryStatus = new EventEmitter<string>();
    @ViewChild("workFlowPopover") workflowPopover: SatPopover;
    @ViewChild("editThreeDotsPopover") threeDotsPopOver: SatPopover;
    @ViewChild("replanSprintPopover") replanSprintPopUp: SatPopover;
    @ViewChild("filterThreeDotsPopover") filterthreeDotsPopOver;
    @ViewChild("updateAssigneePopover") updateAssigneePopUP: SatPopover;
    @ViewChild("updateEstimatedTimePopover") updateEStimatedTimePopUp: SatPopover;
    @ViewChild("updateUserStoryStatusPopover") updateUserstoryStatusPOpUp: SatPopover;
    @ViewChild("fileInput") fileInput: ElementRef;
    userStories$: Observable<UserStory[]>;
    accessDragApps: Boolean;
    goalReplanModel$: Observable<GoalReplanModel[]>;
    userStoryStatus$: Observable<StatusesModel[]>;
    projectMembers$: Observable<ProjectMember[]>;
    workflowStatus$: Observable<WorkflowStatus[]>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    workflowStatusList: WorkflowStatus[];
    workflowStatusComponentList: WorkflowStatus[];
    workflowStatusTransitions: WorkFlowStatusTransitionTableData[];
    userStoryTypes$: Observable<UserStoryTypesModel[]>;
    userStoryTypes: UserStoryTypesModel[];
    bugPriorities$: Observable<BugPriorityDropDownData[]>;
    bugPriorities: BugPriorityDropDownData[];
    projectFeature$: Observable<ProjectFeature[]>;
    projectFeatures: ProjectFeature[];
    userStoryStatusList: StatusesModel[];
    selectedWorkflowStatus: string;
    approveSprintOperationInProgress$: Observable<boolean>;
    accessPublishBoard: Boolean;
    isListView: boolean;
    accessUploadIcons$: Boolean;
    anyOperationInProgress$: Observable<boolean>;
    userStories: UserStory[];
    projectMembers: ProjectMember[];
    replanSprintModel: SprintModel;
    sprint: SprintModel;
    isBugFilters: boolean;
    isReOrderInProgress: boolean;
    assigneeForm: FormGroup;
    estimatedTimeForm: FormGroup;
    statusTransitionForm: FormGroup;
    selectUserStoryStatus: FormGroup;
    checkReplan: boolean;
    divActivate: boolean;
    isDocumentView: boolean;
    defaultProfilePicture: string = 'assets/images/faces/18.png';
    selectedReplanId: string;
    selectedUserStoryStatusId: string;
    replanSprint: FormGroup;
    showEstimatedTime: boolean;
    listView: boolean = true;
    defaultName: string = "N/A"
    isUnassigned: boolean;
    unAssignedUser: number;
    userStoryCount: number;
    isSelected: any[] = [];
    isSelectedMembers: any[] = [];
    selectedAssigneelist = [];
    selectedNames = [];
    ownerId: string;
    userNames: string;
    isAssigneeDialog: boolean;
    isReplanSprint: boolean;
    isActiveSprint: boolean;
    isBacklogSprint: boolean;
    isEstimatedTimeDialog: boolean;
    isUserStoryStatusDialog: boolean;
    downloadInProgress: boolean = false;
    updatePersistanceInprogress: boolean = false;
    workspaceDashboardFilterId: string;
    workspaceFilterModel = new WorkspaceDashboardFilterDropdown();
    minDate: Date;
    selectedMember: string;
    estimatedTime: any;
    clearFormValue: boolean;
    showHeader: boolean;
    isBoardLayout: boolean;
    isReportsBoard: boolean;
    isCalenderView: boolean;
    projectId: string;
    showUsersList: boolean;
    workflowStatusComponent: any;
    workflowStatusTransitionComponent: any;
    workflowName: string;
    workflowId: string;
    injector: any;
    canAccessWorkflow: boolean;

    public ngDestroyed$ = new Subject();

    constructor(private store: Store<State>, private actionUpdates$: Actions, private router: Router,
        private ProjectGoalsService: ProjectGoalsService, private dialog: MatDialog, private toastr: ToastrService
        , private widgetService: WidgetService,
        private ngModuleRef: NgModuleRef<any>, private compiler: Compiler,
        private vcr: ViewContainerRef,
        private workflowService: WorkFlowService,
        @Inject('ProjectModuleLoader') public projectModulesService: any,
        private cdRef: ChangeDetectorRef,
        private fb: FormBuilder
    ) {
        super();
        this.injector = this.vcr.injector;

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintActionTypes.ReplanSprintCompleted),
                tap(() => {
                    localStorage.setItem("isSprints", "isSprintsTab")
                    this.router.navigate([
                        "projects/projectstatus",
                        this.sprint.projectId,
                        "replan-goals"
                    ]);
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(workFlowStatusActionTypes.LoadworkflowStatusCompleted),
                tap(() => {
                    if (this.sprint.workFlowId) {
                        this.workflowStatus$ = this.store.pipe(
                            select(projectModuleReducers.getworkflowStatusAllByWorkflowId, { workflowId: this.sprint.workFlowId })
                        );
                        this.workflowStatus$
                            .subscribe((s) => (this.workflowStatusList = s));
                        if (this.workflowStatusList.length > 0) {
                            this.workflowName = this.workflowStatusList[0].workflowName;
                        }
                    }

                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintActionTypes.SprintStartCompleted),
                tap(() => {
                    localStorage.setItem("isSprints", "isSprintsTab")
                    this.router.navigate([
                        "projects/projectstatus",
                        this.sprint.projectId,
                        "active-goals"
                    ]);
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(ProjectMembersActionTypes.LoadProjectMembersCompleted),
                tap(() => {
                    this.projectMembers$ = this.store.pipe(select(projectModuleReducers.getProjectMembersAll));
                    this.projectMembers$.subscribe((x) => this.projectMembers = x);
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintWorkItemActionTypes.CreateMultiplSprintUserStoriesCompleted),
                tap(() => {
                    if (this.isAssigneeDialog) {
                        this.closeAssigneeDialog();
                    } else if (this.isEstimatedTimeDialog) {
                        this.closeEstimatedTimeDialog();
                    } else if (this.isUserStoryStatusDialog) {
                        this.closeUserStoryStatusDialog();
                    }
                })
            )
            .subscribe();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(UserStoryTypesActionTypes.LoadUserStoryTypesCompleted),
                tap(() => {
                    this.userStoryTypes$ = this.store.pipe(select(projectModuleReducers.getUserStoryTypesAll));
                    this.userStoryTypes$.subscribe(x => this.userStoryTypes = x);
                })
            )
            .subscribe();


    }
    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.searchUserStoryTypes();
        this.clearAssigneeForm();
        this.clearStatusForm();
        this.clearEstimatedTimeForm();
        this.approveSprintOperationInProgress$ = this.store.pipe(select(projectModuleReducers.sprintStartLoading))
        this.userStories$ = this.store.pipe(
            select(projectModuleReducers.getSprintWorkItemsAll),
            tap((userStories) => {
                this.userStories = userStories;
                if (this.userStories.length > 0) {
                    this.userStoryCount = this.userStories[0].totalCount;
                    this.unAssignedUser = userStories.filter(item => (item.ownerUserId == null || item.ownerUserId == '')).length;
                    userStories.forEach((userStory) => {
                        var subUserStories = userStory.subUserStoriesList;
                        if (subUserStories.length > 0) {
                            subUserStories = subUserStories.filter(function (userStory) {
                                return userStory.ownerUserId == null
                            })
                            if (subUserStories.length > 0) {
                                this.unAssignedUser = subUserStories.length;
                            }
                        }
                    })
                } else {
                    this.userStoryCount = 0;
                    this.unAssignedUser = 0;
                }
            }));

            
    this.userStoryStatus$ = this.store.pipe(
        select(projectModuleReducers.getUserStoryStatusAll),
        tap((userStoryStatus) => {
          this.userStoryStatusList = userStoryStatus;
        })
      );
  
        this.goalReplanModel$ = this.store.pipe(
            select(projectModuleReducers.getGoalReplanTypesAll)
        );
        var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
        this.accessDragApps = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_DragApps.toString().toLowerCase(); }) != null;

        this.workflowStatus$ = this.store.pipe(select(projectModuleReducers.getworkflowStatusAllByWorkflowId, { workflowId: this.sprint.workFlowId })
        );
        this.accessPublishBoard = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_PublishAsDefault.toString().toLowerCase(); }) != null;
        this.accessUploadIcons$ = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_WorkItemUpload.toString().toLowerCase(); }) != null;
        this.canAccessWorkflow = _.find(roles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_WorkflowManagement.toString().toLowerCase(); }) != null;
        this.anyOperationInProgress$ = this.store.pipe(select(projectModuleReducers.creatingUserstorySprint));

        this.getSoftLabelConfigurations();
        this.LoadProjectFeature();
        this.store.dispatch(new LoadBugPriorityTypesTriggered());
        this.bugPriorities$ = this.store.pipe(
            select(projectModuleReducers.getBugPriorityAll),
            tap((priority) => {
                this.bugPriorities = priority;
            })
        );
        this.userStoryTypes$ = this.store.pipe(select(projectModuleReducers.getUserStoryTypesAll),
            tap((types) => {
                this.userStoryTypes = types;
            })
        );

    }
    LoadProjectFeature() {
        const projectFeature = new ProjectFeature();
        projectFeature.projectId = this.projectId;
        projectFeature.IsDelete = false;
        this.store.dispatch(new LoadFeatureProjectsTriggered(projectFeature));
        this.projectFeature$ = this.store.pipe(
            select(projectModuleReducers.getProjectFeaturesAll),
            // tslint:disable-next-line: no-shadowed-variable
            tap((projectFeature) => {
                this.projectFeatures = projectFeature;
            })
        );
    }

    closeMenuPopover() {
        this.threeDotsPopOver.close();
    }

    downloadTasks() {
        this.downloadInProgress = true;
        var userStorySearchCriteria = new UserStorySearchCriteriaInputModel();
        userStorySearchCriteria.sprintId = this.sprint.sprintId;
        userStorySearchCriteria.isArchived = false;
        userStorySearchCriteria.isParked = false;
        userStorySearchCriteria.pageNumber = 1;
        userStorySearchCriteria.pageSize = 1000;
        userStorySearchCriteria.refreshUserStoriesCall = true;
        userStorySearchCriteria.projectId = this.projectId;
        this.ProjectGoalsService.DownloadSprintUserStories(userStorySearchCriteria).subscribe((responseData: any) => {
            if (responseData.success == true) {
                let filePath = responseData.data;
                if (filePath.blobUrl) {
                    const parts = filePath.blobUrl.split(".");
                    const fileExtension = parts.pop();

                    if (fileExtension == 'pdf') {
                    } else {
                        const downloadLink = document.createElement("a");
                        downloadLink.href = filePath.blobUrl;
                        downloadLink.download = filePath.fileName
                        downloadLink.click();
                    }
                }
            } else {
                this.toastr.warning("", responseData.apiResponseMessages[0].message);
            }
            this.downloadInProgress = false;
            this.closeMenuPopover();
        });
    }

    searchUserStoryTypes() {
        const userStoryTypesModel = new UserStoryTypesModel();
        userStoryTypesModel.isArchived = false;
        this.store.dispatch(new LoadUserStoryTypesTriggered(userStoryTypesModel))
    }

    clearForm() {
        this.replanSprint = new FormGroup({
            sprintEndDate: new FormControl('', Validators.compose([Validators.required]))
        })
    }

    onClickFromSuperagile(isBoard) {
        this.listView = !this.listView;
        this.workspaceFilterModel.isReportsPage = false;
        this.workspaceFilterModel.isTheBoardLayoutKanban = isBoard;
        this.workspaceFilterModel.isDocumentsView = false;
        this.updateBoardTypesFilter();
        this.eventClicked.emit(isBoard);
    }

    getBurnDownCharts() {
        this.isBoardLayout = false;
        this.workspaceFilterModel.isReportsPage = true;
        this.workspaceFilterModel.isTheBoardLayoutKanban = false;
        this.workspaceFilterModel.selectedItem = false;
        this.workspaceFilterModel.isDocumentsView = false;
        this.updateBoardTypesFilter();
        this.reportsBoardClicked.emit(true);
    }

    getDocuments() {
        this.isBoardLayout = false;
        this.workspaceFilterModel.isReportsPage = false;
        this.workspaceFilterModel.isTheBoardLayoutKanban = false;
        this.workspaceFilterModel.selectedItem = false;
        this.workspaceFilterModel.isDocumentsView = true;
        this.updateBoardTypesFilter();
        this.getDocumentDetails.emit(true);
    }

    getCalanderView() {
        this.isBoardLayout = false;
        this.getCalenderViewClicked.emit(true);
    }

    applyThemeForSuperagile() {
        if (this.isBoardLayout && !this.isReportsBoard && !this.isDocumentView) {
            return "highlight-calender"
        }
    }

    emitAppView() {
        this.listView = !this.listView
        this.cdRef.detectChanges();
        this.emitAppListView.emit(this.listView);
    }


    applyThemeForKanban() {
        if (!this.isBoardLayout && !this.isReportsBoard && !this.isDocumentView && !this.isCalenderView) {
            return "highlight-calender"
        }
    }

    applyThemeForReports() {
        if (!this.isBoardLayout && this.isReportsBoard) {
            return "highlight-calender"
        }
    }

    applyHighlightedThemeForDocuments() {
        if (!this.isBoardLayout && !this.isReportsBoard && this.isDocumentView) {
            return "highlight-calender"
        }
    }

    applyHighlightedThemeForCalender() {
        if (!this.isBoardLayout && !this.isReportsBoard && !this.isDocumentView && this.isCalenderView) {
            return "highlight-calender"
        }
    }

    getSelectedMember(userId, selectedIndex, userName) {
        const index = this.selectedAssigneelist.indexOf(userId);
        if (index > -1) {
            this.selectedAssigneelist.splice(index, 1);
            this.selectedNames.splice(index, 1);
            this.isSelectedMembers[selectedIndex] = false;
        } else {
            this.selectedAssigneelist.push(userId);
            this.selectedNames.push(userName);
            this.isSelectedMembers[selectedIndex] = true;
        }
        this.ownerId = this.selectedAssigneelist.toString();
        let isResult = this.selectedNames.filter((x) => x == "N/A");
        if (isResult.length > 0) {
            this.isUnassigned = true;
        } else {
            this.isUnassigned = false;
        }
        this.userNames = this.selectedNames.toString();
        this.selectedOwnerUserId.emit(this.ownerId);
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    GetAssigne(userId, isChecked, selectedIndex, userName) {
        if (isChecked) {
            this.selectedAssigneelist.push(userId);
            this.selectedNames.push(userName);
            this.isSelected[selectedIndex] = true;
        } else {
            const index = this.selectedAssigneelist.indexOf(userId);
            this.selectedAssigneelist.splice(index, 1);
            this.selectedNames.splice(index, 1);
            this.isSelected[selectedIndex] = false;
        }
        this.ownerId = this.selectedAssigneelist.toString();
        this.userNames = this.selectedNames.toString();
        this.selectedOwnerUserId.emit(this.ownerId);
    }

    clearAssigneeFilter() {
        this.ownerId = "";
        this.selectedAssigneelist = [];
        this.isSelected = [];
        this.isSelectedMembers = [];
        this.selectedNames = [];
        this.userNames = null;
        this.selectedOwnerUserId.emit(this.ownerId);
    }

    filter() {
        if (this.userNames || this.selectedWorkflowStatus) {
            return true;
        }
        else {
            return false;
        }
    }


    replanSprintForm() {
        this.replanSprint.patchValue(this.sprint);
    }

    cancelreplanSprintPopup() {
        this.replanSprintPopUp.close();
    }

    approveCurrentSprint() {
        this.replanSprintModel = this.replanSprint.value;
        this.replanSprintModel.sprintId = this.sprint.sprintId;
        this.replanSprintModel.sprintName = this.sprint.sprintName;
        this.replanSprintModel.sprintStartDate = this.sprint.sprintStartDate;
        this.replanSprintModel.description = this.sprint.description;
        this.replanSprintModel.isReplan = false;
        this.replanSprintModel.projectId = this.sprint.projectId;
        this.replanSprintModel.timeStamp = this.sprint.timeStamp;
        this.replanSprintModel.boardTypeId = this.sprint.boardTypeId;
        this.replanSprintModel.testSuiteId = this.sprint.testSuiteId;
        this.replanSprintModel.boardTypeApiId = this.sprint.boardTypeApiId;
        this.replanSprintModel.version = this.sprint.version;
        this.replanSprintModel.sprintResponsiblePersonId = this.sprint.sprintResponsiblePersonId;
        this.store.dispatch(new SprintStartTriggered(this.replanSprintModel));
    }

    setReplanOption() {
        this.checkReplan = true;
    }

    saveSprintReplan(sprintReplanId) {
        this.selectedReplanId = sprintReplanId;
        this.emitReplanId.emit(this.selectedReplanId);
        const goalReplan = new GoalReplan();
        goalReplan.goalId = this.sprint.sprintId;
        goalReplan.goalReplanTypeId = sprintReplanId;
        goalReplan.isFromSprint = true;
        this.store.dispatch(new InsertGoalReplanTriggered(goalReplan));
    }

    replanCurrentSprint() {
        const sprintStartModel = new SprintModel();
        sprintStartModel.sprintId = this.sprint.sprintId;
        sprintStartModel.sprintName = this.sprint.sprintName;
        sprintStartModel.sprintStartDate = this.sprint.sprintStartDate;
        sprintStartModel.description = this.sprint.description;
        sprintStartModel.isReplan = true;
        sprintStartModel.projectId = this.sprint.projectId;
        sprintStartModel.timeStamp = this.sprint.timeStamp;
        sprintStartModel.sprintEndDate = this.sprint.sprintEndDate;
        sprintStartModel.boardTypeId = this.sprint.boardTypeId;
        sprintStartModel.testSuiteId = this.sprint.testSuiteId;
        sprintStartModel.boardTypeApiId = this.sprint.boardTypeApiId;
        sprintStartModel.version = this.sprint.version;
        sprintStartModel.sprintResponsiblePersonId = this.sprint.sprintResponsiblePersonId;
        this.store.dispatch(new ReplanSprintTriggered(sprintStartModel));
    }

    saveAsDefaultDashboardPersistance() {
        this.saveAsDefaultPersistance.emit("");
        //this.filterthreeDotsPopOver.close();
    }

    resetToDefaultPersistance() {
        this.resetToDefaultDashboardPersistance.emit("");
        //this.filterthreeDotsPopOver.close();
    }

    refreshReportsDashboard() {
        this.refreshDashboard.emit("");
        // this.filterthreeDotsPopOver.close();
    }

    openReportAppsSettings() {
        this.openAppsSettings.emit(false);
        //this.filterthreeDotsPopOver.close();
    }

    getAssigneeValue(selectedEvent) {
        const projectMembers = this.projectMembers;
        // tslint:disable-next-line: only-arrow-functions
        const filteredList = _.find(projectMembers, function (member) {
            return member.projectMember.id === selectedEvent;
        })
        if (filteredList) {
            this.selectedMember = filteredList.projectMember.name;
        }
    }

    changeEstimatedTime(estimatedTime) {
        this.estimatedTime = estimatedTime;
    }


    setSprintstatus() {
        if (this.sprint.sprintStartDate && !this.sprint.isReplan) {
            this.showEstimatedTime = true;
            this.isActiveSprint = true;
            this.isReplanSprint = false;
            this.isBacklogSprint = false;
        } else if (this.sprint.sprintStartDate && this.sprint.isReplan) {
            this.showEstimatedTime = false;
            this.isReplanSprint = true;
            this.isActiveSprint = false;
            this.isBacklogSprint = false;
        } else if (!this.sprint.sprintStartDate) {
            this.showEstimatedTime = false;
            this.isBacklogSprint = true;
            this.isActiveSprint = false;
            this.isReplanSprint = false;

        }
    }

    clearAssigneeForm() {
        this.selectedMember = null;
        this.assigneeForm = new FormGroup({
            ownerUserId: new FormControl("", [])
        });
    }

    clearStatusForm() {
        this.statusTransitionForm = new FormGroup({
            userStoryStatusId: new FormControl("", [])
        });
    }

    clearEstimatedTimeForm() {
        this.estimatedTime = null;
        this.clearFormValue = true;
        this.estimatedTimeForm = new FormGroup({
            estimatedTime: new FormControl("", [])
        });
    }

    updateAssigneeForMultipleUserStories() {
        this.isAssigneeDialog = true;
        this.isEstimatedTimeDialog = false;
        this.isUserStoryStatusDialog = false;
        let userStoryModel = new UserStory();
        userStoryModel = this.assigneeForm.value;
        userStoryModel.sprintId = this.sprint.sprintId;
        this.saveMultipleUserStories.emit(userStoryModel);
    }


    updateEstimatedTimeForMultipleUserStories() {
        this.isAssigneeDialog = false;
        this.isEstimatedTimeDialog = true;
        this.isUserStoryStatusDialog = false;
        let userStoryModel = new UserStory();
        userStoryModel = this.estimatedTimeForm.value;
        userStoryModel.estimatedTime = Number(this.estimatedTime);
        userStoryModel.sprintId = this.sprint.sprintId;
        this.saveMultipleUserStories.emit(userStoryModel);
    }

    updateStatusTransitionsForMultipleUserStories() {
        this.isAssigneeDialog = false;
        this.isEstimatedTimeDialog = false;
        this.isUserStoryStatusDialog = true;
        let userStoryModel = new UserStory();
        userStoryModel = this.statusTransitionForm.value;
        userStoryModel.sprintId = this.sprint.sprintId;
        this.saveMultipleUserStories.emit(userStoryModel);
    }

    closeAssigneeDialog() {
        let popOver = this.updateAssigneePopUP;
        if (popOver) {
            popOver.close();
        }
    }

    closeUserStoryStatusDialog() {
        let popOver = this.updateUserstoryStatusPOpUp;
        if (popOver) {
            popOver.close();
        }
    }

    closeEstimatedTimeDialog() {
        this.estimatedTime = null;
        let popOver = this.updateEStimatedTimePopUp;
        if (popOver) {
            popOver.close();
        }
    }

    checkPermissionsForAssignee(isActiveAssignee, isBacklogAssignee, isReplanAssignee) {
        if (this.isActiveSprint && !isActiveAssignee) {
            return false;
        } else if (this.isBacklogSprint && !isBacklogAssignee) {
            return false;
        } else if (this.isReplanSprint && !isReplanAssignee) {
            return false;
        } else {
            return true;
        }
    }


    checkPermissionForBulkUpdateEstimatedTime(isActivePermission, isBacklogPermissison) {
        if ((this.isActiveSprint && !isActivePermission) || (this.isBacklogSprint && !isBacklogPermissison)) {
            return false;
        } else if (this.isActiveSprint) {
            return false;
        } else {
            return true;
        }
    }

    downloadFile() {
        this.ProjectGoalsService.WorkItemUploadTemplate(false, this.isBugFilters).subscribe((response: any) => {
            var blob = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            FileSaver.saveAs(blob, "WorkItemUploadTemplate.xlsx");
        },
            function (error) {
                this.toastr.error("Template download failed.");
            });
    }

    uploadEventHandler(file, event) {

        if (file != null) {
            //var XLSX = require('xlsx');
            var reader = new FileReader();

            let allProjectMembers = this.projectMembers;
            let allUserStoryTypes = this.userStoryTypes;
            let allBugPriorityTypes = this.bugPriorities;
            let allProjectFeatures = this.projectFeatures;

            let dialog = this.dialog;
            let sprintId = this.sprint.sprintId
            let projectId = this.sprint.projectId;
            let fileTemInput = this.fileInput;
            let isBugFilters = this.isBugFilters;
            let store = this.store;
            reader.onload = function (e: any) {

                let uploadedData = [];
                var bstr = (e != undefined && e.target != undefined) ? e.target.result : "";
                var workBook = XLSX.read(bstr, { type: 'binary' });
                var shtData = workBook.Sheets[workBook.SheetNames[0]];
                var sheetData;
                if (isBugFilters) {
                    sheetData = XLSX.utils.sheet_to_json(shtData, {
                        header: ["WorkItem", "Assignee", "WorkItemType", "EstimatedTime", "StoryPoints", "BugPriority", "ProjectComponent", "BugCausedUser", "Version"], raw: false, defval: ''
                    });
                } else {
                    sheetData = XLSX.utils.sheet_to_json(shtData, {
                        header: ["WorkItem", "Assignee", "WorkItemType", "EstimatedTime", "StoryPoints"], raw: false, defval: ''
                    });
                }
                sheetData.forEach(function (item: any, index) {

                    if (index > 0) {

                        var isAssigneeValid, isItemTypeValid, isBugPriorityTypeValid, isProjectFeatureValid, isBugCausedUserValid;

                        var errorMessage = [];
                        var warningMessage = [];
                        var isWorkitemValid = true;

                        if (item.WorkItem.trim() == "") {
                            errorMessage.push(" The Work item is required.");
                            isWorkitemValid = false;
                        }
                        if (item.WorkItem.length > 800) {
                            errorMessage.push("Work item name cannot exceed 800 characters");
                            isWorkitemValid = false;
                        }

                        if (item.Assignee.toLowerCase().trim() != "") {
                            isAssigneeValid = _.find(allProjectMembers, function (member) {
                                return member.projectMember.name.toLowerCase().trim().replace(/\s/g, '') == item.Assignee.toLowerCase().trim().replace(/\s/g, '')
                            });
                            if (isAssigneeValid == undefined) {
                                warningMessage.push(" Given assignee is invalid.");
                            }
                        }

                        if (item.WorkItemType.toLowerCase().trim() != "") {
                            isItemTypeValid = _.find(allUserStoryTypes, function (itemtype) {
                                return itemtype.userStoryTypeName.toLowerCase().trim().replace(/\s/g, '') == item.WorkItemType.toLowerCase().trim().replace(/\s/g, '')
                            });
                            if (isItemTypeValid == undefined) {
                                warningMessage.push(" Given Work item type is invalid.");
                            }
                        }

                        if (isNaN(Number(item.EstimatedTime.trim()))) {
                            warningMessage.push(" The estimated time is in wrong format.");
                            item.EstimatedTime = null;
                        }
                        else
                            item.EstimatedTime = Number(item.EstimatedTime.trim());

                        if (isNaN(Number(item.StoryPoints && item.StoryPoints.trim()))) {
                            warningMessage.push(" The story points is in wrong format.");
                            item.StoryPoints = null;
                        }
                        else
                            item.StoryPoints = Number(item.StoryPoints.trim());

                        // Check for bug priority
                        if (item.BugPriority && isBugFilters) {
                            isBugPriorityTypeValid = _.find(allBugPriorityTypes, function (itemtype) {
                                return itemtype.priorityName.toLowerCase().trim().replace(/\s/g, '') == item.BugPriority.toLowerCase().trim().replace(/\s/g, '')
                            });
                            if (isBugPriorityTypeValid == undefined) {
                                warningMessage.push(" Given bug priority is invalid.");

                            }
                        }
                        // Check for project feature
                        if (item.ProjectComponent && isBugFilters) {
                            isProjectFeatureValid = _.find(allProjectFeatures, function (itemtype) {
                                return itemtype.projectFeatureName.toLowerCase().trim().replace(/\s/g, '') == item.ProjectComponent.toLowerCase().trim().replace(/\s/g, '')
                            });
                            if (isProjectFeatureValid == undefined) {
                                warningMessage.push(" Given project component is invalid.");

                            }
                        }

                        // Check for bug caused user
                        if (item.BugCausedUser && isBugFilters) {
                            isBugCausedUserValid = _.find(allProjectMembers, function (member) {
                                return member.projectMember.name.toLowerCase().trim().replace(/\s/g, '') == item.BugCausedUser.toLowerCase().trim().replace(/\s/g, '')
                            });
                            if (isBugCausedUserValid == undefined) {
                                warningMessage.push(" Given bug caused user is invalid.");

                            }
                        }

                        // Check for Version
                        if (item.Version && item.Version.trim() && isBugFilters) {
                        }

                        if (errorMessage.length > 0) {
                            isWorkitemValid = false;
                        } else {
                            isWorkitemValid = true;
                        }

                        var workItemObj = {
                            isWorkitemValid: isWorkitemValid,
                            userStoryName: item.WorkItem.trim(),
                            sprintId: sprintId,
                            projectId: projectId,
                            ownerUserId: isAssigneeValid != undefined ? isAssigneeValid.projectMember.id : "",
                            userStoryTypeId: isItemTypeValid != undefined ? isItemTypeValid.userStoryTypeId : "",
                            bugCausedUserId: isBugCausedUserValid != undefined ? isBugCausedUserValid.projectMember.id : "",
                            projectFeatureId: isProjectFeatureValid != undefined ? isProjectFeatureValid.projectFeatureId : "",
                            bugPriorityId: isBugPriorityTypeValid != undefined ? isBugPriorityTypeValid.bugPriorityId : "",
                            ownerName: item.Assignee,
                            userStoryType: item.WorkItemType,
                            estimatedTime: item.EstimatedTime,
                            bugPriority: item.BugPriority,
                            projectComponent: item.ProjectComponent,
                            bugCausedUser: item.BugCausedUser,
                            isActive: true,
                            sprintEstimatedTime: item.StoryPoints,
                            messages: errorMessage.join(', '),
                            warningMessages: warningMessage.join(', '),
                            versionName: item.Version,
                            RowNumber: item.__rowNum__
                        }
                        uploadedData.push(workItemObj);
                    }
                });
                fileTemInput.nativeElement.value = "";
                const dialogRef = dialog.open(WorkItemUploadPopupComponent, {
                    width: "90%",
                    direction: 'ltr',
                    data: { uploadedData: uploadedData, isFromSprint: true, isBugFilters },
                    disableClose: true
                });
                dialogRef.afterClosed().subscribe((result) => {
                    if (result.success) {

                    }
                });
            };
            if (event.target != undefined)
                reader.readAsBinaryString(event.target.files[0]);
        }
    }

    updateBoardTypesFilter() {
        this.updatePersistanceInprogress = true;
        let workspaceDashboardFilterModel = new WorkspaceDashboardFilterModel();
        workspaceDashboardFilterModel.workspaceDashboardId = this.sprint.sprintId;
        workspaceDashboardFilterModel.workspaceDashboardFilterId = this.workspaceDashboardFilterId;
        workspaceDashboardFilterModel.filterJson = JSON.stringify(this.workspaceFilterModel);
        this.widgetService.updateworkspaceDashboardFilter(workspaceDashboardFilterModel)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    this.workspaceDashboardFilterId = responseData.data;
                    this.updatePersistanceInprogress = false;
                } else {
                    this.toastr.warning("", responseData.apiResponseMessages[0].message);
                    this.updatePersistanceInprogress = false;
                }
            });
    }

    getGoalWorkflow() {
        var loader = this.projectModulesService["modules"];
        var component = "Workflow management";
        var transitionComponent = "Workflow status transition component";
        var modules = JSON.parse(localStorage.getItem("Modules"));
        var module = _.find(modules, function(module: any) { return module.modulePackageName == 'AdminPackageModule' });

        if (!module) {
            console.error("No module found for AdminPackageModule");
        }

        var path = loader[module.modulePackageName];

        (path() as Promise<NgModuleFactory<any> | Type<any>>)
            .then(elementModuleOrFactory => {
                if (elementModuleOrFactory instanceof NgModuleFactory) {
                    // if ViewEngine
                    return elementModuleOrFactory;
                } else {
                    try {
                        // if Ivy
                        return this.compiler.compileModuleAsync(elementModuleOrFactory);
                    } catch (err) {
                        throw err;
                    }
                }
            })
            .then((moduleFactory: NgModuleFactory<any>) => {

                const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

                var allComponentsInModule = (<any>componentService).components;

                this.ngModuleRef = moduleFactory.create(this.injector);

                var componentDetails = allComponentsInModule.find(elementInArray =>
                    elementInArray.name.toLowerCase() === component.toLowerCase()
                );
                this.workflowStatusComponent = {};
                this.workflowStatusComponent.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
                this.workflowStatusComponent.inputs = {
                    workflowId: this.sprint.workFlowId,
                    isGoalsPage: true

                };
                this.workflowStatusComponent.outputs = {
                    changeReorder: event => this.reOrderInProgress(event)

                }

                // var componentDetails = allComponentsInModule.find(elementInArray =>
                //     elementInArray.name.toLowerCase() === transitionComponent.toLowerCase()
                // );
                // this.workflowStatusTransitionComponent = {};
                // this.workflowStatusTransitionComponent.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
                // this.workflowStatusTransitionComponent.inputs = {
                //     workflowId: this.workflowId,
                //     isGoalsPage: true,
                //     workFlowStatuses: this.workflowStatusList,
                // };
                // this.workflowStatusTransitionComponent.outputs = {
                //     getStatusTransitionsList: event => this.getTransitionsList(event)

                // }
            })
        this.cdRef.detectChanges();
    }

    getTransitionsList(event) {
        this.workflowStatusTransitions = event;
        this.workflowStatusComponent.inputs.workFlowStatusTransitionTableDataDetails = this.workflowStatusTransitions;
        this.cdRef.detectChanges();
    }

    reOrderInProgress(event) {
        this.isReOrderInProgress = true;
        var workflowStatus = new WorkflowStatus();
        workflowStatus.workFlowId = this.sprint.workFlowId;
        this.workflowService.GetAllWorkFlowStatus(workflowStatus).subscribe((x: any) => {
            if (x.success) {
                this.workflowStatusComponentList = x.data;
                this.workflowStatusComponentList = this.workflowStatusComponentList.sort((a, b) => {
                    return a.orderId - b.orderId
                });
                this.workflowStatusTransitionComponent.inputs.workFlowStatuses = this.workflowStatusComponentList;
                this.workflowStatusComponent.inputs.workFlowStatuses = this.workflowStatusComponentList;
            }
        })
    }

    closeBugPopover() {
        this.workflowPopover.close();
        if (this.isReOrderInProgress) {
            this.isReOrderInProgress = false;
            this.store.dispatch(new LoadworkflowStatusCompleted(this.workflowStatusComponentList));
            const workflowTransitionTransitionFetchInput = new WorkFlowStatusTransitionTableData();
            workflowTransitionTransitionFetchInput.sprintId = this.sprint.sprintId;
            this.store.dispatch(
                new LoadworkflowStatusTransitionTriggered(
                    workflowTransitionTransitionFetchInput
                )
            );
        }
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    checkVisibilityOfUserStoryStatusFilter() {
        if (this.sprint.sprintId != '00000000-0000-0000-0000-000000000000' && !this.sprint.isReplan && this.sprint.sprintStartDate) {
            return true;
        } else {
            return false;
        }
    }

    getUserStorieslistByUserStoryStatus() {
        const userStoryStatus = this.selectUserStoryStatus.value.userStoryStatus;
        const index = userStoryStatus.indexOf(0);
        let workflowStatusList = [];
        if (index > -1) {
            userStoryStatus.splice(index, 1);
        }

        this.selectedUserStoryStatusId = userStoryStatus.toString();
        if (this.sprint.sprintId == '00000000-0000-0000-0000-000000000000') {
            workflowStatusList = this.userStoryStatusList;
        } else {
            workflowStatusList = this.workflowStatusList;
        }
        // tslint:disable-next-line: only-arrow-functions
        const workflowStatus = _.filter(workflowStatusList, function (status) {
            return userStoryStatus.toString().includes(status.userStoryStatusId);
        })
        const workflowStatusNames = workflowStatus.map((x) => x.userStoryStatusName);
        this.selectedWorkflowStatus = workflowStatusNames.toString();
        this.selectedUserStoryStatus.emit(this.selectedUserStoryStatusId);
    }

    toggleAllUserStoryStatusSelection() {
        if (this.allUserStoryStatusSelected.selected) {
            if (this.sprint.sprintId == '00000000-0000-0000-0000-000000000000') {
                this.selectUserStoryStatus.controls.userStoryStatus.patchValue([
                    ...this.userStoryStatusList.map((item) => item.userStoryStatusId),
                    0
                ]);
            } else {
                this.selectUserStoryStatus.controls.userStoryStatus.patchValue([
                    ...this.workflowStatusList.map((item) => item.userStoryStatusId),
                    0
                ]);
            }

        } else {
            this.selectUserStoryStatus.controls.userStoryStatus.patchValue([]);
        }
        this.getUserStorieslistByUserStoryStatus();
    }

    toggleUserStoryStatusPerOne(all) {
        if (this.allUserStoryStatusSelected.selected) {
            this.allUserStoryStatusSelected.deselect();
            return false;
        }
        if (this.sprint.sprintId == '00000000-0000-0000-0000-000000000000') {
            if (
                this.selectUserStoryStatus.controls.userStoryStatus.value.length ===
                this.userStoryStatusList.length
            ) {
                this.allUserStoryStatusSelected.select();
            }
        } else {
            if (
                this.selectUserStoryStatus.controls.userStoryStatus.value.length ===
                this.workflowStatusList.length
            ) {
                this.allUserStoryStatusSelected.select();
            }
        }
    }

    
  clearWorkFlowStatus() {
    this.selectedUserStoryStatusId = null;
    this.selectedWorkflowStatus = null;
    this.selectUserStoryStatus.reset();
    this.selectedUserStoryStatus.emit("");
  }
}