import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output, ViewChild } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { MatOption } from "@angular/material/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";

import { ToastrService } from "ngx-toastr";
import '../../../globaldependencies/helpers/fontawesome-icons';
import { ConstantVariables } from "../../constants/constant-variables";
import { ClientSearchInputModel } from "../../models/client-search-input.model";
import { KycConfigurationModel, KYCModel } from "../../models/clientKyc.model";
import { LegalEntityModel } from "../../models/legal-entity.model";
import { SoftLabelConfigurationModel } from "../../models/softlabels-model";
import { SoftLabelPipe } from "../../pipes/softlabels.pipes";
import { BillingDashboardService } from "../../services/billing-dashboard.service";
import { AppBaseComponent } from "../componentbase";
import * as _ from 'underscore';
import { ColorPickerService } from "ngx-color-picker";

@Component({
    selector: "addKycDialog-dialog",
    templateUrl: "./addKycDialog.component.html",
    styleUrls: ["addKycDialog.component.scss"],
    providers: [ColorPickerService]
})

export class AddClientKycDialogComponent extends AppBaseComponent {
    @ViewChild("roleAllSelected") private roleAllSelected: MatOption;
    isForConfiguration: boolean;
    @ViewChild("customFormio") formio;
    performanceName: string;
    isViewOnly: boolean;
    isEdit: boolean;
    isDraft: boolean;
    selectedRoleIds: any[];
    rolesDropDown: any[] = [];
    roleIds: any[];
    // clientTypeId: any;
    legalEntityTypeId: any;
    timeStamp: any;
    isAnyOperationInProgress = false;
    configurationId: string;
    validationMessage: string;
    selectedLegalIds: any[] = [];
    selectedRoleNames: string;
    selected
    isApproved = false;
    isForApproval = false;
    formJson: any;
    formData = { data: {} };
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    moduleTypeId = 17;
    isToUploadFiles: boolean = false;
    selectedParentFolderId: null;
    selectedStoreId: null;
    isFileExist: boolean;
    referenceTypeId = ConstantVariables.MasterContractReferenceTypeId;
    softLabels: SoftLabelConfigurationModel[];
    id: any;
    formBgColor: any = null;
    color: any = null;

