import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { KpiSearchModel } from '../models/kpi-search.model';
import { ActivityTrackerService } from '../services/activitytracker-services';

@Component({
  selector: 'app-fm-component-idle',
  templateUrl: `system-idle-time.component.html`
})

export class SystemidletimeComponent extends CustomAppBaseComponent implements OnInit {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    this.dashboardFilters = data;
    this.getunproductivity();
  }

  dashboardFilters: DashboardFilterModel;
  idleTime: string;

  constructor(private activityTrackerService: ActivityTrackerService, private cdRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  getunproductivity() {
    var inputModel = new KpiSearchModel();
    inputModel.date = this.dashboardFilters ? this.dashboardFilters.date ? this.dashboardFilters.date : null : null;
    this.activityTrackerService.getidletime(inputModel).subscribe((responseData: any) => {
      if (responseData.success == true) {
        this.idleTime = responseData.data;
      } else {
        this.idleTime = '0h';
      }
      this.cdRef.detectChanges();
    });
  }

}
