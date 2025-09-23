import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { CustomFieldAppComponent, CustomFieldsComponentModule, CustomFieldsComponent } from "@snovasys/snova-custom-fields";


export class CustomFieldsComponentSupplierService {

  static components =  [
    { name: "Custom fields", componentTypeObject: CustomFieldAppComponent },
    { name: "Custom field comp", componentTypeObject: CustomFieldsComponent }
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
