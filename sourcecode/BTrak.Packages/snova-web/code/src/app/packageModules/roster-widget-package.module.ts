import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  RosterWidgetModule,
  ApproverTimeSheetSubmissionComponent,
  EmployeeTimeSheetSubmissionComponent
} from "@thetradeengineorg1/snova-rostering-widget";
import { ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService } from '@thetradeengineorg1/snova-shell-module';
import { info } from 'app/common/constants/modules';
import { moduleLoader } from 'app/common/constants/module-loader';

export class RosterComponentSupplierService {

  static components = [
    { name: "Time sheets waiting for approval", componentTypeObject: ApproverTimeSheetSubmissionComponent },
    { name: "Time sheet submission", componentTypeObject: EmployeeTimeSheetSubmissionComponent }
  ];
}

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AdminLayoutComponent
      }
    ]),
    CommonModule,
    ShellModule.forChild(moduleLoader as shellModulesInfo),
    RosterWidgetModule
  ],
  declarations: [],
  exports: [],
  providers: [
    {provide: ShellModulesService, useValue: moduleLoader as shellModulesInfo }
  ],
  entryComponents: []
})

export class RosterWidgetPackageModule {
  static componentService = RosterComponentSupplierService;
}