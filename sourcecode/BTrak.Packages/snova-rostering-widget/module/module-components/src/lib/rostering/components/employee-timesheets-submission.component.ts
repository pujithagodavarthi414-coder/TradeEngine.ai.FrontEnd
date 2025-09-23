import { Component, OnInit, AfterViewInit, ViewChildren, ChangeDetectorRef, Input } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { StatusModel } from "../models/status.model";
import { RosterService } from "../services/roster-service";
import { TimeSheetSubmissionInputModel } from "../models/TimeSheet-Submission-Input-Model";
import { TimeSheetSubmissionOutputModel } from "../models/timesheet-submission-model";
import { UserModel } from "../models/user";
import { EmployeeTimeSheetDialogComponent } from "./employee-timesheet-dialog.component";
import { EmployeeTimeSheetUpdateModel } from "../models/employee-timesheet-update-model";
import { MatDialog } from "@angular/material/dialog";
import { DashboardFilterModel } from "../Models/dashboardFilterModel";
import { LineManagers } from "../models/timesheet-linamanagers.model";
import { State } from "@progress/kendo-data-query";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';

@Component({
  selector: 'app-component-timesheet-submission',
  templateUrl: `employee-timesheet-submission.component.html`
})
export class EmployeeTimeSheetSubmissionComponent extends CustomAppBaseComponent implements OnInit {
  @ViewChildren("lineManagersPopUp") lineManagersPopover;
  @ViewChildren("editReasonPopUp") rejectedPopOver;
  @ViewChildren("rejectedReasonPopUp") submitPopOver;


  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  lineManager: LineManagers[];
  validationMessage: string;
  status: StatusModel[]
  timeSheetSubmissions: TimeSheetSubmissionOutputModel[];
  scrollbarH: boolean;
  page: any = {};
  loadingIndicator = false;
  timeSheetSubmissionList: any[]
  selectedUserId: string;
  userdetails: UserModel;
  upsertValue: any;
  updateValue: any;
  draft: string;
  approvalStatus: string;
  approverId: string;
  rowData: any;
  reason: string;
  isOpen: boolean = true;
  selectedStatus: string;
  state: State = {
    skip: 0,
    take: 20,
  };
  searchText: string;
  temp: any;


  constructor(private toaster: ToastrService, private dialog: MatDialog,
    private roasterService: RosterService, private translateService: TranslateService, private router: Router, private cdRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getStatus();
    this.getLineManagers();
    this.getTimeSheetSubmission();
  }

