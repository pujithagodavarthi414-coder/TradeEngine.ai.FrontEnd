import { ChangeDetectorRef, Component, Input, OnInit, Output, EventEmitter, ViewChild, TemplateRef } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import * as commonModuleReducers from "../store/reducers/index";
import { State } from "../store/reducers/authentication.reducers";
import { EntityDropDownModel } from '../models/entity-dropdown.model';
import { ProductivityDashboardModel } from "../models/productivityDashboardModel";
import { qaPerfromance } from "../models/qa-performance";
import { ProductivityDashboardService } from "../services/productivity-dashboard.service";
import { Router, ActivatedRoute } from "@angular/router";
import * as workspaceModuleReducer from "../store/reducers/index";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardfilter.model';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import { WorkspaceList } from '../models/workspace-list.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import { LoadWorkspacesListTriggered } from '../store/actions/Workspacelist.action';
import { State as KendoState } from '@progress/kendo-data-query';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { Persistance } from '../models/persistance.model';
import { DashboardService } from '../services/dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { UniqueUserstorysDialogComponent } from './user-story-unique-dialog/unique-userstory-dialog.component';

@Component({
  selector: "app-dashboard-component-qaPerformance",
  templateUrl: "qa-performance.component.html"
})

export class QaPerformanceComponent extends CustomAppBaseComponent implements OnInit {
  @Output() closePopUp = new EventEmitter<any>();
  @ViewChild("uniqueUserstoryDialogQa", { static: true }) private uniqueUserstoryDialog: TemplateRef<any>;
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
    }
  }

  columns = [];

  dashboardFilters: DashboardFilterModel;
  roleFeaturesIsInProgress$: Observable<boolean>;
  softLabels: SoftLabelConfigurationModel[];
  qaPerformanceDetails: any;
  weekNumber: number;
  skip: number;
  direction: any;
  selectedDate: string;
  persistanceId: string;
  persistanceObject: any;
  count: number;
  totalpages: number;
  anyOperationInProgress = false;
  type: any;
  pageSize: number;
  pageNumber = 0;
  projectId: string;
  sortBy: string;
  sortDirectionAsc: boolean
  date: Date = new Date();
  searchQaPerformance: string;
  validationMessage: string;
  selectedEntity: string;
  entities: EntityDropDownModel[];
  Filters: any[] = [
    { value: "Week", id: 0 },
    { value: "Month", id: 1 }
  ];
  selectedFilter = { value: "Week", id: 0 };
  selectedValue = "Month";
  isOpen = true;
  searchIsActive: boolean;
  projectLabel: string;
  workItemLabel: string;
  goalLabel: string;
  public ngDestroyed$ = new Subject();
  accessViewStores: Boolean = false;
  accessViewroject: Boolean = false;
  selectedFilterValue: string = "all";
  all: boolean = true;
  reportingOnly: boolean = false;
  myself: boolean = false;
  selectedWorkspaceId: string;
  workspaces: WorkspaceList[];
  workspacesList$: Observable<WorkspaceList[]>;
  defaultFilterValue: string;
  disableDropDown: boolean = false;
  sortDirection: boolean = false;
  pageable: boolean = false;
  workSpaceList: WorkspaceList;

  state: KendoState = {
    skip: 0,
    take: 20,
  };

  constructor(
    private productivityService: ProductivityDashboardService, private toaster: ToastrService,
    private cdRef: ChangeDetectorRef, private dashboardService: DashboardService, public dialog: MatDialog,
    private route: ActivatedRoute, private store: Store<State>, private router: Router) {
    super();
    this.type = "Month";
    this.weekNumber = null;
    this.pageNumber = 0;
    this.pageSize = 20;
    this.sortBy = null;
    this.sortDirectionAsc = true;
    this.skip = 0;

    this.route.params.subscribe((params) => {
      if (params["id"] != null && params["id"] !== undefined) {
        this.selectedWorkspaceId = params["id"];
      }
    });
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
    if (this.canAccess_feature_QaPerformance) {
      // this.getAllQAPerformance();
      this.getPersistance();
    }
    this.getEntityDropDown();
    this.roleFeaturesIsInProgress$ = this.store.pipe(select(commonModuleReducers.getRoleFeaturesLoading));
    this.accessViewStores = this.canAccess_feature_ViewStores;
    this.accessViewroject = this.canAccess_feature_ViewProjects;

    this.workSpaceList = new WorkspaceList();
    this.workSpaceList.workspaceId = "null";
    this.workSpaceList.isHidden = false;
    this.store.dispatch(new LoadWorkspacesListTriggered(this.workSpaceList));
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
    if (this.softLabels.length > 0) {
      this.projectLabel = this.softLabels[0].projectLabel;
      this.goalLabel = this.softLabels[0].goalLabel;
      this.workItemLabel = this.softLabels[0].userStoryLabel;
      this.cdRef.markForCheck();
    }
  }

  changeFilterType() {
    // tslint:disable-next-line: triple-equals
    if (this.selectedValue == this.Filters[1].value) {
      this.type = "Month";
      this.weekNumber = null;
      this.getMonthlyQAPerformance();
      // tslint:disable-next-line: triple-equals
    } else if (this.selectedValue == this.Filters[0].value) {
      const monthStartDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
      this.date = monthStartDay;
      this.type = "Week";
      this.weekNumber = this.getWeekNumber(this.date);
      this.getWeeklyQAPerformance();
    }
  }

  getWeeklyQAPerformance() {
    this.state.skip = 0;
    this.state.take = 20;
    this.getAllQAPerformance();
  }

  getMonthlyQAPerformance() {
    this.state.skip = 0;
    this.state.take = 20;
    this.getAllQAPerformance();
  }

  getPreviousSelectedDate(direction) {
    this.state.skip = 0;
    this.state.take = 20;
    this.getProductivityIndexBasedOnDate(direction);
    this.getAllQAPerformance();
  }

  getCurrentSelectedDate(direction) {
    this.pageNumber = 0;
    this.pageSize = 20;
    this.state.skip = 0;
    this.state.take = 20;
    this.getProductivityIndexBasedOnDate(direction);
    this.getAllQAPerformance();
  }

  closeSearch() {
    this.searchQaPerformance = null;
    this.pageNumber = 0;
    this.pageSize = 20;
    this.searchIsActive = false;
    this.state.skip = 0;
    this.state.take = 20;
    this.getAllQAPerformance();
  }

  searchRecords() {
    if (this.searchQaPerformance) {
      this.searchIsActive = true;
    } else {
      this.searchIsActive = false;
    }
    if (this.searchQaPerformance && this.searchQaPerformance.trim().length <= 0) { return; }
    this.searchQaPerformance = this.searchQaPerformance.trim();
    this.pageNumber = 0;
    this.pageSize = 20;
    this.state.skip = 0;
    this.state.take = 20;
    this.getAllQAPerformance();
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
    this.getAllQAPerformance();
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
            this.getAllQAPerformance();
          }
          else {
            this.getAllQAPerformance();
          }
        }
        else {
          this.getAllQAPerformance();
        }
      });
    }
    else {
      this.getAllQAPerformance();
    }
  }

  setPersistanceValues(data) {
    this.state = data.state;
    this.columns = (data.columns == null || data.columns.length == 0) ? [] : data.columns;
    this.type = data.type;
    this.selectedDate = data.selectedDate;
    this.searchQaPerformance = data.searchText;
    this.selectedEntity = data.entityId;
    this.all = data.isAll;
    this.reportingOnly = data.isReportingOnly;
    this.myself = data.isMyself;
    this.changeDuplicateFilterValue(this.all, this.reportingOnly, this.myself);
    // this.projectId = data.projectId;
    this.cdRef.detectChanges();
  }

  onSort(event) {
    console.log(event);
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
    this.getAllQAPerformance();
  }

  setPage(pageInfo) {
    this.pageNumber = pageInfo.offset;
    this.getAllQAPerformance();
  }

  getAllQAPerformance() {
    this.anyOperationInProgress = true;
    this.selectedDate = this.date.toISOString();
    const productivityDashboard = new ProductivityDashboardModel();
    productivityDashboard.type = this.type;
    productivityDashboard.selectedDate = this.selectedDate;
    // productivityDashboard.pageSize = this.pageSize;
    // productivityDashboard.pageNumber = this.pageNumber + 1;
    productivityDashboard.pageNumber = (this.state.skip / this.state.take) + 1;
    productivityDashboard.pageSize = this.state.take;
    productivityDashboard.projectId = this.projectId ? this.projectId : null;
    productivityDashboard.sortBy = this.sortBy;
    productivityDashboard.sortDirectionAsc = this.sortDirection;
    productivityDashboard.searchText = this.searchQaPerformance;
    productivityDashboard.entityId = this.selectedEntity;
    productivityDashboard.isAll = this.all;
    productivityDashboard.isReportingOnly = this.reportingOnly;
    productivityDashboard.isMyself = this.myself;

    productivityDashboard.state = this.state;
    productivityDashboard.columns = this.columns;
    this.persistanceObject = productivityDashboard;
    this.updatePersistance();

    // console.log(productivityDashboard);
    this.productivityService.getQaPerformance(productivityDashboard).subscribe((responseData: any) => {
      if (responseData.success === false) {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
      if (responseData.data.length === 0) {
        this.qaPerformanceDetails = [];
        this.count = 0;
      }
      else {
        // this.qaPerformanceDetails = responseData.data;
        this.qaPerformanceDetails = {
          data: responseData.data,
          total: responseData.data.length > 0 ? responseData.data[0].totalCount : 0,
        }
        if (this.qaPerformanceDetails.total > this.state.take) {
          this.pageable = true;
        }
        else {
          this.pageable = false;
        }
        // this.count = this.qaPerformanceDetails[0].totalCount;
      }
      this.anyOperationInProgress = false;
      this.cdRef.detectChanges();
    });
  }

  getProductivityIndexBasedOnDate(direction) {
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
    this.pageNumber = 0;
    this.pageSize = 20;
    this.sortBy = null;
    this.skip = 0;
    this.sortDirectionAsc = true;
    this.searchQaPerformance = null;
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

  filterClick() {
    this.isOpen = !this.isOpen;
  }

  resetAllFilters() {
    this.selectedValue = "Month";
    this.date = new Date();
    this.searchQaPerformance = "";
    this.searchIsActive = false;
    this.selectedEntity = "";
    this.selectedFilterValue = "all";
    if (this.defaultFilterValue) {
      this.changeFilterValues(this.defaultFilterValue);
    } else {
      this.changeFilterValues("all");
    }
    this.changeFilterType();
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

  entityValues(name) {
    this.selectedEntity = name;
    this.getMonthlyQAPerformance();
  }

  goToProfile(url) {
    this.closePopUp.emit(true);
    this.router.navigateByUrl("dashboard/profile/" + url);
}

  navigateToUserStoriesPage(rowData) {
    //this.closePopUp.emit(true);
    if (rowData != undefined && rowData != null && this.accessViewroject) {
      // if (rowData.isFromSprint)
      //   this.router.navigate(["projects/sprint-workitem", rowData.userStoryId]);
      // else
      //   this.router.navigate(["projects/workitem", rowData.userStoryId]);
      let dialogId = "unique-userstory-dialog-qa-performance";
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
          this.getAllQAPerformance();
        }
      });
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
    this.getAllQAPerformance();
  }

  changeFilterValues(value) {
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
    this.cdRef.detectChanges();
  }

  changeDuplicateFilterValue(all, reporting, myself) {
    if (all) {
      this.selectedFilterValue = "all";
      this.all = true;
      this.reportingOnly = false;
      this.myself = false;
    }
    else if (reporting) {
      this.selectedFilterValue = "reportingOnly";
      this.all = false;
      this.reportingOnly = true;
      this.myself = false;
    }
    else if (myself) {
      this.selectedFilterValue = "mySelf";
      this.all = false;
      this.reportingOnly = false;
      this.myself = true;
    }
    this.cdRef.detectChanges();
  }
}
