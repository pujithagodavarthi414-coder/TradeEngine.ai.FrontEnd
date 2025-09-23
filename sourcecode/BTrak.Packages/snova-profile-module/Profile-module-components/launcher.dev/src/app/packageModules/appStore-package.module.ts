import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AppStoreModule, AppStoreComponent, WidgetslistComponent } from "@thetradeengineorg1/snova-appstore-module";

export class AppStoreComponentSupplierService {

  static components =  [
    { name: "app store", componentTypeObject: AppStoreComponent },
    { name: "Widget list", componentTypeObject: WidgetslistComponent }
  ];
}

@NgModule({
  imports: [
    CommonModule,
    AppStoreModule
  ],
  declarations:[],
  entryComponents:[]
})
export class AppStorePacakgeModule {
  static componentService = AppStoreComponentSupplierService;
}
