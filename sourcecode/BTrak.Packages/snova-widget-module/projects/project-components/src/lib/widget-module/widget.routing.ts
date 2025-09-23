import { Routes } from "@angular/router";
import { TabsViewComponent } from "./components/tabs-view/tabs-view.component";
import { WidgetsgridsterComponent } from "./components/widgetsgridster/widgetsgridster.component";

export const WidgetRoutes: Routes = [
    {
      path: "",
      component: TabsViewComponent,
      data: { title: "Dashboard", breadcrumb: "widget" }
    },
    {
      path: "dashboard/:id/form/:formid",
      component: TabsViewComponent,
      data: { title: "Dashboard", breadcrumb: "widget" }
    },
    {
      path: "dashboard/:id",
      component: TabsViewComponent,
      data: { title: "Dashboard", breadcrumb: "widget" }
    },
    {
      path: "widgets/:id",
      component: WidgetsgridsterComponent,
      data: { title: "Dashboard", breadcrumb: "widget" }
    }
]
