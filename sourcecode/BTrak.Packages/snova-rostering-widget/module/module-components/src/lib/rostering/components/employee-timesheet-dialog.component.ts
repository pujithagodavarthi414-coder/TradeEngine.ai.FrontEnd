import { Component, Inject, ViewChildren, ChangeDetectorRef } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ConstantVariables } from "../models/constant-variables";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { EmployeeTimesheetUpsertModel } from "../models/employee-timsheet-upsert-model";
import { ToastrService } from "ngx-toastr";
import { RosterService } from "../services/roster-service";
import { TimeSheetSubmissionInputModel } from "../models/TimeSheet-Submission-Input-Model";
import { TimeSheetSubmissionOutputModel } from "../models/timesheet-submission-model";
import { StatusModel } from "../models/status.model";
import { EmployeeTimeSheetUpdateModel } from "../models/employee-timesheet-update-model";
import { EmployeeDetailsSearchModel } from "../models/employee-details-search-model";
import { CookieService } from "ngx-cookie-service";
import { UserModel } from "../models/user";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
import { LineManagers } from "../models/timesheet-linamanagers.model";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import * as moment_ from "moment";
const moment = moment_;

@Component({
    selector: 'app-component-employee-timesheet-dialog',
    templateUrl: 'employee-timesheet-dialog.component.html'
})
export class EmployeeTimeSheetDialogComponent {
    @ViewChildren("editTimesheetPopUp") editTimeSheetPopover;
    @ViewChildren("lineManagersPopUp") lineManagersPopover;
    @ViewChildren("rejectedReasonPopUp") submitPopOver;


