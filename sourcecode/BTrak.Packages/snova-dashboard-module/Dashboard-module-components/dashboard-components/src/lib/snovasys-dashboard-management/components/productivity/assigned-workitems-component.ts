import { Component, ChangeDetectorRef, OnInit, Output, EventEmitter, Input, TemplateRef, ViewChild } from "@angular/core";
import { MyProfileService } from "../../services/myProfile.service";
import { HistoricalWorkReportModel } from "../../models/historicalWorkReport";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { State } from '@progress/kendo-data-query';
import { DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { LineManagersModel } from '../../models/line-mangaers-model';
import { ToastrService } from "ngx-toastr";
import { HrDashboardService } from "../../services/hr-dashboard.service";
import { Observable, Subject } from "rxjs";
import * as projectReducer from "../../store/reducers/index";
import { select, Store } from "@ngrx/store";
import * as HRState from '../../store/reducers/index';
import * as commonModuleReducers from "../../store/reducers/index";
import { TranslateService } from "@ngx-translate/core";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { BoardType } from '../../models/board-type.model';
import { Project } from '../../models/project.model';
import { UserDropDownModel } from '../../models/user-dropdown.model';
import { SoftLabelConfigurationModel } from '../../models/soft-labels.model';
import { Page } from '../../models/Page.model';
import { DashboardService } from '../../services/dashboard.service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { ProjectSearchCriteriaInputModel } from '../../models/project-search-criteria-input.model';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { LoadBoardTypesTriggered } from '../../store/actions/board-types.actions';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { StatusreportService } from '../../services/statusreport.service';
import { getDate } from '@progress/kendo-date-math';
import { DashboardFilterModel } from '../../models/dashboardfilter.model';
import { Persistance } from '../../models/persistance.model';
import { SoftLabelPipe } from '../../pipes/soft-labels.pipe';
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-dashboard-component-AssignedWorkItems',
  templateUrl: 'assigned-workitems-component.html',
})

export class AssignedWorkItemsComponent extends CustomAppBaseComponent implements OnInit {
  @Output() closePopUp = new EventEmitter<any>();
  @ViewChild("uniqueUserstoryDialogHistorical", { static: true }) private uniqueUserstoryDialog: TemplateRef<any>;
  downloadExcel: boolean;

  @Input("dashboardId")
  set _dashboardId(data: string) {
    if (data != null && data !== undefined && data !== this.persistanceId) {
      this.persistanceId = data;
    }
  }

