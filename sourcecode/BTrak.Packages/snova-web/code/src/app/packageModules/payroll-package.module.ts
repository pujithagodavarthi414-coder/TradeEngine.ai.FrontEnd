import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PayrollmanagementRoutes, PayRollTemplateConfigurationComponent, PayrollRunComponent } from "@thetradeengineorg1/snova-payroll";
import { ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService } from '@thetradeengineorg1/snova-shell-module';
import { info } from 'app/common/constants/modules';
import { moduleLoader } from 'app/common/constants/module-loader';

export class PayrollComponentSupplierService {

    static components =  [
        {
            name: "Payroll template configuration",
            componentTypeObject: PayRollTemplateConfigurationComponent
        },
         {
            name: "Payroll run",
            componentTypeObject: PayrollRunComponent
        },
    ]
}

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AdminLayoutComponent,
                children: PayrollmanagementRoutes
            }
        ]),
        CommonModule,
        ShellModule.forChild(moduleLoader as shellModulesInfo),
        // PayrollManagementModule
    ],
    declarations: [],
    exports: [],
    providers: [
        {provide: ShellModulesService, useValue: moduleLoader as shellModulesInfo }
    ],
    entryComponents: []
})

export class PayrollPackageModule { 
    static componentService = PayrollComponentSupplierService;
}
