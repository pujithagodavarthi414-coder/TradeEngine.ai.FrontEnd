import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PayrollManagementModule, PayrollmanagementRoutes, PayRollTemplateConfigurationComponent, PayrollRunComponent } from "@snovasys/snova-payroll";
import { ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService } from '@snovasys/snova-shell-module';
import { info } from '../../app/common/modules';
import * as cloneDeep_ from 'lodash/cloneDeep';

const cloneDeep = cloneDeep_;

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
        ShellModule.forChild({ modules: cloneDeep((cloneDeep(info) as shellModulesInfo).modules) }),
        PayrollManagementModule
    ],
    declarations: [],
    exports: [],
    providers: [
        {provide: ShellModulesService, useValue: (cloneDeep(info) as shellModulesInfo) }
    ],
    entryComponents: []
})

export class PayrollPackageModule { 
    static componentService = PayrollComponentSupplierService;
}
