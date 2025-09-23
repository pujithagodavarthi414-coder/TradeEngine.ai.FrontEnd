import { Routes } from '@angular/router';
import { AccountAndBillingComponent } from './components/Payments/account.component';
import { CompanyPlansComponent } from './components/Payments/company-plans.component';

export const PaymentRoutes: Routes = [
  {
    path: 'Accounts',
    component: AccountAndBillingComponent,
    data: { title: 'Account & Billing', breadcrumb: 'Account & Billing' }
  },
  {
    path: 'payments-plans',
    component: CompanyPlansComponent,
    data: { title: 'Plans', breadcrumb: 'Plans' }
  }
]