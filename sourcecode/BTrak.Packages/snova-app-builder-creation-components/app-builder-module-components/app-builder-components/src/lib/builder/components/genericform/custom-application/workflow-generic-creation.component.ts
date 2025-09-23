import { Component, OnInit, Inject, Input, ViewChild, TemplateRef } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import * as Modeler from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import * as camundaModdleExtension from 'camunda-bpmn-moddle/lib';
import * as bpmnpropertiesPanelModule from 'bpmn-js-properties-panel';
import * as bpmnpropertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import bpmnModdeler from './bpmn-moddeler';

import dmnModdeler from './dmn-moddeler';
import DmnModeler from 'dmn-js/dist/dmn-modeler.development.js';
import propertiesPanelModule from 'dmn-js-properties-panel';
import propertiesProviderModule from 'dmn-js-properties-panel/lib/provider/camunda';
import drdAdapterModule from 'dmn-js-properties-panel/lib/adapter/drd';
import { CustomAppBaseComponent } from '../../../../globaldependencies/components/componentbase';

import { GenericFormService } from '../services/generic-form.service';

import { CustomApplicationWorkflowModel } from '../models/custom-application-workflow';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ConstantVariables } from '../../../../globaldependencies/constants/constant-variables';
import { TranslateService } from '@ngx-translate/core';
import { WorkflowTrigger } from '../../../models/workflow-trigger.model';

@Component({
    selector: 'workflow-generic-bpmn',
    templateUrl: './workflow-generic-creation.component.html'
})

