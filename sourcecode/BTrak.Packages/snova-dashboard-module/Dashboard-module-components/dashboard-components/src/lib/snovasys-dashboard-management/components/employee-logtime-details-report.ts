import { Component, ChangeDetectorRef, Output, EventEmitter, Input, ViewChild, TemplateRef } from "@angular/core";
import { MyProfileService } from "../services/myProfile.service";
import { HistoricalWorkReportModel } from "../models/historicalWorkReport";
import { Router } from "@angular/router";
import { State } from '@progress/kendo-data-query';
import { DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { Store, select } from "@ngrx/store";
import * as projectReducer from "../store/reducers/index";
import { EmployeeLogtimeReportFieldsModel } from "../models/employeelogtimereportfieldsmodel";
import { DatePipe } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
// import { UniqueUserstorysDialogComponent } from "snova-project-management";
import { TranslateService } from "@ngx-translate/core";
import { Project } from '../models/project.model';
import { ProjectSearchCriteriaInputModel } from '../models/project-search-criteria-input.model';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import { UserDropDownModel } from '../models/user-dropdown.model';
import { BoardType } from '../models/board-type.model';
import { DashboardService } from '../services/dashboard.service';
import { LoadBoardTypesTriggered } from '../store/actions/board-types.actions';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-employee-logtime-details-report',
  templateUrl: 'employee-logtime-details-report.html',
})
export class EmployeeLogTimeDetailsReportComponent {
  @Output() closePopUp = new EventEmitter<any>();

  @ViewChild("uniqueUserstoryDialoglogTime", { static: true }) private uniqueUserstoryDialog: TemplateRef<any>;

