import { Component, ViewChild, ChangeDetectorRef, OnInit, Inject, ViewEncapsulation, ViewChildren } from "@angular/core";
import { Router } from "@angular/router";
import { PayrollManagementService } from "../../services/payroll-management.service";
import { PayrollRun } from "../../models/payroll-run";
import { FormControl, Validators, FormGroup, FormBuilder, FormGroupDirective } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatOption } from "@angular/material/core";
import { process, State } from "@progress/kendo-data-query";
import * as moment_ from 'moment';
const moment = moment_;
import * as _ from "underscore";
import * as XLSX from "xlsx"
import { DatePipe } from '@angular/common';
import { of, Observable } from "rxjs"

import {
  GridDataResult,
  DataStateChangeEvent,
  RowClassArgs
} from '@progress/kendo-angular-grid';
import { ToastrService } from "ngx-toastr";
import { PayRollRunOutPutModel } from "../../models/payrolloutputmodel";
import { PayRollTemplateModel } from '../../models/PayRollTemplateModel';
import { HrBranchModel } from '../../models/branch-model';
import { PayrollStatus } from '../../models/payroll-status';
import { EmployeeListModel } from '../../models/employee-list-model';
import { EmploymentStatusSearchModel } from '../../models/employment-status-search-model';
import { WorkflowTrigger } from '../../models/workflow-trigger.model';
import { WorkFlowTriggerDialogComponent } from '../workflow/workflow-trigger-dialog.component';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { PayRollStatusModel } from '../../models/payrollstatusmodel';
import { PayRollRunEmployeesDialog } from './payroll-runemployees.component';
import { PayRollArchiveInputModel } from '../../models/payrollarchiveinputmodel';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-payroll-run',
  templateUrl: './payroll-run.component.html',
  styleUrls: ['./payroll-run.component.scss']
})
export class PayrollRunComponent extends CustomAppBaseComponent {

  @ViewChildren("deletePayRollPopUp") deletePayRollPopover;
  @ViewChild("upsertPayRollPopUp") upsertPayRollPopover;

  payrollRunList: PayrollRun[];
  status: PayRollStatusModel[];
  branches: any[];
  public gridView: GridDataResult;
  referenceId: string = '68E9FFDF-72BB-4D4F-89A4-BFAD27A56CA5';
  referenceTypeId: string = '22459A42-25E0-4315-A64D-D943949ED0AE';
  workFlowItems = [];
  payrollWorkflow: any;
  isFilterApplied: boolean = true;
  isAnyOperationIsInprogress: boolean = false;
  isPayRollRunInProgress: boolean = false;
  payGradeForm: FormGroup;
  showFilters: boolean = false;
  payrollRunId: string;
  payrollCount: number = 0;
  intervalResult: any;
  employeesList: EmployeeListModel[];
  payrollRunInputModel: PayrollRun;
  public state: State = {
    skip: 0,
    take: 10,

  };
  isArchivedTypes: boolean = false;

  getEmploymentStatusesList: any = [];
  payRollForm: FormGroup;

  selectEmploymentStatusDropDownListData$: Observable<any>;
  employeeListDataDetails$: Observable<EmployeeListModel[]>;

  @ViewChild("allSelected") private allSelected: MatOption;
  @ViewChild("allEmployeeSelected") private allEmployeeSelected: MatOption;

  searchText = new FormControl(null,
    Validators.compose([
    ])
  );

  getSearchText: string;
  temp: any;
  selectedEmploymentStatusIds: string[] = [];
  selectedEmploymentStatus: string;
  selectedEmployees: string;
  payRollTemplates: PayRollTemplateModel[];
  validationMessage: any;
  payRollRunId: any;
  isPayRollArchived: boolean;
  payRollArchiveInputModel: any;
  timeStamp: any;
  isPayRollArchiveIsInprogress: boolean;
  isCreatePayRollRunInProgress: boolean;
  bankTemplates: any;

  constructor(private payrollManagementService: PayrollManagementService,
    private router: Router, private cdRef: ChangeDetectorRef,
    private dialog: MatDialog, private toastr: ToastrService, private datePipe: DatePipe,
    private translateService: TranslateService) {
    super()
  }

