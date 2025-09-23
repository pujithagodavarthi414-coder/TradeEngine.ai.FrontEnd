import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AppStoreModule, AppStoreComponent, AppStoreRoutes, WidgetslistComponent, AppStoreModulesService, AppStoreModulesInfo } from "@thetradeengineorg1/snova-appstore-module";
import { RouterModule } from "@angular/router";
import { ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService } from '@thetradeengineorg1/snova-shell-module';
import { info } from 'app/common/constants/modules';
import { moduleLoader } from "app/common/constants/module-loader";

export class AppStoreComponentSupplierService {

  static components = [
    { name: "app store", componentTypeObject: AppStoreComponent },
    { name: "Widget list", componentTypeObject: WidgetslistComponent }
  ];
}

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'widgets',
        component: AdminLayoutComponent,
        children: AppStoreRoutes
      }      
    ]),
    CommonModule,
    ShellModule.forChild(moduleLoader as shellModulesInfo),
    AppStoreModule.forChild(moduleLoader as any)
  ],
  declarations: [],
  entryComponents: [],
  providers: [
    { provide: ShellModulesService, useValue: moduleLoader as shellModulesInfo },
    {provide: AppStoreModulesService, useValue: moduleLoader as any }
  ]
})
export class AppStorePacakgeModule {
  static componentService = AppStoreComponentSupplierService;
}
