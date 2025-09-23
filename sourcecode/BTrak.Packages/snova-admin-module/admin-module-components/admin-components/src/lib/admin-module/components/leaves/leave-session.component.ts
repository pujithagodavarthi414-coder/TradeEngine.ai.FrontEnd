import { ChangeDetectorRef, Component, Input, OnInit, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LeaveSessionModel } from '../../models/leaves-models/leave-session-model';
import { LeavesManagementService } from '../../services/leaves-management.service';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { ConstantVariables } from '../../helpers/constant-variables';

@Component({
    selector: 'app-fm-component-leave-session',
    templateUrl: `leave-session.component.html`
})

export class LeaveSessionComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("deleteLeaveSessionPopUp") deleteLeaveSessionPopover;
    @ViewChildren("upsertLeaveSessionPopUp") upsertLeaveSessionPopover;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    leaveSessionForm: FormGroup;
    isFiltersVisible: boolean = false;
    isArchivedTypes: boolean = false;
    isThereAnError: boolean = false;
    leaveSessionId: string;
    leaveSessionName: string;
    validationMessage: string;
    searchText: string;
    leaveSession: LeaveSessionModel;
    isAnyOperationIsInprogress: boolean = false;
    leaveSessions: LeaveSessionModel[];
    timeStamp: any;
    temp: any;
    leaveSessionEdit: string;

    constructor(private cdRef: ChangeDetectorRef,private translateService: TranslateService,
          private leavesManagementService: LeavesManagementService) { super(); }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getAllLeaveSessions();
    }

    getAllLeaveSessions() {
        this.isAnyOperationIsInprogress = true;
        var leaveSessionModel = new LeaveSessionModel();
        leaveSessionModel.isArchived = this.isArchivedTypes;
        this.leavesManagementService.getAllLeaveSessions(leaveSessionModel).subscribe((response: any) => {
            if (response.success == true) {
                this.leaveSessions = response.data;
                this.temp = this.leaveSessions;
                this.clearForm();
            }
            if (response.success == false) {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });

    }

    deleteLeaveSessionPopUpOpen(row, deleteLeaveSessionPopUp) {
        this.leaveSessionId = row.leaveSessionId;
        this.leaveSessionName = row.leaveSessionName;
        this.timeStamp = row.timeStamp;
        deleteLeaveSessionPopUp.openPopover();
    }

    closeDeleteLeaveSessionDialog() {
        this.clearForm();
        this.deleteLeaveSessionPopover.forEach((p) => p.closePopover());
    }

    upsertLeaveSession(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.leaveSession = this.leaveSessionForm.value;
        this.leaveSession.leaveSessionName = this.leaveSession.leaveSessionName.toString().trim();
        this.leaveSession.leaveSessionId = this.leaveSessionId;
        this.leaveSession.timeStamp = this.timeStamp;

        this.leavesManagementService.upsertLeaveSession(this.leaveSession).subscribe((response: any) => {
            if (response.success == true) {
                this.upsertLeaveSessionPopover.forEach((p) => p.closePopover());
                this.clearForm();
                formDirective.resetForm();
                this.getAllLeaveSessions();
            } else {
                this.isThereAnError = true;
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });

    }

    deleteLeaveSession() {
        this.isAnyOperationIsInprogress = true;
        this.leaveSession = new LeaveSessionModel();
        this.leaveSession.leaveSessionId = this.leaveSessionId;
        this.leaveSession.leaveSessionName = this.leaveSessionName;
        this.leaveSession.timeStamp = this.timeStamp;
        this.leaveSession.isArchived = !this.isArchivedTypes;

        this.leavesManagementService.upsertLeaveSession(this.leaveSession).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteLeaveSessionPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllLeaveSessions();
            } else {
                this.isThereAnError = true;
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = response.apiResponseMessages[0].message;
            }
        });

    }

    editLeaveSession(row, upsertLeaveSessionPopUp) {
        this.leaveSessionForm.patchValue(row);
        this.leaveSessionId = row.leaveSessionId;
        this.timeStamp = row.timeStamp;
        this.leaveSessionEdit = this.translateService.instant('LEAVESESSION.EDITLEAVESESSION');
        upsertLeaveSessionPopUp.openPopover();
    }

    closeUpsertLeaveSessionPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertLeaveSessionPopover.forEach((p) => p.closePopover());
    }

    createLeaveSession(upsertLeaveSessionPopUp) {
        upsertLeaveSessionPopUp.openPopover();
        this.leaveSessionEdit = this.translateService.instant('LEAVESESSION.ADDLEAVESESSION');
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    clearForm() {
        this.leaveSession = null;
        this.leaveSessionId = null;
        this.isThereAnError = false;
        this.leaveSessionName = null;
        this.isAnyOperationIsInprogress = false;
        this.validationMessage = null;
        this.timeStamp = null;
        this.searchText = null;
        this.leaveSessionForm = new FormGroup({
            leaveSessionName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
        })
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter((leaveSession) => leaveSession.leaveSessionName.toLowerCase().indexOf(this.searchText) > -1);
        this.leaveSessions = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }
}
