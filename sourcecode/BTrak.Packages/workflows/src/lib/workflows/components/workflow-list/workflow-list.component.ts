import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewChildren } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { WorkflowService } from '../../services/workflow.service';
import { WorkflowModel } from "../../models/workflow-model";
import { MatDialog } from "@angular/material/dialog";
import * as _ from "underscore";


@Component({
  selector: "app-workflow-list",
  templateUrl: "workflow-list.component.html",
})

export class WorkflowListComponent extends CustomAppBaseComponent implements OnInit {
  @Input()
  set companyModuleId(data: any) {
    if (data) {
      this.moduleId = data;
      if (this.moduleId) {
        this.getWorkflows();
      }
    }
  }

  @Input()
  set selectedFormIds(data: any) {
    this.customFormIds = data;
    console.log(this.customFormIds);
    if (this.customFormIds) {
      this.getWorkflows();
    }
  }

  //@ViewChildren("editActivityPopUp") editActivityPopover;
  @ViewChildren("deleteWorkflowPopover") deleteWorkflowPopover;
  @ViewChild('addWorkflowDialog') addWorkflowDialog: TemplateRef<any>;
  @Output() emitMailEvent = new EventEmitter<any>();
  form: FormGroup;
  isArchived: boolean = false;
  isEdit: boolean;
  searchText: any;
  moduleId: string;
  customFormIds: any;
  formIds: any[] = [];
  upsertInProgress: any;
  deleteOperationIsInprogress: any;
  public sort: SortDescriptor[] = [{
    field: 'workflowName',
    dir: 'asc'
  }];
  validationMessage: any;
  workflows: any = [];
  temp: any;
  priorityData: any;
  deleteWorkflowDetails: any;
  isLoading: boolean;
  constructor(private toaster: ToastrService, private workflowService: WorkflowService,
    public dialog: MatDialog) {
    super();

  }
  ngOnInit() {
    this.clearForm();
    if (!this.moduleId && !this.selectedFormIds) {
      this.getWorkflows();
    }

  }
  getWorkflows() {
    this.isLoading = true;
    let wf = new WorkflowModel();
    wf.isArchived = this.isArchived;
    wf.companyModuleId = this.moduleId;
    //wf.formIds = this.customFormIds;
    this.workflowService.getWorkflows(wf).subscribe((result: any) => {
      if (result.success) {
        if (this.customFormIds) {
          let workflows = result.data;
          let selectedFormIds = this.customFormIds.split(",");
          let filteredList = _.filter(workflows, function (filter) {
            return selectedFormIds.includes(filter.formTypeId)
          })
          if (filteredList.length > 0) {
            this.workflows = filteredList;
            this.temp = this.workflows;
          } else {
            this.workflows = [];
            this.temp = [];
          }
        } else {
          this.workflows = result.data;
          this.temp = result.data;
        }
        this.getMailWorkflows();
      }
      else {
        this.workflows = [];
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
      this.isLoading = false;
    })
  }
  clearForm() {
    this.form = new FormGroup({
      activityName: new FormControl(null),
      description: new FormControl(null),
      inputs: new FormControl(null)
    })
  }

  changeArchiveWorkflow(value) {
    this.isArchived = value;
    this.getWorkflows();
  }

  deleteWorkflowItem(data, deletePopover) {
    this.deleteWorkflowDetails = data;
    deletePopover.openPopover();
  }

  removeWorkflowAtIndex(value) {
    this.deleteOperationIsInprogress = true;
    let wfModel = new WorkflowModel();
    wfModel = Object.assign({}, this.deleteWorkflowDetails);
    wfModel.dataJson = JSON.stringify(wfModel.dataJson);
    wfModel.isArchived = value;
    this.workflowService.UpdateWorkflow(wfModel).subscribe((result: any) => {
      if (result.success) {
        this.deleteWorkflowDetails = null;
        this.deleteOperationIsInprogress = false;
        this.getWorkflows();
        this.closeDeleteWorkflowDialog();
      }
      else {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
        this.deleteOperationIsInprogress = false;
      }
    });
  }

  closeDeleteWorkflowDialog() {
    this.deleteWorkflowDetails = null;
    this.deleteWorkflowPopover.forEach((p) => p.closePopover());
  }

  changeArchiveActivity(value) {
    this.isArchived = value;
    this.getWorkflows();
  }

  addWorkflow() {
    const dialogRef = this.dialog.open(this.addWorkflowDialog, {
      width: "95vw",
      height: "90vh",
      maxWidth: "95vw",
      disableClose: true,
      id: "add-workflow-dialog",
      data: { isEdit: false, formPhysicalId: "add-workflow-dialog", companyModuleId: this.moduleId, customFormsIds: this.customFormIds }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isEdit = false;
      if (result) {
        this.getWorkflowBasedOnId(result.id, false);
      }
    });
  }

  editWorkflow(data) {
    this.isEdit = true;
    this.priorityData = data;
    const dialogRef = this.dialog.open(this.addWorkflowDialog, {
      width: "95vw",
      height: "90vh",
      maxWidth: "95vw",
      disableClose: true,
      id: "edit-workflow-dialog",
      data: { editWorkflowDetails: data, isEdit: true, formPhysicalId: "edit-workflow-dialog", companyModuleId: this.moduleId }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isEdit = false;
      if (result) {
        this.getWorkflowBasedOnId(result.id, true);
      }
    });
    //this.form.patchValue(data);
  }
  getWorkflowBasedOnId(id, isEdit) {
    this.isLoading = true;
    let wf = new WorkflowModel();
    wf.isArchived = this.isArchived;
    wf.id = id;
    this.workflowService.getWorkflows(wf).subscribe((result: any) => {
      if (result.success && result.data.length > 0) {
        if (isEdit) {
          var index = this.workflows.findIndex(x => x.id == id);
          this.workflows[index] = result.data[0];
        } else {
          this.workflows.unshift(result.data[0]);
        }
        this.temp = result.data;
      }
      else {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
      this.isLoading = false;
      this.getMailWorkflows();
    })
  }
  filterByName(event) {
    if (event != null) {
      this.searchText = event.target.value.toLowerCase();
      this.searchText = this.searchText.trim();
    }
    else {
      this.searchText = "";
    }
    const values = this.temp.filter((p => (p.workflowName.toLowerCase().indexOf(this.searchText) > -1)
      || (p.description ? p.description.toLowerCase().indexOf(this.searchText) > -1 : null) ||
      (p.formName ? p.formName.toLowerCase().indexOf(this.searchText) > -1 : null)));
    this.workflows = values;
  }

  closeSearch() {
    this.searchText = "";
    const values = this.temp.filter((p => (p.workflowName.toLowerCase().indexOf(this.searchText) > -1)
      || (p.description ? p.description.toLowerCase().indexOf(this.searchText) > -1 : null) ||
      (p.formName ? p.formName.toLowerCase().indexOf(this.searchText) > -1 : null)));
    this.workflows = values;
  }

  // closePopup() {
  //     this.editActivityPopover.forEach((p) => p.closePopover());
  // }

  // openAddPopover(priorityPopup) {
  //     this.isEdit = false;
  //     priorityPopup.openPopover();
  // }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.workflows = orderBy(this.workflows, this.sort)
  }

  getMailWorkflows() {
    let count = 0;
    let mailWorkflows: any[] = [];
    let mailWorkflowIds: any;
    let workflows = this.workflows;
    workflows.forEach((flow) => {
      let workflowItems = JSON.parse(flow.dataJson.workflowItems);
      let filteredList = _.filter(workflowItems, function (item) {
        return item.type == 1 && item.isRedirectToEmails == true
      })
      if (filteredList.length > 0) {
        count = count + filteredList.length;
        mailWorkflows.push(flow);
      }
    })
    let workflowIds = mailWorkflows.map(x => x.id);
    mailWorkflowIds = workflowIds.join(",");
    this.emitMailEvent.emit({ mailsCount: count, isArchivedWorkflows: this.isArchived, mailWorkflowIds: mailWorkflowIds });
  }
}