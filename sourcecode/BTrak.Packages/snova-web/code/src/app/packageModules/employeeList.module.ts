import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService } from '@thetradeengineorg1/snova-shell-module';
import { info } from 'app/common/constants/modules';
import { EmployeeListModule, EmployeeListRouting } from '@thetradeengineorg1/snova-employeelist';
import { moduleLoader } from "app/common/constants/module-loader";
import { EmployeeModulesService } from "@thetradeengineorg1/snova-employeelist";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AdminLayoutComponent,
                children: EmployeeListRouting
            }
        ]),
        CommonModule,
        ShellModule.forChild(moduleLoader as shellModulesInfo),
        EmployeeListModule.forChild(moduleLoader as any),
        
    ],
    declarations: [],
    exports: [],
    providers: [
        {provide: ShellModulesService, useValue: moduleLoader as shellModulesInfo },
        {provide: EmployeeModulesService, useValue: moduleLoader as any }
    ],
    entryComponents: []
})

export class EmployeeDetailsListModule { }