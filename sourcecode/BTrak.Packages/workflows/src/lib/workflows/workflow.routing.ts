import { Routes } from "@angular/router";
import { ActivityListComponent } from "./components/activity-list/activity-list.component";
import { AddWorkflowComponent } from "./components/add-workflow/add-workflow.component";
import { WorkflowListComponent } from "./components/workflow-list/workflow-list.component";

// import { AdminLayoutComponent } from "app/shared/components/layouts/admin-layout/admin-layout.component";

export const WorkflowRoutes: Routes = [
    {
        path: 'add-workflow',
        component: AddWorkflowComponent,
        data: { title: 'Add workflow'}
    },
    {
        path: 'activities',
        component: ActivityListComponent,
        data: { title: 'Activities' }
    },
    {
        path: 'workflow-list',
        component: WorkflowListComponent,
        data: { title: 'WorkflowList' }
    }
]
