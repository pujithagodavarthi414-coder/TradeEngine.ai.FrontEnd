import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService } from '@thetradeengineorg1/snova-shell-module';
import { info } from 'app/common/constants/modules';
import { ProfileModule, ProfileRoutes, ProfileModulesService, profileModulesInfo, MyAssetsComponent, ViewTimeSheetComponentProfile, UserActivityComponent } from '@thetradeengineorg1/snova-profile-module';
import { moduleLoader } from "app/common/constants/module-loader";

export class ProfileComponentSupplierService {
    static components = [
        { name: "My assets", componentTypeObject: MyAssetsComponent },
        { name: "My Timesheet", componentTypeObject: ViewTimeSheetComponentProfile },
        { name: "My Activity", componentTypeObject: UserActivityComponent},
    ];
}
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AdminLayoutComponent,
                children: ProfileRoutes 
            }
        ]),
        CommonModule,
        ShellModule.forChild(moduleLoader as shellModulesInfo),
        ProfileModule.forChild(moduleLoader as any)
    ],
    declarations: [],
    exports: [],
    providers: [
        { provide: ShellModulesService, useValue: moduleLoader as shellModulesInfo },
        { provide: ProfileModulesService, useValue: moduleLoader as any }
    ],
    entryComponents: []
})


export class ProfileManagementModule {
    static componentService = ProfileComponentSupplierService;

}