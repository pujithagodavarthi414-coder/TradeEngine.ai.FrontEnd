import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ProjectsModule, AllWorkItemsComponent, GoalBurnDownChartComponent, UserStoriesBasedOnDeveloperComponent, GoalReplanHistoryComponent, 
  SelectedGoalActivityComponent, SprintReplanHistoryComponent, SelectedSprintActivityComponent, SprintBugReportComponent, ProjectActivityComponent } from "@thetradeengineorg1/snova-project-management";
export class ProjectComponentSupplierService {

  static components =  [
    {
      name: "All work items",
      componentTypeObject: AllWorkItemsComponent
    },
    {
      name: "Goal burn down chart",
      componentTypeObject: GoalBurnDownChartComponent
    },
    {
      name: "Sprint burn down chart",
      componentTypeObject: GoalBurnDownChartComponent
    },
    {
      name: "Work item status report",
      componentTypeObject: UserStoriesBasedOnDeveloperComponent
    },
    {
      name: "Goal replan history",
      componentTypeObject: GoalReplanHistoryComponent
    },
    {
      name: "Goal activity",
      componentTypeObject: SelectedGoalActivityComponent
    },
    {
      name: "Sprint replan history",
      componentTypeObject: SprintReplanHistoryComponent
    },
    {
      name: "Sprint activity",
      componentTypeObject: SelectedSprintActivityComponent
    },
    {
      name: "Sprint bug report",
      componentTypeObject: SprintBugReportComponent
    },
    {
      name: "Project activity",
      componentTypeObject: ProjectActivityComponent
    }
  ]
}

@NgModule({
  imports: [
    CommonModule,
    ProjectsModule
  ],
  entryComponents:[
    AllWorkItemsComponent,
    SelectedGoalActivityComponent,
    GoalBurnDownChartComponent,
    GoalReplanHistoryComponent,
    UserStoriesBasedOnDeveloperComponent,
    SprintReplanHistoryComponent,
    SprintBugReportComponent,
    SelectedSprintActivityComponent
  ]
})
export class ProjectPackageModule {
  static componentService = ProjectComponentSupplierService;
}
