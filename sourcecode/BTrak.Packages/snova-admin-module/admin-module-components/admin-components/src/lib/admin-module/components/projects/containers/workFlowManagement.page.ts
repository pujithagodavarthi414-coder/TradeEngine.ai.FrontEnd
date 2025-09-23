import { Component, OnInit, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy, Output, EventEmitter, ViewChildren, QueryList, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { WorkflowStatus, WorkFlowStatusesTableData, WorkFlowStatusTransitionTableData } from '../../../models/projects/workflowStatus';
import { SatPopover } from '@ncstate/sat-popover';
import { WorkflowStatusesModel, StatusesModel } from '../../../models/projects/workflowStatusesModel';
import { WorkFlow, WorkFlowSearchCriteriaInputModel, DeadlineDropDown } from '../../../models/projects/workFlow';
import { DashboardFilterModel } from '../../../models/dashboardFilterModel';
import { ToastrService } from 'ngx-toastr';
import * as _ from "underscore";
import { ProjectManagementService } from '../../../services/project-management.service';
import { ConstantVariables } from '../../../helpers/constant-variables';
import { CustomAppBaseComponent } from '../../../../globaldependencies/components/componentbase';
import * as $_ from 'jquery';
import { Router } from '@angular/router';
const $ = $_;

@Component({
  selector: "app-pm-page-workflowmanagement",
  templateUrl: "workFlowManagement.page.template.html"
})
export class WorkFlowManagementPageComponent extends CustomAppBaseComponent implements OnInit {
  private statusdata: WorkflowStatusesModel;
  private workflowStatusModel: WorkflowStatus;
  private workFlowdata: WorkFlow;
  private workFlowsearchinput: WorkFlowSearchCriteriaInputModel;
  private workflowstatus: WorkflowStatus;

  @Output() GetConfigurationsbyName = new EventEmitter<string>();
  @Output() changeReorder = new EventEmitter<string>();
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild("allSelected") private allSelected: MatOption;
  @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
  @ViewChild('addWorkflowPopover') addWorkflowPopover;
  @ViewChild('addWorkFlowStatusPopover') addWorkFlowStatusPopover: SatPopover;
  @ViewChild('addNewStatusPopover') addNewStatusPopover: SatPopover;

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }
  @Input("isGoalsPage")
  set _isGoalsPage(data: boolean) {
    this.isGoalsPage = data;
  }

  @Input("workflowId")
  set _workFlowId(data: string) {
    this.workflowId = data;
    if (this.workflowId) {
      this.GetAllWorkFlowTransitions();
      this.GetAllWorkFlowStatus();
    }
  }

  dashboardFilters: DashboardFilterModel;
  workFlowStatusesTableData: WorkFlowStatusesTableData[];
  workFlowStatusTransitionTableData: WorkFlowStatusTransitionTableData[];
  deadlineDropDown: DeadlineDropDown[];
  workflowStatus: WorkflowStatus[];
  statusDropDown: StatusesModel[];
  allWorkFlowRecords: any[];
  workFlowStatusIds: any[];
  statusvalue: any[];
  selectedstatus: any[];
  statusForm: FormGroup;
  workFlowForm: FormGroup;
  success: boolean;
  isGoalsPage: boolean;
  isThereAnError: boolean;
  workFlowName: string;
  validationmessage: string;
  WorkFlowName: string;
  isArchived: boolean;
  disabledbutton: boolean = false;
  selectStatus: FormGroup;
  show: boolean;
  editProj = false;
  color = "";
  selectedvalue: string;
  workflowId: string;
  showSpinner: boolean;
  loadSpinner: boolean;
  anyOperationInProgress: boolean;
  isLoading: boolean;
  popover: any;
  clearWorkFlowForm: string;
  workFlowFormClose: string;
  settingsHeight: boolean = false;
  individualHeight: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private workflowService: ProjectManagementService,
    private snackbar: MatSnackBar,
    private cdRef: ChangeDetectorRef, private translateService: TranslateService,
    private toaster: ToastrService,private router: Router
  ) {
    super();


    this.clearStatusForm();
    this.clearForm();
    this.clearWorkFlowStatusForm();
  }

  ngOnInit() {
    super.ngOnInit();
    if (!this.workflowId) {
      this.GetAllWorkFlows();
      this.GetAllStatus();
    }
    if (this.router.url.includes('projects/area/projectsettings')) {
      this.settingsHeight = true;
      this.individualHeight = false;
    }
    if (this.router.url.includes('/dashboard-management/widgets')) {
      this.settingsHeight = false;
      this.individualHeight = true;
    }
  }

  clearForm() {
    this.showSpinner = false;
    this.isThereAnError = false;
    this.clearWorkFlowForm = '';
  }

  closePopover() {
    this.workFlowFormClose = '';
  }

  clearWorkFlowStatusForm() {
    this.isThereAnError = false;
    this.loadSpinner = false;
    this.selectStatus = this.fb.group({
      status: new FormControl("", Validators.compose([Validators.required]))
    });
  }


  clearStatusForm() {
    this.showSpinner = false;
    this.isThereAnError = false;
    this.color = "";
    this.isThereAnError = true;
    this.statusForm = new FormGroup({
      statusName: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.maxLength(250)])
      ),
      statusColor: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.maxLength(250)])
      )
    });
  }

  toggleGoalStatusPerOne(all) {
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
      this.selectedstatus = this.statusDropDown.map(
        item => item.userStoryStatusId
      );
      this.selectStatus.controls.status.patchValue([
        ...this.statusDropDown.map(item => item.userStoryStatusId),
        0
      ]);
    } else {
      this.selectStatus.controls.status.patchValue([]);
    }
  }

  SaveWorkFlow(workFlowData) {
    this.clearWorkFlowForm = null;
    this.workFlowFormClose = null;
    this.showSpinner = true;
    this.isThereAnError = false;
    this.anyOperationInProgress = true;
    this.workFlowdata = workFlowData;
    this.workflowService
      .UpsertWorkFlow(this.workFlowdata)
      .subscribe((responseData: any) => {
        this.success = responseData.success;
        this.anyOperationInProgress = false;
        this.showSpinner = false;
        if (this.success) {
          const toastrMessage =
            this.workFlowdata.WorkFlowName +
            " " +
            this.translateService.instant(ConstantVariables.ToasterCreated);
          this.snackbar.open(toastrMessage, "", { duration: 3000 });
          this.clearForm();
          // this.addWorkflowPopover.close();
          this.GetAllWorkFlows();
          this.closePopover();
          this.cdRef.detectChanges();
        } else {
          this.isThereAnError = true;
          this.validationmessage = responseData.apiResponseMessages[0].message;
          this.toaster.error(this.validationmessage);
          this.cdRef.detectChanges();
        }
      });
  }

  GetAllWorkFlows() {
    this.workFlowsearchinput = {
      WorkFlowName: this.WorkFlowName,
      WorkFlowId: null,
      IsArchived: this.isArchived,
      OperationsPerformedBy: null
    };
    this.workflowService
      .GetAllWorkFlow(this.workFlowsearchinput)
      .subscribe((responseData: any) => {
        this.allWorkFlowRecords = responseData.data;
        this.cdRef.detectChanges();
        this.workFlowName = responseData.data[0].workFlowName;
        this.workflowId = responseData.data[0].workFlowId;
        if (this.workflowId !== undefined) {
          this.GetAllWorkFlowTransitions();
          this.GetAllWorkFlowStatus();
        }
      });
  }


  SaveStatus() {
    this.showSpinner = true;
    this.statusdata = this.statusForm.value;
    this.anyOperationInProgress = true;
    this.workflowService
      .UpsertStatus(this.statusdata)
      .subscribe((responseData: any) => {
        this.success = responseData.success;
        this.anyOperationInProgress = false;
        this.showSpinner = false;
        if (this.success) {
          const toastrMessage =
            this.statusdata.statusName + " " + this.translateService.instant(ConstantVariables.Status);
          this.snackbar.open(toastrMessage, "", { duration: 3000 });
          this.clearStatusForm();
          this.GetAllStatus();
          this.addNewStatusPopover.close();
        } else {
          this.isThereAnError = true;
          this.validationmessage = responseData.apiResponseMessages[0].message;
          this.cdRef.detectChanges();
        }
      });
  }

  GetAllStatus() {
    this.workflowService
      .GetAllStatuses(new StatusesModel())
      .subscribe((responseData: any) => {
        this.statusvalue = responseData.data;
      });
    this.GetAllWorkFlowStatus();
  }


  onKey() {
    this.isThereAnError = false;
    this.cdRef.detectChanges();
  }

  closestatusForm() {
    let popover = this.addNewStatusPopover;
    if (popover)
      popover.close();
  }

  closeWorkflowForm() {
    let popover = this.addWorkflowPopover;
    if (popover)
      popover.close();
  }

  GetWorkFlowById(event) {
    this.workflowId = event.workFlowId;
    this.cdRef.detectChanges();
    this.workFlowName = event.workFlowName;
    this.workflowStatusModel = new WorkflowStatus();
    this.workflowStatusModel.workFlowId = this.workflowId;
    this.GetAllWorkFlowStatus();
    this.GetAllWorkFlowTransitions();
  }

  GetWorkflowStatusById() {
    this.workflowStatusModel = new WorkflowStatus();
    this.workflowStatusModel.workFlowId = this.workflowId;
    this.workflowService
      .GetWorkflowStatusById(this.workflowStatusModel)
      .subscribe((responseData: any) => {
        this.workFlowStatusesTableData = responseData.data;
        this.cdRef.detectChanges();
      });
  }

  GetAllWorkFlowStatus() {
    this.isLoading = true;
    this.workflowStatusModel = new WorkflowStatus();
    this.workflowStatusModel.workFlowId = this.workflowId;
    this.workflowStatusModel.isArchived = null;
    this.workflowService
      .GetAllWorkFlowStatus(this.workflowStatusModel)
      .subscribe((responseData: any) => {
        this.isLoading = false;
        this.workFlowStatusesTableData = responseData.data;
        this.cdRef.detectChanges();
        this.workFlowStatusIds = responseData.data.map(
          item => item.userStoryStatusId
        );
        const isComplete = responseData.data.map(item => item.isCompleted);
        // this.disabledbutton = _.contains(isComplete, true);
        this.disabledbutton = (this.workFlowStatusesTableData.length > 1) ? true : false;
        this.GetStatusdropDownlist(this.workFlowStatusIds, this.statusvalue);
      });
  }

  reOrderSet() {
    this.changeReorder.emit('');
  }

  GetStatusdropDownlist(workFlowStatusIds, statusDropDown) {
    this.statusDropDown = _.filter(statusDropDown, function (s) {
      return !workFlowStatusIds.includes(s.userStoryStatusId);
    });
  }

  GetStatuslist(event) {
    this.selectedstatus = event;
  }

  SaveWorkFlowStatus() {
    this.loadSpinner = true;
    this.anyOperationInProgress = true;

    this.selectedvalue = this.selectStatus.value;
    // if(this.selectedvalue.length > 1)
    // {

    this.workflowstatus = this.selectStatus.value;
    this.workflowstatus.workFlowId = this.workflowId;
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
          this.GetAllWorkFlowStatus();
          this.addWorkFlowStatusPopover.close();
        } else {
          this.isThereAnError = true;
          this.validationmessage = responseData.apiResponseMessages[0].message;
          this.cdRef.detectChanges();
        }
      });
  }

  GetWorkFlowStatuslist(event) {
    this.workflowId = event;
    this.GetAllWorkFlowStatus();
  }

  closeWorkFlowStatusForm() {
    let popover = this.addWorkFlowStatusPopover;
    if (popover)
      popover.close();
  }

  GetAllWorkFlowTransitions() {
    const workflowTransitions = new WorkFlowStatusTransitionTableData();
    workflowTransitions.workFlowId = this.workflowId;
    workflowTransitions.projectId = null;
    this.workflowService
      .GetAllWorkFlowStatusTranitions(workflowTransitions)
      .subscribe((responseData: any) => {
        this.workFlowStatusTransitionTableData = responseData.data;
      });
    this.cdRef.detectChanges();
  }

  GetTransitionslist(event) {
    this.GetAllWorkFlowTransitions();
  }

  GetAllTransitionDeadlines() {
    this.workflowService
      .GetAllTransitionDeadline()
      .subscribe((responseData: any) => {
        this.deadlineDropDown = responseData.data;
      });
  }

  fitContent(optionalParameters: any) {
    var interval;
    if (optionalParameters['gridsterView']) {
      interval = setInterval(() => {
        if ($(optionalParameters['gridsterViewSelector'] + ' mat-card-content.workflow_data').length > 0) {
          $(optionalParameters['gridsterViewSelector'] + ' mat-card-content.workflow_data').height($(optionalParameters['gridsterViewSelector']).height() - 45);
          $(optionalParameters['gridsterViewSelector'] + ' .workflows-sec mat-list.compact-list').height($(optionalParameters['gridsterViewSelector']).height() - 110);
          clearInterval(interval);
        }
      }, 1000);
    }

    if (optionalParameters['popupView']) {
      interval = setInterval(() => {
        if ($(optionalParameters['popupViewSelector'] + ' mat-card-content.workflow_data').length > 0) {
          $(optionalParameters['popupViewSelector'] + ' mat-card-content.workflow_data').height($(optionalParameters['popupViewSelector']).height() - 75);
          clearInterval(interval);
        }
      }, 1000);
    }

    // if (optionalParameters['individualPageView']) {
    //   interval = setInterval(() => {
    //     if ($(optionalParameters['individualPageSelector'] + ' mat-card-content.workflow_data').length > 0) {
    //       $(optionalParameters['individualPageSelector'] + ' mat-card-content.workflow_data').height($(window).height() - 100);
    //       clearInterval(interval);
    //     }
    //   }, 1000);
    // }
  }

  setHeightForCard() {
    if (this.isGoalsPage) {
      let styles = {
        "height": "600px"
      };
      return styles;
    } else {

    }
  }

}
