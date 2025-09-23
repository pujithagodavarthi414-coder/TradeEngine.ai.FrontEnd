import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { SeriesLabels } from "@progress/kendo-angular-charts";
import { getDate } from "@progress/kendo-date-math";
import { elementAt } from "rxjs/operators";
import { CustomAppBaseComponent } from "../../globaldependencies/components/componentbase";
import { DashboardFilterModel } from "../models/dashboardFilterModel";
import { TopSitesModel } from "../models/top-sites.model";
import { ActivityTrackerService } from "../services/activitytracker-services";
import * as $_ from 'jquery';
const $ = $_;

@Component({
    selector: "app-component-team-topSites",
    templateUrl: "team-websitesandApplications.component.html",
})

export class TeamTopSitesComponent extends CustomAppBaseComponent implements OnInit {

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        this.dashboardFilters = data;
        this.date = this.dashboardFilters ? this.dashboardFilters.date ? this.dashboardFilters.date : this.datePipe.transform(new Date(), 'yyyy-MM-dd') : this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        this.getTopWebsitesInformation();
    }

    dashboardFilters: DashboardFilterModel;

    @Input("dashboardName")
    set _dashboardName(data: string) {
        if (data != null && data !== undefined && this.dashboardName != data) {
            this.dashboardName = data;
            if (!this.date) {
                this.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
            }
            if (this.dashboardName == 'Team top five productive websites and applications') {
                this.isApp = null;
                this.isMySelf = false;
                this.isProductive = true;
            }
            if (this.dashboardName == 'Team top 5 unproductive websites & applications') {
                this.isApp = null;
                this.isMySelf = false;
                this.isProductive = false;
            }
            this.getTopWebsitesInformation();
        }
    }

    cursor = 'default';
    dashboardName: string = 'Example';
    activityData: TopSitesModel[] = [];
    chartData: any[] = [];
    isApp: boolean;
    isMySelf: boolean;
    loading: boolean;
    date: string;
    isProductive: boolean;

    public seriesLabels: SeriesLabels = {
        visible: true, // Note that visible defaults to false
        padding: 3,
        font: "bold 16px Arial, sans-serif"
    };

    constructor(private timeUsageService: ActivityTrackerService, private cdRef: ChangeDetectorRef, private datePipe: DatePipe) {
        super();

    }

    ngOnInit() {
        super.ngOnInit();
        //this.getTopWebsitesInformation();
    }

    getTopWebsitesInformation() {
        this.loading = true;
        let topSitesModel = new TopSitesModel();
        topSitesModel.isApp = null;
        topSitesModel.mySelf = this.isMySelf;
        topSitesModel.isProductiveApps = this.isProductive;
        topSitesModel.onDate = this.date;
        this.timeUsageService.getActivityData(topSitesModel).subscribe((responseData: any) => {
            if (responseData.success) {
                this.activityData = [];
                this.chartData = [];
                this.activityData = responseData.data;
                if (this.activityData && this.activityData.length > 0) {
                    this.activityData.forEach((element) => {
                        this.chartData.push({ category: element.appUrlName, value: element.totalTimeInHr });
                    });
                }
                this.loading = false;
                this.cdRef.detectChanges();
            }
            else {
                this.activityData = [];
                this.chartData = [];
                this.loading = false;
                this.cdRef.detectChanges();
            }
        });
    }

    public pointColor(point): string {
        let color = '';
        if (point.category == 'Un Productive') {
            color = '#FF8993'
        }
        if (point.category == 'Productive') {
            color = '#5DCBC8'
        }
        if (point.category == 'Neutral') {
            color = '#8E9AAA'
        }
        return color;
    }

    refresh() {
        this.getTopWebsitesInformation();
    }

    getMoreInformation(productiveRoles, unProductiveRoles, name) {
        if (productiveRoles && unProductiveRoles) {
            return 'Name: ' + name + '\n Productive roles: ' + productiveRoles + '\n Un productive roles: ' + unProductiveRoles;
        }

        else if (productiveRoles) {
            return 'Name: ' + name + '\n Productive roles: ' + productiveRoles
        }

        else if (unProductiveRoles) {
            return 'Name: ' + name + '\n Un productive roles: ' + unProductiveRoles;
        }
        else {
            return 'Name: ' + name + '\n No roles to display'
        }
    }


    fitContent(optionalParameters: any) {
        var interval;
        var count = 0;
        if (optionalParameters['gridsterView']) {
            interval = setInterval(() => {
                try {
                    if (count > 30) {
                        clearInterval(interval);
                    }
                    count++;
                    if ($(optionalParameters['gridsterViewSelector'] + ' .team-appsWeb-height').length > 0) {
                        var appHeight = $(optionalParameters['gridsterViewSelector']).height();
                        var contentHeight = appHeight - 45;
                        $(optionalParameters['gridsterViewSelector'] + ' .team-appsWeb-height').height(contentHeight);
                        clearInterval(interval);
                    }

                } catch (err) {
                    clearInterval(interval);
                }
            }, 1000);
        }
    }
}
