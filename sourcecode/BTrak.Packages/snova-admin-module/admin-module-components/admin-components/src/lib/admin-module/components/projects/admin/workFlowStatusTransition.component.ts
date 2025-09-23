import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input, ViewChild, QueryList, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, FormBuilder } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { WorkflowStatus, WorkFlowStatusTransitionTableData, WorkFlowStatusesTableData } from '../../../models/projects/workflowStatus';
import { SatPopover } from '@ncstate/sat-popover';
import { DeadlineDropDown } from '../../../models/projects/workFlow';
import { ProjectManagementService } from '../../../services/project-management.service';
import { ConstantVariables } from '../../../helpers/constant-variables';
import { CustomAppBaseComponent } from '../../../../globaldependencies/components/componentbase';


@Component({
  selector: "app-pm-component-workflowstatustransition",
  templateUrl: "workFlowStatusTransition.component.html"
})
export class WorkFlowStatusTransitionComponent extends CustomAppBaseComponent implements OnInit {
  @ViewChild("formDirective") formDirective: FormGroupDirective;

  @Input() workFlowStatusesTableData: WorkflowStatus[];
  disabledbutton;
  @Input("disabledbutton")
  set _disabledbutton(data) {
    this.disabledbutton = data;
    if (this.disabledbutton) {
      this.textToolTip = this.translateService.instant('WORKFLOWTRANSITION.ADDNEWTRANSITION');
    }
    else {
      this.textToolTip = this.translateService.instant('WORKFLOWTRANSITION.WORKSTATUS');
    }
  }

  workflowId;
  @Input("workflowId")
  set _workflowId(data) {
    this.workflowId = data;
    if (this.workflowId) {
      this.GetAllWorkFlowTransitions();
    }
  }
  @Input("isGoalsPage")
  set _isGoalsPage(data: boolean) {
    this.isGoalsPage = data;
  }
  @Input() workFlowStatuses: WorkFlowStatusesTableData[];

  @ViewChild("allSelected") private allSelected: MatOption;
  @ViewChild("allSelected1") private allSelected1: MatOption;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
  @ViewChild('addNewTransitionPopover') addTransitionPopover: SatPopover;
  @ViewChildren('editTransitionPopover') editTransitionPopovers;
  @ViewChildren('deleteTransitionPopover') deleteTransitionPopovers;

  @Output() getAllTransitions = new EventEmitter<string>();
  @Output() getStatusTransitionsList = new EventEmitter<any>();
  selectWorkFlows: FormGroup;
  updateTransition: FormGroup;
  deleteEligibleTransition: FormGroup;
  rolesDropDown: any[];
  workFlowTransitionData: WorkFlowStatusTransitionTableData;
  workFlowStatusTransitionTableData: WorkFlowStatusTransitionTableData[];
  deadlineDropDown: DeadlineDropDown[];
  workFlowTransitionDataById: any;
  isThereAnError: boolean;
  validationmessage: string;
  roleIds: any[];
  isGoalsPage: boolean;
  showSpinner: boolean;
  timeStamp: any;
  anyOperationInProgress: boolean;
  toastrMessage: string;
  textToolTip: string;
  isNewTransition: boolean;
  workflowStatusTransition: boolean = false;
  workflowStatusId: string;
  constructor(
    private fb: FormBuilder,
    private workflowService: ProjectManagementService,
    private snackbar: MatSnackBar, private translateService: TranslateService,
    private cdRef: ChangeDetectorRef
  ) {
    super();
    
    
  }

  ngOnInit() {
    super.ngOnInit();
    this.clearForm();
    this.clearTransitionsForm();
    this.DeleteTransitionsForm();
    // this.GetAllTransitionDeadlines();
  }

  clearForm() {
    this.isThereAnError = false;
    this.showSpinner = false;
    this.selectWorkFlows = this.fb.group({
      fromWorkflowUserStoryStatusId: new FormControl("", Validators.compose([Validators.required])),
      toWorkflowUserStoryStatusId: new FormControl("", Validators.compose([Validators.required])),
    });
  }

