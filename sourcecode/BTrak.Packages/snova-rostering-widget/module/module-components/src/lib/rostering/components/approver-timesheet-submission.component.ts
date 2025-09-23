import { Component, ViewChildren, ChangeDetectorRef, OnInit } from "@angular/core";
import { TimeSheetSubmissionOutputModel } from "../models/timesheet-submission-model";
import { StatusModel } from "../models/status.model";
import { ToastrService } from "ngx-toastr";
import { RosterService } from "../services/roster-service";
import { ApproverTimeSheetSubmission } from "../models/approver-timesheet-input-model";
import { EmployeeTimeSheetUpdateModel } from "../models/employee-timesheet-update-model";
import { MatDialog } from "@angular/material/dialog";
import { ApproverTimeSheetDialogComponent } from "./approver-timesheet-dialogue.component";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { LineManagers } from '../models/timesheet-linamanagers.model';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { State } from '@progress/kendo-data-query';

@Component({
    selector: 'app-component-approver-timesheet-submission',
    templateUrl: `approver-timesheet-submission.component.html`
})

export class ApproverTimeSheetSubmissionComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("editReasonPopUp") rejectedPopOver;
    @ViewChildren("approvePopUp") approvePopOver;
    @ViewChildren("rejectedReasonPopUp") rejecteMessagePopOver;

    validationMessage: string;
    status: StatusModel[]
    timeSheetSubmissions: TimeSheetSubmissionOutputModel[];
    loadingIndicator: boolean = false;
    updateValue: any;
    approveId: string;
    rejectedId: string;
    reason: string = null;
    rowData: any;
    searchText: string;
    temp: any;
    selectedUser : any;
    selectedUserName : any;
    isOpen: boolean = true;
    userDropdown: LineManagers[];
    approverData: string;
    isAnyOperationIsInprogress : boolean;
    state: State = {
        skip: 0,
        take: 20,
      };
    constructor(private toaster: ToastrService, private dialog: MatDialog,
        private roasterService: RosterService, private cdRef: ChangeDetectorRef , private translateService: TranslateService, private router: Router) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getStatus();
        this.getTimeSheetSubmission();
        this.getApproverUsers();
    }

    getApproverUsers() {
        this.roasterService.getApproverUsers().subscribe((result: any) => {
          this.userDropdown = result.data
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
                this.approveId = this.status.find((p) => p.statusName.toLowerCase() === "approved").statusId;
                this.rejectedId = this.status.find((p) => p.statusName.toLowerCase() === "rejected").statusId;

            }
            if (result.success == false) {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
        })
    }
    getTimeSheetSubmission() {
        this.loadingIndicator = true;
        let approverTimeSheetSubmission = new ApproverTimeSheetSubmission;
        approverTimeSheetSubmission.userId = this.selectedUser;
        this.roasterService.getApproverTimeSheets(approverTimeSheetSubmission).subscribe((result: any) => {
            this.timeSheetSubmissions = result.data
            this.temp = result.data;
            this.cdRef.detectChanges();
            if (result.success == false) {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
        })
        this.loadingIndicator = false;
        this.cdRef.detectChanges();
    }
    reset() {
        this.selectedUser = "";
        this.searchText = "";
        this.getStatus();
        this.getTimeSheetSubmission();
    }

    updateApproveTimeSheet(row) {
        let employeeTimeSheetUpdateModel = new EmployeeTimeSheetUpdateModel();
        employeeTimeSheetUpdateModel.fromDate = row.date[row.date.length - 1].date;
        employeeTimeSheetUpdateModel.toDate = row.date[0].date;
        employeeTimeSheetUpdateModel.statusId = this.approveId;
        employeeTimeSheetUpdateModel.isRejected = false;
        employeeTimeSheetUpdateModel.timesheetTitle = row.timeSheetTitle;

        employeeTimeSheetUpdateModel.userId = row.userId;
        this.roasterService.updateTimeSheetPunchCard(employeeTimeSheetUpdateModel).subscribe((result: any) => {
            this.updateValue = result.data
            this.toaster.success("Time sheet approved");
            this.getTimeSheetSubmission();
            this.closeApproverPopUp();
        })
    }

    openDialog(event, row) {
        const dialogRef = this.dialog.open(ApproverTimeSheetDialogComponent, {
            height: "70%",
            width: "70%",
            direction: 'ltr',
            data: { date: row },
            disableClose: true,
            panelClass: 'userstory-dialog-scroll'
        });
        dialogRef.afterClosed().subscribe(() => {
            this.getTimeSheetSubmission();
        });
    }

    editReason(row, editReasonPopUp) {
        editReasonPopUp.openPopover();
        this.rowData = row;
    }

    openPopup(data,approvePopUp){
        approvePopUp.openPopover();
        this.approverData = data;
    }

    openRejctedPopup(rejectedReasonPopUp) {
        if(!this.reason.trim()){
            this.toaster.error("Rejected reason cannot empty");
        }
        else
            rejectedReasonPopUp.openPopover();
    }

    closeApproverPopUp(){
        this.approvePopOver.forEach((p) => p.closePopover());
        this.approverData = null;
    }

    closerejectedMessgaePopUp(){
        this.rejecteMessagePopOver.forEach((p) => p.closePopover());
        this.approverData = null;
    }

    approveTimeSheet(){
        this.updateApproveTimeSheet(this.approverData);
    }

    rejectTimeSheet(){
        this.saveReason();
    }

    closePopup() {
        this.rejectedPopOver.forEach((p) => p.closePopover());
        this.reason = null;
    }

    saveReason() {
        let employeeTimeSheetUpdateModel = new EmployeeTimeSheetUpdateModel();
        employeeTimeSheetUpdateModel.rejectedReason = this.reason;
        employeeTimeSheetUpdateModel.fromDate = this.rowData.date[this.rowData.date.length - 1].date;
        employeeTimeSheetUpdateModel.toDate = this.rowData.date[0].date;
        employeeTimeSheetUpdateModel.statusId = this.rejectedId;
        employeeTimeSheetUpdateModel.isRejected = true;
        employeeTimeSheetUpdateModel.timesheetTitle = this.rowData.timeSheetTitle;

        employeeTimeSheetUpdateModel.userId = this.rowData.userId;
        this.roasterService.updateTimeSheetPunchCard(employeeTimeSheetUpdateModel).subscribe((result: any) => {
            this.updateValue = result.data;
            this.rejectedPopOver.forEach((p) => p.closePopover());
            this.toaster.success("Time sheet rejected");
            this.reason = null;
            this.getTimeSheetSubmission();
            this.closerejectedMessgaePopUp();
        })
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
            || (timeSheet.userName.toLowerCase().indexOf(this.searchText) > -1)));
        this.timeSheetSubmissions = temp;
    }

    closeSearch() {
        this.searchText = "";
        const temp = this.temp.filter((timeSheet => (timeSheet.timeSheetTitle.toLowerCase().indexOf(this.searchText) > -1)
            || (timeSheet.userName.toLowerCase().indexOf(this.searchText) > -1)));
        this.timeSheetSubmissions = temp;
    }

    filterClick() {
        this.isOpen = !this.isOpen;
    }

    statusValues(name) {
        this.selectedUser = name;
        this.getTimeSheetSubmission();
    }

    goToUserProfile(event) {
        this.router.navigate(["dashboard/profile", event, "overview"]);
    }
}