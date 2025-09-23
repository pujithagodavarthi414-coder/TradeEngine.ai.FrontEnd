import { Component, Inject, ViewChildren } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ConstantVariables } from "../models/constant-variables";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { EmployeeTimesheetUpsertModel } from "../models/employee-timsheet-upsert-model";
import { ToastrService } from "ngx-toastr";
import { RosterService } from "../services/roster-service";
import { ApproverTimeSheetSubmission } from "../models/approver-timesheet-input-model";
import { TimeSheetSubmissionOutputModel } from "../models/timesheet-submission-model";
import { EmployeeTimeSheetUpdateModel } from "../models/employee-timesheet-update-model";
import { StatusModel } from "../models/status.model";
import * as moment_ from "moment";
const moment = moment_;

@Component({
    selector: 'app-component-approver-timesheet-dialog',
    templateUrl: 'approver-timesheet-dialogue.component.html'
})
export class ApproverTimeSheetDialogComponent {
    @ViewChildren("editTimesheetPopUp") editTimeSheetPopover;
    @ViewChildren("editReasonPopUp") rejectedPopOver;
    @ViewChildren("approvePopUp") approvePopOver;
    @ViewChildren("rejectedReasonPopUp") rejecteMessagePopOver;


    datesData: any = null;
    startTimePicker: any;
    validationMessage: string;
    endTimePicker: any;
    upsertInProgress: boolean = false;
    timesheetForm: FormGroup;
    upsertValue: string;
    timeSheetSubmissions: TimeSheetSubmissionOutputModel[];
    timeSheetPunchCardDetails: EmployeeTimesheetUpsertModel;
    selectedDate = new Date();
    date: string;
    timeSheetSubmissionId: string;
    dateTo: string;
    dateFrom: string;
    timeSheetTitle: string;
    reason: string = null;
    rowData: any;
    status: StatusModel[];
    approveId: string;
    rejectedId: string;
    updateValue: any;
    userId: any;
    loadingIndicator: boolean = false;
    isOnLeavecheck: boolean;
    approverData: string;
    isAnyOperationIsInprogress: boolean;


    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private toaster: ToastrService, private roasterService: RosterService, public dialogRef: MatDialogRef<ApproverTimeSheetDialogComponent>, private datePipe: DatePipe) {
        this.timeSheetTitle = data.date.timeSheetTitle;
        this.datesData = data.date.date;
        this.userId = data.date.userId;
        console.log(this.datesData);
    }

    ngOnInit() {
        this.clearForm();
        this.getStatus();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    startTimeshow() {
        if (!this.startTimePicker) {
            this.startTimePicker = ConstantVariables.DefaultTime;
            this.isOnLeavecheck = false;
        }
    }
    closeStartTime() {
        this.startTimePicker = this.startTimePicker == null ? "" : this.startTimePicker;
    }

    endTimeshow() {
        if (!this.endTimePicker) {
            this.endTimePicker = ConstantVariables.DefaultTime;
            this.isOnLeavecheck = false;
        }
    }
    closeEndTime() {
        this.endTimePicker = this.endTimePicker == null ? "" : this.endTimePicker;
    }

    clearStartTime() {
        this.startTimePicker = null;
    }
    
    clearEndTime() {
        this.endTimePicker = null;
    }

    editTimeSheet(row, editTimesheetPopUp) {
        this.date = row.date;
        this.startTimePicker = null;
        this.endTimePicker = null;
        if (row.inTime != null) {
            this.startTimePicker = null;
            this.startTimePicker = this.datePipe.transform(this.utcToLocal(row.inTime), 'HH:mm');
            this.timesheetForm.get("inTime").patchValue(this.startTimePicker);
        }
        
        if (row.outTime != null) {
            this.endTimePicker = null;
            this.endTimePicker = this.datePipe.transform(this.utcToLocal(row.outTime), 'HH:mm');
            this.timesheetForm.get("outTime").patchValue(this.endTimePicker);
        }
        this.timesheetForm.get("breakmins").patchValue(row.breakmins);
        this.timesheetForm.get("summary").patchValue(row.summary);
        this.getTimeSheetSubmissionDeatils(row.date, row.userId);
        this.isOnLeavecheck = row.isOnLeave;
        this.timeSheetSubmissionId = row.timeSheetSubmissionId;
        editTimesheetPopUp.openPopover();
    }

    utcToLocal(date) {
        const localDate = moment.utc(date).local().format();
        return localDate;
    }

    closePopup() {
        this.editTimeSheetPopover.forEach((p) => p.closePopover());
    }

    clearForm() {
        this.timesheetForm = new FormGroup({
            inTime: new FormControl("",
                Validators.compose([
                ])
            ),
            outTime: new FormControl("",
                Validators.compose([
                ])
            ),
            breakmins: new FormControl(null,
                Validators.compose([
                ])
            ),
            summary: new FormControl(null,
                Validators.compose([
                ])
            ),
            onLeave: new FormControl(this.isOnLeavecheck,
                Validators.compose([
                ])
            ),
        })
    }

    upsertTimeSheetSubmission() {
        let timesheetUpsertModel = new EmployeeTimesheetUpsertModel();
        timesheetUpsertModel = this.timesheetForm.value;
        timesheetUpsertModel.date = this.date
        timesheetUpsertModel.approverId = this.timeSheetPunchCardDetails.approverId;
        timesheetUpsertModel.statusId = this.timeSheetPunchCardDetails.statusId;
        timesheetUpsertModel.timeSheetPunchCardId = this.timeSheetPunchCardDetails.timeSheetPunchCardId;
        timesheetUpsertModel.timeStamp = this.timeSheetPunchCardDetails.timeStamp;
        timesheetUpsertModel.timeSheetSubmissionId = this.timeSheetSubmissionId;
        timesheetUpsertModel.isOnLeave = this.isOnLeavecheck;
        timesheetUpsertModel.breakmins = this.isOnLeavecheck == true ? null : this.timesheetForm.value.breakmins;
        timesheetUpsertModel.summary = this.isOnLeavecheck == true ? null : this.timesheetForm.value.summary;
        timesheetUpsertModel.startTime = this.isOnLeavecheck == true ? null : this.covertTimeIntoUtcTime(this.timesheetForm.value.inTime);
        timesheetUpsertModel.endTime = this.isOnLeavecheck == true ? null : this.covertTimeIntoUtcTime(this.timesheetForm.value.outTime);
        timesheetUpsertModel.userId = this.timeSheetPunchCardDetails.userId;
        this.roasterService.upsertApproverEditTimeSheet(timesheetUpsertModel).subscribe((result: any) => {
            this.upsertValue = result.data
            if (this.upsertValue != null) {
                this.getApproerTimeSheetSubmission();
                this.clearForm();
                this.closePopup();
            }
            if (result.success == false) {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
        })
    }

    getTimeSheetSubmissionDeatils(date: string, userId: string) {
        this.roasterService.getTimeSheetPunchCardDeatils(date, userId).subscribe((result: any) => {
            this.timeSheetPunchCardDetails = result.data
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
    getApproerTimeSheetSubmission() {
        let approverTimeSheetSubmission = new ApproverTimeSheetSubmission;
        approverTimeSheetSubmission.userId = this.timeSheetPunchCardDetails.userId;
        approverTimeSheetSubmission.dateFrom = this.datesData[this.datesData.length - 1].date;
        approverTimeSheetSubmission.dateTo = this.datesData[0].date;
        this.roasterService.getApproverTimeSheets(approverTimeSheetSubmission).subscribe((result: any) => {
            this.timeSheetSubmissions = result.data
            this.datesData = this.timeSheetSubmissions[0].date;
            if (result.success == false) {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
        })
    }

    covertTimeIntoUtcTime(inputTime): string {
        if (inputTime == null || inputTime == "")
            return null;
        var dateNow = new Date(this.selectedDate);
        var timeSplit = inputTime.toString().split(":");
        dateNow.setHours(+timeSplit[0], +timeSplit[1], null, null);
        return moment.utc(dateNow).format("YYYY-MM-DD HH:mm");
    }

    editReason(editReasonPopUp) {
        editReasonPopUp.openPopover();
        this.rowData = this.datesData;
    }

    closeReasonPopup() {
        this.rejectedPopOver.forEach((p) => p.closePopover());
        this.reason = null;
    }

    saveReason() {
        this.loadingIndicator = true;
        let employeeTimeSheetUpdateModel = new EmployeeTimeSheetUpdateModel();
        employeeTimeSheetUpdateModel.rejectedReason = this.reason;
        employeeTimeSheetUpdateModel.fromDate = this.rowData[this.rowData.length - 1].date;
        employeeTimeSheetUpdateModel.toDate = this.rowData[0].date;
        employeeTimeSheetUpdateModel.statusId = this.rejectedId;
        employeeTimeSheetUpdateModel.isRejected = true;
        employeeTimeSheetUpdateModel.timesheetTitle = this.timeSheetTitle;
        employeeTimeSheetUpdateModel.userId = this.userId;
        this.roasterService.updateTimeSheetPunchCard(employeeTimeSheetUpdateModel).subscribe((result: any) => {
            this.updateValue = result.data;
            this.rejectedPopOver.forEach((p) => p.closePopover());
            this.toaster.success("Time sheet rejected");
            this.reason = null;
            this.onNoClick();
            this.closerejectedMessgaePopUp();
        })
        this.loadingIndicator = false;
    }

    updateApproveTimeSheet() {
        let employeeTimeSheetUpdateModel = new EmployeeTimeSheetUpdateModel();
        employeeTimeSheetUpdateModel.fromDate = this.datesData[this.datesData.length - 1].date;
        employeeTimeSheetUpdateModel.toDate = this.datesData[0].date;
        employeeTimeSheetUpdateModel.statusId = this.approveId;
        employeeTimeSheetUpdateModel.isRejected = false;
        employeeTimeSheetUpdateModel.timesheetTitle =  this.timeSheetTitle;
        employeeTimeSheetUpdateModel.userId = this.userId;
        this.roasterService.updateTimeSheetPunchCard(employeeTimeSheetUpdateModel).subscribe((result: any) => {
            this.updateValue = result.data
            this.toaster.success("Time sheet approved");
            this.onNoClick();
        })
    }
    isOnLeaveChecked(event) {
        this.isOnLeavecheck = event.checked;
        if (this.isOnLeavecheck) {
            this.clearForm();
            this.isOnLeavecheck = event.checked;
        }
    }

    openPopup(approvePopUp) {
        approvePopUp.openPopover();
    }

    openRejctedPopup(rejectedReasonPopUp) {
        if(!this.reason.trim()){
            this.toaster.error("Rejected reason cannot empty");
        }
        else
            rejectedReasonPopUp.openPopover();
    }

    closeApproverPopUp() {
        this.approvePopOver.forEach((p) => p.closePopover());
        this.approverData = null;
    }

    closerejectedMessgaePopUp() {
        this.rejecteMessagePopOver.forEach((p) => p.closePopover());
        this.approverData = null;
    }

    approveTimeSheet() {
        this.updateApproveTimeSheet();
    }

    rejectTimeSheet() {
        this.saveReason();
    }
}

