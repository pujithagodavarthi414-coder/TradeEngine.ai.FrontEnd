import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { CustomSubqueryTableComponent } from 'app-builder-module-components/app-builder-components/src/lib/builder/components/widgetmanagement/custom-subquery-table.component';
import { AppBuilderModule } from 'app-builder-module-components/app-builder-components/src/lib/builder/builder.module';
import { FormCreatorComponent } from 'app-builder-module-components/app-builder-components/src/lib/builder/components/genericform/create-form/form-creator.component';


export class AppBuilderModuleService {

  static components = [
    {
      name: "CustomSubQuery",  componentTypeObject:  CustomSubqueryTableComponent,
    }
  ]
}

@NgModule({
  imports: [
    CommonModule,
    AppBuilderModule
  ],
  entryComponents:[CustomSubqueryTableComponent, FormCreatorComponent]
})
export class AppBuilderCreationComponentsModule {
  static componentService = AppBuilderModuleService;
}