  // @Input("dashboardFilters")
  // set _dashboardFilters(data: DashboardFilterModel) {
  //   if (data && data !== undefined) {
  //     this.dashboardFilters = data;
  //     this.projectId = this.dashboardFilters.projectId;
  //   }
  // }
  numberOfTicks = 0;
  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
      this.projectId = this.dashboardFilters.projectId;
      if(this.dashboardFilters.dateFrom && this.dashboardFilters.dateTo){
        var dateFromStr = this.datePipe.transform(this.dashboardFilters.dateFrom, 'yyyy-MM-dd');
        this.fromDate = new Date(dateFromStr);
        var dateToStr = this.datePipe.transform(this.dashboardFilters.dateTo, 'yyyy-MM-dd');
        this.toDate = new Date(dateToStr);
       }else{
        var dateStr = this.datePipe.transform(this.dashboardFilters.date, 'yyyy-MM-dd');
         this.fromDate = this.dashboardFilters.date ? new Date(dateStr) : null;
         this.toDate =this.dashboardFilters.date ? new Date(dateStr) : null;
       }
      this.selectedUserId = this.dashboardFilters.userId;
      if(!this.selectedUserId){
        this.selectedUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
      }
      else{
        this.selectedUserId = this.dashboardFilters.userId;
      }
      this.selectedAssigneeId(this.selectedUserId)
      this.cdRef.detectChanges();
  }
  }
  columns = [];
  hiddenColumns = [];
  hidden = [];

  dashboardFilters: DashboardFilterModel;
  isAnyOperationIsInprogress: boolean = false;
  historicalWork: any;
  validationMessage: string;
  selectedUserId: string;
  persistanceId: string;
  persistanceObject: any;
  sortDirection: boolean;
  searchText: string = '';
  sortBy: string;
  fromDate: Date = null;
  createFromDate: Date = null;
  isOpen: boolean = true;
  toDate: Date = null;
  createToDate: Date = null;
  minDateForEndDate = null;
  dateFilterIsActive: boolean = true;
  lineManager: LineManagersModel[];
  selectLineManagerfilter: boolean = false;
  teamLeadId: string;
  projectSearchResults$: Observable<Project[]>;
  projectsList: Project[];
  projectId: string;
  selectedProjectfilter: boolean = false;
  public ngDestroyed$ = new Subject();
  boardTypes$: Observable<BoardType[]>;
  selectBoardTypefilter: boolean = false;
  boardTypeId: string;
  searchByMinValue: boolean = false;
  searchReplanMinText: number;
  searchReaplanMin: boolean = false;
  searchByMaxValue: boolean = false;
  searchReplanMaxText: number;
  searchReaplanMax: boolean = false;
  selectedUserfilter: boolean = false;
  UsersList: UserDropDownModel[];
  selectedUser: string;
  maxDate = new Date();
  isProfilePage: boolean = false;
  isFromProject: boolean = false;
  pageable: boolean = false;
  scrollbarH: boolean = false;
  loadingIndicator: boolean = false;
  assigneeList: any[] = [];
  softLabels: SoftLabelConfigurationModel[];
  roleFeaturesIsInProgress$: Observable<boolean>;
  page = new Page();
  selecAssigneefilter: boolean = false;
  downloadInProgress: boolean = false;
  assignedworkItemsList : any[] = [];
  state: State = {
    skip: 0,
    take: 20,
  };
  isMyproductivity:boolean = false;
  assigneeFilterVisible: boolean = true;

  constructor(
    private cdRef: ChangeDetectorRef, private dashboardService: DashboardService,
    private hrdashboardservice: HrDashboardService, private toaster: ToastrService,
    private profileService: MyProfileService, private router: Router,
    private cookieService: CookieService, private store: Store<HRState.State>,
    public dialog: MatDialog, private translateService: TranslateService,
    private statusReportService: StatusreportService, private softLabelsPipe: SoftLabelPipe, private datePipe: DatePipe
  ) {
    super();

    if ((this.router.url.indexOf('/dashboard/profile') > -1) && this.router.url.split("/")[3]) {
      this.isProfilePage = true;
      this.persistanceId = ConstantVariables.WORKREPORTPROFILEID;
      this.selectedUserId = this.router.url.split("/")[3];
    } else {
      this.isProfilePage = false;
      this.selectedUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    }
    if(this.router.url.includes('/dashboard/myproductivity')){
      this.isMyproductivity = true;
    }
    if(this.isProfilePage || this.isMyproductivity){
      this.assigneeFilterVisible = false;
    }
    if (!this.isProfilePage) {
      if ((this.router.url.indexOf('/projects/projectstatus') > -1) && this.router.url.split("/")[3]) {
        this.isFromProject = true;
        const projectId = this.router.url.split("/")[3];
        this.getProjectMembersList(projectId);
      } else {
        this.isFromProject = false;
        this.getTeamMembersList();
      }
    }
  }



  ngOnInit() {
    super.ngOnInit();
    this.roleFeaturesIsInProgress$ = this.store.pipe(select(commonModuleReducers.getRoleFeaturesLoading));
    this.getSoftLabels();
    this.page.size = 20;
    this.page.pageNumber = 0;
    // this.oneMonthBack();
    this.getUsers();
    this.loadProjectsList();
    this.getLineManagers();
    if(!this.dashboardFilters.dateTo && !this.dashboardFilters.dateFrom && !this.dashboardFilters.date){
      this.getPersistance();
    }
    // this.getHistoricalWork();
    this.getBoardTypes();
  }

  getBoardTypes() {
    this.store.dispatch(new LoadBoardTypesTriggered());
    this.boardTypes$ = this.store.pipe(select(projectReducer.getBoardTypesAll));
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
  }

  dateFromChanged(event: MatDatepickerInputEvent<Date>) {
    this.fromDate = event.target.value;
    this.state.skip = 0;
    this.state.take = 20;
    this.getHistoricalWork();
  }

  closeFromDateFilter() {
    this.fromDate = null;
    this.state.skip = 0;
    this.state.take = 20;
    this.getHistoricalWork();
  }

  createDateFromChanged(event: MatDatepickerInputEvent<Date>) {
    this.createFromDate = event.target.value;
    this.state.skip = 0;
    this.state.take = 20;
    this.getHistoricalWork();
  }

  closeCreateFromDateFilter() {
    this.createFromDate = null;
    this.state.skip = 0;
    this.state.take = 20;
    this.getHistoricalWork();
  }

  dateToChanged(event: MatDatepickerInputEvent<Date>) {
    this.toDate = event.target.value;
    this.state.skip = 0;
    this.state.take = 20;
    this.getHistoricalWork();
  }

  closeToDateFilter() {
    this.toDate = null;
    this.state.skip = 0;
    this.state.take = 20;
    this.getHistoricalWork();
  }

  createDateToChanged(event: MatDatepickerInputEvent<Date>) {
    this.createToDate = event.target.value;
    this.state.skip = 0;
    this.state.take = 20;
    this.getHistoricalWork();
  }

  closeCreateToDateFilter() {
    this.createToDate = null;
    this.state.skip = 0;
    this.state.take = 20;
    this.getHistoricalWork();
  }

  getTeamMembersList() {
    this.statusReportService.getTeamLeadsList().subscribe((response: any) => {
      if (response.success == true) {
        this.assigneeList = response.data;
      }
    })
  }

  getProjectMembersList(projectId) {
    this.statusReportService.getAllProjectMembers(projectId).subscribe((response: any) => {
      if (response.success == true) {
        this.assigneeList = response.data;
      }
    })
  }
  selectedAssigneeId(userId) {
    if (userId === '0') {
      this.selecAssigneefilter = false;
      this.selectedUserId = "";
    }
    this.selecAssigneefilter = true;
    this.selectedUserId = userId;
    this.state.skip = 0;
    this.state.take = 20;
    this.getHistoricalWork();
  }

  getHistoricalWork() {
    this.isAnyOperationIsInprogress = true;
    var historicalWorkReportModel = new HistoricalWorkReportModel();
    historicalWorkReportModel.userId = this.selectedUserId;
    historicalWorkReportModel.dateFrom = this.fromDate;
    historicalWorkReportModel.createDateFrom = this.createFromDate;
    historicalWorkReportModel.dateTo = this.toDate;
    historicalWorkReportModel.createDateTo = this.createToDate;
    historicalWorkReportModel.lineManagerId = this.teamLeadId;
    historicalWorkReportModel.projectId = this.projectId;
    historicalWorkReportModel.boardTypeId = this.boardTypeId;
    historicalWorkReportModel.NoOfReplansMin = this.searchReplanMinText;
    historicalWorkReportModel.NoOfReplansMax = this.searchReplanMaxText;
    historicalWorkReportModel.IsTableView = true;
    historicalWorkReportModel.isProject = this.isFromProject;

    historicalWorkReportModel.sortBy = this.sortBy;
    historicalWorkReportModel.sortDirectionAsc = this.sortDirection;
    historicalWorkReportModel.pageNumber = (this.state.skip / this.state.take) + 1;
    historicalWorkReportModel.pageSize = this.state.take;

    historicalWorkReportModel.state = this.state;
    historicalWorkReportModel.columns = this.columns;
    this.persistanceObject = historicalWorkReportModel;
    this.updatePersistance();

    this.profileService.getHistoricalWork(historicalWorkReportModel).subscribe((response: any) => {
      if (response.success == true) {
        this.historicalWork = {
          data: response.data,
          total: response.data.length > 0 ? response.data[0].totalCount : 0,
        }
        if (this.historicalWork.total > this.state.take) {
          this.pageable = true;
        }
        else {
          this.pageable = false;
        }
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
      }
      else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
      }
    });

  }

  oneMonthBack() {
    this.toDate = new Date();
    this.createToDate = new Date();
    const day = this.fromDate.getDate();
    const month = 0 + (this.fromDate.getMonth() - 0);
    const year = this.fromDate.getFullYear();
    const newDate = day + '/' + month + '/' + year;
    this.fromDate = this.parse(newDate);
    this.createFromDate = this.parse(newDate);
    console.log(this.fromDate);

  }

  parse(value: any): Date | null {
    if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
      const str = value.split('/');
      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      return new Date(year, month, date);
    } else if ((typeof value === 'string') && value === '') {
      return new Date();
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }

  filterClick() {
    this.isOpen = !this.isOpen;
  }

  resetAllFilters() {
    this.fromDate = null;
    this.createFromDate = null;
    this.toDate = null;
    this.createToDate = null;

    if ((this.router.url.indexOf('/dashboard/profile') > -1) && this.router.url.split("/")[3]) {
      this.selectedUserId = this.router.url.split("/")[3];
    } else {
      this.selectedUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    }

    this.projectId = this.dashboardFilters.projectId != null ? this.dashboardFilters.projectId: null;
    this.teamLeadId = null;
    this.boardTypeId = null;
    this.searchReplanMinText = null
    this.searchReplanMaxText = null;
    this.page.size = 20;
    this.page.pageNumber = 0;
    this.state.skip = 0;
    this.state.take = 20;
    this.cdRef.detectChanges();
    // this.oneMonthBack();
    this.getHistoricalWork();
  }

  onVisibilityChange(event) {
    let columns = event.columns;
    if (columns && columns.length > 0) {
      // this.columns = [];
      for (let i = 0; i < columns.length; i++) {
        let object = {};
        let hiddenObject = {};
        object['field'] = columns[i].field;
        object['hidden'] = columns[i].hidden;
        let index = this.columns.findIndex(x => x.field == columns[i].field);
        let hidIndex = this.hiddenColumns.findIndex(x => x.field == columns[i].field);
        let hiIndex = this.hidden.findIndex( x => x == columns[i].title);
        if (index == -1)
          this.columns.push(object);
        else {
          this.columns[index].field = columns[i].field;
          this.columns[index].hidden = columns[i].hidden;
        }

        if(columns[i].hidden) {
          if(hidIndex == -1){
            hiddenObject['field'] = columns[i].field;
            hiddenObject['hidden'] = columns[i].hidden;
            hiddenObject['title'] = columns[i].title;
            this.hiddenColumns.push(hiddenObject);
            this.hidden.push(hiddenObject['title']);
          }
        } else if(!columns[i].hidden && hidIndex > -1){
          this.hiddenColumns.splice(hidIndex, 1);
          this.hidden.splice(hiIndex, 1);
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
    this.getHistoricalWork();
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
            this.getHistoricalWork();
          }
          else {
            this.getHistoricalWork();
          }
        }
        else {
          this.getHistoricalWork();
        }
      });
    }
    else {
      this.getHistoricalWork();
    }
  }

  setPersistanceValues(data) {
    this.state = data.state;
    this.columns = (data.columns == null || data.columns.length == 0) ? [] : data.columns;
    // this.selectedUserId = data.userId;
    this.fromDate = this.dashboardFilters.dateFrom ? this.dashboardFilters.dateFrom : data.dateFrom;
    this.createFromDate = data.createDateFrom;
    this.toDate = this.dashboardFilters.dateFrom ? this.dashboardFilters.dateFrom : data.dateTo;
    this.createToDate = data.createDateTo;
    this.teamLeadId = data.lineManagerId;
    // this.projectId = data.projectId;
    this.projectId = (this.dashboardFilters && this.dashboardFilters.projectId) ? this.dashboardFilters.projectId : data.projectId;
    this.boardTypeId = data.boardTypeId;
    this.searchReplanMinText = data.NoOfReplansMin;
    this.searchReplanMaxText = data.NoOfReplansMax;
    this.cdRef.detectChanges();
  }

  selectedLineManagerId(selectedLineManagerId) {
    if (selectedLineManagerId === '0') {
      this.selectLineManagerfilter = false;
      this.teamLeadId = "";
    }
    this.selectLineManagerfilter = true;
    this.teamLeadId = selectedLineManagerId;
    this.state.skip = 0;
    this.state.take = 20;
    this.getHistoricalWork();
  }

  

  selectedProjectId(selectedProjectId) {
    if (selectedProjectId === '0') {
      this.selectedProjectfilter = false;
      this.projectId = null;
    }
    this.selectedProjectfilter = true;
    this.projectId = selectedProjectId;
    this.state.skip = 0;
    this.state.take = 20;
    this.getHistoricalWork();
  }

  selectedBoardTypeId(boardTypeId) {
    if (boardTypeId === '0') {
      this.selectBoardTypefilter = false;
      this.boardTypeId = "";
    }
    this.selectBoardTypefilter = true;
    this.boardTypeId = boardTypeId;
    this.state.skip = 0;
    this.state.take = 20;
    this.getHistoricalWork();
  }


  searchByReplanMinValue() {
    if (this.searchReplanMinText == null)
      this.searchByMinValue = false;
    else
      this.searchByMinValue = true;
    this.state.skip = 0;
    this.state.take = 20;
    this.getHistoricalWork();
  }

  selectUser(selecteduserId) {
    if (selecteduserId === '0') {
      this.selectedUserfilter = false;
      this.selectedUser = "";
    }
    this.selectedUserfilter = true;
    this.selectedUser = selecteduserId;
    this.selectedUserId = selecteduserId;
    this.state.skip = 0;
    this.state.take = 20;
    this.getHistoricalWork();
  }

  searchByReplanMaxValue() {
    if (this.searchReplanMaxText == null)
      this.searchByMaxValue = false;
    else
      this.searchByMaxValue = true;
    this.state.skip = 0;
    this.state.take = 20;
    this.getHistoricalWork();
  }

  loadProjectsList() {
    const projectSearchResult = new ProjectSearchCriteriaInputModel();
    projectSearchResult.isArchived = false;
    this.dashboardService.searchProjects(projectSearchResult).subscribe((result: any) => {
      this.projectsList = result.data
      if (result.success == false) {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
    })
  }

  getLineManagers() {
    let searchText = '';
    this.hrdashboardservice.getMyTeamManagers(searchText, true).subscribe((result: any) => {
      this.lineManager = result.data
      if (result.success == false) {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
    })
  }

  getUsers() {
    let searchText = '';
    this.dashboardService.getUsersDropDown(searchText).subscribe((result: any) => {
      this.UsersList = result.data
      if (result.success == false) {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
    })
  }


  navigateToUserStoriesPage(userStory) {
    if (userStory.projectInactiveDateTime) {
      this.toaster.error(this.translateService.instant("HISTORICALREPORT.ARCHIVEDPROJECT"));
    }
    else if (userStory.goalInactiveDateTime || userStory.goalParkedDateTime) {
      if (userStory.goalInactiveDateTime) {
        this.toaster.error(this.translateService.instant("HISTORICALREPORT.ARCHIVEDGOAL"));
      }
      else if (userStory.goalParkedDateTime) {
        this.toaster.error(this.translateService.instant("HISTORICALREPORT.PARKEDGOAL"));
      }
    }
    else if (userStory.sprintInactiveDateTime) {
      this.toaster.error(this.translateService.instant("HISTORICALREPORT.SPRINTARCHIVED"));
    }
    else if (userStory.inactiveDateTime == null && userStory.parkedDateTime == null) {
      if (userStory) {
        // if (userStory.sprintId) {
        //   this.closePopUp.emit(true);
        //   userStory.isSprintUserStory = true;
        //   this.router.navigate([
        //     "projects/sprint-workitem",
        //     userStory.userStoryId
        //   ]);
        // } else {
        //   this.closePopUp.emit(true);
        //   this.router.navigate([
        //     "projects/workitem",
        //     userStory.userStoryId
        //   ]);
        // }
        let dialogId = "unique-userstory-dialog-historical";
        const dialogRef = this.dialog.open(this.uniqueUserstoryDialog, {
          height: "90vh",
          width: "70%",
          direction: 'ltr',
          id: dialogId,
          data: { userStory: { isSprintUserStory: userStory.sprintId ? true : false, userStoryId: userStory.userStoryId }, notFromAudits: true, dialogId: dialogId, isFromSprint: userStory.sprintId ? true : false },
          disableClose: true,
          panelClass: 'userstory-dialog-scroll'
        });
        dialogRef.afterClosed().subscribe((result: any) => {
          if (result.redirection) {
            this.closePopUp.emit(true);
          }
          if (result.success == 'yes') {
            this.getHistoricalWork();
          }
        });
      }
    }
    else if (userStory.inactiveDateTime) {
      this.toaster.error(this.translateService.instant(ConstantVariables.ThisUserStoryIsArchived));
    }
    else if (userStory.parkedDateTime) {
      this.toaster.error(this.translateService.instant(ConstantVariables.ThisUserStoryIsParked));
    }
  }

  navigateToGoalDetailsPage(goal) {
    if (goal.projectInactiveDateTime) {
      this.toaster.error(this.translateService.instant("HISTORICALREPORT.ARCHIVEDPROJECT"));
    }
    else if (goal.goalParkedDateTime == null && goal.goalInactiveDateTime == null) {
      this.closePopUp.emit(true);
      this.router.navigate([
        "projects/goal",
        goal.goalId
      ]);
    }
    else if (goal.goalInactiveDateTime) {
      this.toaster.error(this.translateService.instant("HISTORICALREPORT.ARCHIVEDGOAL"));
    }
    else if (goal.goalParkedDateTime) {
      this.toaster.error(this.translateService.instant("HISTORICALREPORT.PARKEDGOAL"));
    }
  }

  navigateToSprintDetailsPage(sprint) {
    this.closePopUp.emit(true);
    this.router.navigate([
      "projects/sprint",
      sprint.sprintId
    ]);
  }

  navigateToProjectDetailsPage(project) {
    if (project.projectInactiveDateTime == null) {
      this.closePopUp.emit(true);
      this.router.navigate([
        "projects/projectstatus/" + project.projectId + "/active-goals"
      ]);
    } else if (project.projectInactiveDateTime) {
      this.toaster.error(this.translateService.instant("HISTORICALREPORT.ARCHIVEDPROJECT"));
    }
  }

  navigateToUserProfile(userid) {
    this.closePopUp.emit(true);
    this.router.navigate(["dashboard/profile", userid, "overview"]);
  }

  resetFromDate() {
    this.fromDate = null;
    // this.oneMonthBack();
    this.getHistoricalWork();
  }

  resetToDate() {
    this.toDate = null;
    this.getHistoricalWork();
  }

  downloadFile(){
    this.downloadInProgress = true;
    var historicalWorkReportModel = new HistoricalWorkReportModel();
    historicalWorkReportModel.userId = this.selectedUserId;
    historicalWorkReportModel.dateFrom = this.fromDate;
    historicalWorkReportModel.createDateFrom = this.createFromDate;
    historicalWorkReportModel.dateTo = this.toDate;
    historicalWorkReportModel.createDateTo = this.createToDate;
    historicalWorkReportModel.lineManagerId = this.teamLeadId;
    historicalWorkReportModel.projectId = this.projectId;
    historicalWorkReportModel.boardTypeId = this.boardTypeId;
    historicalWorkReportModel.NoOfReplansMin = this.searchReplanMinText;
    historicalWorkReportModel.NoOfReplansMax = this.searchReplanMaxText;
    historicalWorkReportModel.IsTableView = true;
    historicalWorkReportModel.isProject = this.isFromProject;
    historicalWorkReportModel.sortBy = this.sortBy;
    historicalWorkReportModel.sortDirectionAsc = this.sortDirection;
    historicalWorkReportModel.hiddenColumnList = this.hidden;
    historicalWorkReportModel.excelColumnList = this.getExcelColumnList();
    var d = new Date();
    historicalWorkReportModel.timeZone = d.getTimezoneOffset();
    this.persistanceObject = historicalWorkReportModel;
    this.updatePersistance();

    this.profileService.downloadHistoricalWork(historicalWorkReportModel).subscribe((responseData: any) => {
      if (responseData.success == true) {
        let filePath = responseData.data;
        this.downloadExcel = false;
        this.cdRef.detectChanges();
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
        this.cdRef.detectChanges();
        this.downloadExcel = false;
      }
      this.downloadInProgress = false;
      this.cdRef.detectChanges();
    });
}
  
  getExcelColumnList(){
    var returnList = [];
      returnList.push({ExcelColumn : this.translateService.instant('HISTORICALREPORT.LASTUPDATEDDATETIME'), ExcelField: "UpdatedDateTime"});
      returnList.push({ExcelColumn : this.softLabelsPipe.transform(this.translateService.instant('WORKLOGGING.PROJECT'), this.softLabels), ExcelField: "ProjectName"});
      returnList.push({ExcelColumn : this.softLabelsPipe.transform(this.translateService.instant('HISTORICALREPORT.GOALNAME'), this.softLabels), ExcelField: "GoalName"});
      returnList.push({ExcelColumn : this.softLabelsPipe.transform(this.translateService.instant('SPRINTS.SPRINTS'), this.softLabels), ExcelField: "SprintName"});
      returnList.push({ExcelColumn : this.softLabelsPipe.transform(this.translateService.instant('HISTORICALREPORT.USERSTORY'), this.softLabels), ExcelField: "UserStoryName"});
      returnList.push({ExcelColumn : this.translateService.instant('HISTORICALREPORT.ASSIGNEDUSER'), ExcelField: "Developer"});
      returnList.push({ExcelColumn : this.softLabelsPipe.transform(this.translateService.instant('HISTORICALREPORT.ESTIMATEDTIME'), this.softLabels), ExcelField: "EstimatedTime"});
      returnList.push({ExcelColumn : this.translateService.instant('HISTORICALREPORT.SPENTTIME'), ExcelField: "SpentTime"});
      returnList.push({ExcelColumn : this.softLabelsPipe.transform(this.translateService.instant('HISTORICALREPORT.ORIGINALESTIMATE'), this.softLabels), ExcelField: "DeadLineDate"});
      returnList.push({ExcelColumn : this.translateService.instant('HISTORICALREPORT.LATESTDEVINPROGRESSDATE'), ExcelField: "LatestDevInprogressDate"});
      returnList.push({ExcelColumn : this.translateService.instant('HISTORICALREPORT.LATESTDEVCOMPLETEDDATE'), ExcelField: "LatestDevCompletedDate"});
      returnList.push({ExcelColumn : this.translateService.instant('HISTORICALREPORT.LATESTDEPLOYEDDATE'), ExcelField: "LatestDeployedDate"});
      returnList.push({ExcelColumn : this.translateService.instant('HISTORICALREPORT.LATESTQAAPPROVEDDATE'), ExcelField: "QaApprovedDate"});
      returnList.push({ExcelColumn : this.translateService.instant('HISTORICALREPORT.CURRENTSTATUS'), ExcelField: "CurrentStatus"});
      returnList.push({ExcelColumn : this.translateService.instant('HISTORICALREPORT.BOUNCEBACKCOUNT'), ExcelField: "BouncedBackCount"});
      returnList.push({ExcelColumn : this.translateService.instant('HISTORICALREPORT.BUGSCOUNT'), ExcelField: "BugsCount"});
      returnList.push({ExcelColumn : this.translateService.instant('HISTORICALREPORT.REPLANUSERSTORIESCOUNT'), ExcelField: "RepalnUserStoriesCount"});
      returnList.push({ExcelColumn : this.translateService.instant('HISTORICALREPORT.BOARDTYPENAME'), ExcelField: "BoardTypeName"});
      returnList.push({ExcelColumn : this.translateService.instant('HISTORICALREPORT.APPROVEDUSERNAME'), ExcelField: "ApprovedUserName"});
      returnList.push({ExcelColumn : this.translateService.instant('ACTIVITYTRACKER.ISPRODUCTIVE'), ExcelField: "IsProductive"});

      return returnList;
  }

  resetcreateFromDate() {
    this.createFromDate = null;
    // this.oneMonthBack();
    this.getHistoricalWork();
  }

  resetCreateToDate() {
    this.createToDate = null;
    this.getHistoricalWork();
  }
}