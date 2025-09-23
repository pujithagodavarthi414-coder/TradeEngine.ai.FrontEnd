import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService } from '@thetradeengineorg1/snova-shell-module';
import { info } from 'app/common/constants/modules';
import { ProjectManagementComponentsModule, ProjectsRoutes, ProjectsModule, GoalsBrowseBoardComponent, GoalUniqueDetailComponent, UserStoryUniqueDetailComponent, ProjectListComponent, SprintsUniqueDetailComponent, UserStoryLogTimeComponent, CustomFormHistoryComponent } from '@thetradeengineorg1/snova-project-management';
import {
  AllWorkItemsComponent, GoalBurnDownChartComponent, UserStoriesBasedOnDeveloperComponent, GoalReplanHistoryComponent,
  SelectedGoalActivityComponent, SprintReplanHistoryComponent, SelectedSprintActivityComponent, SprintBugReportComponent, ProjectActivityComponent,ProjectsAppComponent,
  projectModulesInfo,
  ProjectModulesService,
  ResourceUsageReportComponent,
  ProjectUsageReportComponent
} from '@thetradeengineorg1/snova-project-management';
import { moduleLoader } from "app/common/constants/module-loader";



export class ProjectComponentSupplierService {

  static components = [
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
    },
    {
      name: "Goals", componentTypeObject: GoalsBrowseBoardComponent,
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
    },
    {
      name: "Actions assigned to me", componentTypeObject: AllWorkItemsComponent,
    },
    {
      name: "Log time", componentTypeObject: UserStoryLogTimeComponent,
    },
    {
      name: "Custom field history",
      componentTypeObject: CustomFormHistoryComponent
    },
    {
      name: "Projects",
      componentTypeObject: ProjectsAppComponent
    },
    
    {
      name: "My Work",
      componentTypeObject: AllWorkItemsComponent
  },
    {
      name: "Resource usage report",
      componentTypeObject: ResourceUsageReportComponent
    },
    {
      name: "Project usage report",
      componentTypeObject: ProjectUsageReportComponent
    }
  ]
}

@NgModule({
    imports: [
        RouterModule.forChild([
            {   
                path: '',
                component: AdminLayoutComponent,
                children: ProjectsRoutes
            }
        ]),
        CommonModule,
        ShellModule.forChild(moduleLoader as shellModulesInfo),
        ProjectManagementComponentsModule.forChild(moduleLoader as shellModulesInfo),
        ProjectsModule.forChild(moduleLoader as any)
    ],
    declarations: [],
    exports: [],
    providers: [
      {provide: ShellModulesService, useValue: moduleLoader as shellModulesInfo },
      {provide: ProjectModulesService, useValue: moduleLoader as any }
    ],
    entryComponents: [
    ]
})

export class ProjectPackageModule {
  static componentService = ProjectComponentSupplierService;
}