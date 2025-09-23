import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { TimeUsageComponent } from './components/time-usage.component';
import { WebAppUsageComponent } from './components/web-app-usage.component';
import { ActivityScreenshotsComponent } from './components/activity-screenshots-component'
import { ActivityTrackerBryntumReportView } from './components/activity-tracker-bryntum-component';
import { ViewTrackerTimeSheetComponent } from './components/view-timesheet.component';
import { ActivityDashboardPageComponent } from './containers/activity-tracker-mainpage.component';


export const ActivityTrackerRoutes: Routes = [
    // { 
    //     path: 'timeusage', 
    //     component: TimeUsageComponent, 
    //     data: { title: 'timeusage', breadcrumb: 'timeusage' } 
    // },
    // { 
    //     path: 'webappusage', 
    //     component: WebAppUsageComponent, 
    //     data: { title: 'webappusage', breadcrumb: 'webappusage' } 
    // },
    // {
    //     path: "activitydashboard",
    //     component: ActivityDashboardPageComponent,
    //     data: { title: "Activity Dashboard", breadcrumb: "Activity Dashboard" }
    // },
    // {
    //     path: "activityscreenshots",
    //     component: ActivityScreenshotsComponent,
    //     data: { title: "ActivityScreenshot", breadcrumb: "ActivityScreenshot" }
    // },
    // {
    //     path: "activitytrackertimeline",
    //     component: ActivityTrackerBryntumReportView,
    //     data: { title: "Activity Tracker Timeline", breadcrumb: "Activity Tracker Timeline" }
    // },
    // {
    //     path: "time-sheet",
    //     component: ViewTrackerTimeSheetComponent,
    //     data: { title: "Time sheet", breadcrumb: "Time sheet" }
    // },
    {
        path: "activitydashboard",
        component: ActivityDashboardPageComponent,
        data: { title: "Activity Dashboard", breadcrumb: "Activity Dashboard" }
    },
    {
        path: "activitydashboard/:tab",
        component: ActivityDashboardPageComponent,
        data: { title: "Activity Dashboard", breadcrumb: "Activity Dashboard" }
    }


    // previously commented routes


    // {
    //     path: "Appusagereport",
    //     component: AppUsageReportComponent,
    //     data: { title: "App Usage Report", breadcrumb: "App Usage Report" }
    // },
    // {
    //     path: "websites-applications",
    //     component: WebsitesAndApplicationsComponent,
    //     data: { title: "Websites and Applications", breadcrumb: "Websites and Applications" }
    // },
    // {
    //     path: "timeusagedrilldown",
    //     component: TimeUsageDrillDownComponent,
    //     data: { title: "time usage drill down", breadcrumb: "time usage drill down" }
    // },
];