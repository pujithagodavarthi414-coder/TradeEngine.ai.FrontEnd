// tslint:disable-next-line: ordered-imports
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, NgModuleRef, ViewContainerRef, NgModuleFactoryLoader, NgModuleFactory, Type, ComponentFactoryResolver, Compiler, Inject } from "@angular/core";
// tslint:disable-next-line: ordered-imports
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs/internal/Observable";

import { ConstantVariables } from "../../../globaldependencies/constants/constant-variables";


//import { EntityRolesByUserIdFetchTriggered } from "../../../../shared/store/actions/authentication.actions";
import { SearchAllGoals } from "../../store/actions/goal.actions";

// tslint:disable-next-line:ordered-imports
import { MatDialog } from "@angular/material/dialog";
//import { EntityTypeFeatureIds } from "app/common/constants/entitytype-feature-ids";
import { State } from "../../store/reducers/index";
import { ProjectsDialogComponent } from "../dialogs/projects-dialog.component";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { GoalSearchCriteriaInputModel } from '../../models/GoalSearchCriteriaInputModel';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { EntityTypeFeatureIds } from '../../../globaldependencies/constants/entitytype-feature-ids';
import * as _ from 'underscore';
import { FeatureIds } from '../../../globaldependencies/constants/feature-ids';
import { MenuItemService } from '../../services/feature.service';
import { ProjectModulesService } from '../../services/project.modules.service';
import { CookieService } from 'ngx-cookie-service';
import { AllGoalsFilterComponent } from '../dialogs/all-goals-filters-dialog.component';
import { ExtraFiltersComponent } from '../dialogs/extra-filters.component';
import { TestrailMileStoneBaseComponent, TestSuitesViewComponent } from "@snovasys/snova-testrepo";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };


