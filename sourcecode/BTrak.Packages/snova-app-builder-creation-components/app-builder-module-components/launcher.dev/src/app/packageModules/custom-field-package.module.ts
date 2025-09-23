import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CustomFieldAppComponent, CustomFieldsComponentModule, CustomFieldsComponent, CustomFormsComponent, ViewCustomFormComponent } from "@thetradeengineorg1/snova-custom-fields";


export class CustomFieldsComponentSupplierService {

  static components =  [
    { name: "Custom fields", componentTypeObject: CustomFieldAppComponent },
    { name: "Custom field comp", componentTypeObject: CustomFieldsComponent },
    { name: "custom view form", componentTypeObject: ViewCustomFormComponent },
    { name: "custom forms", componentTypeObject: CustomFormsComponent }
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
