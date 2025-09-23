import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";
import { ViewTimeSheetComponent, TimesheetModule } from '@snovasys/snova-timesheet';
import { GoogleAnalyticsService } from "../app.module/services/google-analytics.service";


export class ProjectManagementModuleService {

  static components =  [
    {
        name: "Time sheet",
        componentTypeObject: ViewTimeSheetComponent
      }
  ]
}

@NgModule({
  imports: [
    CommonModule,
    TimesheetModule
  ],
  providers:[GoogleAnalyticsService],
  
  // entryComponents:[ViewTimeSheetComponent]
})
export class ProjectManagementModule {
  static componentService = ProjectManagementModuleService;
}
