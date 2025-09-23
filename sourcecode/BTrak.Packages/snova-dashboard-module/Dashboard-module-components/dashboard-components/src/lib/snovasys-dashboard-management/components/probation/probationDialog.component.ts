import { Component, EventEmitter, Inject, Input, Output, ViewChild } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { StatusreportService } from "../../services/statusreport.service";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardService } from '../../services/dashboard.service';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { ProbationConfigurationModel } from "../../models/probationConfiguration.model";
import { ProbationModel } from "../../models/probationModel";

@Component({
    selector: "probation-dialog",
    templateUrl: "probationDialog.component.html"
})

export class ProbationDialogComponent extends CustomAppBaseComponent {
    isForConfiguration: boolean;
    @ViewChild("customFormio") formio;
    probationName: string;
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
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    id: any;
    @Output() closeMatDialog = new EventEmitter<boolean>();
    @Output() dataSubmit = new EventEmitter<ProbationModel>();
    @Output() onApproval = new EventEmitter<ProbationModel>();
    probationForm = new FormGroup({
        formName: new FormControl("", [
            Validators.required,
            Validators.maxLength(50)
        ]),
        selectedRoles: new FormControl("", [
            Validators.required
        ])
    });
    public basicForm = { components: [] };

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            if(this.matData){
                this.currentDialogId = this.matData.dialogId;
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            }
            this.isForConfiguration = this.matData.isForConfiguration;
            this.probationName = this.matData.probationName;
            this.isEdit = this.matData.isEdit;
            this.isDraft = this.matData.isDraft;
            this.selectedRoleIds = this.matData.selectedRoleIds;
            this.isApproved = this.matData.isApproved;
            this.isForApproval = this.matData.isForApproval;
            this.formData = this.matData.formData ? JSON.parse(this.matData.formData) : { data: {} };
            this.timeStamp = this.matData.timeStamp;
            this.configurationId = this.matData.configurationId;
            this.formJson = this.matData.formJson ? JSON.parse(this.matData.formJson) : Object.assign({}, this.basicForm);
            if (this.isForConfiguration === true) {
                this.GetAllRoles();
            }
        }
    }

    constructor(
        public ProbationDialog: MatDialogRef<ProbationDialogComponent>,
        private dashboardService: DashboardService,
        private statusreportService: StatusreportService,
        private toaster: ToastrService,
        public routes: Router,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        ) {
        super();
        if (data.dialogId) {
            this.currentDialogId = this.data.dialogId;
            this.id = setTimeout(() => {
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            }, 1200)
        }
        this.isForConfiguration = data.isForConfiguration;
        this.probationName = data.probationName;
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
        this.probationForm = new FormGroup({
            formName: new FormControl(this.probationName, [
                Validators.required,
                Validators.maxLength(50)
            ]),
            selectedRoles: new FormControl(this.selectedRoleIds, [
                Validators.required
            ])
        });
        this.probationForm.get("selectedRoles").patchValue(this.selectedRoleIds);
    }

    UpsertProbation(isDraft) {
        this.isAnyOperationInProgress = true;
        const probationConfig = new ProbationConfigurationModel();
        probationConfig.configurationName = this.probationForm.get("formName").value;
        probationConfig.selectedRoleIds = this.probationForm.get("selectedRoles").value;
        probationConfig.formJson = JSON.stringify(this.formJson);
        probationConfig.isArchived = false;
        probationConfig.isDraft = isDraft;
        if (this.timeStamp) {
            probationConfig.timeStamp = this.timeStamp;
        }
        probationConfig.configurationId = this.configurationId;
        this.statusreportService.UpsertProbationConfiguration(probationConfig).subscribe((result: any) => {
            if (result.success === true) {
                this.closeMatDialog.emit(true);
                if (this.currentDialog) { 
                    this.currentDialog.close();
                    this.currentDialog.close({ success: true });
                }
                else if (this.ProbationDialog) this.ProbationDialog.close();
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
            this.isAnyOperationInProgress = false;
        })

    }

    onDataApproval() {
        const probation = new ProbationModel();
        probation.formData = JSON.stringify(this.formData);
        probation.isApproved = true;
        this.onApproval.emit(probation);
    }

    editFormComponent() {
        this.isEdit = !this.isEdit;
    }

    onNoClick(): void {
        if (this.currentDialog) { 
            this.currentDialog.close();
            this.currentDialog.close({ success: true });
        }
        else if (this.ProbationDialog) this.ProbationDialog.close();
    }

    onDataSubmit(isFromDraft) {
        const probation = new ProbationModel();
        probation.formData = JSON.stringify(this.formData);
        probation.isDraft = isFromDraft;
        probation.isSubmitted = !isFromDraft;
        this.dataSubmit.emit(probation);
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
