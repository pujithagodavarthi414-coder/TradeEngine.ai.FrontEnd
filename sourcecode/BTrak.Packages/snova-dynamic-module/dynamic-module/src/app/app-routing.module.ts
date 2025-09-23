import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddModuleComponent } from './add-module/add-module.component';
import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';

const routes: Routes = [
  { path: '', redirectTo: '/table', pathMatch: 'full'},
  {path:'table', component:TableComponent}, 
  {path:'add-module', component:AddModuleComponent} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
