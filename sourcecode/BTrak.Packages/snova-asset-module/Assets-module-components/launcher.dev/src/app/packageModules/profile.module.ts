import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService } from '@snovasys/snova-shell-module';

import { ProfileModule, ProfileRoutes, ProfileModulesService, profileModulesInfo, MyAssetsComponent } from '@snovasys/snova-profile-module';
import * as cloneDeep_ from 'lodash/cloneDeep';
import { info } from '../common/modules';

const cloneDeep = cloneDeep_;

export class ProfileComponentSupplierService {
    static components = [
        { name: "My assets", componentTypeObject: MyAssetsComponent },
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
        ShellModule.forChild({ modules: cloneDeep((cloneDeep(info) as shellModulesInfo).modules) }),
        ProfileModule.forChild({ modules: cloneDeep((cloneDeep(info) as profileModulesInfo).modules) })
    ],
    declarations: [],
    exports: [],
    providers: [
        { provide: ShellModulesService, useValue: (cloneDeep(info) as shellModulesInfo) },
        { provide: ProfileModulesService, useValue: (cloneDeep(info) as profileModulesInfo) }
    ],
    entryComponents: []
})


export class ProfileManagementModule {
    static componentService = ProfileComponentSupplierService;

}