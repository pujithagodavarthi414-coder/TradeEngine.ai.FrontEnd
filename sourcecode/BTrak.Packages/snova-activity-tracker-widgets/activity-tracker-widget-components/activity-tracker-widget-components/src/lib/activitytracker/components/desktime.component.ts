import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { KpiSearchModel } from '../models/kpi-search.model';
import { ActivityTrackerService } from '../services/activitytracker-services';

@Component({
  selector: 'app-fm-component-desktime',
  templateUrl: `desktime.component.html`
})

export class DeskTimeComponent extends CustomAppBaseComponent implements OnInit {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
      this.dashboardFilters = data;
      this.getdesktime();
  }

  dashboardFilters: DashboardFilterModel;
  deskTime: string;

  constructor(private activityTrackerService: ActivityTrackerService, private cdRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  getdesktime() {
    var inputModel = new KpiSearchModel();
    inputModel.date = this.dashboardFilters ? this.dashboardFilters.date ? this.dashboardFilters.date : null : null;
    this.activityTrackerService.getdesktime(inputModel).subscribe((responseData: any) => {
      if (responseData.success == true) {
        this.deskTime = responseData.data;
      } else {
        this.deskTime = '0h';
      }
      this.cdRef.detectChanges();
    });
  }

}
