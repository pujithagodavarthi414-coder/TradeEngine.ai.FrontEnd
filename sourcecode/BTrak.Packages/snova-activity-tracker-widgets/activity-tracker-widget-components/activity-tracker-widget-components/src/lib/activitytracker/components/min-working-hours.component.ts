import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { Router } from "@angular/router";
import { TrackingUserModel } from '../models/tracking-user-model';
import { ActivityTrackerService } from '../services/activitytracker-services';
import * as $_ from 'jquery';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
const $ = $_;

@Component({
  selector: 'min-working-hours',
  templateUrl: 'min-working-hours.component.html'
})

export class MinWorkingHoursComponent {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    this.dashboardFilters = data;
    this.getTrackingUsers();
  }

  dashboardFilters: DashboardFilterModel;
  inputModel: TrackingUserModel;
  list: TrackingUserModel[] = [];
  anyOperationInProgress: boolean;

  constructor(private router: Router, private activityTrackerService: ActivityTrackerService, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  getTrackingUsers() {
    this.anyOperationInProgress = true;
    this.inputModel = new TrackingUserModel();
    this.inputModel.status = 'minworkinghours';
    this.inputModel.date = this.dashboardFilters ? this.dashboardFilters.date ? this.dashboardFilters.date : null : null;
    this.activityTrackerService.getTrackingUsers(this.inputModel).subscribe((responseData: any) => {
      this.list = responseData.data ? responseData.data : [];
      this.anyOperationInProgress = false;
      this.cdRef.detectChanges();
    });
  }

  resetFilter() {
    this.getTrackingUsers();
  }

  goToUserProfile(selectedUserId) {
    this.router.navigate(["dashboard/profile", selectedUserId, "overview"]);
  }

  fitContent(optionalParameters: any) {
    if (optionalParameters['gridsterView']) {
      $(optionalParameters['gridsterViewSelector'] + ' min-working-hours #widget-scroll-id').height($(optionalParameters['gridsterViewSelector']).height() - 40);
    } else if (optionalParameters['popupView']) {
      $(optionalParameters['popupViewSelector'] + ' min-working-hours #widget-scroll-id').css({ "height": "calc(100vh - 400px)" });
    } else if (optionalParameters['individualPageView']) {
      $(optionalParameters['individualPageSelector'] + ' min-working-hours #widget-scroll-id').css({ "height": "calc(100vh - 95px)" });
    }
  }
}
