import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input, ViewChild, QueryList, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, FormBuilder } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectManagementService } from '../../../services/project-management.service';
import { WorkFlowStatuses, WorkFlowStatusTransitionTableData, WorkflowStatus } from '../../../models/projects/workflowStatus';
import * as _ from "underscore";
import { SoftLabelConfigurationModel } from '../../../models/hr-models/softlabels-model';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../../../globaldependencies/components/componentbase';
import { DragulaService } from "ng2-dragula";
import { Subject, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { tap, takeUntil } from 'rxjs/operators';

import { StatusesModel } from '../../../models/projects/workflowStatusesModel';
import { SatPopover } from '@ncstate/sat-popover';
import { ConstantVariables } from '../../../helpers/constant-variables';

@Component({
  selector: "app-pm-component-workflowmanagement",
  templateUrl: "workFlowManagement.component.html",
  providers: [DragulaService]
})

export class WorkFlowManagementComponent extends CustomAppBaseComponent implements OnInit {
  @Input() WorkFlowStatusRecords: WorkFlowStatuses[];
  workFlowStatuses;
  @Input("workFlowStatuses")
  set _workFlowStatuses(data) {
    this.workFlowStatuses = data;
    if (this.workFlowStatuses && this.workFlowStatuses.length > 0) {
      this.workFlowStatuses = this.workFlowStatuses.sort((a, b) => {
        return a.orderId - b.orderId
      });
    }
  }

  anyOperationInProgress
  @Input("anyOperationInProgress")
  set _anyOperationInProgress(data) {
    this.anyOperationInProgress = data;
  }

  workFlowStatusTransitionTableDataDetails;
  @Input("workFlowStatusTransitionTableDataDetails")
  set _workFlowStatusTransitionTableDataDetails(
    data: WorkFlowStatusTransitionTableData[]
  ) {
    this.workFlowStatusTransitionTableDataDetails = data;
  }
  @Input("isGoalsPage")
  set _isGoalsPage(data: boolean) {
    this.isGoalsPage = data;
  }

  @Input("workflowId")
  set _workflowId(data: string) {
    this.workFlowId = data;
  }

  @Output() reOrderImplementation = new EventEmitter<string>();
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild('editWorkFlowStatusPopover') editWorkflowStatusPopOver: SatPopover;
  @ViewChild('addWorkFlowStatusPopover') addWorkFlowStatusPopover: SatPopover;
  @ViewChildren('updateWorkflowPopover') updateWorkflowPopovers;
  @ViewChildren('deleteWorkflowPopover') deleteWorkflowPopovers;
  @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
  @ViewChild("allSelected") private allSelected: MatOption;
  @Output() getworkflowStatusAll = new EventEmitter<string>();
  softLabels: SoftLabelConfigurationModel[];
  private workflowstatus: WorkflowStatus;
  workflowStatusModel: WorkflowStatus;
  private editWorkFlowStatusData: any;
  EditStatusForm: FormGroup;
  workFlowId: string;
  statusId: any;
  isGoalsPage: boolean;
  orderId: number;
  success: boolean;
  isArchived: boolean;
  showPopup: boolean;
  loadSpinner: boolean;
  statusDropDown: StatusesModel[];
  selectedstatus: any[];
  userStoryStatusValues: any[];
  workflowStatusIdsList: any[] = [];
  userStoryStatusId: string;
  userStoryStatusName: string;
  disabled: boolean;
  showSpinner: boolean;
  timeStamp: any;
  isThereAnError: boolean;
  validationMessage: string;
  workFlowManagementDataInProgress: boolean = false;
  permissionManagementLoopingData: any[] = [1, 2, 3];
  isAnyOperationIsInprogress: boolean = false;
  reOrderOperationInProgress: boolean;
  public ngDestroyed$ = new Subject();
  selectStatus: FormGroup;
  subs = new Subscription();
  validationmessage: string;
  statusForm: FormGroup;
  isAddStatusId: string;
  isArchiveStatusId: string;

  constructor(
    private workflowService: ProjectManagementService,
    private translateService: TranslateService,
    private snackbar: MatSnackBar,
    private cdRef: ChangeDetectorRef,
    private dragulaService: DragulaService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    super();
    this.clearWorkFlowStatusForm();
    this.clearStatusForm();
    this.getAllStatus();
    this.handleDragulaDragAndDropActions(dragulaService);

  }

  getAllStatus() {
    this.workflowService
      .GetAllStatuses(new StatusesModel())
      .subscribe((responseData: any) => {
        this.statusDropDown = responseData.data;
      });

  }


  private handleDragulaDragAndDropActions(dragulaService: DragulaService) {
    dragulaService.createGroup("reOrderItems", {
      accepts: this.acceptDragulaCallback,
      revertOnSpill: true
    });


    this.subs.add(this.dragulaService.drag("reOrderItems")
      .subscribe(({ el }) => {
        if (this.reOrderOperationInProgress) {
          this.toastr.warning(this.translateService.instant('USERSTORY.REORDERISINPROGRESS'));
          this.dragulaService.find('reOrderItems').drake.cancel(true);
        }
      })
    );
    this.subs.add(this.dragulaService.drop("reOrderItems").pipe(
      takeUntil(this.ngDestroyed$))
      .subscribe(({ name, el, target, source, sibling }) => {
        if (!(this.reOrderOperationInProgress)) {

          var orderedListLength = target.children.length;
          this.workflowStatusIdsList = [];
          for (var i = 0; i < orderedListLength; i++) {
            var userStoryStatusId = target.children[i].attributes["data-userStoryStatusId"].nodeValue;
            var index = this.workflowStatusIdsList.indexOf(userStoryStatusId.toLowerCase());
            if (index === -1) {
              this.workflowStatusIdsList.push(userStoryStatusId.toLowerCase());
            }
          }
          this.changeOrderForWorkflowStatus();
        }
        else if (this.reOrderOperationInProgress) {
          this.toastr.warning(this.translateService.instant('USERSTORY.REORDERISINPROGRESS'));
        }
      })
    );
  }

  clearWorkFlowStatusForm() {
    this.isThereAnError = false;
    this.loadSpinner = false;
    this.selectStatus = this.fb.group({
      status: new FormControl("", Validators.compose([Validators.required]))
    });
  }

  clearStatusForm() {
    this.statusForm = this.fb.group({
      addStatusId: new FormControl("", Validators.compose([Validators.required])),
      archiveStatusId: new FormControl("", Validators.compose([Validators.required]))
    });
  }

  toggleGoalStatusPerOne(all, value) {
    var index = (this.selectedstatus != undefined && this.selectedstatus != null)? this.selectedstatus.indexOf(value) : -1;

    if(this.selectedstatus == undefined || this.selectedstatus == null){
      this.selectedstatus = [];
    }

    if(index > -1){
      this.selectedstatus.splice(index, 1);
    } else {
      this.selectedstatus.push(value);
    }

    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (
      this.selectStatus.controls.status.value.length ===
      this.statusDropDown.length
    ) {
      this.allSelected.select();
    }
  }

  toggleAllGoalStatusSelection() {
    if (this.allSelected.selected) {
      if (this.statusDropDown.length === 0) {
        this.selectStatus.controls["status"].patchValue([]);
        this.selectedstatus = [];
      } else {
        this.selectStatus.controls["status"].patchValue([
          ...this.statusDropDown.map((item) => item.userStoryStatusId),
          0
        ]);

        this.statusDropDown.forEach(x =>{
          this.selectedstatus.push(x.userStoryStatusId);
        });
      }
    } else {
      this.selectedstatus = [];
      this.selectStatus.controls.status.patchValue([]);
    }
  }


  closeWorkFlowStatusForm() {
    let popover = this.addWorkFlowStatusPopover;
    if (popover)
      popover.close();
  }

  GetStatuslist(event) {
    this.selectedstatus = event;
  }

  editStatusForm() {
    let workFlowStatusList = this.workFlowStatuses;
    let addWorkflowStatusList = workFlowStatusList.filter(function (status) {
      return status.canAdd == true
    })
    if (addWorkflowStatusList.length > 0) {
      this.isAddStatusId = addWorkflowStatusList[0].userStoryStatusId
    }
    let archiveWorkflowStatusList = workFlowStatusList.filter(function (status) {
      return status.canDelete == true
    })
    if (archiveWorkflowStatusList.length > 0) {
      this.isArchiveStatusId = archiveWorkflowStatusList[0].userStoryStatusId
    }
    this.statusForm = this.fb.group({
      addStatusId: new FormControl(this.isAddStatusId, Validators.compose([Validators.required])),
      archiveStatusId: new FormControl(this.isArchiveStatusId, Validators.compose([Validators.required]))
    });
  }

  saveAddWorkflow() {
    this.loadSpinner = true;
    var workflowStatus = new WorkflowStatus();
    workflowStatus = this.statusForm.value;
    workflowStatus.workflowId = this.workFlowId;
    workflowStatus.canAdd = workflowStatus.addStatusId;
    workflowStatus.canDelete = workflowStatus.archiveStatusId;
    this.workflowService.updateWorkflowStatus(workflowStatus).subscribe((x: any) => {
      this.loadSpinner = false;
      if (x.success) {
        this.clearStatusForm();
        this.editWorkflowStatusPopOver.close();
        this.reOrderImplementation.emit('');
        this.getworkflowStatusAll.emit('');
      } else {
        this.validationmessage = x.apiResponseMessages[0].message;
      }
    })
  }



  changeOrderForWorkflowStatus() {
    this.reOrderOperationInProgress = true;
    var statusModel = new WorkflowStatus();
    statusModel.userStoryStatusIds = this.workflowStatusIdsList;
    statusModel.workFlowId = this.workFlowId;
    this.workflowService.reOrderWorkflowStatus(statusModel).subscribe((x: any) => {
      this.reOrderOperationInProgress = false;
      if (x.success) {
        this.workflowStatusIdsList = [];
        this.reOrderImplementation.emit('');
        this.getworkflowStatusAll.emit('');
      }
    })
  }

  public ngOnDestroy() {
    this.subs.unsubscribe();
    this.dragulaService.destroy("reOrderItems");
    this.ngDestroyed$.next();
  }

  getWorkflowStatusList() {
    this.anyOperationInProgress = true;
    this.workflowStatusModel = new WorkflowStatus();
    this.workflowStatusModel.workFlowId = this.workFlowId;
    this.workflowStatusModel.isArchived = null;
    this.workflowService
      .GetAllWorkFlowStatus(this.workflowStatusModel)
      .subscribe((responseData: any) => {
        this.anyOperationInProgress = false;
        this.workFlowStatuses = responseData.data;
        this.workFlowStatuses = this.workFlowStatuses.sort((a, b) => {
          return a.orderId - b.orderId
        });
        this.cdRef.detectChanges();
      });
  }




  private acceptDragulaCallback = (el, target, source, sibling) => {
    // this.userStoryId = el.attributes["data-userStoryId"].nodeValue;
    return true
  };


  GetStatusForm(workflowrecord, updateWorkflowPopover) {
    this.editWorkFlowStatusData = workflowrecord;
    this.timeStamp = workflowrecord.timeStamp;
    this.isArchived = false;
    this.orderId = workflowrecord.orderId;
    this.EditStatusForm = new FormGroup({
      WorkFlowName: new FormControl(workflowrecord.workflowName),
      UserStoryStatus: new FormControl(workflowrecord.userStoryStatusName, []),
      isComplete: new FormControl(workflowrecord.isCompleted, [,])
    });
    this.EditStatusForm.controls["WorkFlowName"].disable();
    this.EditStatusForm.controls["UserStoryStatus"].disable();
    updateWorkflowPopover.openPopover();
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    super.ngOnInit();
    this.clearForm();
    this.getSoftLabels();
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
  }

  clearForm() {
    this.EditStatusForm = new FormGroup({
      WorkFlowName: new FormControl(""),
      UserStoryStatus: new FormControl("", []),
      isComplete: new FormControl("", [,])
    });
  }


  upsertWorkFlowStatus() {
    this.loadSpinner = true;
    this.anyOperationInProgress = true;

    // if(this.selectedvalue.length > 1)
    // {

    this.workflowstatus = this.selectStatus.value;
    this.workflowstatus.workFlowId = this.workFlowId;
    this.workflowstatus.isArchived = false;
    this.workflowstatus.isComplete = false;
    this.workflowstatus.statusId = this.selectedstatus;
    this.workflowService
      .UpsertWorkFlowStatus(this.workflowstatus)
      .subscribe((responseData: any) => {
        this.success = responseData.success;
        this.anyOperationInProgress = false;
        this.loadSpinner = false;
        if (this.success) {
          this.snackbar.open(this.translateService.instant(ConstantVariables.FlowCreated), "", {
            duration: 3000
          });
          this.clearWorkFlowStatusForm();
          this.getworkflowStatusAll.emit('');
          this.addWorkFlowStatusPopover.close();
        } else {
          this.isThereAnError = true;
          this.validationmessage = responseData.apiResponseMessages[0].message;
          this.cdRef.detectChanges();
        }
      });
  }

  SaveWorkFlowStatus(workflowstatus) {
    this.showSpinner = true;
    const statusvalue = [];
    this.anyOperationInProgress = true;
    statusvalue.push(this.editWorkFlowStatusData.userStoryStatusId);
    if (workflowstatus === undefined || workflowstatus == null) {
      this.workflowstatus = this.EditStatusForm.value;
      this.workflowstatus.workFlowId = this.editWorkFlowStatusData.workFlowId;
      this.workflowstatus.statusId = statusvalue;
      this.workflowstatus.workFlowStatusId = this.editWorkFlowStatusData.workFlowStatusId;
      this.workflowstatus.isArchived = false;
      this.workflowstatus.orderId = this.orderId;
      this.workflowstatus.timeStamp = this.editWorkFlowStatusData.timeStamp;
    } else {
      this.workflowstatus = workflowstatus;
      this.workflowstatus.statusId = statusvalue;
    }

    this.workflowService.UpsertWorkFlowStatus(this.workflowstatus).subscribe((responseData: any) => {
      this.success = responseData.success;
      this.anyOperationInProgress = false;

      this.showSpinner = false;
      if (this.success) {
        this.getworkflowStatusAll.emit('');
        if (this.isGoalsPage) {
          this.getWorkflowStatusList();
        }
        let toastrMessage;
        if (workflowstatus == null || workflowstatus == undefined) {
          toastrMessage = "Workflow status updated successfully.";
          this.updateWorkflowPopovers.forEach((p) => p.closePopover());
          this.cdRef.detectChanges();
        }
        else {
          toastrMessage = "Workflow status deleted successfully.";
          this.deleteWorkflowPopovers.forEach((p) => p.closePopover());
          this.cdRef.detectChanges();
        }
        this.cdRef.detectChanges();
        this.snackbar.open(toastrMessage, "", { duration: 3000 });
      }
      else {
        this.isThereAnError = true;
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.cdRef.detectChanges();
      }
    });
  }


  DeleteStatusForm(workflowrecord, deleteWorkflowPopover) {
    this.workFlowId = workflowrecord.workFlowId;
    this.editWorkFlowStatusData = workflowrecord;
    this.disabled = true;
    this.orderId = workflowrecord.orderId;
    this.userStoryStatusName = this.editWorkFlowStatusData.userStoryStatusName;
    this.timeStamp = this.editWorkFlowStatusData.timeStamp;
    this.validationMessage = '';
    this.isThereAnError = false;
    this.checkAllWorkFlowEligibleTransactions(
      workflowrecord.userStoryStatusName
    );
    deleteWorkflowPopover.openPopover();
  }

  checkAllWorkFlowEligibleTransactions(userStoryStatusName) {
    let fromUserStoryStatus: any[];
    let toUserStoryStatus: any[];
    fromUserStoryStatus = this.workFlowStatusTransitionTableDataDetails.map(
      item => item.fromWorkflowUserStoryStatus
    );
    toUserStoryStatus = this.workFlowStatusTransitionTableDataDetails.map(
      item => item.toWorkflowUserStoryStatus
    );
    const data = _.contains(fromUserStoryStatus, userStoryStatusName);
    const data1 = _.contains(toUserStoryStatus, userStoryStatusName);
    if (data || data1) {
      this.showPopup = true;
    } else {
      this.showPopup = false;
      this.GetAllStatus(userStoryStatusName);
    }
    this.cdRef.detectChanges();
  }

  GetAllStatus(userStoryStatusName) {
    this.userStoryStatusValues = _.filter(
      this.workFlowStatuses,
      function (s) {
        return !userStoryStatusName.includes(s.userStoryStatusName);
      }
    );
    this.cdRef.detectChanges();
  }

  GetStatusChange(event) {
    this.userStoryStatusId = event;
  }

  DeleteWorkFlowStatus() {
    this.workflowstatus = {
      workFlowId: this.editWorkFlowStatusData.workFlowId,
      workFlowStatusId: this.editWorkFlowStatusData.workFlowStatusId,
      orderId: this.orderId,
      existingUserStoryStatusId: this.editWorkFlowStatusData.userStoryStatusId,
      currentUserStoryStatusId: this.userStoryStatusId,
      isArchived: true,
      isComplete: this.editWorkFlowStatusData.isCompleted,
      workflowStatusName: this.editWorkFlowStatusData.userStoryStatusName,
      statusId: this.editWorkFlowStatusData.userStoryStatusId,
      userStoryStatusId: this.editWorkFlowStatusData.userStoryStatusId,
      timeStamp: this.editWorkFlowStatusData.timeStamp,
      userStoryStatusName: this.editWorkFlowStatusData.userStoryStatusName,
      maxOrder: this.editWorkFlowStatusData.maxOrder,
      taskStatusId: this.editWorkFlowStatusData.taskStatusId,
      userStoryStatusIds: [],
      workflowId: null,
      canAdd: this.editWorkFlowStatusData.canAdd,
      canDelete: this.editWorkFlowStatusData.canDelete,
      addStatusId: null,
      archiveStatusId: null
    };
    this.anyOperationInProgress = true;
    this.SaveWorkFlowStatus(this.workflowstatus);
    this.cdRef.detectChanges();
  }

  closedialog() {
    this.updateWorkflowPopovers.forEach((p) => p.closePopover());
  }

  closeDeleteDialog() {
    this.deleteWorkflowPopovers.forEach((p) => p.closePopover());
  }
  compareSelectedWorksFn(workList: any, selectedworkFlows: any) {
    if (workList === selectedworkFlows) {
      return true;
    } else {
      return false;
    }
  }
}
