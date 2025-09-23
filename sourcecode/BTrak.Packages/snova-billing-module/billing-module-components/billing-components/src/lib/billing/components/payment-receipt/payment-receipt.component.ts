import { DecimalPipe } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren } from "@angular/core"
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { orderBy, State } from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { ConstantVariables } from "../../constants/constant-variables";
import { BankAccountModel } from "../../models/bank-account.model";
import { CreditNoteModel } from "../../models/credit-note.model";
import { MasterAccountModel } from "../../models/master-account.model";
import { PaymentReceiptModel } from "../../models/payment-receipt.model";
import { SiteModel } from "../../models/site-model";
import { SiteService } from "../../services/site.service";
import { AppBaseComponent } from "../componentbase";
import * as _ from 'underscore';
import { MatOption } from "@angular/material/core";

@Component({
    selector: "app-manage-payment-receipt",
    templateUrl: "payment-receipt.component.html",
    changeDetection: ChangeDetectionStrategy.Default
})

export class PaymentReceiptComponent extends AppBaseComponent implements OnInit {
    @ViewChildren("addPaymentReceiptPopUp") paymentReceiptPopUp;
    @ViewChildren("archivePaymentReceiptPopUp") archivePaymentReceiptPopUp;
    @ViewChild("allSelected") private allSelected: MatOption;
    @ViewChild("allEntryFormsSelected") private allEntryFormsSelected: MatOption;
    isLoading: boolean;
    paymentReceiptModel: PaymentReceiptModel[] = [];
    paymentReceiptModelList: GridDataResult;
    archivePaymentReceiptModel: PaymentReceiptModel;
    state: State = {
        skip: 0,
        take: 10
    };
    paymentReceiptId: string;
    timestamp: any;
    paymentReceiptForm: FormGroup;
    isAddIsInProgress: boolean;
    isArchiveInProgress: boolean;
    minDate: any;
    terms: [
        { name: "T1" },
        { name: "T2" },
        { name: "T3" },
        { name: "T4" }
    ];
    types: [
        { name: "Actual", color:"#25b0fb" },
        { name: "Projected", color:"#cc71fb" }
    ];
    sites: any;
    month: Date;
    year: Date;
    expenses: any;
    selectedCredits: any[];
    moduleTypeId = 1;
    referenceTypeId: string = ConstantVariables.SalaryLogReferenceTypeId;
    selectedStoreId: null;
    selectedParentFolderId: null;
    isToUploadFiles: boolean = false;
    isFileExist: boolean;
    selectedType: any={ name: "Kind of Record", color:"#fbfd90" };
    arrondi: number;
    tvaCal: number;
    tva: any=7.7;
    invoiceValue: any;
    banks: any;
    creditNoteNames: any;
    selectedBank: any={};
    entryForms: any;
    gridInvoiceNames: any;
    selectedPaymentReceipt: any;

    constructor(private siteService : SiteService, private decimalPipe: DecimalPipe, private toastr: ToastrService, private cdRef: ChangeDetectorRef) {
        super();
      this.getPaymentReceipt();
      this.clearForm();
      this.getAllBankAccount();
      this.getSites();
      this.getGrE();
      this.getCreditNote();
      this.terms = [
          { name: "T1" },
          { name: "T2" },
          { name: "T3" },
          { name: "T4" }
      ];
      this.types = [
          { name: "Actual", color:"#25b0fb" },
          { name: "Projected", color:"#cc71fb" }
      ];
    }
    ngOnInit() {
     super.ngOnInit();
    }
    getSites() {
        var sitemodel = new SiteModel();
        this.siteService.searchSite(sitemodel).subscribe((result: any) => {
            if (result.success) {
                this.sites = result.data;
            }
            else {
                this.toastr.error('', result.apiResponseMessages[0].message);
            }
        });
    }

    
    getGrE() {
        var upsertGre = {};
        this.siteService.searchGrE(upsertGre).subscribe((result: any) => {
          if (result.success) {
            this.entryForms = result.data;
          }
          else {
            this.toastr.error('', result.apiResponseMessages[0].message);
          }
        });
      }

