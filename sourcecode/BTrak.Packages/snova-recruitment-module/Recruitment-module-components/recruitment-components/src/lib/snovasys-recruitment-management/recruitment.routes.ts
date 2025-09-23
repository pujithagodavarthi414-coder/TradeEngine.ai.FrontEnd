import { Routes } from '@angular/router';
import { CandidateUniqueDetailComponent } from './component/candidate-unique-detail.component';
import { JobUniqueDetailComponent } from './component/job-unique-detail.component';
import { RecruitmentManagementComponent } from './component/recruitment-management-component';
import { InterviewSchedulesCalenderViewComponent } from './component/schedules-calendar.component';
import { RecruitmentBryntumViewComponent } from './component/skillview/brymtum-view-recuitment.component';

export const RecruitmentRoutes: Routes = [
  {
    path: 'recruitmentmanagement',
    component: RecruitmentManagementComponent,
    data: { title: 'Recruitment management', breadcrumb: 'Recruitment management' }
  },
  {
    path: 'candidate/:id/:jobId',
    component: CandidateUniqueDetailComponent,
    data: { title: 'Candidate unique detail', breadcrumb: 'Candidate unique detail' }
  }  ,
  {
    path: 'jobopening/:id',
    component: JobUniqueDetailComponent,
    data: { title: 'Job opening unique detail', breadcrumb: 'Job opening unique detail' }
  },
  {
    path: 'candidate',
    component: CandidateUniqueDetailComponent,
    data: { title: 'Candidate unique detail', breadcrumb: 'Candidate unique detail' }
  },
  {
    path: 'recruitmentschedules',
    component: InterviewSchedulesCalenderViewComponent,
    data: { title: 'Recruitment scheules', breadcrumb: 'Recruitment schedules' }
  },
  {
    path: 'recruitmentschedules/:scheduleId',
    component: InterviewSchedulesCalenderViewComponent,
    data: { title: 'Recruitment scheules', breadcrumb: 'Recruitment schedules' }
  },
  {
    path: 'brymtumview',
    component: RecruitmentBryntumViewComponent,
    data: { title: 'Recruitment scheules', breadcrumb: 'Recruitment schedules' }
  },
];
