import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { AppStoreModule, AppStoreComponent, WidgetslistComponent } from '@snovasys/snova-appstore-module';

export class AppStoreComponentSupplierService {

  static components =  [
    { name: "App Store", componentTypeObject: AppStoreComponent },
    { name: "Widget list", componentTypeObject: WidgetslistComponent }
  ];
}

@NgModule({
  imports: [
    CommonModule,
    AppStoreModule
  ]
})
export class AppStorePacakgeModule {
  static componentService = AppStoreComponentSupplierService;
}
