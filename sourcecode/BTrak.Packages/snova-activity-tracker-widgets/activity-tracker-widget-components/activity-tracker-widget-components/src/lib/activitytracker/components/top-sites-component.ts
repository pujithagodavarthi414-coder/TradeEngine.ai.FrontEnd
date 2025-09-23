import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { SeriesLabels } from "@progress/kendo-angular-charts";
import { CustomAppBaseComponent } from "../../globaldependencies/components/componentbase";
import { DashboardFilterModel } from "../models/dashboardFilterModel";
import { TopSitesModel } from "../models/top-sites.model";
import { ActivityTrackerService } from "../services/activitytracker-services";
import * as $_ from 'jquery';
const $ = $_;

@Component({
    selector: "app-component-topSites",
    templateUrl: "top-sites-component.html",
})

export class TopSitesComponent extends CustomAppBaseComponent implements OnInit {

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        this.dashboardFilters = data;
        this.date = this.dashboardFilters.date ? this.dashboardFilters.date : this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        if (this.isApp != null && this.isMySelf != null && this.isApp != undefined && this.isMySelf != undefined) {
            this.getTopWebsitesInformation();
        }
    }

    dashboardFilters: DashboardFilterModel;

    @Input("dashboardName")
    set _dashboardName(data: string) {
        if (data != null && data !== undefined) {
            this.dashboardName = data;
            if (this.dashboardName == 'My top websites') {
                this.isApp = false;
                this.isMySelf = true;
            }
            if (this.dashboardName == 'My top applications') {
                this.isApp = true;
                this.isMySelf = true;
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
    date: string = this.datePipe.transform(new Date(), 'yyyy-MM-dd')

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
    }

    getTopWebsitesInformation() {
        this.loading = true;
        let topSitesModel = new TopSitesModel();
        topSitesModel.isApp = this.isApp;
        topSitesModel.mySelf = this.isMySelf;
        topSitesModel.onDate = this.date;
        this.timeUsageService.getActivityData(topSitesModel).subscribe((responseData: any) => {
            if (responseData.success) {
                this.activityData = [];
                this.chartData = [];
                this.activityData = responseData.data;
                this.cdRef.detectChanges();
                if (this.activityData && this.activityData.length > 0) {
                    this.chartData.push({ category: 'Neutral', value: this.activityData[0].neutral });
                    this.chartData.push({ category: 'Productive', value: this.activityData[0].productive });
                    this.chartData.push({ category: 'Un Productive', value: this.activityData[0].unProductive });
                }
            }
            else {
                this.activityData = [];
                this.chartData = [];
            }
            this.loading = false;
            this.cdRef.detectChanges();
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
                    if ($(optionalParameters['gridsterViewSelector'] + ' .my-appsWeb-height').length > 0) {
                        var appHeight = $(optionalParameters['gridsterViewSelector']).height();
                        var contentHeight = appHeight - 45;
                        $(optionalParameters['gridsterViewSelector'] + ' .my-appsWeb-height').height(contentHeight);
                        clearInterval(interval);
                    }

                } catch (err) {
                    clearInterval(interval);
                }
            }, 1000);
        }
    }
}
