import { Routes } from '@angular/router';
import { GenericFormApplicationComponent } from './generic-form-application.component';
import { GenericFormsViewComponent } from './genericforms-view/genericforms-view.component';
import { CustomApplicationComponent } from './custom-application/custom-application.component';
import { HtmlDesignerComponent } from '../html-designer/html-designer.component';
import { WebPageViewComponent } from '../html-viewer/web-page-viewer.component';
import { SubmitFormTriggerComponent } from '../widgetmanagement/submit-form-trigger.component';
import { ProcessAppComponent } from '../widgetmanagement/process-app-details.component';
import { ApplicationComponent } from './public-url/application.component';
import { WebPageViewUnAuthComponent } from '../html-viewer-unauth/web-page-viewer-unauth.component';


export const GenericFormRoutes: Routes = [
  {
    path: "template-unauth",
    children: [
      {
        path: ':templateId',
        component: WebPageViewUnAuthComponent,
        data: { title: "Dynamic web page", breadcrumb: "Dynamic web page" }
      },
    ]
  },
  {
    path: "",
    children: [
      {
        path: 'application-form/:id/:name',
        component: GenericFormApplicationComponent,
        data: { title: 'Application form', breadcrumb: 'Application form' }
      },
      {
        path: "view-forms",
        component: GenericFormsViewComponent,
        data: { title: "Generic Form" }
      },
      {
        path: "custom-applications",
        component: CustomApplicationComponent,
        data: { title: "Custom application", breadcrumb: "Custom application" }
      },
      {
        path: "html-designer",
        component: HtmlDesignerComponent,
        data: { title: "Custom applications", breadcrumb: "Custom applications" }

      },
      {
        path: "html-viewer",
        component: WebPageViewComponent,
        data: { title: "Web Page View", breadcrumb: "Web Page View" }
      },
      // {
      //   path: "webview",
      //   component: WebPageViewComponent,
      //   data: { title: "Dynamic web page", breadcrumb: "Dynamic web page" }

      // },

      {
        path: ":templateId/:genericFormSubmittedId",
        component: WebPageViewComponent,
        data: { title: "Dynamic web page", breadcrumb: "Dynamic web page" }

      },
      {
        path: ":templateId",
        component: WebPageViewComponent,
        data: { title: "Dynamic web page", breadcrumb: "Dynamic web page" }

      },
      
      {
        path: 'submit-form/:formId/:customapplicationId/:submittedId',
        component: SubmitFormTriggerComponent,
        data: { title: "Application form", breadcrumb: "Application form" }
      },
      {
        path: 'process-dashboard',
        component: ProcessAppComponent,
        data: { title: "Application form", breadcrumb: "Application form" }
      },

    ]
  },
  // {
  //   path: "kyc",
  //   children: [
  //     {
  //       path: 'submit-public-form',
  //       component: ApplicationComponent,
  //       data: { title: 'Application form', breadcrumb: 'Application form' }
  //     },
  //   ]
  // },
  
];