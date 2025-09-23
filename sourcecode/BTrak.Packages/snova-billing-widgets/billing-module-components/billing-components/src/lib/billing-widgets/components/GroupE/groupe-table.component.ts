import { ChangeDetectorRef, Component, TemplateRef, ViewChild, ViewChildren } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { orderBy, State } from "@progress/kendo-data-query";
import { BankAccountModel } from "../../models/bank-account.model";
import { GRDMOdel } from "../../models/GRD-Model";
import { GroupE } from "../../models/groupE.model";
import { MessageFieldSearchModel } from "../../models/messageFieldSearchModel-model";
import { SiteModel } from "../../models/site-model";
import { SiteService } from "../../services/site.service";
import { AppBaseComponent } from "../componentbase";
import { AddGroupEComponent } from "./add-groupe.component";

@Component({
  selector: "app-groupe-table",
  templateUrl: "groupe-table.component.html"
})

export class GroupETableComponent extends AppBaseComponent {
  @ViewChildren("convertInvoicePopup") convertInvoicePopover;
  @ViewChild("addGrEDialogComponent") AddGrEDialogComponent: TemplateRef<any>;
  @ViewChild("viewGrEDialogComponent") ViewGrEDialogComponent: TemplateRef<any>;
  @ViewChild("maileDialogComponent") maileDialogComponent: TemplateRef<any>;
  @ViewChild("viewHistoryDialogComponent") viewHistoryDialogComponent: TemplateRef<any>;
  isArchived: boolean;
  grEsList: any;
  loadingIndicator: boolean;
  selectedGrEs: any;
  isAnyOperationIsInprogress: boolean;
  sites: any;
  messageTypes: any;
  state: State = {
    skip: 0,
    take: 10
};
  grds: any;
  grEsListData: any;
  banks: any;
  constructor(public siteService: SiteService, private dialog: MatDialog, public cdRef: ChangeDetectorRef) {
    super();
    this.getGrE();
    this.getSites();
    this.getGrds();
    this.getBanks();
    this.getMessageType();
  }