@Component({
  selector: "app-allgoalslist",
  templateUrl: "all-goals.page.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class GoalsPageComponent extends CustomAppBaseComponent implements OnInit {
  activeGoalsSearchCriteria: GoalSearchCriteriaInputModel;
  isFiltersVisible: boolean;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  anyOperationInProgress$: Observable<boolean>;
  roleFeaturesIsInProgress$: Observable<boolean>;
  viewProjects$: Observable<boolean>;
  viewProjects: boolean;
  Projects: string = "Projects"
  AdvancesSearch = true;
  uniquegoalid: string;
  projectSrcImg: string = null;
  projects: string = ConstantVariables.Projects;
  uniquegoalpage: boolean;
  goalsCount = 0;
  injector: any;
  testSuitView: any;
  isTestrailLoaded: boolean;
  filtersData: any;
  showMoreFilters: boolean;
  filterName: string;
  sortBy: string;
  sortByText: string;
  isInput: any;
  isSprintsEnable: boolean;
  isSprintsView: boolean;
  constructor(
    public dialog: MatDialog,
    private store: Store<State>,
    private featureService: MenuItemService,
    private cdRef: ChangeDetectorRef,
    private ngModuleRef: NgModuleRef<any>,
    private vcr: ViewContainerRef,
    @Inject('ProjectModuleLoader') public projectModulesService: any, private compiler: Compiler,
    private cookieService: CookieService
  ) {
    super();
    this.getEntityRoleFeaturesByUserId();
    this.getCompanySettings();
    this.injector = this.vcr.injector;
    //this.store.dispatch(new EntityRolesByUserIdFetchTriggered("null", "null",false));
    this.uniquegoalpage = false;
    let currentUserId = this.cookieService.get("CurrentUserId");
    // tslint:disable-next-line: prefer-const
    let goalSearchCriteriaTemp = new GoalSearchCriteriaInputModel();
    goalSearchCriteriaTemp.goalStatusId = ConstantVariables.ActiveGoalStatusId;
    goalSearchCriteriaTemp.sprintStatusId = ConstantVariables.ActiveGoalStatusId;
    goalSearchCriteriaTemp.isArchivedGoal = false;
    goalSearchCriteriaTemp.isParkedGoal = false;
    goalSearchCriteriaTemp.isGoalsPage = true;
    goalSearchCriteriaTemp.isAdvancedSearch = false;
    goalSearchCriteriaTemp.isArchived = false;
    goalSearchCriteriaTemp.isParked = false;
    goalSearchCriteriaTemp.sortBy = "updatedDateTime";
    goalSearchCriteriaTemp.isUniqueGoalsPage = false;
    goalSearchCriteriaTemp.ownerUserId = currentUserId;
    goalSearchCriteriaTemp.isForFilters = true;

    this.activeGoalsSearchCriteria = goalSearchCriteriaTemp;
    if (goalSearchCriteriaTemp.goalStatusId == ConstantVariables.ActiveGoalStatusId) {
      goalSearchCriteriaTemp.isActiveSprints = true;
    }
    this.filtersData = {};
    this.filtersData["selectedGoalStatus"] = "Active";
    this.filtersData["selectedSprintStatus"] = "Active";
    this.filtersData["sortBy"] = "updatedDateTime";
    this.sortByText = "Updated date";
    this.filtersData["goalStatusId"] = ConstantVariables.ActiveGoalStatusId;
    this.filtersData["sprintStatusId"] = ConstantVariables.ActiveGoalStatusId;
    this.filtersData["ownerUserId"] = currentUserId;
    let userModel = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModel));
    if (userModel) {
      this.filtersData["selectedOwners"] = userModel.fullName;
    }
    this.checkAccess();
  }

  ngOnInit() {
    super.ngOnInit();
    this.loadTestRepoModule();
    //this.roleFeaturesIsInProgress$ = this.store.pipe(select(sharedModuleReducers.getRoleFeaturesLoading));
    this.getSoftLabelConfigurations();
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

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  }

  getEntityRoleFeaturesByUserId() {
    this.featureService.getAllPermittedEntityRoleFeaturesByUserId().subscribe((features: any) => {
      if (features.success == true) {
        localStorage.setItem(LocalStorageProperties.UserRoleFeatures, JSON.stringify(features.data));
      }
    })
  }

  bindAllGoalsPage() {
    if (this.canAccess_feature_AllGoals && this.activeGoalsSearchCriteria) {
      return true;
    } else {
      return false;
    }
  }

  checkAccess() {
    // tslint:disable-next-line:max-line-length
    let entityRoles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
    this.viewProjects = _.find(entityRoles, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_ViewProjects.toString().toLowerCase(); }) != null;

  }

  PerformAdvancedSearch() {
    this.AdvancesSearch = !this.AdvancesSearch;
    this.isFiltersVisible = true;
  }

  GetGoalsBasedOnSearchFilter(goalSearchCriteria) {
    if (goalSearchCriteria.sprintStatusId) {
      let sprintStatusIds = goalSearchCriteria.sprintStatusId.split(",");
      let activeSprintStatus = sprintStatusIds.indexOf('7A79AB9F-D6F0-40A0-A191-CED6C06656DE')
      if (activeSprintStatus > -1) {
        goalSearchCriteria.isActiveSprints = true;
      }

      let backlogSprintStatus = sprintStatusIds.indexOf('F6F118EA-7023-45F1-BCF6-CE6DB1CEE5C3')
      if (backlogSprintStatus > -1) {
        goalSearchCriteria.isBacklogSprints = true;
      }

      let replanSprintStatus = sprintStatusIds.indexOf('5AF65423-AFC4-4E9D-A011-F4DF97ED5FAF')
      if (replanSprintStatus > -1) {
        goalSearchCriteria.isReplanSprints = true;
      }

      let archivedSprintStatus = sprintStatusIds.indexOf('B25B79E1-82E5-40BC-9D1A-4591E620D895')
      if (archivedSprintStatus > -1) {
        goalSearchCriteria.isDeleteSprints = true;
      }

      let completedSprintStatus = sprintStatusIds.indexOf('CF5FDAE7-4E4E-4AEC-892B-C283D32EBB26')
      if (completedSprintStatus > -1) {
        goalSearchCriteria.isCompletedSprints = true;
      }
    } else {
      goalSearchCriteria.isActiveSprints = true;
      goalSearchCriteria.isBacklogSprints = true;
      goalSearchCriteria.isReplanSprints = true;
      goalSearchCriteria.isDeleteSprints = true;
      goalSearchCriteria.isCompletedSprints = true;
     }
    this.activeGoalsSearchCriteria = goalSearchCriteria;
    this.activeGoalsSearchCriteria.isGoalsPage = true;
    if (this.isSprintsView) {
      this.isInput = !this.isInput;
      localStorage.setItem("goalSearchCriteria", JSON.stringify(this.activeGoalsSearchCriteria));
      this.cdRef.detectChanges();
    } else {
      this.isInput = null;
      localStorage.setItem("goalSearchCriteria", null)
    }
    this.goalsCount = 0;
    this.store.dispatch(new SearchAllGoals(this.activeGoalsSearchCriteria));
  }

  showFilters() {
    //this.isFiltersVisible = !this.isFiltersVisible;
    const filtersDialog = this.dialog.open(AllGoalsFilterComponent, {
      width: "50%",
      minHeight: "85vh",
      data: { uniquegoalpage: this.uniquegoalpage },
      panelClass: 'filters-dialog-padding'
    });
    filtersDialog.componentInstance.getGoalsBasedOnFilter.subscribe((result) => {
      this.filtersData = result;
      filtersDialog.close();
      this.getSortByText(this.filtersData.sortBy);
      this.getFiltersLength();
      this.GetGoalsBasedOnSearchFilter(result);
    });
  }

  getSortByText(sortBy) {
    if (sortBy == "createdDateTime") {
      this.sortByText = "Created date";
    }
    if (sortBy == "updatedDateTime") {
      this.sortByText = "Updated date";
    }
    if (sortBy == "estimatedTime") {
      this.sortByText = "Estimated time";
    }
    if (sortBy == "deadlineDate") {
      this.sortByText = "Deadline date";
    }
    if (sortBy == "ownerName") {
      this.sortByText = "Owner name";
    }
  }

  getFiltersLength() {
    let filters = [];
    if (this.filtersData) {
      if (this.filtersData.selectedOwners) {
        filters.push(this.filtersData.selectedOwners)
      }
      if (this.filtersData.selectedUsers) {
        filters.push(this.filtersData.selectedUsers)
      }
      if (this.filtersData.selectedSprintUsers) {
        filters.push(this.filtersData.selectedSprintUsers)
      }
      if (this.filtersData.selectedProjects) {
        filters.push(this.filtersData.selectedProjects)
      }
      if (this.filtersData.selectedGoalStatus) {
        filters.push(this.filtersData.selectedGoalStatus)
      }
      if (this.filtersData.selectedSprintStatus) {
        filters.push(this.filtersData.selectedSprintStatus)
      }
      if (this.filtersData.selectedUserStoryStatus) {
        filters.push(this.filtersData.selectedUserStoryStatus)
      }
      if (this.filtersData.goalShortName) {
        filters.push(this.filtersData.goalShortName)
      }
      if (this.filtersData.sprintName) {
        filters.push(this.filtersData.sprintName)
      }
      if (this.filtersData.goalTags) {
        filters.push(this.filtersData.goalTags)
      }
      if (this.filtersData.workItemTags) {
        filters.push(this.filtersData.workItemTags)
      }
      if (this.filtersData.dateFrom) {
        filters.push(this.filtersData.dateFrom.toString())
      }
      if (this.filtersData.dateTo) {
        filters.push(this.filtersData.dateTo.toString())
      }
      if (this.filtersData.sprintStartDate) {
        filters.push(this.filtersData.sprintStartDate.toString())
      }
      if (this.filtersData.sprintEndDate) {
        filters.push(this.filtersData.sprintEndDate.toString())
      }
      if (this.filtersData.selectedGoalFilters) {
        filters.push(this.filtersData.selectedGoalFilters)
      }
      if (this.filtersData.selectedDependencyUsers) {
        filters.push(this.filtersData.selectedDependencyUsers)
      }
      if (this.filtersData.selectedBugCausedUsers) {
        filters.push(this.filtersData.selectedBugCausedUsers)
      }
      if (this.filtersData.userStoryName) {
        filters.push(this.filtersData.userStoryName)
      }
      if (this.filtersData.versionName) {
        filters.push(this.filtersData.versionName)
      }
      if (this.filtersData.selectedBugPriorities) {
        filters.push(this.filtersData.selectedBugPriorities)
      }
      if (this.filtersData.selectedComponents) {
        filters.push(this.filtersData.selectedComponents)
      }
      if (this.filtersData.createdDateFrom) {
        filters.push(this.filtersData.createdDateFrom.toString())
      }
      if (this.filtersData.createdDateTo) {
        filters.push(this.filtersData.createdDateTo.toString())
      }
      if (this.filtersData.updatedDateFrom) {
        filters.push(this.filtersData.updatedDateFrom.toString())
      }
      if (this.filtersData.updatedDateTo) {
        filters.push(this.filtersData.updatedDateTo.toString())
      }
      if (this.sortBy) {
        filters.push(this.sortBy)
      }
      if (filters.length > 5) {
        console.log(filters.toString().length)
        this.showMoreFilters = true;
      }
      else {
        console.log(filters.toString().length)
        this.showMoreFilters = false;
      }
    }
  }

  openExtraFilters() {
    const filterDialog = this.dialog.open(ExtraFiltersComponent, {
      width: "25vw",
      disableClose: true,
      data: { filtersData: this.filtersData }
    });
    filterDialog.afterClosed().subscribe(() => {
    });
    filterDialog.componentInstance.filtersRemoved.subscribe((result) => {
      this.getFiltersLength();
      this.GetGoalsBasedOnSearchFilter(result);
    })
  }

  getGoalsCountFromServer() {
    this.goalsCount = -1;
    this.cdRef.markForCheck();
  }

  openProjectsDialog() {
    const projectDialog = this.dialog.open(ProjectsDialogComponent, {
      minWidth: "85vw",
      minHeight: "85vh",
      data: { projectId: null }
    });
    projectDialog.afterClosed().subscribe(() => {
    });
  }

  loadTestRepoModule() {
    var loader = this.projectModulesService["modules"];
    var modules = JSON.parse(localStorage.getItem("Modules"));
    var module = _.find(modules, function(module: any) { return module.modulePackageName == 'TestRepoPackageModule' });

    if (!module) {
      console.error("No module found for TestRepoPackageModule");
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
          elementInArray.name.toLocaleLowerCase() === "Test Suites View".toLocaleLowerCase()
        );
        this.testSuitView = {};
        this.testSuitView.component = this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(componentDetails.componentTypeObject);
        this.testSuitView.inputs = {};

        componentDetails = allComponentsInModule.find(elementInArray =>
          elementInArray.name.toLocaleLowerCase() === "Test Milestone".toLocaleLowerCase()
        );
        this.isTestrailLoaded = true;
        this.cdRef.detectChanges();
      });
  }

  clearWorkItemFilter() {
    this.filtersData.selectedOwners = null;
    this.filtersData.ownerUserId = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }

  clearSprintResponsibleFilter() {
    this.filtersData.selectedSprintUsers = null;
    this.filtersData.sprintResponsiblePersonIds = null;
    this.filtersData.sprintResponsiblePersonId = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }

  clearResponsibleFilter() {
    this.filtersData.goalResponsibleUserId = null;
    this.filtersData.selectedUsers = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }

  clearProjects() {
    this.filtersData.projectId = null;
    this.filtersData.selectedProjects = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }

  clearGoalFilter() {
    this.filtersData.selectedGoalStatus = null;
    this.filtersData.goalStatusId = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }

  clearSprintFilter() {
    this.filtersData.selectedSprintStatus = null;
    this.filtersData.sprintStatusId = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }

  clearUserStoryStatusFilter() {
    this.filtersData.selectedUserStoryStatus = null;
    this.filtersData.userStoryStatusId = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }

  clearOptions() {
    this.filtersData.isIncludedArchive = null;
    this.filtersData.isIncludedPark = null;
    this.filtersData.isOnTrack = null;
    this.filtersData.isNotOnTrack = null;
    this.filtersData.isTracked = null;
    this.filtersData.isProductive = null;
    this.filtersData.selectedGoalFilters = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }

  clearGoalName() {
    this.filtersData.goalName = null;
    this.filtersData.goalShortName = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }

  clearSprintName() {
    this.filtersData.sprintName = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }

  clearSprintStartDate() {
    this.filtersData.sprintStartDate = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }

  clearSprintEndDate() {
    this.filtersData.sprintEndDate = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }

  clearGoalTags() {
    this.filtersData.tags = null;
    this.filtersData.goalTags = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }

  clearWorkItems() {
    this.filtersData.workItemTags = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }

  clearDateFrom() {
    this.filtersData.deadLineDateFrom = null;
    this.filtersData.dateFrom = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }
  clearDateTo() {
    this.filtersData.deadLineDateTo = null;
    this.filtersData.dateTo = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }

  clearDependencyUser() {
    this.filtersData.dependencyUserIds = null;
    this.filtersData.selectedDependencyUsers = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }

  clearBugCausedUser() {
    this.filtersData.bugCausedUserIds = null;
    this.filtersData.selectedBugCausedUsers = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }

  clearWorkItemTypes() {
    this.filtersData.userStoryTypeIds = null;
    this.filtersData.selectedUserStoryTypes = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }

  clearUserStoryName() {
    this.filtersData.userStoryName = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }

  clearVersionName() {
    this.filtersData.versionName = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }

  clearBugPriorities() {
    this.filtersData.bugPriorityIds = null;
    this.filtersData.selectedBugPriorities = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }

  clearComponets() {
    this.filtersData.projectFeatureIds = null;
    this.filtersData.selectedComponents = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }

  clearCreateDateFrom() {
    this.filtersData.createdDateFrom = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }
  clearCreateDateTo() {
    this.filtersData.createdDateTo = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }

  clearUpdateDateFrom() {
    this.filtersData.updatedDateFrom = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }

  clearUpdateDateTo() {
    this.filtersData.updatedDateTo = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }

  clearSortBy() {
    this.filtersData.sortBy = null;
    this.sortBy = null;
    this.sortByText = null;
    this.getFiltersLength();
    this.GetGoalsBasedOnSearchFilter(this.filtersData);
  }

  emitSprintsView(event) {
    this.isSprintsView = event;
  }

  resetSearch() {
    let userModel = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModel));
    this.filtersData.selectedOwners = userModel.fullName;
    this.filtersData.ownerUserId = this.cookieService.get('CurrentUserId');
    this.filtersData.selectedGoalStatus = "Active";
    this.filtersData.selectedSprintStatus = "Active";
    this.filtersData.goalStatusId = ConstantVariables.ActiveGoalStatusId;
    this.filtersData.sprintStatusId = ConstantVariables.ActiveGoalStatusId;
    this.filtersData.sortBy = 'updatedDateTime';
    this.sortByText = "Updated date";
    this.filtersData.goalResponsibleUserId = null;
    this.filtersData.sprintResponsibleUserId = null;
    this.filtersData.selectedUsers = null;
    this.filtersData.projectId = null;
    this.filtersData.selectedProjects = null;
    this.filtersData.selectedUserStoryStatus = null;
    this.filtersData.userStoryStatusId = null;
    this.filtersData.isIncludedArchive = false;
    this.filtersData.isIncludedPark = false;
    this.filtersData.isOnTrack = null;
    this.filtersData.isNotOnTrack = null;
    this.filtersData.isTracked = null;
    this.filtersData.isProductive = null;
    this.filtersData.selectedGoalFilters = null;
    this.filtersData.tags = null;
    this.filtersData.workItemTags = null;
    this.filtersData.deadLineDateFrom = null;
    this.filtersData.dateFrom = null;
    this.filtersData.deadLineDateTo = null;
    this.filtersData.dateTo = null;
    this.showMoreFilters = false;
    this.filtersData.goalName = null;
    this.filtersData.goalShortName = null;
    this.filtersData.sprintName = null;
    this.filtersData.goalTags = null;
    this.filtersData.dependencyUserIds = null;
    this.filtersData.selectedDependencyUsers = null;
    this.filtersData.bugCausedUserIds = null;
    this.filtersData.selectedBugCausedUsers = null;
    this.filtersData.userStoryTypeIds = null;
    this.filtersData.selectedUserStoryTypes = null;
    this.filtersData.userStoryName = null;
    this.filtersData.versionName = null;
    this.filtersData.sprintStartDate = null;
    this.filtersData.sprintEndDate = null;
    this.filtersData.bugPriorityIds = null;
    this.filtersData.selectedBugPriorities = null;
    this.filtersData.projectFeatureIds = null;
    this.filtersData.selectedComponents = null;
    this.filtersData.createdDateFrom = null;
    this.filtersData.createdDateTo = null;
    this.filtersData.updatedDateFrom = null;
    this.filtersData.updatedDateTo = null;
    const activeGoalsSearchCriteria = new GoalSearchCriteriaInputModel();
    activeGoalsSearchCriteria.isGoalsPage = true;
    activeGoalsSearchCriteria.isAdvancedSearch = true;
    activeGoalsSearchCriteria.goalStatusId = ConstantVariables.ActiveGoalStatusId;
    activeGoalsSearchCriteria.sprintStatusId = ConstantVariables.ActiveGoalStatusId;
    activeGoalsSearchCriteria.ownerUserId = this.cookieService.get('CurrentUserId');
    activeGoalsSearchCriteria.isParkedGoal = false;
    activeGoalsSearchCriteria.isArchivedGoal = false;
    activeGoalsSearchCriteria.isForFilters = true;
    activeGoalsSearchCriteria.sortBy = "updatedDateTime";
    this.GetGoalsBasedOnSearchFilter(activeGoalsSearchCriteria);
  }
}
