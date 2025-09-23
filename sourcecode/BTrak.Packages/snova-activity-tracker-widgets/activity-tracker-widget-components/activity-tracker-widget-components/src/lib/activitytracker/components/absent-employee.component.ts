import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ActivityTrackerService } from '../services/activitytracker-services';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { KpiSearchModel } from '../models/kpi-search.model';


@Component({
  selector: 'app-fm-component-absentemployee',
  templateUrl: `absent-employee.component.html`
})

export class AbsentemployeeComponent extends CustomAppBaseComponent implements OnInit {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    this.dashboardFilters = data;
    this.absentemployee();
  }

  dashboardFilters: DashboardFilterModel;
  absentemployeeCount: number = 0;

  constructor(private activityTrackerService: ActivityTrackerService, private cdRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  absentemployee() {
    var inputModel = new KpiSearchModel();
    inputModel.date = this.dashboardFilters ? this.dashboardFilters.date ? this.dashboardFilters.date : null : null;
    this.activityTrackerService.absentemployee(inputModel).subscribe((responseData: any) => {
      if (responseData.success == true) {
        this.absentemployeeCount = responseData.data;
      } else {
        this.absentemployeeCount = 0;
      }
      this.cdRef.detectChanges();
    });
  }
}


