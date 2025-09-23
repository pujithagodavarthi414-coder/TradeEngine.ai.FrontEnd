import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BillingModule,BillingRoutes, GRDComponent, SitesComponent, SolarLogComponent } from '@thetradeengineorg1/snova-billing-module';
import { ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService } from '@thetradeengineorg1/snova-shell-module';
import { info } from 'app/common/constants/modules';
import { moduleLoader } from 'app/common/constants/module-loader';


@NgModule({
    imports: [
      BillingModule,
        RouterModule.forChild([
            {
                path: '',
                component: AdminLayoutComponent,
                children: BillingRoutes
            }
        ]),
        CommonModule,
        ShellModule.forChild(moduleLoader as shellModulesInfo),
    ],
    declarations: [],
    exports: [],
    providers:[
        {provide: ShellModulesService, useValue: moduleLoader as shellModulesInfo }
    ],
    entryComponents: []
})

export class BillingManagementModule {
    
}