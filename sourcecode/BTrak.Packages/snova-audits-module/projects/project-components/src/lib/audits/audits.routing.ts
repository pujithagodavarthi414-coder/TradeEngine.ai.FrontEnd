import { Routes } from '@angular/router';
import { AuditConductTimelineView } from './components/audit-conduct-timeline-view-component';
import { AuditsViewComponent } from './components/app-audits-view.component';
import { AuditConductsViewComponent } from './components/app-conducts-view.component';
import { AuditReportsViewComponent } from './components/app-audit-reports-view.component';
import { AddAuditActionsViewComponent } from './components/app-audit-actions-view.component';
import { AddAuditActivityViewComponent } from './components/app-audit-activity-view.component';
import { AuditUniqueDetailComponent } from './components/audit-unique-detail.component';
import { ConductUniqueDetailComponent } from './components/conduct-unique-detail.component';

export const AuditRoutes: Routes = [
    {
        path: 'projectstatus/:id/audits',
        component: AuditsViewComponent,
        data: { title: 'Test Management' }
    },
    {
        path: 'projectstatus/:id/conducts',
        component: AuditConductsViewComponent,
        data: { title: 'Test Management' }
    },
    {
        path: 'projectstatus/:id/timeline',
        component: AuditConductTimelineView,
        data: { title: 'Test Management' }
    },
    {
        path: 'projectstatus/:id/audit-reports',
        component: AuditReportsViewComponent,
        data: { title: 'Test Management' }
    },
    {
        path: 'projectstatus/:id/actions',
        component: AddAuditActionsViewComponent,
        data: { title: 'Test Management' }
    },
    {
        path: 'projectstatus/:id/audit-activity',
        component: AddAuditActivityViewComponent,
        data: { title: 'Test Management' }
    },
    {
        path: "audit/:id",
        component: AuditUniqueDetailComponent,
        data: { title: "Audit unique detail", breadcrumb: "Audit unique detail" }
    },
    {
        path: "conduct/:id",
        component: ConductUniqueDetailComponent,
        data: { title: "Conduct unique detail", breadcrumb: "Conduct unique detail" }
    },
];
