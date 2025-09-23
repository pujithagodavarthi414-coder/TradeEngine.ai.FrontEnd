import { Routes } from '@angular/router';
import { ProfileRoutes } from 'Profile-module-components/profile-components/src/lib/snovasys-profile-management/profile.route';

export const appRoutes: Routes = [{
    path: "dashboard",
    children: ProfileRoutes,
    data: { title: "dashbaord", breadcrumb: "dashboard" }
}]
