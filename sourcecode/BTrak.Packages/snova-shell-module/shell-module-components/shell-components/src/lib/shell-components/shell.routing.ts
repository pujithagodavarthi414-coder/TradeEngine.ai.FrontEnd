import { Routes } from '@angular/router';
import { LiveWelcomePageComponent } from './components/lives/lives-welcome-page';
//import { settingsComponent } from "@thetradeengineorg1/snova-admin-module";
import { AccountAndBillingComponent } from './components/Payments/account.component';
import { CompanyPlansComponent } from './components/Payments/company-plans.component';
export const ShellRouts: Routes = [
    {
        path: "",
        children: [
  //          { path: 'settings', component: settingsComponent, data: { title: 'settings', breadcrumb: 'settings' } },
            { path: 'Accounts', component: AccountAndBillingComponent, data: { title: 'Account & Billing', breadcrumb: 'Account & Billing' } },
            { path: 'payments-plans', component: CompanyPlansComponent, data: { title: 'Payments', breadcrumb: 'Payments' } },
            { path: 'welcome', component: LiveWelcomePageComponent, data: { title: 'welcome', breadcrumb: 'welcome' } }
        ]
    }
]