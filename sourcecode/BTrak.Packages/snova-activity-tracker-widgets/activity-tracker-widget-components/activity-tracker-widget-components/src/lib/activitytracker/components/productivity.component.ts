import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ActivityTrackerService } from '../services/activitytracker-services';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { KpiSearchModel } from '../models/kpi-search.model';


@Component({
  selector: 'app-fm-component-productivity',
  templateUrl: `productivity.component.html`
})

export class productivityComponent extends CustomAppBaseComponent implements OnInit {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    this.dashboardFilters = data;
    this.getproductivity();
  }

  dashboardFilters: DashboardFilterModel;
  productiveTime: string;

  constructor(private activityTrackerService: ActivityTrackerService, private cdRef: ChangeDetectorRef) {
    super();
  }
  ngOnInit() {
    super.ngOnInit();
  }

  getproductivity() {
    var inputModel = new KpiSearchModel();
    inputModel.date = this.dashboardFilters ? this.dashboardFilters.date ? this.dashboardFilters.date : null : null;
    this.activityTrackerService.getproductivity(inputModel).subscribe((responseData: any) => {
      if (responseData.success == true) {
        this.productiveTime = responseData.data;
      } else {
        this.productiveTime = '0h';
      }
      this.cdRef.detectChanges();
    });
  }
}