    @ViewChild("formio") formiodetails: any;
    @Output() closeMatDialog = new EventEmitter<boolean>();
    @Output() dataSubmit = new EventEmitter<KYCModel>();
    @Output() onApproval = new EventEmitter<KYCModel>();
    kycForm = new FormGroup({
        formName: new FormControl("", [
            Validators.required,
            Validators.maxLength(50)
        ]),
        selectedRoles: new FormControl("", [
            Validators.required
        ]),
        selectedLegalEntities: new FormControl([], [
            Validators.required
        ]),
        formBgColor: new FormControl(this.formBgColor, [])

        // clientType: new FormControl("",
        //     [
        //         Validators.required
        //     ]),
        // legalEntityTypeId: new FormControl("",
        // [
        //     Validators.required
        // ]),

    });
    public basicForm = { components: [] };
    // clientTypesDropDown: any;
    // clientType: any;
    allSelected: any;
    legalEntityList: any;
    legalEntityIds: any;
    selectedLegalEntityIds: any;

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            if (this.matData) {
                this.currentDialogId = this.matData.dialogId;
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            }
            this.isForConfiguration = this.matData.isForConfiguration;
            this.performanceName = this.matData.performanceName;
            this.isEdit = this.matData.isEdit;
            this.isDraft = this.matData.isDraft;
            this.selectedRoleIds = this.matData.selectedRoleIds;
            this.selectedLegalEntityIds = this.matData.selectedLegalEntityIds;
            this.isApproved = this.matData.isApproved;
            this.isForApproval = this.matData.isForApproval;
            console.log(this.matData.formData)
            this.formData = this.matData.formData ? JSON.parse(this.matData.formData) : { data: {} };
            this.timeStamp = this.matData.timeStamp;
            this.configurationId = this.matData.configurationId;
            this.formBgColor = this.matData.formBgColor;
            // this.clientTypeId = this.matData.clientTypeId;
            // this.legalEntityTypeId = this.matData.legalEntityTypeId;
            // this.clientType = this.matData.clientType;
            this.formJson = this.matData.formJson ? JSON.parse(this.matData.formJson) : Object.assign({}, this.basicForm);
            if (this.isForConfiguration === true) {
                this.GetAllRoles();
                // this.getClientType();
                //this.getAllLegalEntitys();
            }
            else {
                var inputFormJson = this.formJson;
                inputFormJson = this.getDisableObjects(inputFormJson, 'key', '', true, ['']);
                this.formJson = inputFormJson;
                this.cdRef.detectChanges();

            }
        }
    }

    constructor(
        public PerformanceDialog: MatDialogRef<AddClientKycDialogComponent>,
        private dashboardService: BillingDashboardService, private softLabelPipe: SoftLabelPipe,
        // private dashboardService: dashboardService,
        private toaster: ToastrService,
        public routes: Router,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private cdRef: ChangeDetectorRef
    ) {
        super();
        if (data.dialogId) {
            this.currentDialogId = this.data.dialogId;
            this.id = setTimeout(() => {
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            }, 1200)
        }
        this.isViewOnly = true;
        this.isForConfiguration = data.isForConfiguration;
        this.performanceName = data.performanceName;
        this.isEdit = data.isEdit;
        this.isDraft = data.isDraft;
        // this.selectedRoleIds = data.selectedRoleIds;
        this.selectedLegalEntityIds = this.data.selectedLegalEntityIds;
        this.isApproved = data.isApproved;
        this.isForApproval = data.isForApproval;
        this.formData = data.formData ? JSON.parse(data.formData) : { data: {} };
        this.timeStamp = data.timeStamp;
        this.configurationId = data.configurationId;
        // this.clientTypeId = data.clientTypeId;
        // this.legalEntityTypeId = data.legalEntityTypeId;
        // this.clientType = data.clientType;
        this.formJson = data.formJson ? JSON.parse(data.formJson) : Object.assign({}, this.basicForm);
        if (this.isForConfiguration === true) {
            // this.GetAllRoles();
            // this.getClientType();
            this.getAllLegalEntitys();
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
    // getClientType() {
    //     this.dashboardService.getClientType().subscribe((responseData: any) => {
    //         this.clientTypesDropDown = responseData.data;
    //         // this.clientTypeId = this.rolesDropDown.map(x => x.clientTypeId);
    //     });
    // }
    getAllLegalEntitys() {
        let legalEntity = new LegalEntityModel();
        legalEntity.isArchived = false;
        this.dashboardService.getAllLegalEntities(legalEntity)
            .subscribe((responseData: any) => {
                this.legalEntityList = responseData.data;
                this.legalEntityIds = this.legalEntityList.map(x => x.legalEntityId);
                this.initializeForm();
            });
    }

    getDisableObjects(obj, key, val, newVal, list) {
        var newValue = newVal;
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(this.getDisableObjects(obj[i], key, val, newValue, list));
            } else if (i == key && obj[key] == val) {
                obj['disabled'] = newVal;
            }
            else if (i != key && !list.includes(obj[key])) {
                obj['disabled'] = true;
            }
        }
        return obj;
    }

    initializeForm() {
        this.kycForm = new FormGroup({
            formName: new FormControl(this.performanceName, [
                Validators.required,
                Validators.maxLength(50)
            ]),
            selectedRoles: new FormControl(this.selectedRoleIds, [
                Validators.required
            ]),
            // selectedLegalEntities: new FormControl(this.selectedLegalEntityIds, [
            //     Validators.required
            // ]),
            // clientType: new FormControl(this.clientTypeId,
            //     [
            //         Validators.required
            //     ]),
            // legalEntityTypeId: new FormControl(this.legalEntityTypeId,
            //     [
            //         Validators.required
            //     ]),
            formBgColor: new FormControl(this.formBgColor, [])
        });
        this.kycForm.get("selectedRoles").patchValue(this.selectedRoleIds);
        // this.kycForm.get("selectedLegalEntities").patchValue(this.selectedLegalEntityIds);
        if (
            this.kycForm.controls.selectedRoles.value.length === 
            this.rolesDropDown.length
        ) {
            this.roleAllSelected.select();
        }
        this.getSelectedRolesList();
    }

    onChangeColor(value) {
        this.kycForm.get('formBgColor').setValue(value);
        this.formBgColor = value;
    }

    UpsertKyc(isDraft) {
        this.isAnyOperationInProgress = true;
        const performanceConfig = new KycConfigurationModel();
        performanceConfig.clientKycName = this.kycForm.get("formName").value;
        performanceConfig.formBgColor = this.kycForm.get("formBgColor").value;
        performanceConfig.selectedRoleIds = this.kycForm.get("selectedRoles").value;
        // performanceConfig.selectedLegalEntityIds = this.kycForm.get("selectedLegalEntities").value;
        // performanceConfig.clientTypeId = this.kycForm.get("clientType").value;
        // performanceConfig.legalEntityTypeId = this.kycForm.get("legalEntityTypeId").value;
        performanceConfig.formJson = JSON.stringify(this.formJson);
        performanceConfig.isArchived = false;
        performanceConfig.isFromApp = true;
        performanceConfig.isDraft = isDraft;
        if (this.timeStamp) {
            performanceConfig.timeStamp = this.timeStamp;
        }
        performanceConfig.clientKycId = this.configurationId;
        this.dashboardService.UpsertClientKycConfiguration(performanceConfig).subscribe((result: any) => {
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
        const performance = new KYCModel();
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
        const performance = new KYCModel();
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

    toggleAllRoleSelectedSelected() {
        let rolesDropDown = this.rolesDropDown;
        if (this.roleAllSelected.selected) {
            this.kycForm.controls.selectedRoles.patchValue([
                ...rolesDropDown.map((item) => item.roleId),
                0
            ]);

        } else {
            this.kycForm.controls.selectedRoles.patchValue([]);
        }
        this.getSelectedRolesList();
    }

    toggleRolePerOne(selected) {
        let legalEntityList = this.rolesDropDown;
        if (this.roleAllSelected.selected) {
            this.roleAllSelected.deselect();
            this.getSelectedRolesList();
            return false;
        }
        if (
            this.kycForm.controls.selectedRoles.value.length ===
            legalEntityList.length
        ) {
            this.roleAllSelected.select();
        }
        this.getSelectedRolesList();
    }

    getSelectedRolesList() {
        const templateIds = this.kycForm.value.selectedRoles;
        if (templateIds && templateIds.length > 0) {
            const index = templateIds.indexOf(0);
            if (index > -1) {
                templateIds.splice(index, 1);
            }
            this.selectedLegalIds = templateIds;
            var legalEntityList = this.rolesDropDown;
            if (templateIds && legalEntityList && legalEntityList.length > 0) {
                var contractTemplates = _.filter(legalEntityList, function (status) {
                    return templateIds.toString().includes(status.roleId);
                })
                this.selectedRoleNames = contractTemplates.map(x => x.roleName).toString();
                this.cdRef.detectChanges();
            }
        }
        else {
            this.selectedRoleNames = null;
        }
    }

    compareSelectedRolesFn(legalEntities, selectedLegalEntities) {
        if (legalEntities == selectedLegalEntities) {
            return true;
        } else {
            return false;
        }
    }

    keyPressAlphabets(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (event.target.selectionStart === 0 && event.code === 'Space') {
            event.preventDefault();
            return false;
        } else {
            if (/[a-zA-Z\s]/.test(inp)) {
                return true;
            } else {
                event.preventDefault();
                return false;
            }
        }
    }

}
