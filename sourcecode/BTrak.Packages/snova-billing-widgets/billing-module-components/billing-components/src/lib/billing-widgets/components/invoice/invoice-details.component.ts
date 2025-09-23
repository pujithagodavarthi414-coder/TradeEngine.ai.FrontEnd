import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { InvoiceFilterModel } from '../../models/invoice-filter-model';
import { RecentInvoiceModel } from "../../models/recent-invoice-model";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { InvoiceInputModel } from '../../models/invoice-input-model';
import '../../../globaldependencies/helpers/fontawesome-icons'

@Component({
  selector: "app-billing-component-invoice-invoicedetails",
  templateUrl: "invoice-details.component.html"
})

export class InvoiceDetailsComponent {

  invoiceList: RecentInvoiceModel[];

  @Input('projectTypeId')
  set projectTypeId(data: string) {
    this.projectId = data;
    this.getRecentInvoices();
  }

  loadInvoiceList: boolean = false;
  error: boolean;
  projectId: string;
  validationMessage: String[];

  constructor(
    private router: Router,
    // private invoiceService: InvoiceService
  ) {
  }

  ngOnInit() {

    this.invoiceList = [];
    this.getRecentInvoices();

  }
  NavigateToAddNewInvoice() {
    this.router.navigate(['billing/AddInvoice']);

  }
  getRecentInvoices() {
    const invoiceInput = new InvoiceInputModel();
    let invoiceFilter = new InvoiceFilterModel()
    invoiceFilter.projectId = this.projectId;
    invoiceInput.invoiceFilter = [];
    invoiceInput.invoiceFilter.push(invoiceFilter);
    // this.invoiceService.getRecentInvoice(invoiceInput).subscribe(response => {

    //   if (response.success == true) {
    //     this.invoiceList = response;
    //     this.loadInvoiceList = true;
    //   }
    //   else {
    //     this.error = true;
    //     this.validationMessage = response.apiResponseMessage;
    //   }
    // })
  }

}
