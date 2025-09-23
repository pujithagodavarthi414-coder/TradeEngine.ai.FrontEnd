import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService } from '@thetradeengineorg1/snova-shell-module';
import { info } from 'app/common/constants/modules';
import { AppBuilderModule } from '@thetradeengineorg1/snova-app-builder-creation-components';
import { moduleLoader } from "app/common/constants/module-loader";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AdminLayoutComponent,
                //children: EmployeeListRouting
            }
        ]),
        CommonModule,
        ShellModule.forChild(moduleLoader as shellModulesInfo),
        AppBuilderModule
        
    ],
    declarations: [],
    exports: [],
    providers: [
        {provide: ShellModulesService, useValue: moduleLoader as shellModulesInfo }
    ],
    entryComponents: []
})

 export class MasterDataManagementModule { }