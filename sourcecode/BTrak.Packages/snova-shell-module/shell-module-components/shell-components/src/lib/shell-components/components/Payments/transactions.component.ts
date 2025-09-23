import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatOption } from "@angular/material/core";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { ToastrService } from 'ngx-toastr';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { InvoiceOutputModel } from '../../models/invoiceOutput-model';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: "app-transactions-component",
  templateUrl: "./transactions.component.html"
})

export class TransactionsComponent implements OnInit {


  selectedTab: string = "Invoices";
  selectedTabIndex: number;
  paymentDetails : any;
  isAnyOperationIsInprogress : boolean = false;
  isFromRoute : boolean = false;
  invoiceDetails : InvoiceOutputModel;
  invoiceList : InvoiceOutputModel[] = [];
  invoices : any;
  payments : any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any
  ,private paymentService: PaymentService
  ,private toastr: ToastrService,
  private cdRef: ChangeDetectorRef) {

  }

  ngOnInit() {
   this.getAllTransactions();
  }
  onTabClick(selectedName){
      this.selectedTab = selectedName;
      this.getAllTransactions();
  }

  getAllTransactions(){
    this.invoices = [];
    this.paymentService.getAllTransactions(this.selectedTab).subscribe((responseData: any) => {
      if (responseData.success == true) {
        this.invoices = responseData.data;
      }
      else {
        this.toastr.error(responseData.apiResponseMessages[0].message);
      }
  });
  }

  downloadInvoice(pdfLink){
    window.open(pdfLink);
  }
  
}
