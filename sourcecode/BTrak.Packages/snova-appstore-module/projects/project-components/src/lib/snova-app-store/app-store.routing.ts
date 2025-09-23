import { Routes } from "@angular/router";
import { AppStoreComponent } from "./components/app-store/app-store.component";

export const AppStoreRoutes: Routes = [
    {
      path: "",
      component: AppStoreComponent,
      data: { title: "Dashboard", breadcrumb: "widget" }
    }
]
