import { Component, Inject, Input, OnInit, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SatPopover } from '@ncstate/sat-popover';
import { ToastrService } from 'ngx-toastr';
import { GenericFormService } from '../../../components/genericform/services/generic-form.service';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { ConstantVariables } from '../../dependencies/constants/constant-variables';

@Component({
    selector: 'workflow-selection',
    templateUrl: './workflow-selection.component.html'
})

export class WorkFlowSelectionComponent implements OnInit {

    @ViewChildren("workflowTypePopover") workflowTypesPopover;
    @ViewChild("addWorkflow") addWorkflowPopup: SatPopover;
    @ViewChild("workflowBpmnComponent") workflowBpmnComponent: TemplateRef<any>;

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            this.workFlowDataList = this.matData.workFlowDataList;
        }
    }
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    selectedWorkflowType: any;
    loadWorkflowType = false;
    validationMessage: string;
    addingWorkflow: boolean;
    workflowTypes = [];
    editBpmnWorkflowId: any;
    editBpmnWorkflowXml: any;
    editBpmnWorkflowName: string;
    editBpmnWorkflow = false;
    workflowType3Id = ConstantVariables.WorkflowType3Id;
    workflowType4Id = ConstantVariables.WorkflowType4Id;
    editWorkflowTrigger: string;
    triggerItems = [];
    workFlowItems = [];
    workFlowType: any;
    workflowId: string;
    workFlowDataList: any;
    constructor(public dialogRef: MatDialogRef<WorkFlowSelectionComponent>, @Inject(MAT_DIALOG_DATA) private data: any,
    private toastr: ToastrService, private genericFormService: GenericFormService, public dialog: MatDialog) {
    }

    ngOnInit() {
        this.initializeWorkFlowTypeForm();
    }

    checkStatusDisabled() {
        if (this.selectedWorkflowType.value) {
            return false;
        } else {
            return true;
        }
    }

    onNoClick(): void {
        this.currentDialog.close();
    }

    initializeWorkFlowTypeForm() {
        this.selectedWorkflowType = new FormControl("", []);
    }

    selectedMatTab(event) {
    }

    getChosenWorkFlow(event) {}

    addWorkFlowType(value) {
        this.loadWorkflowType = true;
        this.closeWorkFlowTypeDialog();
        if (value == this.workflowType3Id) {
            this.makeEditOff(this.workflowType3Id);
        } else if (value == this.workflowType4Id) {
            this.makeEditOff(this.workflowType4Id);
        }
    }

    createWorkflowPopup(addWorkflowPopover) {
        this.initializeWorkFlowTypeForm();
        this.loadWorkflowTypes();
        addWorkflowPopover.openPopover();
        this.addingWorkflow = false;
    }

    loadWorkflowTypes() {
        this.genericFormService.getCustomApplicationWorkflowTypes().subscribe((response: any) => {
            if (response.success) {
                this.workflowTypes = response.data;
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
        })
    }

    closeWorkFlowTypeDialog() {
        this.workflowTypesPopover.forEach(p => p.closePopover());
        this.editBpmnWorkflow = false;
        this.editBpmnWorkflowXml = null;
        this.editBpmnWorkflowName = null;
        this.editWorkflowTrigger = null;
        this.editBpmnWorkflowId = null;
    }

    makeEditOff(workflowId) {
        this.editBpmnWorkflow = false;
        this.editBpmnWorkflowXml = null;
        this.editBpmnWorkflowId = null;
        this.editBpmnWorkflowName = null;
        this.editWorkflowTrigger = null;
        this.createWorkflowDialog(workflowId);
    }

    editBpmnWorkflowData(data) {
        this.editBpmnWorkflow = true;
        this.editBpmnWorkflowXml = data.workflowXml == null ? null : data.workflowXml;
        this.editBpmnWorkflowName = data.workflowName == null ? null : data.workflowName;
        this.editWorkflowTrigger = data.workflowTrigger == null ? null : data.workflowTrigger;
        this.editBpmnWorkflowId = data.customApplicationWorkflowId;
        this.createWorkflowDialog(data.customApplicationWorkflowTypeId);
    }

    createWorkflowDialog(workflowId) {
        let formId: string = "workflow-bpmn-dialog";
        const dialogRef = this.dialog.open(this.workflowBpmnComponent, {
            height: "100vh",
            width: "100vw",
            maxWidth: "100vw",
            maxHeight: "100vh",
            hasBackdrop: true,
            direction: "ltr",
            id: formId,
            data: {
                editBpmnWorkflow: this.editBpmnWorkflow,
                editBpmnWorkflowXml: this.editBpmnWorkflowXml,
                editBpmnWorkflowName: this.editBpmnWorkflowName,
                editWorkflowTrigger: this.editWorkflowTrigger,
               // customApplicationId: this.applicationId,
                workflowId: this.editBpmnWorkflow == false ? null : this.editBpmnWorkflowId,
                workflowTypeId: workflowId,
                formPhysicalId: formId
            },
            disableClose: true,
            panelClass: "custom-modal-box"
        });
        dialogRef.afterClosed().subscribe((response) => {
            if (response && response.data == "success") {
                //this.getWorkflowByCustomApplicationId();
            }
            this.editBpmnWorkflow = false;
            this.editBpmnWorkflowXml = null;
            this.editBpmnWorkflowId = null;
        });
    }
}