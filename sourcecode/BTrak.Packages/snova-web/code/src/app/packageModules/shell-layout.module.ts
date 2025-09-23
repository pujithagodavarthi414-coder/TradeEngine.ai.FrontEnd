import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import {ShellRouts, ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService } from '@thetradeengineorg1/snova-shell-module';
import { info } from 'app/common/constants/modules';
import { AdminModule } from "@thetradeengineorg1/snova-admin-module";
import { moduleLoader } from "app/common/constants/module-loader";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AdminLayoutComponent,
                children: ShellRouts
            }
        ]),

        // RouterModule.forChild([
        //     {
        //         path: '',
        //         component: AdminLayoutComponent,
        //         children: [{
        //             path: "settings",
        //             component: settingsComponent,
        //         }]
        //     }
        // ]),
        CommonModule,
        ShellModule.forChild(moduleLoader as shellModulesInfo),
        AdminModule
    ],
    declarations: [],
    exports: [],
    providers: [
        {provide: ShellModulesService, useValue: moduleLoader as any }
    ],
    entryComponents: []
})

export class ShellLayoutModule { }