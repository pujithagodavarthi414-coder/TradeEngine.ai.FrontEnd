import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ClientKycConfigurationComponent, LeadTemplateComponent, PurchaseContractComponent, ProductTableComponent,PaymentTermComponent, PortDetailsComponent,ConsignerListComponent ,ConsigneeComponent} from "@thetradeengineorg1/snova-billing-module";
import { GRDComponent, SitesComponent, VatComponent, SolarLogComponent, EntryFormFieldComponent, GradeComponent, VesselComponent, LegalEntityComponent,CounterPartyTypesComponent,KycFormStatusComponent, TemplateConfigComponent } from "@thetradeengineorg1/snova-billing-module";
import { InvoiceModule, EstimatesViewComponent, AddInvoiceComponent, InvoiceStatusComponent, BankAccountComponent, GroupETableComponent, InvoicesComponent,MessageFieldTypeComponent,BillingWidgetRoutes, BiilingwidgetModulesService} from "@thetradeengineorg1/snova-billing-widgets";
import { CreditNoteComponent, MasterAccountComponent, ExpenseBookingComponent, PaymentReceiptComponent } from "@thetradeengineorg1/snova-billing-module";
import { AdminLayoutComponent, ShellModule, shellModulesInfo, ShellModulesService } from '@thetradeengineorg1/snova-shell-module';
import { moduleLoader } from "app/common/constants/module-loader";
import { info } from 'app/common/constants/modules';

export class InvoiceComponentSupplierService {

  static components = [
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
    },
    {
      name: "Kyc configuration",
      componentTypeObject: ClientKycConfigurationComponent
    },
    {
      name: "Leads app",
      componentTypeObject: LeadTemplateComponent
    },
    {
      name: "Purchase contract configuration",
      componentTypeObject: PurchaseContractComponent
    },
    {
      name: "Sites",
      componentTypeObject: SitesComponent
    },
    {
      name: "GRD",
      componentTypeObject: GRDComponent
    },
    {
      name: "Entry form",
      componentTypeObject: GroupETableComponent
    },
    {
      name: "TVA",
      componentTypeObject: VatComponent
    },
    {
      name: "Bank accounts",
      componentTypeObject: BankAccountComponent
    },
    {
      name: "Solar log",
      componentTypeObject: SolarLogComponent
    },
    {
      name: "Entry form field",
      componentTypeObject: EntryFormFieldComponent
    },
    {
      name: "Product",
      componentTypeObject: ProductTableComponent
    },
    {
      name: "TVA",
      componentTypeObject: VatComponent
    },
    {
      name: "Bank accounts",
      componentTypeObject: BankAccountComponent
    },
    {
      name: "Solar log",
      componentTypeObject: SolarLogComponent
    },
    {
      name: "Entry form field",
      componentTypeObject: EntryFormFieldComponent
    },
    {
      name: "Grades",
      componentTypeObject: GradeComponent
    },
    {
      name: "Mode or Terms of Payment",
      componentTypeObject: PaymentTermComponent
    },
    {
      name: "Port Details",
      componentTypeObject: PortDetailsComponent
    },
    {
      name: "Consigner",
      componentTypeObject: ConsignerListComponent
    },
    {
      name: "Consignee",
      componentTypeObject: ConsigneeComponent
    },
    {
      name: "Vessels",
      componentTypeObject: VesselComponent
    },
  {
    name: "TVA",
    componentTypeObject: VatComponent
  },
  {
    name: "Bank accounts",
    componentTypeObject: BankAccountComponent
  },
  {
    name: "Solar log",
    componentTypeObject: SolarLogComponent
  },
  {
    name: "Entry form field",
    componentTypeObject: EntryFormFieldComponent
  },
  {
    name: "Message Field type",
    componentTypeObject: MessageFieldTypeComponent
  },
  {
    name: "Credit Notes",
    componentTypeObject: CreditNoteComponent
  },
  {
    name: "Master Accounts",
    componentTypeObject: MasterAccountComponent
  },
  {
    name: "Expense Bookings",
    componentTypeObject: ExpenseBookingComponent
  },
  {
    name: "Payment Receipts",
    componentTypeObject: PaymentReceiptComponent
  },
  {
    name: "Legal entity types",
    componentTypeObject: LegalEntityComponent
  },
  {
    name: "Client types",
    componentTypeObject: CounterPartyTypesComponent
  },
  {
    name: "KYC form status",
    componentTypeObject: KycFormStatusComponent
  },
  {
    name: "Terms and Conditions",
    componentTypeObject: TemplateConfigComponent
  }
  ]
}

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AdminLayoutComponent,
        children: BillingWidgetRoutes
      }
    ]),
    CommonModule,
    InvoiceModule.forChild(moduleLoader as any),
    ShellModule.forChild(moduleLoader as shellModulesInfo),
  ],
  providers: [
    { provide: ShellModulesService, useValue: moduleLoader as shellModulesInfo },
    { provide: BiilingwidgetModulesService, useValue: moduleLoader as any }
  ]
})
export class InvoicePackageModule {
  static componentService = InvoiceComponentSupplierService;
}
