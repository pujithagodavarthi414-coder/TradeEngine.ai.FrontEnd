import { Component, Input, OnInit, ViewChildren } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatRadioChange } from "@angular/material/radio";
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import * as _ from "underscore";
import { SoftLabelConfigurationModel } from '../../models/softLabels-model';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { State } from "../../store/reducers/index";
import * as hrManagementModuleReducer from "../../store/reducers/index";
import { ReminderModel } from '../../models/reminder.model';
import { EmployeeService } from '../../services/employee-service';

@Component({
    selector: "app-hr-reminder",
    templateUrl: "./reminder.component.html"
})

export class ReminderComponent extends CustomAppBaseComponent implements OnInit {
    @Input("refernceId")
    set _refernceId(data: string) {
        if (data && data !== undefined) {
            this.referenceId = data;
            this.getReminders();
        }
    }

    @Input("referenceTypeId")
    set _referenceTypeId(data: string) {
        if (data && data !== undefined) {
            this.referenceTypeId = data;
        }
    }

    @Input("ofUser")
    set _ofUser(data: string) {
        if (data && data !== undefined) {
            this.ofUser = data;
        }
    }

    @Input("hasReminderPermissions")
    set _hasReminderPermissions(data: boolean) {
        if (data && data !== undefined) {
            this.hasReminderPermissions = data;
        }
    }

    @ViewChildren("deleteReminderPopup") deleteReminderPopup;
    @ViewChildren("upsertReminderPopup") upsertReminderPopup;

    isAnyOperationIsInprogress: boolean;
    referenceId: string;
    referenceTypeId: string;
    reminderDetails: ReminderModel;
    reminderName: string;
    reminderForm: FormGroup;
    minDate = new Date();
    ofUser: string;
    reminders: ReminderModel[] = [];
    hasReminderPermissions: boolean;
    validationMessage: string;
    reminderId: string;
    softLabels: SoftLabelConfigurationModel[];
    roleFeaturesIsInProgress$: Observable<Boolean>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;

    constructor(private store: Store<State>,
        public dialog: MatDialog, private employeeService: EmployeeService,
        private toastr: ToastrService,
        private translateService: TranslateService) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getSoftLabels();
        this.minDate = new Date();
        this.minDate.setDate(this.minDate.getDate() + 1);
    }

    getSoftLabels() {
        this.softLabels$ = this.store.pipe(select(hrManagementModuleReducer.getSoftLabelsAll));
        this.softLabels$.subscribe((x) => this.softLabels = x);
    }

    getReminders() {
        this.isAnyOperationIsInprogress = true;
        const reminderInput = new ReminderModel();
        reminderInput.isArchived = false;
        reminderInput.referenceId = this.referenceId;
        this.employeeService.GetReminders(reminderInput).subscribe((result: any) => {
            if (result.success === true) {
                this.reminders = result.data;
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
            this.isAnyOperationIsInprogress = false;
        });
    }

    openDeletePopup(row, deleteReminderPopup) {
        this.reminderDetails = row;
        deleteReminderPopup.openPopover();
    }

    closeDeletePopup() {
        this.clearForm();
        this.deleteReminderPopup.forEach((p) => { p.closePopover(); });
    }

    deleteReminder() {
        this.reminderDetails.isArchived = true;
        this.employeeService.UpsertReminder(this.reminderDetails).subscribe((result: any) => {
            if (result.success === true) {
                this.deleteReminderPopup.forEach((p) => { p.closePopover(); });
                this.getReminders();
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
        })

    }

    upsertReminder() {
        const reminderInput = new ReminderModel();
        reminderInput.additionalInfo = this.reminderForm.get("additionalInfo").value;
        reminderInput.notificationType = this.reminderForm.get("notificationType").value;
        reminderInput.remindOn = this.reminderForm.get("RemindOn").value;
        reminderInput.referenceId = this.referenceId;
        reminderInput.referenceTypeId = this.referenceTypeId;
        reminderInput.reminderId = this.reminderId;
        reminderInput.isArchived = false;
        reminderInput.ofUser = this.ofUser;
        this.employeeService.UpsertReminder(reminderInput).subscribe((result: any) => {
            if (result.success === true) {
                this.getReminders();
                this.upsertReminderPopup.forEach((p) => p.closePopover());
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
        });
    }

    openaddReminderPopup(upsertReminderPopup) {
        this.reminderName = this.translateService.instant("REMINDER.ADDREMINDER");
        this.clearForm();
        upsertReminderPopup.openPopover();
    }

    editReminder(row, upsertReminderPopup) {
        this.reminderName = this.translateService.instant("REMINDER.EDITREMINDER");
        this.clearForm();
        const notificationType = row.notificationType == 1 ? "1" : "2";
        this.reminderForm.get("notificationType").patchValue(notificationType);
        this.reminderForm.get("RemindOn").patchValue(row.remindOn);
        this.reminderForm.get("additionalInfo").patchValue(row.additionalInfo);
        this.reminderId = row.reminderId;
        upsertReminderPopup.openPopover();
    }

    closeUpsertReminder() {
        this.upsertReminderPopup.forEach((p) => p.closePopover());
    }

    onChange(mrChange: MatRadioChange) {
        this.reminderForm.get("notificationType").patchValue(mrChange.value);
    }

    clearForm() {
        this.isAnyOperationIsInprogress = false;
        this.reminderId = null;
        this.validationMessage = null;
        this.reminderDetails = null;
        const sampleMinDate = new Date();
        sampleMinDate.setDate(sampleMinDate.getDate() + 1);
        this.reminderForm = new FormGroup({
            RemindOn: new FormControl(sampleMinDate,
                Validators.compose([
                    Validators.required
                ])
            ),
            notificationType: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            additionalInfo: new FormControl(null,
                Validators.compose([
                    Validators.maxLength(650)
                ])
            )
        })
    }
}
