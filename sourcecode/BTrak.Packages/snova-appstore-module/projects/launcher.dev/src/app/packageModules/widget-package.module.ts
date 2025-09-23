import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { WidgetModule, WidgetsgridsterComponent } from '@snovasys/snova-widget-module';
import dynamicComponentsJson from '../models/modules';

export class WidgetComponentSupplierService {

  static components =  [
    { name: "Custom Widget", componentTypeObject: WidgetsgridsterComponent }
  ];
}

@NgModule({
  imports: [
    CommonModule,
    WidgetModule.forChild({ modules: dynamicComponentsJson.modules }),

  ]
})
export class WidgetPackageModule {
  static componentService = WidgetComponentSupplierService;
}
