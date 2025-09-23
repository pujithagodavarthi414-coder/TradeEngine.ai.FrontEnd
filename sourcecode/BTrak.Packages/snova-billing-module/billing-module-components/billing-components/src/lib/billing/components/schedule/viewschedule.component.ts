import { Component, Input } from "@angular/core";

@Component({
  selector: "app-billing-component-client-schedule-viewschedule",
  templateUrl: "viewschedule.component.html"
})

export class ViewScheduleComponent {
  isReadOnly: boolean = true;
  scheduleDetailsData:boolean=true;

  // @Input() scheduleDetailsData: ScheduleDetailsModel;

  onEdit(){
    this.isReadOnly = false;
  }
}