  ngOnInit() {
    super.ngOnInit();
    this.bankTemplates = [
      { templateName: 'Axis Template', templateValue: 'axis' },
      { templateName: 'ICICI Template', templateValue: 'icici' },
      { templateName: 'Non Axis Template', templateValue: 'nonAxis'},
      { templateName: 'Non ICICI Template', templateValue: 'nonIcici'}
    ];
    this.clearForm();
    this.getEmploymentStatusesList = [];
    this.getPayrollList();
    this.getAllBranches();
    this.getAllStatus();
    this.getEmploymentStatusList();
    this.getEmployeesLists();
    this.getAllPayRollTemplates();
    this.getWorkflowTriggersByReferenceId();
  }

  filterByName() {
    if (this.searchText.value != null) {
      this.getSearchText = this.searchText.value.toString().toLowerCase();
      const temp = this.temp.filter(payrollRunList =>
        (payrollRunList.branchName == null ? null : payrollRunList.branchName.toString().toLowerCase().indexOf(this.getSearchText) > -1)
        || (payrollRunList.fileName == null ? null : payrollRunList.fileName.toString().toLowerCase().indexOf(this.getSearchText) > -1)
        || (payrollRunList.employmentStatusNames == null ? null : payrollRunList.employmentStatusNames.toString().toLowerCase().indexOf(this.getSearchText) > -1)
        || (payrollRunList.employeeNames == null ? null : payrollRunList.employeeNames.toString().toLowerCase().indexOf(this.getSearchText) > -1)
        || (payrollRunList.templateName == null ? null : payrollRunList.templateName.toString().toLowerCase().indexOf(this.getSearchText) > -1)
        || (payrollRunList.payrollStatusName == null ? null : payrollRunList.payrollStatusName.toString().toLowerCase().indexOf(this.getSearchText) > -1)
        || (payrollRunList.runDate == null ? null : moment(payrollRunList.runDate).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.getSearchText) > -1)
        || (payrollRunList.payrollStartDate == null ? null : moment(payrollRunList.payrollStartDate).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.getSearchText) > -1)
        || (payrollRunList.payrollEndDate == null ? null : moment(payrollRunList.payrollEndDate).format("DD-MMM-YYYY").toString().toLowerCase().indexOf(this.getSearchText) > -1)
        || (payrollRunList.comments == null ? null : payrollRunList.comments.toString().toLowerCase().indexOf(this.getSearchText) > -1)
      );

