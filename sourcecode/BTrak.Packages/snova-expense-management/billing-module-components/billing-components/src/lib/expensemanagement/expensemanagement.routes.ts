import { Routes } from '@angular/router';
import { ExpenseAreaComponent } from './components/expenses-area.component';


export const ExpenseRoutes: Routes = [{
    path: "",
    children: [
        {
            path: '', component: ExpenseAreaComponent , data: { title: 'Expenses', breadcrumb: 'Expenses' }
        },
        {
            path: 'expenses-area', component: ExpenseAreaComponent , data: { title: 'Expenses', breadcrumb: 'Expenses' }
        },
        {
            path: 'expenses-area/:tab', component: ExpenseAreaComponent , data: { title: 'Expenses', breadcrumb: 'Expenses' }
        }
    ]
}]
