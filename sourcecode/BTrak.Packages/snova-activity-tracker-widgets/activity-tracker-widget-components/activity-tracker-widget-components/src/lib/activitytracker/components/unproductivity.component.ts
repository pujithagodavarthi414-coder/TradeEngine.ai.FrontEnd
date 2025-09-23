import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { KpiSearchModel } from '../models/kpi-search.model';
import { ActivityTrackerService } from '../services/activitytracker-services';

@Component({
  selector: 'app-fm-component-Unproductivity',
  templateUrl: `unproductivity.component.html`
})

export class UnproductivityComponent extends CustomAppBaseComponent implements OnInit {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    this.dashboardFilters = data;
    this.getunproductivity();
  }

  dashboardFilters: DashboardFilterModel;
  unproductiveTime: string;

  constructor(private activityTrackerService: ActivityTrackerService, private cdRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  getunproductivity() {
    var inputModel = new KpiSearchModel();
    inputModel.date = this.dashboardFilters ? this.dashboardFilters.date ? this.dashboardFilters.date : null : null;
    this.activityTrackerService.getunproductivity(inputModel).subscribe((responseData: any) => {
      if (responseData.success == true) {
        this.unproductiveTime = responseData.data;
      } else {
        this.unproductiveTime = '0h';
      }
      this.cdRef.detectChanges();
    });
  }
}