    datesData: any = null;
    status: StatusModel[]
    startTimePicker: any;
    validationMessage: string;
    endTimePicker: any;
    upsertInProgress: boolean = false;
    timesheetForm: FormGroup;
    upsertValue: string;
    timeSheetPunchCardDetails: EmployeeTimesheetUpsertModel;
    selectedDate = new Date();
    timeSheetSubmissions: TimeSheetSubmissionOutputModel[];
    date: string;
    timeSheetSubmissionId: string;
    dateTo: string;
    dateFrom: string;
    draft: string;
    timeSheetTitle: string;
    isButtonEnable: any;
    approverId: string;
    waitingApprovalStatus: string;
    approvedStatusId: string;
    updateValue: any;
    // rowData: any;
    userdetails: UserModel;
    lineManager: LineManagers[];
    selectedUserId: string;
    loadingIndicator: boolean = false;
    isOnLeavecheck: boolean;
    isRefresh: boolean = false;
    isAnyOperationIsInprogress: boolean;


    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private toaster: ToastrService, 
        private roasterService: RosterService, public dialogRef: MatDialogRef<EmployeeTimeSheetDialogComponent>,
        private datePipe: DatePipe, private cookieService: CookieService,
        private translateService: TranslateService, private router: Router, 
        private cdRef: ChangeDetectorRef) {
        this.timeSheetTitle = data.date.timeSheetTitle;
        this.datesData = data.date.date;
        this.additionInformatoinValues();
        this.isButtonEnable = data.date.isEnableBuuton;
        console.log(this.datesData);
    }

    ngOnInit() {
        this.clearForm();
        this.getStatus();
        this.getLineManagers();
    }

    submitButtonEnable() {
        if (this.timeSheetPunchCardDetails.statusId == this.approvedStatusId || this.timeSheetPunchCardDetails.statusId == this.waitingApprovalStatus) {
            this.isButtonEnable == false;
        }
    }

    getStatus() {
        this.roasterService.getStatus().subscribe((result: any) => {
            this.status = result.data
            if (this.status != null) {
                this.draft = this.status.find((p) => p.statusName.toLowerCase() === "draft").statusId;
                this.waitingApprovalStatus = this.status.find((p) => p.statusName.toLowerCase() === "waiting for approval").statusId;
                this.approvedStatusId = this.status.find((p) => p.statusName.toLowerCase() === "approved").statusId;
                // this.submitButtonEnable();
            }
            if (result.success == false) {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
        })
    }
    onNoClick(): void {
        this.dialogRef.close({ success: (this.isRefresh == true ? true : false) });
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

    clearStartTime() {
        this.startTimePicker = null;
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
        this.isOnLeavecheck = row.isOnLeave;
        this.timesheetForm.get("breakmins").patchValue(row.breakmins);
        this.timesheetForm.get("summary").patchValue(row.summary);
        this.getTimeSheetSubmissionDeatils(row.date, row.userId);
        this.timeSheetSubmissionId = row.timeSheetSubmissionId;

        this.cdRef.detectChanges();
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
        this.isRefresh = true;
        if (this.timeSheetPunchCardDetails.statusId == this.approvedStatusId || this.timeSheetPunchCardDetails.statusId == this.waitingApprovalStatus) {
            this.toaster.warning("You cannot editing while status is " + this.timeSheetPunchCardDetails.statusName);
        }
        else {
            let timesheetUpsertModel = new EmployeeTimesheetUpsertModel();
            timesheetUpsertModel = this.timesheetForm.value;
            timesheetUpsertModel.date = this.date
            timesheetUpsertModel.approverId = this.timeSheetPunchCardDetails.approverId;
            if (this.timeSheetPunchCardDetails.statusId == null) {
                timesheetUpsertModel.statusId = this.draft;
            }
            else {
                timesheetUpsertModel.statusId = this.timeSheetPunchCardDetails.statusId;
            }
            timesheetUpsertModel.timeSheetPunchCardId = this.timeSheetPunchCardDetails.timeSheetPunchCardId;
            timesheetUpsertModel.timeStamp = this.timeSheetPunchCardDetails.timeStamp;
            timesheetUpsertModel.timeSheetSubmissionId = this.timeSheetSubmissionId;
            timesheetUpsertModel.isOnLeave = this.isOnLeavecheck;
            timesheetUpsertModel.breakmins = this.isOnLeavecheck == true ? null : this.timesheetForm.value.breakmins;
            timesheetUpsertModel.summary = this.isOnLeavecheck == true ? null : this.timesheetForm.value.summary;
            timesheetUpsertModel.startTime = this.isOnLeavecheck == true ? null : this.covertTimeIntoUtcTime(this.timesheetForm.value.inTime);
            timesheetUpsertModel.endTime = this.isOnLeavecheck == true ? null : this.covertTimeIntoUtcTime(this.timesheetForm.value.outTime);
            this.roasterService.upsertTimeSheetPunchCard(timesheetUpsertModel).subscribe((result: any) => {
                this.upsertValue = result.data
                if (this.upsertValue != null) {
                    this.getTimeSheetSubmission();
                    this.clearForm();
                    this.closePopup();
                }
                if (result.success == false) {
                    this.validationMessage = result.apiResponseMessages[0].message;
                    this.toaster.error(this.validationMessage);
                }
            })
        }
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

    getTimeSheetSubmission() {
        let timeSheetSubmissionInputModel = new TimeSheetSubmissionInputModel;
        timeSheetSubmissionInputModel.isIncludedPastData = true;
        timeSheetSubmissionInputModel.dateFrom = this.datesData[this.datesData.length - 1].date;
        timeSheetSubmissionInputModel.dateTo = this.datesData[0].date;
        this.roasterService.getTimeSheetSubmission(timeSheetSubmissionInputModel).subscribe((result: any) => {
            this.timeSheetSubmissions = result.data
            if (this.timeSheetSubmissions != null) {
                this.datesData = this.timeSheetSubmissions[0].date;
                this.isButtonEnable = this.timeSheetSubmissions[0].isEnableBuuton;
                this.additionInformatoinValues();
            }
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

    updateTimeSheetSubmission(lineManagersPopUp) {
        lineManagersPopUp.openPopover();
        // this.rowData = row;
    }

    submitTimesheet(approverId) {
        this.isRefresh = true;
        this.loadingIndicator = true;
        this.approverId = approverId;
        let timesheetUpdateModel = new EmployeeTimeSheetUpdateModel();
        timesheetUpdateModel.fromDate = this.datesData[this.datesData.length - 1].date;
        timesheetUpdateModel.toDate = this.datesData[0].date;
        timesheetUpdateModel.approverId = this.approverId;
        timesheetUpdateModel.statusId = this.waitingApprovalStatus;
        timesheetUpdateModel.timesheetTitle = this.timeSheetTitle;
        timesheetUpdateModel.isRejected = false;
        this.roasterService.updateTimeSheetPunchCard(timesheetUpdateModel).subscribe((result: any) => {
            this.updateValue = result.data
            this.toaster.success("Time sheet submitted");
            this.getTimeSheetSubmission();
            this.onNoClick();
        })

        this.lineManagersPopover.forEach((p) => p.closePopover());
        this.loadingIndicator = false;
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

    

    closeLineManagerPopup() {
        this.lineManagersPopover.forEach((p) => p.closePopover());
    }
    isOnLeaveChecked(event) {
        this.isOnLeavecheck = event.checked;
        if (this.isOnLeavecheck) {
            this.clearForm();
            this.isOnLeavecheck = event.checked;
        }
    }
    additionInformatoinValues(){
        this.datesData.forEach(element => {
            if (element.status == "Approved" || element.status == "Waiting for Approval") {
                element.isButtonEnable = true;
            }
            else {
                element.isButtonEnable = false;
            }
            if (element.additionInformation != null && element.additionInformation != "") {
                if (!element.additionInformation.includes('(')) {
                    var additional = element.additionInformation.toString();
                    var string1;
                    var string2;
                    var string3;
                    var string4;
                    var string5;
                    string1 = additional + '(';
                    string2 = element.additionalIntTime ? this.datePipe.transform(this.utcToLocal(element.additionalIntTime), 'HH:mm').toString() : '';
                    string2 = string1 + string2;
                    string3 = string2 + "-";
                    string4 = element.additionalOuttTime ? this.datePipe.transform(this.utcToLocal(element.additionalOuttTime), 'HH:mm').toString() : '' ;
                    string5 = string4 + ")";
                    element.information = string3 + string5;
                    //element.additionInformation = element.additionInformation.toString() + '(' + element.additionalIntTime ? this.datePipe.transform(this.utcToLocal(element.additionalInTime), 'HH:mm').toString() : '' + '-' + element.additionalOutTime ? this.datePipe.transform(this.utcToLocal(element.additionalOutTime), 'HH:mm').toString() : '' + ')';
                }
                else{
                    element.information = element.additionInformation;
                }
            }
            else {
                element.additionInformation = '';
            }
            element.inTime = element.isOnLeave == true ? null : element.inTime;
            element.outTime = element.isOnLeave == true ? null : element.outTime;
            element.breakmins = element.isOnLeave == true ? null : element.breakmins;
        });
    }
    goToUserProfile(event) {
        if (!event.isActive) {
            this.toaster.error(this.translateService.instant("PAYROLLREPORTS.EMPLOYEEISINACTIVE"));
        }
        else {
            this.router.navigate(["dashboard/profile", event.userId, "overview"]);
        }
    }

    openSubmitPopup(lineManager ,rejectedReasonPopUp) {
        this.approverId = lineManager.userId;
        rejectedReasonPopUp.openPopover();
      }
    
      rejectTimeSheet(){
        this.submitTimesheet( this.approverId);
      }
    
      closerejectedMessgaePopUp(){
        this.submitPopOver.forEach((p) => p.closePopover());
        this.approverId = null;
      }
}