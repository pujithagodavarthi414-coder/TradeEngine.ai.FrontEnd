import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, Input, TemplateRef, Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatOption } from "@angular/material/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { select, Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import * as _ from "underscore";
import * as projectModuleReducers from "../../store/reducers/index";
import { UserStory } from "../../models/userStory";
import { State } from "../../store/reducers/index";
import { ofType, Actions } from "@ngrx/effects";
import { Subject, from, of } from "rxjs";
import { takeUntil, tap, groupBy, mergeMap, toArray, switchMap } from "rxjs/operators";
import { ProjectService } from "../../services/projects.service";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { UserStoryTypesModel } from "../../models/userStoryTypesModel";
import { LoadUserStoryTypesTriggered } from "../../store/actions/user-story-types.action";
import { BugPriorityDropDownData } from "../../models/bugPriorityDropDown";
import { LoadBugPriorityTypesTriggered } from "../../store/actions/bug-priority.action";
import { LoadUserStoryStatusTriggered } from "../../store/actions/userStoryStatus.action";
import { StatusesModel } from "../../models/workflowStatusesModel";
import { SearchFilterPipe } from "../../pipes/searchfilter.pipe";
import { UserStoryTagsPipe } from "../../pipes/userstory-tags.pipes";
import { BugPriorityFilterPipe } from "../../pipes/bugPriorityFilter.pipes";
import { ResultFilterPipe } from "../../pipes/result.pipes";
import { WorkItemTypesFilterPipe } from "../../pipes/work-item-types.pipes";
import { TranslateService } from "@ngx-translate/core";
import { GoalSearchCriteriaApiInputModel } from "../../models/goalSearchInput";
import { ProjectGoalsService } from "../../services/goals.service";
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import { UserStoryActionTypes } from "../../store/actions/userStory.actions";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { SoftLabelConfigurationModel, WorkspaceDashboardFilterDropdown, WorkspaceDashboardFilterModel } from '../../../globaldependencies/models/softlabels-models';
import { WidgetService } from '../../services/widget.service';
import { SoftLabelPipe } from '../../../globaldependencies/pipes/softlabels.pipes';
import { UserService } from '../../services/user.service';
import { SprintWorkItemActionTypes } from '../../store/actions/sprint-userstories.action';
import { Branch } from '../../models/branch';
import { UserModel } from '../../models/user';
import { UserStoryLogTimeModel } from '../../models/userStoryLogTimeModel';
import { InsertAutoLogTimeTriggered } from '../../store/actions/userStory-logTime.action';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { MenuItemService } from '../../services/feature.service';
import { AdhocWorkActionTypes } from '../../store/actions/adhoc-work.action';
import { Dashboard } from '../../Models/dashboard';
import { Guid } from 'guid-typescript';
import * as $_ from 'jquery';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionCategory } from '../../models/action-category.model';
import { BusinessUnitDropDownModel } from '../../models/businessunitmodel';

const $ = $_;

