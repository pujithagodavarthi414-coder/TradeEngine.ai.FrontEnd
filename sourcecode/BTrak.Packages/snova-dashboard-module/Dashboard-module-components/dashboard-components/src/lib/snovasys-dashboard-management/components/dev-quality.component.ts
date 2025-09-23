import { ChangeDetectorRef, Component, Input, OnInit, EventEmitter, Output, TemplateRef, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { State } from "../store/reducers/authentication.reducers";
import { DevQualityData } from "../models/devQualityData";
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { ProductivityDashboardModel } from "../models/productivityDashboardModel";
import { ProductivityDashboardService } from "../services/productivity-dashboard.service";
import { LoadProjectsTriggered } from "../store/actions/project.actions";
import * as projectModuleReducer from "../store/reducers/index";
import * as workspaceModuleReducer from "../store/reducers/index";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { Page } from '../models/Page.model';
import { ProjectSearchResult } from '../models/project-search-result.model';
import { WorkspaceList } from '../models/workspace-list.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import { ProjectSearchCriteriaInputModel } from '../models/project-search-criteria-input.model';
import * as moment_ from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { UniqueUserstorysDialogComponent } from './user-story-unique-dialog/unique-userstory-dialog.component';
import { CookieService } from "ngx-cookie-service";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
const moment = moment_;

@Component({
  selector: "app-dashboard-component-devQuality",
  templateUrl: "./dev-quality.component.html"
})

export class DevQualityComponent extends CustomAppBaseComponent implements OnInit {
  @Output() closePopUp = new EventEmitter<any>();
  @ViewChild("uniqueUserstoryDialog", { static: true }) private uniqueUserstoryDialog: TemplateRef<any>;
  isMySelfOnlyRequired: boolean = false;

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
      this.selectedUserId = this.dashboardFilters.userId;
      if (this.selectedUserId == this.cookieService.get(LocalStorageProperties.CurrentUserId)) {
        this.isMySelfOnlyRequired = true;
      }
      else {
        this.isMySelfOnlyRequired = false;
      }
      this.cdRef.detectChanges();
      this.ngOnInit()
    }
  }

  dashboardFilters: DashboardFilterModel;
  softLabels: SoftLabelConfigurationModel[];
  date: Date = new Date();
  selectedDate: string = this.date.toISOString();
  filters: any[] = [
    { value: "Week", id: 0 },
    { value: "Month", id: 1 }
  ];
  selectedUserId: string;
  selectedValue: string = ConstantVariables.Month;
  type: string = ConstantVariables.Month;
  weekNumber: number;
  direction: any;
  selectedFilter = { value: "Week", id: 0 };
  searchProductivity: any;
  totalElements: number;
  anyOperationInProgress: boolean;
  page = new Page();
  sortBy: string = null;
  sortDirectionAsc = true;
  searchText: string = null;
  devQuality: DevQualityData[];
  validationMessage: string;
  selectedEntity: string;
  entities: EntityDropDownModel[];
  getProductivityIndex: any;
  getSelectedDateEvent: any;
  searchProductivityRecords: any;
  isOpen = true;
  sortByFilterIsActive = true;
  dateFilterIsActive = true;
  searchIsActive: boolean;
  scrollbarH: boolean;
  accessViewProject: Boolean = false;
  public ngDestroyed$ = new Subject();
  projectSearchResults$: Observable<ProjectSearchResult[]>;
  projectSearchResults: any;
  selectedFilterValue: string = "all";
  all: boolean = true;
  reportingOnly: boolean = false;
  myself: boolean = false;
  defaultFilterValue: string;
  isDevQuality: Boolean;
  disableDropDown: boolean = false;
  workspacesList$: Observable<WorkspaceList[]>;
  workspaces: WorkspaceList[];
  selectedWorkspaceId: string;
  isAll: boolean = true;
  isReportedOnly: boolean = true;
  isMyself: boolean = true;


  constructor(
    private productivityService: ProductivityDashboardService, private toastr: ToastrService, private cookieService: CookieService,
    private store: Store<State>, private toaster: ToastrService, private router: Router,
    private cdRef: ChangeDetectorRef, private route: ActivatedRoute, public dialog: MatDialog, private routes: Router) {
    super();
    this.page.size = 15;
    this.page.pageNumber = 0;

    this.route.params.subscribe((params) => {
      if (params["id"] != null && params["id"] !== undefined) {
        this.selectedWorkspaceId = params["id"];
      }
    });
    this.workspaces = JSON.parse(localStorage.getItem('Dashboards'));
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
    if (this.routes.url.includes('/dashboard/myproductivity')) {
      this.selectedFilterValue = "mySelf";
      this.defaultFilterValue = this.selectedFilterValue;
      this.all = false;
      this.reportingOnly = false;
      this.myself = true;
      this.disableDropDown = true;
      this.isAll = false;
      this.isMyself = true;
      this.isReportedOnly = false;
    }
    else {
      this.selectedFilterValue = "all";
      this.defaultFilterValue = this.selectedFilterValue;
      this.all = true;
      this.reportingOnly = false;
      this.myself = false;
      this.disableDropDown = true;
      this.isAll = true;
      this.isMyself = true;
      this.isReportedOnly = true;
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.isDevQuality = this.canAccess_feature_DevQuality;
    if (this.isDevQuality) {
      this.getAllUserstoryStatus();
    }
    this.getSoftLabels();
    this.getEntityDropDown();
    this.accessViewProject = this.canAccess_feature_ViewProjects;
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
  isMySelfOnly() {

  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
  }

  onSort(event) {
    const sort = event.sorts[0];
    this.sortBy = sort.prop;
    this.page.size = 15;
    this.page.pageNumber = 0;
    if (sort.dir === "asc") {
      this.sortDirectionAsc = true;
    } else {
      this.sortDirectionAsc = false;
    }
    this.getAllUserstoryStatus();
  }

  setPage(data) {
    this.searchText = this.searchText;
    this.page.pageNumber = data.offset;
    this.page.size = 15;
    this.getAllUserstoryStatus();
  }

  changeFilterType() {
    this.type = this.selectedValue;
    this.getProductivityIndexForDevelopers(this.type);
  }

  parse(value: any): Date | null {
    if ((typeof value === "string") && (value.indexOf("/") > -1)) {
      // tslint:disable-next-line: quotemark
      const str = value.split('/');
      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      return new Date(year, month, date);
    } else if ((typeof value === "string") && value === "") {
      return new Date();
    }
    const timestamp = typeof value === "number" ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }

  searchRecords() {
    if (this.searchText) {
      this.searchIsActive = true;
    } else {
      this.searchIsActive = false;
    }
    if (this.searchText && this.searchText.trim().length <= 0) { return; }
    this.searchText = this.searchText.trim();
    this.getAllUserstoryStatus();
  }

  getProductivityIndexForDevelopers(type) {
    this.type = type; if (this.type === "Week") {
      const monthStartDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
      this.date = monthStartDay;
      this.weekNumber = this.getWeekNumber(this.date);
    } else {
      this.type = type;
      this.weekNumber = null;
    }
    this.getAllUserstoryStatus();
  }

  getDevQualityBasedOnDate(direction) {
    this.direction = direction;
    if (this.type === "Month") {
      if (direction === "left") {
        const day = this.date.getDate();
        const month = 0 + (this.date.getMonth() + 1) - 1;
        const year = this.date.getFullYear();
        const newDate = day + "/" + month + "/" + year;
        this.date = this.parse(newDate);
      } else {
        const day = this.date.getDate();
        const month = (this.date.getMonth() + 1) + 1;
        const year = 0 + this.date.getFullYear();
        const newDate = day + "/" + month + "/" + year;
        this.date = this.parse(newDate);
      }
    } else {
      if (direction === "left") {
        const day = this.date.getDate() - 7;
        const month = 0 + (this.date.getMonth() + 1);
        const year = this.date.getFullYear();
        const newDate = day + "/" + month + "/" + year;
        this.date = this.parse(newDate);
        this.weekNumber = this.getWeekNumber(this.date);
      } else {
        const day = this.date.getDate() + 7;
        const month = 0 + (this.date.getMonth() + 1);
        const year = this.date.getFullYear();
        const newDate = day + "/" + month + "/" + year;
        this.date = this.parse(newDate);
        this.weekNumber = this.getWeekNumber(this.date);
      }
    }
    this.getAllUserstoryStatus();
  }

  getWeekNumber(selectedDate) {
    const monthStartDay = (new Date(this.date.getFullYear(), this.date.getMonth(), 1)).getDay();
    const weekNumber = (selectedDate.getDate() + monthStartDay) / 7;
    const week = (selectedDate.getDate() + monthStartDay) % 7;
    if (week !== 0) {
      return Math.ceil(weekNumber);
    } else {
      return weekNumber;
    }
  }

  closeSearch() {
    this.searchText = "";
    this.searchIsActive = false;
    this.getAllUserstoryStatus();
  }

  filterClick() {
    this.isOpen = !this.isOpen;
  }

  resetAllFilters() {
    this.selectedValue = ConstantVariables.Month;
    this.date = new Date();
    this.selectedDate = this.date.toISOString();
    this.searchText = "";
    this.searchIsActive = false;
    this.selectedEntity = "";
    if (this.routes.url.includes('/dashboard/myproductivity')) {
      this.selectedFilterValue = "mySelf";
    }
    else {
      this.selectedFilterValue = "all";
    }
    if (this.defaultFilterValue) {
      this.changeFilterValue(this.defaultFilterValue);
    } else {
      this.changeFilterValue("all");
    }
    this.changeFilterType();
    this.getAllUserstoryStatus();
  }

  getAllUserstoryStatus() {
    this.anyOperationInProgress = true;
    this.type = this.type;
    this.scrollbarH = false;
    this.selectedDate = moment(this.date).format("YYYY-MM-DD");
    const productivityDashboard = new ProductivityDashboardModel();
    productivityDashboard.type = this.type;
    productivityDashboard.selectedDate = this.selectedDate;
    productivityDashboard.pageSize = this.page.size;
    productivityDashboard.pageNumber = this.page.pageNumber + 1;
    productivityDashboard.sortBy = this.sortBy;
    productivityDashboard.entityId = this.selectedEntity;
    productivityDashboard.sortDirectionAsc = this.sortDirectionAsc;
    productivityDashboard.searchText = this.searchText;
    productivityDashboard.isAll = this.all;
    productivityDashboard.isReportingOnly = this.reportingOnly;
    productivityDashboard.isMyself = this.myself;
    productivityDashboard.projectId = this.dashboardFilters ? this.dashboardFilters.projectId : '';

    this.productivityService.GetUserStoryStatuses(productivityDashboard).subscribe((responseData: any) => {
      if (responseData.success === false) {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
        this.cdRef.detectChanges();
      }
      else {
        this.devQuality = responseData.data;
        this.page.totalElements = this.devQuality.length > 0 ? this.devQuality[0].totalCount : 0;
        this.page.totalPages = this.page.totalElements / this.page.size;
        this.anyOperationInProgress = false;
        this.scrollbarH = true;
        this.cdRef.detectChanges();
      }
    });
  }

  goToProfile(url) {
    this.closePopUp.emit(true);
    this.router.navigateByUrl("dashboard/profile/" + url);
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
      this.cdRef.detectChanges();
    });
  }

  entityValues(name) {
    this.selectedEntity = name;
    this.getAllUserstoryStatus();
  }

  navigateToUserStoriesPage(rowData) {
    // if (rowData != undefined && rowData != null && this.accessViewProject && (this.projectSearchResults.filter(item => item.projectId == rowData.projectId).length > 0)) {
    //   if (rowData.isFromSprint)
    //     this.router.navigate(["projects/sprint-workitem", rowData.userStoryId]);
    //   else
    //     this.router.navigate(["projects/workitem", rowData.userStoryId]);
    // }
    // else
    //   this.toastr.warning("You don't have permission to access this feature.");
    if (rowData != undefined && rowData != null && this.accessViewProject && (this.projectSearchResults.filter(item => item.projectId == rowData.projectId).length > 0)) {
      let dialogId = "unique-userstory-dialog";
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
          this.getAllUserstoryStatus();
        }
      });
    }
    else {
      this.toastr.warning("You don't have permission to access this feature.");
    }
  }

  changeFilterValue(value) {
    if (value == "all") {
      this.all = true;
      this.reportingOnly = false;
      this.myself = false;
    }
    else if (value == "reportingOnly") {
      this.all = false;
      this.reportingOnly = true;
      this.myself = false;
    }
    else if (value == "mySelf") {
      this.all = false;
      this.reportingOnly = false;
      this.myself = true;
    }
    this.getAllUserstoryStatus();
  }

}
