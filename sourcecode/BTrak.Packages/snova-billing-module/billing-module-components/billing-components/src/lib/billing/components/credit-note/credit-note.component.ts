import { DatePipe, DecimalPipe } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, ViewChildren } from "@angular/core"
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { MatDialog } from "@angular/material/dialog";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { orderBy, State } from "@progress/kendo-data-query";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { CreditNoteModel } from "../../models/credit-note.model";
import { GRDMOdel } from "../../models/GRD-Model";
import { SiteModel } from "../../models/site-model";
import { SiteService } from "../../services/site.service";
import { AppBaseComponent } from "../componentbase";

@Component({
    selector: "app-manage-credit-note",
    templateUrl: "credit-note.component.html",
    changeDetection: ChangeDetectionStrategy.Default
})

export class CreditNoteComponent extends AppBaseComponent implements OnInit {
    @ViewChildren("addCreditNotePopUp") creditNotePopUp;
    @ViewChildren("archiveCreditNotePopUp") archiveCreditNotePopUp
    isLoading: boolean;
    creditNoteModel: CreditNoteModel[] = [];
    creditNoteModelList: GridDataResult;
    archiveCreditModel: CreditNoteModel;
    state: State = {
        skip: 0,
        take: 10
    };
    creditNoteId: string;
    timestamp: any;
    creditNoteForm: FormGroup;
    isAddIsInProgress: boolean;
    isArchiveInProgress: boolean;
    minDate: any;
    terms: [
        { name: "T1" },
        { name: "T2" },
        { name: "T3" },
        { name: "T4" }
    ];
    grds: any;
    sites: any;
    month: Date;
    year: Date;
    selectedSite=new SiteModel();
    tva: any = 0;
    days: number;
    prorata: number;
    tvaCal: number;
    total: any;
    todaysDate: Date;
    @ViewChildren("convertInvoicePopup") convertInvoicePopover;
    @ViewChildren("convertInvoicePopup1") convertInvoicePopover1;
    selectedCreditNote: any;
    @ViewChild("maileDialogComponent") maileDialogComponent: TemplateRef<any>;
    wholeTotalValue: number;
    aroundi: number;
    daysInYear: number=moment(new Date).isLeapYear()?366:365;

    constructor(private siteService: SiteService, private decimalPipe: DecimalPipe, private datePipe: DatePipe,private dialog: MatDialog, private toastr: ToastrService, private cdRef: ChangeDetectorRef) {
        super();
        var newDate = new Date();
        this.todaysDate = newDate;
        this.getCreditNote();
        this.clearForm();
        this.getSites();
        this.getGrds();
        this.terms = [
            { name: "T1" },
            { name: "T2" },
            { name: "T3" },
            { name: "T4" }
        ];
    }
    ngOnInit() {
        super.ngOnInit();
    }

