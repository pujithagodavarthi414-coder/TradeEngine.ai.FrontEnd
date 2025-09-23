import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { AppStoreModule, AppStoreComponent, WidgetslistComponent } from '@snovasys/snova-appstore-module';
import { moduleLoader } from "trading-module-components/trading-components/src/lib/globaldependencies/constants/module-loader";

export class AppStoreComponentSupplierService {

  static components =  [
    { name: "App Store", componentTypeObject: AppStoreComponent },
    { name: "Widget list", componentTypeObject: WidgetslistComponent }
  ];
}

@NgModule({
  imports: [
    CommonModule,
    AppStoreModule.forChild(moduleLoader as any)
  ]
})
export class AppStorePacakgeModule {
  static componentService = AppStoreComponentSupplierService;
}