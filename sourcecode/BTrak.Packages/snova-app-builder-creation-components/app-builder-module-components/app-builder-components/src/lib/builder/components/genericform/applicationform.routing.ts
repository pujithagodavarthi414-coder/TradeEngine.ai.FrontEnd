import { Routes } from '@angular/router';
import { ApplicationComponent } from './public-url/application.component';
import { VideoCallJoinComponent } from './public-url/video-call-join.component';
import { SubmitFormTriggerComponent } from '../widgetmanagement/submit-form-trigger.component';


export const ApplicationFormRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: 'application-form/:name/:formname',
        component: ApplicationComponent,
        data: { title: "Application form", breadcrumb: "Application form" }
      },
      {
        path: 'application-form/:name/:formname/:id',
        component: ApplicationComponent,
        data: { title: "Application form", breadcrumb: "Application form" }
      },
      {
        path: 'joincall/:roomname/:id',
        component: VideoCallJoinComponent,
        data: { title: "Join call", breadcrumb: "Join call" }
      },
      
    ]
  }
];