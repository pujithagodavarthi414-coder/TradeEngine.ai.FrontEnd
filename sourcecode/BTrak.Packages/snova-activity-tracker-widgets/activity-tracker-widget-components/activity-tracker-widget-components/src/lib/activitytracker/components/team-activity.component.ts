import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { Browser } from "@syncfusion/ej2-base";
import { ChartTheme, ILoadedEventArgs, IPointRenderEventArgs } from "@syncfusion/ej2-charts";
import { CustomAppBaseComponent } from "../../globaldependencies/components/componentbase";
import { DashboardFilterModel } from "../models/dashboardFilterModel";
import { TopSitesModel } from "../models/top-sites.model";
import { ActivityTrackerService } from "../services/activitytracker-services";

@Component({
    selector: "app-component-team-activity",
    templateUrl: "team-activity.component.html",
})

export class TeamActivityComponent extends CustomAppBaseComponent implements OnInit {

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        this.dashboardFilters = data;
        this.date = this.dashboardFilters.date ? this.dashboardFilters.date : this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        this.getTeamActivity();
    }

    dashboardFilters: DashboardFilterModel;
    loading: boolean;
    date: string;
    teamActivityData: TopSitesModel[];
    productiveData: any = [];
    unProductiveData: any = [];
    neutralData: any = [];
    palette = ["#5DCBC8", "#FF8993", "#8E9AAA"];
    barChart: boolean = true;
    public placement: boolean = false;
    totalData: any = [];
    idleData: any = [];
    areaChart: boolean = false;

    constructor(private timeUsageService: ActivityTrackerService, private cdRef: ChangeDetectorRef, private datePipe: DatePipe) {
        super();

    }

    ngOnInit() {
        super.ngOnInit();
    }

    public chartArea: Object = {
        border: {
            width: 0
        }
    };

    public primaryXAxis: Object = {
        valueType: 'Category',
        majorGridLines: { width: 0 },
        edgeLabelPlacement: 'Shift'
    };

    public primaryYAxis: Object = {
        title: 'Hours',
        labelFormat: '{value}h',
        lineStyle: { width: 0 },
        majorTickLines: { width: 0 },
        minorTickLines: { width: 0 }
    };

    public barChartXAxis: Object = {
        valueType: 'Category', interval: 1, majorGridLines: { width: 0 }
    };

    public barChartYAxis: Object = {
        labelFormat: '{value}h',
        majorGridLines: { width: 0 },
        majorTickLines: { width: 0 }, lineStyle: { width: 0 }, labelStyle: { color: 'transparent' }
    };

    public marker: Object = {
        visible: true
    };

    public barMarker: Object = { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } };

    public tooltip: Object = {
        enable: true,
        format: '${point.x} : ${point.y}h',
    };

    public areaTooltip: Object = {
        enable: true
    };

    public load(args: ILoadedEventArgs): void {
        let selectedTheme: string = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Material';
        args.chart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark");
    };

    pointRender(args: IPointRenderEventArgs): void {
        let materialColors: string[] = ['#00bdae', '#fe5722', '#8bc24a', '#357cd2', '#70ad47', '#e56590', '#f8b883', '#dd8abd', '#fec107', '#7bb4eb'];
        args.fill = materialColors[args.point.index % 10];
    };

    getTeamActivity() {
        this.loading = true;
        let topSitesModel = new TopSitesModel();
        topSitesModel.onDate = this.date;
        this.teamActivityData = null;
        this.timeUsageService.getTeamActivity(topSitesModel).subscribe((responseData: any) => {
            if (responseData.success) {
                this.teamActivityData = [];
                this.productiveData = [];
                this.unProductiveData = [];
                this.totalData = [];
                this.neutralData = [];
                this.idleData = [];
                this.teamActivityData = responseData.data;
                if (this.teamActivityData && this.teamActivityData.length > 0) {
                    this.teamActivityData.forEach((element) => {
                        this.productiveData.push({ x: element.userName, y: parseFloat(element.productive) });
                        this.unProductiveData.push({ x: element.userName, y: parseFloat(element.unProductive) });
                        this.neutralData.push({ x: element.userName, y: parseFloat(element.neutral) });
                        this.idleData.push({ x: element.userName, y: parseFloat(element.idleTime) });
                        this.totalData.push({ x: element.userName, y: element.totalTime, text: 'Total ' + element.totalTime + 'h' });
                    })
                }
                this.loading = false;
                this.cdRef.detectChanges();
            }
            else {
                this.teamActivityData = [];
                this.loading = false;
                this.cdRef.detectChanges();
            }
        });
    }

    refresh() {
        this.getTeamActivity();
    }

    switchToAreaChart() {
        this.areaChart = true;
        this.barChart = false;
    }

    switchToBarChart() {
        this.areaChart = false;
        this.barChart = true;
    }
}