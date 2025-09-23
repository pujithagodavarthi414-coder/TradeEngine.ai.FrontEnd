import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { WidgetsgridsterComponent, CustomAppsListViewComponent, WidgetModule } from "@thetradeengineorg1/snova-widget-module";
import { info } from '../constants/profile.modules';

export class WidgetComponentSupplierService {

    static components = [
        {
            name: "Custom Widget",
            componentTypeObject: WidgetsgridsterComponent
        },
        {
            name: "Custom apps view",
            componentTypeObject: CustomAppsListViewComponent
        }
    ]
}

@NgModule({
    imports: [
        CommonModule,
        WidgetModule.forChild({ modules: info.modules })
    ]
})
export class WidgetPackageModule {
    static componentService = WidgetComponentSupplierService;
}
