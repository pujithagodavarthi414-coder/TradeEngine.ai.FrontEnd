import { DecimalPipe } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren } from "@angular/core"
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { orderBy, State } from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { ConstantVariables } from "../../constants/constant-variables";
import { ExpenseBookingModel } from "../../models/expense-booking.model";
import { MasterAccountModel } from "../../models/master-account.model";
import { SiteModel } from "../../models/site-model";
import { SiteService } from "../../services/site.service";
import { AppBaseComponent } from "../componentbase";

@Component({
    selector: "app-manage-expense-booking",
    templateUrl: "expense-booking.component.html",
    changeDetection: ChangeDetectionStrategy.Default
})

export class ExpenseBookingComponent extends AppBaseComponent implements OnInit {
    @ViewChildren("addExpenseBookingPopUp") expenseBookingPopUp;
    @ViewChildren("archiveExpenseBookingPopUp") archiveExpenseBookingPopUp
    isLoading: boolean;
    expenseBookingModel: ExpenseBookingModel[] = [];
    expenseBookingModelList: GridDataResult;
    archiveExpenseBookingModel: ExpenseBookingModel;
    state: State = {
        skip: 0,
        take: 10
    };
    expenseBookingId: string;
    timestamp: any;
    expenseBookingForm: FormGroup;
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
    selectedExpense: any={};
    moduleTypeId = 10;
    referenceTypeId: string = ConstantVariables.ExpenseReferenceTypeId;
    selectedStoreId: null;
    selectedParentFolderId: null;
    isToUploadFiles: boolean = false;
    isFileExist: boolean;
    selectedType: any={ name: "Kind of Record", color:"#fbfd90" };
    arrondi: number;
    tvaCal: number;
    tva: any=7.7;
    invoiceValue: any;
    todaysDate: Date;
    before: boolean;

