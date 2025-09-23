import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { WidgetModule, WidgetsgridsterComponent, CustomAppsListViewComponent } from '@snovasys/snova-widget-module';
import { moduleLoader } from "trading-module-components/trading-components/src/lib/globaldependencies/constants/module-loader";

export class WidgetComponentSupplierService {

  static components =  [
    { name: "Custom Widget", componentTypeObject: WidgetsgridsterComponent },
    { name: "Custom apps view", componentTypeObject: CustomAppsListViewComponent }
  ];
}

@NgModule({
  imports: [
    CommonModule,
    WidgetModule.forChild(moduleLoader as any)
  ]
})
export class WidgetPackageModule {
  static componentService = WidgetComponentSupplierService;
}
