import { Component, Output, EventEmitter, ChangeDetectorRef, ViewChildren, Input, ViewChild, ElementRef, TemplateRef } from "@angular/core";
import { MatDialog} from "@angular/material/dialog";
import {  MatChipInputEvent } from "@angular/material/chips";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ExpenseManagementModel, ExpenseStatusModel } from "../models/expenses-model";
import { ExpenseManagementService } from "../expensemanagement.service";
import { ToastrService } from "ngx-toastr";
import { DataStateChangeEvent, RowArgs } from "@progress/kendo-angular-grid";
import { State } from "@progress/kendo-data-query";
import { ExpenseDetailsComponent } from '../components/expense-details.component';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryImageSize } from "ngx-gallery-9";
import { DatePipe } from "@angular/common";
import { AddExpenseDialogComponent } from "./add-expense-dialog.component";
import { WorkspaceDashboardFilterModel, SoftLabelConfigurationModel } from "../models/softLabels-model";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { AppBaseComponent } from './componentbase';
import { ConstantVariables } from '../constants/constant-variables';
import { FetchSizedAndCachedImagePipe } from '../pipes/fetchSizedAndCachedImage.pipe';
import { WidgetService } from '../services/widget.service';
import { StoreManagementService } from '../services/store-management.service';
import { Dashboard } from '../models/dashboard';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { SoftLabelPipe } from '../pipes/softlabels.pipes';
import '../../globaldependencies/helpers/fontawesome-icons'
import { Branch } from '../models/branch';
import { UserModel } from '../models/user';

@Component({
  selector: "app-billing-component-my-expenses",
  templateUrl: "my-expenses.component.html"
})

export class MyExpensesComponent extends AppBaseComponent {
  @ViewChildren("archiveExpensePopUp") archiveExpensePopover;
  @ViewChildren("approveExpensePopup") approveExpensePopOver;
  @ViewChildren("payExpensePopup") payExpensePopOver;
  @ViewChildren("rejectExpensePopUp") rejectExpensePopOver;
  @ViewChildren("mailInvoicePopover") mailInvoicesPopover;
  @ViewChild('tagInput') tagInput: ElementRef;
  @ViewChild("expenseDetailsComponent") expenseDetailsComponent: TemplateRef<any>;
  @ViewChild("upsertExpenseComponent") upsertExpenseComponent: TemplateRef<any>;

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  @Input("dashboardId")
  set _dashboardId(data: string) {
    if (data !== undefined && data !== this.dashboardId) {
      this.dashboardId = data;
      this.getExpenseDashboardFilter();
    } else if (!data) {
      this.getExpenseStatuses();
    }
  }

  @Input("dashboardName")
  set _dashboardName(data: string) {
    if (data != null && data !== undefined) {
      this.dashboardName = data;
      if (this.dashboardName == "My Expenses") {
        this.dashboardName = this.translateService.instant("EXPENSEMANAGEMENT.MYEXPENSES");
      }
    } else {
      this.dashboardName = this.translateService.instant("EXPENSEMANAGEMENT.MYEXPENSES");

    }
  }

  dashboardFilters: DashboardFilterModel;

