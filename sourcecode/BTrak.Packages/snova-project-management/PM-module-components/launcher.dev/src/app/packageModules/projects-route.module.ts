import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ProjectsModule } from '../../../../pm-components/src/lib/snovasys-projects/projects.module';
import { ProjectsRoutes } from '../../../../pm-components/src/lib/snovasys-projects/projects.routing';
import { AdminLayoutComponent } from '../admin-layout.component';
import { info } from '../constants/modules';

@NgModule({
  imports: [
    ProjectsModule.forChild({ modules: info.modules }),
    RouterModule.forChild([
      {
        path: '',
        children: ProjectsRoutes
      }
    ]),
    CommonModule
  ],
  declarations: [AdminLayoutComponent],
  exports: [],
  providers: [],
  entryComponents: [AdminLayoutComponent]
})

export class ProjectsRouteModule { }
