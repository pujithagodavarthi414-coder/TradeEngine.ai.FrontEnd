import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { WidgetModule, WidgetsgridsterComponent, modulesInfo, ModulesService, CustomAppsListViewComponent, HiddenWorkspaceslistComponent, WidgetRoutes, FilteredListviewComponent} from '@thetradeengineorg1/snova-widget-module';

import { info } from "app/common/constants/modules";
import { ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService} from "@thetradeengineorg1/snova-shell-module";
import { RouterModule } from "@angular/router";
import { moduleLoader } from "app/common/constants/module-loader";

export class WidgetComponentSupplierService {

  static components =  [
    { name: "Custom Widget", componentTypeObject: WidgetsgridsterComponent },
    {
        name: "Custom apps view",
        componentTypeObject: CustomAppsListViewComponent
    },    
    {
        name: "hidden workspaces list",
        componentTypeObject: HiddenWorkspaceslistComponent
    },
    {
        name: "filtered apps view",
        componentTypeObject: FilteredListviewComponent
    }
  ];
}

@NgModule({
  imports: [
    RouterModule.forChild([
      {
          path: '',
          component: AdminLayoutComponent,
          children: WidgetRoutes
      }
    ]),
    CommonModule,
    ShellModule.forChild(moduleLoader as shellModulesInfo),
    WidgetModule.forChild(moduleLoader as any)
  ],
  providers:[
    {provide: ModulesService, useValue: moduleLoader as modulesInfo },
    {provide: ShellModulesService, useValue: moduleLoader as shellModulesInfo }
  ]
})
export class WidgetPackageModule {
  static componentService = WidgetComponentSupplierService;
}
