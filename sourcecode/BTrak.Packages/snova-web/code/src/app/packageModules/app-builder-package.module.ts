import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { ResidentObservationsComponent, ObservationsTypeComponent, ResidentDetailsHistoryComponent, ResidentAppComponent, ResidentDetailsComponent, GenericFormsViewComponent, AddCustomWidgetComponent, AddCustomHtmlAppComponent, NewProcessWidgetComponent, CustomWidgetTableComponent, AppBuilderModule, CustomHtmlAppDetailsComponent, ProcessAppComponent, CustomWidgetManagementComponent, builderModulesInfo, BuilderModulesService, CustomSubqueryTableComponent, GenericFormRoutes, CustomApplicationComponent, GenericStatusComponent, EmissionComponent, CustomAppRecordsExcelUploaderComponent } from "@thetradeengineorg1/snova-app-builder-creation-components";
import { info } from 'app/common/constants/modules';
import { RouterModule } from "@angular/router";
import { AdminLayoutComponent, shellModulesInfo, ShellModule } from "@thetradeengineorg1/snova-shell-module";
import { moduleLoader } from "app/common/constants/module-loader";
import { CPODashboardComponent, DailyPositionTableComponent, DashboardTableComponent, GlycerinConsolidatedDashboard, GlycerinDashboardComponent, PalmOilConsolidatedDashboard, PalmOilDashboard, RicebranDashboardComponent, RicebranOilConsolidatedDashboard, SoyabeanOilConsolidatedDashboard, SoyabeanOilDashboardComponent, SunFlowerDashboardComponent, SunflowerOilConsolidatedDashboard } from '@thetradeengineorg1/snova-module-tabs-module';

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
      name: "CustomSubQuery", componentTypeObject: CustomSubqueryTableComponent,
    },
    {
      name: "AddCustomWidgetComponent", componentTypeObject: AddCustomWidgetComponent,
    },
    {
      name: "AddCustomHtmlAppComponent", componentTypeObject: AddCustomHtmlAppComponent,
    },
    {
      name: "NewProcessWidgetComponent", componentTypeObject: NewProcessWidgetComponent,
    },
    {
      name: "Custom Applications", componentTypeObject: CustomApplicationComponent,
    },
    {
      name: "View Forms", componentTypeObject: GenericFormsViewComponent,
    },
    {
      name: "Form details", componentTypeObject: ResidentDetailsComponent,
    },
    {
      name: "Forms", componentTypeObject: ResidentAppComponent,
    },
    {
      name: "Form history", componentTypeObject: ResidentDetailsHistoryComponent,
    },
    {
      name: "Observation Types", componentTypeObject: ObservationsTypeComponent,
    },
    {
      name: "Form observations", componentTypeObject: ResidentObservationsComponent,
    },
    {
      name: "Generic status", componentTypeObject: GenericStatusComponent
    },
    {
      name: "Generic status", componentTypeObject: GenericStatusComponent
    },
    {
      name: "Positions and P&L", componentTypeObject: DashboardTableComponent
    },
    {
      name: "Palm Oil Instance level dashboard", componentTypeObject: PalmOilDashboard
    },
    {
      name: "Sunflower Oil Instance level dashboard", componentTypeObject: SunFlowerDashboardComponent
    },
    {
      name: "Glycerin Instance level dashboard", componentTypeObject: GlycerinDashboardComponent
    },
    {
      name: "Ricebran Oil Instance level dashboard", componentTypeObject: RicebranDashboardComponent
    },
    {
      name: "Soyabean oil Instance level dashboard", componentTypeObject: SoyabeanOilDashboardComponent
    },
    {
      name: "Consolidated Palm Oil dashboard", componentTypeObject: PalmOilConsolidatedDashboard
    },
    {
      name: "Consolidated Sunflower Oil dashboard", componentTypeObject: SunflowerOilConsolidatedDashboard
    },
    {
      name: "Consolidated Glycerin dashboard", componentTypeObject: GlycerinConsolidatedDashboard
    },
    {
      name: "Consolidated Ricebran Oil dashboard", componentTypeObject: RicebranOilConsolidatedDashboard
    },
    {
      name: "Consolidated Soyabean Oil dashboard", componentTypeObject: SoyabeanOilConsolidatedDashboard
    },
    {
      name: "Contract level dashboard", componentTypeObject: CPODashboardComponent
    },
    {
      name: "Daily Positions & P n L Reporting", componentTypeObject: DailyPositionTableComponent
    },
    {
      name: "Emissions", componentTypeObject: EmissionComponent
    },
    {
      name: "Custom App Records Excel Uploader", componentTypeObject: CustomAppRecordsExcelUploaderComponent
    },

  ];
}

@NgModule({

  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AdminLayoutComponent,
        children: GenericFormRoutes
      }
    ]),
    CommonModule,
    ShellModule.forChild(moduleLoader as shellModulesInfo),
    AppBuilderModule.forChild(info as builderModulesInfo)
  ],
  providers: [
    { provide: BuilderModulesService, useValue: info as builderModulesInfo }
  ]
})
export class AppBuilderPacakgeModule {
  static componentService = AppBuilderComponentSupplierService;
}