  expensesList: any;
  selectedExpensesList: any = [];
  temp: any;
  isThereAnError: boolean = false;
  removable = true;
  selectable: boolean = true;
  searchText: string;
  validationMessage: string = '';
  toMail: string;
  ccMail: string;
  bccMail: string;
  statuses: any;
  isEdit: boolean = false;
  isAnyOperationIsInprogress: boolean = false;
  updatePersistanceInprogress: boolean = false;
  isArchived: boolean = false;
  isHistoryVisible: boolean = false;
  isUpsertExpenseInprogress: boolean = false;
  pdfOrMailOperationIsInprogress: boolean = false;
  downloadExpensesInprogress: boolean = false;
  expenseDetails = new ExpenseManagementModel();
  selectedExpenseDetails: any;
  sortBy: string;
  dashboardId: string;
  dashboardName: string;
  workspaceDashboardFilterId: string;
  claimedBy: string;
  branchId: string;
  changedAppName: string;
  kendoRowIndex: number;
  count = 0;
  sortDirection: boolean;
  isEditAppName: boolean = false;
  toMailsList: string[] = [];
  ccMailsList: string[] = [];
  bccMailsList: string[] = [];
  softLabels: SoftLabelConfigurationModel[];
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  imageExtensions: string[] = ["png", "jpeg", "jpg", "gif"];
  receiptsForAnOrder: any[] = [];
  receiptsPdfForAnOrder: any[] = [];
  @Output() change = new EventEmitter();
  @ViewChildren("showReceiptsPopUp") showReceiptsPopover;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedStatus: string[] = [];
  selection: any = [];
  selectedStatusName: string;
  expenses: any;
  expenseDateFrom: any;
  expenseDateTo: any;
  createdDateFrom: any;
  createdDateTo: any;
  minCreatedToDate: any;
  minExpenseToDate: any;
  employeeList: any;
  branchList: any;
  selectedUserName: string;
  selectedBranchName: string;
  selectableSettings = {
    checkboxOnly: true,
    mode: 'multiple'
  };
  state: State = {
    skip: 0,
    take: 10,
  };

  constructor(public dialog: MatDialog, private expenseService: ExpenseManagementService,
    private cdRef: ChangeDetectorRef, private toastr: ToastrService, private imagePipe: FetchSizedAndCachedImagePipe,
    private datePipe: DatePipe, private storeManagementService: StoreManagementService, private widgetService: WidgetService,
    private translateService: TranslateService,
    private softLabelPipe: SoftLabelPipe, private snackbar: MatSnackBar,) {
    super();
  }

  ngOnInit() {
    this.searchExpenses();
    super.ngOnInit();
    this.getBranchList();
    this.getAllUsers();
    if (!this.dashboardId) {
      this.getExpenseStatuses();
    }
    this.galleryOptions = [
      { image: false, height: "50px", width: "100%", thumbnailsPercent: 20, thumbnailSize: NgxGalleryImageSize.Contain, thumbnailsMargin: 0, thumbnailsColumns: 4, thumbnailMargin: 5 },
    ]
  }

  getBranchList() {
    const branchSearchResult = new Branch();
    branchSearchResult.isArchived = false;
    this.expenseService.getBranchDropdown(branchSearchResult).subscribe((response: any) => {
      this.branchList = response.data;
      this.cdRef.markForCheck();
    });
  }

  getAllUsers() {
    var userModel = new UserModel();
    userModel.isArchived = false;
    userModel.isActive = true;
    this.expenseService.getAllUsers(userModel).subscribe((responseData: any) => {
      this.employeeList = responseData.data;
    })
  }

  onActivate(event) {
    if (event.type == 'click') {
      this.change.emit();
      this.isEdit = !this.isEdit;
    }
  }

  onEdit(e) {
    this.isEdit = !this.isEdit;
  }

