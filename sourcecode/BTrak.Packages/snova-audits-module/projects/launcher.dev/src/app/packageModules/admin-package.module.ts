import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AdminModule,FormTypeComponent } from "@snovasys/snova-admin-module";


export class AdminComponentSupplierService {

  static components =  [
    {
        name: "Form type",
        componentTypeObject: FormTypeComponent
    }
  ];
}

@NgModule({
  imports: [
    CommonModule,
    AdminModule
  ]
})
export class AdminPackageModule {
  static componentService = AdminComponentSupplierService;
}