import { Component, EventEmitter, Inject, Output, ViewChild } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { PerformanceConfigurationModel } from "../../models/performanceConfigurationModel";
import { PerformanceModel } from "../../models/performanceModel";
import { StatusreportService } from "../../services/statusreport.service";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardService } from '../../services/dashboard.service';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "performance-dialog",
    templateUrl: "./performanceDialog.component.html"
})

export class PerformanceDialogComponent extends CustomAppBaseComponent {
    isForConfiguration: boolean;
    @ViewChild("customFormio") formio;
    performanceName: string;
    isEdit: boolean;
    isDraft: boolean;
    selectedRoleIds: any[];
    rolesDropDown: any[];
    roleIds: any[];
    timeStamp: any;
    isAnyOperationInProgress = false;
    configurationId: string;
    validationMessage: string;
    isApproved = false;
    isForApproval = false;
    formJson: any;
    formData = { data: {} };
    @Output() closeMatDialog = new EventEmitter<boolean>();
    @Output() dataSubmit = new EventEmitter<PerformanceModel>();
    @Output() onApproval = new EventEmitter<PerformanceModel>();
    performanceForm = new FormGroup({
        formName: new FormControl("", [
            Validators.required,
            Validators.maxLength(50)
        ]),
        selectedRoles: new FormControl("", [
            Validators.required
        ])
    });
    public basicForm = { components: [] };

    constructor(
        public PerformanceDialog: MatDialogRef<PerformanceDialogComponent>,
        private dashboardService: DashboardService,
        private statusreportService: StatusreportService,
        private toaster: ToastrService,
        public routes: Router,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        super();
        this.isForConfiguration = data.isForConfiguration;
        this.performanceName = data.performanceName;
        this.isEdit = data.isEdit;
        this.isDraft = data.isDraft;
        this.selectedRoleIds = data.selectedRoleIds;
        this.isApproved = data.isApproved;
        this.isForApproval = data.isForApproval;
        this.formData = data.formData ? JSON.parse(data.formData) : { data: {} };
        this.timeStamp = data.timeStamp;
        this.configurationId = data.configurationId;
        this.formJson = data.formJson ? JSON.parse(data.formJson) : Object.assign({}, this.basicForm);
        if (this.isForConfiguration === true) {
            this.GetAllRoles();
        }
    }

    GetAllRoles() {
        this.dashboardService
            .GetallRoles()
            .subscribe((responseData: any) => {
                this.rolesDropDown = responseData.data;
                this.roleIds = this.rolesDropDown.map(x => x.roleId);
                this.initializeForm();
            });
    }

    initializeForm() {
        this.performanceForm = new FormGroup({
            formName: new FormControl(this.performanceName, [
                Validators.required,
                Validators.maxLength(50)
            ]),
            selectedRoles: new FormControl(this.selectedRoleIds, [
                Validators.required
            ])
        });
        this.performanceForm.get("selectedRoles").patchValue(this.selectedRoleIds);
    }

    UpsertPerformance(isDraft) {
        this.isAnyOperationInProgress = true;
        const performanceConfig = new PerformanceConfigurationModel();
        performanceConfig.configurationName = this.performanceForm.get("formName").value;
        performanceConfig.selectedRoleIds = this.performanceForm.get("selectedRoles").value;
        performanceConfig.formJson = JSON.stringify(this.formJson);
        performanceConfig.isArchived = false;
        performanceConfig.isDraft = isDraft;
        if (this.timeStamp) {
            performanceConfig.timeStamp = this.timeStamp;
        }
        performanceConfig.configurationId = this.configurationId;
        this.statusreportService.UpsertPerformanceConfiguration(performanceConfig).subscribe((result: any) => {
            if (result.success === true) {
                this.closeMatDialog.emit(true);
                this.PerformanceDialog.close();
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
            this.isAnyOperationInProgress = false;
        })

    }

    onDataApproval() {
        const performance = new PerformanceModel();
        performance.formData = JSON.stringify(this.formData);
        performance.isApproved = true;
        this.onApproval.emit(performance);
    }

    editFormComponent() {
        this.isEdit = !this.isEdit;
    }

    onNoClick(): void {
        this.PerformanceDialog.close();
    }

    onDataSubmit(isFromDraft) {
        const performance = new PerformanceModel();
        performance.formData = JSON.stringify(this.formData);
        performance.isDraft = isFromDraft;
        performance.isSubmitted = !isFromDraft;
        this.dataSubmit.emit(performance);
        if (this.isForApproval === true) {
            this.isEdit = false;
        }
    }

    onChange(event) {
        if (event.form != undefined) { this.formJson = event.form };
    }

    ngOnInit() {
        super.ngOnInit();
    }

}
