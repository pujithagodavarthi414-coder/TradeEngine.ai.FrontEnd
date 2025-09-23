import { Component, OnInit, ChangeDetectorRef, Inject, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SatPopover } from '@ncstate/sat-popover';
import { WorkflowTrigger } from '../../models/workflow-trigger.model';
import { WorkFlowTriggerService } from '../../services/workflow-trigger.service';
import { CustomPropsProvider } from '../../props-provider/CustomPropsProvider';
import { CustomPaletteProvider } from '../../props-provider/CustomPaletteProvider';
import { InjectionNames, PropertiesPanelModule, OriginalPropertiesProvider, OriginalPaletteProvider, Modeler } from '../../bpmn-js/bpmn-js';

const customModdle = {
    name: "customModdle",
    uri: "http://example.com/custom-moddle",
    prefix: "custom",
    xml: {
        tagAlias: "lowerCase"
    },
    associations: [],
    types: [
        {
            "name": "ExtUserTask",
            "extends": [
                "bpmn:UserTask"
            ],
            "properties": [
                {
                    "name": "worklist",
                    "isAttr": true,
                    "type": "String"
                }
            ]
        },
    ]
};

@Component({
    selector: 'workflow-triggger-dialog',
    templateUrl: './workflow-trigger-dialog.component.html'
})

export class WorkFlowTriggerDialogComponent implements OnInit {
    @ViewChild("overRideWorkflowTrigger") overRideWorkflowsTrigger: SatPopover;

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
    workFlowType: any;
    triggerItems = [];
    workFlowItems = [];
    workflowEdit: boolean = false;
    disableWorkFlow: boolean = false;
    triggerError: boolean = false;
    workFlowError: boolean = false;
    workFlowNameError: boolean = false;
    workFlowNameSizeError: boolean = false;
    disableEditWorkflow: boolean = false;
    workflowXml: any;
    loadInitialXml: any = `<?xml version="1.0" encoding="UTF-8"?>
    <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" targetNamespace="http://bpmn.io/schema/bpmn" id="Definitions_1">
      <bpmn:process id="Process_1" isExecutable="false">
        <bpmn:startEvent id="StartEvent_1"/>
      </bpmn:process>
      <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
          <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
            <dc:Bounds height="36.0" width="36.0" x="173.0" y="102.0"/>
          </bpmndi:BPMNShape>
        </bpmndi:BPMNPlane>
      </bpmndi:BPMNDiagram>
    </bpmn:definitions>`
    

    constructor(private workFlowTriggerService: WorkFlowTriggerService, private toastr: ToastrService, public dialogRef: MatDialogRef<WorkFlowTriggerDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any, public dialog: MatDialog, private cdRef: ChangeDetectorRef) {
        this.workflowEdit = data.workflowEdit;
        this.workflowTriggerId = data.workflowTriggerId;
        this.referenceId = data.referenceId;
        this.referenceTypeId = data.referenceTypeId;
        this.triggerType = data.triggerId;
        this.workflowId = data.workflowId;
        this.workFlowName = data.workflowName;
        this.workflowXml = data.workflowXml;
        this.cdRef.markForCheck();
        this.getWorkflows();
        this.getTriggers();
    }

    ngOnInit(): void {
        this.loadBpmn();
        if (this.workflowEdit)
            this.load(this.workflowXml);
        else
            this.load(this.loadInitialXml);
    }

    loadBpmn() {
        this.modeler = new Modeler({
            container: '#canvas',
            width: '100%',
            height: '600px',
            additionalModules: [
                PropertiesPanelModule,

                // Re-use original bpmn-properties-module, see CustomPropsProvider
                { [InjectionNames.bpmnPropertiesProvider]: ['type', OriginalPropertiesProvider.propertiesProvider[1]] },
                { [InjectionNames.propertiesProvider]: ['type', CustomPropsProvider] },

                // Re-use original palette, see CustomPaletteProvider
                { [InjectionNames.originalPaletteProvider]: ['type', OriginalPaletteProvider] },
                { [InjectionNames.paletteProvider]: ['type', CustomPaletteProvider] },
            ],
            propertiesPanel: {
                parent: '#properties'
            },
            moddleExtension: {
                custom: customModdle
            }
        });
    }

