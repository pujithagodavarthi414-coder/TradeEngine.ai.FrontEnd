import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewChildren, OnInit, Input, ViewChild, TemplateRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { State as KendoState } from "@progress/kendo-data-query";
import { DataStateChangeEvent } from "@progress/kendo-angular-grid";

import { EstimateService } from "../../services/estimate.service";

import { EstimateInputModel } from "../../models/estimate-input.model";
import { EstimateOutputModel } from "../../models/estimate-output.model";

import { WorkspaceDashboardFilterModel } from '../../models/softlabels-model';
import { InvoiceOutputModel } from "../../models/invoice-output-model";
// import { AddInvoiceDialogComponent } from "../invoice/add-invoice-dialog.component";
import { ConstantVariables } from '../../constants/constant-variables';
import { SoftLabelConfigurationModel } from '../../models/softlabels-model';
import { AppBaseComponent } from '../componentbase';
import { WidgetService } from '../../services/widget.service';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import '../../../globaldependencies/helpers/fontawesome-icons'
import { InvoiceService } from '../../services/invoice.service';

@Component({
    selector: "estimates-view",
    templateUrl: "estimates-view.component.html",
    changeDetection: ChangeDetectionStrategy.Default
})

export class EstimatesViewComponent extends AppBaseComponent implements OnInit {
    @ViewChildren("deleteEstimatePopover") deleteEstimatesPopover;
    @ViewChild("addEstimateDialogComponent") AddEstimateDialogComponent: TemplateRef<any>;
    @ViewChild("detailsEstimateDialogComponent") DetailsEstimateDialogComponent: TemplateRef<any>;

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    @Input("dashboardId")
    set _dashboardId(data: string) {
        if (data && data !== this.dashboardId) {
            this.dashboardId = data;
            this.getEstimateDashboardFilter();
        } else if (!data) {
            this.getEstimates();
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

    softLabels: SoftLabelConfigurationModel[];

    dashboardFilters: DashboardFilterModel;
    estimateList: any;

    estimateDetails: any;
    deleteEstimateDetails: any;
    take: number = 10;
    validationMessage: string;
    searchText: string;
    sortBy: string;
    dashboardId: string;
    dashboardName: string;
    workspaceDashboardFilterId: string;
    kendoRowIndex: number;
    sortDirection: boolean;
    isEditEstimate: boolean = false;
    showFilters: boolean = false;
    isArchived: boolean = false;
    anyOperationIsInprogress: boolean = false;
    updatePersistanceInprogress: boolean = false;
    deleteOperationIsInprogress: boolean = false;
    convertOperationIsInprogress: boolean = false;

    state: KendoState = {
        skip: 0,
        take: 10,
    };

    constructor(private dialog: MatDialog, private estimateService: EstimateService, private invoiceService: InvoiceService, private widgetService: WidgetService, private toastr: ToastrService, private translateService: TranslateService, private cdRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabelConfigurations();
    }

    getEstimates() {
        this.anyOperationIsInprogress = true;
        let estimateModel = new EstimateInputModel();
        estimateModel.sortBy = this.sortBy;
        estimateModel.sortDirectionAsc = this.sortDirection;
        estimateModel.searchText = this.searchText != null ? this.searchText.trim() : null;
        estimateModel.pageSize = this.state.take;
        estimateModel.pageNumber = (this.state.skip / this.state.take) + 1;
        estimateModel.isArchived = this.isArchived;
        this.estimateService.getEstimates(estimateModel).subscribe((result: any) => {
            if (result.success) {
                
                this.estimateList = {
                    data: result.data,
                    total: result.data.length > 0 ? result.data[0].totalCount : 0,
                }
                this.anyOperationIsInprogress = false;
                this.estimateList = result.data;
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

    updateEstimateDashboardFilter() {
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

    getEstimateDashboardFilter() {
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
                        this.getEstimates();
                        this.cdRef.detectChanges();
                    }
                    else {
                        this.getEstimates();
                    }
                } else {
                    this.getEstimates();
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
            this.getEstimates();
            this.updateEstimateDashboardFilter();
        }
    }

    changeArchiveEstimates(value) {
        this.isArchived = value;
        this.getEstimates();
        this.updateEstimateDashboardFilter();
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort[0]) {
            this.sortBy = this.state.sort[0].field;
            this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
        }
        this.getEstimates();
        this.updateEstimateDashboardFilter();
    }

    closeSearch() {
        this.searchText = null;
        this.getEstimates();
        this.updateEstimateDashboardFilter();
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    }

    addEstimate() {
        this.estimateDetails = null;
        this.isEditEstimate = false;
        this.upsertEstimate();
        this.cdRef.markForCheck();
    }

    editEstimate(data) {
        this.estimateDetails = data;
        this.isEditEstimate = true;
        this.upsertEstimate();
        this.cdRef.markForCheck();
    }

    upsertEstimate() {
        let dialogId = "add-estimate-dailog";
        const dialogRef = this.dialog.open(this.AddEstimateDialogComponent, {
            height: "90%",
            width: "90%",
            direction: 'ltr',
            id: dialogId,
            data: { fromPhysicalId: dialogId, editEstimate: this.isEditEstimate, estimateDetails: this.estimateDetails },
            disableClose: true,
            panelClass: 'invoice-dialog-scroll'
        });
        dialogRef.afterClosed().subscribe((result: any) => {
            this.isEditEstimate = false;
            this.estimateDetails = null;
            if (result.success)
                this.getEstimates();
        });
    }

    convertToInvoiceDialog(data, rowIndex) {
        this.kendoRowIndex = rowIndex;
        this.convertOperationIsInprogress = true;
        let estimateDetails = data;
        let invoiceDetails = new InvoiceOutputModel();
        invoiceDetails.clientId = estimateDetails.clientId;
        invoiceDetails.title = estimateDetails.estimateTitle;
        invoiceDetails.invoiceNumber = estimateDetails.estimateNumber;
        invoiceDetails.po = estimateDetails.pO;
        invoiceDetails.issueDate = estimateDetails.issueDate;
        invoiceDetails.dueDate = estimateDetails.dueDate;
        invoiceDetails.currencyId = estimateDetails.currencyId;
        invoiceDetails.invoiceTasks = estimateDetails.estimateTasks;
        invoiceDetails.invoiceItems = estimateDetails.estimateItems;
        invoiceDetails.terms = estimateDetails.terms;
        invoiceDetails.notes = estimateDetails.notes;
        invoiceDetails.discount = estimateDetails.discount;
        invoiceDetails.amountPaid = 0.00;
        invoiceDetails.dueAmount = estimateDetails.totalEstimateAmount;
        invoiceDetails.totalInvoiceAmount = estimateDetails.totalEstimateAmount;
        invoiceDetails.invoiceDiscountAmount = estimateDetails.estimateDiscountAmount;
        invoiceDetails.subTotalInvoiceAmount = estimateDetails.subTotalEstimateAmount;

        this.invoiceService.upsertInvoice(invoiceDetails).subscribe((result: any) => {
            if (result.success) {
                this.convertOperationIsInprogress = false;
                this.toastr.success(this.translateService.instant(ConstantVariables.InvoiceConvertedSuccessfully));
                this.cdRef.markForCheck();
            }
            else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.convertOperationIsInprogress = false;
                this.cdRef.markForCheck();
            }
        });
        // const dialogRef = this.dialog.open(AddInvoiceDialogComponent, {
        //     height: "90%",
        //     width: "90%",
        //     direction: 'ltr',
        //     data: { editInvoice: true, invoiceDetails: invoiceDetails },
        //     disableClose: true,
        //     panelClass: 'invoice-dialog-scroll'
        // });
        // dialogRef.afterClosed().subscribe((result: any) => { });
    }

    cellClickHandler({ isEdited, dataItem, rowIndex }) {
        if (!this.isArchived)
            this.estimatePreview(dataItem);
        else
            this.toastr.info(this.translateService.instant(ConstantVariables.WarningMessageForEstimateToBeUnArchived));
    }

    cellMiniClickHandler(dataItem) {
        if (!this.isArchived)
            this.estimatePreview(dataItem);
        else
            this.toastr.info(this.translateService.instant(ConstantVariables.WarningMessageForEstimateToBeUnArchived));
    }

    estimatePreview(data) {
        let dialogId = "details-estimate-dailog";
        const dialogRef = this.dialog.open(this.DetailsEstimateDialogComponent, {
            maxHeight: "90%",
            width: "70%",
            direction: 'ltr',
            id: dialogId,
            data: { fromPhysicalId: dialogId, estimateDetails: data },
            disableClose: true,
            panelClass: 'invoice-dialog-scroll'
        });
        dialogRef.afterClosed().subscribe((result: any) => { });
    }

    deleteEstimateItem(data, deletePopover) {
        this.deleteEstimateDetails = data;
        deletePopover.openPopover();
        this.cdRef.markForCheck();
    }

    removeEstimateAtIndex(value) {
        this.deleteOperationIsInprogress = true;
        let estimateModel = new EstimateOutputModel();
        estimateModel = Object.assign({}, this.deleteEstimateDetails);
        estimateModel.isArchived = value;
        this.estimateService.upsertEstimate(estimateModel).subscribe((result: any) => {
            if (result.success) {
                this.deleteEstimateDetails = null;
                this.deleteOperationIsInprogress = false;
                this.getEstimates();
                this.closeDeleteEstimateDialog();
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

    closeDeleteEstimateDialog() {
        this.deleteEstimateDetails = null;
        this.deleteEstimatesPopover.forEach((p) => p.closePopover());
        this.cdRef.markForCheck();
    }
}