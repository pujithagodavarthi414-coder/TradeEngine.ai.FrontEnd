import { Routes } from "@angular/router";

import { AllProjectsPageComponent } from "./containers/allprojects.page";
import { ProjectStatusPageComponent } from "./containers/projectStatus.page";
import { AllgoalsComponent } from "./containers/allgoals.page";
import { ProjectOverViewComponent } from "./containers/project-overview.page";
import { UserStoryUniqueDetailComponent } from "./components/userStories/userstory-unique-detail.component";
import { GoalUniqueDetailComponent } from "./components/goals/goal-unique-detail.component";
import { SprintsUniqueDetailComponent } from "./components/sprints/sprints-unique-detail.component";
import { CapacityPlanningReportComponent } from './components/reports/capacityplanningreport.component';
import { AdhocUniqueDetailComponent } from './components/adhoc-work/adhoc-unique-detail.component';
import { ProjectAuditComponent } from './components/projects/project-audit.component'; 
import { AuditUniquePageComponent } from './components/userStories/audit-unique-page.component';
import { ConductUniquePageComponent } from './components/userStories/conduct-unique-page.component';
import { ProjectsAreaComponent } from './components/projects-area.component';
import { ResourceUsageReportComponent } from "./components/reports/resourceusagereport/resourceusagereport.component";
import { ProjectUsageReportComponent } from "./components/reports/projectusagereport/projectusagereport.component";


export const ProjectsRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: ProjectsAreaComponent,
        data: { title: "Project", breadcrumb: "Project" }
      },
      {
        path: "projects",
        component: ProjectsAreaComponent,
        data: { title: "Project", breadcrumb: "Project" }
      },
      {
        path: "projects/audit",
        component: ProjectsAreaComponent,
        data: { title: "Project", breadcrumb: "Project" }
      },
      {
        path: "area/:tab",
        component: ProjectsAreaComponent,
        data: { title: "Project", breadcrumb: "Project" }
      },
      {
        path: "area/:tab/audit",
        component: ProjectsAreaComponent,
        data: { title: "Project", breadcrumb: "Project" }
      },
      {
        path: "allgoals",
        component: AllgoalsComponent,
        data: { title: "All goals", breadcrumb: "All goals", icon: "work" }
      },
      {
        path: "allgoals/:id",
        component: AllgoalsComponent,
        data: { title: "All goals", breadcrumb: "All goals", icon: "work" }
      },
      {
        path: "adhoc-workitem/:id",
        component: AdhocUniqueDetailComponent,
        data: { title: " Adhoc Work item unique detail", breadcrumb: "Adhoc Work item unique detail" }
      },
      {
        path: "workitem/:id/unique",
        component: UserStoryUniqueDetailComponent,
        data: { title: "Work item unique detail", breadcrumb: "Work item unique detail" }
      },
      {
        path: "workitem/:id",
        component: UserStoryUniqueDetailComponent,
        data: { title: "Work item unique detail", breadcrumb: "Work item unique detail" }
      },
      {
        path: "action/:id",
        component: UserStoryUniqueDetailComponent,
        data: { title: "Action unique detail", breadcrumb: "Action unique detail" }
      },
      {
        path: "sprint-workitem/:id",
        component: UserStoryUniqueDetailComponent,
        data: { title: "Work item unique detail", breadcrumb: "Work item unique detail" }
      },
      {
        path: "goal/:id/unique",
        component: GoalUniqueDetailComponent,
        data: { title: "Goal unique detail", breadcrumb: "Goal unique detail" }
      },
      {
        path: "goal/:id",
        component: GoalUniqueDetailComponent,
        data: { title: "Goal unique detail", breadcrumb: "Goal unique detail" }
      },
       {
        path: "sprint/:id/unique",
        component: SprintsUniqueDetailComponent,
        data: { title: "Sprint unique detail", breadcrumb: "Sprint unique detail" }
      },
      {
        path: "sprint/:id",
        component: SprintsUniqueDetailComponent,
        data: { title: "Sprint unique detail", breadcrumb: "Sprint unique detail" }
      },
      {
        path: "my-work/:id",
        component: UserStoryUniqueDetailComponent,
        data: { title: "Work item unique detail", breadcrumb: "Work item unique detail" }
      },
      {
        path: "audit/:id",
        component: AuditUniquePageComponent,
        data: { title: "Audit unique detail", breadcrumb: "Audit unique detail" }
      },
      {
        path: "conduct/:id",
        component: ConductUniquePageComponent,
        data: { title: "Conduct unique detail", breadcrumb: "Conduct unique detail" }
      },
      {
        path: "sprint-my-work/:id",
        component: UserStoryUniqueDetailComponent,
        data: { title: "Work item unique detail", breadcrumb: "Work item unique detail" }
      },
      {
        path: "allprojects",
        component: AllProjectsPageComponent,
        data: { title: "All projects", breadcrumb: "All projects" }
      },
      {
        path: "projectstatus/:id/:tab", 
        component: ProjectStatusPageComponent, 
        data: { title: "Project Overview", breadcrumb: "Project Overview" },
      },
      {
        path: "projectstatus/:id/audit/:tab", 
        component: ProjectStatusPageComponent, 
        data: { title: "Project Overview", breadcrumb: "Project Overview" },
      },
      {
        path: "project-activity",
        component: ProjectAuditComponent,
        data: { title: "Project activity", breadcrumb: "Project Activity" }
      },
      {
        path: "CapacityPlanningReportComponent",
        component: CapacityPlanningReportComponent,
        data: { title: "CapacityPlanningReportComponent", breadcrumb: "CapacityPlanningReportComponent" }
      },
      {
        path: "ResourceUsageReportComponent",
        component: ResourceUsageReportComponent,
        data: { title: "Resource usage report", breadcrumb: "Resource usage report" }
      },
      {
        path: "ProjectUsageReportComponent",
        component: ProjectUsageReportComponent,
        data: { title: "Project usage report", breadcrumb: "Project usage report" }
      }
    ]
  }  
];
