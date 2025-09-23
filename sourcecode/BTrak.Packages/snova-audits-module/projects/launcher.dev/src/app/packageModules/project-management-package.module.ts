import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {  ProjectManagementComponentsModule, ProjectsRoutes, ProjectsModule, UserStoryLogTimeComponent ,CustomFormHistoryComponent } from "@snovasys/snova-project-management";
import {  AllWorkItemsComponent, GoalBurnDownChartComponent, UserStoriesBasedOnDeveloperComponent, GoalReplanHistoryComponent, 
    SelectedGoalActivityComponent, SprintReplanHistoryComponent, SelectedSprintActivityComponent, SprintBugReportComponent, ProjectActivityComponent } from "@snovasys/snova-project-management";
import * as cloneDeep_ from 'lodash/cloneDeep';

const cloneDeep = cloneDeep_;

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
        },
        {
          name: "Log time",
          componentTypeObject: UserStoryLogTimeComponent
        },
        {
          name: "Custom field history",
          componentTypeObject: CustomFormHistoryComponent
        }
      ]
}

@NgModule({
    imports: [
        CommonModule,
        ProjectManagementComponentsModule,
        ProjectsModule,
        RouterModule.forChild([
          {
              path: '',
              children: ProjectsRoutes
          }
      ]),
    ],
    declarations: [],
    exports: [],
    providers: [

    ],
    entryComponents: [
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