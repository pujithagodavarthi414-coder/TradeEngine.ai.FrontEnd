// tslint:disable-next-line: ordered-imports
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, ChangeDetectorRef, Output, EventEmitter, ViewChildren } from "@angular/core";
import { SatPopover } from "@ncstate/sat-popover";
// tslint:disable-next-line: ordered-imports
import { select, Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
// tslint:disable-next-line: ordered-imports
import { ProjectSearchResult } from "../../models/ProjectSearchResult";
// tslint:disable-next-line: ordered-imports
import { LoadProjectsTriggered, ProjectActionTypes } from "../../store/actions/project.actions";

import * as projectModuleReducer from "../../store/reducers/index";
import * as _ from "underscore";
import { ProjectSearchCriteriaInputModel } from "../../models/ProjectSearchCriteriaInputModel";
import { User } from "../../models/user";
import { SoftLabelConfigurationModel } from "../../../globaldependencies/models/softlabels-models";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CookieService } from "ngx-cookie-service";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { MenuItemService } from '../../services/feature.service';
import { EntityTypeFeatureIds } from '../../../globaldependencies/constants/entitytype-feature-ids';
import { WorkItemDialogComponent } from '../userStories/work-item-dailogue.component';
import { MatDialog } from '@angular/material/dialog';
import * as $_ from 'jquery';
import { SortDescriptor, State, process } from '@progress/kendo-data-query';
import { TranslateService } from '@ngx-translate/core';
import { SoftLabelPipe } from '../../../globaldependencies/pipes/softlabels.pipes';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { DatePipe } from "@angular/common";
const $ = $_;

