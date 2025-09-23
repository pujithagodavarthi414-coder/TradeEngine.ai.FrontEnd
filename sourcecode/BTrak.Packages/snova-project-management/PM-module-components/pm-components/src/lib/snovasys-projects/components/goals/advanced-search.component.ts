// tslint:disable-next-line: ordered-imports
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
// tslint:disable-next-line: ordered-imports
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
// tslint:disable-next-line: ordered-imports
import { MatOption } from "@angular/material/core";
import { MatDialog } from "@angular/material/dialog";
// tslint:disable-next-line: ordered-imports
import { Router } from "@angular/router";
import { SatPopover } from "@ncstate/sat-popover";
import { Actions, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { select, Store } from "@ngrx/store";
import { Subject } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
// tslint:disable-next-line: ordered-imports
import { takeUntil, tap } from "rxjs/operators";
import * as _ from "underscore";
// tslint:disable-next-line: ordered-imports
// tslint:disable-next-line: ordered-imports
// tslint:disable-next-line: ordered-imports
// tslint:disable-next-line: ordered-imports
import { Branch } from "../../models/branch";
// tslint:disable-next-line: ordered-imports
import { GoalsFilter } from "../../models/goal-filter.model";
import { GoalSearchCriteriaInputModel } from "../../models/GoalSearchCriteriaInputModel";
// tslint:disable-next-line: ordered-imports
import { GoalStatusDropDownData } from "../../models/goalStatusDropDown";
// tslint:disable-next-line: ordered-imports
import { Project } from "../../models/project";
import { ProjectSearchCriteriaInputModel } from "../../models/ProjectSearchCriteriaInputModel";
import { UserModel, User } from "../../models/user";
import { UserGoalFilter } from "../../models/user-goal-filter.model";
import { StatusesModel } from "../../models/workflowStatusesModel";
// tslint:disable-next-line: ordered-imports
import { GoalFiltersActionTypes, UpsertGoalFiltersTriggered } from "../../store/actions/goal-filters.action";
import { LoadGoalStatusTriggered } from "../../store/actions/goalStatus.action";
import { LoadProjectsTriggered } from "../../store/actions/project.actions";
import { LoadUsersTriggered } from "../../store/actions/users.actions";
import { LoadUserStoryStatusTriggered } from "../../store/actions/userStoryStatus.action";
import { State } from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";
import { AdvancedSearchFiltersComponent } from "../dialogs/advanced-search-filters.component";

import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { LoadFeedTimeSheetUsersTriggered } from '../../store/actions/feedTimeSheet.action';
import { CookieService } from 'ngx-cookie-service';
import { UserStoryTypesModel } from '../../models/userStoryTypesModel';
import { LoadUserStoryTypesTriggered } from '../../store/actions/user-story-types.action';
import { BugPriorityDropDownData } from '../../models/bugPriorityDropDown';
import { LoadBugPriorityTypesTriggered } from '../../store/actions/bug-priority.action';
import { ProjectFeature } from '../../models/projectFeature';
import { LoadFeatureProjectsTriggered } from '../../store/actions/project-features.actions';

@Component({
  selector: "app-advanced-search",
  templateUrl: "advanced-search.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvancedSearchComponent extends CustomAppBaseComponent implements OnInit {
  uniquegoalpage: boolean;
  @Input("uniquegoalpage")
  set _uniquegoalpage(data: boolean) {
    this.uniquegoalpage = data;
  }

  @Input("editFilters")
  set _editFilters(data: any) {
    if (data) {
      this.selectedSprintStatus = null;
      this.selectedGoalStatus = null;
      this.clearSelectOwnerUserIdForm();
      this.clearUserStoryStatusForm();
      this.clearSelectDependencyUserIdForm();
      this.clearSelectBugCausedUserIdForm();
      this.clearUserStoryTypeForm();
      this.clearBugPriorityForm();
      this.clearComponentForm();
      this.clearSelectGoalResponsiblePersonForm();
      this.clearSelectSprintResponsiblePersonForm();
      this.clearGoalStatusForm();
      this.clearSprintStatusForm();
      this.clearSelectProjectsForm();
      this.clearGoalFiltersForm();

      this.loadUserStoryStatusList();
      this.loadWorkItemTypes();
      this.loadBugPriority();
      this.loadProjectFeature();
      this.loadProjectsList();
      this.loadGoalStatusList();
      this.loadSprintStatusList();
      this.loadUsersList();
      this.editedFilters = data;
      this.bindData(data);
    }
  }
  @Output() searchFilterGoals = new EventEmitter<GoalSearchCriteriaInputModel>();
  @ViewChild("allSelected") private allSelected: MatOption;
  @ViewChild("allMembersSelected") private allMembersSelected: MatOption;
  @ViewChild("allProjectsSelected") private allProjectsSelected: MatOption;
  @ViewChild("allGoalStatusSelected") private allGoalStatusSelected: MatOption;
  @ViewChild("allSprintStatusSelected") private allSprintStatusSelected: MatOption;
  @ViewChild("allUserStoryStatusSelected") private allUserStoryStatusSelected: MatOption;
  @ViewChild("allDependencySelected") private allDependencySelected: MatOption;
  @ViewChild("allBugCausedSelected") private allBugCausedSelected: MatOption;
  @ViewChild("allUserStoryTypesSelected") private allUserStoryTypesSelected: MatOption;
  @ViewChild("allBugPrioritySelected") private allBugPrioritySelected: MatOption;
  @ViewChild("allProjectFeaturesSelectedOption") private allProjectFeaturesSelectedOption: MatOption;
  @ViewChild("allSprintMembersSelected") private allSprintMembersSelected: MatOption;
  @ViewChild("saveFiltersPopOver") goalFilterSatPopOver: SatPopover;
  @ViewChild("formDirective") formGroupDirective: FormGroupDirective;
  activeGoalsSearchCriteria: GoalSearchCriteriaInputModel;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  projectSearchResults$: Observable<Project[]>;
  projectResponsiblePersons$: Observable<User[]>;
  branches$: Observable<Branch[]>;
  goalStatus$: Observable<GoalStatusDropDownData[]>;
  userStoryStatus$: Observable<StatusesModel[]>;
  anyOperationInProgress$: Observable<boolean>;
  saveFiltersIsInProgress$: Observable<boolean>;
  goalFilters: any;
  saveGoalFilterModel: GoalsFilter;
  // tslint:disable-next-line: ban-types
  canAccessForDeleteGoalFilters: Boolean;
  UsersList: User[];
  projectsList: Project[];
  goalStatusList: GoalStatusDropDownData[];
  userStoryStatusList: StatusesModel[];
  advancedSearchFiltersForm: FormGroup;
  userGoalFilter: UserGoalFilter;
  ownerUserId: string;
  projectId: string;
  goalResponsibleUserId: string;
  goalStatusId: string;
  sprintStatusId: string;
  userStoryStatusId: string;
  dateFrom: string;
  dateTo: string;
  sprintStartDate: string;
  sprintEndDate: string;
  createFrom: string;
  createTo: string;
  updateFrom: string;
  updateTo: string;
  isNew: boolean;
  workItemTags: string;
  userStoryName: string;
  sprintName: string;
  isRed: boolean;
  isWarning: boolean;
  includeArchive: boolean;
  includePark: boolean;
  toBeTracked: boolean;
  isOnTrack: boolean;
  isNotOnTrack: boolean;
  isProductiveBoard: boolean;
  isGoalParked: boolean;
  isArchivedGoal: boolean;
  goalShortName: string;
  goalTags: string;
  goalFilterId: string;
  goalFilterDetailsId: string;
  isTrackedGoals: string;
  isProductiveGoals: string;
  isIncludedPark: string;
  isOnTracked: string;
  isNotOnTracked: string;
  isIncludedArchive: string;
  filteredText: string;
  goalFilterName = "Filter Name";
  filterName: string;
  sortBy: string;
  sortByDirection: string = null;
  selectOwnerId: FormGroup;
  selectGoalResponsibleId: FormGroup;
  selectSprintResponsibleId: FormGroup;
  selectSprintStatusId: FormGroup;
  selectProjectId: FormGroup;
  selectGoalStatusId: FormGroup;
  selectStatusId: FormGroup;
  searchEmployee = "";
  employeeSelectedValue = false;
  employeeList: UserModel[];
  employeeLoading$: Observable<boolean>;
  selectedProjects: string;
  selectedUsers: string;
  selectedSprintUsers: string;
  selectedSprintStatus: string;
  selectedGoalStatus: string;
  selectedOptions: any[] = [];
  sprintStatusList: any[] = [];
  selectedOwners: string;
  selectedUserStoryStatus: string;
  projectLabel: string;
  goalLabel: string;
  sprintResponsibleUserId: string;
  minDate: any;
  minStartDate: any;
  createMinDate: any;
  updateMinDate: any;
  selectedGoalFilters: string;
  showFilter = true;
  goalSearch: any;
  editedFilters: any;
  onlySave: boolean;
  loading: boolean;
  selectDependencyUserId: FormGroup;
  dependencyUserId: string;
  selectedDependencyUsers: string;
  selectBugCausedUserId: FormGroup;
  bugCausedUserId: string;
  selectedBugCausedUsers: string;
  userStoryTypes$: Observable<UserStoryTypesModel[]>;
  userStoryTypes: UserStoryTypesModel[];
  selectUserStoryTypeForm: FormGroup;
  userStoryTypeId: string;
  selectedUserStoryTypes: string;
  versionName: string;
  selectBugPriority: FormGroup;
  bugPriorityId: string;
  selectedBugPriorities: string;
  bugPriorities$: Observable<BugPriorityDropDownData[]>;
  bugPriorities: BugPriorityDropDownData[];
  selectComponent: FormGroup;
  selectedComponents: string;
  projectFeatureId: string;
  projectFeature$: Observable<ProjectFeature[]>;
  projectFeatures: ProjectFeature[];
  selectedOrderValue: string = "updatedDateTime";
  isSprintsEnable: boolean;

  public ngDestroyed$ = new Subject();
  projectsText: string = 'Projects';
  goalresponsiblePersonsText: string = 'Goal responsible person';
  sprintresponsiblePersonsText: string = 'Sprint responsible person';
  goalNameText: string = 'Goal name';
  goalStatus: string = 'Goal status';
  sprintStatus: string = 'Sprint status';
  deadlineDateFromText: string = 'Deadline date from';
  deadlineDateToText: string = 'Deadline date to';
  sprintStartDateText: string = 'Sprint start date';
  sprintEndDateText: string = 'Sprint end date';
  workItemAssigneeText: string = 'Work item assignee';
  workItemStatusText: string = 'Work item status'
  constructor(
    private store: Store<State>,
    private router: Router,
    private actionUpdates$: Actions,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
    private cookieService: CookieService
  ) {
    super();
    this.getSoftLabels();
    this.getCompanySettings();

    this.sprintStatusList = [
      {
        sprintStatusId:'7A79AB9F-D6F0-40A0-A191-CED6C06656DE',
        sprintStatusName: 'Active'
      },
      {
        sprintStatusId:'F6F118EA-7023-45F1-BCF6-CE6DB1CEE5C3',
        sprintStatusName: 'Backlog'
      },
      {
        sprintStatusId:'5AF65423-AFC4-4E9D-A011-F4DF97ED5FAF',
        sprintStatusName: 'Replan'
      },
      {
        sprintStatusId:'B25B79E1-82E5-40BC-9D1A-4591E620D895',
        sprintStatusName: 'Delete'
      },
      {
        sprintStatusId:'CF5FDAE7-4E4E-4AEC-892B-C283D32EBB26',
        sprintStatusName: 'Completed'
      }
    ]

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(GoalFiltersActionTypes.UpsertGoalFiltersCompleted),
        tap((data: any) => {
          this.goalFilters = this.userGoalFilter;
          if (this.isNew) {
            this.goalFilterDetailsId = null;
            //this.goalFilterId = data.goalFilterId;
          }
          this.clearGoalFiltersForm();
          this.closeFilterDialog();
          this.formGroupDirective.resetForm();
          if (!this.onlySave) {
            this.applyFilters();
          }
          this.onlySave = false;
        })
      )
      .subscribe();
  }

  ngOnInit() {
    super.ngOnInit();
    if (!this.editedFilters) {
      this.selectedSprintStatus = null;
      this.selectedGoalStatus = null;
      this.clearSelectOwnerUserIdForm();
      this.clearSelectGoalResponsiblePersonForm();
      this.clearSelectSprintResponsiblePersonForm();
      this.clearSelectProjectsForm();
      this.clearSelectDependencyUserIdForm();
      this.clearSelectBugCausedUserIdForm();
      this.clearUserStoryTypeForm();
      this.clearUserStoryStatusForm();
      this.clearComponentForm();
      this.clearForm();
      this.clearGoalFiltersForm();
      this.clearBugPriorityForm()
      this.loadBugPriority();
      this.loadProjectsList();
      this.loadWorkItemTypes();
      this.loadProjectFeature();
      this.loadGoalStatusList();
      this.loadUsersList();
      this.ownerUserId = this.cookieService.get('CurrentUserId');
      this.goalStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.sprintStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.loadSprintStatusList();
      this.clearSelectOwnerUserIdForm();
      this.clearGoalStatusForm();
      this.clearSprintStatusForm();
      this.sortBy = "updatedDateTime";
      this.searchGoals();
    }
    this.sortBy = this.selectedOrderValue;
    this.loadUserStoryStatusList();
    this.anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducer.getProjectsLoading)
    );

    this.saveFiltersIsInProgress$ = this.store.pipe(
      select(projectModuleReducer.upsertGoalFiltersLoading)
    );

  }

  getCompanySettings() {
    let companySettingsModel: any[] = [];
    companySettingsModel = JSON.parse(localStorage.getItem(LocalStorageProperties.CompanySettings));
    if (companySettingsModel && companySettingsModel.length > 0) {
      let companyResult = companySettingsModel.filter(item => item.key.trim() == "EnableSprints");
      if (companyResult.length > 0) {
        this.isSprintsEnable = companyResult[0].value == "1" ? true : false;
      }
    }
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    if (this.softLabels.length > 0) {
      this.projectLabel = this.softLabels[0].projectLabel;
      this.goalLabel = this.softLabels[0].goalLabel;
      this.cdRef.markForCheck();
    }
  }

  clearGoalFiltersForm() {
    if (!this.goalFilterId) {
      this.advancedSearchFiltersForm = new FormGroup({
        goalFilterName: new FormControl("", Validators.compose([
          Validators.required,
          Validators.maxLength(50)
        ])),
        isPublic: new FormControl("")
      })
    } else {
      let goalFilters = this.goalFilters;
      if (goalFilters) {
        this.goalFilterDetailsId = goalFilters.goalFilterDetailsId;
      }
      this.advancedSearchFiltersForm.patchValue(goalFilters);
    }

  }

  loadUsersList() {
    this.projectResponsiblePersons$ = this.store.pipe(
      select(projectModuleReducer.getUsersAll),
      tap((user) => {
        this.UsersList = user;
        if (this.ownerUserId) {
          this.bindUserStoryOwners(this.ownerUserId.toLowerCase());
        }
      })
    );
    if (!this.UsersList || this.UsersList.length === 0) {
      this.store.dispatch(new LoadUsersTriggered());
    }
  }

  changeOrderValue(event) {
    this.sortBy = event;
    this.searchGoals();
  }

  loadBugPriority() {
    this.bugPriorities$ = this.store.pipe(
      select(projectModuleReducer.getBugPriorityAll),
      tap((priority) => {
        this.bugPriorities = priority;
        if (this.bugPriorityId)
          this.bindBugPriority(this.bugPriorityId);
      })
    );
    if (!this.bugPriorities || this.bugPriorities.length === 0) {
      this.store.dispatch(new LoadBugPriorityTypesTriggered());
    }
  }

  loadProjectsList() {
    const projectSearchResult = new ProjectSearchCriteriaInputModel();
    projectSearchResult.isArchived = false;
    this.projectSearchResults$ = this.store.pipe(
      select(projectModuleReducer.getProjectsAll),
      tap((projects) => {
        this.projectsList = projects;
      })
    );
    if (!this.projectsList || this.projectsList.length === 0) {
      this.store.dispatch(new LoadProjectsTriggered(projectSearchResult));
    }
  }

  loadWorkItemTypes() {
    let userStoryTypesModel = new UserStoryTypesModel();
    userStoryTypesModel.isArchived = false;
    this.userStoryTypes$ = this.store.pipe(select(projectModuleReducer.getUserStoryTypesAll),
      tap((types) => {
        this.userStoryTypes = types;
        if (this.userStoryTypeId)
          this.bindUserStoryType(this.userStoryTypeId);
      })
    );
    if (!this.userStoryTypes || this.userStoryTypes.length == 0) {
      this.store.dispatch(new LoadUserStoryTypesTriggered(userStoryTypesModel));
    }
  }

  loadProjectFeature() {
    const projectFeature = new ProjectFeature();
    projectFeature.IsDelete = false;
    this.store.dispatch(new LoadFeatureProjectsTriggered(projectFeature));
    this.projectFeature$ = this.store.pipe(
      select(projectModuleReducer.getProjectFeaturesAll),
      // tslint:disable-next-line: no-shadowed-variable
      tap((projectFeature) => {
        this.projectFeatures = projectFeature;
        if (this.projectFeatureId)
          this.bindProjectFeature(this.projectFeatureId);
          this.clearComponentForm();
      })
    );
    this.projectFeature$.subscribe(result => {
      this.projectFeatures = result;
    })
  }

  loadGoalStatusList() {
    this.goalStatus$ = this.store.pipe(
      select(projectModuleReducer.getgoalStatusAll),
      tap((goalStatus) => {
        this.goalStatusList = goalStatus;
        // if (!this.editedFilters) {
        //   this.goalStatusId = ConstantVariables.ActiveGoalStatusId;
        // }
        if (this.goalStatusId)
          this.bindGoalStatus(this.goalStatusId.toLowerCase());
      })
    );
    if (!this.goalStatusList || this.goalStatusList.length === 0) {
      this.store.dispatch(new LoadGoalStatusTriggered());
    }

  }

  loadSprintStatusList() {
    if (this.sprintStatusId) {
      this.bindSprintStatus(this.sprintStatusId.toLowerCase());
    }
  }

  loadUserStoryStatusList() {

    this.userStoryStatus$ = this.store.pipe(
      select(projectModuleReducer.getUserStoryStatusAll),
      tap((userStoryStatus) => {
        this.userStoryStatusList = userStoryStatus;
        this.bindUserStoryStatus(this.userStoryStatusId);
      })
    );
    if (!this.userStoryStatusList || this.userStoryStatusList.length === 0) {
      this.store.dispatch(new LoadUserStoryStatusTriggered());
    }
  }

  clearSelectOwnerUserIdForm() {
    let selectedUsersIds = [];
    if (this.ownerUserId && this.UsersList) {
      let ownerUserIds = [];
      ownerUserIds = this.ownerUserId.split(',');
      if (ownerUserIds.length == this.UsersList.length) {
        selectedUsersIds.push(0);
      }
    }
    if (this.ownerUserId) {
      this.ownerUserId.split(',').forEach(element => {
        selectedUsersIds.push(element)
      });
    } else {
      selectedUsersIds = [];
    }

    this.selectOwnerId = this.fb.group({
      ownerUserId: new FormControl(selectedUsersIds)
    });
  }

  clearSelectDependencyUserIdForm() {
    let selectedUsersIds = [];
    if (this.dependencyUserId && this.UsersList) {
      let dependencyUserId = [];
      dependencyUserId = this.dependencyUserId.split(',');
      if (dependencyUserId.length == this.UsersList.length) {
        selectedUsersIds.push(0);
      }
    }
    if (this.dependencyUserId) {
      this.dependencyUserId.split(",").forEach(element => {
        selectedUsersIds.push(element);
      });
    } else {
      selectedUsersIds = [];
    }
    this.selectDependencyUserId = this.fb.group({
      dependencyUserId: new FormControl(selectedUsersIds)
    });
  }

  clearSelectBugCausedUserIdForm() {
    let selectedUsersIds = [];
    if (this.bugCausedUserId && this.UsersList) {
      let bugCausedUserId = [];
      bugCausedUserId = this.bugCausedUserId.split(',');
      if (bugCausedUserId.length == this.UsersList.length) {
        selectedUsersIds.push(0);
      }
    }
    if (this.bugCausedUserId) {
      this.bugCausedUserId.split(",").forEach(element => {
        selectedUsersIds.push(element);
      });
    } else {
      selectedUsersIds = [];
    }
    this.selectBugCausedUserId = this.fb.group({
      bugCausedUserId: new FormControl(selectedUsersIds)
    });
  }

  clearUserStoryTypeForm() {
    let userStoryTypeIds = [];
    if (this.userStoryTypeId && this.userStoryTypes) {
      let userStoryTypeId = [];
      userStoryTypeId = this.userStoryTypeId.split(',');
      if (userStoryTypeId.length == this.userStoryTypes.length) {
        userStoryTypeIds.push(0);
      }
    }
    if (this.userStoryTypeId) {
      this.userStoryTypeId.split(",").forEach(element => {
        userStoryTypeIds.push(element);
      });;
    } else {
      userStoryTypeIds = [];
    }
    this.selectUserStoryTypeForm = new FormGroup({
      userStoryTypeId: new FormControl(userStoryTypeIds)
    });
  }

  clearBugPriorityForm() {
    let bugPriorityIds = [];
    if (this.bugPriorityId && this.bugPriorities) {
      let bugPriorityId = [];
      bugPriorityId = this.bugPriorityId.split(',');
      if (bugPriorityId.length == this.bugPriorities.length) {
        bugPriorityIds.push(0);
      }
    }
    if (this.bugPriorityId) {
      this.bugPriorityId.split(",").forEach(element => {
        bugPriorityIds.push(element);
      });
    } else {
      bugPriorityIds = [];
    }
    this.selectBugPriority = new FormGroup({
      bugPriorityId: new FormControl(bugPriorityIds)
    });
  }

  clearComponentForm() {
    let projectFeatureIds = [];
    if (this.projectFeatureId && this.projectFeatures) {
      let projectFeatureId = [];
      projectFeatureId = this.projectFeatureId.split(',');
      if (projectFeatureId.length == this.projectFeatures.length) {
        projectFeatureIds.push(0);
      }
    }
    if (this.projectFeatureId) {
      this.projectFeatureId.split(",").forEach(element => {
        projectFeatureIds.push(element);
      });
    } else {
      projectFeatureIds = [];
    }
    this.selectComponent = new FormGroup({
      projectFeatureId: new FormControl(projectFeatureIds)
    });
  }

  clearSelectGoalResponsiblePersonForm() {
    this.selectedUsers = null;
    let selectedUsers = [];
    if (this.goalResponsibleUserId && this.UsersList) {
      let userIds = [];
      userIds = this.goalResponsibleUserId.split(',');
      if (userIds.length == this.UsersList.length) {
        selectedUsers.push(0);
      }
    }
    if (this.goalResponsibleUserId) {
      this.goalResponsibleUserId.split(',').forEach(element => {
        selectedUsers.push(element)
      });
    } else {
      selectedUsers = [];
    }
    this.selectGoalResponsibleId = this.fb.group({
      goalResponsibleUserId: new FormControl(selectedUsers)
    });
  }

  clearSelectSprintResponsiblePersonForm() {
    this.selectedSprintUsers = null;
    let selectedSprintUsers = [];
    if (this.sprintResponsibleUserId && this.UsersList) {
      let userIds = [];
      userIds = this.sprintResponsibleUserId.split(',');
      if (userIds.length == this.UsersList.length) {
        selectedSprintUsers.push(0);
      }
    }
    if (this.sprintResponsibleUserId) {
      this.sprintResponsibleUserId.split(',').forEach(element => {
        selectedSprintUsers.push(element)
      });
    } else {
      selectedSprintUsers = [];
    }
    this.selectSprintResponsibleId = this.fb.group({
      sprintResponsibleUserId: new FormControl(selectedSprintUsers)
    });
  }

  clearSelectProjectsForm() {
    this.selectedProjects = null;
    let selectedProjects = [];
    if (this.projectId && this.projectsList) {
      let projectIds = [];
      projectIds = this.projectId.split(',');
      if (projectIds.length == this.projectsList.length) {
        selectedProjects.push(0);
      }
    }
    if (this.projectId) {
      this.projectId.split(",").forEach(element => {
        selectedProjects.push(element);
      });
    } else {
      selectedProjects = [];
    }
    this.selectProjectId = this.fb.group({
      projectId: new FormControl(selectedProjects)
    });
  }

  clearGoalStatusForm() {
    let goalStatus = [];
    if (this.goalStatusId && this.goalStatusList) {
      let goalStatusId = [];
      goalStatusId = this.goalStatusId.split(',');
      if (goalStatusId.length == this.goalStatusList.length) {
        goalStatus.push(0);
      }
    }
    if (this.goalStatusId) {
      this.goalStatusId.split(",").forEach(element => {
        goalStatus.push(element);
      })
    }
    else {
      goalStatus = [];
    }
    //else {
    //   goalStatus.push(ConstantVariables.ActiveGoalStatusId.toLowerCase());
    // }
    goalStatus = goalStatus.map(function (x) {
      if (x != 0) {
        return x.toLowerCase();
      }
      else {
        return x;
      }
    })
    this.selectGoalStatusId = this.fb.group({
      goalStatusId: new FormControl(goalStatus)
    });
  }

  clearSprintStatusForm() {
    let sprintStatus = [];
    if (this.sprintStatusId && this.sprintStatusList) {
      let sprintStatusId = [];
      sprintStatusId = this.sprintStatusId.split(',');
      sprintStatusId = sprintStatusId.map(function (x) {
        if (x != 0) {
          return x.toUpperCase();
        }
        else {
          return x;
        }
      })
      if (sprintStatusId.length == this.sprintStatusList.length) {
        sprintStatus.push(0);
      }
    }
    if (this.sprintStatusId) {
      this.sprintStatusId.split(",").forEach(element => {
        sprintStatus.push(element);
      })
    }
    else {
      sprintStatus = [];
    }
    //else {
    //   goalStatus.push(ConstantVariables.ActiveGoalStatusId.toLowerCase());
    // }
    sprintStatus = sprintStatus.map(function (x) {
      if (x != 0) {
        return x.toUpperCase();
      }
      else {
        return x;
      }
    })
    this.selectSprintStatusId = this.fb.group({
      sprintStatusId: new FormControl(sprintStatus)
    });
  }

  clearUserStoryStatusForm() {
    this.selectedUserStoryStatus = null;
    let userStoryStatus = [];
    if (this.userStoryStatusId && this.userStoryStatusList) {
      let userStoryStatusId = [];
      userStoryStatusId = this.userStoryStatusId.split(',');
      if (userStoryStatusId.length == this.userStoryStatusList.length) {
        userStoryStatus.push(0);
      }
    }
    if (this.userStoryStatusId) {
      this.userStoryStatusId.split(",").forEach(element => {
        userStoryStatus.push(element)
      });
    } else {
      userStoryStatus = [];
    }
    this.selectStatusId = this.fb.group({
      userStoryStatusId: new FormControl(userStoryStatus)
    });
  }

  clearForm() {
    this.clearSelectOwnerUserIdForm();
    if (!this.editedFilters) {
      this.clearSelectGoalResponsiblePersonForm();
      this.clearSelectSprintResponsiblePersonForm();
      this.clearUserStoryStatusForm();
      this.clearUserStoryTypeForm();
      this.clearSelectBugCausedUserIdForm();
      this.clearSelectDependencyUserIdForm();
      this.clearComponentForm();
      this.clearBugPriorityForm();
    }
    this.selectedSprintStatus = null;
    this.selectedGoalStatus = null;
    this.clearSelectProjectsForm();
    this.clearGoalStatusForm();
    this.clearSprintStatusForm();
    this.projectId = "";
    this.sprintName = "";
    this.selectedOwners = "";
    this.goalResponsibleUserId = "";
    this.sprintResponsibleUserId = "";
    this.goalStatusId = "";
    this.sprintStatusId = "";
    this.userStoryStatusId = "";
    this.goalTags = "";
    this.workItemTags = "";
    this.dateFrom = "";
    this.sprintStartDate = "";
    this.sprintEndDate = "";
    this.createFrom = ""
    this.createTo = "";
    this.updateFrom = "";
    this.updateTo = "";
    this.filteredText = "";
    this.dateTo = "";
    this.isRed = null;
    this.minDate = null;
    this.isWarning = null;
    this.toBeTracked = null;
    this.isProductiveBoard = null;
    this.isGoalParked = null;
    this.isArchivedGoal = null;
    this.goalShortName = "";
    this.sortBy = "";
    this.sortByDirection = "";
    this.includePark = null;
    this.isOnTrack = null;
    this.isNotOnTrack = null;
    this.includeArchive = null;
    this.isIncludedArchive = "";
    this.isIncludedPark = "";
    this.isOnTracked = "";
    this.isNotOnTracked = "";
    this.isProductiveGoals = "";
    this.isTrackedGoals = "";
    this.selectedBugCausedUsers = "";
    this.selectedDependencyUsers = "";
    this.selectedUserStoryTypes = "";
    this.userStoryName = "";
    this.versionName = "";
    this.selectedBugPriorities = "";
    this.selectedComponents = "";
  }

  resetSearch() {
    if (this.uniquegoalpage) {
      this.router.navigate(["/projects/allgoals"]);
    } else {
      this.selectedSprintStatus = null;
      this.selectedGoalStatus = null;
      this.clearForm();
      this.clearSelectOwnerUserIdForm();
      this.clearSelectGoalResponsiblePersonForm();
      this.clearSelectSprintResponsiblePersonForm();
      this.clearSelectProjectsForm();
      this.clearGoalStatusForm();
      this.clearSprintStatusForm();
      this.clearUserStoryStatusForm();
      this.goalFilterName = "Filter Name";
      this.goalTags = "";
      this.workItemTags = "";
      this.selectedOwners = "";
      this.sprintName = "";
      this.sprintStartDate = "";
      this.sprintEndDate = "";
      this.goalFilterDetailsId = null;
      this.goalFilterId = null;
      this.filterName = null;
      this.showFilter = false;
      this.selectedUsers = null;
      this.clearGoalFiltersForm();
      this.goalFilters = null;
      this.selectedOptions = [];
      this.selectedGoalFilters = null;
      const activeGoalsSearchCriteria = new GoalSearchCriteriaInputModel();
      this.goalStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.sprintStatusId = ConstantVariables.ActiveGoalStatusId.toUpperCase();
      this.ownerUserId = this.cookieService.get('CurrentUserId');
      this.bindUserStoryOwners(this.ownerUserId.toLowerCase());
      this.bindGoalStatus(this.goalStatusId.toLowerCase());
      this.bindSprintStatus(this.goalStatusId.toUpperCase());
      activeGoalsSearchCriteria.isGoalsPage = true;
      activeGoalsSearchCriteria.isAdvancedSearch = true;
      activeGoalsSearchCriteria.goalStatusId = ConstantVariables.ActiveGoalStatusId;
      activeGoalsSearchCriteria.sprintStatusId = ConstantVariables.ActiveGoalStatusId;
      activeGoalsSearchCriteria.ownerUserId = this.ownerUserId;
      activeGoalsSearchCriteria.isParkedGoal = false;
      activeGoalsSearchCriteria.isArchivedGoal = false;
      this.searchFilterGoals.emit(activeGoalsSearchCriteria);
    }
  }

  toggleAllResponsiblePersonsSelection() {
    if (this.allMembersSelected.selected) {
      this.selectGoalResponsibleId.controls.goalResponsibleUserId.patchValue([
        ...this.UsersList.map((item) => item.id),
        0
      ]);

    } else {
      this.selectGoalResponsibleId.controls.goalResponsibleUserId.patchValue([]);
    }
    this.goalResponsibleUserId = this.selectGoalResponsibleId.value;

    this.selectGoalResponsiblePerson();

  }

  
  toggleAllSprintResponsiblePersonsSelection() {
    if (this.allSprintMembersSelected.selected) {
      this.selectSprintResponsibleId.controls.sprintResponsibleUserId.patchValue([
        ...this.UsersList.map((item) => item.id),
        0
      ]);

    } else {
      this.selectSprintResponsibleId.controls.sprintResponsibleUserId.patchValue([]);
    }
    this.sprintResponsibleUserId = this.selectSprintResponsibleId.value;

    this.selectSprintResponsiblePerson();

  }

  toggleAllMembersSelection() {
    if (this.allSelected.selected) {
      this.selectOwnerId.controls.ownerUserId.patchValue([
        ...this.UsersList.map((item) => item.id),
        0
      ]);

    } else {
      this.selectOwnerId.controls.ownerUserId.patchValue([]);
    }
    this.ownerUserId = this.selectOwnerId.value;

    this.selectOwner();
  }

  toggleAllDependencyMembersSelection() {
    if (this.allDependencySelected.selected) {
      this.selectDependencyUserId.controls.dependencyUserId.patchValue([
        ...this.UsersList.map((item) => item.id),
        0
      ]);

    } else {
      this.selectDependencyUserId.controls.dependencyUserId.patchValue([]);
    }
    this.dependencyUserId = this.selectDependencyUserId.value;
    this.selectDependencyUser();
  }

  toggleAllBugCausedMembersSelection() {
    if (this.allBugCausedSelected.selected) {
      this.selectBugCausedUserId.controls.bugCausedUserId.patchValue([
        ...this.UsersList.map((item) => item.id),
        0
      ]);

    } else {
      this.selectBugCausedUserId.controls.bugCausedUserId.patchValue([]);
    }
    this.bugCausedUserId = this.selectBugCausedUserId.value;
    this.selectBugCausedUser();
  }

  toggleAllUserStoryTypesSelection() {
    if (this.allUserStoryTypesSelected.selected) {
      this.selectUserStoryTypeForm.controls.userStoryTypeId.patchValue([
        ...this.userStoryTypes.map((item) => item.userStoryTypeId),
        0
      ]);

    } else {
      this.selectUserStoryTypeForm.controls.userStoryTypeId.patchValue([]);
    }
    this.userStoryTypeId = this.selectUserStoryTypeForm.value;
    this.selectWorkItemTypes();
  }

  toggleAllBugPrioritySelection() {
    if (this.allBugPrioritySelected.selected) {
      this.selectBugPriority.controls.bugPriorityId.patchValue([
        ...this.bugPriorities.map((item) => item.bugPriorityId),
        0
      ]);

    } else {
      this.selectBugPriority.controls.bugPriorityId.patchValue([]);
    }
    this.bugPriorityId = this.selectBugPriority.value;
    this.selectBugPriorities();
  }

  toggleAllProjectFeatureSelection() {
    if (this.allProjectFeaturesSelectedOption.selected) {
      this.selectComponent.controls.projectFeatureId.patchValue([
        ...this.projectFeatures.map((item) => item.projectFeatureId),
        0
      ]);

    } else {
      this.selectComponent.controls.projectFeatureId.patchValue([]);
    }
    this.projectFeatureId = this.selectComponent.value;
    this.selectProjectFeatures();
  }

  toggleAllProjectsSelection() {
    if (this.allProjectsSelected.selected) {
      this.selectProjectId.controls.projectId.patchValue([
        ...this.projectsList.map((item) => item.projectId),
        0
      ]);

    } else {
      this.selectProjectId.controls.projectId.patchValue([]);
    }
    this.selectProject();
  }

  toggleAllSprintStatusSelection() {
    if (this.allSprintStatusSelected.selected) {
      this.selectSprintStatusId.controls.sprintStatusId.patchValue([
        ...this.sprintStatusList.map((item) => item.sprintStatusId),
        0
      ]);

    } else {
      this.selectSprintStatusId.controls.sprintStatusId.patchValue([]);
    }
    this.sprintStatusId = this.selectSprintStatusId.value;
    if (this.sprintStatusId === null || this.sprintStatusId === "") {
      this.sprintStatusId = ConstantVariables.ActiveGoalStatusId;
      this.bindSprintStatus(this.sprintStatusId);
    }
    this.selectSprintStatus();
  }

  toggleAllGoalStatusSelection() {
    if (this.allGoalStatusSelected.selected) {
      this.selectGoalStatusId.controls.goalStatusId.patchValue([
        ...this.goalStatusList.map((item) => item.goalStatusId),
        0
      ]);

    } else {
      this.selectGoalStatusId.controls.goalStatusId.patchValue([]);
    }
    this.goalStatusId = this.selectGoalStatusId.value;
    if (this.goalStatusId === null || this.goalStatusId === "") {
      this.goalStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.bindGoalStatus(this.goalStatusId.toLowerCase());
    }
    this.selectGoalStatus();
  }

  toggleAllUserStoryStatusSelection() {
    if (this.allUserStoryStatusSelected.selected) {
      this.selectStatusId.controls.userStoryStatusId.patchValue([
        ...this.userStoryStatusList.map((item) => item.userStoryStatusId),
        0
      ]);

    } else {
      this.selectStatusId.controls.userStoryStatusId.patchValue([]);
    }
    this.userStoryStatusId = this.selectStatusId.value;
    if (this.goalStatusId === null || this.goalStatusId === "") {
      this.goalStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.bindGoalStatus(this.goalStatusId.toLowerCase());
    }
    this.selectUserStoryStatus();
  }

  selectOwner() {
    const ownerUserId = this.selectOwnerId.value.ownerUserId;
    const index = ownerUserId.indexOf(0);
    if (index > -1) {
      ownerUserId.splice(index, 1);
    }
    this.ownerUserId = ownerUserId.toString();
    if (this.goalStatusId === null || this.goalStatusId === "") {
      this.goalStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.bindGoalStatus(this.goalStatusId.toLowerCase());
    }
    this.bindUserStoryOwners(this.ownerUserId);
    this.searchGoals();
  }

  selectDependencyUser() {
    const dependencyUserId = this.selectDependencyUserId.value.dependencyUserId;
    const index = dependencyUserId.indexOf(0);
    if (index > -1) {
      dependencyUserId.splice(index, 1);
    }
    this.dependencyUserId = dependencyUserId.toString();
    this.bindDependencyUser(this.dependencyUserId);
    this.searchGoals();
  }

  selectBugCausedUser() {
    const bugCausedUserId = this.selectBugCausedUserId.value.bugCausedUserId;
    const index = bugCausedUserId.indexOf(0);
    if (index > -1) {
      bugCausedUserId.splice(index, 1);
    }
    this.bugCausedUserId = bugCausedUserId.toString();
    this.bindBugCausedUser(this.bugCausedUserId);
    this.searchGoals();
  }

  selectWorkItemTypes() {
    const userStoryTypeId = this.selectUserStoryTypeForm.value.userStoryTypeId;
    const index = userStoryTypeId.indexOf(0);
    if (index > -1) {
      userStoryTypeId.splice(index, 1);
    }
    this.userStoryTypeId = userStoryTypeId.toString();
    this.bindUserStoryType(this.userStoryTypeId);
    this.searchGoals();
  }

  selectBugPriorities() {
    const bugPriorityId = this.selectBugPriority.value.bugPriorityId;
    const index = bugPriorityId.indexOf(0);
    if (index > -1) {
      bugPriorityId.splice(index, 1);
    }
    this.bugPriorityId = bugPriorityId.toString();
    this.bindBugPriority(this.bugPriorityId);
    this.searchGoals();
  }

  selectProjectFeatures() {
    const projectFeatureId = this.selectComponent.value.projectFeatureId;
    const index = projectFeatureId.indexOf(0);
    if (index > -1) {
      projectFeatureId.splice(index, 1);
    }
    this.projectFeatureId = projectFeatureId.toString();
    this.bindProjectFeature(this.projectFeatureId);
    this.searchGoals();
  }

  bindUserStoryOwners(ownerUserId) {
    if (ownerUserId) {
      const projectMembers = this.UsersList;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(projectMembers, function (member) {
        return ownerUserId.toString().includes(member.id);
      })
      const selectedUsers = filteredList.map((x) => x.fullName);
      this.selectedOwners = selectedUsers.toString();
    } else {
      this.selectedOwners = "";
    }
  }

  bindDependencyUser(dependencyUserId) {
    if (dependencyUserId) {
      const projectMembers = this.UsersList;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(projectMembers, function (member) {
        return dependencyUserId.toString().includes(member.id);
      })
      const selectedUsers = filteredList.map((x) => x.fullName);
      this.selectedDependencyUsers = selectedUsers.toString();
    } else {
      this.selectedDependencyUsers = "";
    }
  }

  bindBugCausedUser(bugCausedUserId) {
    if (bugCausedUserId) {
      const projectMembers = this.UsersList;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(projectMembers, function (member) {
        return bugCausedUserId.toString().includes(member.id);
      })
      const selectedUsers = filteredList.map((x) => x.fullName);
      this.selectedBugCausedUsers = selectedUsers.toString();
    } else {
      this.selectedBugCausedUsers = "";
    }
  }

  bindUserStoryType(userStoryTypeId) {
    if (userStoryTypeId) {
      const userStoryTypes = this.userStoryTypes;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(userStoryTypes, function (member) {
        return userStoryTypeId.toString().includes(member.userStoryTypeId);
      })
      const selectedUserStoryTypes = filteredList.map((x) => x.userStoryTypeName);
      this.selectedUserStoryTypes = selectedUserStoryTypes.toString();
    } else {
      this.selectedUserStoryTypes = "";
    }
  }

  bindBugPriority(bugPriorityId) {
    if (bugPriorityId) {
      const bugPriorities = this.bugPriorities;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(bugPriorities, function (member) {
        return bugPriorityId.toString().includes(member.bugPriorityId);
      })
      const selectedBugPriorities = filteredList.map((x) => x.priorityName);
      this.selectedBugPriorities = selectedBugPriorities.toString();
    } else {
      this.selectedBugPriorities = "";
    }
  }

  bindProjectFeature(projectFeatureId) {
    if (projectFeatureId) {
      const projectFeatures = this.projectFeatures;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(projectFeatures, function (member) {
        return projectFeatureId.toString().includes(member.projectFeatureId);
      })
      const selectedComponents = filteredList.map((x) => x.projectFeatureName);
      this.selectedComponents = selectedComponents.toString();
    } else {
      this.selectedComponents = "";
    }
  }

  selectGoalResponsiblePerson() {
    const goalResponsibleUserId = this.selectGoalResponsibleId.value.goalResponsibleUserId;
    const index = goalResponsibleUserId.indexOf(0);
    if (index > -1) {
      goalResponsibleUserId.splice(index, 1);
    }
    this.goalResponsibleUserId = goalResponsibleUserId.toString();
    if (this.goalStatusId === null || this.goalStatusId === "") {
      this.goalStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.bindGoalStatus(this.goalStatusId.toLowerCase());
    }
    this.bindGoalResponsiblePersons(this.goalResponsibleUserId);

    this.searchGoals();
  }

  selectSprintResponsiblePerson() {
    const sprintResponsibleUserId = this.selectSprintResponsibleId.value.sprintResponsibleUserId;
    const index = sprintResponsibleUserId.indexOf(0);
    if (index > -1) {
      sprintResponsibleUserId.splice(index, 1);
    }
    this.sprintResponsibleUserId = sprintResponsibleUserId.toString();
    if (this.sprintStatusId === null || this.sprintStatusId === "") {
      this.sprintStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.bindSprintStatus(this.sprintStatusId.toUpperCase());
    }
    this.bindSprintResponsiblePersons(this.sprintResponsibleUserId);

    this.searchGoals();
  }

  bindGoalResponsiblePersons(goalResponsibleUserId) {
    if (goalResponsibleUserId) {
      const projectMembers = this.UsersList;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(projectMembers, function (member) {
        return goalResponsibleUserId.toString().includes(member.id);
      })

      const selectedUsers = filteredList.map((x) => x.fullName);
      this.selectedUsers = selectedUsers.toString();
    } else {
      this.selectedUsers = "";
    }
  }

  bindSprintResponsiblePersons(goalResponsibleUserId) {
    if (goalResponsibleUserId) {
      const projectMembers = this.UsersList;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(projectMembers, function (member) {
        return goalResponsibleUserId.toString().includes(member.id);
      })

      const selectedSprintUsers = filteredList.map((x) => x.fullName);
      this.selectedSprintUsers = selectedSprintUsers.toString();
    } else {
      this.selectedSprintUsers = "";
    }
  }

  selectProject() {
    const projectId = this.selectProjectId.value.projectId;
    const index = projectId.indexOf(0);
    if (index > -1) {
      projectId.splice(index, 1);
    }
    this.projectId = projectId.toString();
    if (this.goalStatusId === null || this.goalStatusId === "") {
      this.goalStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.bindGoalStatus(this.goalStatusId.toLowerCase());
    }
    this.bindProjectsList(this.projectId);
    this.searchGoals();
  }

  bindProjectsList(projectId) {
    if (projectId) {
      const projectsList = this.projectsList;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(projectsList, function (project) {
        return projectId.toString().includes(project.projectId)
      })
      if (filteredList) {
        const selectedProjects = filteredList.map((x) => x.projectName);
        this.selectedProjects = selectedProjects.toString();
      }
    } else {
      this.selectedProjects = "";
    }
  }

  selectGoalStatus() {
    const goalStatusId = this.selectGoalStatusId.value.goalStatusId;
    const index = goalStatusId.indexOf(0);
    if (index > -1) {
      goalStatusId.splice(index, 1);
    }
    this.isArchivedGoal = null;
    this.isGoalParked = null;
    this.goalStatusId = goalStatusId.toString();
    const goalStatusList = this.goalStatusList;
    // tslint:disable-next-line: only-arrow-functions
    const filteredList = _.filter(goalStatusList, function (goalStatus) {
      return goalStatusId.toString().includes(goalStatus.goalStatusId)
    })
    if (filteredList) {
      const selectedGoalStatus = filteredList.map((x) => x.goalStatusName);
      this.selectedGoalStatus = selectedGoalStatus.toString();
    }
    this.showFilter = true;
    this.searchGoals();
  }

  selectSprintStatus() {
    const sprintStatusId = this.selectSprintStatusId.value.sprintStatusId;
    const index = sprintStatusId.indexOf(0);
    if (index > -1) {
      sprintStatusId.splice(index, 1);
    }
    this.isArchivedGoal = null;
    this.isGoalParked = null;
    this.sprintStatusId = sprintStatusId.toString();
    const goalStatusList = this.sprintStatusList;
    // tslint:disable-next-line: only-arrow-functions
    const filteredList = _.filter(goalStatusList, function (goalStatus) {
      return sprintStatusId.toString().includes(goalStatus.sprintStatusId)
    })
    if (filteredList) {
      const selectedSprintStatus = filteredList.map((x) => x.sprintStatusName);
      this.selectedSprintStatus = selectedSprintStatus.toString();
    }
    this.showFilter = true;
    this.searchGoals();
  }


  selectUserStoryStatus() {
    const userStoryStatusId = this.selectStatusId.value.userStoryStatusId;
    const index = userStoryStatusId.indexOf(0);
    if (index > -1) {
      userStoryStatusId.splice(index, 1);
    }
    this.userStoryStatusId = userStoryStatusId.toString();
    if (this.goalStatusId === null || this.goalStatusId === "") {
      this.goalStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.bindGoalStatus(this.goalStatusId.toLowerCase());
    }
    this.bindUserStoryStatus(this.userStoryStatusId);
    this.searchGoals();
  }

  bindUserStoryStatus(userStoryStatusId) {
    if (userStoryStatusId) {
      const userStoryStatusList = this.userStoryStatusList;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(userStoryStatusList, function (status) {
        return userStoryStatusId.toString().includes(status.userStoryStatusId)
      })
      if (filteredList) {
        const selectedUserStoryStatus = filteredList.map((x) => x.userStoryStatusName);
        this.selectedUserStoryStatus = selectedUserStoryStatus.toString();
      }
    } else {
      this.selectedUserStoryStatus = "";
    }
  }

  getDateFrom(dateFrom) {
    this.dateFrom = dateFrom;
    this.minDate = this.dateFrom;
    if (this.goalStatusId === null || this.goalStatusId === "") {
      this.goalStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.bindGoalStatus(this.goalStatusId.toLowerCase());
    }
    this.showFilter = true;
    this.searchGoals();
  }

  getSprintStartDateFrom(dateFrom) {
    this.sprintStartDate = dateFrom;
    this.minStartDate = this.dateFrom;
    if (this.sprintStatusId === null || this.sprintStatusId === "") {
      this.sprintStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.bindSprintStatus(this.sprintStatusId.toLowerCase());
    }
    this.showFilter = true;
    this.searchGoals();
  }

  
  getSprintEndDateTo(dateFrom) {
    this.sprintEndDate = dateFrom;
    if (this.sprintStatusId === null || this.sprintStatusId === "") {
      this.sprintStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.bindSprintStatus(this.sprintStatusId.toLowerCase());
    }
    this.showFilter = true;
    this.searchGoals();
  }

  getCreateFrom(createFrom) {
    this.createFrom = createFrom;
    this.createMinDate = createFrom;
    this.searchGoals()
  }

  getUpdatedFrom(updatedFrom) {
    this.updateFrom = updatedFrom;
    this.updateMinDate = updatedFrom;
    this.searchGoals()
  }

  getDateTo(dateTo) {
    this.dateTo = dateTo;
    if (this.goalStatusId === null || this.goalStatusId === "") {
      this.goalStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.bindGoalStatus(this.goalStatusId.toLowerCase());
    }
    this.showFilter = true;
    this.searchGoals();
  }

  getCreateTo(createTo) {
    this.createTo = createTo;
    this.searchGoals();
  }

  getUpdatedTo(updateTo) {
    this.updateTo = updateTo;
    this.searchGoals();
  }

  searchGoalName() {
    this.goalShortName = this.goalShortName.trim();
    if (this.goalStatusId === null || this.goalStatusId === "") {
      this.goalStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.bindGoalStatus(this.goalStatusId.toLowerCase());
    }
    this.searchGoals();
  }

  searchSprintName() {
    this.sprintName = this.sprintName.trim();
    if (this.sprintStatusId === null || this.sprintStatusId === "") {
      this.sprintStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.bindSprintStatus(this.goalStatusId.toLowerCase());
    }
    this.searchGoals();
  }

  searchGoalTags() {
    if (this.goalTags.length > 0) {
      this.goalTags = this.goalTags.trim();
      if (this.goalTags.length <= 0) {
        return;
      }
    }
    if (this.goalStatusId === null || this.goalStatusId === "") {
      this.goalStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.bindGoalStatus(this.goalStatusId.toLowerCase());
    }
    this.searchGoals();
  }

  searchVersionName() {
    if (this.versionName.length > 0) {
      this.versionName = this.versionName.trim();
      if (this.versionName.length <= 0) {
        return;
      }
    }
    this.searchGoals();
  }

  searchWorkItemTags() {
    if (this.workItemTags.length > 0) {
      this.workItemTags = this.workItemTags.trim();
      if (this.workItemTags.length <= 0) {
        return;
      }
    }
    if (this.goalStatusId === null || this.goalStatusId === "") {
      this.goalStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.bindGoalStatus(this.goalStatusId.toLowerCase());
    }
    this.searchGoals();
  }

  searchUserStoryName() {
    if (this.userStoryName.length > 0) {
      this.userStoryName = this.userStoryName.trim();
      if (this.userStoryName.length <= 0) {
        return;
      }
    }
    this.searchGoals();
  }

  getBelowOnBoardGoals() {
    if (this.goalStatusId === null || this.goalStatusId === "") {
      this.goalStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.bindGoalStatus(this.goalStatusId.toLowerCase());
    }
    this.showFilter = true;
    this.searchGoals();
  }

  getWarningGoals() {

    if (this.goalStatusId === null || this.goalStatusId === "") {
      this.goalStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.bindGoalStatus(this.goalStatusId.toLowerCase());
    }
    this.showFilter = true;
    this.searchGoals();
  }

  getTrackedGoals() {
    if (this.toBeTracked === true) {
      this.isTrackedGoals = "Tracked"
      this.selectedOptions.push(this.isTrackedGoals);
    } else {
      var index = this.selectedOptions.indexOf(this.isTrackedGoals);
      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      }
      this.isTrackedGoals = "";
    }
    if (this.goalStatusId === null || this.goalStatusId === "") {
      this.goalStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.bindGoalStatus(this.goalStatusId.toLowerCase());
    }
    if (!this.toBeTracked) {
      this.toBeTracked = null;
      this.isTrackedGoals = "";
    } else {
      this.isTrackedGoals = "Tracked";
    }
    this.showFilter = true;
    this.selectedGoalFilters = this.selectedOptions.toString();
    this.searchGoals();
  }

  getProductiveGoals() {
    if (this.isProductiveBoard === true) {
      this.isProductiveGoals = "Productive"
      this.selectedOptions.push(this.isProductiveGoals);
    } else {
      var index = this.selectedOptions.indexOf(this.isProductiveGoals);
      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      }
      this.isProductiveGoals = "";
    }
    if (this.goalStatusId === null || this.goalStatusId === "") {
      this.goalStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.bindGoalStatus(this.goalStatusId.toLowerCase());
    }
    if (!this.isProductiveBoard) {
      this.isProductiveBoard = null;
      this.isProductiveGoals = "";
    } else {
      this.isProductiveGoals = "Productive"
    }

    this.showFilter = true;
    this.selectedGoalFilters = this.selectedOptions.toString();
    this.searchGoals();
  }

  getArchivedGoals() {
    if (!this.isGoalParked) {
      this.isGoalParked = false;
    }
    this.showFilter = true;
    this.searchGoals();
  }

  getParkedGoals() {
    if (!this.isArchivedGoal) {
      this.isArchivedGoal = false;
    }
    this.showFilter = true;
    this.searchGoals();
  }

  getIncludedParkedGoals() {
    if (this.includePark === true) {
      this.isIncludedPark = "Include park"
      this.selectedOptions.push(this.isIncludedPark);
    } else {
      var index = this.selectedOptions.indexOf(this.isIncludedPark);
      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      }
      this.isIncludedPark = "";
    }
    if (this.goalStatusId === null || this.goalStatusId === "") {
      this.goalStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.bindGoalStatus(this.goalStatusId.toLowerCase());
    }
    this.selectedGoalFilters = this.selectedOptions.toString();
    this.searchGoals();
  }

  getOnTrackUserStories() {
    if (this.isOnTrack === true) {
      this.isOnTracked = "Is on track"
      this.selectedOptions.push(this.isOnTracked);
    } else {
      var index = this.selectedOptions.indexOf(this.isOnTracked);
      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      }
      this.isOnTracked = "";
    }
    if (this.goalStatusId === null || this.goalStatusId === "") {
      this.goalStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.bindGoalStatus(this.goalStatusId.toLowerCase());
    }
    this.selectedGoalFilters = this.selectedOptions.toString();
    this.searchGoals();
  }

  getNotOnTrackUserStories() {
    if (this.isNotOnTrack === true) {
      this.isNotOnTracked = "Is not on track"
      this.selectedOptions.push(this.isNotOnTracked);
    } else {
      var index = this.selectedOptions.indexOf(this.isNotOnTracked);
      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      }
      this.isNotOnTracked = "";
    }
    if (this.goalStatusId === null || this.goalStatusId === "") {
      this.goalStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.bindGoalStatus(this.goalStatusId.toLowerCase());
    }
    this.selectedGoalFilters = this.selectedOptions.toString();
    this.searchGoals();
  }

  getIncludedArchivedGoals() {
    if (this.includeArchive === true) {
      this.isIncludedArchive = "Include archive"
      this.selectedOptions.push(this.isIncludedArchive);
    } else {
      var index = this.selectedOptions.indexOf(this.isIncludedArchive);
      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      }
      this.isIncludedArchive = "";
    }
    if (this.goalStatusId === null || this.goalStatusId === "") {
      this.goalStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.bindGoalStatus(this.goalStatusId.toLowerCase());
    }
    this.selectedGoalFilters = this.selectedOptions.toString();
    this.searchGoals();
  }

  bindGoalStatus(goalStatusId) {
    if (goalStatusId) {
      const goalStatusList = this.goalStatusList;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(goalStatusList, function (goalStatus: GoalStatusDropDownData) {
        return goalStatusId.toString().toUpperCase().includes(goalStatus.goalStatusId.toUpperCase())
      })
      if (filteredList) {
        const selectedGoalStatus = filteredList.map((x) => x.goalStatusName);
        this.selectedGoalStatus = selectedGoalStatus.toString();
      }
    }
    else {
      this.selectedGoalStatus = null;
    }
    this.cdRef.detectChanges();
  }

  bindSprintStatus(sprintStatusId) {
    if (sprintStatusId) {
      const sprintStatusList = this.sprintStatusList;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(sprintStatusList, function (sprintStatus: any) {
        return sprintStatusId.toString().toUpperCase().includes(sprintStatus.sprintStatusId.toUpperCase())
      })
      if (filteredList) {
        const selectedSprintStatus = filteredList.map((x) => x.sprintStatusName);
        this.selectedSprintStatus = selectedSprintStatus.toString();
        this.cdRef.detectChanges();
      }
    }
    else {
      this.selectedSprintStatus = null;
    }
    this.cdRef.detectChanges();
  }

  compareSelectedTeamMembersFn(teamMember: any, selectedMember: any) {
    if (teamMember === selectedMember) {
      return true;
    } else {
      return false;
    }
  }

  compareSelectedGoalStatusFn(goalStatus: any, selectedGoalStatus: any) {
    if (goalStatus === selectedGoalStatus) {
      return true;
    } else {
      return false;
    }
  }

  
  compareSelectedSprintStatusFn(sprintStatus: any, selectedSprintStatus: any) {
    if (sprintStatus === selectedSprintStatus) {
      return true;
    } else {
      return false;
    }
  }

  compareSelectedResponsibleMembersFn(goalResponsiblePersons: any, selectedResponsiblePersons: any) {
    if (goalResponsiblePersons === selectedResponsiblePersons) {
      return true;
    } else {
      return false;
    }
  }

  compareSprintSelectedResponsibleMembersFn(sprintResponsiblePersons: any, selectedSprintResponsiblePersons: any) {
    if (sprintResponsiblePersons === selectedSprintResponsiblePersons) {
      return true;
    } else {
      return false;
    }
  }

  compareSelectedProjectsFn(projects: any, selectedProjects: any) {
    if (projects === selectedProjects) {
      return true;
    } else {
      return false;
    }
  }

  compareSelectedOwnerUserFn(members: any, selectedOwners: any) {
    if (members === selectedOwners) {
      return true;
    } else {
      return false;
    }
  }

  compareSelectedDependencyUserFn(members: any, selectedDependencyUsers: any) {
    if (members === selectedDependencyUsers) {
      return true;
    } else {
      return false;
    }
  }

  compareSelectedBugCausedUserFn(members: any, selectedBugCausedUsers: any) {
    if (members === selectedBugCausedUsers) {
      return true;
    } else {
      return false;
    }
  }

  compareSelectedUserStoryTypesFn(userStoryTypes: any, selecteduserStoryTypes: any) {
    if (userStoryTypes === selecteduserStoryTypes) {
      return true;
    } else {
      return false;
    }
  }

  compareSelectedBugPriorotiesFn(bugPriorities: any, selectedbugPriorities: any) {
    if (bugPriorities === selectedbugPriorities) {
      return true;
    } else {
      return false;
    }
  }

  compareProjectFeaturesFn(projectFeatureIds: any, selectedProjectFeatureIds: any) {
    if (projectFeatureIds === selectedProjectFeatureIds) {
      return true;
    } else {
      return false;
    }
  }

  compareSelectedUserStoryStatusFn(userStoryStatus: any, selectedUserStoryStatus: any) {
    if (userStoryStatus === selectedUserStoryStatus) {
      return true;
    } else {
      return false;
    }
  }

  searchGoals() {
    const goalSearchCriteria = new GoalSearchCriteriaInputModel();
    goalSearchCriteria.goalName = this.goalShortName == "" ? null : this.goalShortName;
    goalSearchCriteria.sprintName = this.sprintName == "" ? null : this.sprintName;
    goalSearchCriteria.ownerUserId = this.ownerUserId == "" ? null : this.ownerUserId;
    goalSearchCriteria.dependencyUserIds = this.dependencyUserId == "" ? null : this.dependencyUserId;
    goalSearchCriteria.bugCausedUserIds = this.bugCausedUserId == "" ? null : this.bugCausedUserId;
    goalSearchCriteria.userStoryTypeIds = this.userStoryTypeId == "" ? null : this.userStoryTypeId;
    goalSearchCriteria.bugPriorityIds = this.bugPriorityId == "" ? null : this.bugPriorityId;
    goalSearchCriteria.projectFeatureIds = this.projectFeatureId == "" ? null : this.projectFeatureId;
    goalSearchCriteria.goalResponsiblePersonId = this.goalResponsibleUserId == "" ? null : this.goalResponsibleUserId;
    goalSearchCriteria.sprintResponsiblePersonId = this.sprintResponsibleUserId == "" ? null : this.sprintResponsibleUserId;
    goalSearchCriteria.projectId = this.projectId == "" ? null : this.projectId;
    goalSearchCriteria.userStoryStatusId = this.userStoryStatusId == "" ? null : this.userStoryStatusId;
    goalSearchCriteria.goalStatusId = this.goalStatusId  == "" ? null : this.goalStatusId;
    goalSearchCriteria.sprintStatusId = this.sprintStatusId  == "" ? null : this.sprintStatusId;
    goalSearchCriteria.deadLineDateFrom = this.dateFrom == "" ? null : this.dateFrom;
    goalSearchCriteria.deadLineDateTo = this.dateTo == "" ? null : this.dateTo;
    goalSearchCriteria.sprintStartDate = this.sprintStartDate == "" ? null : this.sprintStartDate;
    goalSearchCriteria.sprintEndDate = this.sprintEndDate == "" ? null : this.sprintEndDate;
    goalSearchCriteria.createdDateFrom = this.createFrom == "" ? null : this.createFrom;
    goalSearchCriteria.createdDateTo = this.createTo == "" ? null : this.createTo;
    goalSearchCriteria.updatedDateFrom = this.updateFrom == "" ? null : this.updateFrom;
    goalSearchCriteria.updatedDateTo = this.updateTo == "" ? null : this.updateTo;
    goalSearchCriteria.isWarning = this.isWarning;
    goalSearchCriteria.isRed = this.isRed;
    goalSearchCriteria.isProductive = this.isProductiveBoard;
    goalSearchCriteria.isArchivedGoal = this.isArchivedGoal;
    goalSearchCriteria.isParkedGoal = this.isGoalParked;
    goalSearchCriteria.isTracked = this.toBeTracked;
    goalSearchCriteria.sortBy = this.sortBy == "" ? null : this.sortBy;
    goalSearchCriteria.sortDirection = this.sortByDirection == "" ? null : this.sortByDirection;
    if (this.goalTags) {
      goalSearchCriteria.tags = this.goalTags;
    } else {
      goalSearchCriteria.tags = null;
    }
    if (this.workItemTags) {
      goalSearchCriteria.workItemTags = this.workItemTags;
    } else {
      goalSearchCriteria.workItemTags = null;
    }
    goalSearchCriteria.isAdvancedSearch = true;
    goalSearchCriteria.isGoalsPage = true;
    goalSearchCriteria.isIncludedArchive = this.includeArchive;
    goalSearchCriteria.isIncludedPark = this.includePark;
    goalSearchCriteria.isOnTrack = this.isOnTrack;
    goalSearchCriteria.isNotOnTrack = this.isNotOnTrack;
    goalSearchCriteria.pageNumber = 1;
    goalSearchCriteria.userStoryName = this.userStoryName;
    goalSearchCriteria.versionName = this.versionName;
    goalSearchCriteria.isForFilters = true;
    this.goalSearch = goalSearchCriteria;
    this.goalSearch["selectedOwners"] = this.selectedOwners;
    this.goalSearch["selectedUsers"] = this.selectedUsers;
    this.goalSearch["selectedSprintUsers"] = this.selectedSprintUsers;
    this.goalSearch["selectedProjects"] = this.selectedProjects;
    this.goalSearch["selectedGoalStatus"] = this.selectedGoalStatus;
    this.goalSearch["selectedSprintStatus"] = this.selectedSprintStatus;
    this.goalSearch["selectedUserStoryStatus"] = this.selectedUserStoryStatus;
    this.goalSearch["goalShortName"] = this.goalShortName;
    this.goalSearch["sprintName"] = this.sprintName;
    this.goalSearch["goalTags"] = this.goalTags;
    this.goalSearch["workItemTags"] = this.workItemTags;
    this.goalSearch["dateFrom"] = this.dateFrom;
    this.goalSearch["dateTo"] = this.dateTo;
    this.goalSearch["sprintStartDate"] = this.sprintStartDate;
    this.goalSearch["sprintEndDate"] = this.sprintEndDate;
    this.goalSearch["selectedGoalFilters"] = this.selectedGoalFilters;
    this.goalSearch["selectedDependencyUsers"] = this.selectedDependencyUsers;
    this.goalSearch["selectedBugCausedUsers"] = this.selectedBugCausedUsers;
    this.goalSearch["selectedUserStoryTypes"] = this.selectedUserStoryTypes;
    this.goalSearch["selectedBugPriorities"] = this.selectedBugPriorities;
    this.goalSearch["selectedComponents"] = this.selectedComponents;
  }

  applyFilters() {
    this.goalSearch.sortBy = this.sortBy == "" ? null : this.sortBy;
    this.goalSearch["selectedGoalStatus"] = this.selectedGoalStatus;
    this.goalSearch["selectedSprintStatus"] = this.selectedSprintStatus;
    this.goalSearch["selectedOwners"] = this.selectedOwners;
    this.searchFilterGoals.emit(this.goalSearch);
  }

  onlySaveFilter() {
    this.onlySave = true;
  }

  closeSearchGoal() {
    this.goalShortName = "";
    this.searchGoalName();
  }

  
  closeSearchSprint() {
    this.sprintName = "";
    this.searchSprintName();
  }

  closeSearchGoalTags() {
    this.goalTags = null;
    if (this.goalStatusId === null || this.goalStatusId === "") {
      this.goalStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.bindGoalStatus(this.goalStatusId.toLowerCase());
    }
    this.searchGoals();
  }

  closeSearchWorkItemTags() {
    this.workItemTags = null;
    if (this.goalStatusId === null || this.goalStatusId === "") {
      this.goalStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
      this.bindGoalStatus(this.goalStatusId.toLowerCase());
    }
    this.searchGoals();
  }

  clearUserStoryName() {
    this.userStoryName = null;
    this.searchGoals();
  }

  clearVersionName() {
    this.versionName = null;
    this.searchGoals();
  }

  closeSearchDate() {
    this.dateFrom = "";
    this.dateTo = "";
    if (this.goalStatusId === null || this.goalStatusId === "") {
      this.goalStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
    }
    this.searchGoals();
  }

  closeSearchSprintDate() {
    this.sprintStartDate = "";
    this.sprintEndDate = "";
    if (this.sprintStatusId === null || this.sprintStatusId === "") {
      this.sprintStatusId = ConstantVariables.ActiveGoalStatusId.toLowerCase();
    }
    this.searchGoals();
  }

  closeCreateDate() {
    this.createFrom = "";
    this.createTo = "";
    this.searchGoals();
  }

  closeUpdateDate() {
    this.updateFrom = "";
    this.updateTo = "";
    this.searchGoals();
  }

  toggleUserStoryStatusSelected(all) {
    if (this.allUserStoryStatusSelected.selected) {
      this.allUserStoryStatusSelected.deselect();
      return false;
    }
    if (
      this.selectStatusId.controls.userStoryStatusId.value.length ===
      this.userStoryStatusList.length
    ) {
      this.allUserStoryStatusSelected.select();
    }
  }

  toggleGoalStatusSelected(all) {
    if (this.allGoalStatusSelected.selected) {
      this.allGoalStatusSelected.deselect();
      return false;
    }
    if (
      this.selectGoalStatusId.controls.goalStatusId.value.length ===
      this.goalStatusList.length
    ) {
      this.allGoalStatusSelected.select();
    }
  }

  toggleSprintStatusSelected(all) {
    if (this.allSprintStatusSelected.selected) {
      this.allSprintStatusSelected.deselect();
      return false;
    }
    if (
      this.selectSprintStatusId.controls.sprintStatusId.value.length ===
      this.sprintStatusList.length
    ) {
      this.allSprintStatusSelected.select();
    }
  }

  toggleProjectsSelected(all) {
    if (this.allProjectsSelected.selected) {
      this.allProjectsSelected.deselect();
      return false;
    }
    if (
      this.selectProjectId.controls.projectId.value.length ===
      this.projectsList.length
    ) {
      this.allProjectsSelected.select();
    }
  }

  toggleResponsiblePersonSelected(all) {
    if (this.allMembersSelected.selected) {
      this.allMembersSelected.deselect();
      return false;
    }
    if (
      this.selectGoalResponsibleId.controls.goalResponsibleUserId.value.length ===
      this.UsersList.length
    ) {
      this.allMembersSelected.select();
    }
  }

  
  toggleSprintResponsiblePersonSelected(all) {
    if (this.allSprintMembersSelected.selected) {
      this.allSprintMembersSelected.deselect();
      return false;
    }
    if (
      this.selectSprintResponsibleId.controls.sprintResponsibleUserId.value.length ===
      this.UsersList.length
    ) {
      this.allSprintMembersSelected.select();
    }
  }


  toggleOwnerSelected(all) {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (
      this.selectOwnerId.controls.ownerUserId.value.length ===
      this.UsersList.length
    ) {
      this.allSelected.select();
    }
  }

  toggleDependencySelected(all) {
    if (this.allDependencySelected.selected) {
      this.allDependencySelected.deselect();
      return false;
    }
    if (
      this.selectDependencyUserId.controls.dependencyUserId.value.length ===
      this.UsersList.length
    ) {
      this.allDependencySelected.select();
    }
  }

  toggleBugCausedSelected(all) {
    if (this.allBugCausedSelected.selected) {
      this.allBugCausedSelected.deselect();
      return false;
    }
    if (
      this.selectBugCausedUserId.controls.bugCausedUserId.value.length ===
      this.UsersList.length
    ) {
      this.allBugCausedSelected.select();
    }
  }

  toggleUserStorySelected(all) {
    if (this.allUserStoryTypesSelected.selected) {
      this.allUserStoryTypesSelected.deselect();
      return false;
    }
    if (
      this.selectUserStoryTypeForm.controls.userStoryTypeId.value.length ===
      this.userStoryTypes.length
    ) {
      this.allUserStoryTypesSelected.select();
    }
  }

  toggleBugPrioritySelected(all) {
    if (this.allBugPrioritySelected.selected) {
      this.allBugPrioritySelected.deselect();
      return false;
    }
    if (
      this.selectBugPriority.controls.bugPriorityId.value.length ===
      this.bugPriorities.length
    ) {
      this.allBugPrioritySelected.select();
    }
  }

  toggleProjectFeatureSelected(all) {
    if (this.allProjectFeaturesSelectedOption.selected) {
      this.allProjectFeaturesSelectedOption.deselect();
      return false;
    }
    if (
      this.selectComponent.controls.projectFeatureId.value.length ===
      this.projectFeatures.length
    ) {
      this.allProjectFeaturesSelectedOption.select();
    }
  }

  searchByEmployee() {
    this.employeeSelectedValue = false;
    const searchEmployee = JSON.parse(JSON.stringify(this.searchEmployee));
    const userModel = new UserModel();
    userModel.employeeNameText = searchEmployee;
    this.store.dispatch(new LoadFeedTimeSheetUsersTriggered(userModel));
  }

  closeSearchEmployee() {
    this.searchEmployee = "";
    const userModel = new UserModel();
    userModel.employeeNameText = this.searchEmployee;
    this.store.dispatch(new LoadFeedTimeSheetUsersTriggered(userModel));
  }

  displayFn(EmployeeId) {
    if (!EmployeeId) {
      return "";
    } else {
      const Employee = this.employeeList.find((employee) => employee.id === EmployeeId);
      return Employee.fullName;
    }
  }

  closeFilterDialog() {
    this.goalFilterSatPopOver.close();
  }

  saveAdvancedGoalFilters() {
    if (this.goalFilterId) {
      this.isNew = false;
    } else {
      this.isNew = true;
    }
    this.userGoalFilter = this.advancedSearchFiltersForm.value;
    const goalFilters = new GoalsFilter();
    if (this.goalStatusId) {
      goalFilters.goalStatusIds = this.goalStatusId;
    }
    if (this.sprintStatusId) {
      goalFilters.sprintStatusIds = this.sprintStatusId;
    }
    if (this.ownerUserId) {
      goalFilters.ownerUserIds = this.ownerUserId;
    }
    if (this.userStoryStatusId) {
      goalFilters.userStoryStatusIds = this.userStoryStatusId;
    }
    if (this.goalResponsibleUserId) {
      goalFilters.goalResponsiblePersonIds = this.goalResponsibleUserId;
    }
    if (this.sprintResponsibleUserId) {
      goalFilters.sprintResponsiblePersonIds = this.sprintResponsibleUserId;
    }
    if (this.projectId) {
      goalFilters.projectIds = this.projectId;
    }
    if (this.goalShortName) {
      goalFilters.goalName = this.goalShortName;
    }
    if (this.sprintName) {
      goalFilters.sprintName = this.sprintName;
    }
    if (this.dateFrom) {
      goalFilters.deadlineDateFrom = this.dateFrom;
    }
    if (this.dateTo) {
      goalFilters.deadlineDateTo = this.dateTo;
    }
    if (this.sprintStartDate) {
      goalFilters.sprintStartDate = this.sprintStartDate;
    }
    if (this.sprintEndDate) {
      goalFilters.sprintEndDate = this.sprintEndDate;
    }
    if (this.goalTags) {
      goalFilters.goalTags = this.goalTags;
    }
    if (this.workItemTags) {
      goalFilters.workItemTags = this.workItemTags;
    }
    if (this.dependencyUserId) {
      goalFilters.dependencyUserIds = this.dependencyUserId;
    }
    if (this.bugCausedUserId) {
      goalFilters.bugCausedUserIds = this.bugCausedUserId;
    }
    if (this.versionName) {
      goalFilters.versionName = this.versionName;
    }

    if (this.userStoryName) {
      goalFilters.userStoryName = this.userStoryName;
    }
    if (this.bugPriorityId) {
      goalFilters.bugPriorityIds = this.bugPriorityId;
    }
    if (this.projectFeatureId) {
      goalFilters.projectFeatureIds = this.projectFeatureId;
    }

    if (this.createFrom) {
      goalFilters.createdDateFrom = this.createFrom;
    }

    if (this.createTo) {
      goalFilters.createdDateTo = this.createTo;
    }

    if (this.updateFrom) {
      goalFilters.updatedDateFrom = this.updateFrom;
    }

    if (this.createTo) {
      goalFilters.updatedDateTo = this.updateTo;
    }

    if (this.sortBy) {
      goalFilters.sortBy = this.sortBy;
    }

    if (this.userStoryTypeId) {
      goalFilters.userStoryTypeIds = this.userStoryTypeId;
    }

    goalFilters.isIncludeArchived = this.includeArchive;
    goalFilters.isIncludeParked = this.includePark;
    goalFilters.isOnTrack = this.isOnTrack;
    goalFilters.isNotOnTrack = this.isNotOnTrack;
    goalFilters.isTrackedGoals = this.toBeTracked;
    goalFilters.isProductiveGoals = this.isProductiveBoard;
    goalFilters.isOnTrack = this.isOnTrack;
    goalFilters.isNotOnTrack = this.isNotOnTrack;
    this.userGoalFilter.goalFilterDetailsJsonModel = goalFilters;
    this.userGoalFilter.goalFilterId = this.goalFilterId;
    this.userGoalFilter.goalFilterDetailsId = this.goalFilterDetailsId;
    this.saveGoalFilterModel = goalFilters;
    this.store.dispatch(new UpsertGoalFiltersTriggered(this.userGoalFilter));
  }

  openAdvancedSearchDialog() {
    this.loadProjectsList();
    this.loadUserStoryStatusList();
    const advancedSearchDialog = this.dialog.open(AdvancedSearchFiltersComponent, {
      minWidth: "50vw",
      minHeight: "50vh",
      data: {
        goalFilterId: this.goalFilterId,
        isPermissionExists: this.canAccess_feature_DeleteGoalFilter
      }
    });

    advancedSearchDialog.afterClosed().subscribe((result) => {
    });

    advancedSearchDialog.componentInstance.closeMatDialog.subscribe((result) => {
      this.dialog.closeAll();
    })

    advancedSearchDialog.componentInstance.goalFilterDetailsJson.subscribe((result) => {
      this.dialog.closeAll();
      this.bindData(result)
    })
  }

  bindData(result) {
    this.goalFilterId = result.goalFilterId;
    this.goalFilterName = result.goalFilterName;
    this.filterName = result.goalFilterName;
    this.goalFilters = result;
    this.clearGoalFiltersForm();
    this.goalShortName = result.goalFilterDetailsJsonModel.goalName;
    this.sprintName = result.goalFilterDetailsJsonModel.sprintName;
    this.ownerUserId = result.goalFilterDetailsJsonModel.ownerUserIds;
    this.goalResponsibleUserId = result.goalFilterDetailsJsonModel.goalResponsiblePersonIds;
    this.sprintResponsibleUserId = result.goalFilterDetailsJsonModel.sprintResponsiblePersonIds;
    this.projectId = result.goalFilterDetailsJsonModel.projectIds;
    this.userStoryStatusId = result.goalFilterDetailsJsonModel.userStoryStatusIds;
    this.goalStatusId = result.goalFilterDetailsJsonModel.goalStatusIds;
    this.sprintStatusId = result.goalFilterDetailsJsonModel.sprintStatusIds;
    this.dateFrom = result.goalFilterDetailsJsonModel.deadlineDateFrom;
    this.dateTo = result.goalFilterDetailsJsonModel.deadlineDateTo;
    this.sprintStartDate = result.goalFilterDetailsJsonModel.sprintStartDate;
    this.sprintEndDate = result.goalFilterDetailsJsonModel.sprintEndDate;
    this.isProductiveBoard = result.goalFilterDetailsJsonModel.isProductiveGoals;
    this.isArchivedGoal = result.goalFilterDetailsJsonModel.isArchivedGoal;
    this.isGoalParked = result.goalFilterDetailsJsonModel.isGoalParked;
    this.toBeTracked = result.goalFilterDetailsJsonModel.isTrackedGoals;
    this.includeArchive = result.goalFilterDetailsJsonModel.isIncludeArchived;
    this.includePark = result.goalFilterDetailsJsonModel.isIncludeParked;
    this.isOnTrack = result.goalFilterDetailsJsonModel.isOnTrack;
    this.isNotOnTrack = result.goalFilterDetailsJsonModel.isNotOnTrack;
    this.goalTags = result.goalFilterDetailsJsonModel.goalTags;
    this.workItemTags = result.goalFilterDetailsJsonModel.workItemTags;
    this.dependencyUserId = result.goalFilterDetailsJsonModel.dependencyUserIds;
    this.bugCausedUserId = result.goalFilterDetailsJsonModel.bugCausedUserIds;
    this.userStoryStatusId = result.goalFilterDetailsJsonModel.userStoryStatusIds;
    this.userStoryName = result.goalFilterDetailsJsonModel.userStoryName;
    this.versionName = result.goalFilterDetailsJsonModel.versionName;
    this.bugPriorityId = result.goalFilterDetailsJsonModel.bugPriorityIds;
    this.projectFeatureId = result.goalFilterDetailsJsonModel.projectFeatureIds;
    this.createFrom = result.goalFilterDetailsJsonModel.createdDateFrom;
    this.createTo = result.goalFilterDetailsJsonModel.createdDateTo;
    this.updateFrom = result.goalFilterDetailsJsonModel.updatedDateFrom;
    this.updateTo = result.goalFilterDetailsJsonModel.updatedDateTo;
    this.sortBy = result.goalFilterDetailsJsonModel.sortBy;
    this.selectedOrderValue = this.sortBy;
    this.userStoryTypeId = result.goalFilterDetailsJsonModel.userStoryTypeIds;
    if (this.toBeTracked == true) {
      this.isTrackedGoals = "Tracked";
      this.selectedOptions.push(this.isTrackedGoals);
    } else {
      var index = this.selectedOptions.indexOf(this.isTrackedGoals);
      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      }
      this.isTrackedGoals = "";
    }
    if (this.isProductiveBoard == true) {
      this.isProductiveGoals = "Productive";
      this.selectedOptions.push(this.isProductiveGoals);
    } else {
      var index = this.selectedOptions.indexOf(this.isProductiveGoals);
      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      }
      this.isProductiveGoals = "";
    }
    if (this.includeArchive == true) {
      this.isIncludedArchive = "Include archive"
      this.selectedOptions.push(this.isIncludedArchive);
    } else {
      var index = this.selectedOptions.indexOf(this.isIncludedArchive);
      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      }
      this.isIncludedArchive = "";
    }

    if (this.includePark == true) {
      this.isIncludedPark = "Include park"
      this.selectedOptions.push(this.isIncludedPark);
    } else {
      var index = this.selectedOptions.indexOf(this.isIncludedPark);
      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      }
      this.isIncludedPark = "";
    }

    if (this.isOnTrack == true) {
      this.isOnTracked = "Is on track"
      this.selectedOptions.push(this.isOnTracked);
    } else {
      var index = this.selectedOptions.indexOf(this.isOnTracked);
      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      }
      this.isOnTracked = "";
    }

    if (this.isNotOnTrack == true) {
      this.isNotOnTracked = "Is not on track"
      this.selectedOptions.push(this.isNotOnTracked);
    } else {
      var index = this.selectedOptions.indexOf(this.isNotOnTracked);
      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      }
      this.isNotOnTracked = "";
    }
    this.selectedGoalFilters = this.selectedOptions.toString();
    this.selectedSprintStatus = null;
    this.cdRef.detectChanges();
    this.clearSelectOwnerUserIdForm();
    this.clearSelectGoalResponsiblePersonForm();
    this.clearSelectSprintResponsiblePersonForm();
    this.clearSelectProjectsForm();
    this.clearGoalStatusForm();
    this.clearSprintStatusForm();
    this.clearUserStoryStatusForm();
    this.clearSelectDependencyUserIdForm();
    this.clearSelectBugCausedUserIdForm();
    this.clearUserStoryTypeForm()
    this.clearBugPriorityForm()
    this.clearComponentForm()
    this.bindUserStoryStatus(this.userStoryStatusId);
    this.bindUserStoryType(this.userStoryTypeId);
    this.bindBugPriority(this.bugPriorityId);
    this.bindProjectFeature(this.projectFeatureId);
    this.bindGoalStatus(this.goalStatusId);
    this.bindSprintStatus(this.sprintStatusId);
    this.bindProjectsList(this.projectId);
    this.bindUserStoryOwners(this.ownerUserId);
    this.bindGoalResponsiblePersons(this.goalResponsibleUserId);
    this.bindSprintResponsiblePersons(this.sprintResponsibleUserId);
    this.bindDependencyUser(this.dependencyUserId);
    this.bindBugCausedUser(this.bugCausedUserId);
    this.searchGoals();
  }

  public ngOnDestroy() {
    this.ngDestroyed$.next();
  }

  clearWorkItemFilter() {
    this.ownerUserId = "";
    this.selectedOwners = "";
    this.clearSelectOwnerUserIdForm();
    this.searchGoals();
  }

  clearResponsibleFilter() {
    this.goalResponsibleUserId = "";
    this.clearSelectGoalResponsiblePersonForm();
    this.searchGoals();
  }

  clearProjects() {
    this.projectId = "";
    this.clearSelectProjectsForm();
    this.searchGoals();
  }

  clearGoalFilter() {
    this.goalStatusId = "";
    this.clearStatusForm();
    this.searchGoals();
  }

  clearStatusForm() {
    this.selectedGoalStatus = null;
    let goalStatus = [];
    if (this.goalStatusId) {
      goalStatus = this.goalStatusId.split(",")
    } else {
      goalStatus = [];
    }
    goalStatus = goalStatus.map(function (x) { return x.toLowerCase(); })
    this.selectGoalStatusId = this.fb.group({
      goalStatusId: new FormControl(goalStatus)
    });
  }

  clearUserStoryStatusFilter() {
    this.userStoryStatusId = ""
    this.clearUserStoryStatusForm();
    this.searchGoals();
  }

  clearOptions() {
    this.includePark = null;
    this.isOnTrack = null;
    this.isNotOnTrack = null;
    this.isOnTracked = "";
    this.isNotOnTracked = "";
    this.includeArchive = null;
    this.isIncludedArchive = "";
    this.isIncludedPark = "";
    this.isProductiveGoals = "";
    this.isTrackedGoals = "";
    this.toBeTracked = null;
    this.isProductiveBoard = null;
    this.isGoalParked = null;
    this.isArchivedGoal = null;
    this.selectedGoalFilters = null;
    this.selectedOptions = [];
    this.searchGoals();
  }

  setColorForBugPriorityTypes(color) {
    const styles = {
      color
    };
    return styles;
  }

}