    getCreditNote() {
        this.isLoading = true;
        var creditNoteModel = new CreditNoteModel();
        creditNoteModel.id = null;
        this.siteService.getCreditNote(creditNoteModel).subscribe((response: any) => {
            this.isLoading = false;
            if (response.success) {
                this.creditNoteModel = response.data;
                if (this.creditNoteModel.length > 0) {
                    this.creditNoteModelList = {
                        data: this.creditNoteModel.slice(this.state.skip, this.state.take + this.state.skip),
                        total: this.creditNoteModel.length
                    }
                } else {
                    this.creditNoteModelList = {
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

    clearForm() {
        this.days = 0;
        this.selectedCreditNote=null;
        this.wholeTotalValue=0;
        this.aroundi=0;
        this.selectedSite = new SiteModel();
        this.prorata=0;
        this.total=0;
        this.tvaCal=0;
        this.year= new Date();
        this.month= new Date();
        this.creditNoteId = null;
        this.timestamp = null;
        this.creditNoteForm = new FormGroup({
            id: new FormControl(null, []),
            name: new FormControl("", Validators.compose([Validators.required, Validators.maxLength(250)])),
            siteId: new FormControl(null, Validators.compose([Validators.required])),
            grdId: new FormControl(null, Validators.compose([Validators.required])),
            month: new FormControl(null, Validators.compose([Validators.required])),
            term: new FormControl(null, Validators.compose([Validators.required])),
            year: new FormControl(null, Validators.compose([Validators.required])),
            startDate: new FormControl(null, Validators.compose([Validators.required])),
            endDate: new FormControl(null, Validators.compose([Validators.required])),
            entryDate: new FormControl(null, Validators.compose([Validators.required])),
            isTVAApplied: new FormControl(null, Validators.compose([])),
        })
    }

    upsertCreditNote(isGenerateInvoice:boolean) {
        this.isAddIsInProgress = true;
        var upsertCreditmodel = new CreditNoteModel();
        upsertCreditmodel = this.creditNoteForm.value;
        upsertCreditmodel.id = this.creditNoteId;
        upsertCreditmodel.timeStamp = this.timestamp;
        upsertCreditmodel.isGenerateInvoice = isGenerateInvoice;
        this.siteService.upsertCreditNote(upsertCreditmodel).subscribe((response: any) => {
            this.isAddIsInProgress = false;
            if (response.success) {
                this.clearForm();
                this.creditNotePopUp.forEach((p) => { p.closePopover(); });
                this.getCreditNote();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
            this.cdRef.detectChanges();
        })
    }
    upsertCreditNoteInvoice(dataItem) {
        this.isAddIsInProgress = true;
        var upsertCreditmodel = new CreditNoteModel();
        upsertCreditmodel = dataItem;
        upsertCreditmodel.id = dataItem.id;
        upsertCreditmodel.timeStamp = dataItem.timeStamp;
        upsertCreditmodel.isGenerateInvoice = true;
        this.siteService.upsertCreditNote(upsertCreditmodel).subscribe((response: any) => {
            this.isAddIsInProgress = false;
            if (response.success) {
                this.clearForm();
                this.creditNotePopUp.forEach((p) => { p.closePopover(); });
                this.getCreditNote();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
            this.cdRef.detectChanges();
        })
    }

    archiveSite() {
        this.isArchiveInProgress = true;
        var upsertCreditmodel = new CreditNoteModel();
        upsertCreditmodel = this.archiveCreditModel;
        upsertCreditmodel.isArchived = true;
        this.siteService.upsertCreditNote(upsertCreditmodel).subscribe((response: any) => {
            this.isArchiveInProgress = false;
            if (response.success) {
                this.archiveCreditNotePopUp.forEach((p) => { p.closePopover(); });
                this.getCreditNote();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    editCreditNotePopUp(dataItem, sitePopUp) {
        const site = this.sites.find(element => element.id === dataItem.siteId);
        this.selectedSite = site;
        this.creditNoteId = dataItem.id;
        this.month = dataItem.month;
        this.year = dataItem.year;
        this.timestamp = dataItem.timeStamp;
        this.creditNoteForm.patchValue(dataItem);
        this.creditNoteForm.get('year').patchValue(moment(this.year));
        this.creditNoteForm.get('month').patchValue(moment(this.month));
        sitePopUp.openPopover();
        this.dateChanges(dataItem.startDate,dataItem.endDate);
    }

    openCreditNotePopUp(sitePopUp) {
        this.clearForm();
        this.creditNoteForm.get('entryDate').patchValue(this.todaysDate);
        this.creditNoteForm.get('year').patchValue(moment(this.year));
        this.creditNoteForm.get('month').patchValue(moment(this.month));
        sitePopUp.openPopover();
    }

    deleteCreditNotePopUp(dataItem, sitePopUp) {
        this.archiveCreditModel = dataItem;
        sitePopUp.openPopover();
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort) {
            this.creditNoteModel = orderBy(this.creditNoteModel, this.state.sort);
        }
        this.creditNoteModelList = {
            data: this.creditNoteModel.slice(this.state.skip, this.state.take + this.state.skip),
            total: this.creditNoteModel.length
        }
    }

    closeDeletePopup() {
        this.archiveCreditNotePopUp.forEach((p) => { p.closePopover(); });
    }
    closePopUp() {
        this.clearForm();
        this.creditNotePopUp.forEach((p) => { p.closePopover(); });
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
    getGrds() {
        var grdmodel = new GRDMOdel();
        this.siteService.getGRD(grdmodel).subscribe((result: any) => {
            if (result.success) {
                this.grds = result.data;
                this.tva = this.grds[0].tvaValue;
            }
            else {
            }
        });
    }
    yearEmitHandled(value) {
        this.creditNoteForm.get('year').patchValue(value);
        this.calculations();
    }

    monthEmitHandled(value) {
        this.creditNoteForm.get('month').patchValue(value);
    }

    getSiteSelected(event) {
        const site = this.sites.find(element => element.id === event);
        this.selectedSite = site;
        this.calculations();
    }
    calculations(){
        if(this.creditNoteForm.get("year").value.isLeapYear()){
            this.daysInYear=366;
        } else{
            this.daysInYear=365;
        }
        this.prorata = Number(this.decimalPipe.transform(Number((this.days*(this.selectedSite.m2*this.selectedSite.chf))/this.daysInYear), "1.1-2").replace(/,/g, ""));
        this.tvaCal = Number(this.decimalPipe.transform(Number((this.tva*this.prorata)/100), "1.1-2").replace(/,/g, ""));
        if(this.creditNoteForm.get("isTVAApplied").value === true){
            this.total = this.decimalPipe.transform(this.prorata+this.tvaCal,"1.1-2");
        } else{
            this.total = this.decimalPipe.transform(this.prorata,"1.1-2");
        }
        let mRound = Number(this.total.replace(/,/g, "")) / 0.05;
    let result = (mRound - Math.floor(mRound)) * 10;
    let roundedResult = Math.floor(result);
    if (roundedResult < 5) {
      mRound = Math.floor(mRound);
      let wholeTotalValue = mRound * 0.05;
      if (wholeTotalValue) {
        this.wholeTotalValue = Number(this.decimalPipe.transform(Number(wholeTotalValue), "1.1-2").replace(/,/g, ""));
      }

    }
    else {
      mRound = Math.round(mRound)
      let wholeTotalValue = mRound * 0.05;
      if (wholeTotalValue) {
        this.wholeTotalValue = Number(this.decimalPipe.transform(Number(wholeTotalValue), "1.1-2").replace(/,/g, ""));
      }
    }
    this.aroundi = this.wholeTotalValue - Number(this.total.replace(/,/g, ""));
    }
    dateChange() {
        if (this.creditNoteForm.get("startDate").value && this.creditNoteForm.get("endDate").value) {
        var diff = Math.abs(new Date(this.creditNoteForm.get("endDate").value).getTime() - new Date(this.creditNoteForm.get("startDate").value).getTime());
        this.days = Math.ceil(diff / (1000 * 3600 * 24));
            this.calculations();
        }
    }
    dateChanges(startDate:any,endDate:any) {
        var diff = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime());
        this.days = Math.ceil(diff / (1000 * 3600 * 24));
            this.calculations();
    }
    openConvertPopup(convertInvoicePopup) {
        convertInvoicePopup.openPopover();
    }
    openConvertPopup1(dataItem,convertInvoicePopup) {
        this.selectedCreditNote = dataItem;
        convertInvoicePopup.openPopover();
    }
    convertToInvoice() {
        this.isLoading = true;
        this.upsertCreditNote(true);
        this.convertInvoicePopover.forEach((p) => p.closePopover());
    }
    convertToInvoice1() {
        this.isLoading = true;
        this.upsertCreditNoteInvoice(this.selectedCreditNote);
        this.convertInvoicePopover.forEach((p) => p.closePopover());
    }
    closeConvertInvoicePopup() {
        this.upsertCreditNote(false);
        this.convertInvoicePopover.forEach((p) => p.closePopover());
    }
    closeConvertInvoicePopup1() {
        this.convertInvoicePopover1.forEach((p) => p.closePopover());
    }
    openMailpopup(dataItem) {
        const site = this.sites.find(element => element.id === dataItem.siteId);
        this.selectedSite = site;
        let dialogId = "mail-invoice-dailog";
        const dialogRef = this.dialog.open(this.maileDialogComponent, {
          height: "90%",
          width: "90%",
          direction: 'ltr',
          id: dialogId,
          data: { fromPhysicalId: dialogId, creditNoteDetails: dataItem, siteDetails: this.selectedSite},
          disableClose: true,
          panelClass: 'invoice-dialog-scroll'
        });
        dialogRef.afterClosed().subscribe((result: any) => {
          this.selectedCreditNote = null;
          this.selectedSite = null;
        });
      }
      
      downloadInvoice(dataItem){
        if (dataItem.invoiceUrl) {
          const parts = dataItem.invoiceUrl.split(".");
          const fileExtension = parts.pop();
    
            const downloadLink = document.createElement("a");
            downloadLink.href = dataItem.invoiceUrl;
            downloadLink.download = "NO NC-"+this.datePipe.transform(dataItem.year,"yyyy")+"-"+dataItem.siteName+".pdf";
            downloadLink.target = "_blank";
            downloadLink.click();
        }
      }
}