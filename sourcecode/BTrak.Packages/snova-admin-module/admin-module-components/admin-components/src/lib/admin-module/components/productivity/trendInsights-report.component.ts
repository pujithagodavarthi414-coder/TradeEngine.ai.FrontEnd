import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ILoadedEventArgs, ChartTheme, IPointRenderEventArgs } from '@syncfusion/ej2-charts';
import { GetProductivityDetails } from '../../models/productivity-models/getProductivityDetails.models';
import { ProductivityService } from '../../services/productivity.service';
import { Router } from '@angular/router';
import { Productivityfilters } from '../../models/productivity-dashboard-filters.model';


@Component({
  selector: 'app-trendinsights-reports-graph',
  templateUrl: 'trendInsights-report.component.html',
  styleUrls: ['./trendinsights-hrstats.component.css']
})

export class TrendinsightsReportsGraphComponent implements OnInit {
  //   datadummy: Object[]=[
  //     {
  //       "date": "2021-02-01T00:00:00",
  //       "productivity": 10.0,
  //       "efficiency": 8.0,
  //       "utilization": 20.0,
  //       "predictabulity": 50.0,
  //       "noOfBugscausedByUserSelf": 0,
  //       "teamRank": 1,
  //       "officeRank": 2
  //   },
  //   {
  //       "date": "2021-02-02T00:00:00",
  //       "productivity": 20.0,
  //       "efficiency": 50.0,
  //       "utilization": 60.0,
  //       "predictabulity": 0.0,
  //       "noOfBugscausedByUserSelf": 0,
  //       "teamRank": 2,
  //       "officeRank": 4
  //   },
  //   {
  //       "date": "2021-02-03T00:00:00",
  //       "productivity": 30.0,
  //       "efficiency": 40.0,
  //       "utilization": 52.0,
  //       "predictabulity": 42.0,
  //       "noOfBugscausedByUserSelf": 0,
  //       "teamRank": 2,
  //       "officeRank": 5
  //   },
  //   {
  //       "date": "2021-02-04T00:00:00",
  //       "productivity": 10.0,
  //       "efficiency": 56.0,
  //       "utilization": 46.0,
  //       "predictabulity": 51.0,
  //       "noOfBugscausedByUserSelf": 0,
  //       "teamRank": 5,
  //       "officeRank": 6
  //   },
  //   {
  //       "date": "2021-02-05T00:00:00",
  //       "productivity": 85.0,
  //       "efficiency": 68.0,
  //       "utilization": 49.0,
  //       "predictabulity": 56.0,
  //       "noOfBugscausedByUserSelf": 0,
  //       "teamRank": 2,
  //       "officeRank": 4
  //   },
  //   {
  //       "date": "2021-02-06T00:00:00",
  //       "productivity": 75.0,
  //       "efficiency": 85.0,
  //       "utilization": 74.0,
  //       "predictabulity": 81.0,
  //       "noOfBugscausedByUserSelf": 0,
  //       "teamRank": 1,
  //       "officeRank": 1
  //   },
  //   {
  //       "date": "2021-02-07T00:00:00",
  //       "productivity": 95.0,
  //       "efficiency": 86.0,
  //       "utilization": 79.0,
  //       "predictabulity": 86.0,
  //       "noOfBugscausedByUserSelf": 0,
  //       "teamRank": 1,
  //       "officeRank": 1
  //   },
  //   {
  //       "date": "2021-02-08T00:00:00",
  //       "productivity": 50.0,
  //       "efficiency": 70.0,
  //       "utilization": 60.0,
  //       "predictabulity": 80.0,
  //       "noOfBugscausedByUserSelf": 0,
  //       "teamRank": 1,
  //       "officeRank": 2
  //   },
  //   {
  //       "date": "2021-02-09T00:00:00",
  //       "productivity": 80.0,
  //       "efficiency": 60.0,
  //       "utilization": 70.0,
  //       "predictabulity": 90.0,
  //       "noOfBugscausedByUserSelf": 0,
  //       "teamRank": 10,
  //       "officeRank": 30
  //   },
  //   {
  //       "date": "2021-02-10T00:00:00",
  //       "productivity": 95.0,
  //       "efficiency": 86.0,
  //       "utilization": 79.0,
  //       "predictabulity": 86.0,
  //       "noOfBugscausedByUserSelf": 0,
  //       "teamRank": 1,
  //       "officeRank": 1
  //   }
  // ]
  tooltip: Object;
  crosshair: Object;
  public marker: Object;
  palette = ["#04fefe", "#33B2FF", "#36c2c4", "#ffd966", "#8E9AAA", "#ead1dd"];
  public title: string
  public chartArea: Object = {
    border: {
      width: 0
    }
  };
  public width: string = '100%';
  public primaryXAxis: Object = {
    valueType: 'DateTime',
    labelFormat: 'd/MMM',
    majorGridLines: { width: 0 },
    intervalType: 'Days',
    edgeLabelPlacement: 'Shift'
  };
  public primaryYAxis: Object = {
    labelFormat: '{value}',
    lineStyle: { width: 0 },
    majorTickLines: { width: 0 },
    minorTickLines: { width: 0 }
  };

  public previousTarget = null;
  trendInsightsReport: any[];
  Productivity: any[];
  Efficiency: any[];
  Utilization: any[];
  Predictabulity: any[];
  TeamRank: any[];
  OfficeRank: any[];
  barChartData: any = [];
  barGraphVisible: boolean;
  singleDate: string;
  lineManagerId: any = null;
  isMyProductivityDashboard: boolean = false;
  filterType: string;
  // isTeamProductivityDashboard: boolean;
  // isCompanyProductivityDashboard: boolean;
  // isBranchProductivityDashboard: boolean;
  filtervalues: Productivityfilters;
  fromDate: any;
  toDate: any;
  userId: any;
  branchId: any;
  isAnyOprationInProgress: boolean = false;

