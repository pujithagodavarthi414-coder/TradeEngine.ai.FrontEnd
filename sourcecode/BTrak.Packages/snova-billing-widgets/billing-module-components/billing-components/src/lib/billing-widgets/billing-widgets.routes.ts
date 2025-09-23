import { Routes } from '@angular/router';
import { InvoicesAreaComponent } from './components/invoice/invoices-area-component';



export const BillingWidgetRoutes: Routes = [{
    path: "",
    children: [
        {
            path: '', component: InvoicesAreaComponent , data: { title: 'Invoices', breadcrumb: 'Invoices' }
        },
        {
            path: 'invoices-area', component: InvoicesAreaComponent , data: { title: 'Invoices', breadcrumb: 'Invoices' }
        },
        {
            path: 'invoices-area/:tab', component: InvoicesAreaComponent , data: { title: 'Invoices', breadcrumb: 'Invoices' }
        }
    ]
}]
