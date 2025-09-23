import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatOption } from "@angular/material/core";
import { Store } from "@ngrx/store";
import { State } from "../../store/reducers/index";
import { Actions } from "@ngrx/effects";
import { Router, ActivatedRoute } from "@angular/router";
import { Subject, Observable } from "rxjs";
import '../../../globaldependencies/helpers/fontawesome-icons';
import { CommonService } from '../../services/common-used.service';
import { WorkspaceList } from '../../models/workspaceList';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExportConfigurationModel } from '../../models/export-configuration-model';
import { ToastrService } from 'ngx-toastr';
import { ExportDataModel } from '../../models/export-data.module';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: "export-configuration-dialog",
  templateUrl: "./export-configuration-dialog.component.html"
})

export class ExportConfigurationDialogComponent implements OnInit {

  @ViewChild("allModuleSelected") private allModuleSelected: MatOption;
  @ViewChild("allDataSelected") private allDataSelected: MatOption;

  public ngDestroyed$ = new Subject();
  workspacesfetchInProgress: boolean = false;
  workspacesList$: Observable<WorkspaceList[]>;
  workspaces: WorkspaceList[];
  exportDataLoading: boolean = false;
  exportForm: FormGroup;
  selectedWorkSpaceIds: string[] = [];
  dataIds: string[] = [];
  selectedDataIds: any;
  exportDataModelNames: string[] = [];
  selectedExportDataModelNames: any;
  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }

  exportDataModel: ExportDataModel[] = [
    {
      id: 1,
      displayName: 'Form types',
      modelName: 'FormTypes'
    },
    {
      id: 2,
      displayName: 'Roles',
      modelName: 'Roles'
    },
    {
      id: 3,
      displayName: 'Entity roles',
      modelName: 'EntityRoleOutputModels'
    },
    {
      id: 4,
      displayName: 'Work item types',
      modelName: 'WorkItemTypes'
    },
    {
      id: 5,
      displayName: 'Board type apis',
      modelName: 'BoardTypeApis'
    },
    {
      id: 6,
      displayName: 'Board types',
      modelName: 'BoardTypes'
    },
    {
      id: 7,
      displayName: 'Work item statuses',
      modelName: 'WorkItemStatuses'
    },
    {
      id: 8,
      displayName: 'Work item sub types',
      modelName: 'WorkItemSubTypes'
    },
    {
      id: 9,
      displayName: 'Project types',
      modelName: 'ProjectTypes'
    },
    {
      id: 10,
      displayName: 'WorkFlow and status',
      modelName: 'WorkFlowAndStatusModel'
    },
    {
      id: 11,
      displayName: 'Projects',
      modelName: 'Projects'
    },
    {
      id: 12,
      displayName: 'Goals',
      modelName: 'GoalTemplates'
    },
    {
      id: 13,
      displayName: 'User stories',
      modelName: 'TemplateUserStories'
    },
    {
      id: 14,
      displayName: 'Master question types',
      modelName: 'MasterQuestionTypes'
    },
    {
      id: 15,
      displayName: 'Question types',
      modelName: 'QuestionTypes'
    },
    {
      id: 16,
      displayName: 'Audits',
      modelName: 'AuditsList'
    },
    {
      id: 17,
      displayName: 'Audit categories',
      modelName: 'AuditCategories'
    },
    {
      id: 18,
      displayName: 'Audit category questions',
      modelName: 'AuditCategoryQuestions'
    },
    {
      id: 19,
      displayName: 'Payroll components',
      modelName: 'PayrollComponents'
    },
    {
      id: 20,
      displayName: 'Payroll templates',
      modelName: 'PayrollTemplates'
    }, {
      id: 21,
      displayName: 'Payroll template configurations',
      modelName: 'PayrollTemplateConfigurations'
    },
    {
      id: 22,
      displayName: 'Professional tax range',
      modelName: 'ProfessionalTaxRange'
    },
    {
      id: 23,
      displayName: 'Tax slabs',
      modelName: 'TaxSlabs'
    },
    {
      id: 24,
      displayName: 'Custom fields',
      modelName: 'CustomFields'
    },
    {
      id: 26,
      displayName: 'System apps',
      modelName: 'SystemApps'
    },
    {
      id: 27,
      displayName: 'Custom apps',
      modelName: 'CustomApps'
    }
  ].sort((a, b) => a.displayName.localeCompare(b.displayName));

  constructor(public dialogRef: MatDialogRef<ExportConfigurationDialogComponent>, private route: ActivatedRoute,
    private store: Store<State>, private actionUpdates$: Actions, private router: Router,
    private commonService: CommonService,
    private toaster: ToastrService,
    private cookieService: CookieService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit() {
    this.loadWorkspacesList();
    this.clearForm()
  }

  CancelExportDialog() {
    this.dialogRef.close({ delete: false });
  }
  loadWorkspacesList() {
    this.workspacesfetchInProgress = true;
    var workSpaceList = new WorkspaceList();
    workSpaceList.workspaceId = "null";
    this.commonService.GetWorkspaceList(workSpaceList).subscribe((result: any) => {
      this.workspaces = result.data;
      this.workspacesfetchInProgress = false;
    });
  };

  ExportData() {
    this.exportDataLoading = true;
    var exportConfigurationModel = new ExportConfigurationModel();
    exportConfigurationModel.isExportDashboard = this.exportForm.get("isExportDashboard").value;
    exportConfigurationModel.isExportConfiguration = this.exportForm.get("isExportConfiguration").value;
    exportConfigurationModel.isExportData = this.exportForm.get("isExportData").value;
    exportConfigurationModel.workspaceIds = this.exportForm.get("workspaceIds").value;
    exportConfigurationModel.exportDataModelIds = this.exportForm.get("exportDataModelIds").value;
    this.commonService.GetExportData(exportConfigurationModel).subscribe((response: any) => {
      if (response.success === true) {
        this.dynamicDownloadJson(response);
      }
      else {
        this.toaster.error(response.apiResponseMessages[0].message);
      }
      this.exportDataLoading = false;
    });

  }

  toggleWorkspacePerOne() {
    if (this.allModuleSelected.selected) {
      this.allModuleSelected.deselect();
      return false;
    }
    if (
      this.exportForm.get("workspaceIds").value.length === this.workspaces.length
    ) {
      this.allModuleSelected.select();
    }
  }

  toggleAllWorkSpaceSelected() {
    if (this.allModuleSelected.selected && this.workspaces) {
      this.exportForm.get("workspaceIds").patchValue([
        ...this.workspaces.map((item) => item.workspaceId),
        0
      ]);
      this.selectedWorkSpaceIds = this.workspaces.map((item) => item.workspaceId);
    } else {
      this.exportForm.get("workspaceIds").patchValue([]);
    }
  }

  compareSelectedWorkspaceFn(workspacesList: any, workspaceId: any) {
    if (workspacesList === workspaceId) {
      return true;
    } else {
      return false;
    }
  }

  toggleExportDataModelIdsPerOne() {
    if (this.allDataSelected.selected) {
      this.allDataSelected.deselect();
      return false;
    }
    if (
      this.exportForm.get("exportDataModelIds").value.length === this.exportDataModel.length
    ) {
      this.allDataSelected.select();
    }
  }

  toggleAllExportDataModelIdsSelected() {
    if (this.allDataSelected.selected && this.exportDataModel) {
      this.exportForm.get("exportDataModelIds").patchValue([
        ...this.exportDataModel.map((item) => item.id),
        0
      ]);
      this.selectedDataIds = this.exportDataModel.map((item) => item.id);
      this.selectedExportDataModelNames = this.exportDataModel.map((item) => item.modelName);
    } else {
      this.exportForm.get("exportDataModelIds").patchValue([]);
    }
  }

  compareSelectedExportDataModelIdsFn(dataList: any, dataId: any) {
    if (dataList === dataId) {
      return true;
    } else {
      return false;
    }
  }

  clearForm() {
    this.exportForm = new FormGroup({
      workspaceIds: new FormControl(null,
        Validators.compose([])
      ),
      isExportConfiguration: new FormControl(null,
        Validators.compose([])
      ),
      isExportDashboard: new FormControl(null,
        Validators.compose([])
      ),
      isExportData: new FormControl(null,
        Validators.compose([])
      ),
      exportDataModelNames: new FormControl(null,
        Validators.compose([])
      ),
      exportDataModelIds: new FormControl(null,
        Validators.compose([])
      ),
    });
  }

  selectedWorkspaces() {
    if (this.exportForm.get("isExportDashboard").value) {
      this.exportForm.get("workspaceIds").patchValue([
        ...this.workspaces.map((item) => item.workspaceId),
        0
      ]);
    }
    else {
      this.exportForm.get("workspaceIds").patchValue([]);
    }

  }

  selectedData() {
    if (this.exportForm.get("isExportData").value) {
      this.exportForm.get("exportDataModelIds").patchValue([
        ...this.exportDataModel.map((item) => item.id),
        0
      ]);
    }
    else {
      this.exportForm.get("exportDataModelIds").patchValue([]);
    }

  }

  dynamicDownloadJson(responseData) {
    let companyName = this.cookieService.get(LocalStorageProperties.CompanyName);
    if (companyName == null)
      companyName = 'My report';
    this.dynamicDownloadByHtmlTag({
      fileName: companyName + '.json',
      text: JSON.stringify(responseData)
    });
  }

  private dynamicDownloadByHtmlTag(arg: {
    fileName: string,
    text: string
  }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);

    var event = new MouseEvent("click");
    element.dispatchEvent(event);
    this.toaster.success("Configure data exported successfully");
    this.CancelExportDialog();
  }

  checkExportIsConfigure() {
    var dataIds = this.exportForm.get("exportDataModelIds").value;
    var dashboardIds = this.exportForm.get("workspaceIds").value;
    if ((this.exportForm.get("isExportDashboard").value || (dashboardIds != undefined && dashboardIds.length > 0)) || this.exportForm.get("isExportConfiguration").value || (this.exportForm.get("isExportData").value || (dataIds != undefined && dataIds.length > 0)))
      return false;
    else
      return true;

  }

}
