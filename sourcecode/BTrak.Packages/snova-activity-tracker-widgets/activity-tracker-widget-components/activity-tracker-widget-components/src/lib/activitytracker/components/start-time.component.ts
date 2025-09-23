import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { KpiSearchModel } from '../models/kpi-search.model';
import { ActivityTrackerService } from '../services/activitytracker-services';

@Component({
  selector: 'app-start-time',
  templateUrl: `start-time.component.html`
})
export class StartTimeComponent extends CustomAppBaseComponent implements OnInit {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    this.dashboardFilters = data;
    this.getstarttime();
  }

  dashboardFilters: DashboardFilterModel;
  startTime: string;

  constructor(private activityTrackerService: ActivityTrackerService, private cdRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  getstarttime() {
    var inputModel = new KpiSearchModel();
    inputModel.date = this.dashboardFilters ? this.dashboardFilters.date ? this.dashboardFilters.date : null : null;
    this.activityTrackerService.getstarttime(inputModel).subscribe((responseData: any) => {
      if (responseData.success == true) {
        this.startTime = responseData.data;
      } else {
        this.startTime = null;
      }
      this.cdRef.detectChanges();
    });
  }
}