  dashboardFilters: any;
  @Input("dashboardFilters")
  set _dashboardFilters(data: any) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }
  isAnyOperationIsInprogress: boolean = false;
  employeeLogTimeDetails: any;
  validationMessage: string;
  selectedUserId: string;
  sortDirection: boolean;
  searchText: string = '';
  sortBy: string;
  fromDate: Date = new Date();
  isOpen: boolean = false;
  toDate: Date = new Date();
  minDateForEndDate = new Date();
  dateFilterIsActive: boolean = true;
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
  UsersList: UserDropDownModel[];
  selectedUser: string;
  selectedUserfilter: boolean;
  FieldsList: EmployeeLogtimeReportFieldsModel[];
  showComments: boolean = false;
  direction: any;
  weekDate: Date = new Date();
  weekNumber: number;
  date: Date = new Date();
  selectedWeek: string = this.date.toISOString();
  pageable: boolean = false;
  softLabels: SoftLabelConfigurationModel[];


  state: State = {
    skip: 0,
    take: 20,
  };

  constructor(private profileService: MyProfileService, private router: Router,
    private cdRef: ChangeDetectorRef, private store: Store<State>,
    private toaster: ToastrService, private datePipe: DatePipe,
    private dashboardService: DashboardService, public dialog: MatDialog,
    private translateService: TranslateService
  ) {
  }

  ngOnInit() {
    this.getUsers();
    this.loadProjectsList();
    this.getWeekBasedOnDate(null);
    this.getBoardTypes();
    this.getSoftLabelConfigurations();
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
  }

  getWeekBasedOnDate(direction) {
    this.direction = direction;
    if (direction === 'right') {
      const day = this.weekDate.getDate() + 7;
      const month = 0 + (this.weekDate.getMonth() + 1);
      const year = this.weekDate.getFullYear();
      const newDate = day + '/' + month + '/' + year;
      this.weekDate = this.parse(newDate);
    } else if (direction === 'left') {
      const day = this.weekDate.getDate() - 7;
      const month = 0 + (this.weekDate.getMonth() + 1);
      const year = this.weekDate.getFullYear();
      const newDate = day + '/' + month + '/' + year;
      this.weekDate = this.parse(newDate);
    }

    this.weekNumber = this.getWeekNumber(this.weekDate);

    var d1 = new Date(this.weekDate);
    var day = d1.getDay(),
      diff = d1.getDate() - day + (day == 0 ? -6 : 1);
    this.fromDate = new Date(d1.setDate(diff));
    console.log(new Date(d1.setDate(diff)));

    var d2 = new Date(this.weekDate);
    var day1 = this.weekDate.getDay(),
      diff = d2.getDate() - day1;
    this.toDate = new Date(d2.setDate(diff + 6));
    console.log(new Date(d2.setDate(diff + 6)));

    this.getEmployeeLogTimeDetailsReport()
  }

  getWeekNumber(selectedWeek) {
    const currentDate = selectedWeek.getDate();
    const monthStartDay = (new Date(this.weekDate.getFullYear(), this.weekDate.getMonth(), 1)).getDay();
    const weekNumber = (selectedWeek.getDate() + monthStartDay) / 7;
    const week = (selectedWeek.getDate() + monthStartDay) % 7;
    this.selectedWeek = selectedWeek.toISOString();
    if (week !== 0) {
      return Math.ceil(weekNumber);
    } else {
      return weekNumber;
    }
  }


  getcolumsdata(fromDate, toDate) {

    this.FieldsList = [];
    var model = new EmployeeLogtimeReportFieldsModel();
    var dt = new Date(fromDate);

    model.fieldname = "userStoryName";
    model.title = "HISTORICALREPORT.USERSTORY";
    this.FieldsList.push(model)

    model = new EmployeeLogtimeReportFieldsModel();
    model.fieldname = "projectName";
    model.title = "WORKLOGGING.PROJECT";
    this.FieldsList.push(model)

    model = new EmployeeLogtimeReportFieldsModel();
    model.fieldname = "goalName";
    model.title = "HISTORICALREPORT.GOALNAME";
    this.FieldsList.push(model)

    model = new EmployeeLogtimeReportFieldsModel();
    model.fieldname = "boardTypeName";
    model.title = "HISTORICALREPORT.BOARDTYPENAME";
    this.FieldsList.push(model)

    model = new EmployeeLogtimeReportFieldsModel();
    model.fieldname = "isProductive";
    model.title = "HISTORICALREPORT.ISPRODUCTIVE";
    this.FieldsList.push(model)

    model = new EmployeeLogtimeReportFieldsModel();
    model.fieldname = "estimatedTime";
    model.title = "HISTORICALREPORT.ESTIMATEDTIME";
    this.FieldsList.push(model)

    model = new EmployeeLogtimeReportFieldsModel();
    model.fieldname = "sprintName";
    model.title = "SPRINTS.SPRINTS";
    this.FieldsList.push(model);

    while (dt <= toDate) {

      model = new EmployeeLogtimeReportFieldsModel();

      model.fieldname = this.datePipe.transform(dt, 'yyyy-MM-dd');
      model.title = this.datePipe.transform(dt, 'yyyy-MM-dd');
      this.FieldsList.push(model);
      dt.setDate(dt.getDate() + 1);
    }
  }


  getBoardTypes() {
    this.store.dispatch(new LoadBoardTypesTriggered());
    this.boardTypes$ = this.store.pipe(select(projectReducer.getBoardTypesAll));
  }

  getEmployeeLogTimeDetailsReport() {
    this.getcolumsdata(this.fromDate, this.toDate);
    this.isAnyOperationIsInprogress = true;
    var historicalWorkReportModel = new HistoricalWorkReportModel();
    historicalWorkReportModel.userId = this.selectedUserId;
    historicalWorkReportModel.dateFrom = this.fromDate;
    historicalWorkReportModel.dateTo = this.toDate;
    historicalWorkReportModel.projectId = this.projectId ? this.projectId : (this.dashboardFilters ? this.dashboardFilters.projectId : '');
    historicalWorkReportModel.boardTypeId = this.boardTypeId;
    historicalWorkReportModel.Showcomments = this.showComments;
    historicalWorkReportModel.sortBy = this.sortBy;
    historicalWorkReportModel.sortDirectionAsc = this.sortDirection;
    historicalWorkReportModel.pageNumber = (this.state.skip / this.state.take) + 1;
    historicalWorkReportModel.pageSize = this.state.take;
    this.profileService.getEmployeeLogTimeDetailsReport(historicalWorkReportModel).subscribe((response: any) => {
      if (response.success == true) {
        this.employeeLogTimeDetails = response.data;
        let totalCount = response.data.length > 0 ? response.data[0].totalCount : 0;
        if (totalCount > this.state.take) {
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
    this.fromDate = new Date();
    this.toDate = new Date();
    this.selectedUserId = null;
    this.projectId = null;
    this.teamLeadId = null;
    this.boardTypeId = null;
    this.selectedUser = null;
    this.weekDate = new Date();
    this.showComments = false;
    this.getWeekBasedOnDate(null);
  }


  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    if (this.state.sort[0]) {
      this.sortBy = this.state.sort[0].field;
      this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
    }
    this.getEmployeeLogTimeDetailsReport();
  }

  selectedProjectId(selectedProjectId) {
    if (selectedProjectId === '0') {
      this.selectedProjectfilter = false;
      this.projectId = "";
    }
    this.selectedProjectfilter = true;
    this.projectId = selectedProjectId;
    this.getEmployeeLogTimeDetailsReport();
  }

  selectedBoardTypeId(boardTypeId) {
    if (boardTypeId === '0') {
      this.selectBoardTypefilter = false;
      this.boardTypeId = "";
    }
    this.selectBoardTypefilter = true;
    this.boardTypeId = boardTypeId;
    this.getEmployeeLogTimeDetailsReport();
  }

  selectUser(selecteduserId) {
    if (selecteduserId === '0') {
      this.selectedUserfilter = false;
      this.selectedUser = "";
    }
    this.selectedUserfilter = true;
    this.selectedUser = selecteduserId;
    this.selectedUserId = selecteduserId;
    this.getEmployeeLogTimeDetailsReport();
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


  navigateToUserStoriesPage(event) {
    if (event.projectInactiveDateTime) {
      this.toaster.error(this.translateService.instant("HISTORICALREPORT.ARCHIVEDPROJECT"));
    }
    else if (event.goalInactiveDateTime || event.goalParkedDateTime) {
      if (event.goalInactiveDateTime) {
        this.toaster.error(this.translateService.instant("HISTORICALREPORT.ARCHIVEDGOAL"));
      }
      else if (event.goalParkedDateTime) {
        this.toaster.error(this.translateService.instant("HISTORICALREPORT.PARKEDGOAL"));
      }
    }
    else if (event.sprintInactiveDateTime) {
      this.toaster.error(this.translateService.instant("HISTORICALREPORT.SPRINTARCHIVED"));
    }
    else if (event.inactiveDateTime == null && event.parkedDateTime == null) {
      if (event) {
        if (event) {
          // if (event.sprintId) {
          //   this.closePopUp.emit(true);
          //   event.isSprintUserStory = true;
          //   this.router.navigate([
          //     "projects/sprint-workitem",
          //     event.userStoryId
          //   ]);
          // } else {
          //   this.closePopUp.emit(true);
          //   this.router.navigate([
          //     "projects/workitem",
          //     event.userStoryId
          //   ]);
          // }

          let dialogId = "unique-userstory-dialog-employee-log";
          const dialogRef = this.dialog.open(this.uniqueUserstoryDialog, {
            height: "90vh",
            width: "70%",
            direction: 'ltr',
            id: dialogId,
            data: { userStory: { isSprintUserStory: event.sprintId ? true : false, userStoryId: event.userStoryId }, notFromAudits: true, dialogId: dialogId, isFromSprint: event.sprintId ? true : false },
            disableClose: true,
            panelClass: 'userstory-dialog-scroll'
          });
          dialogRef.afterClosed().subscribe((result: any) => {
            if (result.redirection) {
              this.closePopUp.emit(true);
            }
            if (result.success == 'yes') {
              this.getEmployeeLogTimeDetailsReport();
            }
          });
          // const dialogRef = this.dialog.open(UniqueUserstorysDialogComponent, {
          //   height: "85%",
          //   width: "85%",
          //   direction: "ltr",
          //   data: { userStory: event, isFromSprints: null },
          //   disableClose: true,
          //   panelClass: "userstory-dialog-scroll"
          // });
        }
      }
      else if (event.inactiveDateTime) {
        this.toaster.error(this.translateService.instant(ConstantVariables.ThisUserStoryIsArchived));
      }
      else if (event.parkedDateTime) {
        this.toaster.error(this.translateService.instant(ConstantVariables.ThisUserStoryIsParked));
      }
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
    else if (goal.goalParkedDateTime) {
      this.toaster.error(this.translateService.instant("HISTORICALREPORT.PARKEDGOAL"));
    }
    else if (goal.goalInactiveDateTime) {
      this.toaster.error(this.translateService.instant("HISTORICALREPORT.ARCHIVEDGOAL"));
    }
  }

  navigateToProjectDetailsPage(project) {
    if (project.projectInactiveDateTime == null) {
      this.closePopUp.emit(true);
      this.router.navigate([
        "projects/projectstatus/" + project.projectId + "/active-goals"
      ]);
    }
    else if (project.projectInactiveDateTime) {
      this.toaster.error(this.translateService.instant("HISTORICALREPORT.ARCHIVEDPROJECT"));
    }
  }

  navigateToSprintDetailsPage(sprint) {
    this.closePopUp.emit(true);
    this.router.navigate([
      "projects/sprint",
      sprint.sprintId
    ]);
  }

  navigateToUserProfile(userid) {
    this.closePopUp.emit(true);
    this.router.navigate(["dashboard/profile", userid, "overview"]);
  }
}