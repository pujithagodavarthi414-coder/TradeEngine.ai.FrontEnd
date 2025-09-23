import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { GoalSearchCriteriaInputModel } from '../../models/GoalSearchCriteriaInputModel';
import { GoalStatusDropDownData } from '../../models/goalStatusDropDown';
import { StatusesModel } from '../../models/workflowStatusesModel';
import { State } from "../../store/reducers/index";
import { select, Store } from "@ngrx/store";
import * as projectModuleReducer from "../../store/reducers/index";
import { tap } from 'rxjs/operators';
import { LoadGoalStatusTriggered } from '../../store/actions/goalStatus.action';
import * as _ from "underscore";
import { Project } from '../../models/project';
import { User } from '../../models/user';
import { ProjectSearchCriteriaInputModel } from '../../models/ProjectSearchCriteriaInputModel';
import { LoadProjectsTriggered } from '../../store/actions/project.actions';
import { LoadUsersTriggered } from '../../store/actions/users.actions';
import { LoadUserStoryStatusTriggered } from '../../store/actions/userStoryStatus.action';
import { UserStoryTypesModel } from '../../models/userStoryTypesModel';
import { LoadUserStoryTypesTriggered } from '../../store/actions/user-story-types.action';
import { ProjectFeature } from '../../models/projectFeature';
import { LoadFeatureProjectsTriggered } from '../../store/actions/project-features.actions';
import { LoadBugPriorityTypesTriggered } from '../../store/actions/bug-priority.action';
import { BugPriorityDropDownData } from '../../models/bugPriorityDropDown';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: "all-goals-filter-dialog",
  templateUrl: "./all-goals-filters-dialog.component.html"
})
export class AllGoalsFilterComponent extends CustomAppBaseComponent {

  @Output() getGoalsBasedOnFilter = new EventEmitter<any>();
  uniquegoalpage: boolean;
  loading: boolean;
  editFilters: any;
  tabIndex: number = 0;
  sprintStatusList: any[] = [];
  goalStatus$: Observable<GoalStatusDropDownData[]>;
  userStoryStatus$: Observable<StatusesModel[]>;
  goalStatusList: GoalStatusDropDownData[];
  selectedGoalStatus: string;
  projectsList: Project[];
  selectedProjects: string;
  UsersList: User[];
  selectedOwners: string;
  userStoryStatusList: StatusesModel[];
  selectedUserStoryStatus: string;
  selectedUsers: string;
  projectSearchResults$: Observable<Project[]>;
  projectResponsiblePersons$: Observable<User[]>;
  selectedOptions: any[] = [];
  updateText: boolean;
  dependencyUserId: string;
  selectedDependencyUsers: string;
  selectedBugCausedUsers: string;
  userStoryTypeId: string;
  selectedUserStoryTypes: string;
  userStoryTypes$: Observable<UserStoryTypesModel[]>;
  userStoryTypes: UserStoryTypesModel[];
  selectedComponents: string;
  projectFeature$: Observable<ProjectFeature[]>;
  projectFeatures: ProjectFeature[];
  bugPriorities$: Observable<BugPriorityDropDownData[]>;
  bugPriorities: BugPriorityDropDownData[];
  selectedBugPriorities: string;
  selectedSprintStatus: string;
  tabText: string;
  selectedSprintUsers: string;

