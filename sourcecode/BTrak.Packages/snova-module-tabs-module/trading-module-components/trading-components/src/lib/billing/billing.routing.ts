import { Routes } from '@angular/router';
import { TableComponent } from './table/table.component';
import { AddModuleComponent } from './add-module/add-module.component';

export const BillingRoutes: Routes = [
  {
    path: '', pathMatch: 'full', component: TableComponent, data: { title: 'Modules', breadcrumb: 'Modules' }
  },
  {
    path: 'module-list', component: TableComponent, data: { title: 'Modules', breadcrumb: 'Modules'}
  },
  {
    path: 'module-list/:moduleid/:tabid', component: TableComponent, data: { title: 'Modules', breadcrumb: 'Modules'}
  },
  {
    path: 'add-module', component: AddModuleComponent, data: {title: 'AddModule', breadcrumb: 'AddModule' }
  }
];