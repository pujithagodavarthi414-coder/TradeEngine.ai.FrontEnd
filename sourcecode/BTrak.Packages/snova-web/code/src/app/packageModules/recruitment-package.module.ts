import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { RecruitmentmanagementAppModule, RecruitmentRoutes } from '@thetradeengineorg1/snova-recruitment-module';
import { RecruitmentmanagementAppModule,RecruitmentRoutes,DocumentTypeComponent,HiringStatusComponent,InterviewTypeComponent,JobOpeningStatusComponent, StatusComponent, RatingTypeComponent,InterviewProcessAppComponent} from "@thetradeengineorg1/snova-recruitment-module";
import { ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService } from '@thetradeengineorg1/snova-shell-module';
import { info } from 'app/common/constants/modules';
import { moduleLoader } from 'app/common/constants/module-loader';
// import * as cloneDeep_ from 'lodash/cloneDeep';

// const cloneDeep = cloneDeep_;

export class RecruitmentComponentSupplierService {

    static components =  [
      {
          name: "Document type",
          componentTypeObject: DocumentTypeComponent
      },
      {
          name: "Hiring status",
          componentTypeObject: HiringStatusComponent
      },
      {
          name: "Interview types",
          componentTypeObject: InterviewTypeComponent
      },
      {
          name: "Job opening status",
          componentTypeObject: JobOpeningStatusComponent
      },
      {
          name: "Interview ratings",
          componentTypeObject: RatingTypeComponent
      },
      {
          name: "Sources",
          componentTypeObject: StatusComponent
      },
      {
          name: "Interview process",
          componentTypeObject: InterviewProcessAppComponent
      }
    ]
  }

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AdminLayoutComponent,
                children: RecruitmentRoutes
            }
        ]),
        CommonModule,
        ShellModule.forChild(moduleLoader as shellModulesInfo),
        RecruitmentmanagementAppModule
    ],
    declarations: [],
    exports: [],
    providers: [
        {provide: ShellModulesService, useValue: moduleLoader as shellModulesInfo }
    ],
    entryComponents: []
})

export class RecruitmentModule { 
    static componentService = RecruitmentComponentSupplierService;
}
