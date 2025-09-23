import { Component, ChangeDetectorRef, Output, EventEmitter, Input, ViewChild, TemplateRef } from "@angular/core";
import { MyProfileService } from "../services/myProfile.service";
import { HistoricalWorkReportModel } from "../models/historicalWorkReport";
import { Router } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { ToastrService } from "ngx-toastr";
import { HrDashboardService } from "../services/hr-dashboard.service";
import { Subject } from "rxjs";
import { EmployeeLogtimeReportFieldsModel } from "../models/employeelogtimereportfieldsmodel";
import { DatePipe } from "@angular/common";
import { LineManagersModel } from "../models/line-mangaers-model";
import { TranslateService } from "@ngx-translate/core";
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import { UniqueUserstorysDialogComponent } from './user-story-unique-dialog/unique-userstory-dialog.component';

@Component({
  selector: 'app-users-spenttime-details-report',
  templateUrl: 'users-spent-time-details-report.html',
})
export class UsersSpentTimeDetailsReportComponent {
  @Output() closePopUp = new EventEmitter<any>();
  @ViewChild("uniqueUserstoryDialogUser", { static: true }) private uniqueUserstoryDialog: TemplateRef<any>;

  dashboardFilters: any;
  @Input("dashboardFilters")
  set _dashboardFilters(data: any) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }
  softLabels: SoftLabelConfigurationModel[];
  isAnyOperationIsInprogress: boolean = false;
  employeeLogTimeDetails: any;
  gridData: GridDataResult;
  validationMessage: string;
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
  public ngDestroyed$ = new Subject();
  FieldsList: EmployeeLogtimeReportFieldsModel[];
  lineManager: LineManagersModel[];
  direction: any;
  weekDate: Date = new Date();
  weekNumber: number;
  date: Date = new Date();
  selectedWeek: string = this.date.toISOString();
  pageable: boolean = false;
  selecteduserName: string;

  state: State = {
    skip: 0,
    take: 20,
  };

  constructor(
    private profileService: MyProfileService, private router: Router,
    private cdRef: ChangeDetectorRef, private hrdashboardservice: HrDashboardService,
    private toaster: ToastrService, private datePipe: DatePipe,
    public dialog: MatDialog, private translateService: TranslateService
  ) {
  }

  ngOnInit() {
    this.getSoftLabels();
    this.getLineManagers();
    this.getWeekBasedOnDate(null);
  }
  getSoftLabels() {
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

    var d2 = new Date(this.weekDate);
    var day1 = this.weekDate.getDay(),
      diff = d2.getDate() - day1;
    this.toDate = new Date(d2.setDate(diff + 6));

    this.getUsersSpentTimeDetailsReport()
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


  getcolumsdata(fromDate, toDate) {

    this.FieldsList = [];
    var model = new EmployeeLogtimeReportFieldsModel();
    var dt = new Date(fromDate);

    model.fieldname = "developer";
    model.title = "EMPLOYEE";
    this.FieldsList.push(model)

    while (dt <= toDate) {

      model = new EmployeeLogtimeReportFieldsModel();

      model.fieldname = this.datePipe.transform(dt, 'yyyy-MM-dd');
      model.title = this.datePipe.transform(dt, 'yyyy-MM-dd');
      this.FieldsList.push(model);
      dt.setDate(dt.getDate() + 1);
    }
  }
  getWeekNumber(selectedWeek) {
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

  getUsersSpentTimeDetailsReport() {
    this.getcolumsdata(this.fromDate, this.toDate);
    this.isAnyOperationIsInprogress = true;
    var historicalWorkReportModel = new HistoricalWorkReportModel();
    historicalWorkReportModel.dateFrom = this.fromDate;
    historicalWorkReportModel.dateTo = this.toDate;
    historicalWorkReportModel.sortBy = this.sortBy;
    historicalWorkReportModel.lineManagerId = this.teamLeadId;
    historicalWorkReportModel.sortDirectionAsc = this.sortDirection;
    historicalWorkReportModel.pageNumber = (this.state.skip / this.state.take) + 1;
    historicalWorkReportModel.pageSize = this.state.take;
    historicalWorkReportModel.projectId = this.dashboardFilters ? this.dashboardFilters.projectId : '';
    this.profileService.getUsersSpentTimeDetailsReport(historicalWorkReportModel).subscribe((response: any) => {
      if (response.success == true) {

        //this.gridData = response.data;

        this.employeeLogTimeDetails = response.data;
        this.gridData = process(this.employeeLogTimeDetails, this.state);

        let totalCount = response.data.length > 0 ? response.data.length : 0
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
    this.weekDate = new Date();
    this.getWeekBasedOnDate(null);
    this.selecteduserName = null;
  }

  selectedLineManagerId(selectedLineManagerId, event) {
    if (selectedLineManagerId === '0') {
      this.selectLineManagerfilter = false;
      this.teamLeadId = "";
    }
    this.selectLineManagerfilter = true;
    this.teamLeadId = selectedLineManagerId;
    const index = this.lineManager.findIndex((p) => p.userId.toString().toLowerCase() == selectedLineManagerId.toString().toLowerCase());
            if (index > -1) {
                this.selecteduserName = this.lineManager[index].userName;
            } else {
                this.selecteduserName = event.source.selected._element.nativeElement.innerText.trim();
            }
    this.getUsersSpentTimeDetailsReport();
  }

  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    if (this.state.sort[0]) {
      this.sortBy = this.state.sort[0].field;
      this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
    }
    this.getUsersSpentTimeDetailsReport();
  }

  navigateToUserProfile(userid) {
    this.closePopUp.emit(true);
    this.router.navigate(["dashboard/profile", userid, "overview"]);
  }

  getlist(string) {
    var array = string.split(',')
    return array
  }

  getDataValueString(str) {
    var array = str.split(':&')
    return array[0];
  }

  navigateToUserStoriesPage(str) {
    var array = str.split(':&')
    let sprintUserStory;
    if (array[5] == '1') {
      this.toaster.error(this.translateService.instant("HISTORICALREPORT.SPRINTARCHIVED"));
    }
    else if (array[6] == '1') {
      this.toaster.error(this.translateService.instant("HISTORICALREPORT.ARCHIVEDPROJECT"));
    }
    else if (array[7] == '1') {
      this.toaster.error(this.translateService.instant("HISTORICALREPORT.ARCHIVEDGOAL"));
    }
    else if (array[8] == '1') {
      this.toaster.error(this.translateService.instant("HISTORICALREPORT.PARKEDGOAL"));
    }
    else if (array[2] == "0" && array[3] == "0") {
      if (array[4] == "1") {
        sprintUserStory = true
      }
      let userStory = { userStoryId: array[1], isSprintUserStory: sprintUserStory }
      if (userStory) {
        //this.closePopUp.emit(true);
        // this.router.navigate([
        //   "projects/workitem",
        //   userStory.userStoryId
        // ]);
        let dialogId = "unique-userstory-dialog-user-spent";
        const dialogRef = this.dialog.open(this.uniqueUserstoryDialog, {
          height: "90vh",
          width: "70%",
          direction: 'ltr',
          id: dialogId,
          data: { userStory: { isSprintUserStory: userStory.isSprintUserStory, userStoryId: userStory.userStoryId }, notFromAudits: true, dialogId: dialogId, isFromSprint: userStory.isSprintUserStory },
          disableClose: true,
          panelClass: 'userstory-dialog-scroll'
        });
        dialogRef.afterClosed().subscribe((result: any) => {
          if (result.redirection) {
            this.closePopUp.emit(true);
          }
          if (result.success == 'yes') {
            this.getUsersSpentTimeDetailsReport();
          }
        });
      }
    }
    else if (array[2] == "1") {
      this.toaster.error(this.translateService.instant(ConstantVariables.ThisUserStoryIsArchived));
    }
    else if (array[3] == "1") {
      this.toaster.error(this.translateService.instant(ConstantVariables.ThisUserStoryIsParked));
    }
  }
}