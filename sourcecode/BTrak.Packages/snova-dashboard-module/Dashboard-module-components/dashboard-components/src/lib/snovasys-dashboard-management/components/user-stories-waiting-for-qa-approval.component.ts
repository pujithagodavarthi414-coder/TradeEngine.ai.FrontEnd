import { ChangeDetectorRef, Component, Input, OnInit, EventEmitter, Output, ViewChild, TemplateRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import * as _ from "underscore";
import { State } from "../store/reducers/authentication.reducers";
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { ProductivityDashboardModel } from "../models/productivityDashboardModel";
import { SelectEmployeeDropDownListData } from "../models/selectEmployeeDropDownListData";
import { UserStoriesWatingForQaApprovalModel } from "../models/user-stories-waiting-for-qa-approval-model";
import { ProductivityDashboardService } from "../services/productivity-dashboard.service";
import { LoadProjectsTriggered } from "../store/actions/project.actions";
import * as projectModuleReducer from "../store/reducers/index";
import * as workspaceModuleReducer from "../store/reducers/index";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import { ProjectSearchResult } from '../models/project-search-result.model';
import { WorkspaceList } from '../models/workspace-list.model';
import { ProjectSearchCriteriaInputModel } from '../models/project-search-criteria-input.model';
import { UserModel } from '../models/user-details.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { State as KendoState } from '@progress/kendo-data-query';
import { DashboardService } from '../services/dashboard.service';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { Persistance } from '../models/persistance.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: "app-dashboard-component-UserStoriesWaitingForQaApproval",
  templateUrl: "user-stories-waiting-for-qa-approval.component.html"
})
export class UserStoriesWaitingForQaApprovalComponent extends CustomAppBaseComponent implements OnInit {
  @Output() closePopUp = new EventEmitter<any>();
  @ViewChild("uniqueUserstoryDialogWaitingForQA", { static: true }) private uniqueUserstoryDialog: TemplateRef<any>;
  Offset: string;

