import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { InvoiceModule, EstimatesViewComponent, AddInvoiceComponent, InvoiceStatusComponent, InvoicesComponent } from "@thetradeengineorg1/snova-billing-widgets";


export class InvoiceComponentSupplierService {

  static components =  [
    {
        name: "Estimates",
        componentTypeObject: EstimatesViewComponent
    },
    {
        name: "Add invoice",
        componentTypeObject: AddInvoiceComponent
    },
    {
        name: "Invoice status",
        componentTypeObject: InvoiceStatusComponent
    },
    {
        name: "Invoices",
        componentTypeObject: InvoicesComponent
    }
  ]
}

@NgModule({
  imports: [
    CommonModule,
    InvoiceModule
  ]
})
export class InvoicePackageModule {
  static componentService = InvoiceComponentSupplierService;
}
