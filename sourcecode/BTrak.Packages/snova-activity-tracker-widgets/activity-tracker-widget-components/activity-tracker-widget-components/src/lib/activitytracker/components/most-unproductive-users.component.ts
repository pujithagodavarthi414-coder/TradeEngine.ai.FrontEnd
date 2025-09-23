import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { Router } from "@angular/router";
import { MostProductiveUsersInputModel, MostProductiveUsersOutputModel } from '../models/most-productive-users-model';
import { ActivityTrackerService } from '../services/activitytracker-services';
import * as $_ from 'jquery';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
const $ = $_;

@Component({
  selector: 'most-unproductive-users',
  templateUrl: 'most-unproductive-users.component.html'
})

export class MostUnProductiveUsersComponent {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    this.dashboardFilters = data;
    this.getMostProductiveUsers();
  }

  dashboardFilters: DashboardFilterModel;
  inputModel: MostProductiveUsersInputModel;
  list: MostProductiveUsersOutputModel[] = [];
  anyOperationInProgress: boolean;

  constructor(private router: Router, private activityTrackerService: ActivityTrackerService, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.getMostProductiveUsers();
  }

  getMostProductiveUsers() {
    this.anyOperationInProgress = true;
    this.inputModel = new MostProductiveUsersInputModel();
    this.inputModel.applicationTypeName = 'UnProductive';
    this.inputModel.dateTo = this.dashboardFilters ? this.dashboardFilters.date ? this.dashboardFilters.date : null : null;
    this.inputModel.dateFrom = this.dashboardFilters ? this.dashboardFilters.date ? this.dashboardFilters.date : null : null;
    this.activityTrackerService.getMostProductiveUsers(this.inputModel).subscribe((responseData: any) => {
      this.list = responseData.data ? responseData.data : [];
      this.anyOperationInProgress = false;
      this.cdRef.detectChanges();
    });
  }

  goToUserProfile(selectedUserId) {
    this.router.navigate(["dashboard/profile", selectedUserId, "overview"]);
  }

  fitContent(optionalParameters: any) {
    if (optionalParameters['gridsterView']) {
      $(optionalParameters['gridsterViewSelector'] + ' most-unproductive-users #widget-scroll-id').height($(optionalParameters['gridsterViewSelector']).height() - 40);
    }
  }
}