  ngOnInit() {
    super.ngOnInit();
  }
  getGrE() {
    this.state.take = 10;
    this.state.skip = 0;
    var upsertGre = new GroupE();
    this.loadingIndicator = true;
    this.siteService.searchGrE(upsertGre).subscribe((result: any) => {
      if (result.success) {
        this.grEsListData = result.data;
        this.grEsList = {
          data: this.grEsListData.slice(this.state.skip, this.state.take + this.state.skip),
          total: this.grEsListData.length
      }
        this.loadingIndicator = false;
        this.cdRef.detectChanges();
      }
      else {
        this.loadingIndicator = true;
        this.grEsList = {
          data: [],
          total: 0
      }
      }
    });
  }
  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    if (this.state.sort) {
        this.grEsListData = orderBy(this.grEsListData, this.state.sort);
    }
    this.grEsList = {
        data: this.grEsListData.slice(this.state.skip, this.state.take + this.state.skip),
        total: this.grEsListData.length
    }
}
  upsertGrE(dataItem) {
    var upsertGre = new GroupE();
    upsertGre = dataItem;
    upsertGre.generateInvoice = true;
    this.siteService.upsertGrE(upsertGre).subscribe((result: any) => {
      if (result.success) {
        this.isAnyOperationIsInprogress = false;
        this.getGrE();
      }
      else {
        this.isAnyOperationIsInprogress = false;
      }
    });
  }
  openConvertPopup(dataItem,convertInvoicePopup) {
    this.selectedGrEs = dataItem;
    convertInvoicePopup.openPopover();
  }
  convertToInvoice() {
    this.upsertGrE(this.selectedGrEs);
    this.convertInvoicePopover.forEach((p) => p.closePopover());
  }
  closeConvertInvoicePopup() {
    this.convertInvoicePopover.forEach((p) => p.closePopover());
  }
  edit(dataItem) {
    this.selectedGrEs = dataItem;
    this.openAddpopup();
  }
  openAddpopup() {
    this.messageTypes.forEach(element => {
      element.isSendInMail = false;
    });
    let dialogId = "add-invoice-dailog";
    const dialogRef = this.dialog.open(this.AddGrEDialogComponent, {
      height: "90%",
      width: "90%",
      direction: 'ltr',
      id: dialogId,
      data: { fromPhysicalId: dialogId, editInvoice: true, grEDetails: this.selectedGrEs, sites:this.sites, grds:this.grds, banks:this.banks , messageTypes:this.messageTypes},
      disableClose: true,
      panelClass: 'invoice-dialog-scroll'
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.selectedGrEs = null;
      this.getGrE();
    });
  }
  openViewpopup({ isEdited, dataItem, rowIndex }) {
    let dialogId = "view-invoice-dailog";
    const dialogRef = this.dialog.open(this.ViewGrEDialogComponent, {
      height: "90%",
      width: "90%",
      direction: 'ltr',
      id: dialogId,
      data: { fromPhysicalId: dialogId, editInvoice: true, grEDetails: dataItem, sites:this.sites, grds:this.grds, banks:this.banks , messageTypes:this.messageTypes},
      disableClose: true,
      panelClass: 'invoice-dialog-scroll'
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.selectedGrEs = null;
    });
  }
  openMailpopup(dataItem) {
    let dialogId = "mail-invoice-dailog";
    const dialogRef = this.dialog.open(this.maileDialogComponent, {
      height: "90%",
      width: "90%",
      direction: 'ltr',
      id: dialogId,
      data: { fromPhysicalId: dialogId, editInvoice: true, grEDetails: dataItem, sites:this.sites, grds:this.grds, banks:this.banks , messageTypes:this.messageTypes},
      disableClose: true,
      panelClass: 'invoice-dialog-scroll'
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.selectedGrEs = null;
    });
  }
  viewHistoryDialog(dataItem) {
    let dialogId = "view-history-dialog";
    const dialogRef = this.dialog.open(this.viewHistoryDialogComponent, {
      height: "90%",
      width: "90%",
      direction: 'ltr',
      id: dialogId,
      data: { fromPhysicalId: dialogId, grEDetails: dataItem,sites:this.sites, grds:this.grds, banks:this.banks, messageTypes:this.messageTypes},
      disableClose: true,
      panelClass: 'invoice-dialog-scroll'
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      //this.selectedGrEs = null;
    });
  }
  getSites() {
    var sitemodel = new SiteModel();
    this.siteService.searchSite(sitemodel).subscribe((result: any) => {
      if (result.success) {
        this.sites = result.data;
      }
      else {
      }
    });
  }
  getBanks() {
    var bankAccount = new BankAccountModel();
    this.siteService.getBankAccount(bankAccount).subscribe((result: any) => {
      if (result.success) {
        this.banks = result.data;
      }
      else {
      }
    });
  }
  getGrds() {
    var grdmodel = new GRDMOdel();
    this.siteService.getGRD(grdmodel).subscribe((result: any) => {
      if (result.success) {
        this.grds = result.data;
      }
      else {
      }
    });
  }
  getMessageType() {
    var grdmodel = new MessageFieldSearchModel();
    this.siteService.getMessageFieldType(grdmodel).subscribe((result: any) => {
      if (result.success) {
        this.messageTypes = result.data;
      }
      else {
        this.messageTypes = null;
      }
    });
  }

  downloadInvoice(dataItem){
    if (dataItem.invoiceUrl) {
      const parts = dataItem.invoiceUrl.split(".");
      const fileExtension = parts.pop();

        const downloadLink = document.createElement("a");
        downloadLink.href = dataItem.invoiceUrl;
        downloadLink.download = dataItem.gridInvoice+".pdf";
        downloadLink.target = "_blank";
        downloadLink.click();
    }
  }
}
