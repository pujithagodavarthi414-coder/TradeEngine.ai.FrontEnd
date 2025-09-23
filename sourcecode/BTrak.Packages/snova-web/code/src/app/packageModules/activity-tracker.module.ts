import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivityTrackerModule, ActivityTrackerRoutes,ActivityTrackerModuleService } from "@thetradeengineorg1/snova-activity-tracker-module";
import { ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService } from '@thetradeengineorg1/snova-shell-module';
import { info } from 'app/common/constants/modules';
import { moduleLoader } from 'app/common/constants/module-loader';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AdminLayoutComponent,
                children: ActivityTrackerRoutes
            }
        ]),
        CommonModule,
        ShellModule.forChild(moduleLoader as shellModulesInfo),
        ActivityTrackerModule.forChild(moduleLoader as any),
    ],
    declarations: [],
    exports: [],
    providers: [
        {provide: ShellModulesService, useValue: moduleLoader as shellModulesInfo },
        {provide: ActivityTrackerModuleService, useValue: moduleLoader as any }
    ],
    entryComponents: []
})

export class ActivityTrackModule { }
