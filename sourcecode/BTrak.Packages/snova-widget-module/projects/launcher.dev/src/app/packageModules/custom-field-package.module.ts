import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { CustomFieldAppComponent, CustomFieldsComponentModule } from "@thetradeengineorg1/snova-custom-fields";


export class CustomFieldsComponentSupplierService {

  static components =  [
    { name: "Custom fields", componentTypeObject: CustomFieldAppComponent }
  ];
}

@NgModule({
  imports: [
    CommonModule,
    CustomFieldsComponentModule
  ]
})
export class CustomFieldsPackageModule {
  static componentService = CustomFieldsComponentSupplierService;
}
