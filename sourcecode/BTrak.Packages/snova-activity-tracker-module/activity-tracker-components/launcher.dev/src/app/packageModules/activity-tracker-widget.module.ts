import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ActivityTrackerWidgetModule, ActivityTrackerProductiveAppsComponent,TeamActivityComponent,TeamsizeComponent, ApplicationCategoryComponent, TopSitesComponent, TeamTopSitesComponent, ActivityAppsComponent, TrackerTimelineComponent, LatestScreenshotsComponent, MostProductiveUsersComponent, MostUnProductiveUsersComponent, OfflineEmployeesComponent, OnlineEmployeesComponent, IdleTimeUsersComponent,MinWorkingHoursComponent, ActivityTrackerBryntumReportView } from "@snovasys/snova-activity-tracker-widgets";


export class ActivityTrackerWidgetComponentSupplierService {

  static components = [
    {
      name: "Productivity apps",
      componentTypeObject: ActivityTrackerProductiveAppsComponent
    },
    {
      name: "Activity tracker configuration",
      componentTypeObject: ActivityAppsComponent
    },
    {
      name: "Daily activity",
      componentTypeObject: TrackerTimelineComponent
    },
    {
      name: "Latest screenshots",
      componentTypeObject: LatestScreenshotsComponent
    },
    {
      name: "Most Productive Users",
      componentTypeObject: MostProductiveUsersComponent
    },
    {
      name: "Most Unproductive Users",
      componentTypeObject: MostUnProductiveUsersComponent
    },
    {
      name: "Offline Users",
      componentTypeObject: OfflineEmployeesComponent
    },
    {
      name: "Online Users",
      componentTypeObject: OnlineEmployeesComponent
    },
    {
      name: "Idle Time Users",
      componentTypeObject: IdleTimeUsersComponent
    },
    {
      name: "Min Working Hours",
      componentTypeObject: MinWorkingHoursComponent
    },
    {
      name: "My top websites",
      componentTypeObject: TopSitesComponent
    },
    {
      name: "My top applications",
      componentTypeObject: TopSitesComponent
    },
    {
      name: "Team top five productive websites and applications",
      componentTypeObject: TeamTopSitesComponent
    },
    {
      name: "Team top 5 unproductive websites & applications",
      componentTypeObject: TeamTopSitesComponent
    },
    {
      name: "Application category",
      componentTypeObject: ApplicationCategoryComponent,
    },
    {
      name: "Time productivity",
      componentTypeObject: TeamActivityComponent
    },
    {
      name: "Team members count",
      componentTypeObject: TeamsizeComponent
    }
    //,
    // {
    //     name: "Activity tracker timeline",
    //     componentTypeObject: ActivityTrackerBryntumReportView
    // }
  ]
}

@NgModule({
  imports: [
    CommonModule,
    ActivityTrackerWidgetModule
  ]
})
export class ActivityTrackerWidgetPackageModule {
  static componentService = ActivityTrackerWidgetComponentSupplierService;
}