    getTriggers() {
        let triggerModel = new WorkflowTrigger();
        triggerModel.isArchived = false;
        this.workFlowTriggerService.getTriggers(triggerModel).subscribe((responseData: any) => {
            let success = responseData.success;
            if (success) {
                this.triggerItems = responseData.data;
            } else {
                this.validationMessage = responseData.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
        });
    }

    getWorkflows() {
        let triggerModel = new WorkflowTrigger();
        triggerModel.isArchived = false;
        this.workFlowTriggerService.getWorkflowsForTriggers(triggerModel).subscribe((responseData: any) => {
            let success = responseData.success;
            if (success) {
                this.workFlowItems = responseData.data;
                if (this.workFlowItems && this.workFlowItems.length > 0 && this.workflowId) {
                    let index = this.workFlowItems.findIndex(x => x.workflowId.toLowerCase() == this.workflowId.toLowerCase());
                    if (index != -1) {
                        this.workFlowType = this.workFlowItems[index];
                        this.cdRef.markForCheck();
                    }
                }
            } else {
                this.validationMessage = responseData.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
        });
    }

    triggerChange(value) {
        if (value) {
            this.triggerError = false;
            this.cdRef.markForCheck();
        }
    }

    workflowChange(value) {
        this.workFlowName = value.workflowName;
        this.load(value.workflowXml);
        this.cdRef.markForCheck();
    }

    checkWorkflowName() {
        if (this.workFlowName != '' && this.workFlowName.trim() != '' && this.workFlowName != null && this.workFlowName != undefined) {
            this.workFlowNameError = false;
            this.cdRef.markForCheck();
        }
        else {
            this.workFlowNameError = true;
            this.cdRef.markForCheck();
        }
        if (this.workFlowName && this.workFlowName.length > 50) {
            this.workFlowNameSizeError = true;
            this.cdRef.markForCheck();
        }
        else {
            this.workFlowNameSizeError = false;
            this.cdRef.markForCheck();
        }
    }

    handleError(err: any) {
        if (err) {
            console.warn('Ups, error: ', err);
        }
    }

    load(xml): void {
        if (xml == null)
            this.modeler.importXML(this.loadInitialXml, this.handleError);
        else {
            this.modeler.importXML(xml, this.handleError);
        }
    }

    saveWorkflowTrigger(): void {
        if (this.triggerType == null || this.triggerType == undefined)
            this.triggerError = true;
        else
            this.triggerError = false;
        if (this.workFlowName == null || this.workFlowName.trim() == '' || this.workFlowName == undefined)
            this.workFlowNameError = true;
        else
            this.workFlowNameError = false;
        if (this.workFlowName && this.workFlowName.trim().length > 50)
            this.workFlowNameSizeError = true;
        else
            this.workFlowNameSizeError = false;
        if (!this.triggerError && !this.workFlowNameError && !this.workFlowNameSizeError) {
            if (this.workFlowType && this.workFlowType.workflowId) {
                this.overRideWorkflowsTrigger.open();
            }
            else {
                this.upsertWorkflowTrigger(null);
            }
        }
    }

    overRideWorkflow() {
        this.disableEditWorkflow = true;
        this.upsertWorkflowTrigger(this.workFlowType.workflowId);
    }

    preventOverRideWorkflow() {
        this.disableEditWorkflow = true;
        this.upsertWorkflowTrigger(null);
    }

    upsertWorkflowTrigger(workflowId) {
        this.disableWorkFlow = true;
        this.modeler.saveXML((err: any, xml: any) => {
            let triggerModel = new WorkflowTrigger();
            triggerModel.workflowTriggerId = (this.workflowTriggerId == null || this.workflowTriggerId == undefined) ? null : this.workflowTriggerId;
            triggerModel.referenceId = this.referenceId;
            triggerModel.referenceTypeId = this.referenceTypeId;
            triggerModel.triggerId = this.triggerType;
            triggerModel.workflowId = (workflowId == null || workflowId == undefined) ? null : workflowId;
            triggerModel.workflowName = this.workFlowName.trim();
            triggerModel.workflowXml = xml;
            triggerModel.isArchived = false;

            this.workFlowTriggerService.upsertWorkflowTrigger(triggerModel).subscribe((responseData: any) => {
                let success = responseData.success;
                if (success) {
                    this.disableWorkFlow = false;
                    this.disableEditWorkflow = false;
                    this.triggerType = null;
                    this.workFlowType = null;
                    this.workFlowName = null;
                    this.triggerError = false;
                    this.workFlowNameError = false;
                    this.workFlowNameSizeError = false;
                    this.load(this.loadInitialXml);
                    this.overRideWorkflowsTrigger.close();
                    this.dialogRef.close({ success: true });
                    this.cdRef.markForCheck();
                } else {
                    this.disableWorkFlow = false;
                    this.disableEditWorkflow = false;
                    this.validationMessage = responseData.apiResponseMessages[0].message;
                    this.toastr.error("", this.validationMessage);
                    this.cdRef.markForCheck();
                }
            });
        });
    }

    handleFileInput(files: FileList) {
      
        this.fileToUpload = files.item(0);
       
        var file = new FormData();
                        file.append("file", files.item(0));    
                     
    this.workFlowTriggerService.UploadFile(file).subscribe((responseData: any) => {
      
        this.modeler.importXML(responseData, this.handleError);
        
    });
    }

    closeDialog() {
        this.dialogRef.close({ success: null });
    }
}