  getLineManagers() {
    this.roasterService.getTimeSheetLineManager().subscribe((result: any) => {
      this.lineManager = result.data
      if (result.success == false) {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
    })
  }

  getStatus() {
    this.roasterService.getStatus().subscribe((result: any) => {
      this.status = result.data
      if (this.status != null) {
        this.draft = this.status.find((p) => p.statusName.toLowerCase() === "draft").statusId;
        this.approvalStatus = this.status.find((p) => p.statusName.toLowerCase() === "waiting for approval").statusId;
      }
      if (result.success == false) {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
    })
  }

  submitTimesheet(approverId) {
    this.approverId = approverId;
    let timesheetUpdateModel = new EmployeeTimeSheetUpdateModel();
    timesheetUpdateModel.fromDate = this.rowData.date[this.rowData.date.length - 1].date;
    timesheetUpdateModel.toDate = this.rowData.date[0].date;
    timesheetUpdateModel.approverId = this.approverId;
    timesheetUpdateModel.statusId = this.approvalStatus;
    timesheetUpdateModel.timesheetTitle = this.rowData.timeSheetTitle;
    timesheetUpdateModel.isRejected = false;
    this.roasterService.updateTimeSheetPunchCard(timesheetUpdateModel).subscribe((result: any) => {
      this.updateValue = result.data
      this.toaster.success("Time sheet submitted");
      this.getTimeSheetSubmission();
      this.closerejectedMessgaePopUp();
    })

    this.lineManagersPopover.forEach((p) => p.closePopover());
  }

  closePopup() {
    this.lineManagersPopover.forEach((p) => p.closePopover());
  }

  updateTimeSheetSubmission(lineManagersPopUp, row) {
    lineManagersPopUp.openPopover();
    this.rowData = row;
    this.cdRef.detectChanges();
  }

  getTimeSheetSubmission() {
    this.loadingIndicator = true;
    let timeSheetSubmissionInputModel = new TimeSheetSubmissionInputModel();
    timeSheetSubmissionInputModel.statusId = this.selectedStatus;
    timeSheetSubmissionInputModel.isIncludedPastData = true;
    this.roasterService.getTimeSheetSubmission(timeSheetSubmissionInputModel).subscribe((result: any) => {
      this.timeSheetSubmissions = result.data
      this.temp = result.data;
      if (result.success == false) {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
      this.scrollbarH = true;
      this.loadingIndicator = false;
      this.cdRef.detectChanges();
    })
  }

  getTimeSheetSubmissionDeatils() {
    let userid: string;
    let date: string;
    this.roasterService.getTimeSheetPunchCardDeatils(userid, date).subscribe((result: any) => {
      this.timeSheetSubmissions = result.data
      if (result.success == false) {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
    })
  }

  reset() {
    this.selectedStatus = null;
    this.getStatus();
    this.getLineManagers();
    this.getTimeSheetSubmission();
  }

  editReason(row, editReasonPopUp) {
    editReasonPopUp.openPopover();
    this.rowData = row;
    this.reason = row.rejectedReason;
  }

  closeReasonPopup() {
    this.rejectedPopOver.forEach((p) => p.closePopover());
    this.reason = null;
  }

  openDialog(event, row) {
    const dialogRef = this.dialog.open(EmployeeTimeSheetDialogComponent, {
      height: "70%",
      width: "70%",
      direction: 'ltr',
      data: { date: row },
      disableClose: true,
      panelClass: 'userstory-dialog-scroll'
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.success == true) {
        this.getTimeSheetSubmission();
      }
    });
  }

  closeLineManagerPopup() {
    this.lineManagersPopover.forEach((p) => p.closePopover());
  }
  statusValues(name) {
    if (name) {
      const temp = this.temp.filter((x => (x.status.toLowerCase().indexOf(name.statusName.toLowerCase()) > -1)
      ));
      this.timeSheetSubmissions = temp;
    }
    this.selectedStatus = name;
  }

  filterClick() {
    this.isOpen = !this.isOpen;
  }

  filterByName(event) {
    if (event != null) {
      this.searchText = event.target.value.toLowerCase();
      this.searchText = this.searchText.trim();
    }
    else {
      this.searchText = "";
    }
    const temp = this.temp.filter((timeSheet => (timeSheet.timeSheetTitle.toLowerCase().indexOf(this.searchText) > -1)
      || (timeSheet.status.toLowerCase().indexOf(this.searchText) > -1)));
    this.timeSheetSubmissions = temp;
  }

  goToUserProfile(event) {
    if (!event.isActive) {
      this.toaster.error(this.translateService.instant("PAYROLLREPORTS.EMPLOYEEISINACTIVE"));
    }
    else {
      this.router.navigate(["dashboard/profile", event.userId, "overview"]);
    }
  }

  closeSearch() {
    this.searchText = "";
    const temp = this.temp.filter((timeSheet => (timeSheet.timeSheetTitle.toLowerCase().indexOf(this.searchText) > -1)
      || (timeSheet.userName.toLowerCase().indexOf(this.searchText) > -1)));
    this.timeSheetSubmissions = temp;
  }

  openSubmitPopup(lineManager, rejectedReasonPopUp) {
    this.approverId = lineManager.userId;
    rejectedReasonPopUp.openPopover();
  }

  rejectTimeSheet() {
    this.submitTimesheet(this.approverId);
  }

  closerejectedMessgaePopUp() {
    this.submitPopOver.forEach((p) => p.closePopover());
    this.approverId = null;
  }
}
