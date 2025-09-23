import { ChangeDetectorRef, Component, Inject, Input, OnInit, TemplateRef, ViewChild, ViewChildren } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { orderBy, State } from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { GroupE } from "../../models/groupE.model";
import { BillingDashboardService } from "../../services/billing-dashboard.service";

@Component({
    selector: "view-history-dialog",
    templateUrl: "view-history.component.html"
})

export class ViewHistoryComponent {
    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            let matData = data[0];
            this.grds = matData.grds;
            this.sites = matData.sites;
            this.banks = matData.banks;
            this.currentDialogId = matData.fromPhysicalId;
            this.grEDetails = matData.grEDetails;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            this.invoiceUrl = this.grEDetails.invoiceUrl;
            this.getGreRomandeHistory();

        }
    }
    @ViewChild("viewGrEDialogComponent") ViewGrEDialogComponent: TemplateRef<any>;
    @ViewChildren("archiveHistoryPopUp") archiveHistoryPopups;
    greRomandeHistoryDetails: any[] = [];
    grds: any[] = [];
    sites: any[] = [];
    banks: any[] = [];
    isArchiveProgress: boolean;
    archiveHistoryModel: any;
    greHistoryModel: any;
    grEDetails: any;
    currentDialogId: any;
    currentDialog: any;
    isLoading: boolean;
    invoiceUrl: string;
    praFields: any[] = [];
    dFEntryFields: any[] = [];
    state: State = {
        skip: 0,
        take: 10
    };

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private dialogRef: MatDialogRef<ViewHistoryComponent>,
        private billingService: BillingDashboardService, private toastr: ToastrService, private cdRef: ChangeDetectorRef, private viewDialog: MatDialog) {

    }

    getGreRomandeHistory() {
        this.isLoading = true;
        let greRomandeEModel: any = {};
        greRomandeEModel.Id = this.grEDetails.id;
        this.billingService.getGroupeRomandeHistory(greRomandeEModel).subscribe((response: any) => {
            this.isLoading = false;
            if (response.success) {
                this.greRomandeHistoryDetails = response.data;
                if (this.greRomandeHistoryDetails.length > 0) {
                    this.greHistoryModel = {
                        data: this.greRomandeHistoryDetails.slice(this.state.skip, this.state.take + this.state.skip),
                        total: this.greRomandeHistoryDetails.length
                    }
                } else {
                    this.greHistoryModel = {
                        data: [],
                        total: 0
                    }
                }
                this.cdRef.detectChanges();
            } else {
                this.toastr.error('', response.apiResponseMessages[0].message);
            }
        })
    }

    openViewpopup({ dataItem }) {
        var grEModel = new GroupE();
        let historyModel = JSON.parse(dataItem.oldJson);
        if (historyModel.length > 0) {
            let greHistoryModel = historyModel[0];
            grEModel.production = greHistoryModel.Production;
            grEModel.reprise = greHistoryModel.Reprise;
            grEModel.autoConsumption = greHistoryModel.AutoConsumption;
            grEModel.basTariff = greHistoryModel.BasTariff;
            grEModel.hauteTariff = greHistoryModel.HauteTariff;
            grEModel.distribution = greHistoryModel.Distribution;
            grEModel.siteId = greHistoryModel.SiteId;
            grEModel.grdId = greHistoryModel.GrdId;
            grEModel.bankId = greHistoryModel.BankId;
            grEModel.startDate = greHistoryModel.StartDate;
            grEModel.endDate = greHistoryModel.EndDate;
            grEModel.month = greHistoryModel.Month;
            grEModel.year = greHistoryModel.Year;
            grEModel.gridInvoice = greHistoryModel.GridInvoice;
            grEModel.gridInvoiceDate = greHistoryModel.GridInvoiceDate;
            grEModel.confirmDetailsfromGrid = greHistoryModel.ConfirmDetailsfromGrid;
            grEModel.generateInvoice = greHistoryModel.GenerateInvoce;
            grEModel.pRAFields = greHistoryModel.PRAFields;
            grEModel.dFFields = greHistoryModel.DFFields;
            grEModel.term = greHistoryModel.Term;
            grEModel.autoCTariff = greHistoryModel.AutoCTariff;
            grEModel.isGre = greHistoryModel.IsGre;
            grEModel.tva = greHistoryModel.TVA;
            if (grEModel.siteId) {
                let sitesList = this.sites;
                let filteredList = sitesList.filter(function (data) {
                    return data.id == grEModel.siteId.toLowerCase()
                })
                grEModel.siteName = filteredList[0].name;
            }
            if (grEModel.grdId) {
                let grdsList = this.grds;
                let filteredList = grdsList.filter(function (data) {
                    return data.id == grEModel.grdId.toLowerCase()
                })
                grEModel.grdName = filteredList[0].name;
            }
            if (grEModel.bankId) {
                let bankslist = this.banks;
                let filteredList = bankslist.filter(function (data) {
                    return data.id == grEModel.bankId.toLowerCase()
                })
                grEModel.bankAccountName = filteredList[0].bankAccountName;
            }

        }

        let dialogId = "view-entry-form-dailog";
        const dialogRef = this.viewDialog.open(this.ViewGrEDialogComponent, {
            height: "90%",
            width: "90%",
            direction: 'ltr',
            id: dialogId,
            data: { fromPhysicalId: dialogId, editInvoice: true, grEDetails: grEModel, sites: this.sites, grds: this.grds },
            disableClose: true,
            panelClass: 'invoice-dialog-scroll'
        });
        dialogRef.afterClosed().subscribe((result: any) => {
            // this.selectedGrEs = null;
        });
    }

    cancelDialog() {
        this.currentDialog.close({ success: false, redirection: true });
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort) {
            this.greHistoryModel = orderBy(this.greHistoryModel, this.state.sort);
        }
        this.greHistoryModel = {
            data: this.greRomandeHistoryDetails.slice(this.state.skip, this.state.take + this.state.skip),
            total: this.greRomandeHistoryDetails.length
        }
    }

    downloadInvoice(dataItem) {
        let invoiceUrl;
        let oldGreRomandeModel = JSON.parse(dataItem.oldJson);
        if (oldGreRomandeModel.length > 0) {
            invoiceUrl = oldGreRomandeModel[0].InvoiceUrl;
        }
        if (invoiceUrl) {
            const parts = invoiceUrl.split(".");
            const fileExtension = parts.pop();

            const downloadLink = document.createElement("a");
            downloadLink.href = invoiceUrl;
            downloadLink.download = dataItem.gridInvoice + ".pdf";
            downloadLink.target = "_blank";
            downloadLink.click();
        }
    }

    checkInvoiceExists(dataItem) {

        let oldGreRomandeModel = JSON.parse(dataItem.oldJson);
        if (oldGreRomandeModel.length > 0) {
            let invoiceUrl = oldGreRomandeModel[0].InvoiceUrl;
            if (invoiceUrl) {
                return true;
            } else {
                return false;
            }
        }
    }

    archiveHistory(dataItem, archivePopUp) {
        let greModel: any = {};
        greModel.historyId = dataItem.historyId;
        let oldGreRomandeModel = JSON.parse(dataItem.oldJson);
        if (oldGreRomandeModel.length > 0) {
            let invoiceUrl = oldGreRomandeModel[0].InvoiceUrl;
            greModel.invoiceUrl = invoiceUrl;
        }
        this.archiveHistoryModel = greModel;
        archivePopUp.openPopover();
    }

    archivehistoryPopUp() {
        this.isArchiveProgress = true;
        this.billingService.updateGroupeRomandeHistory(this.archiveHistoryModel).subscribe((response: any) => {
            this.isArchiveProgress = false;
            if (response.success) {
                this.getGreRomandeHistory();
                this.archiveHistoryPopups.forEach((p) => { p.closePopover(); });
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    closePopUp() {
        this.archiveHistoryPopups.forEach((p) => { p.closePopover(); });  
    }
}