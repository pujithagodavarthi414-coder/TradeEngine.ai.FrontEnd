import { Routes } from '@angular/router';
import { TestSuitesViewComponent } from './components/testsuites-view.component';
import { TestRunsViewComponent } from './components/testruns-view.component';
import { TestrailMileStoneBaseComponent } from './components/milestone-base.component';
import { ReportsViewComponent } from './components/reports-view.component';

export const TestrailRoutes: Routes = [
  {
    path: 'projects/projectstatus/:id/scenarios',
    component: TestSuitesViewComponent,
    data: { title: 'Test Management' }
  },
  {
    path: 'projects/projectstatus/:id/runs',
    component: TestRunsViewComponent,
    data: { title: 'Test Management' }
  },
  {
    path: 'projects/projectstatus/:id/versions',
    component: TestrailMileStoneBaseComponent,
    data: { title: 'Test Management' }
  },
  {
    path: 'projects/projectstatus/:id/test-reports',
    component: ReportsViewComponent,
    data: { title: 'Test Management' }
  }
];