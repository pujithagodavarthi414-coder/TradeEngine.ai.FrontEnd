import { Component, OnInit, Inject, Input } from '@angular/core';
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


import { GenericFormService } from '../services/generic-form.service';

import { CustomApplicationWorkflowModel } from '../models/custom-application-workflow';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ConstantVariables } from '../../../../globaldependencies/constants/constant-variables';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'workflow-bpmn',
    templateUrl: './workflow-bpmn.component.html'
})

export class WorkFlowBpmnComponent implements OnInit {

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            this.workflowEdit = this.matData.editBpmnWorkflow;
            this.workflowXml = this.matData.editBpmnWorkflowXml;
            this.customApplicationId = this.matData.customApplicationId;
            this.workflowId = this.matData.workflowId;
            this.workflowName = this.matData.editBpmnWorkflowName;
            this.workflowTrigger = this.matData.editWorkflowTrigger;
            this.workflowTypeId = this.matData.workflowTypeId;
            this.currentDialogId = this.matData.formPhysicalId;
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

    constructor(private genericFormService: GenericFormService, private toastr: ToastrService, public dialogRef: MatDialogRef<WorkFlowBpmnComponent>, @Inject(MAT_DIALOG_DATA) private data: any, public dialog: MatDialog,
    private translateService: TranslateService) {
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

        this.workflowModelerForm.patchValue({
            workflowName: this.workflowName
        });
        this.workflowModelerForm.patchValue({
            workflowTrigger: this.workflowTrigger
        });
    }

    initializeWorkflowModelerForm() {
        this.workflowModelerForm = new FormGroup({
            workflowName: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            workflowTrigger: new FormControl("")
        });

    }

    loadDmn() {
        this.dmnViewer = new DmnModeler({
            width: '100%',
            height: '600px',
            keyboard: {
                bindTo: window
            },
            drd: {
                propertiesPanel: {
                    parent: '#properties'
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
            container: '#canvas'
        });

    }

    loadBpmn() {
        this.modeler = new Modeler({
            container: '#canvas',
            width: '100%',
            height: '600px',
            propertiesPanel: {
                parent: '#properties'
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
        let workflow = new CustomApplicationWorkflowModel();
        workflow.isPublished = isPublished;
        workflow.customApplicationWorkflowTypeId = this.workflowTypeId;
        workflow.customApplicationId = this.customApplicationId;
        workflow.customApplicationWorkflowId = this.workflowId;
        workflow.workflowName = this.workflowModelerForm.get("workflowName").value;
        workflow.workflowTrigger = this.workflowModelerForm.get("workflowTrigger").value;
        workflow.workflowFileName = this.workflowTypeId == this.workflowType4Id ? ".dmn" : ".bpmn";
        workflow.workflowXml = xml;

        this.genericFormService.upsertCustomApplicationWorkflow(workflow).subscribe((responseData: any) => {
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
}
