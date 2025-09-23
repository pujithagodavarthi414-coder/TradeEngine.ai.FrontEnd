import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RosterModule, RosterRoutes } from "@thetradeengineorg1/snova-rostering";
import { AdminLayoutComponent, ShellModule, shellModulesInfo, ShellModulesService } from "@thetradeengineorg1/snova-shell-module";
import { moduleLoader } from "app/common/constants/module-loader";
import { info } from "app/common/constants/modules";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: "",
        component: AdminLayoutComponent,
        children: RosterRoutes
      }
    ]),
    CommonModule,
    ShellModule.forChild(moduleLoader as shellModulesInfo),
    RosterModule
  ],
  declarations: [],
  exports: [],
  providers: [
    {provide: ShellModulesService, useValue: moduleLoader as shellModulesInfo }
  ],
  entryComponents:[
    
  ]
})

export class RosterPackageModule {
}