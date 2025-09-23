import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { InvoiceModule, EstimatesViewComponent, AddInvoiceComponent, InvoiceStatusComponent, InvoicesComponent } from "@snovasys/snova-billing-widgets";


export class InvoiceComponentSupplierService {

  static components =  [
  
    {
        name: "Invoice status",
        componentTypeObject: InvoiceStatusComponent
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
