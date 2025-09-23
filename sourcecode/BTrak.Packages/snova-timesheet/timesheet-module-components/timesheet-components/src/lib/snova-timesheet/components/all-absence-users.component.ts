import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { Router } from "@angular/router";
import { TimeSheetModel } from "../models/time-sheet-model";
import { TimeSheetService } from "../services/timesheet.service";
import * as $_ from 'jquery';
import { KpiSearchModel } from '../models/kpi-search.model';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
const $ = $_;

@Component({
  selector: 'all-absence-users',
  templateUrl: 'all-absence-users.component.html'
})

export class AllAbsenceUsersComponent {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined && !this.isInitialLoad) {
      this.dashboardFilters = data;
      this.getAllAbsenceUsers();
    }
  }

  dashboardFilters: DashboardFilterModel;
  isInitialLoad: boolean = true;
  list: TimeSheetModel[] = [];
  anyOperationInProgress: boolean;

  constructor(private router: Router, private timeSheetService: TimeSheetService, private cdRef: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.getAllAbsenceUsers();
  }

  getAllAbsenceUsers() {
    this.anyOperationInProgress = true;
    var inputModel = new KpiSearchModel();
    inputModel.date = this.dashboardFilters ? this.dashboardFilters.date : null;
    this.timeSheetService.getAllAbsenceUsers(inputModel).subscribe((responseData: any) => {
      this.isInitialLoad = false;
      this.list = responseData.data;
      this.anyOperationInProgress = false;
      this.cdRef.detectChanges();
    });
  }

  goToUserProfile(selectedUserId) {
    this.router.navigate(["dashboard/profile", selectedUserId, "overview"]);
  }

  fitContent(optionalParameters: any) {

    if (optionalParameters['gridsterView']) {
      $(optionalParameters['gridsterViewSelector'] + ' all-absence-users #widget-scroll-id').height($(optionalParameters['gridsterViewSelector']).height() - 40);
    }
  }
}