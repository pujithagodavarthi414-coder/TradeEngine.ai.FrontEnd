import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ActivityTrackerService } from '../services/activitytracker-services';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { KpiSearchModel } from '../models/kpi-search.model';


@Component({
    selector: 'app-fm-component-lateemployee',
    templateUrl: `late-employee.component.html`,
})

export class LateemployeeComponent extends CustomAppBaseComponent implements OnInit {

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        this.dashboardFilters = data;
        this.lateemployeescount();
    }

    dashboardFilters: DashboardFilterModel;
    lateemployeesCount: number = 0;

    constructor(private timeUsageService: ActivityTrackerService, private cdRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    lateemployeescount() {
        var inputModel = new KpiSearchModel();
        inputModel.date = this.dashboardFilters ? this.dashboardFilters.date ? this.dashboardFilters.date : null : null;
        this.timeUsageService.lateemployee(inputModel).subscribe((response: any) => {
            if (response.success == true) {
                this.lateemployeesCount = response.data;
            } else {
                this.lateemployeesCount = 0;
            }
            this.cdRef.detectChanges();
        });
    }
}