      this.gridView = {
        data: temp.slice(this.state.skip, this.state.skip + this.state.take),
        total: temp.length
      };
    }
  }

  clearForm() {
    this.payRollForm = new FormGroup({
      branch: new FormControl(null,
      ),
      selectedEmployeeIds: new FormControl(null,
      ),
      payRollTemplateId: new FormControl(null,
      ),
      employmentStatusIds: new FormControl(null,
      ),
      startDate: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      endDate: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      chequeDate: new FormControl(null,
      ),
      alphaCode: new FormControl(null,
      ),
      cheque: new FormControl(null,
      ),
      chequeNo: new FormControl(null,
        Validators.compose([
          Validators.maxLength(6)
        ])
      ),
    })
  }

  closeSearch() {
    debugger;
    this.getSearchText = "";
    this.searchText.setValue("");
    this.filterByName();
  }

  getAllStatus() {
    this.payrollManagementService.getAllstatusList().subscribe((response: any) => {
      if (response.success) {
        this.status = response.data;
        if(this.status && this.status.length > 0) {
          let index;

          this.status.forEach((status) => {
            if (status.payRollStatusName == "Generated") {
              if (!this.canAccess_feature_GenarateOrSubmitPayRoll) {
                status.isDisabled = true;
              }
              else {
                status.isDisabled = false;
              }
            }
            if (status.payRollStatusName == "Submitted") {
              if (!this.canAccess_feature_GenarateOrSubmitPayRoll) {
                status.isDisabled = true;
              }
              else {
                status.isDisabled = false;
              }
            }
            if (status.payRollStatusName == "Approved") {
              if (!this.canAccess_feature_ApproveOrRejectPayRoll) {
                status.isDisabled = true;
              }
              else {
                status.isDisabled = false;
              }
            }
            if (status.payRollStatusName == "Rejected") {
              if (!this.canAccess_feature_ApproveOrRejectPayRoll) {
                status.isDisabled = true;
              }
              else {
                status.isDisabled = false;
              }
            }
            if (status.payRollStatusName == "Paid") {
              if (!this.canAccess_feature_PaidPayRoll) {
                status.isDisabled = true;
              }
              else {
                status.isDisabled = false;
              }
            }
          });
        }
      }
      else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
      }
    })
  }

  setColorForPayRollSatus(event, dataItem) {
    var color = '';
    const item = this.status.find(x => x.id == event.value);
    var statusName = item.payRollStatusName ? item.payRollStatusName : '';
    if (statusName == "Generated") {
      color = '#B3B09E'
    }
    else if (statusName == "Submitted") {
      color = '#5959e8'
    }
    else if (statusName == "Approved") {
      color = '#FE7E02'
    }
    else if (statusName == "Rejected") {
      color = '#F95959'
    }
    else if (statusName == "Paid") {
      color = '#31E804'
    }

    dataItem.payRollStatusColour = color;
    Object.assign(
      this.gridView.data.find(({ id }) => id === dataItem.id),
      dataItem
    );
    this.gridView.data = [...this.gridView.data]
  }

  getAllPayRollTemplates() {
    this.isAnyOperationIsInprogress = true;
    var payRollTemplateModel = new PayRollTemplateModel();
    payRollTemplateModel.isArchived = false;
    this.payrollManagementService.getAllPayRollTemplates(payRollTemplateModel).subscribe((response: any) => {
      if (response.success == true) {
        this.payRollTemplates = response.data;
      }
      else {
        this.cdRef.detectChanges();
      }
    });
    this.isAnyOperationIsInprogress = false;
  }

  getEmploymentStatusList() {
    this.isAnyOperationIsInprogress = true;
    let employmentStatusModel = new EmploymentStatusSearchModel();
    employmentStatusModel.isArchived = false;
    this.payrollManagementService.getAllEmploymentStatuses(employmentStatusModel).subscribe((response: any) => {
      if (response.success == true) {
        this.getEmploymentStatusesList = response.data;
        this.selectEmploymentStatusDropDownListData$ = of(response.data);
      }
      else {
        this.isAnyOperationIsInprogress = false;
      }
      this.cdRef.detectChanges();
    });
  }

  getEmployeesLists() {
    const employeeListSearchResult = new EmployeeListModel();
    employeeListSearchResult.sortDirectionAsc = true;
    employeeListSearchResult.isArchived = false;
    employeeListSearchResult.isActive = true;
    if (this.payRollForm.controls['branch'].value)
      employeeListSearchResult.branchId = this.payRollForm.controls['branch'].value;
    else {
      employeeListSearchResult.branchId = null;
    }
    if (this.payRollForm.controls['payRollTemplateId'].value)
      employeeListSearchResult.payRollTemplateId = this.payRollForm.controls['payRollTemplateId'].value;
    else {
      employeeListSearchResult.payRollTemplateId = null;
    }

    this.payrollManagementService.getAllEmployees(employeeListSearchResult).subscribe((response: any) => {
      if (response.success == true) {
        this.employeeListDataDetails$ = of(response.data);
        this.employeesList = response.data;
        this.isAnyOperationIsInprogress = false;
      }
      if (response.success == false) {
        this.isAnyOperationIsInprogress = false;
        this.validationMessage = response.apiResponseMessages[0].message;
      }
    });
  }

  getSelectedEmployees() {
    const employeeListDataDetailsList = this.employeesList;
    const employmentIds = this.payRollForm.controls['selectedEmployeeIds'].value;
    const index = employmentIds.indexOf(0);
    if (index > -1) {
      employmentIds.splice(index, 1);
    }

    const employeeListDataDetails = _.filter(employeeListDataDetailsList, function (x) {
      return employmentIds.toString().includes(x.employeeId);
    })
    const employeeNames = employeeListDataDetails.map((x) => x.userName);
    this.selectedEmployees = employeeNames.toString();
  }

  toggleAllEmployeesSelected() {
    if (this.allEmployeeSelected.selected) {
      this.payRollForm.controls['selectedEmployeeIds'].patchValue([
        ...this.employeesList.map((item) => item.employeeId),
        0
      ]);
    } else {
      this.payRollForm.controls['selectedEmployeeIds'].patchValue([]);
    }
    this.getSelectedEmployees();
  }

  toggleEmployeePerOne() {
    if (this.allEmployeeSelected.selected) {
      this.allEmployeeSelected.deselect();
      return false;
    }
    if (this.payRollForm.controls['selectedEmployeeIds'].value.length === this.employeesList.length) {
      this.allEmployeeSelected.select();
    }
    this.getSelectedEmployees();
  }

  getPayrollList() {
    this.isPayRollRunInProgress = true;
    this.payrollManagementService.getPayrollRunList(this.isArchivedTypes).subscribe((response: any) => {
      if (response.success) {
        this.payrollRunList = response.data;
        this.temp = this.payrollRunList;
        var list = response.data;
        if (list)
          list.forEach((x) => {
            if (x.bankSubmittedFilePointer != null) {
              const parts = x.bankSubmittedFilePointer.split("/");
              const fileExtension = parts.pop();
              x.fileName = fileExtension;
            }
          })
        this.payrollRunList = list;
        this.loadItems();
      }
      else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
      }
      this.isPayRollRunInProgress = false;
    })
  }

  loadItems() {
    this.gridView = {
      data: this.payrollRunList.slice(this.state.skip, this.state.skip + this.state.take),
      total: this.payrollRunList.length
    };
  }

  selectedRow(e) {

    this.router.navigate(["payrollmanagement/payrollsummary/" + e.dataItem.id]);
  }

  getAllBranches() {
    var hrBranchModel = new HrBranchModel();
    hrBranchModel.isArchived = false;
    this.payrollManagementService.getBranches(hrBranchModel).subscribe((result: any) => {
      if (result.success) {
        this.branches = result.data;
      }
      else {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
      }
    })
  }

  toggleEmploymentStatusPerOne() {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (this.payRollForm.controls['employmentStatusIds'].value.length === this.getEmploymentStatusesList.length) {
      this.allSelected.select();
    }
    this.getEmploymentStatusIdsList();
  }

  toggleAllEmploymentStatusesSelected() {
    if (this.allSelected.selected) {
      this.payRollForm.controls['employmentStatusIds'].patchValue([
        ...this.getEmploymentStatusesList.map((item) => item.employmentStatusId),
        0
      ]);
    } else {
      this.payRollForm.controls['employmentStatusIds'].patchValue([]);
    }
    this.getEmploymentStatusIdsList();
  }

  getEmploymentStatusIdsList() {

    const employmentStatus = this.payRollForm.controls['employmentStatusIds'].value;
    const index = employmentStatus.indexOf(0);
    if (index > -1) {
      employmentStatus.splice(index, 1);
    }

    const employmentStatuses = this.getEmploymentStatusesList;
    // tslint:disable-next-line: only-arrow-functions
    const employmentStatusesList = _.filter(employmentStatuses, function (x) {
      return employmentStatus.toString().includes(x.employmentStatusId);
    })
    const employmentStatusNames = employmentStatusesList.map((x) => x.employmentStatusName);
    this.selectedEmploymentStatus = employmentStatusNames.toString();
  }

  changeBranchOrTemplate() {
    this.payRollForm.controls['selectedEmployeeIds'].setValue("");
    this.getEmployeesLists();
  }

  payrollRun() {
    this.isCreatePayRollRunInProgress = true;
    var guid = this.createGuid();
    var payrollRun = new PayrollRun();
    payrollRun.BranchId = this.payRollForm.controls['branch'].value;
    payrollRun.PayrollStartDate = this.payRollForm.controls['startDate'].value;
    payrollRun.PayrollEndDate = this.payRollForm.controls['endDate'].value;
    payrollRun.employmentStatusIds = this.payRollForm.controls['employmentStatusIds'].value;
    payrollRun.employeeIds = this.payRollForm.controls['selectedEmployeeIds'].value;
    payrollRun.templateId = this.payRollForm.controls['payRollTemplateId'].value;
    payrollRun.chequeDate = this.payRollForm.controls['chequeDate'].value;
    payrollRun.alphaCode = this.payRollForm.controls['alphaCode'].value;
    payrollRun.cheque = this.payRollForm.controls['cheque'].value;
    payrollRun.chequeNo = this.payRollForm.controls['chequeNo'].value;
    payrollRun.id = guid;
    this.payrollRunId = guid;
    this.payrollCount = 0;
    this.payrollRunInputModel = payrollRun;
    this.setIntrvl();
    this.payrollManagementService.insertPayrollRun(payrollRun).subscribe((result: any) => {
      if (result.success) {
        this.payrollCount = 100;
        this.stopInterval();
        this.upsertPayRollPopover.closePopover();
        this.openPayRollRunDialog(result.data);
        setTimeout(() => {
          this.clearForm();
          this.stopInterval();
          this.getPayrollList();
          this.payrollRunId = null;
        }, 5000);
        this.isCreatePayRollRunInProgress = false;
      }
      else {
        this.isCreatePayRollRunInProgress = false;
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
      }
    })
  }

  createPayRollPopupOpen(upsertPayRollPopUp) {
    this.clearForm();
    upsertPayRollPopUp.openPopover();
  }

  closeUpsertPayRollPopup(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.clearForm();
    this.upsertPayRollPopover.closePopover();
  }

  resetForm() {
    this.clearForm();
    this.changeBranchOrTemplate();
    this.selectedEmploymentStatus = null;
    this.selectedEmployees = null;
  }

  updateStatus(statusid, runid, comment, dataItem) {
    var payrollRun = new PayrollStatus();
    payrollRun.Id = statusid;
    payrollRun.PayrollRunId = runid;
    payrollRun.Comments = comment;
    var ststuses = this.status.filter(status => status.id == statusid);
    if (ststuses.length > 0) {
      if (ststuses[0].payRollStatusName == "Paid") {
        if ((dataItem.payrollStatusName == "Approved") && ststuses[0].payRollStatusName == "Paid" && dataItem.bankSubmittedFilePointer == null) {
          this.getPayrollList();
          this.toastr.error("", this.translateService.instant("PAYROLL.RUNPAYMESSAGE"));
        }
        else if ((dataItem.payrollStatusName == "Generated" || dataItem.payrollStatusName == "Submitted") && ststuses[0].payRollStatusName == "Paid" && dataItem.bankSubmittedFilePointer == null) {
          this.getPayrollList();
          this.toastr.error("", this.translateService.instant("PAYROLL.PAIDSTATUSMESSAGE"));
        }
        else {
          this.openDialog(payrollRun);
        }
      } else {
        this.updatePayrollRunStatus(payrollRun);
      }
    }
  }

  triggerWorkflow() {

    if (this.workFlowItems.length > 0) {
      this.editWorkflowTrigger(this.payrollWorkflow);

    } else {
      this.addWorkflowTrigger();
    }
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
        this.getWorkflowTriggersByReferenceId();
      }
      else {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
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
        this.getWorkflowTriggersByReferenceId();
      }
      else {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
      }
      this.cdRef.markForCheck();
    });
  }


  completeUserTask(dataItem, isApproved) {
    if (dataItem.userTasks) {

    } var taskId = dataItem.userTasks.id;

    this.payrollManagementService.updateUserTask(taskId, isApproved).subscribe(() => {
      this.getPayrollList();
    });

  }

  getWorkflowTriggersByReferenceId() {
    this.isAnyOperationIsInprogress = true;
    let triggerModel = new WorkflowTrigger();
    triggerModel.referenceId = this.referenceId;
    triggerModel.referenceTypeId = this.referenceTypeId;
    triggerModel.isArchived = false;
    this.payrollManagementService.getWorkflowsByReferenceId(triggerModel).subscribe((result: any) => {
      let success = result.success;
      if (success) {
        this.isAnyOperationIsInprogress = false;
        this.workFlowItems = result.data;
        if (this.workFlowItems.length > 0) {
          this.payrollWorkflow = this.workFlowItems[0];
        }
        this.cdRef.markForCheck();
      } else {
        this.isAnyOperationIsInprogress = false;
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
        this.cdRef.markForCheck();
      }
    });
  }

  filterClick() {
    this.isFilterApplied = !this.isFilterApplied;
    this.showFilters = !this.showFilters;
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridView = process(this.payrollRunList, this.state);
    this.filterByName();
  }

  runPayment(dataItem, templateType) {
    this.isPayRollRunInProgress = true;
    this.payrollManagementService.runPaymentForPayRollRun(dataItem.id, templateType).subscribe((response: any) => {
      if (response.success) {
        if (response.data != null) {
          this.downloadFile(response.data);
        }
        this.getPayrollList();
      }
      else {
        this.isPayRollRunInProgress = false;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
      }
    })
  }

  downloadFile(filePath) {
    const parts = filePath.split(".");
    const fileExtension = parts.pop();

    if (fileExtension == 'pdf') {
      // this.downloadPdf(filePath);
    } else {
      const downloadLink = document.createElement("a");
      downloadLink.href = filePath;
      downloadLink.download = "Payment.xlsx"

      downloadLink.click();
    }
  }

  deletePayRollPopUpOpen(row, deletePayRollPopUp) {
    this.payRollRunId = row.id;
    this.isPayRollArchived = !this.isArchivedTypes;
    this.timeStamp = row.timeStamp;
    deletePayRollPopUp.openPopover();
  }

  closeDeletePayRollDialog() {
    this.deletePayRollPopover.forEach((p) => p.closePopover());
  }

  deletePayRoll() {
    this.isPayRollArchiveIsInprogress = true;
    this.payRollArchiveInputModel = new PayRollArchiveInputModel();
    this.payRollArchiveInputModel.payRollRunId = this.payRollRunId;
    this.payRollArchiveInputModel.timeStamp = this.timeStamp;
    this.payRollArchiveInputModel.isArchived = !this.isArchivedTypes;
    this.payrollManagementService.archivePayRoll(this.payRollArchiveInputModel).subscribe((response: any) => {
      if (response.success == true) {
        this.deletePayRollPopover.forEach((p) => p.closePopover());
        this.getPayrollList();
      }
      else {
        this.validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error("", this.validationMessage);
      }
      this.cdRef.detectChanges();
      this.isPayRollArchiveIsInprogress = false;
    });
  }
  openDialog(payrollRun): void {
    const dialogRef = this.dialog.open(PayslipConfirmationDialog, {

    });
    dialogRef.afterClosed().subscribe(result => {

      payrollRun.IsPayslipReleased = result;

      this.updatePayrollRunStatus(payrollRun);
    });
  }

  openPayRollRunDialog(payRollRunEmployeesData): void {
    const dialogRef = this.dialog.open(PayRollRunDialog, {
      disableClose: true,
      data: { payRollRunEmployeesData: payRollRunEmployeesData }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == false)
        result = null;
      this.runPayRollWithChanges(result);
    });
  }

  showEmployeeLeaveList(row) {
    this.openEmployeeLeaveDetailsDialog(row);
  }

  openEmployeeLeaveDetailsDialog(rowData): void {
    const dialogRef = this.dialog.open(PayRollRunEmployeeLeaveDetailsDialog, {
      disableClose: true,
      data: { payRollRunId: rowData.id }
    });
  }

  openPayRollRunEmployeesDialog(rowData): void {
    const dialogRef = this.dialog.open(PayRollRunEmployeesDialog, {
      data: rowData.payRollRunEmployees
    });
  }

  runPayRollWithChanges(payRollRunDiaLogEmployees) {
    this.isPayRollRunInProgress = true;
    this.payrollRunInputModel.employeeDetailsList = payRollRunDiaLogEmployees;
    this.payrollManagementService.insertFinalPayRollRun(this.payrollRunInputModel).subscribe((result: any) => {
      if (result.success) {
        this.payrollRunInputModel = null;
        this.getPayrollList();
      }
      else {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
      }
      this.isPayRollRunInProgress = false;
    })
  }

  updatePayrollRunStatus(payrollRun) {
    this.isPayRollRunInProgress = true;
    this.payrollManagementService.updatePayrollRunStatus(payrollRun).subscribe((result: any) => {
      if (result.success) {
        this.getPayrollList();
      }
      else {
        this.isPayRollRunInProgress = false;
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
      }
    })
  }

  createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  getPayrollRunEmployeeCount() {
    if (this.payrollCount == 100) {
      this.stopInterval();
    }
    this.payrollManagementService.getPayrollRunEmployeeCount(this.payrollRunId).subscribe((response: any) => {
      console.log(response.data);
      if (response.data == null) {
        this.payrollCount = 0;
      }
      else {
        this.payrollCount = response.data;
      }
    })
  }

  setIntrvl() {
    this.intervalResult = setInterval(() => {
      this.getPayrollRunEmployeeCount()
    }, 1000);
  }

  stopInterval() {
    clearInterval(this.intervalResult);
  }

  sendEmailWithPayslip(payrollRunId) {
    this.isPayRollRunInProgress = true;
    this.payrollManagementService.sendEmailWithPayslip(payrollRunId).subscribe(() => {
      this.isPayRollRunInProgress = false;
    })
  }
}