  GetAllWorkFlowTransitions() {
    this.workflowStatusTransition = true;
    const workflowTransitions = new WorkFlowStatusTransitionTableData();
    workflowTransitions.workFlowId = this.workflowId;
    workflowTransitions.projectId = null;
    this.workflowService.GetAllWorkFlowStatusTranitions(workflowTransitions).subscribe((responseData: any) => {
      this.workFlowStatusTransitionTableData = responseData.data;
      this.getStatusTransitionsList.emit(this.workFlowStatusTransitionTableData);
      this.workflowStatusTransition = false;
      this.cdRef.detectChanges();
    });
  }

  // GetAllTransitionDeadlines() {
  //   this.workflowService.GetAllTransitionsDeadlines().subscribe((responseData: any) => {
  //     this.deadlineDropDown = responseData.data;
  //   });
  // }

  clearTransitionsForm() {
    this.showSpinner = false;
    this.updateTransition = this.fb.group({
      fromWorkflowUserStoryStatus: new FormControl(""),
      toWorkflowUserStoryStatus: new FormControl(""),
      transitionDeadlineId: new FormControl(""),
      WorkFlowName: new FormControl("")
    });
  }

  DeleteTransitionsForm() {
    this.showSpinner = false;
    this.deleteEligibleTransition = this.fb.group({
      fromWorkflowUserStoryStatusId: new FormControl(""),
      toWorkflowUserStoryStatusId: new FormControl("")
    });
  }

  toggleGoalStatusPerOne(all) {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (
      this.selectWorkFlows.controls.roles.value.length === this.rolesDropDown.length
    ) {
      this.allSelected.select();
    }
  }

  toggleAllGoalStatusSelection() {
    if (this.allSelected.selected) {
      this.selectWorkFlows.controls.roles.patchValue([
        ...this.rolesDropDown.map(item => item.roleId),
        0
      ]);
    } else {
      this.selectWorkFlows.controls.roles.patchValue([]);
    }
  }

  toggleGoalStatusPerOne1(all) {
    if (this.allSelected1.selected) {
      this.allSelected1.deselect();
      return false;
    }
    if (
      this.updateTransition.controls.roles.value.length ===
      this.rolesDropDown.length
    ) {
      this.allSelected1.select();
    }
  }

  toggleAllGoalStatusSelection1() {
    if (this.allSelected1.selected) {
      this.updateTransition.controls.roles.patchValue([
        ...this.rolesDropDown.map(item => item.roleId),
        0
      ]);
    } else {
      this.updateTransition.controls.roles.patchValue([]);
    }
  }

  SaveTransitions(workflowId, workFlowTransitionData) {
    this.showSpinner = true;
    this.anyOperationInProgress = true;

    if (workFlowTransitionData == null) {
      this.workFlowTransitionData = this.selectWorkFlows.value;
      this.workFlowTransitionData.workFlowId = workflowId;
      this.workFlowTransitionData.isArchived = true;

    } else {
      this.workFlowTransitionData = workFlowTransitionData;
    }
    if (this.workFlowTransitionData.transitionDeadlineId === "0") {
      this.workFlowTransitionData.transitionDeadlineId == null;
    }
    this.workflowService.UpsertWorkFlowStatusTransitions(this.workFlowTransitionData).subscribe((responseData: any) => {
      this.anyOperationInProgress = false;
      this.showSpinner = false;
      if (responseData.success) {
        if (this.workFlowTransitionData.isArchived == true) {
          this.toastrMessage = this.translateService.instant(ConstantVariables.Updated);
          this.deleteTransitionPopovers.forEach((p) => p.closePopover());
        } else if (this.isNewTransition) {
          this.toastrMessage = this.translateService.instant(ConstantVariables.Toasteradded);
          this.addTransitionPopover.close();
        }
        else {
          this.toastrMessage = this.translateService.instant(ConstantVariables.Updated);
          this.editTransitionPopovers.forEach((p) => p.closePopover());
        }
        this.snackbar.open(this.toastrMessage, "", { duration: 3000 });
        this.formDirective.resetForm();
        this.clearForm();
        this.GetAllWorkFlowTransitions();
      } else {
        this.isThereAnError = true;
        this.validationmessage = responseData.apiResponseMessages[0].message;
      }
      this.cdRef.detectChanges();
    });
  }

