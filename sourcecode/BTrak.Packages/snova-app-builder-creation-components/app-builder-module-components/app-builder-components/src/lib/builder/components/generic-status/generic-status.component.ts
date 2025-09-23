import { ChangeDetectorRef, Input, OnInit, ViewChild, TemplateRef, Component, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {  MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { SatPopover } from '@ncstate/sat-popover';
import { Actions } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { WorkflowTrigger } from '../../models/workflow-trigger.model';
import { GenericStatusService } from '../../services/generic-status.service';
import { GenericStatusModel } from '../genericform/models/generic-status-model';
import { GenericFormService } from '../genericForm/services/generic-form.service';

@Component({
    selector: 'generic-status',
    templateUrl: './generic-status.component.html'
})

export class GenericStatusComponent  extends CustomAppBaseComponent implements OnInit {

    @Input("referenceId")
    set _referenceId(data: string) {
        this.referenceId = data;
        if (this.referenceId) {
        }
    }

    @Input("referenceTypeId")
    set _referenceTypeId(data: string) {
        this.referenceTypeId = data;
        if (this.referenceTypeId) {
        }
    }

     @Input("statusColor")
    set _statusColor(data: string) {
        this.statusColor = data;        
    }

     @Input("auditDefaultWorkflowId")
    set _auditDefaultWorkflowId(data) {
        this.auditDefaultWorkflowId = data;        
    }

    @Input("conductDefaultWorkflowId")
    set _conductDefaultWorkflowId(data: string) {
        this.conductDefaultWorkflowId = data;        
    }

    @Input("questionDefaultWorkflowId")
    set _questionDefaultWorkflowId(data: string) {
        this.questionDefaultWorkflowId = data;        
    }

    @Input("status")
    set _status(data: string) {
        if(data != null && data != undefined) {
            if(data == ConstantVariables.Draft || data == 'Draft') {
                this.status = this.translateService.instant(ConstantVariables.DraftStatus);
            } else if(data == ConstantVariables.Submitted) {
                this.status = this.translateService.instant(ConstantVariables.SubmittedStatus);
            } else if(data == ConstantVariables.SendFroApproved) {
                this.status = this.translateService.instant(ConstantVariables.SendForApprovalStatus);
            }else if(data == ConstantVariables.Approved) {
                this.status = this.translateService.instant(ConstantVariables.ApprovedStatus);
            } else {
                this.status = data;
            }
        }   else {
            this.status = this.translateService.instant(ConstantVariables.DraftStatus);
        }
             
    }


    @Input("referenceName")
    set _referenceName(data: string) {
        this.referenceName = data;
    }

    @ViewChild("workflowSelectionComponent") workflowSelectionComponent: TemplateRef<any>;
    @ViewChild("chooseWorkFlow") chooseWorkFlow: SatPopover;
    @Output()  workFlowSelected = new EventEmitter<any>();
    @Output()  refreshAudit = new EventEmitter<any>();
    auditDefaultWorkflowId: any;
    conductDefaultWorkflowId: any;
    questionDefaultWorkflowId: any;
    statusColor: any;
    referenceId: string;
    referenceTypeId: string;
    status: string;
    referenceName: string;
    workFlowItems = [];
    workflowId: any;
    workFlowType: any;
    anyOperationInProgress: boolean;
    loadingStatus: boolean;
    selectedWorkFlow: any;
        constructor(private toastr: ToastrService,private genericFormService: GenericFormService, 
            private translateService: TranslateService, private actionUpdates$: Actions, private routes: Router, private route: ActivatedRoute,
            public dialog: MatDialog, private cdRef: ChangeDetectorRef, private snackbar: MatSnackBar, private genericStatusSerive: GenericStatusService
            ) { super();
            super.ngOnInit(); }

        ngOnInit() {
            if(!this.referenceTypeId) {
                if(this.referenceName == 'Audits') {
                    this.referenceTypeId = ConstantVariables.AuditReferenceTypeId;
                } else if(this.referenceName == 'Conduct') {
                    this.referenceTypeId = ConstantVariables.ConductsReferenceTypeId;
                } else if(this.referenceName == 'AuditQuestion') {
                    this.referenceTypeId = ConstantVariables.AuditQuestionsReferenceTypeId;
                }
            }
        }

        getWorkflows() {
            //Get workflows based on reference
            let triggerModel = new WorkflowTrigger();
            triggerModel.isArchived = false;
            this.genericFormService.getWorkflowsForTriggers(triggerModel).subscribe((responseData: any) => {
                let success = responseData.success;
                if (success) {
                    this.workFlowItems = responseData.data;
                    this.cdRef.detectChanges();
                } else {
                    this.toastr.error("", responseData.apiResponseMessages[0].message);
                }
            });
        }


        openWokFlowDialog() {
            let formId: string = "workflow-selection";
            const dialogRef = this.dialog.open(this.workflowSelectionComponent, {
                minWidth: "80vw",
                maxHeight: "60vh",
                hasBackdrop: true,
                direction: "ltr",
                id: formId,
                data: {
                    referenceId: this.referenceId,
                    referenceTypeId: this.referenceTypeId,
                    auditDefaultWorkflowId: this.auditDefaultWorkflowId,
                    conductDefaultWorkflowId: this.conductDefaultWorkflowId,
                    questionDefaultWorkflowId: this.questionDefaultWorkflowId,
                    formPhysicalId: formId
                },
                disableClose: true,
                panelClass: "custom-modal-box"
            });
        }

        workflowSelected(data) {
            this.workflowId = data.selcted[0].workflowId;
            if(this.referenceId) {
                this.selectedWorkFlow = data.selcted[0];
                this.AddWorFlow(data);
            } else {
                this.workFlowSelected.emit({workFlow:data.selcted[0], referenceName: this.referenceName, data:data});
            }
            this.cdRef.detectChanges();
        }

        getChosenWorkFlow(value) {
            this.selectedWorkFlow = this.workFlowItems.find(i => i.workflowId.toLowerCase() == value.toLowerCase());
        }

        AddWorFlow(data) {
            this.anyOperationInProgress = true;
            let triggerModel = new WorkflowTrigger();
            triggerModel.referenceTypeId = this.referenceTypeId;
            triggerModel.workFlowTypeId = this.selectedWorkFlow.workFlowTypeId;
            triggerModel.referenceId = this.referenceId;
            triggerModel.workflowId = this.selectedWorkFlow.workflowId;
            triggerModel.workflowName = this.selectedWorkFlow.workflowName;
            triggerModel.workflowXml = this.selectedWorkFlow.workflowXml;
            triggerModel.auditDefaultWorkflowId = data ? data.auditDefaultWorkflowId : null;
            triggerModel.conductDefaultWorkflowId = data ? data.conductDefaultWorkflowId : null;
            triggerModel.questionDefaultWorkflowId = data ? data.questionDefaultWorkflowId : null;
            triggerModel.toSetDefaultWorkflows = true;
            this.genericFormService.upsertWorkflowTrigger(triggerModel)
                            .subscribe((res: any) => {
                                if (res.success) {
                                    this.auditDefaultWorkflowId = data ? data.auditDefaultWorkflowId : null;
                                    this.conductDefaultWorkflowId = data ? data.conductDefaultWorkflowId : null;
                                    this.questionDefaultWorkflowId = data ? data.questionDefaultWorkflowId : null;
                                    this.refreshAudit.emit({referenceId :this.referenceId, referenceName: this.referenceName});
                                    this.workFlowSelected.emit({workFlow:data.selcted[0], referenceName: this.referenceName, data:data});
                                    this.cdRef.markForCheck();
                                    this.chooseWorkFlow.close();
                                } else {
                                    this.toastr.error("", res.apiResponseMessages[0].message);
                                    this.cdRef.markForCheck();
                                }
                                this.anyOperationInProgress = false;
                            });                       
        }
}