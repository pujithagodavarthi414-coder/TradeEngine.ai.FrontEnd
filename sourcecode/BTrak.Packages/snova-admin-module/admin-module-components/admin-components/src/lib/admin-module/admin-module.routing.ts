import { Routes } from "@angular/router";
import { settingsComponent } from '../../public-api';
import { productivityAreaComponent } from './components/productivity/productivity-area.component';

export const AdminRoutes: Routes = [
  {
    path: "dashboard", 
    component: productivityAreaComponent, 
    data: { title: "Productivity", breadcrumb: "Productivity Overview" },
  },
  {
    path: "dashboard/:tab", 
    component: productivityAreaComponent, 
    data: { title: "Productivity", breadcrumb: "Productivity Overview" },
  },
  { path: 'settings', component: settingsComponent, data: { title: 'settings', breadcrumb: 'settings' } },
    {
        path: "",
        children: [
            {
                path: "", 
                component: settingsComponent, 
                data: { title: "Setting Overview", breadcrumb: "Setting Overview" },
              },
              {
                path: ":tab", 
                component: settingsComponent, 
                data: { title: "Setting Overview", breadcrumb: "Setting Overview" },
              },
              
        ]
    }
    
]