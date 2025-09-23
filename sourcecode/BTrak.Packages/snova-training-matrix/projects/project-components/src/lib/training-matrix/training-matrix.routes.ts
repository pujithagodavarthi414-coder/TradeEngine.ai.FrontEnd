import { Routes } from '@angular/router';
import { CustomTrainingCoursesViewComponent } from './components/training-courses-view-component/training-courses-view.component';
import { CustomTrainingMatrixViewComponent } from './components/training-matrix-view-component/training-matrix-view.component';
import { CustomTrainingRecordViewComponent } from './components/training-record-component/training-record.component';
import { CustomTrainingCourseAssignmentComponent } from './components/training-course-assignment-component/training-course-assignment.component';

export const TrainingRoutes: Routes = [
    {
        path:'training-courses',
        component: CustomTrainingCoursesViewComponent
    },
    {
        path:'training-matrix',
        component: CustomTrainingMatrixViewComponent
    },
    {
        path:'training-record',
        component: CustomTrainingRecordViewComponent
    },
    {
        path:'training-assignments',
        component: CustomTrainingCourseAssignmentComponent
    },
];