    getPaymentReceipt() {
        this.isLoading = true;
        var paymentReceiptmodel = new PaymentReceiptModel();
        paymentReceiptmodel.isArchived = false;
        this.siteService.getPaymentReceipts(paymentReceiptmodel).subscribe((response: any) => {
            this.isLoading = false;
            if(response.success) {
                this.paymentReceiptModel = response.data;
                if (this.paymentReceiptModel.length > 0) {
                    this.paymentReceiptModelList = {
                        data: this.paymentReceiptModel.slice(this.state.skip, this.state.take + this.state.skip),
                        total: this.paymentReceiptModel.length
                    }
                } else {
                    this.paymentReceiptModelList = {
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
        this.selectedBank = {};
        this.paymentReceiptId = null;
        this.timestamp = null;
        this.arrondi=null;
        this.tvaCal=null;
        this.year= new Date();
        this.month= new Date();
        this.tva=null;
        this.paymentReceiptForm = new FormGroup({
            id: new FormControl(null, []),
            entryDate: new FormControl(null, Validators.compose([Validators.required])),
            month: new FormControl(null, Validators.compose([Validators.required])),
            term: new FormControl(null, Validators.compose([Validators.required])),
            year: new FormControl(null, Validators.compose([Validators.required])),
            siteId: new FormControl(null, Validators.compose([Validators.required])),
            bankReceiptDate: new FormControl(null, Validators.compose([Validators.required])),
            bankReference: new FormControl("", Validators.compose([Validators.required,Validators.maxLength(250)])),
            bankId: new FormControl(null, Validators.compose([Validators.required])),
            creditNoteIds: new FormControl(null, Validators.compose([])),
            entryFormIds: new FormControl(null, Validators.compose([])),
            comments: new FormControl("", Validators.compose([Validators.maxLength(150)])),
            payValue: new FormControl(null, Validators.compose([Validators.required,Validators.max(9999999999)])),
        })
    }
    yearEmitHandled(value) {
        this.paymentReceiptForm.get('year').patchValue(value);
    }

    monthEmitHandled(value) {
        this.paymentReceiptForm.get('month').patchValue(value);
    }

    upsertPaymentReceipt(formDirective: FormGroupDirective) {
        this.isAddIsInProgress = true;
        var upsertPaymentReceiptmodel = new PaymentReceiptModel();
        upsertPaymentReceiptmodel = this.paymentReceiptForm.value;
        this.getSelectedCreditss();
        let expenses=[];
        if (Array.isArray(this.paymentReceiptForm.value.creditNoteIds))
        expenses = this.paymentReceiptForm.value.creditNoteIds
        else if(this.paymentReceiptForm.value.creditNoteIds!=null)
        expenses = this.paymentReceiptForm.value.creditNoteIds.split(',');
        const index2 = expenses.indexOf(0);
        if (index2 > -1) {
            expenses.splice(index2, 1)
        }
        let entryFormIds=[];
        if (Array.isArray(this.paymentReceiptForm.value.entryFormIds))
        entryFormIds = this.paymentReceiptForm.value.entryFormIds
        else if(this.paymentReceiptForm.value.entryFormIds!=null)
        entryFormIds = this.paymentReceiptForm.value.entryFormIds.split(',');
        const index3 = entryFormIds.indexOf(0);
        if (index3 > -1) {
            entryFormIds.splice(index3, 1)
        }
        upsertPaymentReceiptmodel.id = this.paymentReceiptId;
        upsertPaymentReceiptmodel.entryFormIds = entryFormIds.join();
        upsertPaymentReceiptmodel.creditNoteIds = expenses.join();
        upsertPaymentReceiptmodel.timeStamp = this.timestamp;
        this.siteService.upsertPaymentReceipt(upsertPaymentReceiptmodel).subscribe((response: any)=> {
            this.isAddIsInProgress = false;
            if(response.success) {
                this.paymentReceiptId = response.data;
                formDirective.resetForm();
                this.isToUploadFiles = true;
                this.clearForm();
                this.paymentReceiptPopUp.forEach((p) => { p.closePopover(); });
                this.getPaymentReceipt();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
            this.cdRef.detectChanges();
        })
    }

    getAllBankAccount() {
        var bankAccountmodel = new BankAccountModel();
        bankAccountmodel.isArchived = false;
        this.siteService.getBankAccount(bankAccountmodel).subscribe((response: any) => {
            if(response.success) {
                this.banks = response.data;
            } else {
                this.toastr.error('', response.apiResponseMessages[0].message);
            }
        })
    }

    archivePaymentReceipt() {
        this.isArchiveInProgress = true;
        var upsertPaymentReceiptmodel = new PaymentReceiptModel();
        upsertPaymentReceiptmodel = this.archivePaymentReceiptModel;
        upsertPaymentReceiptmodel.isArchived = true;
        this.siteService.upsertPaymentReceipt(upsertPaymentReceiptmodel).subscribe((response: any)=> {
            this.isArchiveInProgress = false;
            if(response.success) {
                this.archivePaymentReceiptPopUp.forEach((p) => { p.closePopover(); });
                this.getPaymentReceipt();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    editPaymentReceiptPopUp(dataItem, paymentReceiptPopUp) {
        const bank = this.banks.find(element => element.id === dataItem.bankId);
        this.selectedBank = bank;
        this.selectedPaymentReceipt = dataItem;
        let creditNoteIds = []; 
        
        if (this.selectedPaymentReceipt.creditNoteIds != null) {
            if(!Array.isArray(this.selectedPaymentReceipt.creditNoteIds)){
            this.selectedPaymentReceipt.creditNoteIds.split(',').forEach(element => {
                creditNoteIds.push(element)
            });
            } else{
                creditNoteIds = this.paymentReceiptForm.value.creditNoteIds
            }
        }   
        if(this.expenses!=undefined&&creditNoteIds!=null){
            if (creditNoteIds.length === this.expenses.length) {
                creditNoteIds.push(0);
            }
        } 
        let entryFormIds = []; 
        if (this.selectedPaymentReceipt.entryFormIds != null) {
            if(!Array.isArray(this.selectedPaymentReceipt.entryFormIds)){
                this.selectedPaymentReceipt.entryFormIds.split(',').forEach(element => {
                    entryFormIds.push(element)
                });
                } else{
                    entryFormIds = this.paymentReceiptForm.value.entryFormIds
            }
        }  
        if(this.entryForms!=undefined && this.entryForms!=null && entryFormIds !=null){
        if (entryFormIds.length === this.entryForms.length) {
            entryFormIds.push(0);
        }
    }         
        this.selectedPaymentReceipt.entryFormIds=entryFormIds;
        this.selectedPaymentReceipt.creditNoteIds=creditNoteIds;
       this.paymentReceiptId = this.selectedPaymentReceipt.id;
       this.creditNoteNames = this.selectedPaymentReceipt.creditNoteNames;
       this.gridInvoiceNames = this.selectedPaymentReceipt.entryFormNames;
       this.month = this.selectedPaymentReceipt.month;
       this.year = this.selectedPaymentReceipt.year;
       this.timestamp = this.selectedPaymentReceipt.timeStamp;
       this.paymentReceiptForm.patchValue(this.selectedPaymentReceipt);
       this.paymentReceiptForm.get('year').patchValue(this.year);
       this.paymentReceiptForm.get('month').patchValue(this.month);
       paymentReceiptPopUp.openPopover();
    }

    openPaymentReceiptPopUp(paymentReceiptPopUp) {
      this.clearForm();
      this.selectedType={ name: "Kind of Record", color:"#fbfd90" };
      this.paymentReceiptForm.get('year').patchValue(this.year);
      this.paymentReceiptForm.get('month').patchValue(this.month);
      paymentReceiptPopUp.openPopover();
    }

    deletePaymentReceiptPopUp(dataItem, paymentReceiptPopUp) {
        this.archivePaymentReceiptModel = dataItem;
        let expenses;
        this.selectedPaymentReceipt = dataItem;
        if (Array.isArray(this.selectedPaymentReceipt.creditNoteIds))
        expenses = this.selectedPaymentReceipt.creditNoteIds
        else if(this.paymentReceiptForm.value.creditNoteIds!=null)
        expenses = this.selectedPaymentReceipt.creditNoteIds.split(',');
        const index2 = expenses.indexOf(0);
        if (index2 > -1) {
            expenses.splice(index2, 1)
        }
        let entryFormIds;
        if (Array.isArray(this.selectedPaymentReceipt.entryFormIds))
        entryFormIds = this.selectedPaymentReceipt.entryFormIds
        else if(this.paymentReceiptForm.value.entryFormIds!=null)
        entryFormIds = this.selectedPaymentReceipt.entryFormIds.split(',');
        const index3 = entryFormIds.indexOf(0);
        if (index3 > -1) {
            entryFormIds.splice(index3, 1)
        } 
        this.archivePaymentReceiptModel.creditNoteIds = expenses.join();
        this.archivePaymentReceiptModel.entryFormIds = entryFormIds.join();
        paymentReceiptPopUp.openPopover();
     }

     dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort) {
            this.paymentReceiptModel = orderBy(this.paymentReceiptModel, this.state.sort);
        }
        this.paymentReceiptModelList = {
            data: this.paymentReceiptModel.slice(this.state.skip, this.state.take + this.state.skip),
            total: this.paymentReceiptModel.length
        }
    }

    closeDeletePopup() {
        this.selectedBank={};
        this.archivePaymentReceiptPopUp.forEach((p) => { p.closePopover(); });
    }
    closePopUp(formDirective:FormGroupDirective) {
        formDirective.resetForm()
        this.paymentReceiptPopUp.forEach((p) => { p.closePopover(); });
    }

    filesExist(event) {
        this.isFileExist = event;
    }
    getTypeSelected(event){
        const type = this.types.find(element => element.name === event);
        this.selectedType = type;
    }
    getColor(){
        return this.selectedType.color;
    }
    onInvoiceValueChange(){
        this.tvaCal = Number(this.decimalPipe.transform(Number((this.tva*Number(this.invoiceValue))/100), "1.1-2"));
        this.arrondi = Number(this.decimalPipe.transform(Number(this.invoiceValue)+this.tvaCal,"1.1-2"));
    }
    getCreditNote() {
        this.isLoading = true;
        var creditNoteModel = new CreditNoteModel();
        creditNoteModel.isArchived = false;
        this.siteService.getCreditNote(creditNoteModel).subscribe((response: any) => {
            this.isLoading = false;
            if (response.success) {
                this.expenses = response.data;
            } else {
                this.toastr.error('', response.apiResponseMessages[0].message);
            }
        })
    }
    compareSelectedCreditNotesFn(creditNotes: any, selectedCreditNotes: any) {
        if (creditNotes == selectedCreditNotes) {
            return true;
        } else {
            return false;
        }
    }
    getSelectedCreditss() {
        let expensevalues=[];
        if (Array.isArray(this.paymentReceiptForm.value.creditNoteIds))
        expensevalues = this.paymentReceiptForm.value.creditNoteIds;
        else if(this.paymentReceiptForm.value.creditNoteIds!=null)
        expensevalues = this.paymentReceiptForm.value.creditNoteIds.split(',');

        const component = expensevalues;
        const index = component.indexOf(0);
        if (index > -1) {
            component.splice(index, 1);
        }
        const expensesList = this.expenses;
        const selectedCreditssList = _.filter(expensesList, function (expense) {
            return component.toString().includes(expense.id);
        })
        const creditNoteNames = selectedCreditssList.map((x) => "NC-"+x.siteName+"-"+new Date(x.year).getFullYear());
        this.creditNoteNames = creditNoteNames.toString();
    }

    toggleAllCreditssSelected() {
        if (this.allSelected.selected) {
            this.paymentReceiptForm.controls['creditNoteIds'].patchValue([
                0, ...this.expenses.map(item => item.id)
            ]);
        } else {
            this.paymentReceiptForm.controls['creditNoteIds'].patchValue([]);
        }
        this.getSelectedCreditss()
    }

    toggleCreditssPerOne(event) {
        if (this.allSelected.selected) {
            this.allSelected.deselect();
            return false;
        }
        if (
            this.paymentReceiptForm.controls['creditNoteIds'].value.length ===
            this.expenses.length
        ) {
            this.allSelected.select();
        }
    }
    getSelectedBank(event){
        const bank = this.banks.find(element => element.id === event);
        this.selectedBank = bank;
    }
    getiban(){
        return this.selectedBank.iban
    }
    numberOnlyWithVal(event, value) {
        const charCode = (event.which || event.dot) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          if (charCode == 46 && value.toString().includes(".") == false) {
            return true;
          }
          return false;
        }
        return true;
    }

    compareSelectedEntryFormFn(entryForms: any, selectedEntryForms: any) {
        if (entryForms == selectedEntryForms) {
            return true;
        } else {
            return false;
        }
    }
    getSelectedEntryForms() {
        let entryFormvalues;
        if (Array.isArray(this.paymentReceiptForm.value.entryFormIds))
        entryFormvalues = this.paymentReceiptForm.value.entryFormIds;
        else
        entryFormvalues = this.paymentReceiptForm.value.entryFormIds.split(',');

        const component = entryFormvalues;
        const index = component.indexOf(0);
        if (index > -1) {
            component.splice(index, 1);
        }
        const entryFormsList = this.entryForms;
        const selectedEntryFormsList = _.filter(entryFormsList, function (entryForm) {
            return component.toString().includes(entryForm.id);
        })
        const gridInvoiceNames = selectedEntryFormsList.map((x) => x.gridInvoiceName);
        this.gridInvoiceNames = gridInvoiceNames.toString();
    }

    toggleAllEntryFormsSelected() {
        if (this.allEntryFormsSelected.selected) {
            this.paymentReceiptForm.controls['entryFormIds'].patchValue([
                0, ...this.entryForms.map(item => item.id)
            ]);
        } else {
            this.paymentReceiptForm.controls['entryFormIds'].patchValue([]);
        }
        this.getSelectedEntryForms()
    }

    toggleEntryFormsPerOne(event) {
        if (this.allEntryFormsSelected.selected) {
            this.allEntryFormsSelected.deselect();
            return false;
        }
        if (
            this.paymentReceiptForm.controls['entryFormIds'].value.length ===
            this.entryForms.length
        ) {
            this.allEntryFormsSelected.select();
        }
    }
}