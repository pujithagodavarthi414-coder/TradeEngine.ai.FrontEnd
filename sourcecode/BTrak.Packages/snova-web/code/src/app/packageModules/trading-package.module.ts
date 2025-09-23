import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BillingModule,BillingRoutes } from '@thetradeengineorg1/snova-trading-module';
import { ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService } from '@thetradeengineorg1/snova-shell-module';
import { moduleLoader } from 'app/common/constants/module-loader';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentUtcDateAdapter } from '@thetradeengineorg1/snova-widget-module';
export const MY_FORMATS = {
    parse: {
      dateInput: 'DD-MMM-YYYY',
    },
    display: {
      dateInput: 'DD-MMM-YYYY',
      monthYearLabel: 'DD-MMM-YYYY',
    },
  };
  

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
        {provide: ShellModulesService, useValue: moduleLoader as shellModulesInfo },
        { provide: DateAdapter, useClass: MomentUtcDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
    entryComponents: []
})

export class TradingModule {
    
}