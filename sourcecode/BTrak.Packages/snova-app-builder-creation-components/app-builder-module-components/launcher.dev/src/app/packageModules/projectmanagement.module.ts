import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { SprintsUniqueDetailComponent, GoalReplanHistoryComponent, GoalsBrowseBoardComponent,GoalUniqueDetailComponent ,UserStoryUniqueDetailComponent,AllWorkItemsComponent, ProjectListComponent, ProjectsModule } from '@thetradeengineorg1/snova-project-management';
import { GoogleAnalyticsService } from '../app.module/services/google-analytics.service';


export class ProjectManagementModuleService {

  static components =  [
    {
        name: "Goals",  componentTypeObject:  GoalsBrowseBoardComponent,
    },
    {
        name: "Goal", componentTypeObject: GoalUniqueDetailComponent,
    },
    {
        name: "Userstory", componentTypeObject: UserStoryUniqueDetailComponent,
    },
    {
        name: "Userstories", componentTypeObject: AllWorkItemsComponent,
    },
    {
        name: "Project", componentTypeObject: ProjectListComponent,
    },
    {
        name: "GoalReplanHistory", componentTypeObject: GoalReplanHistoryComponent,
    },
    {
        name: "Sprint", componentTypeObject: SprintsUniqueDetailComponent,
    }
  ]
}

@NgModule({
  imports: [
    CommonModule,
    ProjectsModule
  ],
  providers:[GoogleAnalyticsService],
  
  entryComponents:[SprintsUniqueDetailComponent,SprintsUniqueDetailComponent,ProjectListComponent,AllWorkItemsComponent,UserStoryUniqueDetailComponent,GoalUniqueDetailComponent,GoalsBrowseBoardComponent]
})
export class ProjectManagementModule {
  static componentService = ProjectManagementModuleService;
}
