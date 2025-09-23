import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { ActivityTrackerWidgetModule, ActivityTrackerProductiveAppsComponent, ActivityAppsComponent, ActivityTrackerBryntumReportView } from "@thetradeengineorg1/snova-activity-tracker-widgets";


export class ActivityTrackerWidgetComponentSupplierService {

  static components =  [
    {
        name: "Productivity apps",
        componentTypeObject: ActivityTrackerProductiveAppsComponent
    },
    {
        name: "Activity",
        componentTypeObject: ActivityAppsComponent
    },
    {
        name: "Activity tracker timeline",
        componentTypeObject: ActivityTrackerBryntumReportView
    }
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
