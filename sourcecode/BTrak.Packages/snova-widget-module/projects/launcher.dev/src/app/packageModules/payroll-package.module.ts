import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PayrollManagementModule, PayRollTemplateConfigurationComponent } from "@thetradeengineorg1/snova-payroll";


export class PayrollComponentSupplierService {

  static components =  [
    {
      name: "Payroll template configuration",
      componentTypeObject: PayRollTemplateConfigurationComponent
  },
  ]
}

@NgModule({
  imports: [
    CommonModule,
    PayrollManagementModule
  ]
})
export class PayrollPackageModule {
  static componentService = PayrollComponentSupplierService;
}
