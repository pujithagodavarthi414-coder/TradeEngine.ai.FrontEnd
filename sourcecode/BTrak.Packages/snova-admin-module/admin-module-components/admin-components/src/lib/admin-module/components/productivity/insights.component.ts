import { ChangeDetectorRef, Component, Type, Input } from '@angular/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { WidgetService } from '../../services/widget.service';
import * as _ from "underscore";
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { DashboardList } from '../../models/dashboardList';
import { Router } from '@angular/router';
import { DynamicDashboardFilterModel, FilterKeyValueModel } from '../../models/dynamicDashboardFilerModel';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material/dialog';
import * as moment_ from 'moment';
const moment = moment_
import { Moment } from 'moment';
@Component({
    selector: 'app-insights',
    templateUrl: `insights.component.html`

})

export class InsightsComponent extends CustomAppBaseComponent {

    selectedTabLable: string;
    selectedTab: number = 0;
    selectedUserId: string;
    dashboardFilter: DashboardFilterModel;
    selectedWorkspaceIdForInsights: string;
    listView: boolean = false;
    widget: boolean = true;
    isFromProductivityDashboard: boolean = false;
    insightsDashboardFilter: DashboardFilterModel;
    filterApplied: any;
    selectedApps: any;
    reloadDashboard: string = null;
    isEmitRequired = false;
    dynamicFilters: FilterKeyValueModel[] = [];
    selectedDynamicFilter: FilterKeyValueModel;
    isFromMyProductivity: boolean = false;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.insightsDashboardFilter = data;
            const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
            this.filterApplied = "filterapplied" + possible.charAt(Math.floor(Math.random() * possible.length));
        }
    };
    ngOnInit() {
        super.ngOnInit();
        if (this.isFromProductivityDashboard) {
            this.GetCustomizedDashboardIdForInsights();
        }

    }

    constructor(
        private widgetService: WidgetService,
        private cdRef: ChangeDetectorRef,
        private router: Router,
        private datePipe: DatePipe, private cookieService: CookieService, private dialogRef: MatDialog
    ) {
        super();
        if (this.router.url.includes('productivity/dashboard/')) {
            this.isFromProductivityDashboard = true;
            // if('dashboard/myproductivity'){
            //     this.selectedUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
            //     this.isFromMyProductivity = true;
            // }
        }

    }
    ngAfterViewInit(): void {
        super.ngOnInit()
    }

    GetCustomizedDashboardIdForInsights() {
        this.dashboardFilter = new DashboardFilterModel();
        const dashboardModel = new DashboardList();
        dashboardModel.isCustomizedFor = "insights";
        this.widgetService.GetCustomizedDashboardId(dashboardModel).subscribe((result: any) => {
            if (result.success === true) {
                this.selectedWorkspaceIdForInsights = result.data;
                this.isEmitRequired = false;
                this.cdRef.markForCheck();
                this.upsertDynamicFilters();
                this.cdRef.detectChanges();
            }

        });
    }
    navToInsights() {
        this.dialogRef.closeAll();
        this.router.navigate(['productivity/dashboard/myproductivity']);
    }
    upsertDynamicFilters() {
        this.dynamicFilters = [];
        const projectTag = new FilterKeyValueModel();
        projectTag.filterKey = "Project";
        projectTag.filterName = "Project";
        projectTag.isSystemFilter = true;
        projectTag.filterValue = this.insightsDashboardFilter.projectId;
        const userTag = new FilterKeyValueModel();
        userTag.filterKey = "User";
        userTag.filterName = "User";
        userTag.isSystemFilter = true;
        // userTag.filterValue = this.isFromMyProductivity ? this.selectedUserId : this.insightsDashboardFilter.userId;
        userTag.filterValue = this.insightsDashboardFilter.userId;
        const dateTag = new FilterKeyValueModel();
        dateTag.filterKey = "Date";
        dateTag.filterName = "Date";
        dateTag.isSystemFilter = true;
        var tempDate = this.insightsDashboardFilter.date;
        if (tempDate == null) {
            let obj;
            if (this.insightsDashboardFilter.dateFrom && this.insightsDashboardFilter.dateTo) {
                let dateFrom = moment(this.insightsDashboardFilter.dateFrom).format('YYYY-MM-DD');
                let dateTo = moment(this.insightsDashboardFilter.dateTo).format('YYYY-MM-DD');
                obj = { dateFrom: dateFrom, dateTo: dateTo };
                dateTag.filterValue = JSON.stringify(obj);
            }
            else {
                dateTag.filterValue = 'thisMonth'
            }
        }
        else if (tempDate == 'lastWeek' || tempDate == 'nextWeek' || tempDate == 'thisMonth' || tempDate == 'lastMonth') {
            dateTag.filterValue = this.insightsDashboardFilter.date;
        }
        else {
            let obj = { dateFrom: this.insightsDashboardFilter.dateFrom, dateTo: this.insightsDashboardFilter.dateTo, date: moment(tempDate).format('YYYY-MM-DD') };
            dateTag.filterValue = JSON.stringify(obj);
        }

        this.dynamicFilters.push(projectTag);
        this.dynamicFilters.push(userTag);
        this.dynamicFilters.push(dateTag);
        const dashboardDynamicFilters = new DynamicDashboardFilterModel();
        dashboardDynamicFilters.referenceId = this.selectedWorkspaceIdForInsights;
        dashboardDynamicFilters.filters = this.dynamicFilters;
        this.widgetService.UpsertCustomDashboardFilter(dashboardDynamicFilters).subscribe((result: any) => {
            if (result.success === true && this.isEmitRequired) {
                const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
                this.filterApplied = "filterapplied" + possible.charAt(Math.floor(Math.random() * possible.length));
                this.cdRef.detectChanges();
            }
        });
    }
}