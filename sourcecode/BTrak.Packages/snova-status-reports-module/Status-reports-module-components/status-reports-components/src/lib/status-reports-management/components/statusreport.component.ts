import { Component, OnInit, ViewChild, ViewChildren, ElementRef, ChangeDetectorRef, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  MatMenuTrigger } from '@angular/material/menu';
import {  MatDialog } from '@angular/material/dialog';
import { MatOption } from '@angular/material/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StatusreportService } from '../services/statusreport.service';
import { CreateGenericForm } from '../models/createGenericForm';
import { Router } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";
import * as _ from "underscore";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { TeamLeads } from '../models/teamleads.model';
import { StatusReportingConfiguration } from '../models/statusReportingConfiguration';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import { GoogleAnalyticsService } from '../services/google-analytics.service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { ViewformComponent } from './view-form.component';
import "../../globaldependencies/helpers/fontawesome-icons"
import * as $_ from 'jquery';
const $ = $_;

@Component({
    selector: "app-profile-component-statusreport",
    templateUrl: "./statusreport.component.html",
    styles: [`
        .statusreports-height
        {
        height : calc(100vh - 120px) !important
        }`]
})

export class StatusReportComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
    @ViewChildren("statusReportingPopover") statusReportingPopup;
    @ViewChildren("deleteConfigurationMenuPopup") deleteConfigurationMenuPopups;
    @ViewChild("allSelected") private allSelected: MatOption;
    @ViewChild("assignedToEmployees") assignedToEmployeesStatus: ElementRef;

    @Input("dashboardId")
    set _dashboardId(data: string) {
        if (data != null && data !== undefined && data !== this.dashboardId) {
            this.dashboardId = data;           
        }
    }
    
    Arr = Array;
    num = 8;
    isAnyOperationIsInprogress: boolean;
    createGenericForm: CreateGenericForm;
    usersList: TeamLeads[];
    selectedFormType: any;
    selectedForm: any;
    showTooltip = false;
    formTypes: any;
    timeStamp: any;
    genericFormListDetails: any;
    statusConfigurationOptions: any;
    previewForForm: any;
    configurationId: string = null;
    preview = false;
    buttonDisabled = false;
    isCreateStatusConfiguration = false;
    configurationName = "";
    toastrMessage: string;
    selectedUserId: string;
    selectedUsersList: string;
    statusReportingConfiguration: StatusReportingConfiguration;
    genericForms = [];
    configurationOptions = [];
    configureOptions = [];
    selectedConfigurationOptions = [];
    selectedEmployee: any = [];
    selectedEmployeesList: any = [];
    statusReportingConfigurationsList = [];
    selectedType = new FormControl("", [Validators.required]);
    nameFormControl = new FormControl("", [Validators.required, Validators.maxLength(100)]);
    selectedFormId = new FormControl("", [Validators.required]);
    selectedUsers = new FormControl("", [Validators.required]);
    selectedUserIds: string[] = [];
    softLabels: SoftLabelConfigurationModel[];
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    fullHeight: boolean = false;
    dashboardId: string;

    public initSettings = {
        selector: ".dfree-header",
        menubar: false,
        inline: true,
        theme: "inlite",
        insert_toolbar: "undo redo",
        selection_toolbar: "bold italic | h2 h3 | blockquote quicklink"
    };

    constructor(
        private cookieService: CookieService, private cdRef: ChangeDetectorRef,
        public dialog: MatDialog, private statusreportService: StatusreportService,
        private snackbar: MatSnackBar, private toastr: ToastrService, private routes: Router,
        private translateService: TranslateService,
        private router: Router,
        public googleAnalyticsService: GoogleAnalyticsService ) {
        super();
        this.selectedUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    }

    ngOnInit() {
        super.ngOnInit();
        if(this.router.url.includes('/statusreportssettings')) {
            this.dashboardId = null;
            this.fullHeight = false;
        }
        if(this.router.url.includes('/dashboard-management/widgets')) {
            this.dashboardId = null;
            this.fullHeight = true;
        }
        this.getSoftLabels();
        this.isAnyOperationIsInprogress = true;
        this.statusreportService.getTeamLeadsList().subscribe((response: any) => {
            this.usersList = response.data;
            this.cdRef.detectChanges();
        })
        this.statusreportService.GetFormTypes().subscribe((response: any) => {
            this.formTypes = response.data;
            this.cdRef.detectChanges();
        })
        this.statusreportService.GetStatusConfigurationOptions().subscribe((response: any) => {
            this.statusConfigurationOptions = response.data;
            for (const option of this.statusConfigurationOptions) {
                this.configurationOptions.push({ id: option.id, checked: false });
            }
            this.cdRef.detectChanges();
        })
        this.statusReportingConfiguration = new StatusReportingConfiguration();
        this.statusreportService.GetStatusReportingConfigurations(this.statusReportingConfiguration).subscribe((responses: any) => {
            this.statusReportingConfigurationsList = responses.data;
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        })
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }

    cancelConfiguration() {
        this.isCreateStatusConfiguration = false;
        this.statusReportingPopup.forEach((p) => p.closePopover());
    }

    addForm() {
        this.routes.navigate(["applications/view-forms"]);
    }

    getForms(formTypeId) {
        this.preview = false;
        this.selectedForm = "";
        this.statusreportService.GetGenericFormsByTypeId(formTypeId).subscribe((response: any) => {
            this.genericFormListDetails = response.data;
            this.cdRef.detectChanges();
        })
    }

    previewForm(formId) {
        const index = this.genericFormListDetails.findIndex((x) => x.id == formId);
        this.previewForForm = this.genericFormListDetails[index].formJson;
        this.previewForForm = JSON.parse(this.previewForForm);
        this.preview = true;
    }

    viewForm(formId) {
        this.previewForm(formId);
        const dialogRef = this.dialog.open(ViewformComponent, {
            width: "50%",
            height: "85%",
            data: { formSrc: this.previewForForm }
        });

        dialogRef.afterClosed().subscribe(() => {
            console.log("The dialog was closed");
        });
    }

    selectConfigurationOptions(option, checked) {
        const everyWorkingDayIndex = this.statusConfigurationOptions.findIndex((x) => x.optionName == "Everyworkingday");
        const lastWorkingDayIndex = this.statusConfigurationOptions.findIndex((x) => x.optionName == "Lastworkingdayofthemonth");
        const everyWorkingDayId = this.statusConfigurationOptions[everyWorkingDayIndex].id;
        const lastWorkingDayId = this.statusConfigurationOptions[lastWorkingDayIndex].id;
        if ((checked == true && option.optionName == "Everyworkingday") || (checked == true && option.optionName == "Lastworkingdayofthemonth")) {
            for (const opt of this.configurationOptions) {
                if (opt.id != option.id) {
                    opt.checked = false;
                }
            }
            this.selectedConfigurationOptions = [];
            this.selectedConfigurationOptions.push(option.id);
            return;
        }
        if (checked == true) {
            this.selectedConfigurationOptions.push(option.id);
            if (this.selectedConfigurationOptions.indexOf(everyWorkingDayId) != -1) {
                const index = this.configurationOptions.findIndex((x) => x.id == everyWorkingDayId);
                const selIndex = this.selectedConfigurationOptions.indexOf(everyWorkingDayId);
                this.configurationOptions[index].checked = false;
                this.selectedConfigurationOptions.splice(selIndex, 1);
            }
            if (this.selectedConfigurationOptions.indexOf(lastWorkingDayId) != -1) {
                const index = this.configurationOptions.findIndex((x) => x.id == lastWorkingDayId);
                const selIndex = this.selectedConfigurationOptions.indexOf(lastWorkingDayId);
                this.configurationOptions[index].checked = false;
                this.selectedConfigurationOptions.splice(selIndex, 1);
            }
        }
        if (checked == false) {
            const index = this.selectedConfigurationOptions.indexOf(option.id);
            this.selectedConfigurationOptions.splice(index, 1);
        }
    }

    checkStatusDisabled() {
        if (this.buttonDisabled == true) {
            return true;
        }
        if (this.configurationName && this.configurationName.length <= 100 && this.selectedFormType &&
            this.selectedForm && this.selectedUsers.value.length >= 1 && this.selectedConfigurationOptions.length >= 1) {
            return false;
        } else {
            return true;
        }
    }

    upsertStatusReportConfiguration() {
        this.buttonDisabled = true;
        this.statusReportingConfiguration = new StatusReportingConfiguration();
        this.statusReportingConfiguration.Id = this.configurationId;
        this.statusReportingConfiguration.ConfigurationName = this.configurationName;
        this.statusReportingConfiguration.GenericFormId = this.selectedForm;
        this.statusReportingConfiguration.TimeStamp = this.timeStamp;
        this.selectedEmployeesList = [];
        for (const emp of this.selectedUserIds) {
            if (emp != "0") {
                this.selectedEmployeesList.push(emp);
            }
        }
        this.statusReportingConfiguration.EmployeeIds = this.selectedEmployeesList.toString();
        this.statusReportingConfiguration.StatusConfigurationOptions = this.selectedConfigurationOptions.toString();

        if (this.statusReportingConfiguration.Id == null)
            this.googleAnalyticsService.eventEmitter("Status Report", "Created Status Report", this.statusReportingConfiguration.ConfigurationName, 1);
        else
            this.googleAnalyticsService.eventEmitter("Status Report", "Updated Status Report", this.statusReportingConfiguration.ConfigurationName, 1);

        this.addOrUpdateConfiguration();
    }

    openStatusReportingPopover(statusReportingPopover) {
        this.isCreateStatusConfiguration = true;
        statusReportingPopover.openPopover();
        this.clearConfigurationForm();
    }

    editReport(status, statusReportingPopover) {
        this.isCreateStatusConfiguration = true;
        statusReportingPopover.openPopover();
        this.configurationId = status.id;
        this.configurationName = status.configurationName;
        this.selectedFormType = status.formTypeId;
        this.timeStamp = status.timeStamp;
        this.statusreportService.GetGenericFormsByTypeId(this.selectedFormType).subscribe((response: any) => {
            this.genericFormListDetails = response.data;
            this.selectedForm = status.genericFormId;
            this.preview = true;
        })
        this.selectedEmployee = [];
        this.selectedEmployeesList = [];
        if (status.employeeIds.trim().length > 36) {
            const employees = status.employeeIds.trim().split(",");
            for (const emp of employees) {
                const index = this.usersList.findIndex((x) => x.teamMemberId == emp.trim());

                this.selectedEmployee.push(this.usersList[index]);
                this.selectedUsers.patchValue([this.usersList[index].teamMemberId]);
                this.selectedUserIds.push(this.usersList[index].teamMemberId);
                this.selectedEmployeesList.push(emp.trim());
            }
        } else {
            const index = this.usersList.findIndex((x) => x.teamMemberId == status.employeeIds.trim());
            this.selectedEmployee.push(this.usersList[index]);
            this.selectedUsers.patchValue([this.usersList[index].teamMemberId]);
            this.selectedUserIds.push(this.usersList[index].teamMemberId);
            this.selectedEmployeesList.push(status.employeeIds.trim());

        }
        this.getUserslistByUserId();
        this.selectedConfigurationOptions = [];
        if (status.statusReportingOptionIds.trim().length > 36) {
            const configuringOptions = status.statusReportingOptionIds.split(",");
            for (const opt of configuringOptions) {
                const optionIndex = this.configurationOptions.findIndex((x) => x.id == opt.trim());
                this.configurationOptions[optionIndex].checked = true;
                this.selectedConfigurationOptions.push(opt.trim());
            }
        } else {
            const optionIndex = this.configurationOptions.findIndex((x) => x.id == status.statusReportingOptionIds.trim());
            this.configurationOptions[optionIndex].checked = true;
            this.selectedConfigurationOptions.push(status.statusReportingOptionIds.trim());
        }
        if (this.usersList.length === this.selectedUserIds.length) {
            if (this.allSelected != null) {
                this.allSelected.select();
            }
        }
    }

    deleteReport(status, statusId, deleteConfigurationMenuPopup) {
        this.statusReportingConfiguration = new StatusReportingConfiguration();
        deleteConfigurationMenuPopup.openPopover();
        this.statusReportingConfiguration.Id = statusId;
        this.configurationId = "deleted";
        this.statusReportingConfiguration.ConfigurationName = status.configurationName;
        this.statusReportingConfiguration.GenericFormId = status.genericFormId;
        this.statusReportingConfiguration.TimeStamp = status.timeStamp;
        this.statusReportingConfiguration.EmployeeIds = status.employeeIds.trim();
        this.statusReportingConfiguration.StatusConfigurationOptions = status.statusReportingOptionIds.trim();
        this.statusReportingConfiguration.IsArchived = true;
    }

    deleteConfiguration() {
        this.closedialog();
        this.googleAnalyticsService.eventEmitter("Status Report", "Deleted Status Report", this.statusReportingConfiguration.ConfigurationName, 1);
        this.addOrUpdateConfiguration();
    }

    addOrUpdateConfiguration() {
        this.statusreportService.UpsertStatusReportingConfiguration(this.statusReportingConfiguration).subscribe((response: any) => {
            if (response.success == true) {
                if (this.configurationId == null) {
                    this.snackbar.open(this.translateService.instant(ConstantVariables.Configuration) + this.translateService.instant(ConstantVariables.StatusReportCreatedSuccessfully), "Ok", { duration: 3000 });
                }
                if (this.configurationId != null) {
                    this.snackbar.open(this.translateService.instant(ConstantVariables.Configuration) + this.translateService.instant(ConstantVariables.StatusReportUpdatedSuccessfully), "Ok", { duration: 3000 });
                }
                if (this.configurationId == "deleted") {
                    this.snackbar.open(this.translateService.instant(ConstantVariables.Configuration) + this.translateService.instant(ConstantVariables.StatusReportDeletedSuccessfully), "Ok", { duration: 3000 });
                }
                this.clearConfigurationForm();
                this.cancelConfiguration();
                this.statusReportingConfiguration = new StatusReportingConfiguration();
                this.statusreportService.GetStatusReportingConfigurations(this.statusReportingConfiguration).subscribe((responses: any) => {
                    this.statusReportingConfigurationsList = responses.data;
                    this.isAnyOperationIsInprogress = false;
                    this.cdRef.detectChanges();
                })

            }
            if (response.success == false) {
                const validationmessage = response.apiResponseMessages[0].message;
                this.toastr.error("", validationmessage);
                this.buttonDisabled = false;
            }
        })
    }

    clearConfigurationForm() {
        this.buttonDisabled = false;
        this.selectedType = new FormControl("", [Validators.required]);
        this.nameFormControl = new FormControl("", [Validators.required, Validators.maxLength(100)]);
        this.selectedFormId = new FormControl("", [Validators.required]);
        this.selectedUsers = new FormControl("", [Validators.required]);
        this.configurationId = null;
        this.configurationName = "";
        this.selectedFormType = "";
        this.genericFormListDetails = [];
        this.selectedForm = "";
        this.timeStamp = null;
        this.preview = false;
        this.selectedEmployee = [];
        this.selectedEmployeesList = [];
        this.selectedUserIds = [];
        this.selectedConfigurationOptions = [];
        for (let i = 0; i < this.statusConfigurationOptions.length; i++) {
            this.configurationOptions[i].checked = false;
        }
    }

    closedialog() {
        this.deleteConfigurationMenuPopups.forEach((p) => p.closePopover());
    }

    // viewReports() {
    //     this.routes.navigate(["statusreports/view-reports/1"]);
    // }

    toggleAllUsersSelected() {
        if (this.allSelected.selected) {
            if (this.usersList.length === 0) {
                this.selectedUsers.patchValue([]);
            } else {
                this.selectedUsers.patchValue([
                    ...this.usersList.map((item) => item.teamMemberId),
                    0
                ]);
            }

        } else {
            this.selectedUsers.patchValue([]);
        }
        this.getUserslistByUserId();
    }

    toggleUserPerOne() {
        if (this.allSelected.selected) {
            this.allSelected.deselect();
            return false;
        }
        if (
            this.selectedUsers.value.length === this.usersList.length
        ) {
            this.allSelected.select();
        }
    }

    compareSelectedTeamMembersFn(usersList: any, selectedUsers: any) {
        if (usersList === selectedUsers) {
            return true;
        } else {
            return false;
        }
    }

    getUserslistByUserId() {
        const selectedUser = this.selectedUserIds;
        const index = selectedUser.indexOf("0");
        if (index > -1) {
            selectedUser.splice(index, 1);
        }
        this.selectedUserId = selectedUser.toString();
        const usersList = this.usersList;
        const users = _.filter(usersList, function (status) {
            return selectedUser.toString().includes(status.teamMemberId);
        })
        const userNames = users.map((x) => x.teamMemberName);
        this.selectedUsersList = userNames.toString();
    }

    checkTooltipStatus() {
        if (this.assignedToEmployeesStatus.nativeElement.scrollWidth > this.assignedToEmployeesStatus.nativeElement.clientWidth) {
            this.showTooltip = true;
        } else {
            this.showTooltip = false;
        }
    }

    // fitContent(optionalParameters: any) {
    //     var interval;
    //     var count = 0;
           
    //     if (optionalParameters['gridsterView']) {
    //       interval = setInterval(() => {
    //         try {
    //           if (count > 30) {
    //             clearInterval(interval);
    //           }
    //           count++;
    //           if ($(optionalParameters['gridsterViewSelector'] + ' .statusReport-scroll-height').length > 0) {
    //             var contentHeight = $(optionalParameters['gridsterViewSelector']).height() - 90;
    //             $(optionalParameters['gridsterViewSelector'] + ' .statusReport-scroll-height').css("cssText", `height: ${contentHeight}px !important;`);
    //             clearInterval(interval);
    //           }
    //         } catch (err) {
    //           clearInterval(interval);
    //         }
    //       }, 1000);
    //     }
    
    //   }
}
