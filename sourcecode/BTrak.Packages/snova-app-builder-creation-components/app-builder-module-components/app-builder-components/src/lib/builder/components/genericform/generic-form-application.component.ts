import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, ViewChildren, ElementRef } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { DataStateChangeEvent, GridComponent, PageChangeEvent } from "@progress/kendo-angular-grid";
import { ToastrService } from "ngx-toastr";
import * as _ from "underscore";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { CustomApplicationKeySearchModel } from "./models/custom-application-key-search.model";
import { CustomApplicationSearchModel } from "./models/custom-application-search.model";
import { GenericFormSubmitted } from "./models/generic-form-submitted.model";
import { GenericFormService } from "./services/generic-form.service";
import { State } from '@progress/kendo-data-query';
import { TranslateService } from "@ngx-translate/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConstantVariables } from "../../../globaldependencies/constants/constant-variables";
import { DatePipe } from "@angular/common";
import { WidgetService } from "../../services/widget.service";
import { Persistance } from "../../models/persistance.model";
import { PersistanceService } from "../../services/persistance.service";
import { SearchFilterPipe } from "../../pipes/search-filter.pipe";
import { LocalStorageProperties } from "../../../globaldependencies/constants/localstorage-properties";

@Component({
  selector: "app-generic-application",
  templateUrl: "./generic-form-application.html"
})

