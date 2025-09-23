import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input, ViewChild, QueryList, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { WorkFlow } from '../../../models/projects/workFlow';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../../globaldependencies/components/componentbase';


@Component({
  selector: "app-pm-component-workflows",
  templateUrl: 'workFlows.component.html'
})
export class WorkFlowComponent extends CustomAppBaseComponent implements OnInit {

  @ViewChild('addWorkflowPopover') addWorkflowPopover;

  @Input() allWorkFlowRecords: any[];
  @Input() workflowId: string;

  @Input("clearWorkFlowForm")
  set clearWorkFlowForm(data: string) {
    if (data != null)
      this.clearForm();
  }

  @Input("workFlowFormClose")
  set workFlowFormClose(data: string) {
    if (data != null)
      this.closeWorkflowForm();
  }

  @Input("validationmessage")
  set validationmessage(data: string) {
    if (data != null)
      this.validationmessages = data;
    this.showSpinner = false;
  }

  @Output() getWorkFlowById = new EventEmitter<string>();
  @Output() SaveWorkFlow = new EventEmitter<WorkFlow[]>();

  workFlowForm: FormGroup;
  isThereAnError: boolean;
  showSpinner: boolean;
  validationmessages: string;

  constructor(private cdRef: ChangeDetectorRef, translateService: TranslateService) {
    super();
    
    
  }

  ngOnInit() {
    super.ngOnInit();
    this.clearForm();
  }

  GetWorkFlow(workFlowRecord) {
    this.getWorkFlowById.emit(workFlowRecord);
    this.cdRef.detectChanges();
  }

  clearForm() {
    this.showSpinner = false;
    this.workFlowForm = new FormGroup({
      WorkFlowName: new FormControl("",Validators.compose([Validators.required, Validators.maxLength(250)]))
    });
  }

  saveWorkFlowData() {
    this.SaveWorkFlow.emit(this.workFlowForm.value);
    this.showSpinner = true;
    this.cdRef.detectChanges();
  }

  closeWorkflowForm() {
    let popover = this.addWorkflowPopover;
    if (popover)
      popover.close();
  }

  onKey() {
    this.isThereAnError = false;
    this.cdRef.detectChanges();
  }
}
