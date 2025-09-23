import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AppBuilderModule, NewProcessWidgetComponent, AddCustomHtmlAppComponent, AddCustomWidgetComponent } from "@snovasys/snova-app-builder-creation-components";
import dynamicComponentsJson from '../models/modules';
import * as cloneDeep_ from 'lodash/cloneDeep';
import { AppStoreModulesInfo } from 'projects/project-components/src/lib/snova-app-store/dependencies/models/appStoreModulesInfo';
const cloneDeep = cloneDeep_;

export class AppBuilderModuleService {
  static components = [
    {
      name: "AddCustomWidgetComponent",  componentTypeObject:  AddCustomWidgetComponent,
    },
    {
      name: "AddCustomHtmlAppComponent",  componentTypeObject:  AddCustomHtmlAppComponent,
    },
    {
      name: "NewProcessWidgetComponent",  componentTypeObject:  NewProcessWidgetComponent,
    }
  ]
}

@NgModule({
  imports: [
    CommonModule,
    AppBuilderModule.forChild({ modules: cloneDeep((cloneDeep(dynamicComponentsJson.modules ) as AppStoreModulesInfo).modules) })
  ],
})
export class AppBuilderCreationComponentsModule {
  static componentService = AppBuilderModuleService;
}
