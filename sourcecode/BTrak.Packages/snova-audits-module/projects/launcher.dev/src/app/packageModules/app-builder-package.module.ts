import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { ResidentObservationsComponent, ObservationsTypeComponent, ResidentDetailsHistoryComponent, ResidentAppComponent, ResidentDetailsComponent, GenericFormsViewComponent, AddCustomWidgetComponent, AddCustomHtmlAppComponent, NewProcessWidgetComponent, CustomWidgetTableComponent, AppBuilderModule, CustomHtmlAppDetailsComponent, ProcessAppComponent, CustomWidgetManagementComponent, builderModulesInfo, BuilderModulesService ,CustomSubqueryTableComponent, GenericFormRoutes, CustomApplicationComponent, GenericStatusComponent} from "@snovasys/snova-app-builder-creation-components";
//import { info } from 'app/common/constants/modules';
import * as cloneDeep_ from 'lodash/cloneDeep';
import { RouterModule } from "@angular/router";
import { AdminLayoutComponent, shellModulesInfo, ShellModule } from "@snovasys/snova-shell-module";


const cloneDeep = cloneDeep_;

export class AppBuilderComponentSupplierService {

  static components =  [
    { name: "custom component", componentTypeObject: CustomWidgetTableComponent },
    { name: "html component", componentTypeObject: CustomHtmlAppDetailsComponent },
    { name: "process component", componentTypeObject: ProcessAppComponent },
    {
        name: "All apps",
        componentTypeObject: CustomWidgetManagementComponent
    },
    {
      name: "CustomSubQuery",  componentTypeObject:  CustomSubqueryTableComponent,
    },
    {
      name: "AddCustomWidgetComponent",  componentTypeObject:  AddCustomWidgetComponent,
    },
    {
      name: "AddCustomHtmlAppComponent",  componentTypeObject:  AddCustomHtmlAppComponent,
    },
    {
      name: "NewProcessWidgetComponent",  componentTypeObject:  NewProcessWidgetComponent,
    },
    {
      name: "Custom applications",  componentTypeObject:  CustomApplicationComponent,
    },
    {
      name: "View forms",  componentTypeObject:  GenericFormsViewComponent,
    },
    {
      name: "Form details",  componentTypeObject:  ResidentDetailsComponent,
    },
    {
      name: "Forms",  componentTypeObject:  ResidentAppComponent,
    },
    {
      name: "Form history",  componentTypeObject:  ResidentDetailsHistoryComponent,
    },
    {
      name: "Observation Types",  componentTypeObject:  ObservationsTypeComponent,
    },
    {
      name: "Form observations",  componentTypeObject:  ResidentObservationsComponent,
    },
    {
        name: "Generic status",componentTypeObject:  GenericStatusComponent
    }
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
    ShellModule,
    //.forChild({ modules: cloneDeep((cloneDeep(info) as shellModulesInfo).modules) }),
    AppBuilderModule,
    //.forChild({ modules: cloneDeep((cloneDeep(info) as builderModulesInfo).modules) })
  ],
  providers:[
    //{provide: BuilderModulesService, useValue: (cloneDeep(info) as builderModulesInfo) }
  ]
})
export class AppBuilderPacakgeModule {
  static componentService = AppBuilderComponentSupplierService;
}
