import { Routes } from '@angular/router';
import { LeaveTypesListComponent } from './components/leave-type-list.component';
import { NewLeaveTypePageComponent } from './containers/new-leave-type.page';
import { LeavesListComponent } from './components/leave-list.component';
import { LeavesDashBoardListComponent } from './containers/leavesdashboard.component';
import { MyLeavesListComponent } from './components/myleaves-myprofile-component';

export const LeaveManagementRoutes: Routes = [
    {
        path: "",
        redirectTo: "waitingforapproval", pathMatch: "full"
    },
    {
        path: "dashboard",
        component: LeaveTypesListComponent,
        data: { title: "ButtonTypes", breadcrumb: "ButtonTypes" }
    },
    {
        path: "leavesmanagement",
        component: LeavesListComponent,
        data: { title: "Permission Reason", breadcrumb: "Permission Reason" }
    },
    {
        path: "policymanagement",
        component: LeaveTypesListComponent,
        data: { title: "Feedback Type", breadcrumb: "Feedback Type" }
    },
    {
        path: "new-leave-type",
        component: NewLeaveTypePageComponent,
        data: { title: "New Leave Type", breadcrumb: "New Leave Type" }
    },
    {
        path: "new-leave-type/:id/:tab",
        component: NewLeaveTypePageComponent,
        data: { title: "New Leave Type", breadcrumb: "New Leave Type" }
    },
    {
        path: "waitingforapproval",
        component: LeavesListComponent,
        data: { title: "Waiting for Approval", breadcrumb: "Waiting for Approval" }
    },
    {
        path: "leavesdashboard",
        component: LeavesDashBoardListComponent,
        data: { title: "Leaves dashboard", breadcrumb: "Leaves dashboard" }
    },
    {
        path: "leavetype",
        component: LeaveTypesListComponent,
        data: { title: "Leave Type", breadcrumb: "Leave Type" }
    },
    {
        path: "myleaves",
        component: MyLeavesListComponent,
        data: { title: "Leave Type", breadcrumb: "Leave Type" }
    }
];