@Component({
  selector: 'payslip-confirmation-dialog',
  templateUrl: 'payslip-confirmation-dialog.html',
})
export class PayslipConfirmationDialog {
  constructor(public dialogRef: MatDialogRef<PayslipConfirmationDialog>, @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'payroll-run-dialog',
  templateUrl: 'payroll-run-dialog.html',
  styles: [`
  .k-grid-header { padding: 0px 0px 0px 0px !important;}
  .k-grid-content { overflow-y: visible}
 `]
})
export class PayRollRunDialog {
  @ViewChild('fileInput') fileInput;
  payRollRunEmployeesData: any[];
  constructor(public dialogRef: MatDialogRef<PayRollRunDialog>, private cdRef: ChangeDetectorRef, private formBuilder: FormBuilder,
    private payrollManagementService: PayrollManagementService, private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.payRollRunEmployeesData = data.payRollRunEmployeesData;
  }

  public viewdata: GridDataResult;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };
  uploadDataOperationInProgress: boolean;
  showImportStatus: boolean = false;
  oldfile: string;

  public payRollRunDiaLogEmployees: any[] = [];

  public ngOnInit(): void {
    this.viewdata = process(this.payRollRunEmployeesData, this.gridState);
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridState = state;
    this.viewdata = process(this.payRollRunEmployeesData, this.gridState);
  }

  private isReadOnly(field: string): boolean {
    const readOnlyColumns = ['employeeNumber', 'employeeName', 'netPay', 'totalWorkingDays', 'effectiveWorkingDays', 'importStatus'];
    return readOnlyColumns.indexOf(field) > -1;
  }

  cellClickHandler(event) {
    this.cdRef.detectChanges();
    if (!event.isEdited && !this.isReadOnly(event.column.field)) {
      event.sender.editCell(event.rowIndex, event.columnIndex, this.createFormGroup(event.dataItem));
    }
  }

  public cellCloseHandler(args: any) {
    this.cdRef.detectChanges();
    const { formGroup, dataItem } = args;
    const newlDataItem = args.formGroup.value;
    if ((newlDataItem.encashedLeaves != dataItem.encashedLeaves) || (newlDataItem.lossOfPay != dataItem.lossOfPay)) {
      const oldItem = this.payRollRunDiaLogEmployees.find(x => x.employeeId == newlDataItem.employeeId);
      if (oldItem != null) {
        Object.assign(
          this.payRollRunDiaLogEmployees.find(({ employeeId }) => employeeId === dataItem.employeeId),
          newlDataItem
        );
      }
      else {
        this.payRollRunDiaLogEmployees.push(newlDataItem)
      }
    }
    if (!formGroup.valid) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else if (formGroup.dirty) {
      Object.assign(
        this.payRollRunEmployeesData.find(({ employeeNumber }) => employeeNumber === dataItem.employeeNumber),
        args.formGroup.value
      );
      this.payRollRunEmployeesData = [...this.payRollRunEmployeesData];
    }
  }

  public onStateChange() {
    this.viewdata = process(this.payRollRunEmployeesData, this.gridState);
  }

  public createFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      'employeeId': dataItem.employeeId,
      'employeeNumber': dataItem.employeeNumber,
      'employeeName': dataItem.employeeName,
      'netPay': dataItem.netPay,
      'totalWorkingDays': dataItem.totalWorkingDays,
      'effectiveWorkingDays': dataItem.effectiveWorkingDays,
      'lossOfPay': dataItem.lossOfPay,
      'encashedLeaves': dataItem.encashedLeaves
    });
  }

  downloadFile() {
    this.uploadDataOperationInProgress = true;
    var payRollRunOutPutModel = new PayRollRunOutPutModel();
    payRollRunOutPutModel.payrollRunOutPutModelList = this.payRollRunEmployeesData;
    this.payrollManagementService.payRollRunUploadTemplate(payRollRunOutPutModel).subscribe((response: any) => {
      this.uploadDataOperationInProgress = false;
      const downloadLink = document.createElement("a");
      downloadLink.href = response.data;
      downloadLink.download = "PayRollRunTemplate.xlsx"
      downloadLink.click();
      this.toastr.success("Downloaded successfully.");
    },
      function () {
        this.toastr.error("Download failed.");
      });
  }

  uploadEventHandler(file, event) {
    const newfile = this.fileInput.nativeElement.value;
    console.log(newfile);
    let dialog = this.dialogRef;
    dialog.componentInstance.uploadDataOperationInProgress = true;
    const payRollRunEmployeesData = this.payRollRunEmployeesData;
    const gridState = this.gridState;
    if (dialog.componentInstance.oldfile != newfile) {
      dialog.componentInstance.payRollRunDiaLogEmployees = [];
    }

    var count = 0;
    if (file != null) {
      var reader = new FileReader();
      reader.onload = function (e: any) {

        var bstr = (e != undefined && e.target != undefined) ? e.target.result : "";
        var workBook = XLSX.read(bstr, { type: 'binary' });
        var shtData = workBook.Sheets[workBook.SheetNames[0]];
        var sheetData = XLSX.utils.sheet_to_json(shtData, {
          header: ["EmployeeNumber", "EmployeeName", "LossOfPay", "EncashedLeaves"], raw: false, defval: ''
        });

        sheetData.forEach((item: any, index) => {
          if (index > 0) {
            count = count + 1;
            if (item.LossOfPay == "" || item.LossOfPay == null) {
              item.LossOfPay = 0;
            }
            if (item.EncashedLeaves == "" || item.EncashedLeaves == null) {
              item.EncashedLeaves = 0;
            }
            var itemObj = {
              employeeNumber: item.EmployeeNumber.trim(),
              employeeName: item.EmployeeName.trim(),
              lossOfPay: parseFloat(item.LossOfPay),
              encashedLeaves: parseFloat(item.EncashedLeaves),
            }
            if (itemObj != null) {
              const oldobject = payRollRunEmployeesData.find(x => x.employeeNumber == itemObj.employeeNumber);
              if (oldobject != null) {
                if ((oldobject.lossOfPay != itemObj.lossOfPay) || (oldobject.encashedLeaves != itemObj.encashedLeaves)) {
                  dialog.componentInstance.payRollRunDiaLogEmployees.push(oldobject);
                }
                oldobject.lossOfPay = itemObj.lossOfPay;
                oldobject.encashedLeaves = itemObj.encashedLeaves;
                Object.assign(
                  payRollRunEmployeesData.find(({ employeeNumber }) => employeeNumber === oldobject.employeeNumber),
                  oldobject
                );
              }
              else {
                dialog.componentInstance.payRollRunDiaLogEmployees.push(itemObj);
              }
            }
          }
        });

        dialog.componentInstance.viewdata = process(payRollRunEmployeesData, gridState);
        dialog.componentInstance.uploadDataOperationInProgress = false;
        dialog.componentInstance.toastr.success("Uploaded successfully.");
        dialog.componentInstance.oldfile = dialog.componentInstance.fileInput.nativeElement.value;
        dialog.componentInstance.fileInput.nativeElement.value = '';
      };
      if (event.target != undefined)
        reader.readAsBinaryString(event.target.files[0]);
    }
    this.viewdata = process(payRollRunEmployeesData, gridState);
  }
}