  constructor(public filterDialog: MatDialogRef<AllGoalsFilterComponent>, private store: Store<State>, private cdRef: ChangeDetectorRef, private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA)
    public data: any) {
    super();
    this.uniquegoalpage = this.data.uniquegoalpage;
    this.loadProjectsList();
    this.loadUserStoryStatusList();
    this.loadUsersList();
    this.loadGoalStatusList();
    this.loadWorkItemTypes();
    this.loadBugPriority();
    this.loadProjectFeature();
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
  }

  ngOnInit() {
    super.ngOnInit();
    this.tabText = this.translateService.instant('ADVANCEDSEARCH.CREATEFILTER');
  }

  getFilters(event) {
    this.getGoalsBasedOnFilter.emit(event);
  }

  applySavedFilters(result) {
    const goalSearchCriteria = new GoalSearchCriteriaInputModel();
    goalSearchCriteria.goalName = result.goalFilterDetailsJsonModel.goalName;
    goalSearchCriteria.sprintName = result.goalFilterDetailsJsonModel.sprintName;
    goalSearchCriteria.ownerUserId = result.goalFilterDetailsJsonModel.ownerUserIds;
    goalSearchCriteria.goalResponsiblePersonId = result.goalFilterDetailsJsonModel.goalResponsiblePersonIds;
    goalSearchCriteria.sprintResponsiblePersonId = result.goalFilterDetailsJsonModel.sprintResponsiblePersonIds;
    goalSearchCriteria.projectId = result.goalFilterDetailsJsonModel.projectIds;
    goalSearchCriteria.userStoryStatusId = result.goalFilterDetailsJsonModel.userStoryStatusIds;
    goalSearchCriteria.goalStatusId = result.goalFilterDetailsJsonModel.goalStatusIds;
    goalSearchCriteria.sprintStatusId = result.goalFilterDetailsJsonModel.sprintStatusIds;
    goalSearchCriteria.deadLineDateFrom = result.goalFilterDetailsJsonModel.deadlineDateFrom;
    goalSearchCriteria.deadLineDateTo = result.goalFilterDetailsJsonModel.deadlineDateTo;
    goalSearchCriteria.sprintStartDate = result.goalFilterDetailsJsonModel.sprintStartDate;
    goalSearchCriteria.sprintEndDate = result.goalFilterDetailsJsonModel.sprintEndDate;
    goalSearchCriteria.createdDateFrom = result.goalFilterDetailsJsonModel.createdDateFrom;
    goalSearchCriteria.createdDateTo = result.goalFilterDetailsJsonModel.createdDateTo;
    goalSearchCriteria.updatedDateFrom = result.goalFilterDetailsJsonModel.updatedDateFrom;
    goalSearchCriteria.updatedDateTo = result.goalFilterDetailsJsonModel.updatedDateTo;
    goalSearchCriteria.isWarning = result.goalFilterDetailsJsonModel.isWarning;

    goalSearchCriteria.isRed = result.goalFilterDetailsJsonModel.isRed;

    goalSearchCriteria.isProductive = result.goalFilterDetailsJsonModel.isProductiveGoals;
    goalSearchCriteria.isArchivedGoal = result.goalFilterDetailsJsonModel.isArchivedGoal;
    goalSearchCriteria.isParkedGoal = result.goalFilterDetailsJsonModel.isGoalParked;
    goalSearchCriteria.isTracked = result.goalFilterDetailsJsonModel.isTrackedGoals;
    goalSearchCriteria.sortBy = result.goalFilterDetailsJsonModel.sortBy;
    goalSearchCriteria.sortDirection = result.goalFilterDetailsJsonModel.sortByDirection;
    goalSearchCriteria.dependencyUserIds = result.goalFilterDetailsJsonModel.dependencyUserIds;
    goalSearchCriteria.bugCausedUserIds = result.goalFilterDetailsJsonModel.bugCausedUserIds;
    goalSearchCriteria.userStoryTypeIds = result.goalFilterDetailsJsonModel.userStoryTypeIds;
    goalSearchCriteria.bugPriorityIds = result.goalFilterDetailsJsonModel.bugPriorityIds;
    if (result.goalFilterDetailsJsonModel.goalTags) {
      goalSearchCriteria.tags = result.goalFilterDetailsJsonModel.goalTags;
    } else {
      goalSearchCriteria.tags = null;
    }
    if (result.goalFilterDetailsJsonModel.workItemTags) {
      goalSearchCriteria.workItemTags = result.goalFilterDetailsJsonModel.workItemTags;
    } else {
      goalSearchCriteria.workItemTags = null;
    }
    goalSearchCriteria.isAdvancedSearch = true;
    goalSearchCriteria.isGoalsPage = true;
    goalSearchCriteria.isIncludedArchive = result.goalFilterDetailsJsonModel.isIncludeArchived;
    goalSearchCriteria.isIncludedPark = result.goalFilterDetailsJsonModel.isIncludeParked;
    goalSearchCriteria.isOnTrack = result.goalFilterDetailsJsonModel.isOnTrack;
    goalSearchCriteria.isNotOnTrack = result.goalFilterDetailsJsonModel.isNotOnTrack;
    goalSearchCriteria.userStoryName = result.goalFilterDetailsJsonModel.userStoryName;
    goalSearchCriteria.projectFeatureIds = result.goalFilterDetailsJsonModel.projectFeatureIds;
    goalSearchCriteria.isForFilters = true;
    goalSearchCriteria.pageNumber = 1;
    this.bindGoalStatus(result.goalFilterDetailsJsonModel.goalStatusIds);
    this.bindSprintStatus(result.goalFilterDetailsJsonModel.sprintStatusIds);
    this.bindProjectsList(result.goalFilterDetailsJsonModel.projectIds);
    this.bindUserStoryOwners(result.goalFilterDetailsJsonModel.ownerUserIds);
    this.bindUserStoryStatus(result.goalFilterDetailsJsonModel.userStoryStatusIds);
    this.bindGoalResponsiblePersons(result.goalFilterDetailsJsonModel.goalResponsiblePersonIds);
    this.bindSprintResponsiblePersons(result.goalFilterDetailsJsonModel.sprintResponsiblePersonIds);
    this.bindDependencyUser(result.goalFilterDetailsJsonModel.dependencyUserIds);
    this.bindBugCausedUser(result.goalFilterDetailsJsonModel.bugCausedUserIds);
    this.bindUserStoryType(result.goalFilterDetailsJsonModel.userStoryTypeIds)
    this.bindProjectFeature(result.goalFilterDetailsJsonModel.projectFeatureIds);
    this.bindBugPriority(result.goalFilterDetailsJsonModel.bugPriorityIds);
    goalSearchCriteria["selectedOwners"] = this.selectedOwners;
    goalSearchCriteria["selectedUsers"] = this.selectedUsers;
    goalSearchCriteria["selectedSprintUsers"] = this.selectedSprintUsers;
    goalSearchCriteria["selectedProjects"] = this.selectedProjects;
    goalSearchCriteria["selectedGoalStatus"] = this.selectedGoalStatus;
    goalSearchCriteria["selectedSprintStatus"] = this.selectedSprintStatus;
    goalSearchCriteria["selectedUserStoryStatus"] = this.selectedUserStoryStatus;
    goalSearchCriteria["goalShortName"] = result.goalFilterDetailsJsonModel.goalName;
    goalSearchCriteria["sprintName"] = result.goalFilterDetailsJsonModel.sprintName;
    goalSearchCriteria["goalTags"] = result.goalFilterDetailsJsonModel.goalTags;
    goalSearchCriteria["workItemTags"] = result.goalFilterDetailsJsonModel.workItemTags;
    goalSearchCriteria["dateFrom"] = result.goalFilterDetailsJsonModel.deadlineDateFrom;
    goalSearchCriteria["dateTo"] = result.goalFilterDetailsJsonModel.deadlineDateTo;
    goalSearchCriteria["sprintStartDate"] = result.goalFilterDetailsJsonModel.sprintStartDate;
    goalSearchCriteria["sprintEndDate"] = result.goalFilterDetailsJsonModel.sprintEndDate;
    goalSearchCriteria["selectedDependencyUsers"] = this.selectedDependencyUsers;
    goalSearchCriteria["selectedBugCausedUsers"] = this.selectedBugCausedUsers;
    goalSearchCriteria["selectedUserStoryTypes"] = this.selectedUserStoryTypes;
    goalSearchCriteria["selectedComponents"] = this.selectedComponents;
    goalSearchCriteria["selectedBugPriorities"] = this.selectedBugPriorities;
    if (result.goalFilterDetailsJsonModel.isTrackedGoals) {
      this.selectedOptions.push("Tracked");
    }
    if (result.goalFilterDetailsJsonModel.isProductiveGoals) {
      this.selectedOptions.push("Productive");
    }
    if (result.goalFilterDetailsJsonModel.isIncludeArchived) {
      this.selectedOptions.push("Include archive");
    }
    if (result.goalFilterDetailsJsonModel.isIncludeParked) {
      this.selectedOptions.push("Include park");
    }
    if (result.goalFilterDetailsJsonModel.isOnTrack) {
      this.selectedOptions.push("Is on track");
    }
    if (result.goalFilterDetailsJsonModel.isNotOnTrack) {
      this.selectedOptions.push("Is not on track");
    }
    goalSearchCriteria["selectedGoalFilters"] = this.selectedOptions.length > 0 ? this.selectedOptions : null;
    this.getGoalsBasedOnFilter.emit(goalSearchCriteria);
  }

  editFilter(event) {
    this.editFilters = event;
    this.updateText = true;
    this.tabText = this.translateService.instant('ADVANCEDSEARCH.UPDATEFILTER');
    this.tabIndex = 1;
  }

  onTabClick(event) {
    if (this.tabIndex == 0) {
      this.tabText = this.translateService.instant('ADVANCEDSEARCH.CREATEFILTER');
      this.updateText = false;
    }
    this.editFilters = null;
  }

  onNoClick(): void {
    this.filterDialog.close();
  }

  loadGoalStatusList() {
    this.goalStatus$ = this.store.pipe(
      select(projectModuleReducer.getgoalStatusAll));
    this.goalStatus$.subscribe((result) => {
      this.goalStatusList = result;
    })
    if (!this.goalStatusList || this.goalStatusList.length === 0) {
      this.store.dispatch(new LoadGoalStatusTriggered());
    }

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
        this.cdRef.detectChanges();
      }
    }
    else {
      this.selectedGoalStatus = "";
    }
  }

  bindSprintStatus(goalStatusId) {
    if (goalStatusId) {
      const goalStatusList = this.sprintStatusList;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(goalStatusList, function (sprintStatus: any) {
        return goalStatusId.toString().toUpperCase().includes(sprintStatus.sprintStatusId.toUpperCase())
      })
      if (filteredList) {
        const selectedSprintStatus = filteredList.map((x) => x.sprintStatusName);
        this.selectedSprintStatus = selectedSprintStatus.toString();
        this.cdRef.detectChanges();
      }
    }
    else {
      this.selectedSprintStatus = "";
    }
  }

  loadProjectsList() {
    const projectSearchResult = new ProjectSearchCriteriaInputModel();
    projectSearchResult.isArchived = false;
    this.projectSearchResults$ = this.store.pipe(select(projectModuleReducer.getProjectsAll));
    this.projectSearchResults$.subscribe((result) => {
      this.projectsList = result;
    })
    if (!this.projectsList || this.projectsList.length === 0) {
      this.store.dispatch(new LoadProjectsTriggered(projectSearchResult));
    }
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

  loadUsersList() {
    this.projectResponsiblePersons$ = this.store.pipe(
      select(projectModuleReducer.getUsersAll));
    this.projectResponsiblePersons$.subscribe((result) => {
      this.UsersList = result;
    })
    if (!this.UsersList || this.UsersList.length === 0) {
      this.store.dispatch(new LoadUsersTriggered());
    }
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

  loadUserStoryStatusList() {

    this.userStoryStatus$ = this.store.pipe(
      select(projectModuleReducer.getUserStoryStatusAll));
    this.userStoryStatus$.subscribe((result) => {
      this.userStoryStatusList = result;
    })
    if (!this.userStoryStatusList || this.userStoryStatusList.length === 0) {
      this.store.dispatch(new LoadUserStoryStatusTriggered());
    }
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

  bindSprintResponsiblePersons(sprintResponsibleUserId) {
    if (sprintResponsibleUserId) {
      const projectMembers = this.UsersList;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(projectMembers, function (member) {
        return sprintResponsibleUserId.toString().includes(member.id);
      })

      const selectedSprintUsers = filteredList.map((x) => x.fullName);
      this.selectedSprintUsers = selectedSprintUsers.toString();
    } else {
      this.selectedSprintUsers = "";
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

  loadWorkItemTypes() {
    let userStoryTypesModel = new UserStoryTypesModel();
    userStoryTypesModel.isArchived = false;
    this.userStoryTypes$ = this.store.pipe(select(projectModuleReducer.getUserStoryTypesAll)
    );
    this.userStoryTypes$.subscribe((result) => {
      this.userStoryTypes = result;
    })
    if (!this.userStoryTypes || this.userStoryTypes.length == 0) {
      this.store.dispatch(new LoadUserStoryTypesTriggered(userStoryTypesModel));
    }
  }

  loadProjectFeature() {
    const projectFeature = new ProjectFeature();
    projectFeature.IsDelete = false;
    this.projectFeature$ = this.store.pipe(
      select(projectModuleReducer.getProjectFeaturesAll)
    );
    this.projectFeature$.subscribe((result) => {
      this.projectFeatures = result;
    })
    if (!this.projectFeatures || this.projectFeatures.length == 0) {
      this.store.dispatch(new LoadFeatureProjectsTriggered(projectFeature));
    }
  }

  bindProjectFeature(projectFeatureId) {
    if (projectFeatureId) {
      const bugPriorities = this.projectFeatures;
      // tslint:disable-next-line: only-arrow-functions
      const filteredList = _.filter(bugPriorities, function (member) {
        return projectFeatureId.toString().includes(member.projectFeatureId);
      })
      const selectedComponents = filteredList.map((x) => x.projectFeatureName);
      this.selectedComponents = selectedComponents.toString();
    } else {
      this.selectedComponents = "";
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

  loadBugPriority() {
    this.bugPriorities$ = this.store.pipe(
      select(projectModuleReducer.getBugPriorityAll)
    );
    this.bugPriorities$.subscribe((result) => {
      this.bugPriorities = result;
    })
    if (!this.bugPriorities || this.bugPriorities.length === 0) {
      this.store.dispatch(new LoadBugPriorityTypesTriggered());
    }
  }

}