  public load(args: ILoadedEventArgs): void {
    let selectedTheme: string = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Material';
    args.chart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark");
  };
  public barChartXAxis: Object = {
    valueType: 'Category', interval: 1, majorGridLines: { width: 0 }, labelStyle: { color: 'black' }
  };
  public barChartYAxis: Object = {
    majorGridLines: { width: 0 },
    majorTickLines: { width: 0 }, lineStyle: { width: 0.3 }, labelStyle: { color: 'black' }
  };


  public pointRender(args: IPointRenderEventArgs): void {
    let materialColors: string[] = ["#04fefe", "#33B2FF", "#36c2c4", "#ffd966", "#8E9AAA", "#ead1dd"];
    let selectedTheme: string = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Material';
    args.fill = materialColors[args.point.index % 10];
  };
  public legend: Object = {
    visible: true
  }
  public barMarker: Object = { dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } };
  public radius: Object = { bottomLeft: 0, bottomRight: 0, topLeft: 10, topRight: 10 }
  constructor(private productivityService: ProductivityService, private datePipe: DatePipe, private cdRef: ChangeDetectorRef, private router: Router) {
    this.tooltip = { enable: true, shared: true };
    this.crosshair = { enable: true, lineType: 'Vertical' };
    this.marker = { visible: true };
  }

  @Input('filterValues')
  set filterValues(data: Productivityfilters) {
    this.filtervalues = data;
    if (this.filtervalues != null) {
      this.fromDate = this.filtervalues.dateFrom;
      this.toDate = this.filtervalues.dateTo;
      this.lineManagerId = this.filtervalues.lineManagerId;
      this.filterType = this.filtervalues.filterType;
      this.userId = this.filtervalues.userId;
      this.branchId = this.filtervalues.branchId;
    }
    this.getTrendInsightsReport();
  }

  ngOnInit() {
    if (this.router.url.includes('productivity/dashboard/myproductivity')) {
      this.isMyProductivityDashboard = true;
    }
    // else if (this.router.url.includes('productivity/dashboard/myteamproductivity')) {
    //   this.isTeamProductivityDashboard = true;      
    // }
    // else if (this.router.url.includes('productivity/dashboard/companyproductivity')) {     
    //   this.isCompanyProductivityDashboard = true;      
    // }
    // else if (this.router.url.includes('productivity/dashboard/branchproductivity')) {
    //   this.isBranchProductivityDashboard = true;
    // }        
  }

  getTrendInsightsReport() {
    this.isAnyOprationInProgress = true;
    var getProductivityDetails = new GetProductivityDetails();
    getProductivityDetails.dateFrom = this.fromDate;
    getProductivityDetails.date = null;
    getProductivityDetails.dateTo = this.toDate;
    getProductivityDetails.branchId = this.branchId;
    getProductivityDetails.filterType = this.filterType;
    getProductivityDetails.lineManagerId = this.lineManagerId;
    getProductivityDetails.rankbasedOn = "Time";
    getProductivityDetails.userId = this.userId;
    this.productivityService.getTrendInsightsReport(getProductivityDetails).subscribe((response: any) => {
      if (response.success == true) {
        this.isAnyOprationInProgress = false;
        this.trendInsightsReport = [];
        this.Productivity = [];
        this.Efficiency = [];
        this.Utilization = [];
        this.Predictabulity = [];
        this.TeamRank = [];
        this.OfficeRank = [];
        this.barChartData = [];
        this.trendInsightsReport = response.data;
        if (this.trendInsightsReport && this.trendInsightsReport.length > 1) {
          this.barGraphVisible = false;
          this.trendInsightsReport.forEach(obj => {
            this.Productivity.push({ x: new Date(obj.date), y: obj.productivity })
            this.Efficiency.push({ x: new Date(obj.date), y: obj.efficiency })
            this.Utilization.push({ x: new Date(obj.date), y: obj.utilization })
            this.Predictabulity.push({ x: new Date(obj.date), y: obj.predictabulity })
            this.TeamRank.push({ x: new Date(obj.date), y: obj.teamRank })
            this.OfficeRank.push({ x: new Date(obj.date), y: obj.officeRank })
          });
        }
        else if (this.trendInsightsReport && this.trendInsightsReport.length == 1) {
          this.barGraphVisible = true;
          if (this.filterType != "Individual") {
            this.trendInsightsReport.forEach(obj => {
              this.barChartData.push({ x: 'Productivity', y: obj.productivity },
                { x: 'Efficiency', y: obj.efficiency },
                { x: 'Utilization', y: obj.utilization },
                { x: 'Predictabulity', y: obj.predictabulity })
              this.singleDate = this.datePipe.transform(obj.date, 'dd-MM-yyyy');
            });
          }
          else {
            this.trendInsightsReport.forEach(obj => {
              this.barChartData.push({ x: 'Productivity', y: obj.productivity },
                { x: 'Efficiency', y: obj.efficiency },
                { x: 'Utilization', y: obj.utilization },
                { x: 'Predictabulity', y: obj.predictabulity },
                { x: 'Team Rank', y: obj.teamRank },
                { x: 'Office Rank', y: obj.officeRank })
              this.singleDate = this.datePipe.transform(obj.date, 'dd-MM-yyyy');
            });
          }
        }
        this.cdRef.detectChanges();
        this.cdRef.markForCheck();
      }
    });
  }
}
