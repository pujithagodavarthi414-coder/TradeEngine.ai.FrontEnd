import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AppBuilderModule, CustomWidgetTableComponent, CustomHtmlAppDetailsComponent, ProcessAppComponent, CustomWidgetManagementComponent, builderModulesInfo, BuilderModulesService } from "@thetradeengineorg1/snova-app-builder-creation-components";
import { DailyPositionTableComponent } from '@thetradeengineorg1/snova-module-tabs-module';
import { ShellModule, shellModulesInfo } from "@thetradeengineorg1/snova-shell-module";
import { moduleLoader } from "../../module-loader";
import { info } from "../modules";

export class AppBuilderComponentSupplierService {

  static components = [
    { name: "custom component", componentTypeObject: CustomWidgetTableComponent },
    { name: "html component", componentTypeObject: CustomHtmlAppDetailsComponent },
    { name: "process component", componentTypeObject: ProcessAppComponent },
    {
      name: "All apps",
      componentTypeObject: CustomWidgetManagementComponent
    },
    {
      name: "Daily Positions & P n L Reporting", componentTypeObject: DailyPositionTableComponent
    }
  ];
}

@NgModule({
  imports: [
    CommonModule,
    AppBuilderModule,
    ShellModule.forChild(moduleLoader as shellModulesInfo),
    AppBuilderModule.forChild(info as builderModulesInfo)
  ],
  declarations: [],
  entryComponents: [CustomWidgetTableComponent],
  providers: [
    { provide: BuilderModulesService, useValue: info as builderModulesInfo }
  ]
})
export class AppBuilderPacakgeModule {
  static componentService = AppBuilderComponentSupplierService;
}
