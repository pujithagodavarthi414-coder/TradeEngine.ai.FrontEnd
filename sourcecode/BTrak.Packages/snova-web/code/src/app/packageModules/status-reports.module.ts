import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AdminLayoutComponent, ShellModule, shellModulesInfo } from '@thetradeengineorg1/snova-shell-module';
import { info } from 'app/common/constants/modules';
import { StatusReportRoutes, StatusReportingComponent,StatusReportComponent,StatusReportsModule,StatusReportsModuleService } from "@thetradeengineorg1/snova-status-reports-module";
import { HrmanagmentModule } from '@thetradeengineorg1/snova-hrmangement';
import { TimesheetModule, TimesheetModulesInfo,TimesheetModuleService } from "@thetradeengineorg1/snova-timesheet";
import { moduleLoader } from "app/common/constants/module-loader";

export class StatusReportComponentSupplierService {
    static components = [
        { name: "Status reporting", componentTypeObject: StatusReportingComponent },
        { name: "Configure Status Reports", componentTypeObject: StatusReportComponent }
    ];
}

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AdminLayoutComponent,
                children: StatusReportRoutes
            }
        ]),
        CommonModule,
        StatusReportsModule.forChild(moduleLoader as any ),
        TimesheetModule.forChild(moduleLoader as TimesheetModulesInfo),
        HrmanagmentModule,
        ShellModule
    ],
    declarations: [],
    exports: [],
    providers: [
        { provide: TimesheetModuleService, useValue: info as TimesheetModulesInfo },
        { provide: StatusReportsModuleService, useValue: moduleLoader as any }
    ],
    entryComponents: []
})

export class StatusReportPackageModule {
    static componentService = StatusReportComponentSupplierService;
}