import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { KpiSearchModel } from '../models/kpi-search.model';
import { ActivityTrackerService } from '../services/activitytracker-services';

@Component({
  selector: 'app-fm-component-neutraltime',
  templateUrl: `neutraltime.component.html`
})

export class NeutralTimeComponent extends CustomAppBaseComponent implements OnInit {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    this.dashboardFilters = data;
    this.getneutraltime();
  }

  dashboardFilters: DashboardFilterModel;
  neutralTime: any;

  constructor(private activityTrackerService: ActivityTrackerService, private cdRef: ChangeDetectorRef) {
    super();
  }
  ngOnInit() {
    super.ngOnInit();
  }

  getneutraltime() {
    var inputModel = new KpiSearchModel();
    inputModel.date = this.dashboardFilters ? this.dashboardFilters.date ? this.dashboardFilters.date : null : null;
    this.activityTrackerService.getneutraltime(inputModel).subscribe((responseData: any) => {
      if (responseData.success == true) {
        this.neutralTime = responseData.data;
      } else {
        this.neutralTime = '0h';
      }
      this.cdRef.detectChanges();
    });
  }
}