@Component({
    selector: "app-pm-all-work-items",
    templateUrl: "all-work-items.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AllWorkItemsComponent extends CustomAppBaseComponent {
    @ViewChild("allUserStoryStatusSelected") private allUserStoryStatusSelected: MatOption;
    @ViewChild("allUserStoryTypesSelected") private allUserStoryTypesSelected: MatOption;
    @ViewChild("allSelected") private allSelected: MatOption;
    @ViewChild("allUserSelected") private allUserSelected: MatOption;
    @ViewChild("allBranchSelected") private allBranchSelected: MatOption;
    @ViewChild("allActionCategorySelected") private allActionCategorySelected: MatOption;
    @ViewChild("allTeamMembersSelected") private allTeamMembersSelected: MatOption;
    @ViewChild("uniqueUserstoryDialog") private uniqueUserstoryDialog: TemplateRef<any>;
    @ViewChild("adhocUserstoryDetailDialog") private adhocUserstoryDetailDialog: TemplateRef<any>;
    @ViewChild("businessUnitsSelected") private businessUnitsSelected: MatOption;

    @Output() closePopUp = new EventEmitter<any>();

    fromCustomApp: boolean;
    Ids: string;
    teamList: string;
    isAnyOperationIsInprogress: boolean;
    selectedBusinessUnitIds: any;

    @Input("Ids")
    set _Ids(Ids) {
        if (Ids) {
            this.fromCustomApp = true;
            this.Ids = Ids;
            if (!this.Ids || this.Ids == "") {
                this.Ids = Guid.EMPTY;
            }
            this.loadWorkItems();
            // this.startedWorkItemList = [];
            // this.anyOperationInProgress = true;
            // let workItemModel = new UserStory();
            // workItemModel.UserStoryIds = this.Ids.split(',');
            // this.projectService.searchAllWorkItems(workItemModel).subscribe((result: any) => {
            //     if (result.success) {
            //         if (result.data && result.data.length > 0) {
            //             this.startedWorkItemList = result.data;

            //             if (this.startedWorkItemList[0].endTime == null && this.startedWorkItemList[0].startTime != null) {
            //                 this.showWorkItem = false;
            //             }
            //             else {
            //                 this.showWorkItem = true;
            //                 this.startedWorkItemList = [];
            //                 this.workItemListCount = this.workItemList[0].totalCount;
            //                 this.filter();
            //             }
            //         }
            //         else {
            //             this.startedWorkItemList = [];
            //             this.workItemListCount = 0;
            //             this.showWorkItem = true;
            //             this.filter();
            //         }
            //         this.anyOperationInProgress = false;
            //         this.cdRef.markForCheck();
            //     }
            //     else {
            //         this.anyOperationInProgress = false;
            //         this.validationMessage = result.apiResponseMessages[0].message;
            //         this.toastr.error(this.validationMessage);
            //         this.showWorkItem = true;
            //     }
            //     this.cdRef.detectChanges();
            // });
        }
    }

    @Input("dashboardId")
    set _dashboardId(data: string) {
        if (data != null && data !== undefined && data !== this.dashboardId) {
            this.dashboardId = data;
            this.getWorkspaceDashboardsFilter();
        }
    }

    @Input("dashboardName")
    set _dashboardName(data: string) {
        if (data != null && data !== undefined) {
            this.dashboardName = data;
        } else {
            this.dashboardName = "All work items";
        }
    }

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    @Input('isPopup')
    set _isPopup(data: boolean) {
        this.isPopupShow = data;
    }

    @Input('fromDashboard')
    set fromDashboard(data: boolean) {
        this.isFromDashboard = data;
    }

    @Input('notFromAudits')
    set _notFromAudits(data: boolean) {
        if (data || data == false) {
            this.notFromAudits = data;
            if (data == false) {
                this.getRequiredData();
                this.getBranchList();
                this.getUserList();
                this.loadGoals();
                this.getActionCategories();
                this.getBusinessUnits();
            }
        }
        else
            this.notFromAudits = true;
    }

    @Input('notFromAuditActions')
    set _notFromAuditActions(data: boolean) {
        if (data || data == false) {
            this.notFromAuditActions = data;
        }
        else
            this.notFromAuditActions = true;
    }

    @Input("isFromMyWork")
    set _isFromMyWork(data: boolean) {
        this.isFromMyWork = data;
        if (this.isFromMyWork) {
            this.isIncludeUnAssigned = true;
        }
    }

    @Input("isMyWork")
    set _isMyWork(data: boolean) {
        this.isMyWork = data;
        if (this.isMyWork) {
            this.isMyWork = true;
        }
        else {
            this.isMyWork = false;
        }
    }

    isFromDashboard: boolean = false;
    public ngDestroyed$ = new Subject();
    userStories: UserStory[];
    dashboardFilters: DashboardFilterModel;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    workflowStatus$: Observable<StatusesModel[]>;
    userStoryTypes$: Observable<UserStoryTypesModel[]>;
    bugPriorities$: Observable<BugPriorityDropDownData[]>;

    softLabels: SoftLabelConfigurationModel[];
    workflowStatusList: StatusesModel[];
    workItemList: UserStory[] = [];
    startedWorkItemList: UserStory[] = [];
    userStoryTypes: UserStoryTypesModel[];
    bugPriorities: BugPriorityDropDownData[];
    branchList = [];
    userList = [];
    actionCategories = [];
    workspaceFilterModel = new WorkspaceDashboardFilterDropdown();
    isPermissionForWorkItemApp: Boolean;
    isPermissionForAdhocWorkItemApp: Boolean;
    selectUserStoryStatus: FormGroup;
    selectUserStoryTypeForm: FormGroup;
    selectBugPriority: FormGroup;
    selectUser: FormGroup;
    selectBranch: FormGroup;
    selectActionCategory: FormGroup;
    teamMembers: any;
    isShowText: boolean = false;

    pageSize: number = 25;
    pageNumber: number = 1;
    showWorkItem: boolean = true;
    teamLeadId: string;
    projectId: string;
    pageIndex: number = 0;
    workItemListCount: number = 0;
    selectTeamMemberId: FormGroup;
    pageSizeOptions: number[] = [25, 50, 100, 150, 200];
    validationMessage: string;
    teamMemberId: string;
    searchText: string;
    workItemText: string = "You are not started any work item. Please start your work!!"
    searchTags: string;
    goalReplanId: string;
    selectedUserStoryId: string;
    selectedWorkflowStatus: string;
    selectedUserStoryStatusId: string;
    selectedUserStoryType: string;
    selectedUserStoryTypeIds: string;
    selectedUserIds: string;
    selectedBranchIds: string;
    selectedActionCategoryIds: string;
    selectedBugPriorityId: string;
    selectedBugPriority: string;
    selectedUser: string;
    selectedBranch: string;
    selectedActionCategory: string;
    selectedTeamLead: string;
    isEditFromProjects: boolean = false;
    anyOperationInProgress: boolean = false;
    calanderView: boolean = false;
    kanbanView: boolean = false;
    userBoardView: boolean = false;
    filteredWorkItemList: UserStory[] = [];
    isEditAppName: boolean = false;
    isIncludeUnAssigned: boolean = false;
    isExcludeOtherUs: boolean = false;
    notFromAudits: boolean = true;
    notFromAuditActions: boolean = true;
    updatePersistanceInprogress: boolean = false;
    changedAppName: string;
    dashboardId: string;
    dashboardName: string;
    isFromMyWork: boolean;
    workspaceDashboardFilterId: string;
    selectedViewTypeIndex: number;
    roleFeaturesIsInProgress$: Observable<boolean>;
    loggedUser: any;
    goal: any;
    userStorySearchCriteria: any;
    isPopupShow: boolean = false;
    adhocProgress: boolean = false;
    anyOperationInProgressForAutoLogging$: Observable<boolean>;
    loaded: boolean;
    view: string;
    viewSelector: string;
    allBusinessUnits: BusinessUnitDropDownModel[] = [];
    businessUnitsList: BusinessUnitDropDownModel[] = [];
    selectedBusinessUnits: string;
    selectBusinessUnitForm: FormGroup;
   // isMyProductivity: Boolean = true;
    isMyProductivity: Boolean = true;
    isMyWork: boolean = false;

    constructor(private actionUpdates$: Actions, private store: Store<State>, private formBuilder: FormBuilder, private projectService: ProjectService,
        ///private auditService: AuditService, private assetService: AssetService, 
        public dialog: MatDialog, private cdRef: ChangeDetectorRef,
        private toastr: ToastrService, private searchFilterPipe: SearchFilterPipe, private userStoryTagsPipe: UserStoryTagsPipe, private bugPriorityFilterPipe: BugPriorityFilterPipe,
        private resultFilterPipe: ResultFilterPipe, private workItemTypesFilterPipe: WorkItemTypesFilterPipe, private widgetService: WidgetService, private fb: FormBuilder,
        private softLabelPipe: SoftLabelPipe, private snackbar: MatSnackBar, private translateService: TranslateService,
        private userService: UserService, private goalsService: ProjectGoalsService, private featureService: MenuItemService, private route: ActivatedRoute, private routes: Router) {
        super();

        this.route.params.subscribe(routeParams => {
            if (this.routes.url.includes('projects'))
                this.projectId = routeParams.id;
        });
        this.getSoftLabelConfigurations();
        this.initializeFilters();
       
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(UserStoryActionTypes.GetUserStoryByIdCompleted),
                tap((data: any) => {
                    var index = this.workItemList.findIndex(x => x.userStoryId.toLowerCase() == data.userStory.userStoryId.toLowerCase());
                    this.workItemList[index] = data.userStory;
                    if (data.userStory.endTime == null && data.userStory.startTime == null) {
                        this.startedWorkItemList = [];
                        this.showWorkItem = true;
                    } else {
                        this.startedWorkItemList[0] = data.userStory;
                        this.showWorkItem = false;
                    }
                    this.cdRef.markForCheck();
                    this.cdRef.detectChanges();
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AdhocWorkActionTypes.GetAdhocWorkUserStoryByIdCompleted),
                tap((data: any) => {
                    var index = this.workItemList.findIndex(x => x.userStoryId.toLowerCase() == data.userStory.userStoryId.toLowerCase());
                    if (data.userStory.endTime == null && data.userStory.startTime == null) {
                        this.startedWorkItemList = [];
                        this.showWorkItem = true;
                    } else {
                        this.startedWorkItemList[0] = data.userStory;
                        this.showWorkItem = false;
                    }
                    this.workItemList[index] = data.userStory;
                    this.cdRef.markForCheck();
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintWorkItemActionTypes.GetSprintWorkItemByIdCompleted),
                tap((data: any) => {
                    var changedItem = data.SprintWorkItem;
                    if (changedItem != undefined) {
                        var index = this.workItemList.findIndex(x => x.userStoryId.toLowerCase() == changedItem.userStoryId.toLowerCase());
                        this.workItemList[index] = changedItem;
                        if (changedItem.endTime == null && changedItem.startTime == null) {
                            this.startedWorkItemList = [];
                            this.showWorkItem = true;
                        } else {
                            this.startedWorkItemList[0] = changedItem;
                            this.showWorkItem = false;
                        }
                    }
                    else {
                        this.showWorkItem = false;
                    }
                    this.cdRef.markForCheck();
                    this.cdRef.detectChanges();
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(UserStoryActionTypes.CreateUserStoryCompleted),
                tap((result: any) => {
                    if (result && result.userStoryId) {
                        let usId = result.userStoryId;
                        if (usId.data)
                            this.getWorkItemById(usId.data);
                    }
                })
            ).subscribe();

        this.initializeFilters();

        //if (this.routes.url.includes('/dashboard/myproductivity'))
          // {
          //      this.isMyProductivity=false; 
           // }
           
        
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabelConfigurations();
       
        
        if (!this.dashboardId || !this.Ids || this.isPopupShow) {
            if (this.isPopupShow ) {
                this.isIncludeUnAssigned = false;
                this.isExcludeOtherUs = false;
                this.loadWorkItems();
            }
            // else if (!this.dashboardId) {
            //     this.isIncludeUnAssigned = true;
            //     this.isExcludeOtherUs = true;
            //     this.loadWorkItems();
            // }
            else if (!this.dashboardId && !this.Ids)  {
                this.isIncludeUnAssigned = true;
                this.isExcludeOtherUs = true;
                this.loadWorkItems();
            }
        }
    
       // if(this.routes.url.includes('/dashboard/myproductivity'))
        //{
        //  this.isIncludeUnAssigned=true;
        //  this.isExcludeOtherUs=true;
        //  this.loadWorkItems();
       // }

        this.isPermissionForWorkItemApp = this.canAccess_feature_MyProjectWork;
        this.isPermissionForAdhocWorkItemApp = this.canAccess_feature_MyAdhocWork;
        // if (this.isPermissionForWorkItemApp || this.isPermissionForAdhocWorkItemApp) {
        this.initializeFilters();
        this.featureService.getAllPermittedEntityRoleFeaturesByUserId().subscribe((features: any) => {
            if (features.success == true) {
                localStorage.setItem(LocalStorageProperties.UserRoleFeatures, JSON.stringify(features.data));
                this.getRequiredData();
            }
        })
        // }
        this.anyOperationInProgressForAutoLogging$ = this.store.pipe(
            select(projectModuleReducers.insertAutoLogTimeLoading));
            
           // if (this.routes.url.includes('/dashboard/myproductivity')){
             //      this.isIncludeUnAssigned = true;
            //       this.isExcludeOtherUs = true;
             //      this.loadWorkItems();
            //    }
           

    }

    getLoggedInUser() {
        this.userService.getLoggedInUser().subscribe((responseData: any) => {
            this.loggedUser = responseData.data.id;
        })
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    getBranchList() {
        let branchSearchResult = new Branch();
        branchSearchResult.isArchived = false;
        this.featureService.getBranchList(branchSearchResult).subscribe((response: any) => {
            this.branchList = response.data;
            this.cdRef.markForCheck();
        });
    }

    getUserList() {
        let userModel = new UserModel();
        userModel.pageSize = 150;
        this.featureService.searchUsers(userModel).subscribe((response: any) => {
            this.userList = response.data;
            this.cdRef.markForCheck();
        });
    }

    loadGoals() {
        let searchGoals = new GoalSearchCriteriaApiInputModel();
        searchGoals.goalName = 'Compliance Action';
        if (!this.notFromAudits && this.notFromAuditActions)
            searchGoals.projectId = this.projectId;
        this.goalsService.searchGoals(searchGoals).subscribe((response: any) => {
            if (response.success) {
                if (response.data && response.data.length > 0) {
                    this.goal = response.data[0];
                    this.cdRef.detectChanges();
                }
                else {
                    this.goal = null;
                    this.cdRef.detectChanges();
                }
            }
            else {
                this.goal = null;
                this.cdRef.detectChanges();
            }
        });
    }

    getActionCategories() {
        let category = new ActionCategory();
        category.isArchived = false;
        this.goalsService.getActionCategories(category).subscribe((result: any) => {
            if (result.success && result.data && result.data.length > 0) {
                this.actionCategories = result.data;
                this.cdRef.detectChanges();
            }
            else {
                this.actionCategories = [];
                this.cdRef.markForCheck();
            }
        })
    }

    searchWorkItems(event, text) {
        if (event.keyCode == 13) {
            this.pageNumber = 1;
            this.pageIndex = 0;
            this.pageSize = 25;
            this.searchText = (text != null) ? text.trim() : null;
            this.loadWorkItems();
            this.workspaceFilterModel.searchText = text;
            this.workspaceFilterModel.isExcludeOtherUs = this.isExcludeOtherUs;
            if (!this.isPopupShow && (this.dashboardId != null || this.dashboardId != undefined) && this.notFromAudits) {
                this.updateWorkspaceDashboardFilters();
            }
            // this.updateWorkspaceDashboardFilters();
        }
    }


    checkIsSprintUserstory(userStory) {
        if (userStory.isSprintUserStory == true) {
            return true;
        } else {
            return false;
        }
    }

    LogAction(event) {
        event.userStoryLogTime.parentUserStoryId = null;

        this.showWorkItem = false;
        if (event.userStoryLogTime.endTime != undefined) {
            this.showWorkItem = true;
        }
        if (!event.userStoryLogTime.endTime) {
            var userStory = this.workItemList.find(obj => { return (obj.startTime != null || obj.startTime != undefined) && !obj.endTime });
            if (!userStory) { userStory = this.findSubUserstoryTime(); }
            if (userStory && (event.userStoryLogTime.userStoryId != userStory.userStoryId)) {
                var userStoryLogTime = new UserStoryLogTimeModel();
                userStoryLogTime.userStoryId = userStory.userStoryId;
                userStoryLogTime.startTime = userStory.startTime;
                userStoryLogTime.endTime = new Date();
                userStoryLogTime.parentUserStoryId = null;
                userStoryLogTime.isFromSprint = userStory.isFromSprints;
                userStoryLogTime.isFromAdhoc = userStory.isAdhocUserStory;
                this.store.dispatch(new InsertAutoLogTimeTriggered(userStoryLogTime));
            }
        }
        this.store.dispatch(new InsertAutoLogTimeTriggered(event.userStoryLogTime));
    }


    getTeamLeadsList() {
        this.userService.getTeamLeadsList().subscribe((responseData: any) => {
            this.teamMembers = responseData.data;
            //this.getCompanyDetails(this.loggedUserDetails.companyId);
        });
    }

    findSubUserstoryTime() {
        var susy;
        this.workItemList.forEach((us) => {
            if (us.subUserStoriesList) {
                return us.subUserStoriesList.forEach((sus) => {
                    if (sus.startTime && (sus.startTime != null || sus.startTime != undefined) && !sus.endTime) {
                        susy = sus;
                    }
                });
            }
        });
        return susy;
    }

    searchWorkItemsByTags(event, text) {
        if (event.keyCode == 13) {
            this.pageNumber = 1;
            this.pageIndex = 0;
            this.pageSize = 25;
            this.searchTags = (text != null) ? text.trim() : null;
            this.loadWorkItems();
            this.workspaceFilterModel.tagSearchText = text;
            this.workspaceFilterModel.isExcludeOtherUs = this.isExcludeOtherUs;
            if (!this.isPopupShow && (this.dashboardId != null || this.dashboardId != undefined) && this.notFromAudits) {
                this.updateWorkspaceDashboardFilters();
            }
            //this.updateWorkspaceDashboardFilters();
        }
    }

    changeAssignee(value) {
        this.workspaceFilterModel.isIncludeUnAssigned = this.isIncludeUnAssigned;
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.pageSize = 25;
        this.workspaceFilterModel.isExcludeOtherUs = this.isExcludeOtherUs;
        if (!this.isPopupShow && (this.dashboardId != null || this.dashboardId != undefined) && this.notFromAudits) {
            this.updateWorkspaceDashboardFilters();
        }
        this.loadWorkItems();
    }

    excludeOtherUS() {
        this.workspaceFilterModel.isExcludeOtherUs = this.isExcludeOtherUs;
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.pageSize = 25;
        if (!this.isPopupShow && (this.dashboardId != null || this.dashboardId != undefined) && this.notFromAudits) {
            this.updateWorkspaceDashboardFilters();
        }
        //this.updateWorkspaceDashboardFilters();
        this.loadWorkItems();
    }

    loadWorkItems() {
        this.anyOperationInProgress = true;
        let workItemModel = new UserStory();
        workItemModel.searchText = this.searchText;
        workItemModel.tags = this.searchTags;
        workItemModel.userStoryStatusIds = this.selectedUserStoryStatusId;
        workItemModel.userStoryTypeIds = this.selectedUserStoryTypeIds;
        workItemModel.bugPriorityIds = this.selectedBugPriorityId;
        workItemModel.userIds = !this.notFromAudits ? this.selectedUserIds : this.teamList;
        workItemModel.branchIds = this.selectedBranchIds;
        workItemModel.actionCategoryIds = this.selectedActionCategoryIds;
        workItemModel.businessUnitIds = this.selectedBusinessUnitIds;
        workItemModel.isAction = !this.notFromAudits;
        workItemModel.isUserActions = !this.notFromAuditActions;
        workItemModel.isExcludeOtherUs = this.isExcludeOtherUs;
        workItemModel.isIncludeUnAssigned = this.isIncludeUnAssigned;
        workItemModel.isArchived = false;
        workItemModel.pageSize = this.pageSize;
        workItemModel.pageNumber = this.pageNumber;
        workItemModel.projectId = this.dashboardFilters ? this.dashboardFilters.projectId : null;
        workItemModel.auditId = this.dashboardFilters ? this.dashboardFilters.auditId : null;
        if (this.Ids) {
            workItemModel.userStoryIds = this.Ids;
        }
        if (!this.isExcludeOtherUs && !this.routes.url.includes('/projects/')) {
            workItemModel.workspaceDashboardId = this.dashboardId;
        }
        if (!this.notFromAuditActions) {
            workItemModel.isExcludeOtherUs = true;
            workItemModel.isIncludeUnAssigned = true;
        }
        if (!this.notFromAudits && this.notFromAuditActions) {
            workItemModel.projectId = this.projectId;
        }
        workItemModel.isMyWork = this.isMyWork;
        this.projectService.searchAllWorkItems(workItemModel).subscribe((result: any) => {
            if (result.success) {
                if (result.data && result.data.length > 0) {
                    this.workItemList = result.data;
                    if (this.pageNumber == 1) {
                        this.startedWorkItemList = [];
                        this.startedWorkItemList.push(result.data[0]);
                        if (this.startedWorkItemList[0].endTime == null && this.startedWorkItemList[0].startTime != null) {
                            this.showWorkItem = false;
                        }
                        else {
                            this.showWorkItem = true;
                            this.startedWorkItemList = [];
                            // this.workItemListCount = this.workItemList[0].totalCount;
                        }
                    }
                    this.workItemListCount = this.workItemList[0].totalCount;

                    this.filter();
                    if (this.workItemList[0].isAutoLog == true) {
                        this.isShowText = true;
                    }
                    else
                        this.isShowText = false;
                }
                else {
                    this.startedWorkItemList = [];
                    this.showWorkItem = true;
                    this.workItemList = [];
                    this.workItemListCount = 0;
                    this.filter();
                }
                this.anyOperationInProgress = false;
                this.setAppHeight(this.view, this.viewSelector);
                this.cdRef.markForCheck();
            }
            else {
                this.anyOperationInProgress = false;
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.showWorkItem = true;

            }
            // this.startedWorkitem();
        });

    }



    getWorkItemById(userStoryId) {
        let workItemModel = new UserStory();
        workItemModel.userStoryId = userStoryId;
        workItemModel.isAction = !this.notFromAudits;
        workItemModel.isUserActions = !this.notFromAuditActions;
        workItemModel.isArchived = false;
        if (this.Ids && this.Ids != '00000000-0000-0000-0000-000000000000' && this.Ids.length > 0) {
            workItemModel.isSameUser = false;
        }
        if (!this.notFromAuditActions) {
            workItemModel.isExcludeOtherUs = true;
            workItemModel.isIncludeUnAssigned = true;
        }
        workItemModel.isMyWork = this.isMyWork;
        this.projectService.searchAllWorkItems(workItemModel).subscribe((result: any) => {
            if (result.success) {
                if (result.data && result.data.length > 0) {
                    let workItem = result.data[0];
                    let index = this.workItemList.findIndex(x => x.userStoryId.toLowerCase() == userStoryId.toLowerCase());
                    if (index != -1 && workItem) {
                        this.workItemList.splice(index, 1, workItem);
                        this.filter();
                        this.cdRef.markForCheck();
                    }
                }
                else {
                    this.getRemoveUserStory(userStoryId);
                }
            }
            else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
        });
    }

    getRemoveUserStory(value) {
        if (value) {
            let index = this.workItemList.findIndex(x => x.userStoryId.toLowerCase() == value.toLowerCase());
            if (index != -1) {
                this.workItemList.splice(index, 1);
                this.workItemListCount = this.workItemListCount - 1;
                this.filter();
                this.cdRef.markForCheck();
            }
            //this.auditStore.dispatch(new LoadAuditRelatedCountsTriggered());
        }
    }

    getMyWorkItems(pageEvent) {
        if (pageEvent.pageSize != this.pageSize) {
            this.pageNumber = 1;
            this.pageIndex = 0;
        }
        else {
            this.pageNumber = pageEvent.pageIndex + 1;
            this.pageIndex = pageEvent.pageIndex;
        }
        this.pageSize = pageEvent.pageSize;
        this.workspaceFilterModel.pageSize = this.pageSize;
        this.workspaceFilterModel.pageNumber = this.pageNumber;
        this.workspaceFilterModel.isExcludeOtherUs = this.isExcludeOtherUs;
        if (!this.isPopupShow && (this.dashboardId != null || this.dashboardId != undefined) && this.notFromAudits) {
            this.updateWorkspaceDashboardFilters();
        }
        //this.updateWorkspaceDashboardFilters();
        this.loadWorkItems();
    }

    adhocCreation(value) {
        if (value) {
            let workItemModel = new UserStory();
            workItemModel.userStoryId = value;
            workItemModel.isArchived = false;
            workItemModel.isIncludeUnAssigned = this.isIncludeUnAssigned;
            workItemModel.isMyWork = this.isMyWork;
            this.projectService.searchAllWorkItems(workItemModel).subscribe((result: any) => {
                if (result.success) {
                    if (result.data && result.data.length > 0) {
                        let workItem = result.data[0];
                        if (workItem != undefined && workItem != null) {
                            this.workItemList.push(workItem);
                            this.workItemListCount = this.workItemListCount + 1;
                            this.adhocProgress = false;
                            this.filter();
                            this.cdRef.markForCheck();
                        }
                        else {
                            this.adhocProgress = false;
                            this.cdRef.detectChanges();
                        }
                    }
                    else {
                        this.adhocProgress = false;
                        this.cdRef.detectChanges();
                    }
                }
                else {
                    this.validationMessage = result.apiResponseMessages[0].message;
                    this.toastr.error(this.validationMessage);
                    this.adhocProgress = false;
                    this.cdRef.markForCheck();
                }
            });
        }
    }

    getAdhocProgress(value) {
        this.adhocProgress = value;
        this.cdRef.detectChanges();
    }

    highLightSelectedUserStory(userStoryId) {
        if (this.selectedUserStoryId === userStoryId) {
            return true;
        }
        else {
            return false;
        }
    }

    selectedUserStory(event) {
        this.selectedUserStoryId = event.userStory.userStoryId;
        this.cdRef.markForCheck();
    }

    getOpenUniquePage(event) {
        this.selectedUserStoryId = event.userStory.userStoryId;
        let dialogId = "unique-userstory-dialog";
        const dialogRef = this.dialog.open(this.uniqueUserstoryDialog, {
            height: "90vh",
            width: "70%",
            direction: 'ltr',
            id: dialogId,
            data: { userStory: event.userStory, notFromAudits: this.notFromAudits, dialogId: dialogId, isUniqueFromProjects: event.isUniqueFromProjects },
            disableClose: true,
            panelClass: 'userstory-dialog-scroll'
        });
        dialogRef.afterClosed().subscribe((result: any) => {
            if (result.redirection) {
                this.closePopUp.emit(true);
            }
            if (result.success == 'yes') {
                this.getRemoveUserStory(this.selectedUserStoryId);
            }
            else if (result.success == 'no') {
                this.getWorkItemById(this.selectedUserStoryId);
            }
            else {
                this.getWorkItemById(this.selectedUserStoryId);
            }
        });
        // this.cdRef.markForCheck();
    }

    selectedAdhocUserStory(userStory) {
        let dialogId = "adhoc-userstory-detail-dialog";
        const dialogRef = this.dialog.open(this.adhocUserstoryDetailDialog, {
            height: "70%",
            width: "80%",
            direction: 'ltr',
            id: dialogId,
            data: { userStory: userStory, dialogId: dialogId },
            disableClose: true,
            panelClass: 'userstory-dialog-scroll'
        });
        dialogRef.afterClosed().subscribe((result: any) => {
            if (result.success) {
                this.getWorkItemById(userStory.userStoryId);
            }
        });
    }

    openCalanderView() {
        this.calanderView = !this.calanderView;
        this.userBoardView = false;
        this.kanbanView = false;
        this.workspaceFilterModel.isExcludeOtherUs = this.isExcludeOtherUs;
        if (!this.isPopupShow && (this.dashboardId != null || this.dashboardId != undefined) && this.notFromAudits) {
            this.updateWorkspaceDashboardFilters();
        }
    }

    openKanbanView() {
        if (this.goal) {
            let searchModel = new UserStorySearchCriteriaInputModel();
            searchModel = Object.assign({}, this.goal);
            searchModel.refreshUserStoriesCall = true;
            searchModel.isGoalsPage = true;
            searchModel.isAction = true;
            searchModel.isArchived = false;
            searchModel.isUserStoryArchived = false;
            searchModel.isUserStoryParked = false;
            this.userStorySearchCriteria = searchModel;
            this.cdRef.markForCheck();
        }
        this.kanbanView = !this.kanbanView;
        this.userBoardView = false;
        this.calanderView = false;
        if (this.kanbanView == false)
            this.loadWorkItems();
        this.cdRef.markForCheck();
    }

    openUserTaskBoardView() {
        this.userBoardView = !this.userBoardView;
        this.workspaceFilterModel.isUserBoardView = this.userBoardView;
        this.calanderView = false;
        this.kanbanView = false;
        this.workspaceFilterModel.isExcludeOtherUs = this.isExcludeOtherUs;
        if (!this.isPopupShow && this.dashboardId && this.notFromAudits) {
            this.updateWorkspaceDashboardFilters();
        }
        // this.updateWorkspaceDashboardFilters();
    }

    getRequiredData() {
        this.store.dispatch(new LoadUserStoryStatusTriggered());
        this.workflowStatus$ = this.store.pipe(select(projectModuleReducers.getUserStoryStatusAll));
        this.workflowStatus$.subscribe((s) => {
            this.workflowStatusList = s;
            this.setPersistanceValues();
        });

        let userStoryTypesModel = new UserStoryTypesModel();
        userStoryTypesModel.isArchived = false;
        this.store.dispatch(new LoadUserStoryTypesTriggered(userStoryTypesModel));
        this.userStoryTypes$ = this.store.pipe(select(projectModuleReducers.getUserStoryTypesAll));
        this.userStoryTypes$.subscribe((s) => {
            this.userStoryTypes = s;
            this.setPersistanceValues();
        });

        this.store.dispatch(new LoadBugPriorityTypesTriggered());
        this.bugPriorities$ = this.store.pipe(select(projectModuleReducers.getBugPriorityAll));
        this.bugPriorities$.subscribe((s) => {
            this.bugPriorities = s;
            this.setPersistanceValues();
        });
    }

    getUserStorieslistByUserStoryStatus() {
        const userStoryStatus = this.selectUserStoryStatus.value.userStoryStatus;
        const index = userStoryStatus.indexOf(0);
        if (index > -1) {
            userStoryStatus.splice(index, 1);
        }
        this.selectedUserStoryStatusId = userStoryStatus.toString();
        let workflowStatusList = this.workflowStatusList;
        const workflowStatus = _.filter(workflowStatusList, function (status) {
            return userStoryStatus.toString().includes(status.userStoryStatusId);
        })
        const workflowStatusNames = workflowStatus.map((x) => x.userStoryStatusName);
        this.selectedWorkflowStatus = workflowStatusNames.toString();
        this.workspaceFilterModel.workItemStatuses = this.selectedUserStoryStatusId;
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.pageSize = 25;
        this.workspaceFilterModel.isExcludeOtherUs = this.isExcludeOtherUs;
        this.loadWorkItems();
        if (!this.isPopupShow && (this.dashboardId != null || this.dashboardId != undefined) && this.notFromAudits) {
            this.updateWorkspaceDashboardFilters();
        }
        //this.updateWorkspaceDashboardFilters();
        this.cdRef.markForCheck();
    }

    toggleAllUserStoryStatusSelection() {
        if (this.allUserStoryStatusSelected.selected) {
            this.selectUserStoryStatus.controls.userStoryStatus.patchValue([
                ...this.workflowStatusList.map((item) => item.userStoryStatusId),
                0
            ]);
        } else {
            this.selectUserStoryStatus.controls.userStoryStatus.patchValue([]);
        }
        this.getUserStorieslistByUserStoryStatus();
    }

    toggleUserStoryStatusPerOne() {
        if (this.allUserStoryStatusSelected.selected) {
            this.allUserStoryStatusSelected.deselect();
            return false;
        }
        if (this.selectUserStoryStatus.controls.userStoryStatus.value.length === this.workflowStatusList.length) {
            this.allUserStoryStatusSelected.select();
        }
    }

    getUserStorieslistByUserStoryTypes() {
        const selectedTypes = this.selectUserStoryTypeForm.value.userStoryTypeId;
        const index = selectedTypes.indexOf(0);
        if (index > -1) {
            selectedTypes.splice(index, 1);
        }
        this.selectedUserStoryTypeIds = selectedTypes.toString();
        let bugPriorities = this.userStoryTypes;
        const userStoryTypeList = _.filter(bugPriorities, function (priority) {
            return selectedTypes.toString().includes(priority.userStoryTypeId);
        })
        let bugPriorityNames = userStoryTypeList.map((x) => x.userStoryTypeName);
        this.selectedUserStoryType = bugPriorityNames.toString();
        this.workspaceFilterModel.workItemTypes = this.selectedUserStoryTypeIds;
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.pageSize = 25;
        this.workspaceFilterModel.isExcludeOtherUs = this.isExcludeOtherUs;
        this.loadWorkItems();
        if (!this.isPopupShow && (this.dashboardId != null || this.dashboardId != undefined) && this.notFromAudits) {
            this.updateWorkspaceDashboardFilters();
        }
        //this.updateWorkspaceDashboardFilters();
        this.cdRef.markForCheck();
    }

    toggleAllUserStoryTypesSelection() {
        if (this.allUserStoryTypesSelected.selected) {
            this.selectUserStoryTypeForm.controls.userStoryTypeId.patchValue([
                ...this.userStoryTypes.map((item) => item.userStoryTypeId),
                0
            ]);
        }
        else {
            this.selectUserStoryTypeForm.controls.userStoryTypeId.patchValue([]);
        }
        this.getUserStorieslistByUserStoryTypes();
    }

    toggleUsrStoryTypesSelectionPerOne() {
        if (this.allUserStoryTypesSelected.selected) {
            this.allUserStoryTypesSelected.deselect();
            return false;
        }
        if (this.selectUserStoryTypeForm.controls.userStoryTypeId.value.length === this.userStoryTypes.length) {
            this.allUserStoryTypesSelected.select();
        }
    }

    getUserStorieslistByBugPriorities() {
        const bugPriority = this.selectBugPriority.value.bugPriority;
        const index = bugPriority.indexOf(0);
        if (index > -1) {
            bugPriority.splice(index, 1);
        }
        this.selectedBugPriorityId = bugPriority.toString();
        let bugPriorities = this.bugPriorities;
        const bugPriorityList = _.filter(bugPriorities, function (priority) {
            return bugPriority.toString().includes(priority.bugPriorityId);
        })
        let bugPriorityNames = bugPriorityList.map((x) => x.description);
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.pageSize = 25;
        this.loadWorkItems();
        this.selectedBugPriority = bugPriorityNames.toString();
        this.workspaceFilterModel.bugPriorities = this.selectedBugPriorityId;
        this.workspaceFilterModel.isExcludeOtherUs = this.isExcludeOtherUs;
        if (!this.isPopupShow && (this.dashboardId != null || this.dashboardId != undefined) && this.notFromAudits) {
            this.updateWorkspaceDashboardFilters();
        }

    }

    toggleAllBugPrioritySelection() {
        if (this.allSelected.selected) {
            this.selectBugPriority.controls.bugPriority.patchValue([
                ...this.bugPriorities.map((item) => item.bugPriorityId),
                0
            ]);
        }
        else {
            this.selectBugPriority.controls.bugPriority.patchValue([]);
        }
        this.getUserStorieslistByBugPriorities();
    }


    getTeamLeadId() {
        let teamLeadId = this.selectTeamMemberId.value.teamMemberId;
        if (teamLeadId.length === 0) {
            this.teamLeadId = 'reset';
        }
        let index = teamLeadId.indexOf(0);
        if (index > -1) {
            teamLeadId.splice(index, 1);
            this.teamLeadId = teamLeadId.toString();
        }
        else {
            this.teamLeadId = teamLeadId.toString();
        }
        if (teamLeadId === "0") {
            this.teamLeadId = 'reset';
        } else {

            if (!this.teamLeadId) {
                this.teamLeadId = 'reset';
            }
        }
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.pageSize = 25;
        this.teamList = this.teamMemberId;

    }

    clearTeamMembersForm() {
        this.selectTeamMemberId = this.fb.group({
            teamMemberId: new FormControl(this.selectTeamMemberId)
        });
    }

    toggleAllTeamMembersSelection() {
        if (this.allTeamMembersSelected.selected) {
            this.selectTeamMemberId.controls.teamMemberId.patchValue([
                ...this.teamMembers.map(item => item.teamMemberId),
                0
            ]);

        } else {
            this.selectTeamMemberId.controls.teamMemberId.patchValue([]);
        }

        this.getTeamLeadId();
    }

    toggleTeamMembersStatusPerOne(all) {
        if (this.allTeamMembersSelected.selected) {
            this.allTeamMembersSelected.deselect();
            return false;
        }
        if (
            this.selectTeamMemberId.controls.teamMemberId.value.length ===
            this.teamMembers.length
        ) {
            this.allTeamMembersSelected.select();
        }
    }

    toggleBugPrioritySelectionPerOne() {
        if (this.allSelected.selected) {
            this.allSelected.deselect();
            return false;
        }
        if (this.selectBugPriority.controls.bugPriority.value.length === this.bugPriorities.length) {
            this.allSelected.select();
        }
    }

    setColorForBugPriorityTypes(color) {
        const styles = {
            "color": color
        };
        return styles;
    }

    getUserStorieslistByUser() {
        const selectedTypes = this.selectUser.value.userId;
        const index = selectedTypes.indexOf(0);
        if (index > -1) {
            selectedTypes.splice(index, 1);
        }
        this.selectedUserIds = selectedTypes.toString();
        let users = this.userList;
        const userList = _.filter(users, function (user) {
            return selectedTypes.toString().includes(user.id);
        })
        let userNames = userList.map((x) => x.fullName);
        this.selectedUser = userNames.toString();
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.pageSize = 25;
        this.loadWorkItems();
        this.cdRef.markForCheck();
    }

    toggleAllUserSelection() {
        if (this.allUserSelected.selected) {
            this.selectUser.controls.userId.patchValue([
                ...this.userList.map((item) => item.id),
                0
            ]);
        }
        else {
            this.selectUser.controls.userId.patchValue([]);
        }
        this.getUserStorieslistByUser();
    }

    toggleUserSelectionPerOne() {
        if (this.allUserSelected.selected) {
            this.allUserSelected.deselect();
            return false;
        }
        if (this.selectUser.controls.userId.value.length === this.userList.length) {
            this.allUserSelected.select();
        }
    }

    getUserStorieslistByBranch() {
        const selectedTypes = this.selectBranch.value.branchId;
        const index = selectedTypes.indexOf(0);
        if (index > -1) {
            selectedTypes.splice(index, 1);
        }
        this.selectedBranchIds = selectedTypes.toString();
        let branches = this.branchList;
        const branchList = _.filter(branches, function (branch) {
            return selectedTypes.toString().includes(branch.branchId);
        })
        let branchNames = branchList.map((x) => x.branchName);
        this.selectedBranch = branchNames.toString();
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.pageSize = 25;
        this.loadWorkItems();
        this.cdRef.markForCheck();
    }

    toggleAllBranchSelection() {
        if (this.allBranchSelected.selected) {
            this.selectBranch.controls.branchId.patchValue([
                ...this.branchList.map((item) => item.branchId),
                0
            ]);
        }
        else {
            this.selectBranch.controls.branchId.patchValue([]);
        }
        this.getUserStorieslistByBranch();
    }

    toggleBranchSelectionPerOne() {
        if (this.allBranchSelected.selected) {
            this.allBranchSelected.deselect();
            return false;
        }
        if (this.selectBranch.controls.branchId.value.length === this.branchList.length) {
            this.allBranchSelected.select();
        }
    }

    getUserStorieslistByActionCategory() {
        const selectedTypes = this.selectActionCategory.value.actionCategoryId;
        const index = selectedTypes.indexOf(0);
        if (index > -1) {
            selectedTypes.splice(index, 1);
        }
        this.selectedActionCategoryIds = selectedTypes.toString();
        let categories = this.actionCategories;
        const actionCategories = _.filter(categories, function (category) {
            return selectedTypes.toString().includes(category.actionCategoryId);
        })
        let catgeoryNames = actionCategories.map((x) => x.actionCategoryName);
        this.selectedActionCategory = catgeoryNames.toString();
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.pageSize = 25;
        this.loadWorkItems();
        this.cdRef.markForCheck();
    }

    toggleAllActionCategorySelection() {
        if (this.allActionCategorySelected.selected) {
            this.selectActionCategory.controls.actionCategoryId.patchValue([
                ...this.actionCategories.map((item) => item.actionCategoryId),
                0
            ]);
        }
        else {
            this.selectActionCategory.controls.actionCategoryId.patchValue([]);
        }
        this.getUserStorieslistByActionCategory();
    }

    toggleActionCategorySelectionPerOne() {
        if (this.allActionCategorySelected.selected) {
            this.allActionCategorySelected.deselect();
            return false;
        }
        if (this.selectActionCategory.controls.actionCategoryId.value.length === this.actionCategories.length) {
            this.allActionCategorySelected.select();
        }
    }

    initializeFilters() {
        this.selectUserStoryStatus = this.formBuilder.group({ userStoryStatus: new FormControl("") });
        this.selectBugPriority = this.formBuilder.group({ bugPriority: new FormControl("") });
        this.selectTeamMemberId = this.formBuilder.group({ teamMemberId: new FormControl("") });
        this.selectUserStoryTypeForm = this.formBuilder.group({ userStoryTypeId: new FormControl("", []) });
        this.selectUser = this.formBuilder.group({ userId: new FormControl("", []) });
        this.selectBranch = this.formBuilder.group({ branchId: new FormControl("", []) });
        this.selectActionCategory = this.formBuilder.group({ actionCategoryId: new FormControl("", []) });
        this.selectBusinessUnitForm = this.formBuilder.group({ businessUnitIds: new FormControl("", []) });
    }

    closeSearch() {
        this.searchText = '';
        this.workspaceFilterModel.searchText = '';
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.pageSize = 25;
        this.workspaceFilterModel.isExcludeOtherUs = this.isExcludeOtherUs;
        this.loadWorkItems();
        if (!this.isPopupShow && (this.dashboardId != null || this.dashboardId != undefined) && this.notFromAudits) {
            this.updateWorkspaceDashboardFilters();
        }
    }

    closeUserStoryTags() {
        this.searchTags = "";
        this.workspaceFilterModel.tagSearchText = this.searchTags;
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.pageSize = 25;
        this.workspaceFilterModel.isExcludeOtherUs = this.isExcludeOtherUs;
        this.loadWorkItems();
        if (!this.isPopupShow && (this.dashboardId != null || this.dashboardId != undefined) && this.notFromAudits) {
            this.updateWorkspaceDashboardFilters();
        }
    }

    filter() {
        this.filteredWorkItemList = null;
        this.cdRef.detectChanges();
        this.filteredWorkItemList = this.workItemList;
        this.cdRef.detectChanges();
    }

    resetAllFilters() {
        this.calanderView = false;
        this.userBoardView = false;
        this.kanbanView = false;
        this.filteredWorkItemList = this.workItemList;
        this.selectUserStoryStatus.reset();
        this.selectUserStoryTypeForm.reset();
        this.selectBugPriority.reset();
        this.selectUser.reset();
        this.selectBranch.reset();
        this.selectActionCategory.reset();
        this.searchText = null;
        this.searchTags = null;
        this.selectedUserStoryStatusId = null;
        this.selectedUserStoryTypeIds = null;
        this.selectedUserIds = null;
        this.selectedBranchIds = null;
        this.selectedBranch = null;
        this.selectedActionCategoryIds = null;
        this.selectedActionCategory = null;
        this.selectedUser = null;
        this.selectedBugPriorityId = null;
        this.selectedBugPriority = null;
        this.selectedTeamLead = null;
        this.selectedUserStoryType = null;
        this.selectedWorkflowStatus = null;
        this.workspaceFilterModel = new WorkspaceDashboardFilterDropdown();

       // if((this.dashboardId && this.dashboardId.length>0) && !this.routes.url.includes('/dashboard/myproductivity'))
       // {
        //    this.isIncludeUnAssigned=false;
      //      this.isExcludeOtherUs=false; 
     //   }

       // else if((!this.dashboardId && !(this.dashboardId.length>0)) || this.routes.url.includes('/dashboard/myproductivity'))
       // {
       //     this.isIncludeUnAssigned=true;
      //      this.isExcludeOtherUs=true; 
      //  }


      //if(this.routes.url.includes('/dashboard/myproductivity'))
     // {
       // this.isIncludeUnAssigned=true;
       // this.isExcludeOtherUs=true;
     // }
      //else{
        this.isIncludeUnAssigned = (this.dashboardId && this.dashboardId.length > 0)  ? false : true;
        this.isExcludeOtherUs = (this.dashboardId && this.dashboardId.length > 0)  ? false : true;
     // }

        this.pageNumber = 1;
        this.pageIndex = 0;
        this.pageSize = 25;
        this.loadWorkItems();
        if (!this.isPopupShow && (this.dashboardId != null || this.dashboardId != undefined) && this.notFromAudits) {
            this.updateWorkspaceDashboardFilters();
        }
        // this.updateWorkspaceDashboardFilters();
        this.cdRef.markForCheck();
    }

    editAppName() {
        this.isEditAppName = true;
        this.changedAppName = this.dashboardName;
    }

    keyUpFunction(event) {
        if (event.keyCode == 13) {
            this.updateAppName();
        }
    }

    updateAppName() {
        if (this.changedAppName) {
            const dashBoardModel = new Dashboard();
            dashBoardModel.dashboardId = this.dashboardId;
            dashBoardModel.dashboardName = this.changedAppName;
            this.widgetService.updateDashboardName(dashBoardModel)
                .subscribe((responseData: any) => {
                    const success = responseData.success;
                    if (success) {
                        this.snackbar.open("App name updated successfully", this.translateService.instant(ConstantVariables.success), { duration: 3000 });
                        this.dashboardName = JSON.parse(JSON.stringify(this.changedAppName));
                        this.changedAppName = '';
                        this.isEditAppName = false;
                        this.cdRef.detectChanges();
                    } else {
                        this.validationMessage = responseData.apiResponseMessages[0].message;
                        this.toastr.warning("", this.validationMessage);
                    }
                });
        } else {
            const message = this.softLabelPipe.transform("Please enter app name", this.softLabels);
            this.toastr.warning("", message);
        }
    }

    schedulerViewChanged(event) {
        // console.log(event);
        this.workspaceFilterModel.schedulerViewIndex = event;
        this.workspaceFilterModel.isExcludeOtherUs = this.isExcludeOtherUs;
        if (!this.isPopupShow && (this.dashboardId != null || this.dashboardId != undefined) && this.notFromAudits) {
            this.updateWorkspaceDashboardFilters();
        }
        // this.updateWorkspaceDashboardFilters();
    }

    updateWorkspaceDashboardFilters() {
        this.updatePersistanceInprogress = true;
        let workspaceDashboardFilterModel = new WorkspaceDashboardFilterModel();
        workspaceDashboardFilterModel.isCalenderView = this.calanderView;
        workspaceDashboardFilterModel.workspaceDashboardId = this.dashboardId;
        workspaceDashboardFilterModel.workspaceDashboardFilterId = this.workspaceDashboardFilterId;
        workspaceDashboardFilterModel.filterJson = JSON.stringify(this.workspaceFilterModel);
        this.widgetService.updateworkspaceDashboardFilter(workspaceDashboardFilterModel)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    this.workspaceDashboardFilterId = responseData.data;

                    this.updatePersistanceInprogress = false;
                    this.setAppHeight(this.view, this.viewSelector);
                    this.cdRef.detectChanges();
                } else {
                    this.validationMessage = responseData.apiResponseMessages[0].message;
                    this.toastr.warning("", this.validationMessage);
                    this.updatePersistanceInprogress = false;
                    this.cdRef.markForCheck();
                }
            });
    }

    getWorkspaceDashboardsFilter() {
        this.anyOperationInProgress = true;
        let workspaceDashboardFilterModel = new WorkspaceDashboardFilterModel();
        workspaceDashboardFilterModel.workspaceDashboardId = this.dashboardId;
        this.widgetService.getWorkspaceDashboardFilter(workspaceDashboardFilterModel)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    if (responseData.data && responseData.data.length > 0) {
                        let dashboardFilters = responseData.data[0];
                        this.workspaceDashboardFilterId = dashboardFilters.workspaceDashboardFilterId;
                        this.calanderView = dashboardFilters.isCalenderView;
                        let filters = JSON.parse(dashboardFilters.filterJson);
                        this.workspaceFilterModel = filters;
                        this.searchText = filters.searchText;
                        this.searchTags = filters.tagSearchText;
                        this.pageSize = (filters.pageSize == undefined || filters.pageSize == null) ? 25 : filters.pageSize;
                        this.pageNumber = (filters.pageNumber == undefined || filters.pageNumber == null) ? 1 : filters.pageNumber;
                        this.userBoardView = filters.isUserBoardView;
                        this.pageIndex = this.pageNumber - 1;
                        this.selectedViewTypeIndex = filters.schedulerViewIndex;
                        if (filters.bugPriorities && filters.bugPriorities.length > 0)
                            this.selectBugPriority.get('bugPriority').setValue(filters.bugPriorities.split(','));
                        if (filters.workItemTypes && filters.workItemTypes.length > 0)
                            this.selectUserStoryTypeForm.get('userStoryTypeId').setValue(filters.workItemTypes.split(','));
                        if (filters.workItemStatuses && filters.workItemStatuses.length > 0)
                            this.selectUserStoryStatus.get('userStoryStatus').setValue(filters.workItemStatuses.split(','));
                        this.selectedUserStoryStatusId = filters.workItemStatuses;
                        this.selectedUserStoryTypeIds = filters.workItemTypes;
                        this.selectedBugPriorityId = filters.bugPriorities;
                        this.isIncludeUnAssigned = (filters.isIncludeUnAssigned == undefined || filters.isIncludeUnAssigned == null) ? false : filters.isIncludeUnAssigned;
                        this.isExcludeOtherUs = (filters.isExcludeOtherUs == undefined || filters.isExcludeOtherUs == null) ? false : filters.isExcludeOtherUs;
                        this.loadWorkItems();
                        this.setPersistanceValues();
                        this.cdRef.detectChanges();
                    }
                    else {
                        this.isIncludeUnAssigned = false;
                        this.isExcludeOtherUs = false;
                        this.cdRef.markForCheck();
                        this.loadWorkItems();
                    }
                } else {
                    this.isIncludeUnAssigned = false;
                    this.isExcludeOtherUs = false;
                    this.cdRef.markForCheck();
                    this.loadWorkItems();
                    this.validationMessage = responseData.apiResponseMessages[0].message;
                    this.toastr.warning("", this.validationMessage);
                }
            });
    }

    setPersistanceValues() {
        //User story statuses
        let statusId = this.selectUserStoryStatus.value.userStoryStatus.toString();
        this.selectedUserStoryStatusId = statusId;
        let workflowStatusList = this.workflowStatusList;
        const workflowStatus = _.filter(workflowStatusList, function (status) {
            return statusId.includes(status.userStoryStatusId);
        })
        const workflowStatusNames = workflowStatus.map((x) => x.userStoryStatusName);
        this.selectedWorkflowStatus = workflowStatusNames.toString();
        this.workspaceFilterModel.workItemStatuses = this.selectedUserStoryStatusId;

        //Userstory types
        let selectedUserStoryTypes = this.selectUserStoryTypeForm.value.userStoryTypeId.toString();
        this.selectedUserStoryTypeIds = selectedUserStoryTypes;
        let userStoryTypes = this.userStoryTypes;
        const userStoryTypeList = _.filter(userStoryTypes, function (priority) {
            return selectedUserStoryTypes.includes(priority.userStoryTypeId);
        })
        let userStoryTypeNames = userStoryTypeList.map((x) => x.userStoryTypeName);
        this.selectedUserStoryType = userStoryTypeNames.toString();
        this.workspaceFilterModel.workItemTypes = this.selectedUserStoryTypeIds;

        //Bug priorities
        let selectedBugPriorityIds = this.selectBugPriority.value.bugPriority.toString();
        this.selectedBugPriorityId = selectedBugPriorityIds;
        let bugPriorities = this.bugPriorities;
        const bugPriorityList = _.filter(bugPriorities, function (priority) {
            return selectedBugPriorityIds.includes(priority.bugPriorityId);
        })
        let bugPriorityNames = bugPriorityList.map((x) => x.description);
        this.selectedBugPriority = bugPriorityNames.toString();
        this.workspaceFilterModel.bugPriorities = this.selectedBugPriorityId;
        this.cdRef.detectChanges();
    }


    setAppHeight(view, viewSelector) {
        var interval;
        var count = 0;

        if (view == 'gridsterView') {

            interval = setInterval((
                function () {
                    try {
                        if (count > 30) {
                            clearInterval(interval);
                        }
                        count++;
                        if ($(viewSelector + ' .all-work-items').length > 0) {

                            var appWidth = $(viewSelector).width();
                            var appHeight = $(viewSelector).height();
                        
                            var contentHeight = appWidth < 500? (appHeight - 95) : (appHeight - 55);
                            $(viewSelector + ' .all-work-items').height(contentHeight);

                            clearInterval(interval);
                        }
                    }
                    catch (err) {
                        clearInterval(interval);
                    }
                }), 1000);
        }

        if (view == 'popupView') {

            interval = setInterval((
                function () {
                    try {
                        if (count > 30) {
                            clearInterval(interval);
                        }
                        count++;
                        if ($(viewSelector + ' .all-work-items').length > 0) {

                            var appHeight = $(viewSelector).height();
                            var contentHeight = appHeight - 140;
                            $(viewSelector + ' .all-work-items').height(contentHeight);

                            clearInterval(interval);
                        }
                    }
                    catch (err) {
                        clearInterval(interval);
                    }
                }), 1000);
        }

        if (view == 'individualPageView') {

            interval = setInterval((
                function () {
                    try {
                        if (count > 30) {
                            clearInterval(interval);
                        }
                        count++;
                        if ($(viewSelector + ' .all-work-items').length > 0) {

                            $(viewSelector + ' .all-work-items').css({ "height": "calc(100vh - 200px)" });
                            clearInterval(interval);
                        }
                    }
                    catch (err) {
                        clearInterval(interval);
                    }
                }), 1000);
        }

    }

    fitContent(optionalParameters: any) {

        if (optionalParameters['gridsterView']) {
            this.view = 'gridsterView';
            this.viewSelector = optionalParameters['gridsterViewSelector'];
            this.setAppHeight(this.view, this.viewSelector);
        }

        if (optionalParameters['popupView']) {
            this.view = 'popupView';
            this.viewSelector = optionalParameters['popupViewSelector'];
            this.setAppHeight(this.view, this.viewSelector);
        }

        if (optionalParameters['individualPageView']) {
            this.view = 'individualPageView';
            this.viewSelector = optionalParameters['individualPageSelector'];
            this.setAppHeight(this.view, this.viewSelector);
        }

    }

    getBusinessUnits() {
        this.isAnyOperationIsInprogress = true;
        var businessUnitDropDownModel = new BusinessUnitDropDownModel();
        businessUnitDropDownModel.isArchived = false;
        businessUnitDropDownModel.isFromHR = false ;
        this.projectService.getBusinessUnits(businessUnitDropDownModel).subscribe((response: any) => {
            if (response.success == true) {
                this.allBusinessUnits = response.data;
                this.businessUnitsList = this.allBusinessUnits;
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    getSelectedBusinessUnits() {
        let businessUnitvalues;
        if (Array.isArray(this.selectBusinessUnitForm.value.businessUnitIds))
        businessUnitvalues = this.selectBusinessUnitForm.value.businessUnitIds;
        else
        businessUnitvalues = this.selectBusinessUnitForm.value.businessUnitIds.split(',');

        const component = businessUnitvalues;
        const index = component.indexOf(0);
        if (index > -1) {
            component.splice(index, 1);
        }
        this.selectedBusinessUnitIds = component.toString();
        const businessUnitsList = this.allBusinessUnits;
        const selectedBusinessUnitsList = _.filter(businessUnitsList, function (role: any) {
            return component.toString().includes(role.businessUnitId);
        })
        const businessUnitsNames = selectedBusinessUnitsList.map((x) => x.businessUnitName);
        this.selectedBusinessUnits = businessUnitsNames.toString();

        this.pageNumber = 1;
        this.pageIndex = 0;
        this.pageSize = 25;
        this.loadWorkItems();
        this.cdRef.markForCheck();
    }

    toggleAllBusinessUnitsSelected() {
        if (this.businessUnitsSelected.selected) {
            this.selectBusinessUnitForm.controls['businessUnitIds'].patchValue([
                0, ...this.allBusinessUnits.map(item => item.businessUnitId)
            ]);
        } else {
            this.selectBusinessUnitForm.controls['businessUnitIds'].patchValue([]);
        }
        this.getSelectedBusinessUnits();
    }

    toggleBusinessUnitsPerOne() {
        if (this.businessUnitsSelected.selected) {
            this.businessUnitsSelected.deselect();
            return false;
        }
        if (
            this.selectBusinessUnitForm.controls['businessUnitIds'].value.length ===
            this.allBusinessUnits.length
        ) {
            this.businessUnitsSelected.select();
        }
    }
}