  @Input("dashboardId")
  set _dashboardId(data: string) {
    if (data != null && data !== undefined && data !== this.persistanceId) {
      this.persistanceId = data;
    }
  }

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
      this.projectId = this.dashboardFilters.projectId;
      this.ownerUserId = this.dashboardFilters.userId;
      this.getAllUserstoriesWaitingForQAApproval();
    }
  }

  columns = [];

  dashboardFilters: DashboardFilterModel;
  softLabels: SoftLabelConfigurationModel[];
  weekNumber: number;
  skip: number;
  direction: any;
  userStoriesWaitingForQaApproval: any;
  projectId: string;
  selectedDate: string;
  persistanceId: string;
  persistanceObject: any;
  count: number;
  totalpages: number;
  anyOperationInProgress = false;
  employeeList: SelectEmployeeDropDownListData[];
  teamleadslist: any[];
  type: any;
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortDirection: boolean;
  sortDirectionAsc: boolean;
  searchText: string;
  date: Date = new Date();
  loading = false;
  searchUserStory: string;
  projectsList: any;
  validationMessage: string;
  isOpen = true;
  projectFilterIsActive: boolean;
  employeeFilterIsActive = false;
  selectedValue: string;
  selectedEmployee: string;
  searchFilterIsActive: boolean;
  scrollbarH: boolean;
  ownerUserId: string;
  showGoalDetails = false;
  showUserstoryOutsideQaDetails = false;
  selectedEntity: string;
  showUserstoryOutsideQaDetailsFilterIsEnable: boolean;
  entities: EntityDropDownModel[];
  accessViewStores: Boolean = false;
  accessViewroject: Boolean = false;
  projectSearchResults$: Observable<ProjectSearchResult[]>;
  projectSearchResults: any[] = [];
  selectedFilterValue: string = "all";
  all: boolean = true;
  reportingOnly: boolean = false;
  myself: boolean = false;
  disableDropDown: boolean = false;
  pageable: boolean = false;
  isFromProjects: boolean = false;
  workspaces: WorkspaceList[];
  workspacesList$: Observable<WorkspaceList[]>;
  defaultFilterValue: string;
  selectedWorkspaceId: string;

  public ngDestroyed$ = new Subject();

  state: KendoState = {
    skip: 0,
    take: 20,
  };

  constructor(
    private productivityService: ProductivityDashboardService, private router: Router,
    private productivityDashboardService: ProductivityDashboardService,
    private toaster: ToastrService, private cdRef: ChangeDetectorRef,
    private dashboardService: DashboardService,
    private store: Store<State>, public dialog: MatDialog,
    private route: ActivatedRoute) {
    super();
    this.type = "Month";
    this.weekNumber = null;
    this.pageNumber = 0;
    this.pageSize = 20;
    this.sortBy = null;
    this.sortDirectionAsc = true;
    this.sortDirection = true;
    this.searchText = null;
    this.skip = 0;
    this.ownerUserId = null;
    this.showGoalDetails = false;

    this.route.params.subscribe((params) => {
      if (params["id"] != null && params["id"] !== undefined) {
        this.selectedWorkspaceId = params["id"];
      }
    });

    if (this.router.url.includes('projects')) {
      this.isFromProjects = true;
    }

    this.workspacesList$ = this.store.pipe(select(workspaceModuleReducer.getWorkspaceAll));
    this.workspacesList$.subscribe((s) => {
      this.workspaces = s;
      const index = this.workspaces.findIndex((p) => p.workspaceId == this.selectedWorkspaceId);
      if (index > -1) {
        if (this.workspaces[index].workspaceName == "Administrator Dashboard") {
          this.selectedFilterValue = "all";
          this.defaultFilterValue = this.selectedFilterValue;
          this.all = true;
          this.reportingOnly = false;
          this.myself = false;
          this.disableDropDown = false;
        }
        else if (this.workspaces[index].workspaceName == "Manager Dashboard") {
          this.selectedFilterValue = "reportingOnly";
          this.defaultFilterValue = this.selectedFilterValue;
          this.all = false;
          this.reportingOnly = true;
          this.myself = false;
          this.disableDropDown = false;
        }
        else if (this.workspaces[index].workspaceName == "User Dashboard") {
          this.selectedFilterValue = "mySelf";
          this.defaultFilterValue = this.selectedFilterValue;
          this.all = false;
          this.reportingOnly = false;
          this.myself = true;
          this.disableDropDown = true;
        }
      }
    })
  }

  ngOnInit() {
    this.Offset=String (-(new Date().getTimezoneOffset()));
    super.ngOnInit();
    this.getSoftLabels();
    if (this.canAccess_feature_WorkItemsWaitingForQaApproval && !(this.router.url.includes('productivity/dashboard/'))) {
      // this.getAllUserstoriesWaitingForQAApproval();
      this.getPersistance();
    }
    this.getAllProjects();
    this.getAllUsers();
    this.getEntityDropDown();
    this.accessViewStores = this.canAccess_feature_ViewStores;
    this.accessViewroject = this.canAccess_feature_ViewProjects;
    const projectSearchResult = new ProjectSearchCriteriaInputModel();
    projectSearchResult.isArchived = false;
    this.store.dispatch(new LoadProjectsTriggered(projectSearchResult));
    this.projectSearchResults$ = this.store.pipe(
      select(projectModuleReducer.getProjectsAll)
    );

    this.projectSearchResults$.subscribe((result) => {
      this.projectSearchResults = result;
    });
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    this.cdRef.markForCheck();
  }

  getEntityDropDown() {
    let searchText = "";
    this.productivityService.getEntityDropDown(searchText).subscribe((responseData: any) => {
      if (responseData.success === false) {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
      else {
        this.entities = responseData.data;
      }
    });
  }

  getAllUsers() {
    var userModel = new UserModel();
    userModel.isActive = true;
    this.productivityDashboardService.getAllUsers(userModel).subscribe((responseData: any) => {
      this.employeeList = responseData.data;
      this.teamleadslist = _.where(this.employeeList, { roleId: "3269ca75-879d-44ba-99e1-a94b8ca80e64" });
      if (responseData.success === false) {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
    })
  }

  getAllProjects() {
    this.productivityService.getAllProjects().subscribe((responseData: any) => {
      this.projectsList = responseData.data;
      if (responseData.success === false) {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
    });
  }

  getUserStoriesBasedOnProject(projectId) {
    this.pageNumber = 0;
    this.projectId = projectId;
    this.pageSize = 20;
    this.projectFilterIsActive = true;
    this.state.skip = 0;
    this.state.take = 20;
    this.getAllUserstoriesWaitingForQAApproval();
  }

  getUserStoriesBasedOnownerUserId(ownerUserId) {
    this.pageNumber = 0;
    this.ownerUserId = ownerUserId;
    this.pageSize = 20;
    this.employeeFilterIsActive = true;
    this.state.skip = 0;
    this.state.take = 20;
    this.getAllUserstoriesWaitingForQAApproval();
  }

  getIsUserstoryOutsideOfQA(showDetails) {
    this.showUserstoryOutsideQaDetails = showDetails;
    this.showUserstoryOutsideQaDetailsFilterIsEnable = true;
    this.state.skip = 0;
    this.state.take = 20;
    this.getAllUserstoriesWaitingForQAApproval();
  }

  searchRecords() {
    if (this.searchText) {
      this.searchFilterIsActive = true;
    } else {
      this.searchFilterIsActive = false;
    }
    if (this.searchText && this.searchText.trim().length <= 0) { return; }
    this.searchText = this.searchText.trim();
    this.pageNumber = 0;
    this.pageSize = 20;
    this.getAllUserstoriesWaitingForQAApproval();
  }

  setPage(pageInfo) {
    this.pageNumber = pageInfo.offset;
    this.getAllUserstoriesWaitingForQAApproval();
  }

  onVisibilityChange(event) {
    let columns = event.columns;
    if (columns && columns.length > 0) {
      // this.columns = [];
      for (let i = 0; i < columns.length; i++) {
        let object = {};
        object['field'] = columns[i].field;
        object['hidden'] = columns[i].hidden;
        let index = this.columns.findIndex(x => x.field == columns[i].field);
        if (index == -1)
          this.columns.push(object);
        else {
          this.columns[index].field = columns[i].field;
          this.columns[index].hidden = columns[i].hidden;
        }
      }
      this.persistanceObject.columns = this.columns;
      this.updatePersistance();
    }
  }

  checkVisibility(fieldName) {
    let index = this.columns.findIndex(x => x.field == fieldName);
    if (index != -1) {
      return this.columns[index].hidden;
    }
    else {
      return false;
    }
  }

  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    if (this.state.sort[0]) {
      this.sortBy = this.state.sort[0].field;
      this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
    }
    this.getAllUserstoriesWaitingForQAApproval();
  }

  updatePersistance() {
    let persistance = new Persistance();
    if (this.persistanceId) {
      persistance.referenceId = this.persistanceId;
      persistance.isUserLevel = true;
      persistance.persistanceJson = JSON.stringify(this.persistanceObject);
      this.dashboardService.UpsertPersistance(persistance).subscribe((response: any) => {
        if (response.success) {
          // this.persistanceId = response.data;
        }
      });
    }
  }

  getPersistance() {
    if (this.persistanceId) {
      let persistance = new Persistance();
      persistance.referenceId = this.persistanceId;
      persistance.isUserLevel = true;
      this.dashboardService.GetPersistance(persistance).subscribe((response: any) => {
        if (response.success) {
          if (response.data) {
            let result = response.data;
            let data = JSON.parse(result.persistanceJson);
            this.setPersistanceValues(data);
            this.getAllUserstoriesWaitingForQAApproval();
          }
          else {
            this.getAllUserstoriesWaitingForQAApproval();
          }
        }
        else {
          this.getAllUserstoriesWaitingForQAApproval();
        }
      });
    }
    else {
      this.getAllUserstoriesWaitingForQAApproval();
    }
  }

  setPersistanceValues(data) {
    this.state = data.state;
    this.columns = (data.columns == null || data.columns.length == 0) ? [] : data.columns;
    this.searchText = data.searchText;
    this.showUserstoryOutsideQaDetails = data.isUserstoryOutsideQa;
    this.selectedEntity = data.entityId;
    this.all = data.isAll;
    this.reportingOnly = data.isReportingOnly;
    this.myself = data.isMyself;
    this.ownerUserId = data.ownerUserId;
    if (!this.isFromProjects)
      this.projectId = data.projectId;
    this.cdRef.detectChanges();
  }

  closeSearch() {
    this.pageNumber = 0;
    this.pageSize = 20;
    this.searchText = null;
    this.searchFilterIsActive = false;
    this.state.skip = 0;
    this.state.take = 20;
    this.getAllUserstoriesWaitingForQAApproval();
  }

  onSort(event: any) {
    const sort = event.sorts[0];
    this.sortBy = sort.prop;
    if (sort.dir === "asc") {
      this.sortDirectionAsc = true;
    } else {
      this.sortDirectionAsc = false;
    }
    this.pageNumber = 0;
    this.skip = 0;
    this.pageSize = 20;
    this.searchText = null;
    this.state.skip = 0;
    this.state.take = 20;
    this.getAllUserstoriesWaitingForQAApproval();
  }

  filterClick() {
    this.isOpen = !this.isOpen;
  }

  resetAllFilters() {
    this.searchText = "";
    this.selectedValue = "";
    this.projectFilterIsActive = false;
    this.employeeFilterIsActive = false;
    this.searchFilterIsActive = false;
    this.projectId = "";
    this.ownerUserId = null;
    this.ownerUserId = "";
    this.selectedEmployee = "";
    this.showGoalDetails = false;
    this.showUserstoryOutsideQaDetails = false;
    this.showUserstoryOutsideQaDetailsFilterIsEnable = false;
    this.showUserstoryOutsideQaDetailsFilterIsEnable = false;
    this.selectedEntity = "";
    this.state.skip = 0;
    this.state.take = 20;
    if (this.defaultFilterValue) {
      this.changeFilterValue(this.defaultFilterValue);
    } else {
      this.changeFilterValue("all");
    }
    this.getAllUserstoriesWaitingForQAApproval();
  }

  getAllUserstoriesWaitingForQAApproval() {
    this.anyOperationInProgress = true;
    const productivityDashboard = new ProductivityDashboardModel();
    productivityDashboard.ownerUserId = this.ownerUserId ;
    // productivityDashboard.pageSize = this.pageSize;
    // productivityDashboard.pageNumber = this.pageNumber + 1;
    productivityDashboard.pageNumber = (this.state.skip / this.state.take) + 1;
    productivityDashboard.pageSize = this.state.take;
    productivityDashboard.sortBy = this.sortBy;
    productivityDashboard.sortDirectionAsc = this.sortDirection;
    productivityDashboard.searchText = this.searchText;
    productivityDashboard.projectId = this.projectId ;
    productivityDashboard.isUserstoryOutsideQa = this.showUserstoryOutsideQaDetails;
    productivityDashboard.entityId = this.selectedEntity;
    productivityDashboard.isAll = this.all;
    productivityDashboard.isReportingOnly = this.reportingOnly;
    productivityDashboard.isMyself = this.myself;

    productivityDashboard.state = this.state;
    productivityDashboard.columns = this.columns;
    this.persistanceObject = productivityDashboard;
    this.updatePersistance();

    this.productivityService.GetUserStoriesWaitingForQaApproval(productivityDashboard).subscribe((responseData: any) => {
      if (responseData.success === false) {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
      if (responseData.data.length === 0) {
        this.userStoriesWaitingForQaApproval = [];
        this.count = 0;
      }
      else {
        // this.userStoriesWaitingForQaApproval = responseData.data;
        this.userStoriesWaitingForQaApproval = {
          data: responseData.data,
          total: responseData.data.length > 0 ? responseData.data[0].totalCount : 0,
        }
        if (this.userStoriesWaitingForQaApproval.total > this.state.take) {
          this.pageable = true;
        }
        else {
          this.pageable = false;
        }
        // this.count = this.userStoriesWaitingForQaApproval[0].totalCount;
        this.scrollbarH = true;
      }
      this.anyOperationInProgress = false;
      this.cdRef.detectChanges();
    });
  }

  goToProfile(url) {
    this.closePopUp.emit(true);
    this.router.navigateByUrl("dashboard/profile/" + url);
  }

  entityValues(name) {
    this.selectedEntity = name;
    this.state.skip = 0;
    this.state.take = 20;
    this.getAllUserstoriesWaitingForQAApproval();
  }

  navigateToUserStoriesPage(rowData) {
    //this.closePopUp.emit(true);
    if (rowData != undefined && rowData != null && this.accessViewroject && (this.projectSearchResults.filter(item => item.projectId == rowData.projectId).length > 0)) {
      console.log("User having project access");

      // if (rowData.isFromSprint)
      //   this.router.navigate(["projects/sprint-workitem", rowData.userStoryId]);
      // else
      //   this.router.navigate(["projects/workitem", rowData.userStoryId]);

      let dialogId = "unique-userstory-dialog-waiting-for-qa";
      const dialogRef = this.dialog.open(this.uniqueUserstoryDialog, {
        height: "90vh",
        width: "70%",
        direction: 'ltr',
        id: dialogId,
        data: { userStory: { isSprintUserStory: rowData.isFromSprint, userStoryId: rowData.userStoryId }, notFromAudits: true, dialogId: dialogId, isFromSprint: rowData.isFromSprint },
        disableClose: true,
        panelClass: 'userstory-dialog-scroll'
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result.redirection) {
          this.closePopUp.emit(true);
        }
        if (result.success == 'yes') {
          this.getAllUserstoriesWaitingForQAApproval();
        }
      });

      console.log(rowData);
    }
    else {
      console.log("User does have project access");
      this.toaster.warning("You don't have permission to access this feature.");
    }

  }
  changeFilterValue(value) {
    if (value == "all") {
      this.selectedFilterValue = "all";
      this.all = true;
      this.reportingOnly = false;
      this.myself = false;
    }
    else if (value == "reportingOnly") {
      this.selectedFilterValue = "reportingOnly";
      this.all = false;
      this.reportingOnly = true;
      this.myself = false;
    }
    else if (value == "mySelf") {
      this.selectedFilterValue = "mySelf";
      this.all = false;
      this.reportingOnly = false;
      this.myself = true;
    }
    this.state.skip = 0;
    this.state.take = 20;
    this.getAllUserstoriesWaitingForQAApproval();
  }

}
