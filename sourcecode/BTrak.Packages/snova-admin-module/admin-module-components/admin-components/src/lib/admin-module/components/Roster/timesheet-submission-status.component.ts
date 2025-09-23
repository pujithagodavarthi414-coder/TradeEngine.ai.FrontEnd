import { ChangeDetectorRef, Component, OnInit, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { TimesheetSubmissionStatusModel } from "../../models/timesheet-submission-status-model";
import { HRManagementService } from "../../services/hr-management.service";

@Component({
    selector: "app-rs-component-timesheetStatus",
    templateUrl: "timesheet-submission-status.component.html"
})

export class TimesheetStatusComponent extends CustomAppBaseComponent implements OnInit {
    anyOperationInProgress: boolean;
    isArchived: boolean = false;
    public color = "";
    statusList: TimesheetSubmissionStatusModel[] = [];
    temp: any;
    statusId: string;
    statusForm: FormGroup;
    status: TimesheetSubmissionStatusModel;
    timeStamp: any;
    searchText: string;
    statusName: string;

    @ViewChildren('createStatusPopover') createStatusPopovers;
    constructor(private hrService: HRManagementService,
        private toastr: ToastrService, private translateService: TranslateService, private cdRef: ChangeDetectorRef) {
        super();

    }
    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getStatus();
    }

    editStatus(row, createStatusPopover) {
        this.timeStamp = row.timeStamp;
        this.statusId = row.statusId;
        this.statusName = row.statusName;
        this.statusForm.patchValue(row);
        createStatusPopover.openPopover();
    }

    getStatus() {
        this.anyOperationInProgress = true;
        let status = new TimesheetSubmissionStatusModel();
        status.isArchived = this.isArchived;
        this.hrService.getTimeSheetStatus(status).subscribe((responseData: any) => {
            if (responseData.success) {
                this.anyOperationInProgress = false;
                this.statusList = responseData.data;
                this.temp = this.statusList;
                this.cdRef.detectChanges();
            }
            else {
                this.toastr.error(responseData.apiResponseMessages[0].message);
                this.anyOperationInProgress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    clearForm() {
        this.color = "";
        this.anyOperationInProgress = false;
        this.statusId = null;
        this.statusForm = new FormGroup({
            statusName: new FormControl({ value: "", disabled: true }, Validators.compose([Validators.required, Validators.maxLength(250)])),
            statusColour: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(250)]))
        });
    }

    upsertStatus(formDirective: FormGroupDirective) {
        this.anyOperationInProgress = true;
        this.status = this.statusForm.value;
        this.status.statusId = this.statusId;
        this.status.timeStamp = this.timeStamp;
        this.status.statusName = this.statusName;
        this.hrService.upsertTimeSheetStatus(this.status).subscribe((responseData: any) => {
            if (responseData.success) {
                formDirective.resetForm();
                this.clearForm();
                this.createStatusPopovers.forEach((p) => p.closePopover());
                this.getStatus();
            }
            else {
                this.toastr.error(responseData.apiResponseMessages[0].message);
                this.anyOperationInProgress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    closeDialog(formDirective: FormGroupDirective) {
        this.clearForm();
        formDirective.resetForm();
        this.createStatusPopovers.forEach((p) => p.closePopover());
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter(status => (status.statusName.toLowerCase().indexOf(this.searchText) > -1));
        this.statusList = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}