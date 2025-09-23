import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {
  SelectedGoalActivityComponent,
  ProjectsModule,
  ProjectManagementComponentsModule
} from "@thetradeengineorg1/snova-project-management";
//import { truncate } from 'lodash';
//import * as cloneDeep_ from 'lodash/cloneDeep';
//import * as cloneDeep_ from 'lodash';
import cloneDeep_ from 'lodash/cloneDeep';

//import * as cloneDeep_ from 'lodash/cloneDeep';
const cloneDeep = cloneDeep_;

export class ProjectComponentSupplierService {

  static components = [
    {
      name: "Goal activity",
      componentTypeObject: SelectedGoalActivityComponent
    }
  ]
}

@NgModule({
    imports: [
       
        CommonModule,
        ProjectsModule,
        ProjectManagementComponentsModule
    ],
    declarations: [],
    exports: [],
    providers: [
     
    ],
    entryComponents: [
    ]
})

export class ProjectPackageModule {
  static componentService = ProjectComponentSupplierService;
}