@Component({
  selector: "app-pm-component-project-list",
  templateUrl: "project-list.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProjectListComponent extends CustomAppBaseComponent implements OnInit {
  @ViewChildren("configurationEditPopover") configurationEditsPopover;
  @ViewChildren("configurationArchivePopover") configurationArchivesPopover;
  @Output() closePopUp = new EventEmitter<any>();
  @Output() closeProjectsDialog = new EventEmitter<any>();
  @Input() isForDialog = false;
  Offset: string;
  createdDateTime: Date;
  @Input() fromAuditMenu: boolean;
  @Input("isProjectsApp")
  set _isProjectsApp(data: boolean) {
    this.isProjectsApp = data;
  }
  @ViewChild("createPopover") contactPopover: SatPopover;
  projectResponsiblePersons$: Observable<User[]>;
  // entityRolePermisisons$: Observable<EntityRoleFeatureModel[]>;
  // entityRolePermisisons: EntityRoleFeatureModel[];
  projectSearchResults$: Observable<ProjectSearchResult[]>;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;
  softLabels: SoftLabelConfigurationModel[];
  companySettingsModel$: Observable<any[]>;
  anyOperationInProgress$: Observable<boolean>;
  roleFeaturesIsInProgress$: Observable<boolean>;
  //projectRelatedData$: Observable<ProjectList>;
  testSuitesCount$: Observable<number>;
  testRunsCount$: Observable<number>;
  testMilestonesCount$: Observable<number>;
  reportsCount$: Observable<number>;
  isSprintsEnable: boolean;
  isProjectsApp: boolean;
  projectSearchResult: any;
  projectLabel: string;
  searchByProjectName: string;
  clickHereToCreateANewProject: string;
  searchText: string;
  projectResponsiblePersonId: string;
  isArchived = false;
  isFiltersVisible = true;
  clearCreateForm = true;
  archiveProjectId: boolean;
  openProjectForm: boolean;
  Arr = Array;
  num = 8;
  take: number = 15;
  sort: SortDescriptor[];
  isTestTrailEnable: boolean;
  isAuditsEnable: boolean;
  isOpen: boolean = true;
  showFilters: boolean = false;
  isEditProject: boolean = false;
  pageable: boolean = true;
  fromCustomApp: boolean = false;
  Ids: string;
  dashboardFilters = {
    projectId: null,
    userId: null,
    goalId: null,
    isDailogue: true
  };
  projectsList: any;
  temp: any;
  permissionCount: number = 0;
  gridData: GridDataResult;
  state: State = {
    skip: 0,
    take: 15,
    filter: {
      logic: 'and',
      filters: []
    }
  };
  proejectDetails = { data: [], total: 0 };
  sortDirectionAsc: boolean;
  sortBy: string;
  totalCount: number;
  projectSearchFilter: string = null;
  optionalParameters: any;

  @Input("Ids")
  set _Ids(Ids) {
    this.fromCustomApp = true;
    this.Ids = Ids;
    const projectSearchResult = new ProjectSearchCriteriaInputModel();
    projectSearchResult.projectIds = this.Ids;
  }

  public ngDestroyed$ = new Subject();
  isES: boolean;
  constructor(
    private actionUpdates$: Actions,
    private store: Store<projectModuleReducer.State>,
    private router: Router,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef,
    private cookieService: CookieService,
    private featureService: MenuItemService,
    private dialog: MatDialog,
    private translateService: TranslateService,
    private softLabelPipe: SoftLabelPipe,
    private datePipe: DatePipe
  ) {
    super();
    this.getSoftLabelConfigurations();
    let companyDetails = this.cookieService.get(LocalStorageProperties.CompanyDetails);
    if (companyDetails != null && companyDetails != undefined && companyDetails != "null") {
      var industryId = JSON.parse(companyDetails);
      if (industryId.industryId.toLowerCase() == 'bbbb8092-ebcc-43ff-a039-5e3bd2face51') {
        this.isES = true;
      }
    }
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(ProjectActionTypes.LoadProjectsCompleted),
        tap(() => {
          this.projectSearchResults$ = this.store.pipe(
            select(projectModuleReducer.getProjectsAll))
          this.projectSearchResults$.subscribe((x => this.projectsList = x));
          this.proejectDetails = {
            data: this.projectsList,
            total: this.projectsList.length > 0 ? this.projectsList[0].totalCount : 0,
          }
          if ((this.projectsList.length > 0)) {
            this.pageable = true;
            this.totalCount = this.projectsList[0].totalCount
          } else {
            this.totalCount = 0;
          }
          this.cdRef.detectChanges();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(ProjectActionTypes.RefreshProjectsList),
        tap(() => {
          this.projectSearchResults$ = this.store.pipe(
            select(projectModuleReducer.getProjectsAll))
          this.projectSearchResults$.subscribe((x => this.projectsList = x));
          this.projectsList = this.projectsList.sort((a, b) => {
            return (new Date(b.createdDateTime) as any) - (new Date(a.createdDateTime) as any);
          });
          this.proejectDetails = {
            data: this.projectsList,
            total: this.totalCount + 1,
          }
          if ((this.projectsList.length > 0)) {
            this.pageable = true;
            this.totalCount = this.totalCount + 1
          } else {
            this.totalCount = 0;
          }
          this.cdRef.detectChanges();

        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(ProjectActionTypes.ProjectCompletedWithInPlaceUpdate),
        tap(() => {
          this.projectSearchResults$ = this.store.pipe(
            select(projectModuleReducer.getProjectsAll))
          this.projectSearchResults$.subscribe((x => this.projectsList = x));
          this.proejectDetails = {
            data: this.projectsList,
            total: this.totalCount,
          }
          if ((this.projectsList.length > 0)) {
            this.pageable = true;
            this.totalCount = this.totalCount
          } else {
            this.totalCount = 0;
          }
          this.cdRef.detectChanges();

        })
      )
      .subscribe();


    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(ProjectActionTypes.ArchiveProjectCompleted),
        tap(() => {
          this.projectSearchResults$ = this.store.pipe(
            select(projectModuleReducer.getProjectsAll))
          this.projectSearchResults$.subscribe((x => this.projectsList = x));
          this.proejectDetails = {
            data: this.projectsList,
            total: this.totalCount - 1,
          }
          if ((this.projectsList.length > 0)) {
            this.pageable = true;
            this.totalCount = this.totalCount - 1
          } else {
            this.totalCount = 0;
          }

        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.anyOperationInProgress$ = this.store.pipe(
      select(projectModuleReducer.getProjectsLoading)
    );
    this.Offset = String(-(new Date().getTimezoneOffset()));

    // this.roleFeaturesIsInProgress$ = this.store.pipe(select(sharedModuleReducers.getRoleFeaturesLoading));
    super.ngOnInit();
    // this.sortBy = 'projectName';
    // this.sortDirectionAsc = true;

    this.getAllProjectsByFilterContext();
    this.getCompanySettings();
  }

  getCompanySettings() {
    let companySettingsModel: any[] = [];
    companySettingsModel = JSON.parse(localStorage.getItem(LocalStorageProperties.CompanySettings));
    if (companySettingsModel && companySettingsModel.length > 0) {
      let companyResult = companySettingsModel.filter(item => item.key.trim() == "EnableTestcaseManagement");
      if (companyResult.length > 0) {
        this.isTestTrailEnable = companyResult[0].value == "1" ? true : false;
        this.cdRef.detectChanges();
      }
      let sprintResult = companySettingsModel.filter(item => item.key.trim() == "EnableSprints");
      if (sprintResult.length > 0) {
        this.isSprintsEnable = sprintResult[0].value == "1" ? true : false;
        this.cdRef.detectChanges();
      }
      let auditResult = companySettingsModel.filter(item => item.key.trim() == "EnableAuditManagement");
      if (auditResult.length > 0) {
        this.isAuditsEnable = auditResult[0].value == "1" ? true : false;
        this.cdRef.detectChanges();
      }
    }
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    if (this.softLabels.length > 0) {
      this.projectLabel = this.softLabels[0].projectLabel;
    }
    // this.softLabels$ = this.store.pipe(select(commonModuleReducers.getSoftLabelsAll));
  }

  getArchivedProjects() {
    this.state.skip = 0;
    this.state.take = 15;
    this.sortBy = 'projectName';
    this.sortDirectionAsc = true;
    this.getAllProjectsByFilterContext();
  }


  public getAllProjectsByFilterContext() {
    const projectSearchResult = new ProjectSearchCriteriaInputModel();
    projectSearchResult.isArchived = this.isArchived;
    projectSearchResult.projectResponsiblePersonId = this.projectResponsiblePersonId;
    projectSearchResult.projectName = this.searchText;
    projectSearchResult.pageNumber = (this.state.skip / this.state.take) + 1;
    projectSearchResult.pageSize = this.state.take;
    projectSearchResult.sortBy = this.sortBy;
    projectSearchResult.sortDirectionAsc = this.sortDirectionAsc;
    projectSearchResult.projectSearchFilter = this.projectSearchFilter;
    this.fromCustomApp ? projectSearchResult.projectIds = this.Ids : null;
    this.store.dispatch(new LoadProjectsTriggered(projectSearchResult));
  }

  createProject() {
    this.projectLabel = this.projectLabel;
    this.openProjectForm = !this.openProjectForm;
    this.cdRef.markForCheck();
    this.clearCreateForm = !this.clearCreateForm;
  }

  dataStateChange(state: DataStateChangeEvent) {
    this.state = state;
    this.projectSearchFilter = JSON.stringify(this.state.filter.filters);;
    this.getAllProjectsByFilterContext();
  }

  pageChange(state) {
    this.state = state;
    this.getAllProjectsByFilterContext();
  }

  sortChange(sort: SortDescriptor[]) {
    this.sort = sort;
    this.state.skip = 0;
    this.state.take = 15;
    this.sortBy = this.sort[0].field;
    let sortDirection = this.sort[0].dir;
    if (sortDirection == "asc") {
      this.sortDirectionAsc = true;
    } else {
      this.sortDirectionAsc = false;
    }
    this.getAllProjectsByFilterContext();
  }

  closeDialog() {
    this.openProjectForm = !this.openProjectForm;
    const popover = this.contactPopover;
    if (popover) { popover.close(); }
  }

  closeSearch() {
    this.searchText = "";
  }

  filterClick() {
    this.isOpen = !this.isOpen;
    this.showFilters = !this.showFilters;
    this.projectSearchFilter = null;
    this.filterByName(null);
    this.cdRef.markForCheck();
  }

  goToAllGoals() {
    this.closeProjectsDialog.emit('');
    this.router.navigate(['projects/area/allgoals']);
    this.closePopUp.emit(true);
  }

  goToAllRoles() {
    this.closeProjectsDialog.emit('');
    this.router.navigateByUrl('/rolemanagement/entityrolemanagement');
    this.closePopUp.emit(true);
  }

  goToProjectActivity() {
    this.closeProjectsDialog.emit('');
    this.router.navigateByUrl('projects/project-activity');
    this.closePopUp.emit(true);
  }

  navigateToStatusReport() {
    this.closeProjectsDialog.emit('');
    const projectDialog = this.dialog.open(WorkItemDialogComponent, {
      minWidth: '82vw',
      height: '82vh',
      data: { dashboardFilters: this.dashboardFilters, isFromMyWork: true },
      disableClose: true
    });
    projectDialog.afterClosed().subscribe(() => { });
    this.closePopUp.emit(true);
  }

  editProject(row, editPopOver) {
    this.projectSearchResult = row;
    this.isEditProject = true;
    this.cdRef.markForCheck();
    editPopOver.openPopover();
  }

  closeProjectDialog() {
    this.configurationEditsPopover.forEach((p) => p.closePopover());
    this.projectSearchResult = null;
    this.isEditProject = false;
  }

  archiveProject(row, editPopOver) {
    this.projectSearchResult = row;
    this.archiveProjectId = true;
    this.cdRef.markForCheck();
    editPopOver.openPopover();
  }

  closeArchiveDialog() {
    this.archiveProjectId = false;
    this.configurationArchivesPopover.forEach((p) => p.closePopover());
    this.projectSearchResult = null;
  }

  cellClickHandler({ isEdited, dataItem, rowIndex }) {
    this.fetchProjectRecord(dataItem);
  }

  //   covertTimeIntoUtcTime(inputTime): string {
  //     // if (inputTime == null || inputTime == "")
  //     //   return null;

  //      var dateformat= this.datePipe.transform(inputTime, "+zz")
  //      var Offset= String (new Date(inputTime).getTimezoneOffset());
  //      console.log(Offset)
  //        return Offset;
  // //      if(dateformat!=Offset){
  // // return "success";
  // //     }
  //   }


  fetchProjectRecord(projectSearchResult: ProjectSearchResult) {
    this.closePopUp.emit(true);
    let entityTypeFeatureForViewGoals = EntityTypeFeatureIds.EntityTypeFeature_ViewGoals.toString().toLowerCase();
    this.featureService.getAllPermittedEntityRoleFeatures(projectSearchResult.projectId).subscribe((roleFeatures: any) => {
      if (roleFeatures.success == true) {
        localStorage.setItem(LocalStorageProperties.EntityRoleFeatures, JSON.stringify(roleFeatures.data));
        let entityRoleFeatures = roleFeatures.data;
        var viewGoalsPermisisonsList = _.filter(entityRoleFeatures, function (permission: any) {
          return permission.entityFeatureId.toString().toLowerCase().includes(entityTypeFeatureForViewGoals)
        })
        if (!projectSearchResult.isArchived) {
          if (!this.fromAuditMenu && !this.canAccess_feature_ViewProjects && this.canAccess_feature_AccessAudits && this.isAuditsEnable && !this.isES) {
            this.router.navigate(["projects/projectstatus", projectSearchResult.projectId, "audits"]);
          }  if (this.fromAuditMenu && !this.canAccess_feature_ViewProjectsInAudits && this.canAccess_feature_ViewAudits) {
            this.router.navigateByUrl("projects/projectstatus/" + projectSearchResult.projectId + "/audit/audits");
        }
          else if (viewGoalsPermisisonsList.length > 0 && !this.fromAuditMenu) {
            this.cookieService.set("selectedProjectsTab", "active-goals");
            this.router.navigate([
              "projects/projectstatus",
              projectSearchResult.projectId,
              "active-goals"
            ]);
          } else if (viewGoalsPermisisonsList.length > 0 && this.fromAuditMenu) {
            this.cookieService.set("selectedProjectsTab", "active-goals");
            this.router.navigateByUrl(
              "projects/projectstatus/" +
              projectSearchResult.projectId +
              "/audit/active-goals"
            );
          } else if (this.canAccess_feature_ViewAudits && this.isES) {
            this.router.navigateByUrl("projects/projectstatus/" + projectSearchResult.projectId + "/audits");
        } else {
            this.router.navigate([
              "projects/projectstatus",
              projectSearchResult.projectId,
              "documents"
            ]);
          }
          //this.getProjectRelatedCounts(projectSearchResult);
        } else {
          let toastrText = this.softLabelPipe.transform(this.translateService.instant("PROJECTS.PLEASEUNARCHIVETHISPROJECT"), this.softLabels);
          this.toastr.warning("", toastrText);
        }
      }
    })
    this.closeProjectsDialog.emit('');
  }

  fitContent(optionalParameters?: any) {
    try {
      var parentElementSelector = '';
      this.optionalParameters = optionalParameters;
      var minHeight = '';
      if (optionalParameters['fromCustomDrillDown']) {
        parentElementSelector = optionalParameters['drillDownSelector'];
        var counter = 0;
        var applyHeight = setInterval(function () {
          if (counter > 10) {
            clearInterval(applyHeight);
          }
          counter++;
          if ($(parentElementSelector + ' mat-card#drill-down-mat-card').length > 0) {
            $(parentElementSelector + ' mat-card#drill-down-mat-card').css('height', `calc(90vh - 160px)`);
            var counter1 = 1;
            var applyHeight1 = setInterval((
              function () {
                if (counter1 > 10) {
                  clearInterval(applyHeight1);
                }
                counter1++;
                if ($(parentElementSelector + ' app-pm-component-project-list div.projects-list-grid').length > 0) {
                  var height = `${$(parentElementSelector + ' mat-card#drill-down-mat-card').height() - 85}px`;
                  $(parentElementSelector + ' app-pm-component-project-list div.projects-list-grid').css('height', height);
                  var counter2 = 0;
                  var applyHeight2 = setInterval(() => {
                    if (counter2 > 10) {
                      clearInterval(applyHeight2);
                    }
                    counter2++;
                    if ($(parentElementSelector + ' app-pm-component-project-list .k-grid-content').length > 0) {
                      if ($(parentElementSelector + ' app-pm-component-project-list .k-grid div.k-grid-aria-root').length > 0) {
                        $(parentElementSelector + ' app-pm-component-project-list .k-grid div.k-grid-aria-root').attr('style', 'overflow: hidden !important');
                      }

                      $(parentElementSelector + ' app-pm-component-project-list .k-grid-content').height($(parentElementSelector + ' mat-card#drill-down-mat-card').height() - 170);
                      $(parentElementSelector + ' app-pm-component-project-list .k-grid-content').attr('id', 'style-1');
                      clearInterval(applyHeight2);
                    }
                  }, 1000)
                  clearInterval(applyHeight1);
                }
              }), 1000);
            clearInterval(applyHeight);
          }
        }, 1000);
      }
    }
    catch (err) {
      clearInterval(applyHeight);
      console.log(err);
    }
  }

  // getProjectRelatedCounts(projectSearchResult) {
  //   this.store.dispatch(new LoadProjectRelatedCountsTriggered(projectSearchResult.projectId));
  //   this.testSuitesCount$ = this.store.pipe(select(testRailModuleReducer.getTestSuitesCount));
  //   this.testRunsCount$ = this.store.pipe(select(testRailModuleReducer.getTestRunsCount));
  //   this.testMilestonesCount$ = this.store.pipe(select(testRailModuleReducer.getMilestonesCount));
  //   this.reportsCount$ = this.store.pipe(select(testRailModuleReducer.getReportsCount));
  // }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.ngDestroyed$.next();
  }

  filterByName(event) {
    if (event != null) {
      this.searchText = event.target.value.toLowerCase();
      this.searchText = this.searchText.trim();
    } else {
      this.searchText = "";
    }
    this.state.skip = 0;
    this.state.take = 15;
    this.getAllProjectsByFilterContext();
  }

  closeSearchText() {
    this.filterByName(null);
  }

  setWidth() {
    this.permissionCount = 0;
    if (this.canAccess_feature_ManageProjectRolePermissions) {
      this.permissionCount = this.permissionCount + 1;
    }
    if (this.canAccess_feature_ViewProjectActivity) {
      this.permissionCount = this.permissionCount + 1;
    }
    if (this.canAccess_feature_AllGoals) {
      this.permissionCount = this.permissionCount + 1;
    }
    if (!this.fromAuditMenu && !this.isForDialog && (this.canAccess_feature_AddProject) && !this.isArchived && (this.canAccess_feature_ViewProjects)) {
      this.permissionCount = this.permissionCount + 1;
    }
    if (this.fromAuditMenu && !this.isForDialog && (this.canAccess_feature_AddProject) && !this.isArchived && (this.canAccess_feature_ViewProjectsInAudits)) {
      this.permissionCount = this.permissionCount + 1;
    }
    if (this.permissionCount == 3) {
      return 'project-close-3'
    }
    if (this.permissionCount == 2) {
      return 'project-close-2'
    }
    if (this.permissionCount == 1) {
      return 'project-close-1'
    }
    if (this.permissionCount == 0) {
      return 'project-close-0'
    }
    else if (this.isForDialog) {
      return 'project-search-close';
    }
    else {
      return 'project-search-dialog-close';
    }
  }

}