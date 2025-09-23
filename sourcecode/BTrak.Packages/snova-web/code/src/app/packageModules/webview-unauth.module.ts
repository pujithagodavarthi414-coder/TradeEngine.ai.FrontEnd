import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AppBuilderModule, BuilderModulesService, GenericFormRoutes, WebPageViewComponent, builderModulesInfo } from "@thetradeengineorg1/snova-app-builder-creation-components";
import { AdminLayoutComponent, ShellModule, shellModulesInfo } from "@thetradeengineorg1/snova-shell-module";
import { moduleLoader } from "app/common/constants/module-loader";
import { info } from "app/common/constants/modules";
import { AppBuilderComponentSupplierService } from "./app-builder-package.module";

export class WebviewComponentService {

    static components = [
      { name: "webpage view", componentTypeObject: WebPageViewComponent }
     
    ];
  }
@NgModule({
  imports: [
    RouterModule.forChild([
        {
          path: '',
          children: GenericFormRoutes
        }
      ]),
      CommonModule,
    //   ShellModule.forChild(moduleLoader as shellModulesInfo),
      AppBuilderModule.forChild(info as builderModulesInfo)
  ],
  
  declarations: [],
  exports: [],
  providers: [
    { provide: BuilderModulesService, useValue: info as builderModulesInfo }
  ],
  entryComponents: []
})

export class WebviewUnAuthModule { 
    static componentService = WebviewComponentService;
}
