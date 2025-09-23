import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AdminRoutes } from 'admin-module-components/admin-components/src/lib/admin-module/admin-module.routing';

@NgModule({
  imports: [
    
    RouterModule.forChild([
      {
        path: '',
        children: AdminRoutes
      }
    ]),
    CommonModule
  ],
  declarations: [],
  exports: [],
  providers: [],
  entryComponents: []
})

export class ProjectsRouteModule { }
