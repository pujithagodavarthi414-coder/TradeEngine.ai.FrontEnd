import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { KpiSearchModel } from '../models/kpi-search.model';
import { ActivityTrackerService } from '../services/activitytracker-services';

@Component({
  selector: 'app-fm-component-presentusers',
  templateUrl: `present-users.component.html`
})

export class PresentusersComponent extends CustomAppBaseComponent implements OnInit {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    this.dashboardFilters = data;
    this.getpresentusers();
  }

  dashboardFilters: DashboardFilterModel;
  presentCount: number = 0;

  constructor(private activityTrackerService: ActivityTrackerService, private cdRef: ChangeDetectorRef) {
    super();
  }
  ngOnInit() {
    super.ngOnInit();
  }

  getpresentusers() {
    var inputModel = new KpiSearchModel();
    inputModel.date = this.dashboardFilters ? this.dashboardFilters.date ? this.dashboardFilters.date : null : null;
    this.activityTrackerService.getpresentusers(inputModel).subscribe((responseData: any) => {
      if (responseData.success == true) {
        this.presentCount = responseData.data;
      } else {
        this.presentCount = 0;
      }
      this.cdRef.detectChanges();
    });
  }
}