export class WorkFlowGenericCreationComponent extends CustomAppBaseComponent implements OnInit {

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            this.workflowEdit = this.matData.editBpmnWorkflow;
            this.workflowXml = this.matData.editBpmnWorkflowXml;
            this.workflowId = this.matData.workflowId;
            this.workflowName = this.matData.editBpmnWorkflowName;
            //this.workflowTrigger = this.matData.editWorkflowTrigger;
            this.workflowTypeId = this.matData.workflowTypeId;
            this.workflowTriggerId = data[0].workflowTriggerId;
            this.referenceId = data[0].referenceId;
            this.referenceTypeId = data[0].referenceTypeId;
            this.currentDialogId = this.matData.formPhysicalId;
            this.triggerType = this.matData.triggerId;
            this.canvasId = this.matData.canvasId == null || this.matData.canvasId == undefined ? 'canvas' : this.matData.canvasId;
            this.propertiesId = this.matData.propertiesId == null || this.matData.propertiesId == undefined ? 'properties' : this.matData.propertiesId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        }
    }
    title = 'Angular/BPMN';
    modeler: Modeler;
    dmnViewer: any;
    fileToUpload: File = null;
    fileNameToUpload: string;
    customApplicationId: string;
    workflowId: string;
    workflowTypeId: string;
    validationMessage: string;
    workflowEdit: boolean = false;
    disableWorkFlow: boolean = false;
    workflowXml: any;
    workflowName: string;
    workflowTrigger: string;
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    referenceTypeId:any;
    workflowTriggerId: any;
    referenceId: any;
    workFlowName: any;
    triggerType: any;
    canvasId: string = 'canvas';
    propertiesId: string = 'properties';
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
    </bpmn:definitions>`;
    loadInitialDmn: any = `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/" xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/" id="Definitions_0j8531k" name="DRD" namespace="http://camunda.org/schema/1.0/dmn">
      <decision id="Decision_08r27kj" name="Decision 1">
        <decisionTable id="DecisionTable_10rmnp0">
          <input id="Input_1">
            <inputExpression id="InputExpression_1" typeRef="string">
              <text></text>
            </inputExpression>
          </input>
          <output id="Output_1" typeRef="string" />
        </decisionTable>
      </decision>
      <dmndi:DMNDI>
        <dmndi:DMNDiagram>
          <dmndi:DMNShape dmnElementRef="Decision_08r27kj">
            <dc:Bounds height="80" width="180" x="100" y="100" />
          </dmndi:DMNShape>
        </dmndi:DMNDiagram>
      </dmndi:DMNDI>
    </definitions>`;
    workflowModelerForm: FormGroup;
    workflowType3Id: string = ConstantVariables.WorkflowType3Id;
    workflowType4Id: string = ConstantVariables.WorkflowType4Id;
    @ViewChild("workflowBpmnComponent") workflowBpmnComponent: TemplateRef<any>;
    constructor(private genericFormService: GenericFormService, private toastr: ToastrService, public dialogRef: MatDialogRef<WorkFlowGenericCreationComponent>, @Inject(MAT_DIALOG_DATA) private data: any, public dialog: MatDialog,
    private translateService: TranslateService) {
        super();
        // this.workflowEdit = this.data.editBpmnWorkflow;
        // this.workflowXml = this.data.editBpmnWorkflowXml;
        // this.customApplicationId = this.data.customApplicationId;
        // this.workflowId = this.data.workflowId;
        // this.workflowName = this.data.editBpmnWorkflowName;
        // this.workflowTrigger = this.data.editWorkflowTrigger;
        // this.workflowTypeId = this.data.workflowTypeId;
    }

    ngOnInit(): void {
        this.initializeWorkflowModelerForm();

        this.workflowModelerForm.patchValue({
            workflowName: this.workflowName
        });
        // this.workflowModelerForm.patchValue({
        //     workflowTrigger: this.workflowTrigger
        // });
    }

    ngAfterViewInit() {
        this.loadWorkFlow();
    }


    loadWorkFlow() {
        if (this.workflowTypeId == this.workflowType3Id) {
            this.loadBpmn();
        } else if (this.workflowTypeId == this.workflowType4Id) {
            this.loadDmn();
        }
         if (this.workflowEdit)
            this.load(this.workflowXml);
        else if (this.workflowTypeId == this.workflowType3Id) {
            this.load(this.loadInitialXml);
        }
        else if (this.workflowTypeId == this.workflowType4Id) {
            this.load(this.loadInitialDmn);
        }
    }

    initializeWorkflowModelerForm() {
        this.workflowModelerForm = new FormGroup({
            workflowName: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            )
            //workflowTrigger: new FormControl("")
        });

    }

    loadDmn() {
        let canvasId = '#'+ this.canvasId;
        let propertiesId = '#' + this.propertiesId;
        this.dmnViewer = new DmnModeler({
            width: '100%',
            height: '600px',
            keyboard: {
                bindTo: window
            },
            drd: {
                propertiesPanel: {
                    parent: propertiesId
                },
                additionalModules: [
                    propertiesPanelModule,
                    propertiesProviderModule,
                    drdAdapterModule
                ]
            },
            moddleExtensions: {
                camunda: dmnModdeler
            },
            container: canvasId
        });

    }

    loadBpmn() {
        let canvasId = '#'+ this.canvasId;
        let propertiesId = '#' + this.propertiesId;
        this.modeler = new Modeler({
            container: canvasId,
            width: '100%',
            height: '600px',
            propertiesPanel: {
                parent: propertiesId
            },
            keyboard: {
                bindTo: window
            },
            additionalModules: [
                bpmnpropertiesPanelModule,
                bpmnpropertiesProviderModule,
                camundaModdleExtension
            ],
            moddleExtensions: {
                camunda: bpmnModdeler
            }
        });

    }

    handleError(err: any) {
        if (err) {
            console.warn('Ups, error: ', err);
        }
    }

    async load(xml): Promise<void> {

        if (this.workflowTypeId == this.workflowType3Id) {
            if (xml == null)
                await this.modeler.importXML(this.loadInitialXml, this.handleError);
            else {
                await this.modeler.importXML(xml, this.handleError);
            }
        } else if (this.workflowTypeId == this.workflowType4Id) {

            if (xml == null)
                await this.dmnViewer.importXML(this.loadInitialDmn, this.handleError);
            else {
                await this.dmnViewer.importXML(xml, this.handleError);
            }
        }

    }

    async save(isPublish): Promise<void> {
        this.disableWorkFlow = true;

        if (this.workflowTypeId == this.workflowType3Id) {
            await this.modeler.saveXML((err: any, xml: any) => {
                console.log(err);
                this.saveXml(xml,isPublish);
            });

        } else if (this.workflowTypeId == this.workflowType4Id) {
            await this.dmnViewer.saveXML((err: any, xml: any) => {
                console.log(err);
                this.saveXml(xml,isPublish);
            });
        }
    }



    saveXml(xml,isPublished) {

        let triggerModel = new WorkflowTrigger();
        triggerModel.workflowTriggerId = (this.workflowTriggerId == null || this.workflowTriggerId == undefined) ? null : this.workflowTriggerId;
        triggerModel.referenceId = this.referenceId;
        triggerModel.referenceTypeId = this.referenceTypeId;
        //triggerModel.triggerName = this.workflowModelerForm.get("workflowTrigger").value;
        triggerModel.workflowId = this.workflowId;
        triggerModel.workflowName = this.workflowModelerForm.get("workflowName").value;
        triggerModel.workflowXml = xml;
        triggerModel.isArchived = false;
        triggerModel.workFlowTypeId = this.workflowTypeId;

        this.genericFormService.upsertWorkflowTrigger(triggerModel).subscribe((responseData: any) => {
            let success = responseData.success;
            if (success) {
                //     this.getWorkflowByCustomApplicationId();
                //     this.loadWorkflowType = false;
                //     this.initializeWorkFlowTypeForm();
                this.disableWorkFlow = false;
                this.currentDialog.close({ data: 'success' });
            } else {
                this.validationMessage = responseData.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
                this.disableWorkFlow = false;
            }
            // this.savingWorkflowInProgress = false;
        });
    }

    closeDialog() {
        this.currentDialog.close();
    }

    handleFileInput(files: FileList) {

        this.fileToUpload = files.item(0);
        const parts = this.fileToUpload.name.split(".");
        const fileExtension = parts.pop();

        if(this.workflowTypeId == this.workflowType3Id && fileExtension == 'dmn') {
            this.toastr.warning("", this.translateService.instant('STOREMANAGAMENT.INVALIDFILE'));
            return null;
        } else if(this.workflowTypeId == this.workflowType4Id && fileExtension == 'bpmn') {
            this.toastr.warning("", this.translateService.instant('STOREMANAGAMENT.INVALIDFILE'));
            return null;
        }

        var file = new FormData();
        file.append("file", files.item(0));

        this.genericFormService.UploadFile(file).subscribe(async (responseData: any) => {

            if (this.workflowTypeId == this.workflowType3Id) {
                await this.modeler.importXML(responseData, this.handleError);
            } else if (this.workflowTypeId == this.workflowType4Id) {
                await this.dmnViewer.importXML(responseData, this.handleError);
            }

        });
    }

    async downloadXml() {
        this.disableWorkFlow = true;
        if (this.workflowTypeId == this.workflowType3Id) {
            await this.modeler.saveXML((err: any, xml: any) => {
                console.log(err);
                const linkSource1 = 'data:' + 'text/xml;charset=utf-8,' + encodeURIComponent(xml);
                const downloadLink = document.createElement("a");
                downloadLink.href = linkSource1;
                downloadLink.download = 'bpmn-diagram';
                downloadLink.click();
                this.disableWorkFlow = false;
            });
        } else if (this.workflowTypeId == this.workflowType4Id) {
            await this.dmnViewer.saveXML((err: any, xml: any) => {
                console.log(err);
                const linkSource1 = 'data:' + 'text/xml;charset=utf-8,' + encodeURIComponent(xml);
                const downloadLink = document.createElement("a");
                downloadLink.href = linkSource1;
                downloadLink.download = "dmn-diagram";
                downloadLink.click();
                this.disableWorkFlow = false;
            });
        }

    }

    OpenDmn() {
        let formId: string = "workflow-dmn-dialog";
        const dialogRef = this.dialog.open(this.workflowBpmnComponent, {
            height: "100vh",
            width: "100vw",
            maxWidth: "100vw",
            maxHeight: "100vh",
            hasBackdrop: true,
            direction: "ltr",
            id: formId,
            data: {
                editBpmnWorkflow: false,
                editBpmnWorkflowXml: null,
                editBpmnWorkflowName: null,
                //editWorkflowTrigger: this.workflowTrigger,
                workflowId: null,
                workflowTypeId: ConstantVariables.WorkflowType4Id,
                workflowEdit: false, workflowTriggerId: null, referenceId: this.referenceId,
                referenceTypeId: null,
                formPhysicalId: formId,
                canvasId: 'dmnCanvas',
                propertiesId: 'dmnProperties'
            },
            disableClose: true,
            panelClass: "custom-modal-box"
        });
    }
}
