import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { WidgetModule, WidgetsgridsterComponent, CustomAppsListViewComponent } from '@snovasys/snova-widget-module';

export class WidgetComponentSupplierService {

  static components =  [
    { name: "Custom Widget", componentTypeObject: WidgetsgridsterComponent },
    { name: "Custom apps view", componentTypeObject: CustomAppsListViewComponent }
  ];
}

@NgModule({
  imports: [
    CommonModule,
    WidgetModule
  ]
})
export class WidgetPackageModule {
  static componentService = WidgetComponentSupplierService;
}