export class GenericFormApplicationComponent extends CustomAppBaseComponent implements OnInit {
  @ViewChildren("shareFormPopover") sharePopUps;
  @ViewChild("genericApplicationComponent") genericApplicationComponent: TemplateRef<any>;
  @ViewChild("genericFormImportDialogComponent") genericFormImportDialogComponent: TemplateRef<any>;
  @ViewChild("deleteMultipleRecordsPopUp") deleteMultipleRecordsPopUp: TemplateRef<any>;
  @ViewChild("grid") public excelGrid: GridComponent;
  @ViewChildren("deleteTemplatePopUp") deleteTemplatePopover;
  @ViewChildren("deleteMultiplePopUp") deleteMultiplePopUp;
  dateType: any;
  isAnyOperationIsInprogress: any;
  isArchived: any;
  maxDate = new Date();
  minDate = new Date(1753, 0, 1);
  minDateForEndDate = new Date();
  endDateBool: boolean = true;
  tempDateFrom: string;
  tempDateTo: string;
  applicationId: string;
  applicationForms: any = [];
  uploadProfileImageInProgress = false;
  customApplicationName: string;
  isFormLoading = true;
  columns: any = [];
  selectedform: any;
  customAppHeaders: any[];
  anyOperationInProgress = false;
  isUploadInProgress: boolean;
  customApplicationSearchModel: CustomApplicationSearchModel;
  public grid: GridComponent;
  selected = new FormControl(0);
  state: State = {
    skip: 0,
    take: 10,
  };
  isExcel: boolean = false;
  totalCount: number;
  disableSubmit = false;
  genericForm: GenericFormSubmitted;
  refreshExcel: boolean;
  customApplicationKeySearchModel: CustomApplicationKeySearchModel;
  workflowIds : string;
  public buttonCount = 5;
  public info = true;
  public type: "numeric" | "input" = "numeric";
  public pageSizes = true;
  public previousNext = true;
  importedData: any[];
  Invoices = ["Invoice1", "Invoice2", "Invoice3"];
  BillOfLadings = ["BL1", "BL2", "BL3", "BL4"];
  contractId = "23462723";
  rowDetails: any;
  dateFrom: any;
  dateTo: any;
  date: any;
  dateValue: any;
  isFiltersApplied: boolean;
  customAppPersistance: any;
  loadTable: boolean;
  loadRecords: number;
  min: number = 10;
  max: number = 99;
  excelDownload: boolean;
  dataSourceId: any;
  dateFilters: { dateFrom: any; dateTo: any; };
  isRedirectToEmails: boolean;
  isValidate: boolean;
  isMailLoading: boolean;
  allowAnnonymous:boolean = false;
  deleteRecordValues=[];
  deleteMultipleRecordsPopupId :string ="delete-multiple-records";
  showArchivedRecords:boolean =false;
  isRecordLevelPermissionEnabled : boolean;
  recordLevelPermissionFieldName : string;
  isApproveNeeded: boolean;
  conditionalEnum: any;
  conditionsJson: string;
  userModel: any;
  userRoleIds: any;
  // tslint:disable-next-line: max-line-length
  constructor(private route: ActivatedRoute, private datePipe: DatePipe, public dialog: MatDialog, private snackbar: MatSnackBar, private translateService: TranslateService,
    private toastr: ToastrService, private genericFormService: GenericFormService, private cdRef: ChangeDetectorRef, private persistanceService: PersistanceService,
    private widgetService: WidgetService, private searchFilterPipe: SearchFilterPipe) {
    super();
    this.loadTable = false;
    this.refreshExcel = false;
    this.userModel = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModel));
    this.userRoleIds = this.userModel?.roleIds;
    this.route.params.subscribe((params) => {
      this.applicationId = params["id"];
      if (this.applicationId) {
        this.isFormLoading = true;
        this.customApplicationSearchModel = new CustomApplicationSearchModel();
        this.customApplicationSearchModel.customApplicationId = JSON.parse(JSON.stringify(this.applicationId));
        this.genericFormService.getCustomApplication(this.customApplicationSearchModel).subscribe((result: any) => {
          this.applicationForms = result.data;
          this.customApplicationName = result.data[0].customApplicationName;
          this.isRedirectToEmails = result.data[0].isRedirectToEmails;
          this.workflowIds = result.data[0].workflowIds;
          this.allowAnnonymous = result.data[0].allowAnnonymous;
          this.isRecordLevelPermissionEnabled = result.data[0].isRecordLevelPermissionEnabled;
          this.recordLevelPermissionFieldName = result.data[0].recordLevelPermissionFieldName;
          this.isApproveNeeded = result.data[0].isApproveNeeded;
          this.conditionalEnum = result.data[0].conditionalEnum;
          this.conditionsJson = result.data[0].conditionsJson;
          this.isFormLoading = false;;
          this.selected.setValue(0);
          this.selectedMatTab(0);
        });
      }
    });
    
  }

 

  getApplicationById() {
    this.isFormLoading = true;
    this.customApplicationSearchModel = new CustomApplicationSearchModel();
    this.customApplicationSearchModel.customApplicationId = JSON.parse(JSON.stringify(this.applicationId));
    this.genericFormService.getCustomApplication(this.customApplicationSearchModel).subscribe((result: any) => {
      this.applicationForms = result.data;
      this.customApplicationName = result.data[0].customApplicationName;
      this.isRedirectToEmails = result.data[0].isRedirectToEmails;
      this.isRecordLevelPermissionEnabled = result.data[0].isRecordLevelPermissionEnabled;
      this.recordLevelPermissionFieldName = result.data[0].recordLevelPermissionFieldName;
      this.conditionalEnum = result.data[0].conditionalEnum;
      this.conditionsJson = result.data[0].conditionsJson;
      this.isFormLoading = false;
      this.selected.setValue(0);
      this.selectedMatTab(0);
    });
  }

  pageChange({ skip, take }: PageChangeEvent, form): void {
    form.skip = skip;
    form.pageSize = take;
    this.state.skip = skip;
    this.state.take = take;
    this.getAllReportsSubmitted(form);
    //this.loadData(form.gridDataResult, form);
  }

  getAllKeys(form) {
    this.anyOperationInProgress = true;
    this.customApplicationKeySearchModel = new CustomApplicationKeySearchModel();
    this.customApplicationKeySearchModel.customApplicationId = this.applicationId;
    this.genericFormService.getFormKeysByFormId(form.formId).subscribe((genericFormKeys: any) => {
      const formAllKeys = genericFormKeys.data;
      this.genericFormService.getCustomApplicationKeys(this.customApplicationKeySearchModel).subscribe((result1: any) => {
        this.anyOperationInProgress = false;
        if (result1.data != null) {
          const formKeys = result1.data;
          this.makeColumns(form, formAllKeys, formKeys);
          this.getAllReportsSubmitted(form);
        }
      });
    });
  }

  makeColumns(form, formAllKeys, formKeys) {
    const keyColumns = [];
    let orderIndex = 0;
    keyColumns.push({ field: "uniqueNumber", title: "Unique Number", hidden: false, type: "text", orderIndex: orderIndex++ });
    const fromJson = JSON.parse(form.formJson);
    _.forEach(formAllKeys, (formKey: any) => {
      if (fromJson !== undefined && fromJson != null) {
        let updatedNewComponents = [];
        let formComponentsList = [];
        let formComponents = fromJson.Components;
        if (formComponents && formComponents.length > 0) {
          formComponents.forEach((comp) => {
            let values = [];
            let keys = Object.keys(comp);
            keys.forEach((key) => {
              values.push(comp[key]);
              let updatedKeyName = key.charAt(0).toLowerCase() + key.substring(1);
              console.log(updatedKeyName);
              let idx = keys.indexOf(key);
              if (idx > -1) {
                keys[idx] = updatedKeyName;
              }
            })
            var updatedModel = {};
            for (let i = 0; i < keys.length; i++) {
              updatedModel[keys[i]] = values[i];
            }
            updatedNewComponents.push(updatedModel);
          })
          formComponentsList = updatedNewComponents;
        }
        // formUtils.eachComponent(formComponentsList, (column) => {
        // if (column["key"] === formKey.key) {
        // const title = column["label"];
        let isItSelected = true;
        if (formKeys) {
          isItSelected = _.find(formKeys, (x: any) => {
            return x["key"] === formKey.key && x.isDefault;
          }) != null;
        }
        keyColumns.push({ field: "" + formKey.key, title: formKey["label"], hidden: !isItSelected, type: "text", format: formKey.format, orderIndex: orderIndex++ });
        // }
        // }, false);
      }
    });
    keyColumns.push({ field: "isApproved", title: "Is Approved", hidden: false, type: "text", orderIndex: orderIndex++ });
    keyColumns.push({ field: "Created User", title: "Created User", hidden: false, type: "text", orderIndex: orderIndex++ });
    keyColumns.push({ field: "Updated User", title: "Updated User", hidden: false, type: "text", orderIndex: orderIndex++ });
    keyColumns.push({ field: "Created Date", title: "Created Date", hidden: false, type: "text", orderIndex: orderIndex++ });
    keyColumns.push({ field: "Updated Date", title: "Updated Date", hidden: false, type: "text", orderIndex: orderIndex++ });
    keyColumns.push({ field: "status", title: "Status", hidden: false, type: "text", orderIndex: orderIndex++ });
    if (this.customAppPersistance != null && this.customAppPersistance != undefined) {
      let persistColumns = this.customAppPersistance;
      let i = 0;
      _.forEach(persistColumns, (persistColumn: any) => {
        _.forEach(keyColumns, (column: any) => {
          if (column["field"] === persistColumn["field"]) {
            column["orderIndex"] = i;
            i++;
          }
        })
      })
      form.columns = _.sortBy(keyColumns, "orderIndex");
    } else {
      form.columns = _.sortBy(keyColumns, "orderIndex");
    }
  }
  uploadEventHandler(event: any) {
    console.log(this.selectedform);
    if (event.target.files.length > 0) {
      const file = event.target.files.item(0);
      const formData = new FormData();
      formData.append("file", file);
      this.uploadProfileImageInProgress = true;
      this.genericFormService.ImportFormDataFromExcel(formData, this.applicationId, this.selectedform.formName)
        .subscribe((responseData: any) => {
          console.log(responseData.data);
          let data = JSON.stringify(responseData.data);
          this.uploadProfileImageInProgress = false;
          const success = responseData.success;
          if (success) {
            let dialogId = "generic-form-import-dialog-component";
            const dialogRef = this.dialog.open(this.genericFormImportDialogComponent, {
              minWidth: "85vw",
              height: "90%",
              id: dialogId,
              data: { data: data, formPhysicalId: dialogId }
            });
            dialogRef.afterClosed().subscribe((result) => {
              this.saveImportFunctionality(result);
            })
          } else {
            this.toastr.warning("", responseData.apiResponseMessages[0].message);
          }
        });
    }
  }

  selectedMatTab(event) {
    this.selectedform = this.applicationForms[event];
    this.selectedform.gridData = { data: [], total: 0 };
    this.selectedform.pageSize = 10;
    this.selectedform.skip = 0;
    this.selectedform.gridDataResult = { data: [], total: 0 };
    this.dataSourceId = this.selectedform.dataSourceId;
    this.getAllKeys(this.selectedform);
    this.loadTable = true;
    this.refreshExcel = false;
    this.cdRef.detectChanges();
  }

  saveImportFunctionality(data) {
    if (data) {
      data.customApplicationId = this.applicationId;
      this.anyOperationInProgress = true;
      this.genericFormService.importValidatedAppData(data)
        .subscribe((responseData: any) => {
          this.anyOperationInProgress = false;
          console.log(responseData.data);
          const success = responseData.success;
          if (success) {
            this.applicationForms.forEach((form) => {
              this.refreshExcel = true;
              this.cdRef.detectChanges();

              //this.getAllReportsSubmitted(form);
            });
          } else {
            this.toastr.warning("", responseData.apiResponseMessages[0].message);
          }
        });
    }
  }

  private loadData(gridDataResult, form): void {
    this.anyOperationInProgress = true;
    form.gridData = {
      data: gridDataResult.data,
      total: this.totalCount
    };
    this.anyOperationInProgress = false;
    this.cdRef.detectChanges();
    if (this.isExcel) {
      this.excel();
    }
  }

  refreshEvent(event) {
    this.refreshExcel = false;
    this.cdRef.detectChanges();
  }

  getAllReportsSubmitted(form, isFromDuplicate?,archived?) {
    this.anyOperationInProgress = true;
    let pageNumber;
    let pageSize;
    let isPagingRequired;
    if (!this.isExcel) {
      pageNumber = (this.state.skip / this.state.take) + 1;
      pageSize = this.state.take;
      isPagingRequired = true;
    }
    this.genericFormService.GetSubmittedReportsByFormId(this.applicationId, form.formId, null, archived, pageNumber, pageSize, isPagingRequired, this.dateFrom, this.dateTo,"",false,"",this.recordLevelPermissionFieldName,this.isRecordLevelPermissionEnabled, this.conditionalEnum,this.conditionsJson, this.userRoleIds ).subscribe((result: any) => {
      this.anyOperationInProgress = false;
      console.log(result);
      if (result.success && isFromDuplicate) {
        // if(this.dateFrom && this.dateTo) {
        //   this.isFiltersApplied = true;
        // } else {
        //   this.isFiltersApplied = false;
        // }
        this.editHandler(result.data[0], this.selectedform);
      }
      if (result.success === false) {
        const validationMessage = result.apiResponseMessages[0].message;
        this.toastr.error(validationMessage);
      }
      form.applicationSubmitted = result.data;
      this.totalCount = result.data ? result.data.length > 0 ? result.data[0].totalCount : 0 : 0;
      this.makeDataSetResult(form);
      this.cdRef.detectChanges();
    });
  }

  // public exportToExcel(grid: GridComponent, form): void {
  //   this.anyOperationInProgress = true;
  //   let exportgrid: GridComponent;
  //   exportgrid = grid;
  //   exportgrid.data = this.selectedform.gridDataResult.data;
  //   exportgrid.saveAsExcel();
  //   this.loadData(this.selectedform.gridDataResult, form);
  //   this.anyOperationInProgress = false;
  // }

  editHandler(dataItem, form) {
    this.createANewform(this.applicationId, dataItem, form, true, true)
  }

  removeHandler() { }

  makeDataSetResult(form) {
    this.anyOperationInProgress = true;
    const dataResult = [];
    let appsubmitted = [];
    appsubmitted = form.applicationSubmitted;
    appsubmitted.forEach((genericFormData) => {
      const formJsonData = JSON.parse(genericFormData.formJson);
      formJsonData["genericFormSubmittedId"] = genericFormData.genericFormSubmittedId;
      formJsonData["uniqueNumber"] = genericFormData.uniqueNumber;
      formJsonData["status"] = genericFormData.status;
      formJsonData["isApproved"] = genericFormData.isApproved;
      formJsonData["isApproveNeeded"] = genericFormData.isApproveNeeded;
      dataResult.push(formJsonData);
    });
    form.gridDataResult = { data: dataResult, total: form.applicationSubmitted.length }
    this.loadData(form.gridDataResult, form);
    this.anyOperationInProgress = false;
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  createANewform(formId, submittedForm, form, isEdit, isEditMain) {
    const application = new GenericFormSubmitted();
    application.customApplicationId = formId;
    application.formJson = JSON.parse(form.formJson);
    application.formData = submittedForm;
    application.formId = form.formId
    application.genericFormName = form.formName;
    application.genericFormSubmittedId = submittedForm.genericFormSubmittedId;
    application.isAbleToLogin = form.isAbleToLogin;
    //application.dataSourceId = this.dataSourceId;
    let dialogId = "generic-application-component";
    const dialogRef = this.dialog.open(this.genericApplicationComponent, {
      height: "90%",
      width: "90%",
      id: dialogId,
      data: { application, isEdit: isEdit, isEditMain: isEditMain, formPhysicalId: dialogId ,allowAnnonymous:this.allowAnnonymous}
    });
    dialogRef.afterClosed().subscribe((result) => {
      // this.loadRecords=true;
    })
  }

  submitFinished() {
    // this.getAllReportsSubmitted(this.selectedform);
    this.loadRecords = this.randomNumber();
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
  }

  exportToExcel(grid: GridComponent, form): void {
    this.excelDownload = true;
    // this.isExcel = true;
    // this.getAllReportsSubmitted(this.selectedform);
    // this.state.take = this.selectedform.gridDataResult.data.totalCount;
    // this.cdRef.detectChanges();
  }
  excelDownloadCompleted(event) {
    this.excelDownload = false;
  }

  excel() {
    this.excelGrid.saveAsExcel();
    this.state.take = 20;
    this.isExcel = false;
    this.getAllReportsSubmitted(this.selectedform);
  }

  public onVisibilityChange(e: any): void {
    console.log(e);
    e.columns.forEach((column) => {
      this.selectedform.columns.find((col) => col.field === column.field).hidden = column.hidden;
    });
  }


  getDataSubmitted(dataItem) {
    const genericFormData = new GenericFormSubmitted();
    this.anyOperationInProgress = true;
    genericFormData.genericFormSubmittedId = dataItem.genericFormSubmittedId;
    genericFormData.isArchived = false;
    this.genericFormService.getSubmittedReportByFormReportId(genericFormData).subscribe((responses: any) => {
      if (responses.success == true) {
        this.duplicate(responses.data[0]);
      }
      this.anyOperationInProgress = false;
      this.cdRef.detectChanges();
    });
  }
  getDataSubmittedForApprove(dataItem) {
    if (dataItem.isApproveNeeded === true && (dataItem.isApproved === null || dataItem.isApproved === false)) {
      const genericFormData = new GenericFormSubmitted();
      this.anyOperationInProgress = true;
      genericFormData.genericFormSubmittedId = dataItem.genericFormSubmittedId;
      genericFormData.isArchived = false;
      this.genericFormService.getSubmittedReportByFormReportId(genericFormData).subscribe((responses: any) => {
        if (responses.success == true) {
          this.approveData(responses.data[0]);
        }
        this.anyOperationInProgress = false;
        this.cdRef.detectChanges();
      });
    } else {
      this.snackbar.open('This is already approved', "Ok", { duration: 3000 });
    }
  }
  approveData(data) {
    this.anyOperationInProgress = true;
    data.isApproved = true;
    this.genericFormService.submitGenericApplication(data).subscribe((result: any) => {
      if (result.success == true) {
        this.anyOperationInProgress = false;
        this.getAllReportsSubmitted(this.selectedform, false);
        this.snackbar.open(this.translateService.instant(ConstantVariables.SuccessMessageForFormSubmission), "Ok", { duration: 3000 });
      }
      if (result.success == false) {
        this.anyOperationInProgress = false;
        const validationMessage = result.apiResponseMessages[0].message;
        this.toastr.error(validationMessage);
      }
    })
  }
  duplicate(data) {
    this.anyOperationInProgress = true;
    this.genericForm = new GenericFormSubmitted();
    if (data.formName.toLowerCase() == 'm 13' || data.formName.toLowerCase() == 'm13') {
      let form = JSON.parse(data.formJson);
      if (form.masterInputDate) {
        form.masterInputDate = this.datePipe.transform(new Date(), 'MM/dd/yyyy');
      }
      this.genericForm.formJson = JSON.stringify(form);
    }
    else {
      this.genericForm.formJson = data.formJson;
    }
    this.genericForm.customApplicationId = data.customApplicationId;
    this.genericForm.formId = data.formId;
    this.genericForm.isAbleToLogin = null;
    this.genericForm['dataSourceId'] = data.formId;
    this.genericFormService.submitGenericApplication(this.genericForm).subscribe((result: any) => {
      if (result.success == true) {
        this.anyOperationInProgress = false;
        this.getAllReportsSubmitted(this.selectedform, true);
        this.snackbar.open(this.translateService.instant(ConstantVariables.SuccessMessageForFormSubmission), "Ok", { duration: 3000 });
      }
      if (result.success == false) {
        this.anyOperationInProgress = false;
        const validationMessage = result.apiResponseMessages[0].message;
        this.toastr.error(validationMessage);
      }
    })
  }

  deletePopUpOpen(popUp) {
    //this.rowDetails = rowDetails;
    popUp.openPopover();
  }
  closeDeletetemplateDialog() {
    this.deleteTemplatePopover.forEach((p) => p.closePopover());
  }
  deleteRecord() {
    this.widgetService.deleteDataSetById(this.rowDetails?.genericFormSubmittedId)
      .subscribe((res: any) => {
        if (res.success == true) {
          //apps.splice(apps.findIndex(a => a.id === itemToBeRemoved.id) , 1);
          if (this.applicationId) {
            this.isFormLoading = true;
            this.customApplicationSearchModel = new CustomApplicationSearchModel();
            this.customApplicationSearchModel.customApplicationId = JSON.parse(JSON.stringify(this.applicationId));
            this.genericFormService.getCustomApplication(this.customApplicationSearchModel).subscribe((result: any) => {
              this.applicationForms = result.data;
              this.customApplicationName = result.data[0].customApplicationName;
              this.isFormLoading = false;
              this.selected.setValue(0);
              this.selectedMatTab(0);
            });
          }
        }
        this.closeDeletetemplateDialog();
      })
  }
  onDateTypeChange() {
    if (this.dateType == 'date') {
      this.dateFrom = null;
      this.dateTo = null;
    } else if (this.dateType == 'dateRange') {
      this.date = null;
    }
  }
  dateChanged() {
    this.dateValue = null;
  }
  startDate() {
    if (this.dateFrom) {
      this.minDateForEndDate = new Date(this.dateFrom);
      this.endDateBool = false;
    } else {
      this.endDateBool = true;
      this.dateTo = null;
    }
  }
  openFilterPopover(filterPopover) {
    filterPopover.openPopover();
  }
  addFilter() {
    this.dateFilters = { dateFrom: this.dateFrom, dateTo: this.dateTo };
    this.isFiltersApplied = true;
    // this.getAllReportsSubmitted(this.selectedform);
  }
  removedynamicfilter() {
    this.isFiltersApplied = false;
    this.dateFrom = null;
    this.dateTo = null;
    this.endDateBool = true;
    this.maxDate = new Date();
    this.minDate = new Date(1753, 0, 1);
    this.getAllReportsSubmitted(this.selectedform);
  }
  onReorder(e: any): void {
    const reorderedColumn = this.selectedform.columns.splice(
      e.oldIndex,
      1
    );
    this.selectedform.columns.splice(e.newIndex, 0, ...reorderedColumn);
    const persistance = new Persistance();
    persistance.referenceId = this.selectedform.formId;
    persistance.isUserLevel = false;
    persistance.persistanceJson = JSON.stringify(this.selectedform.columns);
    this.persistanceService.UpsertPersistance(persistance).subscribe(() => {
    });
  }
  getPersistance() {
    if (this.selectedform.formId) {
      this.anyOperationInProgress = true;
      const persistance = new Persistance();
      persistance.referenceId = this.selectedform.formId;
      persistance.isUserLevel = false;
      this.persistanceService.GetPersistance(persistance).subscribe((response: any) => {
        if (response.success) {
          const data = response.data;
          if (data && data.persistanceJson) {
            this.anyOperationInProgress = false;
            this.customAppPersistance = JSON.parse(data.persistanceJson);
            this.getAllKeys(this.selectedform);
          } else {
            this.anyOperationInProgress = false;
            this.getAllKeys(this.selectedform);
          }
        } else {
          this.anyOperationInProgress = false;
          this.getAllKeys(this.selectedform);
          this.cdRef.detectChanges();
        }
      });
    }
  }
  randomNumber() {
    return Math.round(Math.random() * (this.max - this.min + 1) + this.min);
  }

  openSharePopUp(popUp) {
    popUp.openPopover();
  }

  closePopUp() {
    this.sharePopUps.forEach((p) => p.closePopover());
  }
  deleteMultipleRecordsValuesChange(deleteRecords){
    this.deleteRecordValues = deleteRecords;

  }

  closeDeleteMutipleDialog() {
    if(this.deleteMultiplePopUp)
    {
    this.deleteMultiplePopUp.forEach((p) => p.closePopover());
    }
  }

  deleteMultipleRecords(archive){
    var inputModel = {
      GenericFormSubmittedIds : this.deleteRecordValues,
      AllowAnonymous :this.allowAnnonymous,
      Archive:archive
    }
    this.widgetService.deleteMultipleDataSets(inputModel).subscribe((response: any) => {
      if (response.success) {
        if (archive == true) {
          if (this.deleteRecordValues.length == 1) {
            this.toastr.success("Record is archived");
          }
          else {
            this.toastr.success("Records are archived");
          }
        }
        else {
          if (this.deleteRecordValues.length == 1) {
            this.toastr.success("Record is deleted");
          }
          else {
            this.toastr.success("Records are deleted");
          }
        }
        this.closeDeleteMultipleRecordsPopUp()
        this.deleteRecordValues = [];
        this.loadRecords = this.randomNumber();
      } else {
        const validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error(validationMessage);  
      }
    });
  }

  unArchiveMultipleRecords(){
    var inputModel = {
      GenericFormSubmittedIds : this.deleteRecordValues,
      AllowAnonymous :this.allowAnnonymous,
      Archive:null
    }
    this.widgetService.unArchiveMultipleDataSets(inputModel).subscribe((response: any) => {
      if (response.success) {
        this.deleteRecordValues =[];
        this.toastr.success("Records are unarchived successfully"); 
        this.loadRecords = this.randomNumber();  
      } else {
        const validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error(validationMessage);  
      }
    });
  }

  deleteMultipleRecordsPopUpOpen(){
    const dialogRef = this.dialog.open(this.deleteMultipleRecordsPopUp, {
      minWidth: "auto",
      height: "auto",
      id: this.deleteMultipleRecordsPopupId,
      data: { }
    });
    
  }

  closeDeleteMultipleRecordsPopUp() {
    this.closeDeleteMutipleDialog();
    let docDialog = this.dialog.getDialogById(this.deleteMultipleRecordsPopupId);
    docDialog.close();

  }
  toggleArchivedRecords(archived){
    this.deleteRecordValues =[];
    this.showArchivedRecords = archived;
    //this.getAllReportsSubmitted(this.selectedform , null,archived )
    //this.loadRecords = this.randomNumber();
  }
  
}
