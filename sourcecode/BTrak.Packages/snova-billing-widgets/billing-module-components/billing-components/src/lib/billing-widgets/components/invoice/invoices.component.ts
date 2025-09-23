import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewChildren, OnInit, Input, ViewChild, TemplateRef, Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { State as KendoState } from "@progress/kendo-data-query";
import { DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { DatePipe } from "@angular/common";

import { InvoiceService } from "../../services/invoice.service";

import { AppBaseComponent } from '../componentbase';
import { WidgetService } from '../../services/widget.service';
import { ConstantVariables } from '../../constants/constant-variables';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { CustomFormFieldModel, InvoiceInputModel } from '../../models/invoice-input-model';
import { SoftLabelConfigurationModel, WorkspaceDashboardFilterModel } from '../../models/softlabels-model';
import { InvoiceOutputModel } from '../../models/invoice-output-model';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { SoftLabelPipe } from "../../pipes/softlabels.pipes";


@Component({
    selector: "invoices",
    templateUrl: "invoices.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class InvoicesComponent extends AppBaseComponent implements OnInit {
    @ViewChildren("deleteInvoicePopover") deleteInvoicesPopover;
    @ViewChildren("mailInvoicePopover") mailInvoicesPopover;
    @ViewChild("addInvoiceDialogComponent") AddInvoiceDialogComponent: TemplateRef<any>;
    @ViewChild("detailsInvoiceDialogComponent") DetailsInvoiceDialogComponent: TemplateRef<any>;
    @ViewChild("customFormsComponent") customFormsComponent: TemplateRef<any>;
    @Output() closePopUp = new EventEmitter<any>();

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;

    @Input("dashboardId")
    set _dashboardId(data: string) {
        if (data && data !== this.dashboardId) {
            this.dashboardId = data;
            this.getInvoiceDashboardFilter();
        } else if (!data) {
            this.getInvoices();
            this.searchCustomForms();
        }
    }

    @Input("dashboardName")
    set _dashboardName(data: string) {
        if (data != null && data !== undefined) {
            this.dashboardName = data;
        } else {
            this.dashboardName = "Invoices";
        }
    }

    invoiceList: any;
    customFields: CustomFormFieldModel[];
    softLabels: SoftLabelConfigurationModel[];
    customFieldData: CustomFormFieldModel;
    anyOperationInProgress: boolean;
    invoiceDetails: any;
    deleteInvoiceDetails: any;
    take: number = 10;
    kendoRowIndex: number;
    validationMessage: string;
    searchText: string;
    to: string;
    cc: string;
    bcc: string;
    sortBy: string;
    dashboardId: string;
    dashboardName: string;
    workspaceDashboardFilterId: string;
    sortDirection: boolean;
    isEditInvoice: boolean = false;
    showFilters: boolean = false;
    isArchived: boolean = false;
    isForMail: boolean = false;
    disableInvoiceShare: boolean = false;
    anyOperationIsInprogress: boolean = false;
    updatePersistanceInprogress: boolean = false;
    deleteOperationIsInprogress: boolean = false;
    pdfOrMailOperationIsInprogress: boolean = false;
    pdfOperationIsInprogress: boolean = false;
    mailOperationIsInprogress: boolean = false;
    customFieldsLength: number;
    moduleTypeId: number = 6;
    referenceTypeId: string = ConstantVariables.BILLINGREFERENCEID;
    referenceId: string = ConstantVariables.BILLINGREFERENCEID;
    state: KendoState = {
        skip: 0,
        take: 10,
    };

    constructor(private dialog: MatDialog, private invoiceService: InvoiceService, private widgetService: WidgetService, private toastr: ToastrService, private translateService: TranslateService, private datePipe: DatePipe, private cdRef: ChangeDetectorRef
        ,private softLabelPipe: SoftLabelPipe) {
        super();
         this.getInvoices();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabels();
    }

    searchCustomForms() {
        var customFormModel = new CustomFormFieldModel();
        customFormModel.moduleTypeId = this.moduleTypeId;
        customFormModel.referenceTypeId = this.referenceTypeId;
        customFormModel.referenceId = this.referenceId;
            this.invoiceService.searchCustomFields(customFormModel).subscribe((result) => {
                if (result.success == true) {
                  this.customFields = result.data;
                   this.customFieldsLength = this.customFields.length;
                   this.cdRef.detectChanges();
                } 
            });
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        if (this.softLabels && this.softLabels.length > 0) {
          this.cdRef.markForCheck();
        }
      }

    editCustomForm() {
      this.customFieldData = this.customFields[0];
      this.openDialog();
    }

    getInvoices() {
        this.anyOperationIsInprogress = true;
        let invoiceModel = new InvoiceInputModel();
        invoiceModel.sortBy = this.sortBy;
        invoiceModel.sortDirectionAsc = this.sortDirection;
        invoiceModel.searchText = this.searchText != null ? this.searchText.trim() : null;
        invoiceModel.pageSize = this.state.take;
        invoiceModel.pageNumber = (this.state.skip / this.state.take) + 1;
        invoiceModel.isArchived = this.isArchived;
        this.invoiceService.getInvoices(invoiceModel).subscribe((result: any) => {
            if (result.success) {
               this.invoiceList = result.data;
                this.invoiceList = {
                    data: result.data,
                    total: result.data.length > 0 ? result.data[0].totalCount : 0,
                }
                this.invoiceList = result.data;
                this.cdRef.markForCheck();
                this.anyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
            else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.anyOperationIsInprogress = false;
                this.cdRef.markForCheck();
            }
        });
    }

    updateInvoiceDashboardFilter() {
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

    getInvoiceDashboardFilter() {
        this.anyOperationIsInprogress = true;
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
                        if (this.canAccess_feature_ViewInvoice) {
                            this.getInvoices();
                        }
                        this.cdRef.detectChanges();
                    }
                    else {
                        if (this.canAccess_feature_ViewInvoice) {
                            this.getInvoices();
                        }
                    }
                } else {
                    if (this.canAccess_feature_ViewInvoice) {
                        this.getInvoices();
                    }
                    this.validationMessage = responseData.apiResponseMessages[0].message;
                    this.toastr.warning("", this.validationMessage);
                }
            });
    }

    searchByInput(event, text) {
        if (event.keyCode == 13) {
            this.searchText = (text != null) ? text.trim() : null;
            this.state.take = 10;
            this.state.skip = 0;
            this.cdRef.markForCheck();
            this.getInvoices();
            this.updateInvoiceDashboardFilter();
        }
    }

    changeArchiveInvoices(value) {
        this.isArchived = value;
        this.getInvoices();
        this.updateInvoiceDashboardFilter();
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort[0]) {
            this.sortBy = this.state.sort[0].field;
            this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
        }
        this.getInvoices();
        this.updateInvoiceDashboardFilter();
    }

    closeSearch() {
        this.searchText = null;
        this.getInvoices();
        this.updateInvoiceDashboardFilter();
    }

    addInvoice() {
        this.invoiceDetails = null;
        this.isEditInvoice = false;
        this.referenceId = null;
        this.isForMail = false;
        this.upsertInvoice();
        this.cdRef.markForCheck();
    }

    editInvoice(data) {
        this.invoiceDetails = data;
        this.isEditInvoice = true;
        this.referenceId = this.invoiceDetails.invoiceId;
        this.isForMail = false;
        this.upsertInvoice();
        this.cdRef.markForCheck();
    }

    upsertInvoice() {
        let dialogId = "add-invoice-dailog";
        const dialogRef = this.dialog.open(this.AddInvoiceDialogComponent, {
            height: "90%",
            width: "90%",
            direction: 'ltr',
            id: dialogId,
            data: { fromPhysicalId: dialogId, editInvoice: this.isEditInvoice, invoiceDetails: this.invoiceDetails,moduleTypeId: this.moduleTypeId,
                referenceId: this.referenceId,referenceTypeId: this.referenceTypeId,isAddPermission: this.canAccess_feature_AddOrEditCustomFieldsForInvoices,
                isDeletePermission: this.canAccess_feature_DeleteCustomFieldsForHrManagement, isEditFieldPermission: this.canAccess_feature_CanSubmitCustomFieldsForInvoices},
            disableClose: true,
            panelClass: 'invoice-dialog-scroll'
        });
        dialogRef.afterClosed().subscribe((result: any) => {
            this.isEditInvoice = false;
            this.invoiceDetails = null;
            if (result.success)
                this.getInvoices();
                this.searchCustomForms();
            if(result.redirection)
            this.closePopUp.emit(true);
        });

    }

    cellClickHandler({ isEdited, dataItem, rowIndex }) {
        if (!this.isArchived)
            this.invoicePreview(dataItem);
        else
            this.toastr.info(this.translateService.instant(ConstantVariables.WarningMessageForInvoiceToBeUnArchived));
    }

    cellMiniClickHandler(dataItem) {
        if (!this.isArchived)
            this.invoicePreview(dataItem);
        else
            this.toastr.info(this.translateService.instant(ConstantVariables.WarningMessageForInvoiceToBeUnArchived));
    }

    invoicePreview(data) {
        let dialogId = "details-invoice-dailog";
        const dialogRef = this.dialog.open(this.DetailsInvoiceDialogComponent, {
            maxHeight: "90%",
            width: "70%",
            direction: 'ltr',
            id: dialogId,
            data: { fromPhysicalId: dialogId, invoiceDetails: data },
            disableClose: true,
            panelClass: 'invoice-dialog-scroll'
        });
        dialogRef.afterClosed().subscribe((result: any) => {
            if (result.success)
                this.getInvoices();
        });
    }

    deleteInvoiceItem(data, deletePopover) {
        this.deleteInvoiceDetails = data;
        deletePopover.openPopover();
        this.cdRef.markForCheck();
    }

    removeInvoiceAtIndex(value) {
        this.deleteOperationIsInprogress = true;
        let invoiceModel = new InvoiceOutputModel();
        invoiceModel = Object.assign({}, this.deleteInvoiceDetails);
        invoiceModel.isArchived = value;
        this.invoiceService.upsertInvoice(invoiceModel).subscribe((result: any) => {
            if (result.success) {
                this.deleteInvoiceDetails = null;
                this.deleteOperationIsInprogress = false;
                this.getInvoices();
                this.closeDeleteInvoiceDialog();
                this.cdRef.markForCheck();
            }
            else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.deleteOperationIsInprogress = false;
                this.cdRef.markForCheck();
            }
        });
    }

    downloadForInvoice(data, rowIndex) {
        this.isForMail = false;
        this.kendoRowIndex = rowIndex;
        this.downloadInvoice(data);
    }

    downloadInvoice(data) {
        this.pdfOrMailOperationIsInprogress = true;
        if (this.isForMail) {
            this.mailOperationIsInprogress = true;
            this.cdRef.markForCheck();
        }
        else {
            this.pdfOperationIsInprogress = true;
            this.cdRef.markForCheck();
        }
        let invoiceModel = new InvoiceOutputModel();
        invoiceModel = Object.assign({}, data);
        if (invoiceModel.invoiceTasks && invoiceModel.invoiceTasks.length > 0) {
            invoiceModel.invoiceTasks.forEach(x => {
                if (x.rate != null && x.rate.toString() != '') {
                    let rt = x.rate.toFixed(2);
                    x.rate = parseFloat(rt);
                }
                else {
                    x.rate = 0.00;
                }
                if (x.hours != null && x.hours.toString() != '') {
                    let hrs = x.hours.toFixed(2);
                    x.hours = parseFloat(hrs);
                }
                else {
                    x.hours = 0.00;
                }
                let value = this.calculateTaskAmount(x.rate, x.hours);
                x.total = value;
            });
        }
        if (invoiceModel.invoiceItems && invoiceModel.invoiceItems.length > 0) {
            invoiceModel.invoiceItems.forEach(x => {
                if (x.price != null && x.price.toString() != '') {
                    let pr = x.price.toFixed(2);
                    x.price = parseFloat(pr);
                }
                else {
                    x.price = 0.00;
                }
                if (x.quantity != null && x.quantity.toString() != '') {
                    let qty = x.quantity.toFixed(2);
                    x.quantity = parseFloat(qty);
                }
                else {
                    x.quantity = 0.00;
                }
                let value = this.calculateItemAmount(x.price, x.quantity);
                x.total = value;
            });
        }
        if (invoiceModel.discount != null && invoiceModel.discount.toString() != '')
            invoiceModel.discount = parseFloat(invoiceModel.discount.toFixed(2));
        else
            invoiceModel.discount = 0.00;
        if (invoiceModel.totalInvoiceAmount != null && invoiceModel.totalInvoiceAmount.toString() != '')
            invoiceModel.totalInvoiceAmount = parseFloat(invoiceModel.totalInvoiceAmount.toFixed(2));
        else
            invoiceModel.totalInvoiceAmount = 0.00;
        if (invoiceModel.subTotalInvoiceAmount != null && invoiceModel.subTotalInvoiceAmount.toString() != '')
            invoiceModel.subTotalInvoiceAmount = parseFloat(invoiceModel.subTotalInvoiceAmount.toFixed(2));
        else
            invoiceModel.subTotalInvoiceAmount = 0.00;
        if (invoiceModel.invoiceDiscountAmount != null && invoiceModel.invoiceDiscountAmount.toString() != '')
            invoiceModel.invoiceDiscountAmount = parseFloat(invoiceModel.invoiceDiscountAmount.toFixed(2));
        else
            invoiceModel.invoiceDiscountAmount = 0.00;
        if (this.isForMail) {
            invoiceModel.isForMail = true;
            invoiceModel.to = this.to;
            invoiceModel.cc = this.cc;
            invoiceModel.bcc = this.bcc;
        }
        else
            invoiceModel.isForMail = false;
        this.invoiceService.downloadOrSendPdfInvoice(invoiceModel).subscribe((result: any) => {
            if (result.success) {
                this.invoiceDetails = null;
                this.pdfOrMailOperationIsInprogress = false;
                this.mailOperationIsInprogress = false;
                this.pdfOperationIsInprogress = false;
                if (!this.isForMail) {
                    let pdfName = 'invoice-' + this.datePipe.transform(new Date(), 'yyyy-MM-dd'); +'.pdf';
                    const downloadLink = document.createElement("a");
                    downloadLink.href = result.data;
                    downloadLink.download = pdfName;
                    downloadLink.target = "_blank";
                    downloadLink.click();
                }
                else {
                    this.closeSendInvoicePopover();
                    this.toastr.success(this.translateService.instant(ConstantVariables.InvoiceMailSentSuccessfully));
                }
                this.cdRef.markForCheck();
            }
            else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.pdfOrMailOperationIsInprogress = false;
                this.mailOperationIsInprogress = false;
                this.pdfOperationIsInprogress = false;
                this.cdRef.markForCheck();
            }
        });
    }

    sendInvoice(data, mailPopover, rowIndex) {
        this.invoiceDetails = data;
        this.isForMail = true;
        this.to = data.userName;
        this.cc = null;
        this.bcc = null;
        this.kendoRowIndex = rowIndex;
        mailPopover.openPopover();
        this.cdRef.markForCheck();
    }

    shareInvoice() {
        this.downloadInvoice(this.invoiceDetails);
    }

    closeSendInvoicePopover() {
        this.mailInvoicesPopover.forEach((p) => p.closePopover());
    }

    calculateTaskAmount(rate, hours) {
        let rt = rate;
        let hrs = hours;
        if (rate == null || rate.toString() == '')
            rt = 0.00;
        else
            rt = parseFloat(rate.toFixed(2));
        if (hours == null || hours.toString() == '')
            hrs = 0.00;
        else
            hrs = parseFloat(hours.toFixed(2));
        return parseFloat((rt * hrs).toFixed(2));
    }

    calculateItemAmount(price, qty) {
        let pr = price;
        let qy = qty;
        if (price == null || price.toString() == '')
            pr = 0.00;
        else
            pr = parseFloat(price.toFixed(2));
        if (qty == null || qty.toString() == '')
            qy = 0.00;
        else
            qy = parseFloat(qty.toFixed(2));
        return parseFloat((pr * qy).toFixed(2));
    }

    closeDeleteInvoiceDialog() {
        this.deleteInvoiceDetails = null;
        this.deleteInvoicesPopover.forEach((p) => p.closePopover());
        this.cdRef.markForCheck();
    }

    openCustomForm() {
        this.customFieldData = null;
        this.openDialog();
       
    }

    openDialog() {
        let dialogId = "app-custom-form-component";
        const formsDialog = this.dialog.open(this.customFormsComponent, {
            height: "62%",
            width: "60%",
            hasBackdrop: true,
            direction: "ltr",
            id: dialogId,
            data: {
                moduleTypeId: this.moduleTypeId,
                referenceId: this.referenceId,
                referenceTypeId: this.referenceTypeId,
                customFieldComponent: this.customFieldData,
                isButtonVisible: true,
                formPhysicalId: dialogId,
                dialogId: dialogId
            },
            disableClose: true,
            panelClass: "custom-modal-box"
        });
    }

    closeDialog(result) {
        result.dialog.close();
        this.searchCustomForms();
    }

    deleteCustomForm() {
        this.anyOperationInProgress = true;
        let customField = this.customFields[0];
        var customFieldModel = new CustomFormFieldModel();
        customFieldModel.moduleTypeId = customField.moduleTypeId;
        customFieldModel.referenceId = customField.referenceId;
        customFieldModel.referenceTypeId = customField.referenceTypeId;
        customFieldModel.formName = customField.formName;
        customFieldModel.timeStamp = customField.timeStamp;
        customFieldModel.customFieldId = customField.customFieldId;
        customFieldModel.formJson = customField.formJson;
        customFieldModel.formKeys = customField.formKeys;
        customFieldModel.IsArchived = true;
        this.invoiceService.upsertcustomField(customFieldModel).subscribe((result) => {
            if (result.success === true) {
                this.searchCustomForms();
            } else {
                this.validationMessage = result.apiResponseMessages[0];
                this.toastr.success(this.validationMessage);
            }
            this.anyOperationInProgress = false;
        });
    }

    getCustomFieldsLength(event) {
      this.customFieldsLength = event;
      this.cdRef.detectChanges();
    }
}