  searchExpenses() {
    this.isAnyOperationIsInprogress = true;
    var expenseModel = new ExpenseManagementModel();
    expenseModel.isArchived = this.isArchived;
    expenseModel.isMyExpenses = true;
    expenseModel.sortBy = this.sortBy;
    expenseModel.sortDirectionAsc = this.sortDirection;
    expenseModel.searchText = this.searchText;
    expenseModel.pageSize = this.state.take;
    expenseModel.expenseStatusId = this.selectedStatus == null ? null : this.selectedStatus.toString();
    expenseModel.expenseDateFrom = this.expenseDateFrom;
    expenseModel.expenseDateTo = this.expenseDateTo;
    expenseModel.createdDateTimeFrom = this.createdDateFrom;
    expenseModel.createdDateTimeTo = this.createdDateTo;
    expenseModel.branchId = this.branchId;
    expenseModel.claimedByUserId = this.claimedBy;
    expenseModel.pageNumber = (this.state.skip / this.state.take) + 1;
    this.expenseService.searchExpenses(expenseModel).subscribe((response: any) => {
      if (response.success == true) {
        let expenses = response.data;
        this.expenses = response.data;
        expenses.forEach(element => {
          element.expenseReceipts = element.receipts == null ? '' : element.receipts;
          if (element.expenseCategoriesConfigurations.length > 0) {
            for (let index = 0; index < element.expenseCategoriesConfigurations.length; index++) {
              if (element.expenseCategoriesConfigurations[index].receipts) {
                element.expenseReceipts = element.expenseReceipts + ',' + element.expenseCategoriesConfigurations[index].receipts;
              }
              if (element.expenseReceipts == '') {
                element.expenseReceipts = null;
              }
            }
          }
        });
        this.expensesList = {
          data: expenses,
          total: response.data.length > 0 ? response.data[0].totalCount : 0,
        };
        this.getSelectedExpensesFromCurrentPage();
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
      }
      else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
        this.isAnyOperationIsInprogress = false;
      }
      this.cdRef.detectChanges();
    });
  }

  closeSearch() {
    this.searchText = null;
    this.searchExpenses();
    this.updateExpenseDashboardFilter();
  }

  openCreateExpenseDialog(data: any) {
    let dialogId = "app-add-expense-dialog";
    const dialogRef = this.dialog.open(this.upsertExpenseComponent, {
      width: "75%",
      hasBackdrop: true,
      id: dialogId,
      panelClass: 'expense-dialog-scroll',
      direction: "ltr",
      data: { data, formPhysicalId: dialogId },
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.searchExpenses();
    });
  }

  archiveExpensePopupOpen(row, archiveExpensePopup) {
    this.selectedExpenseDetails = row;
    this.selectedExpenseDetails.isArchived = !this.isArchived;
    archiveExpensePopup.openPopover();
  }

  upsertExpense() {
    this.isUpsertExpenseInprogress = true;
    let expenseDetails = this.selectedExpenseDetails;
    this.expenseService.upsertExpense(expenseDetails).subscribe((response: any) => {
      if (response.success == true) {
        this.isUpsertExpenseInprogress = false;
        this.searchExpenses();
      }
      else {
        this.toastr.error(response.apiResponseMessages[0].message);
        this.isUpsertExpenseInprogress = false;
      }
    });
  }

  approveOrRejectExpense() {
    this.isUpsertExpenseInprogress = true;
    let expenseDetails = this.selectedExpenseDetails;
    this.expenseService.approveOrRejectExpense(expenseDetails).subscribe((response: any) => {
      if (response.success == true) {
        this.isUpsertExpenseInprogress = false;
        this.closeArchiveExpenseDialog();
        this.closeapproveExpensePopup();
        this.closerejectExpensePopUp();
        this.searchExpenses();
      }
      else {
        this.toastr.error(response.apiResponseMessages[0].message);
        this.isUpsertExpenseInprogress = false;
      }
    });
  }

  closeArchiveExpenseDialog() {
    this.archiveExpensePopover.forEach((p) => p.closePopover());
    this.selectedExpenseDetails = null;
    this.isUpsertExpenseInprogress = false;
  }

  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    if (this.state.sort[0]) {
      this.sortBy = this.state.sort[0].field;
      this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
    }
    this.searchExpenses();
    this.updateExpenseDashboardFilter();
  }

  approveExpense() {
    this.selectedExpenseDetails = this.expenseDetails;
    this.selectedExpenseDetails.isApproved = true;
    this.approveOrRejectExpense();
  }

  rejectExpense() {
    this.selectedExpenseDetails = this.expenseDetails;
    this.selectedExpenseDetails.isApproved = false;
    this.approveOrRejectExpense();
  }

  payExpenseAmount() {
    this.selectedExpenseDetails = this.expenseDetails;
    this.selectedExpenseDetails.isPaid = true;
    this.approveOrRejectExpense();
  }

  selectedRow(e) {
    const data = e.dataItem;
    this.onCellClick(data);
  }

  onCellClick(data) {
    let dialogId = "app-expense-details";
    const dialogRef = this.dialog.open(this.expenseDetailsComponent, {
      height: "70%",
      hasBackdrop: true,
      minWidth: "45%",
      maxWidth: "100%",
      id: dialogId,
      panelClass: 'company-registration-container',
      direction: "ltr",
      data: { data, formPhysicalId: dialogId },
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe((closeEvent) => {
      if (closeEvent && closeEvent.event == 'edit') {
        this.openCreateExpenseDialog(closeEvent.dataItem);
      }
    });
  }

  showReceiptsPopupOpen(row, showReceiptsPopUp) {
    this.galleryImages = [];
    const receipts = row.receipts.split(',');
    receipts.forEach(item => {
      const result = item.split(".");
      const fileExtension = result.pop();
      if (this.imageExtensions.includes(fileExtension)) {
        const album = {
          small: this.imagePipe.transform(item, "50", "50"),
          big: this.imagePipe.transform(item, "", "")
        };
        this.receiptsForAnOrder.push(album);
      } else {
        let uploadedFileName = item.split('/').pop();
        let sortedFileName = uploadedFileName.split('-');
        let originalFileName = uploadedFileName.split('-');
        let fileName = "";
        for (let i = (sortedFileName.length - 1); i >= sortedFileName.length - 5; i--) {
          originalFileName.splice(i, 1);
        }
        if (originalFileName.length > 0) {
          for (let j = 0; j < (originalFileName.length - 1); j++) {
            fileName = fileName + originalFileName[j] + '-'
          }
          fileName = fileName + originalFileName[originalFileName.length - 1] + '.' + fileExtension;
        } else {
          fileName = originalFileName.toString() + '.' + fileExtension;
        }
        const file = {
          filePath: item,
          fileName: fileName
        }
        this.receiptsPdfForAnOrder.push(file);
      }
    })
    this.galleryImages = this.receiptsForAnOrder;
    if (this.galleryImages && this.galleryImages.length > 4) {
      this.galleryOptions = [
        { image: false, height: "50px", width: "100%", thumbnailsPercent: 20, thumbnailSize: NgxGalleryImageSize.Contain, thumbnailsMargin: 0, thumbnailsColumns: this.galleryImages.length, thumbnailMargin: 5 },
      ]
    }
    showReceiptsPopUp.openPopover();
  }

  closeReceiptsPopup() {
    this.receiptsForAnOrder = [];
    this.receiptsPdfForAnOrder = [];
    this.showReceiptsPopover.forEach((p) => p.closePopover());
  }

  downloadFile(filePath) {
    const parts = filePath.split(".");
    const fileExtension = parts.pop();
    if (fileExtension == 'pdf') {
      this.downloadPdf(filePath, fileExtension);
    } else {
      const downloadLink = document.createElement("a");
      downloadLink.href = filePath;
      downloadLink.download = filePath.split(".").pop() + '-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd') + '-File' + fileExtension;
      downloadLink.click();
    }
  }

  downloadPdf(pdf, fileExtension) {
    const parts = pdf.split("/");
    const loc = parts.pop();
    this.storeManagementService.downloadFile(pdf).subscribe((responseData: any) => {
      const fileType = fileExtension == "pdf" ? 'data:application/pdf;base64,' : 'data:text/plain;base64,';
      const linkSource = fileType + responseData;
      const downloadLink = document.createElement("a");
      downloadLink.href = linkSource;
      downloadLink.download = loc.split(".")[0] + '-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd') + '-File.pdf';
      downloadLink.click();
    })
  }

  approveExpensePopupOpen(expenseDetails, approveExpensePopup) {
    this.expenseDetails = expenseDetails;
    approveExpensePopup.openPopover();
  }

  payExpensePopupOpen(expenseDetails, payExpensePopup) {
    this.expenseDetails = expenseDetails;
    payExpensePopup.openPopover();
  }

  closeapproveExpensePopup() {
    this.expenseDetails = null;
    this.approveExpensePopOver.forEach((p) => p.closePopover());
  }

  closePayExpensePopup() {
    this.expenseDetails = null;
    this.payExpensePopOver.forEach((p) => p.closePopover());
  }

  rejectExpensePopUpOpen(expenseDetails, rejectExpensePopUp) {
    this.expenseDetails = expenseDetails;
    rejectExpensePopUp.openPopover();
  }

  closerejectExpensePopUp() {
    this.expenseDetails = null;
    this.rejectExpensePopOver.forEach((p) => p.closePopover());
  }

  searchByInput(event) {
    if (event.keyCode == 13) {
      this.searchExpenses();
      this.updateExpenseDashboardFilter();
    }
  }

  updateExpenseDashboardFilter() {
    if (this.dashboardId) {
      this.updatePersistanceInprogress = true;
      let workspaceDashboardFilterModel = new WorkspaceDashboardFilterModel();
      workspaceDashboardFilterModel.workspaceDashboardId = this.dashboardId;
      workspaceDashboardFilterModel.workspaceDashboardFilterId = this.workspaceDashboardFilterId;
      let filters = new WorkspaceDashboardFilterModel();
      filters.searchText = this.searchText;
      filters.isArchived = this.isArchived;
      filters.state = this.state;
      workspaceDashboardFilterModel.filterJson = JSON.stringify(filters);
      this.widgetService.updateworkspaceDashboardFilter(workspaceDashboardFilterModel)
        .subscribe((responseData: any) => {
          if (responseData.success) {
            this.workspaceDashboardFilterId = responseData.data;
            this.updatePersistanceInprogress = false;
            this.cdRef.detectChanges();
          } else {
            this.validationMessage = responseData.apiResponseMessages[0].message;
            this.toastr.warning("", this.validationMessage);
            this.updatePersistanceInprogress = false;
            this.cdRef.markForCheck();
          }
        });
    }
  }

  getExpenseDashboardFilter() {
    this.isAnyOperationIsInprogress = true;
    let workspaceDashboardFilterModel = new WorkspaceDashboardFilterModel();
    workspaceDashboardFilterModel.workspaceDashboardId = this.dashboardId;
    this.widgetService.getWorkspaceDashboardFilter(workspaceDashboardFilterModel)
      .subscribe((responseData: any) => {
        if (responseData.success) {
          if (responseData.data && responseData.data.length > 0) {
            let dashboardFilters = responseData.data[0];
            this.workspaceDashboardFilterId = dashboardFilters.workspaceDashboardFilterId;
            let filters = JSON.parse(dashboardFilters.filterJson);
            this.searchText = filters.searchText == undefined ? null : filters.searchText;
            this.isArchived = filters.isArchived;
            this.state = filters.state ? filters.state : this.state;
            if (this.state.sort && this.state.sort[0]) {
              this.sortBy = this.state.sort[0].field;
              this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
            }
            this.getExpenseStatuses();
            this.cdRef.detectChanges();
          }
          else {
            this.getExpenseStatuses();
          }
        } else {
          this.getExpenseStatuses();
          this.validationMessage = responseData.apiResponseMessages[0].message;
          this.toastr.warning("", this.validationMessage);
        }
      });
  }

  sendExpense(data, mailPopover, rowIndex) {
    this.count = 0;
    this.expenseDetails = data;
    this.kendoRowIndex = rowIndex;
    mailPopover.openPopover();
    this.cdRef.markForCheck();
  }

  shareInvoice() {
    this.shareExpense(this.expenseDetails);
  }

  selectedStatusValues(status) {
    if (status == 1) {
      this.selectedStatus = null;
      this.selectedStatusName = null;
    } else {
      let selectedStatusValues;
      status.forEach(element => {
        let data = this.statuses.find(x => x.expenseStatusId == element);
        if (!selectedStatusValues) {
          selectedStatusValues = data.expenseStatusName;
        } else {
          selectedStatusValues = selectedStatusValues + "," + data.expenseStatusName;
        }
      });
      this.selectedStatusName = selectedStatusValues;
      this.selectedStatus = status;
    }
    this.resetStates();
    this.searchExpenses();
  }

  shareExpense(data) {
    this.pdfOrMailOperationIsInprogress = true;
    let expenseModel = new ExpenseManagementModel();
    expenseModel = Object.assign({}, data);
    expenseModel.to = this.toMailsList;
    expenseModel.cc = this.ccMailsList;
    expenseModel.bcc = this.bccMailsList;

    this.expenseService.downloadOrSendPdfExpense(expenseModel).subscribe((result: any) => {
      if (result.success) {
        this.expenseDetails = null;
        this.pdfOrMailOperationIsInprogress = false;
        this.closeSendExpensePopover();
        this.toastr.success(this.translateService.instant(ConstantVariables.InvoiceMailSentSuccessfully));
        this.cdRef.markForCheck();
      }
      else {
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
        this.pdfOrMailOperationIsInprogress = false;
        this.cdRef.markForCheck();
      }
    });
  }

  closeSendExpensePopover() {
    this.mailInvoicesPopover.forEach((p) => p.closePopover());
    this.pdfOrMailOperationIsInprogress = false;
    this.toMailsList = [];
    this.ccMailsList = [];
    this.bccMailsList = [];
    this.toMail = null;
    this.ccMail = null;
    this.bccMail = null;
  }

  editAppName() {
    if (this.dashboardId) {
      this.isEditAppName = true;
      this.changedAppName = this.dashboardName;
    }
  }

  keyUpFunction(event) {
    if (event.keyCode == 13) {
      this.updateAppName();
    }
  }

  updateAppName() {
    if (this.dashboardId) {
      if (this.changedAppName) {
        const dashBoardModel = new Dashboard();
        dashBoardModel.dashboardId = this.dashboardId;
        dashBoardModel.dashboardName = this.changedAppName;
        this.widgetService.updateDashboardName(dashBoardModel)
          .subscribe((responseData: any) => {
            const success = responseData.success;
            if (success) {
              this.snackbar.open("App name updated successfully", this.translateService.instant(ConstantVariables.success), { duration: 3000 });
              this.dashboardName = JSON.parse(JSON.stringify(this.changedAppName));
              this.changedAppName = '';
              this.isEditAppName = false;
              this.cdRef.detectChanges();
            } else {
              this.validationMessage = responseData.apiResponseMessages[0].message;
              this.toastr.warning("", this.validationMessage);
            }
          });
      } else {
        const message = this.softLabelPipe.transform("Please enter app name", this.softLabels);
        this.toastr.warning("", message);
      }
    }
  }

  disabledButton(enteredText, tags) {
    if (tags && (enteredText === "Enter" || enteredText === "Comma")) {
      this.count = 1;
    } else {
      if (tags && (enteredText !== "Enter" || enteredText !== "Comma")) {
        this.count = 0;
      } else {
        this.count = 1;
      }
    }
  }

  addToMailIds(event: MatChipInputEvent) {
    const inputTags = event.input;
    const userStoryTags = event.value.trim();
    if (userStoryTags != null && userStoryTags != "") {
      let regexpEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
      if (regexpEmail.test(userStoryTags)) {
        this.toMailsList.push(userStoryTags);
        this.count++;
      } else {
        this.toastr.warning("", this.translateService.instant("HRMANAGAMENT.PLEASEENTERVALIDEMAIL"));
      }
    }
    if (inputTags) {
      inputTags.value = " ";
    }
  }

  removeToMailId(toMail) {
    const index = this.toMailsList.indexOf(toMail);
    if (index >= 0) {
      this.toMailsList.splice(index, 1);
    }
    if (this.toMailsList.length === 0) {
      this.count = 0;
    }
  }

  addCCMailIds(event: MatChipInputEvent) {
    const inputTags = event.input;
    const userStoryTags = event.value.trim();
    if (userStoryTags) {
      let regexpEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
      if (regexpEmail.test(userStoryTags)) {
        this.ccMailsList.push(userStoryTags);
        this.count++;
      }
      else {
        this.toastr.warning("", this.translateService.instant("HRMANAGAMENT.PLEASEENTERVALIDEMAIL"));
      }
      if (inputTags) {
        inputTags.value = " ";
      }
    }
  }

  removeCCMailId(ccMail) {
    const index = this.ccMailsList.indexOf(ccMail);
    if (index >= 0) {
      this.ccMailsList.splice(index, 1);
    }
    if (this.ccMailsList.length === 0) {
      this.count = 0;
    }
  }

  addBCCMailIds(event: MatChipInputEvent) {
    const inputTags = event.input;
    const userStoryTags = event.value.trim();
    if (userStoryTags) {
      let regexpEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
      if (regexpEmail.test(userStoryTags)) {
        this.bccMailsList.push(userStoryTags);
        this.count++;
      }
      else {
        this.toastr.warning("", this.translateService.instant("HRMANAGAMENT.PLEASEENTERVALIDEMAIL"));
      }
      if (inputTags) {
        inputTags.value = " ";
      }
    }
  }

  removeBCCMailId(bccMail) {
    const index = this.bccMailsList.indexOf(bccMail);
    if (index >= 0) {
      this.bccMailsList.splice(index, 1);
    }
    if (this.bccMailsList.length === 0) {
      this.count = 0;
    }
  }

  receiptsCount(row) {
    if (row.expenseReceipts) {
      const receipts = row.expenseReceipts.split(',');
      return receipts.length;
    }
    return 0;
  }

  getExpenseStatuses() {
    this.expenseService.getExpenseStatuses(new ExpenseStatusModel()).subscribe((result: any) => {
      if (result.success) {
        this.statuses = result.data;
        let selectedStatusValues;
        this.statuses.forEach(element => {
          if (element.expenseStatusName.toLowerCase() != "paid") {
            this.selectedStatus.push(element.expenseStatusId);
            if (!selectedStatusValues) {
              selectedStatusValues = element.expenseStatusName;
            } else {
              selectedStatusValues = selectedStatusValues + "," + element.expenseStatusName;
            }
            this.selectedStatusName = selectedStatusValues;
          }
        });
        this.searchExpenses();
      }
    });
  }

  expenseDateFromInput() {
    this.minCreatedToDate = this.expenseDateFrom;
    this.resetStates();
    this.searchExpenses();
  }

  expenseDateToInput() {
    this.resetStates();
    this.searchExpenses();
  }

  createdDateFromInput() {
    this.minExpenseToDate = this.expenseDateTo;
    this.resetStates();
    this.searchExpenses();
  }

  createdDateToInput() {
    this.resetStates();
    this.searchExpenses();
  }

  resetAllFilters() {
    this.expenseDateFrom = null;
    this.expenseDateTo = null;
    this.createdDateFrom = null;
    this.claimedBy = null;
    this.branchId = null;
    this.createdDateTo = null;
    let selectedStatusValues;
    this.selectedStatus = [];
    this.statuses.forEach(element => {
      if (element.expenseStatusName.toLowerCase() != "paid") {
        this.selectedStatus.push(element.expenseStatusId);
        if (!selectedStatusValues) {
          selectedStatusValues = element.expenseStatusName;
        } else {
          selectedStatusValues = selectedStatusValues + "," + element.expenseStatusName;
        }
        this.selectedStatusName = selectedStatusValues;
      }
    });
    this.resetStates();
    this.searchExpenses();
  }

  resetStates() {
    this.state = {
      skip: 0,
      take: 10,
    };
  }

  filter() {
    if (this.branchId || this.claimedBy || this.selectedStatus || this.expenseDateFrom ||
      this.expenseDateTo || this.createdDateFrom || this.createdDateTo) {
      return true;
    } else {
      return false;
    }
  }

  selectedBranchValues(branchId) {
    if (branchId == 1) {
      this.branchId = null;
      this.selectedBranchName = null;
    } else {
      this.branchId = branchId;
      this.selectedBranchName = this.branchList.find(x => x.branchId == branchId).branchName;
    }
    this.searchExpenses();
  }

  selectedUserValues(userId) {
    if (userId == 1) {
      this.claimedBy = null;
      this.selectedUserName = null;
    } else {
      this.claimedBy = userId;
      this.selectedUserName = this.employeeList.find(x => x.userId == userId).fullName;
    }
    this.searchExpenses();
  }

  downloadSelectedExpenses() {
    if (this.selectedExpensesList && this.selectedExpensesList.length > 0) {
      this.downloadExpensesInprogress = true;
      let expensesList = [];
      this.selectedExpensesList.forEach(element => {
        expensesList.push(element.expenseId);
      });
      var expenseModel = new ExpenseManagementModel();
      expenseModel.expenseIdList = expensesList.toString();
      expenseModel.isArchived = this.isArchived;
      expenseModel.expenseStatusId = this.selectedStatus == null ? null : this.selectedStatus.toString();
      expenseModel.expenseDateFrom = this.expenseDateFrom;
      expenseModel.expenseDateTo = this.expenseDateTo;
      expenseModel.createdDateTimeFrom = this.createdDateFrom;
      expenseModel.createdDateTimeTo = this.createdDateTo;
      expenseModel.branchId = this.branchId;
      expenseModel.claimedByUserId = this.claimedBy;
      this.expenseService.downloadSelectedExpenses(expenseModel).subscribe((result: any) => {
        this.downloadExpensesInprogress = false;
        if (result.success) {
          this.downloadExcel(result.data);
        } else {
          this.toastr.error("", result.apiResponseMessages[0].message);
        }
      })
    } else {
      this.toastr.warning(this.translateService.instant(ConstantVariables.ExpenseCountWarningMessage));
    }
  }

  downloadExcel(excelPath) {
    let filePath = excelPath;
    if (filePath) {
      const parts = filePath.split(".");
      const fileExtension = parts.pop();

      if (fileExtension == 'pdf') {
      } else {
        // const linkSource = "data:application/vnd.ms-excel," + filePath;
        const downloadLink = document.createElement("a");
        downloadLink.href = filePath;
        downloadLink.download = "ExpensesTemplate" + this.datePipe.transform(new Date(), "yyyy-MM-dd") + ".xlsx";
        downloadLink.click();
      }
    } else if (filePath == null) {
      this.toastr.warning(this.translateService.instant(ConstantVariables.ExpenseBankDetailsErrorMessage));
    }
    this.selection = [];
    this.selectedExpensesList = [];
  }

  closeStatusSearch() {
    this.selectedStatusName = null;
    this.selectedStatus = null;
    this.searchExpenses();
  }

  closeExpenseDateFrom() {
    this.expenseDateFrom = null;
    this.searchExpenses();
  }

  closeExpenseDateTo() {
    this.expenseDateTo = null;
    this.searchExpenses();
  }

  closeCreatedDateFrom() {
    this.createdDateFrom = null;
    this.searchExpenses();
  }

  closeCreatedDateTo() {
    this.createdDateTo = null;
    this.searchExpenses();
  }

  closeUserSearch() {
    this.selectedUserName = null;
    this.claimedBy = null;
    this.searchExpenses();
  }

  closeBranchSearch() {
    this.selectedBranchName = null;
    this.branchId = null;
    this.searchExpenses();
  }

  selectedExpenseData(expenseDetails) {
    let selectedExpenseIndex = this.selectedExpensesList.findIndex(x => x.expenseId == expenseDetails.expenseId);
    if (selectedExpenseIndex > -1) {
      this.selectedExpensesList.splice(selectedExpenseIndex, 1);
    } else {
      this.selectedExpensesList.push(expenseDetails);
    }
  }

  getSelectedExpensesFromCurrentPage() {
    this.selection = [];
    if (this.expenses && this.expenses.length > 0 && this.selectedExpensesList && this.selectedExpensesList.length > 0) {
      this.selectedExpensesList.forEach(element => {
        let index = this.expenses.findIndex(x => x.expenseId == element.expenseId);
        if (index > -1) {
          this.selection.push(this.expenses[index].expenseId);
        }
      });
    }
  }
}