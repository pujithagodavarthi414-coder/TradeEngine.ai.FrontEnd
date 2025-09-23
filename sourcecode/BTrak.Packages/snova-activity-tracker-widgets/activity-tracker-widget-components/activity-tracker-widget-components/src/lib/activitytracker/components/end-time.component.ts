import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { KpiSearchModel } from '../models/kpi-search.model';
import { ActivityTrackerService } from '../services/activitytracker-services';

@Component({
  selector: 'app-end-time',
  templateUrl: `end-time.component.html`
})
export class EndTimeComponent extends CustomAppBaseComponent implements OnInit {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    this.dashboardFilters = data;
    this.getfinishtime();
  }

  dashboardFilters: DashboardFilterModel;
  finishTime: string;

  constructor(private activityTrackerService: ActivityTrackerService, private cdRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  getfinishtime() {
    var inputModel = new KpiSearchModel();
    inputModel.date = this.dashboardFilters ? this.dashboardFilters.date ? this.dashboardFilters.date : null : null;
    this.activityTrackerService.getfinishtime(inputModel).subscribe((responseData: any) => {
      if (responseData.success == true) {
        this.finishTime = responseData.data;
      } else {
        this.finishTime = null;
      }
      this.cdRef.detectChanges();
    });
  }
}


