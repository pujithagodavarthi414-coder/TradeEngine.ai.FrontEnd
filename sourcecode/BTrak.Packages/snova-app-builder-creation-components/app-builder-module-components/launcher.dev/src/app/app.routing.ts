import { Routes } from "@angular/router";
import { UnAuthGuard, AuthGuard, AuthLayoutComponent } from "@thetradeengineorg1/snova-authentication-module";
import { CustomApplicationComponent } from "app-builder-module-components/app-builder-components/src/lib/builder/components/genericform/custom-application/custom-application.component";
import { GenericFormApplicationComponent } from "app-builder-module-components/app-builder-components/src/lib/builder/components/genericform/generic-form-application.component";
import { HtmlDesignerComponent } from "app-builder-module-components/app-builder-components/src/lib/builder/components/html-designer/html-designer.component";
import { GenericFormsViewComponent } from "app-builder-module-components/app-builder-components/src/lib/builder/components/genericform/genericforms-view/genericforms-view.component";
import { BoxChartComponent } from "app-builder-module-components/app-builder-components/src/lib/builder/components/genericform/box-chart/box-chart.component";
import { AddCustomWidgetComponent } from "app-builder-module-components/app-builder-components/src/lib/builder/components/widgetmanagement/addcustomwidget.component";
import { WidgetTestComponet } from "./widget-test.component";
import { WebPageViewComponent } from "app-builder-module-components/app-builder-components/src/lib/builder/components/html-viewer/web-page-viewer.component";
import { SubmitFormTriggerComponent } from "app-builder-module-components/app-builder-components/src/lib/builder/components/widgetmanagement/submit-form-trigger.component";
import { ProcessAppComponent } from "app-builder-module-components/app-builder-components/src/lib/builder/components/widgetmanagement/process-app-details.component";
import { ApplicationComponent } from "app-builder-module-components/app-builder-components/src/lib/builder/components/genericform/public-url/application.component";
import { WebPageViewUnAuthComponent } from "app-builder-module-components/app-builder-components/src/lib/builder/components/html-viewer-unauth/web-page-viewer-unauth.component";
import { EmissionComponent } from "app-builder-module-components/app-builder-components/src/lib/builder/components/emission/emission.component";
import { CustomAppRecordsExcelUploaderComponent } from "app-builder-module-components/app-builder-components/src/lib/builder/components/custom-app-records-excel-uploader/custom-app-records-excel-uploader";

export const rootProdRouterConfig: Routes = [
  {
    path: "",
    redirectTo: "sessions",
    pathMatch: "full"
  },
  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: "sessions",
        canActivate: [UnAuthGuard],
        loadChildren: () => import('./packageModules/sessions.module').then(m => m.SessionModule),
        data: { title: "Session" }
      },
    ]
  },
  {
    path: "template-unauth",
    component: AuthLayoutComponent,
    children: [
      {
        path: ":templateId",
        canActivate: [UnAuthGuard],
        component: WebPageViewUnAuthComponent,
        data: {  title: "Dynamic web page", breadcrumb: "Dynamic web page" }
      },
    ]
  },
  {
    path: "kyc",
    component: AuthLayoutComponent,
    children: [
      {
        path: "submit-public-form",
        canActivate: [UnAuthGuard],
        component: ApplicationComponent,
        data: { title: "Session" }
      },
    ]
  },
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      {
        path: "dashboard-management",
        loadChildren: () => import('./packageModules/tester.module').then(m => m.TesterModule),
        data: { title: "Dashboard Management", breadcrumb: "Dashboard Management" }
      },
      {
        path: "applications/custom-applications",
        component: CustomApplicationComponent,
        data: { title: "Custom applications", breadcrumb: "Custom applications" }
      },
      {
        path: "forms/application-form/:id/:name",
        component: GenericFormApplicationComponent,
        data: { title: "Custom applications", breadcrumb: "Custom applications" }
      },
      {
        path: "applications/html-designer",
        component: HtmlDesignerComponent,
        data: { title: "Custom applications", breadcrumb: "Custom applications" }

      },
      {
        path: "applications/html-viewer",
        component: WebPageViewComponent,
        data: { title: "Web Page View", breadcrumb: "Web Page View" }
      },
      {
        path: "applications/html-viewer-unauth",
        component: WebPageViewUnAuthComponent,
        data: { title: "Web Page View", breadcrumb: "Web Page View" }
      },
      {
        path: "forms/view-forms",
        component: GenericFormsViewComponent,
        data: { title: "Custom applications", breadcrumb: "Custom applications" }

      },
      {
        path: "webview/:templateId/:genericFormSubmittedId",
        component: WebPageViewComponent,
        data: { title: "Dynamic web page", breadcrumb: "Dynamic web page" }
      },
      {
        path: "webview/:templateId",
        component: WebPageViewComponent,
        data: { title: "Dynamic web page", breadcrumb: "Dynamic web page" }
      },
      {
        path: "forms/box-chart",
        component: BoxChartComponent,
        data: { title: "Generic Form" }
      },
      {
        path: "forms/custom-widget",
        component: AddCustomWidgetComponent,
        data: { title: "Generic Form" }
      },
      {
        path: "forms/submit-form/:formId/:customapplicationId/:submittedId",
        component: SubmitFormTriggerComponent,
        data: { title: "Generic Form" }
      },
      {
        path: "forms/custom-widget/:id",
        component: AddCustomWidgetComponent,
        data: { title: "Generic Form" }
      },
      {
        path: "forms/process-dashboard",
        component: ProcessAppComponent,
        data: { title: "Generic Form" }
      },
      {
        path: "widget-test",
        component: WidgetTestComponet,
        data: { title: "Widget", breadcrumb: "Widget" }
      },
      {
        path: "forms/emissions",
        component: EmissionComponent,
        data: { title: "Widget", breadcrumb: "Widget" }
      },
      {
        path: "forms/excel-uploader",
        component: CustomAppRecordsExcelUploaderComponent,
        data: { title: "Widget", breadcrumb: "Widget" }
      }
    ]
  },
  {
    path: "**",
    redirectTo: "sessions/404"
  }
];
