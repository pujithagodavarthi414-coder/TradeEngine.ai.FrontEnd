import { Component, Input, ChangeDetectorRef, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { WorkFlowTriggerDialogComponent } from './workflow-trigger-dialog.component';
import { WorkflowTrigger } from '../../models/workflow-trigger.model';
import { WorkFlowTriggerService } from '../../services/workflow-trigger.service';

@Component({
    selector: 'workflow-triggger',
    templateUrl: './workflow-trigger.component.html'
})

export class WorkFlowTriggerComponent {
    @ViewChildren('deleteWorkflowTriggerPopover') deleteWorkflowTriggersPopover;

    @Input("referenceId")
    set _referenceId(data: string) {
        if (data) {
            this.referenceId = data;
            this.getWorkflowTriggersByReferenceId(this.referenceId);
        }
    }

    @Input("referenceTypeId")
    set _referenceTypeId(data: string) {
        if (data) {
            this.referenceTypeId = data;
        }
    }

    title = 'Angular/BPMN';
    modeler;
    fileToUpload: File = null;
    workflowTriggerId: string;
    workflowId: string;
    workflowTypeId: string;
    workFlowName: string;
    referenceId: string;
    referenceTypeId: string;
    validationMessage: string;
    triggerType: string;
    searchText: string;
    workFlowType: any;
    triggerItems = [];
    workFlowItems = [];
    filterConfigurations = [];
    deleteTriggerModel: WorkflowTrigger;
    workflowEdit: boolean = false;
    disableWorkFlow: boolean = false;
    triggerError: boolean = false;
    workFlowError: boolean = false;
    workFlowNameError: boolean = false;
    workFlowNameSizeError: boolean = false;
    isAnyOperationIsInprogress: boolean = false;
    disableDeleteWorkflowTrigger: boolean = false;
    workflowXml: any;

    constructor(private workFlowTriggerService: WorkFlowTriggerService, private toastr: ToastrService, private dialog: MatDialog, private cdRef: ChangeDetectorRef) { }

    getWorkflowTriggersByReferenceId(referenceId) {
        this.isAnyOperationIsInprogress = true;
        let triggerModel = new WorkflowTrigger();
        triggerModel.referenceId = referenceId;
        triggerModel.isArchived = false;
        this.workFlowTriggerService.getWorkflowsByReferenceId(triggerModel).subscribe((responseData: any) => {
            let success = responseData.success;
            if (success) {
                this.isAnyOperationIsInprogress = false;
                this.workFlowItems = responseData.data;
                this.filterConfigurations = responseData.data;
                this.cdRef.markForCheck();
            } else {
                this.isAnyOperationIsInprogress = false;
                this.validationMessage = responseData.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
                this.cdRef.markForCheck();
            }
        });
    }

    addWorkflowTrigger() {
        const dialogRef = this.dialog.open(WorkFlowTriggerDialogComponent, {
            height: "84%",
            width: "90%",
            direction: 'ltr',
            data: { workflowEdit: false, workflowTriggerId: null, referenceId: this.referenceId, referenceTypeId: this.referenceTypeId, triggerId: null, workflowId: null, workflowName: null, workflowXml: null },
            disableClose: true
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.success) {
                this.getWorkflowTriggersByReferenceId(this.referenceId);
            }
            this.cdRef.markForCheck();
        });
    }

    editWorkflowTrigger(row) {
        const dialogRef = this.dialog.open(WorkFlowTriggerDialogComponent, {
            height: "84%",
            width: "90%",
            direction: 'ltr',
            data: { workflowEdit: true, workflowTriggerId: row.workflowTriggerId, referenceId: this.referenceId, referenceTypeId: this.referenceTypeId, triggerId: row.triggerId, workflowId: row.workflowId, workflowName: row.workflowName, workflowXml: row.workflowXml },
            disableClose: true
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.success) {
                this.getWorkflowTriggersByReferenceId(this.referenceId);
            }
            this.cdRef.markForCheck();
        });
    }

    deleteWorkFlowTrigger(row, deleteWorkflowTriggerPopover) {
        deleteWorkflowTriggerPopover.openPopover();
        this.deleteTriggerModel = new WorkflowTrigger();
        this.deleteTriggerModel.workflowTriggerId = row.workflowTriggerId;
        this.deleteTriggerModel.referenceId = row.referenceId;
        this.deleteTriggerModel.referenceTypeId = row.referenceTypeId;
        this.deleteTriggerModel.triggerId = row.triggerId;
        this.deleteTriggerModel.triggerName = row.triggerName;
        this.deleteTriggerModel.workflowId = row.workflowId;
        this.deleteTriggerModel.workflowName = row.workflowName;
        this.deleteTriggerModel.workflowXml = row.workflowXml;
        this.deleteTriggerModel.isArchived = true;
    }

    removeWorkflowTrigger() {
        this.disableDeleteWorkflowTrigger = true;
        this.workFlowTriggerService.upsertWorkflowTrigger(this.deleteTriggerModel).subscribe((responseData: any) => {
            let success = responseData.success;
            if (success) {
                this.disableDeleteWorkflowTrigger = false;
                this.closeDeleteWorkflowTriggerPopup();
                this.getWorkflowTriggersByReferenceId(this.referenceId);
            } else {
                this.disableDeleteWorkflowTrigger = false;
                this.validationMessage = responseData.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
                this.cdRef.markForCheck();
            }
        });
    }

    closeSearch() {
        this.filterByName(null);
    }

    closeDeleteWorkflowTriggerPopup() {
        this.deleteWorkflowTriggersPopover.forEach((p) => p.closePopover());
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }
        let temp = this.filterConfigurations.filter(config => config.triggerName.toLowerCase().indexOf(this.searchText) > -1 ||
            config.workflowName.toLowerCase().indexOf(this.searchText) > -1);
        this.workFlowItems = temp;
    }
}