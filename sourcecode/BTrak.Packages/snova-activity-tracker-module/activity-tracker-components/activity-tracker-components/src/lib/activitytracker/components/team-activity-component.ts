import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { AccumulationChartComponent } from "@syncfusion/ej2-angular-charts";
import { Browser } from "@syncfusion/ej2-base";
import { AccumulationChart, ChartTheme, IAccTextRenderEventArgs, ILoadedEventArgs, IPointRenderEventArgs } from "@syncfusion/ej2-charts";
import { CustomAppBaseComponent } from "../../globaldependencies/components/componentbase";
import { TopSitesModel } from "../models/top-sites.model";
import { MinHourFilterPipe } from "../pipes/minHrCoversion.pipe";
import { ActivityTrackerService } from "../services/activitytracker-services";

@Component({
    selector: "app-component-tracker-team-activity",
    templateUrl: "team-activity-component.html",
})

export class TeamActivityComponent extends CustomAppBaseComponent implements OnInit {

    @Input("webAppUsageSearch")
    set _webAppUsageSearch(data: any) {
        if (data) {
            this.dateFrom = data.dateFrom;
            this.dateTo = data.dateTo;
            this.branchId = data.branchId;
            this.userId = data.userId;
            this.roleId = data.roleId;
            this.getTeamActivity();
        }
    }

    @ViewChild('pie')
    public pie: AccumulationChartComponent | AccumulationChart;

    loading: boolean;
    date: Date = new Date();
    teamActivityData: TopSitesModel[];
    productiveData: any = [];
    unProductiveData: any = [];
    neutralData: any = [];
    palette = ["#5DCBC8", "#27c26c", "#ffa500", "#8E9AAA"];
    barChart: boolean = false;
    public placement: boolean = false;
    totalData: any = [];
    idleData: any = [];
    areaChart: boolean = true;
    height: string = "347px";
    public radius: Object = { topLeft: 10, topRight: 10 }
    dateFrom: any;
    dateTo: any;
    branchId: string[];
    userId: string[];
    roleId: string[];
    productiveTotal: any = 0;
    unProductiveTotal: any = 0;
    neutralTotal: any = 0;
    deskTime: any = [];
    public width: string = '100%';
    donutData: any = [];
    public startAngle: number = 0;
    public endAngle: number = 360;
    totalCount: number = 0;


    constructor(private timeUsageService: ActivityTrackerService, private cdRef: ChangeDetectorRef, private datePipe: DatePipe,private activityTimeFilter: MinHourFilterPipe,
        public translateService: TranslateService) {
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

    public barMarker: Object = { dataLabel: { visible: true,name: 'text', position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } };

    public tooltip: Object = {
        enable: true,
        format: '${point.x} : ${point.text}',
    };

    public legendSettings: Object = {
        visible: true,
        toggleVisibility: false,
        position: 'Right',
        height: '28%',
        width: '44%'
    };

    public donutTooltip: Object = {
        enable: false
    };

    public onTextRender(args: IAccTextRenderEventArgs): void {
        args.series.dataLabel.font.size = this.getFontSize(this.pie.initialClipRect.width);
        args.text = args.text;
    }

    public dataLabel: Object = {
        visible: false, position: 'Inside',
        name: 'text',
        font: {
            color: 'black',
            size: '14px'
        }
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
        //topSitesModel.onDate = this.datePipe.transform(this.date, 'yyyy-MM-dd');
        topSitesModel.dateFrom = this.dateFrom;
        topSitesModel.dateTo = this.dateTo;
        topSitesModel.branchId = this.branchId;
        topSitesModel.userId = this.userId;
        topSitesModel.roleId = this.roleId;
        topSitesModel.isForSummary = true;
        this.timeUsageService.getTeamActivity(topSitesModel).subscribe((responseData: any) => {
            if (responseData.success) {
                this.teamActivityData = [];
                this.teamActivityData = responseData.data;
                this.productiveData = [];
                this.unProductiveData = [];
                this.neutralData = [];
                this.idleData = [];
                this.totalData = [];
                this.deskTime = [];
                this.productiveTotal = 0;
                this.unProductiveTotal = 0;
                this.neutralTotal = 0;
                this.donutData = [];
                this.totalCount = 0
                if (this.teamActivityData && this.teamActivityData.length > 0) {
                    this.teamActivityData.forEach((element) => {
                        this.productiveTotal = this.productiveTotal + parseFloat(element.productiveInSec);
                        this.unProductiveTotal = this.unProductiveTotal + parseFloat(element.unProductiveInSec);
                        this.neutralTotal = this.neutralTotal + parseFloat(element.neutralInSec);
                    })
                    this.productiveData.push({ x: this.translateService.instant('SUMMARYPAGE.PRODUCTIVETIME'), y: this.productiveTotal, text: this.activityTimeFilter.transform(this.productiveTotal) });
                    this.unProductiveData.push({ x: this.translateService.instant('SUMMARYPAGE.UNPRODUCTIVETIME'), y: this.unProductiveTotal, text: this.activityTimeFilter.transform(this.unProductiveTotal) });
                    this.neutralData.push({ x: this.translateService.instant('SUMMARYPAGE.NEUTRALTIME'), y: this.neutralTotal, text: this.activityTimeFilter.transform(this.neutralTotal) });
                    let total = this.productiveTotal + this.unProductiveTotal + this.neutralTotal;
                    this.deskTime.push({ x: this.translateService.instant('SUMMARYPAGE.DESKTIME'), y: this.productiveTotal + this.unProductiveTotal + this.neutralTotal, text: this.activityTimeFilter.transform(total) });

                    this.donutData.push(
                        { x: this.translateService.instant('SUMMARYPAGE.DESKTIME') + ' ' + this.activityTimeFilter.transform(total).toString(), y: this.productiveTotal + this.unProductiveTotal + this.neutralTotal, text: this.activityTimeFilter.transform(total) },
                        { x: this.translateService.instant('SUMMARYPAGE.PRODUCTIVETIME') + ' '  + this.activityTimeFilter.transform(this.productiveTotal).toString(), y: this.productiveTotal, text: this.activityTimeFilter.transform(this.productiveTotal) },
                        { x: this.translateService.instant('SUMMARYPAGE.UNPRODUCTIVETIME') + ' '  + this.activityTimeFilter.transform(this.unProductiveTotal).toString(), y: this.unProductiveTotal, text: this.activityTimeFilter.transform(this.unProductiveTotal) },
                        { x: this.translateService.instant('SUMMARYPAGE.NEUTRALTIME') + ' '  + this.activityTimeFilter.transform(this.neutralTotal).toString(), y: this.neutralTotal, text: this.activityTimeFilter.transform(this.neutralTotal) },
                    )

                    if (this.productiveTotal == 0 && this.unProductiveTotal == 0 && this.neutralTotal == 0) {
                        this.totalCount = 0;
                    }
                    else {
                        this.totalCount = 1;
                    }
                }
                this.loading = false;
            }
            else {
                this.teamActivityData = [];
                this.loading = false;
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

    public getFontSize(width: number): string {
        if (width > 300) {
            return '13px';
        } else if (width > 250) {
            return '8px';
        } else {
            return '6px';
        }
    };
}