  upsertTransitions(workflowId) {
    this.isNewTransition = true;
    this.workFlowTransitionData = this.selectWorkFlows.value;
    this.workFlowTransitionData.workFlowId = workflowId;
    this.SaveTransitions(workflowId, this.workFlowTransitionData);
  }

  EditTransitionById(transitions, editTransitionPopover) {
    this.isNewTransition = false;
    this.workFlowTransitionDataById = transitions;
    this.timeStamp = transitions.timeStamp;
    if (transitions.roleIds != null) {
      const selectedroles = transitions.roleIds.split(",");
      this.roleIds = selectedroles;
    } else {
      this.roleIds = null;
    }
    this.updateTransition = this.fb.group({
      fromWorkflowUserStoryStatus: new FormControl(
        transitions.fromWorkflowUserStoryStatus
      ),
      toWorkflowUserStoryStatus: new FormControl(
        transitions.toWorkflowUserStoryStatus
      ),
      transitionDeadlineId: new FormControl(transitions.transitionDeadlineId),
      WorkFlowName: new FormControl(transitions.workflowName)
    });
    this.updateTransition.controls["fromWorkflowUserStoryStatus"].disable();
    this.updateTransition.controls["toWorkflowUserStoryStatus"].disable();
    this.updateTransition.controls["WorkFlowName"].disable();
    editTransitionPopover.openPopover();
  }

  UpdateTransitions() {
    this.workFlowTransitionData = this.updateTransition.value;
    this.workFlowTransitionData.workFlowId = this.workFlowTransitionDataById.workFlowId;
    this.workFlowTransitionData.fromWorkflowUserStoryStatusId = this.workFlowTransitionDataById.fromWorkflowUserStoryStatusId;
    this.workFlowTransitionData.toWorkflowUserStoryStatusId = this.workFlowTransitionDataById.toWorkflowUserStoryStatusId;
    this.workFlowTransitionData.workflowEligibleStatusTransitionId = this.workFlowTransitionDataById.workflowEligibleStatusTransitionId;
    this.workFlowTransitionData.timeStamp = this.timeStamp;
    this.SaveTransitions(this.workflowId, this.workFlowTransitionData);
  }

  DeleteTransitionById(transitions, deleteTransitionPopover) {
    this.workFlowTransitionDataById = transitions;
    this.timeStamp = transitions.timeStamp;
    this.deleteEligibleTransition = this.fb.group({
      fromWorkflowUserStoryStatusId: new FormControl(transitions.fromWorkflowUserStoryStatusId),
      toWorkflowUserStoryStatusId: new FormControl(transitions.toWorkflowUserStoryStatusId)
    });
    deleteTransitionPopover.openPopover();
  }

  SavedeleteEligibleTransition() {
    this.isNewTransition = false;
    this.workFlowTransitionData = this.deleteEligibleTransition.value;
    this.workFlowTransitionData.workFlowId = this.workFlowTransitionDataById.workFlowId;
    this.workFlowTransitionData.isArchived = true;
    this.workFlowTransitionData.workflowEligibleStatusTransitionId = this.workFlowTransitionDataById.workflowEligibleStatusTransitionId;
    this.workFlowTransitionData.timeStamp = this.timeStamp;
    this.SaveTransitions(this.workflowId, this.workFlowTransitionData);
  }

  closeDialog() {
    let popover = this.addTransitionPopover;
    if (popover)
      popover.close();
  }

  closeDeleteDialog() {
    this.deleteTransitionPopovers.forEach((p) => p.closePopover());
  }

  closeEditDialog() {
    this.editTransitionPopovers.forEach((p) => p.closePopover());
  }

  getWorkflowStatusId(workflowStatusId) {
    this.workflowStatusId = workflowStatusId;
    this.cdRef.detectChanges();
  }
}
