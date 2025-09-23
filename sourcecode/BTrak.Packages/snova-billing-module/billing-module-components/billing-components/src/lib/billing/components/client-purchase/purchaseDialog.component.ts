import { Component, EventEmitter, Inject, Input, Output, ViewChild } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import '../../../globaldependencies/helpers/fontawesome-icons';
import { ContractConfigurationModel, PurchaseContractModel } from "../../models/purchase-contract";
import { BillingDashboardService } from "../../services/billing-dashboard.service";
import { AppBaseComponent } from "../componentbase";

@Component({
    selector: "purchase-dialog",
    templateUrl: "./purchaseDialog.component.html"
})

export class PurchaseDialogComponent extends  AppBaseComponent {
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
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    id: any;
    @Output() closeMatDialog = new EventEmitter<boolean>();
    @Output() dataSubmit = new EventEmitter<PurchaseContractModel>();
    @Output() onApproval = new EventEmitter<PurchaseContractModel>();
    purchaseForm = new FormGroup({
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
            this.performanceName = this.matData.performanceName;
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
        public PerformanceDialog: MatDialogRef<PurchaseDialogComponent>,
        private billingService: BillingDashboardService,
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
        this.billingService
            .GetallRoles()
            .subscribe((responseData: any) => {
                this.rolesDropDown = responseData.data;
                this.roleIds = this.rolesDropDown.map(x => x.roleId);
                this.initializeForm();
            });
    }

    initializeForm() {
        this.purchaseForm = new FormGroup({
            formName: new FormControl(this.performanceName, [
                Validators.required,
                Validators.maxLength(50)
            ]),
            selectedRoles: new FormControl(this.selectedRoleIds, [
                Validators.required
            ])
        });
        this.purchaseForm.get("selectedRoles").patchValue(this.selectedRoleIds);
    }

    UpsertPerformance(isDraft) {
        this.isAnyOperationInProgress = true;
        const performanceConfig = new ContractConfigurationModel();
        performanceConfig.purchaseName = this.purchaseForm.get("formName").value;
        performanceConfig.selectedRoleIds = this.purchaseForm.get("selectedRoles").value;
        performanceConfig.formJson = JSON.stringify(this.formJson);
        performanceConfig.isArchived = false;
        performanceConfig.isDraft = isDraft;
        if (this.timeStamp) {
            performanceConfig.timeStamp = this.timeStamp;
        }
        performanceConfig.purchaseId = this.configurationId;
        this.billingService.UpsertPurchaseConfiguration(performanceConfig).subscribe((result: any) => {
            if (result.success === true) {
                this.closeMatDialog.emit(true);
                if (this.currentDialog) { 
                    this.currentDialog.close();
                    this.currentDialog.close({ success: true });
                }
                else if (this.PerformanceDialog) this.PerformanceDialog.close();
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toaster.error(this.validationMessage);
            }
            this.isAnyOperationInProgress = false;
        })

    }

    onDataApproval() {
        const performance = new PurchaseContractModel();
        performance.formData = JSON.stringify(this.formData);
        performance.isApproved = true;
        this.onApproval.emit(performance);
    }

    editFormComponent() {
        this.isEdit = !this.isEdit;
    }

    onNoClick(): void {
        if (this.currentDialog) { 
            this.currentDialog.close();
            this.currentDialog.close({ success: true });
        }
        else if (this.PerformanceDialog) this.PerformanceDialog.close();
    }

    onDataSubmit(isFromDraft) {
        const performance = new PurchaseContractModel();
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
        if (document.querySelector != null && document.querySelector != undefined && document.querySelector(".formio-loader-wrapper") != null && document.querySelector(".formio-loader-wrapper") != undefined && (document.querySelector(".formio-loader-wrapper") as HTMLElement)) {
            (document.querySelector(".formio-loader-wrapper") as HTMLElement).parentElement.parentElement.style.display = "none";
        }
    }
    ngAfterViewInit() {
        if ((document.querySelector(".formio-loader-wrapper") as HTMLElement)) {
            (document.querySelector(".formio-loader-wrapper") as HTMLElement).parentElement.parentElement.style.display = "none";
        }
    }

}