@Component({
  selector: 'employee-leave-details-dialog',
  templateUrl: 'employee-leave-details-dialog.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
  .k-grid tr.rowclass { background-color: yellow; }
`]
})
export class PayRollRunEmployeeLeaveDetailsDialog {
  payRollRunId: string;
  profileUrl: string;
  constructor(public dialogRef: MatDialogRef<PayRollRunEmployeeLeaveDetailsDialog>, private toastr: ToastrService,
    private payrollManagementService: PayrollManagementService, @Inject(MAT_DIALOG_DATA) public data: any, private router: Router) {
    this.payRollRunId = data.payRollRunId
  }

  public employeeLeaveDetailsList: GridDataResult;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };

  isPayRollRunEmplOyeeDetailsInProgress: boolean;

  public employeeLeaveDetails: any[] = [];

  public ngOnInit(): void {
    this.getEmployeeLeaveDetailsList();
  }

  getEmployeeLeaveDetailsList() {
    this.isPayRollRunEmplOyeeDetailsInProgress = true;
    this.payrollManagementService.getEmployeeLeaveDetailsList(this.payRollRunId).subscribe((response: any) => {
      if (response.success) {
        this.employeeLeaveDetailsList = process(response.data, this.gridState);
        this.employeeLeaveDetails = response.data;
      }
      else {
        this.toastr.error(response.apiResponseMessages[0].message);
      }
      this.isPayRollRunEmplOyeeDetailsInProgress = false;
    })
  }

  rowCallback = (context: RowClassArgs) => {
    const isEven = context.dataItem.isManualLeaveManagement == true;
    return {
      rowclass: isEven
    };
  }
  public dataStateChangeDailog(state: DataStateChangeEvent): void {
    this.gridState = state;
    this.employeeLeaveDetailsList = process(this.employeeLeaveDetails, this.gridState);
  }

  goToProfile(userId) {
    const angularRoute = this.router.url;
    const url = window.location.href;
    this.profileUrl = url.replace(angularRoute, '');
    this.profileUrl = this.profileUrl + '/dashboard/profile/' + userId + '/overview';
    window.open(this.profileUrl, "_blank");
  }
}