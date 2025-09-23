import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { PermissionHistoryComponent, UpdatefeedtimesheetComponent, FeedtimesheetComponentProfile, TimesheetRoutes, PermissionRegisterComponent, SpentTimeDetailsComponent, ViewTimeSheetComponent, TimesheetModule, AllLateUsersComponent,AllAbsenceUsersComponent,TimesheetModuleService} from "@thetradeengineorg1/snova-timesheet";
import { ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService } from '@thetradeengineorg1/snova-shell-module';
import { info } from 'app/common/constants/modules';
import { moduleLoader } from "app/common/constants/module-loader";


export class TimesheetComponentSupplierService {

    static components =  [
      { name: "Absence Users", componentTypeObject: AllAbsenceUsersComponent },
      { name: "Late Users", componentTypeObject: AllLateUsersComponent},      
      { name: "Permission history", componentTypeObject: PermissionHistoryComponent },
      { name: "Permission register", componentTypeObject: PermissionRegisterComponent },
      { name: "Spent time details", componentTypeObject: SpentTimeDetailsComponent },
      { name: "Time sheet", componentTypeObject: ViewTimeSheetComponent },
      { name: "Time punch card activity", componentTypeObject: UpdatefeedtimesheetComponent },
      { name: "Time punch card", componentTypeObject: FeedtimesheetComponentProfile }
    ];
  }

@NgModule({
    imports: [
        TimesheetModule,
        RouterModule.forChild([
            {
                path: '',
                component: AdminLayoutComponent,
                children: TimesheetRoutes
            }
        ]),
        CommonModule,
        TimesheetModule.forChild(moduleLoader as any ),
        ShellModule.forChild(moduleLoader as shellModulesInfo),
    ],
    declarations: [],
    exports: [],
    providers: [
      DatePipe,
      {provide: ShellModulesService, useValue: moduleLoader as shellModulesInfo },
      {provide: TimesheetModuleService, useValue: moduleLoader as any }
    ],
    entryComponents: []
})

export class TimesheetPackageModule {
    static componentService = TimesheetComponentSupplierService;
  }
