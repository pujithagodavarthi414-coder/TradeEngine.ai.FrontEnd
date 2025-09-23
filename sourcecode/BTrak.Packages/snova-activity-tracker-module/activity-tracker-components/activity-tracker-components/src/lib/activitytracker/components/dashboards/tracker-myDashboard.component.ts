import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DashboardList } from '../../models/dashboard-list.model';
import { DashboardFilterModel } from '../../models/dashboard.filter.model';
import { DynamicDashboardFilterModel, FilterKeyValueModel } from '../../models/dynamic-dashboard-filter.model';
import { TimeUsageService } from '../../services/time-usage.service';

@Component({
    selector: "app-tracker-dashboard-component",
    templateUrl: "tracker-myDashboard.component.html"
})

export class TrackerDashboardComponent {

    @Input("dashboardName")
    set _dashboardName(data) {
        if (data) {
            this.dashboardName = data;
            this.GetCustomizedDashboardId();
        }
    }

    reloadDashboard: string = null;
    selectedApps: any;
    appTagSearchText = "Users";
    selectedWorkspaceId: string;
    validationMessage: string;
    dashboardFilter: DashboardFilterModel;
    widget: boolean = true;
    filterApplied: any;
    selectedAppForListView: any;
    listView: boolean = false;
    dashboardName: string;
    maxDate = new Date();
    selectedDate = new Date();
    selectedDynamicFilter: FilterKeyValueModel;
    dynamicFilters: FilterKeyValueModel[] = [];
    isEmitRequired = false;

    constructor(private timeUsageService: TimeUsageService, private datePipe: DatePipe, private cdRef: ChangeDetectorRef) { }

    ngOnInit() {
    }

    GetCustomizedDashboardId() {
        this.dashboardFilter = new DashboardFilterModel();
        const dashboardModel = new DashboardList();
        dashboardModel.isCustomizedFor = this.dashboardName;
        this.timeUsageService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
            if (result.success === true) {
                this.selectedWorkspaceId = result.data;
                this.isEmitRequired = false;
                this.upsertDynamicFilters();
            }
        });
    }

    upsertDynamicFilters() {
        this.dynamicFilters = [];
        this.selectedDynamicFilter = new FilterKeyValueModel();
        this.selectedDynamicFilter.filterKey = 'Date';
        this.selectedDynamicFilter.filterName = 'Date';
        this.selectedDynamicFilter.filterValue =  JSON.stringify({ dateFrom: null, dateTo: null, date: this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd')});
        this.selectedDynamicFilter.isSystemFilter = true;
        this.selectedDynamicFilter.dashboardId = this.selectedWorkspaceId;
        this.dynamicFilters.push(this.selectedDynamicFilter);
        const dashboardDynamicFilters = new DynamicDashboardFilterModel();
        dashboardDynamicFilters.referenceId = this.selectedWorkspaceId;
        dashboardDynamicFilters.filters = this.dynamicFilters;
        this.timeUsageService.UpsertCustomDashboardFilter(dashboardDynamicFilters).subscribe((result: any) => {
            if (result.success === true && this.isEmitRequired) {
                const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
                this.filterApplied = "filterapplied" + possible.charAt(Math.floor(Math.random() * possible.length));
                this.cdRef.detectChanges();
            }
        });
    }

    resetDateFilter() {
        this.selectedDate = new Date();
        this.dashboardFilter = new DashboardFilterModel();
        this.dashboardFilter.date = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
        this.isEmitRequired = true;
        this.upsertDynamicFilters();
    }

    dateFilterApplied(event: MatDatepickerInputEvent<Date>) {
        this.selectedDate = event.target.value;
        this.dashboardFilter = new DashboardFilterModel();
        this.dashboardFilter.date = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
        this.isEmitRequired = true;
        this.upsertDynamicFilters();
    }
}