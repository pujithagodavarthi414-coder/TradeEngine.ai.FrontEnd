import { Component, EventEmitter, Inject, Input, OnInit, Output, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SatPopover } from '@ncstate/sat-popover';
import { ToastrService } from 'ngx-toastr';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { SoftLabelConfigurationModel } from '../../models/softlabels.model';
import { WorkflowTrigger } from '../../models/workflow-trigger.model';
import { SoftLabelPipe } from '../../pipes/softlabels.pipes';
import { GenericStatusService } from '../../services/generic-status.service';
import { GenericStatusModel } from '../genericform/models/generic-status-model';
import { GenericFormService } from '../genericForm/services/generic-form.service';

@Component({
    selector: 'workflow-selection',
    templateUrl: './workflow-selection.component.html'
})

export class WorkFlowSelectionComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChildren("workflowTypePopover") workflowTypesPopover;
    @ViewChild("addWorkflow") addWorkflowPopup: SatPopover;
    @ViewChild("workflowBpmnComponent") workflowBpmnComponent: TemplateRef<any>;

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            this.referenceId = this.matData.referenceId;
            this.referenceTypeId = this.matData.referenceTypeId;
            this.auditDefaultWorkflowId = this.matData.auditDefaultWorkflowId;
            this.conductDefaultWorkflowId = this.matData.conductDefaultWorkflowId;
            this.questionDefaultWorkflowId = this.matData.questionDefaultWorkflowId;
        }
    }

    @Output() workflowSelected = new EventEmitter<any>();
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
    worflowGridSpinner = true;
    workFlowDataList: any = [];
    dmnDataList: any = [];
    referenceId: string;
    referenceTypeId: any;
    selected = [];
    referenceSelectedWorkflowId: any;
    auditDefaultWorkflowId: any;
    conductDefaultWorkflowId: any;
    questionDefaultWorkflowId: any;
    softLabels: SoftLabelConfigurationModel[];
    constructor(public dialogRef: MatDialogRef<WorkFlowSelectionComponent>, @Inject(MAT_DIALOG_DATA) private data: any,
        private toastr: ToastrService, private genericFormService: GenericFormService, public dialog: MatDialog, private genericStatusSerive: GenericStatusService, private softLabelsPipe: SoftLabelPipe) {
        super();
        this.getSoftLabelConfigurations();
    }

    ngOnInit() {
        this.initializeWorkFlowTypeForm();
        if (this.referenceId)
            this.loadGenericStatus();
        else
            this.getWorkflows();
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
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

    onSelect(event) {
        this.selected = event.selected;
    }

    getChosenWorkFlow(event) { }

    getWorkflows() {
        //Get workflows based on reference
        let triggerModel = new WorkflowTrigger();
        triggerModel.isArchived = false;
        this.genericFormService.getWorkflowsForTriggers(triggerModel).subscribe((responseData: any) => {
            let success = responseData.success;
            if (success) {
                //this.workFlowDataList = responseData.data;
                if (this.referenceSelectedWorkflowId) {
                    this.selected = responseData.data.filter(x => x.workflowId.toLowerCase() == this.referenceSelectedWorkflowId.toLowerCase());
                }
                this.dmnDataList = responseData.data.filter(x => (x.workFlowTypeId && x.workFlowTypeId.toLowerCase() == ConstantVariables.WorkflowType4Id.toLowerCase()));
                this.workFlowDataList = responseData.data.filter(x => (!x.workFlowTypeId || x.workFlowTypeId && x.workFlowTypeId.toLowerCase() == ConstantVariables.WorkflowType3Id.toLowerCase()));
            } else {
                this.toastr.error("", responseData.apiResponseMessages[0].message);
            }
        });
    }

    selectWorkFlow() {
        this.workflowSelected.emit({selcted: this.selected, auditDefaultWorkflowId: this.auditDefaultWorkflowId, 
        conductDefaultWorkflowId: this.conductDefaultWorkflowId, questionDefaultWorkflowId: this.questionDefaultWorkflowId});
        this.currentDialog.close();
    }

    addWorkFlowType() {
        this.loadWorkflowType = true;
        this.closeWorkFlowTypeDialog();
        this.makeEditOff(this.workflowType3Id);
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
        this.editBpmnWorkflowId = data.workflowId;
        this.createWorkflowDialog(data.workFlowTypeId);
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
                workflowId: this.editBpmnWorkflow == false ? null : this.editBpmnWorkflowId,
                workflowTypeId: workflowId,
                workflowEdit: false, workflowTriggerId: null, referenceId: this.referenceId,
                referenceTypeId: null, triggerId: null, workflowName: null,
                formPhysicalId: formId
            },
            disableClose: true,
            panelClass: "custom-modal-box"
        });
        dialogRef.afterClosed().subscribe((response) => {
            if (response && response.data == "success") {
                this.getWorkflows();
            }
            this.editBpmnWorkflow = false;
            this.editBpmnWorkflowXml = null;
            this.editBpmnWorkflowId = null;
        });
    }

    loadGenericStatus() {
        let statusModel = new GenericStatusModel();
        statusModel.referenceId = this.referenceId;
        statusModel.referenceTypeId = this.referenceTypeId;
        this.genericStatusSerive.loadGenericStatus(statusModel)
            .subscribe((res: any) => {
                if (res.success && res.data.length > 0) {
                    this.referenceSelectedWorkflowId = res.data[0].workFlowId;
                    this.referenceTypeId = this.referenceTypeId ? this.referenceTypeId : res.data[0].referenceTypeId;
                }
                this.getWorkflows();
            });
    }

    changeAuditDefaultWorkflow(audit) {
        if(this.auditDefaultWorkflowId && audit.workflowId.toLowerCase() == this.auditDefaultWorkflowId.toLowerCase())  {
            this.auditDefaultWorkflowId = null;
        } else {
            this.auditDefaultWorkflowId = audit.workflowId;
        }
    }

    checkAudit(audit) {
        if(this.auditDefaultWorkflowId && audit.workflowId.toLowerCase() == this.auditDefaultWorkflowId.toLowerCase()) {
                return true;
        } else {
            return false;
        }
    }
    checkConduct(conduct) {
        if(this.conductDefaultWorkflowId && conduct.workflowId.toLowerCase() == this.conductDefaultWorkflowId.toLowerCase()) {
                return true;
        } else {
            return false;
        }
    }
    checkQuestion(question) {
        if(this.questionDefaultWorkflowId && question.workflowId.toLowerCase() == this.questionDefaultWorkflowId.toLowerCase()) {
                return true;
        } else {
            return false;
        }
    }
    changeConductDefaultWorkflow(conduct) {
        if(this.conductDefaultWorkflowId && conduct.workflowId.toLowerCase() == this.conductDefaultWorkflowId.toLowerCase())  {
            this.conductDefaultWorkflowId = null;
        } else {
            this.conductDefaultWorkflowId = conduct.workflowId;
        }
    }

    changeQuestionDefaultWorkflow(question) {
        if(this.questionDefaultWorkflowId && question.workflowId.toLowerCase() == this.questionDefaultWorkflowId.toLowerCase())  {
            this.questionDefaultWorkflowId = null;
        } else {
            this.questionDefaultWorkflowId = question.workflowId;
        }
    }
}