    constructor(private siteService : SiteService, private decimalPipe: DecimalPipe, private toastr: ToastrService, private cdRef: ChangeDetectorRef) {
        super();
        var newDate = new Date();
        this.todaysDate = newDate;
      this.getExpenseBooking();
      this.getMasterAccount();
      this.clearForm();
      this.getSites();
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
                this.tva=this.sites[0].tvaValue;
            }
            else {
                this.toastr.error('', result.apiResponseMessages[0].message);
            }
        });
    }

    getExpenseBooking() {
        this.isLoading = true;
        var expenseBookingmodel = new ExpenseBookingModel();
        expenseBookingmodel.isArchived = false;
        this.siteService.getExpenseBookings(expenseBookingmodel).subscribe((response: any) => {
            this.isLoading = false;
            if(response.success) {
                this.expenseBookingModel = response.data;
                if (this.expenseBookingModel.length > 0) {
                    this.expenseBookingModelList = {
                        data: this.expenseBookingModel.slice(this.state.skip, this.state.take + this.state.skip),
                        total: this.expenseBookingModel.length
                    }
                } else {
                    this.expenseBookingModelList = {
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
        this.arrondi=null;
        this.tvaCal=null;
        this.year=new Date();
        this.month=new Date();
        this.timestamp = null;
        this.selectedExpense={};
        this.timestamp = null;
        this.expenseBookingForm = new FormGroup({
            id: new FormControl(null, []),
            type: new FormControl(null, Validators.compose([Validators.required])),
            entryDate: new FormControl(null, Validators.compose([Validators.required])),
            month: new FormControl(null, Validators.compose([Validators.required])),
            term: new FormControl(null, Validators.compose([Validators.required])),
            year: new FormControl(null, Validators.compose([Validators.required])),
            siteId: new FormControl(null, Validators.compose([Validators.required])),
            accountId: new FormControl(null, Validators.compose([Validators.required])),
            vendorName: new FormControl("", Validators.compose([Validators.required,Validators.maxLength(250)])),
            invoiceNo: new FormControl("", Validators.compose([Validators.required,Validators.maxLength(250)])),
            description: new FormControl("", Validators.compose([Validators.maxLength(60)])),
            invoiceDate: new FormControl(null, Validators.compose([Validators.required])),
            comments: new FormControl("", Validators.compose([Validators.maxLength(150)])),
            invoiceValue: new FormControl("", Validators.compose([Validators.required,Validators.max(9999999999)])),
            isTVAApplied: new FormControl(null, Validators.compose([])),
        })
    }
    yearEmitHandled(value) {
        this.expenseBookingForm.get('year').patchValue(value);
    }

    monthEmitHandled(value) {
        this.expenseBookingForm.get('month').patchValue(value);
    }

    upsertExpenseBooking(formDirective:FormGroupDirective) {
        this.isAddIsInProgress = true;
        var upsertExpenseBookingmodel = new ExpenseBookingModel();
        upsertExpenseBookingmodel = this.expenseBookingForm.value;
        upsertExpenseBookingmodel.id = this.expenseBookingId;
        upsertExpenseBookingmodel.timeStamp = this.timestamp;
        this.siteService.upsertExpenseBooking(upsertExpenseBookingmodel).subscribe((response: any)=> {
            this.isAddIsInProgress = false;
            if(response.success) {
                this.expenseBookingId = response.data;
                this.expenseBookingPopUp.forEach((p) => { p.closePopover(); });
                formDirective.resetForm();
                this.isToUploadFiles = true;
                this.getExpenseBooking();
                this.clearForm();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    archiveExpenseBooking() {
        this.isArchiveInProgress = true;
        var upsertExpenseBookingmodel = new ExpenseBookingModel();
        upsertExpenseBookingmodel = this.archiveExpenseBookingModel;
        upsertExpenseBookingmodel.isArchived = true;
        this.siteService.upsertExpenseBooking(upsertExpenseBookingmodel).subscribe((response: any)=> {
            this.isArchiveInProgress = false;
            if(response.success) {
                this.archiveExpenseBookingPopUp.forEach((p) => { p.closePopover(); });
                this.getExpenseBooking();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    editExpenseBookingPopUp(dataItem, expenseBookingPopUp) {
        this.before=!this.before;
        this.getTypeSelected(dataItem.type);
        this.getExpenseSelected(dataItem.accountId);
       this.expenseBookingId = dataItem.id;
       this.year = dataItem.year;
       this.month = dataItem.month;
       this.timestamp = dataItem.timeStamp;
       this.expenseBookingForm.patchValue(dataItem);
       this.expenseBookingForm.get('year').patchValue(this.year);
       this.expenseBookingForm.get('month').patchValue(this.month);
       this.onInvoiceValueChange();
       expenseBookingPopUp.openPopover();
    }

    openExpenseBookingPopUp(expenseBookingPopUp) {
        this.expenseBookingId=null;
        this.before=!this.before;
      this.clearForm();
      this.selectedType={ name: "Kind of Record", color:"#fbfd90" };
      this.expenseBookingForm.get('entryDate').patchValue(this.todaysDate);
      this.expenseBookingForm.get('year').patchValue(this.year);
      this.expenseBookingForm.get('month').patchValue(this.month);
      expenseBookingPopUp.openPopover();
    }

    deleteExpenseBookingPopUp(dataItem, expenseBookingPopUp) {
        this.archiveExpenseBookingModel = dataItem;
        expenseBookingPopUp.openPopover();
     }

     dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort) {
            this.expenseBookingModel = orderBy(this.expenseBookingModel, this.state.sort);
        }
        this.expenseBookingModelList = {
            data: this.expenseBookingModel.slice(this.state.skip, this.state.take + this.state.skip),
            total: this.expenseBookingModel.length
        }
    }

    closeDeletePopup() {
        this.archiveExpenseBookingPopUp.forEach((p) => { p.closePopover(); });
    }
    closePopUp() {
        this.expenseBookingId=null;
        this.expenseBookingPopUp.forEach((p) => { p.closePopover(); });
        this.cdRef.detectChanges();
    }

    getMasterAccount() {
        this.isLoading = true;
        var masterAccountmodel = new MasterAccountModel();
        masterAccountmodel.isArchived = false;
        this.siteService.getMasterAccount(masterAccountmodel).subscribe((response: any) => {
            this.isLoading = false;
            if(response.success) {
                this.expenses = response.data;
                this.cdRef.detectChanges();
            } else {
                this.toastr.error('', response.apiResponseMessages[0].message);
            }
        })
    }

    getExpenseSelected(event){
        const expense = this.expenses.find(element => element.id === event);
        this.selectedExpense = expense;
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
        this.tvaCal = (this.tva*Number(this.expenseBookingForm.get("invoiceValue").value))/100;
        if(this.expenseBookingForm.get("isTVAApplied").value === true){
            this.arrondi = Number(this.decimalPipe.transform(Number(this.expenseBookingForm.get("invoiceValue").value)+Number(this.tvaCal),"1.1-2"));
        } else{
            this.arrondi = Number(this.decimalPipe.transform(this.expenseBookingForm.get("invoiceValue").value,"1.1-2"));
        }
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
}