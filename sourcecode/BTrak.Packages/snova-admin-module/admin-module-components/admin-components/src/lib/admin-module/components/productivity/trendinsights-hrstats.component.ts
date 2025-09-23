import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { ProductivityService } from '../../services/productivity.service';
import { GetProductivityDetails } from '../../models/productivity-models/getProductivityDetails.models';
import { Router } from '@angular/router';
import { Productivityfilters } from '../../models/productivity-dashboard-filters.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductivityDrilldownComponent } from '../productivity/productivity-drilldown.component';
import { EfficiencyDrilldownComponent } from '../productivity/efficiency-drilldown.component';
import { UtilizationDrilldownComponent } from './utilization-drilldown.component';
import { ChartTheme, ILoadedEventArgs, IPointRenderEventArgs } from '@syncfusion/ej2-charts';
import { DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';



@Component({
  selector: 'app-trendinsights-hrstats',
  templateUrl: './trendinsights-hrstats.component.html',
  styleUrls: ['./trendinsights-hrstats.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class TrendinsightsHrstatsComponent implements OnInit {
  @Output() loadingComplete = new EventEmitter<boolean>();
  productivityDashboardFilter: DashboardFilterModel;
  filterApplied: any;
  productivityDetails: any;
  productivity: any;
  efficiency: any;
  utilization: any;
  rankTeam: any;
  rankOffice: any;
  predictability: any;
  quality: any;
  teamSize: any;
  officeSize: any;
  isAnyOprationInProgress: boolean = false;
  isTeamProductivityDashboard: boolean;
  isMyProductivityDashboard: boolean;
  isCompanyProductivityDashboard: boolean;
  isBranchProductivityDashboard: boolean;
  companySize: any;
  hrStats: any;
  noOfAbsences: any;
  noOfUnplannedAbsences: any;
  latemornings: any;
  longBreaks: any;
  latelunches: any;
  earlyfinishes: any;
  unProductivPercentage: any;
  idelPercentage: any;
  filterType: string = null;
  fromDate: any;
  toDate: any;
  lineManagerId: any = null;
  lineManagerFilter: any;
  filtervalues: Productivityfilters;
  productivityfilters: Productivityfilters;
  userId: any;
  branchId: any;
  //----
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
    majorGridLines: { width: 0.5 },
    intervalType: 'Days',
    edgeLabelPlacement: 'Shift'
  };
  public primaryYAxis: Object = {
    labelFormat: '{value}',
    lineStyle: { width: 0 },
    majorGridLines: { width: 0.5 },
    majorTickLines: { width: 0 },
    minorTickLines: { width: 0 }
  };

  public previousTarget = null;
  trendInsightsReport: any[];
  graphProductivity: any[];
  graphEfficiency: any[];
  graphUtilization: any[];
  graphPredictabulity: any[];
  graphTeamRank: any[];
  graphOfficeRank: any[];
  barChartData: any[];
  barGraphVisible: boolean = false;
  singleDate: string;
  isProductivityDetailsInProgress: boolean;
  isHrStatsInProgress: boolean;
  isTrendInsightsInProgress: boolean;
  allLoadCompleted: boolean = false;
  sampleData: Productivityfilters;
  loadActive: boolean;
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
    majorTickLines: { width: 0 }, lineStyle: { width: 0 }, labelStyle: { color: 'black' }
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
  public barMarker: Object = { dataLabel: { visible: true}};
  public radius: Object = { bottomLeft: 0, bottomRight: 0, topLeft: 10, topRight: 10 }
  //----

  @Input('filterValues')
  set filterValues(data: Productivityfilters) {
    this.productivityfilters = data;
    this.filtervalues = data;
    if (this.filtervalues != null) {
      this.fromDate = this.filtervalues.dateFrom;
      this.toDate = this.filtervalues.dateTo;
      this.lineManagerId = this.filtervalues.lineManagerId;
      this.filterType = this.filtervalues.filterType;
      this.userId = this.filtervalues.userId;
      this.branchId = this.filtervalues.branchId;
    }
    if (this.sampleData != data) {
      this.getProductivityDetails();
      this.getHrStats();
      this.getTrendInsightsReport();
      this.sampleData = data;
    }
  }

  @Input('loadingCompelete')
  set loadingCompelete(data: boolean) {
    this.allLoadCompleted = data;
  }


  constructor(private productivityService: ProductivityService, private datePipe: DatePipe, private cdRef: ChangeDetectorRef, private router: Router, public dialog: MatDialog) {
    this.tooltip = { enable: true, shared: true };
    this.crosshair = { enable: true, lineType: 'Vertical' };
    this.marker = { visible: true };
  }

  ngOnInit() {

    if (this.router.url.includes('productivity/dashboard/myproductivity')) {
      this.isMyProductivityDashboard = true;
      // this.isTeamProductivityDashboard = false;
      // this.isCompanyProductivityDashboard = false;
      // this.isBranchProductivityDashboard = false;
    }
    else if (this.router.url.includes('productivity/dashboard/myteamproductivity')) {
      // this.isMyProductivityDashboard = false;
      this.isTeamProductivityDashboard = true;
      // this.isCompanyProductivityDashboard = false;
      // this.isBranchProductivityDashboard = false;
    }
    else if (this.router.url.includes('productivity/dashboard/companyproductivity')) {
      // this.isMyProductivityDashboard = false;
      // this.isTeamProductivityDashboard = false;
      this.isCompanyProductivityDashboard = true;
      // this.isBranchProductivityDashboard = false;
    }
    else if (this.router.url.includes('productivity/dashboard/branchproductivity')) {
      // this.isMyProductivityDashboard = false;
      // this.isTeamProductivityDashboard = false;
      // this.isCompanyProductivityDashboard = false;
      this.isBranchProductivityDashboard = true;
    }
  }


  getProductivityDetails() {
    this.isProductivityDetailsInProgress = true;
    this.loadActive = false
    this.productivityDetails = [];
    var getProductivityDetailsInputModel = new GetProductivityDetails();
    getProductivityDetailsInputModel.dateFrom = this.fromDate;
    getProductivityDetailsInputModel.dateTo = this.toDate;
    getProductivityDetailsInputModel.filterType = this.filterType;
    getProductivityDetailsInputModel.rankbasedOn = "Time";
    getProductivityDetailsInputModel.lineManagerId = this.lineManagerId;
    getProductivityDetailsInputModel.branchId = this.branchId;
    getProductivityDetailsInputModel.userId = this.userId;
    this.productivityService.getProductivityDetails(getProductivityDetailsInputModel).subscribe((res: any) => {
      if (res.success === true && res.data != null) {
        this.loadActive = true;
        this.productivityDetails = res.data[0];
        this.productivity = this.productivityDetails.productivity;
        this.efficiency = this.productivityDetails.efficiency;
        this.utilization = this.productivityDetails.utilization;
        this.rankTeam = this.productivityDetails.teamRank;
        this.teamSize = this.productivityDetails.teamSize;
        this.rankOffice = this.productivityDetails.officeRank;
        this.officeSize = this.productivityDetails.officeSize;
        this.predictability = this.productivityDetails.predictability;
        this.quality = this.productivityDetails.quality;
        this.companySize = this.productivityDetails.companysize;
      }
      else {
        this.loadActive = true;
        this.productivity = 0;
        this.efficiency = 0;
        this.utilization = 0;
        this.rankTeam = 0;
        this.teamSize = 0;
        this.rankOffice = 0;
        this.officeSize = 0;
        this.predictability = 0;
        this.quality = '-';
        this.companySize = 0;
      }
      this.isProductivityDetailsInProgress = false;
      this.loadingCompleted();
      this.cdRef.detectChanges();
    });
  }

  getHrStats() {
    this.isHrStatsInProgress = true;
    this.loadActive = false;
    var getProductivityDetailsInputModel = new GetProductivityDetails();
    getProductivityDetailsInputModel.dateFrom = this.fromDate;
    getProductivityDetailsInputModel.dateTo = this.toDate;
    getProductivityDetailsInputModel.filterType = this.filterType;
    getProductivityDetailsInputModel.rankbasedOn = "Time";
    getProductivityDetailsInputModel.lineManagerId = this.lineManagerId;
    getProductivityDetailsInputModel.branchId = this.branchId;
    getProductivityDetailsInputModel.userId = this.userId;
    this.productivityService.getHrStats(getProductivityDetailsInputModel).subscribe((res: any) => {
      if (res.success === true && res.data != null) {
        this.loadActive = true;
        this.hrStats = res.data[0];
        this.noOfAbsences = this.hrStats.noOfAbsences;
        this.noOfUnplannedAbsences = this.hrStats.noOfUnplannedAbsences;
        this.latemornings = this.hrStats.latemornings;
        this.longBreaks = this.hrStats.longBreaks;
        this.latelunches = this.hrStats.latelunches;
        this.earlyfinishes = this.hrStats.earlyfinishes;
        this.unProductivPercentage = this.hrStats.unProductivPercentage;
        this.idelPercentage = this.hrStats.idelPercentage;
      }
      else {
        this.loadActive = true;
        this.noOfAbsences = 0;
        this.noOfUnplannedAbsences = 0;
        this.latemornings = 0;
        this.longBreaks = 0;
        this.latelunches = 0;
        this.earlyfinishes = 0;
        this.unProductivPercentage = 0;
        this.idelPercentage = 0;
      }
      this.isHrStatsInProgress = false;
      
      this.loadingCompleted();
      this.cdRef.detectChanges();
    });
  }

  getTrendInsightsReport() {
    this.isTrendInsightsInProgress = true;
    this.loadActive = false;
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
      if (response.success == true && response.data != null) {
        this.loadActive = true;
        this.trendInsightsReport = [];
        this.graphProductivity = [];
        this.graphEfficiency = [];
        this.graphUtilization = [];
        this.graphPredictabulity = [];
        this.graphTeamRank = [];
        this.graphOfficeRank = [];
        this.barChartData = [];
        this.trendInsightsReport = response.data;
        if (this.trendInsightsReport && this.trendInsightsReport.length > 1) {
          this.barGraphVisible = false;
          this.trendInsightsReport.forEach(obj => {
            this.graphProductivity.push({ x: new Date(obj.date), y: obj.productivity })
            this.graphEfficiency.push({ x: new Date(obj.date), y: obj.efficiency })
            this.graphUtilization.push({ x: new Date(obj.date), y: obj.utilization })
            this.graphPredictabulity.push({ x: new Date(obj.date), y: obj.predictabulity })
            this.graphTeamRank.push({ x: new Date(obj.date), y: obj.teamRank })
            this.graphOfficeRank.push({ x: new Date(obj.date), y: obj.officeRank })
          });
        }
        else if (this.trendInsightsReport && this.trendInsightsReport.length == 1) {
          this.barGraphVisible = true;
          if (this.filterType != "Individual") {
            this.trendInsightsReport.forEach(obj => {
              this.barChartData.push({ x: 'Productivity', y: obj.productivity },
                { x: 'Efficiency', y: obj.efficiency },
                { x: 'Utilization', y: obj.utilization },
                { x: 'Predictability', y: obj.predictabulity })
              this.singleDate = this.datePipe.transform(obj.date, 'dd-MM-yyyy');
            });
          }
          else {
            this.trendInsightsReport.forEach(obj => {
              this.barChartData.push({ x: 'Productivity', y: obj.productivity },
                { x: 'Efficiency', y: obj.efficiency },
                { x: 'Utilization', y: obj.utilization },
                { x: 'Predictability', y: obj.predictabulity },
                { x: 'Team Rank', y: obj.teamRank },
                { x: 'Office Rank', y: obj.officeRank })
              this.singleDate = this.datePipe.transform(obj.date, 'dd-MM-yyyy');
            });
          }
        }
      }
      this.isTrendInsightsInProgress = false;
      this.loadingCompleted();
      this.cdRef.detectChanges();
      this.cdRef.markForCheck();
    });
  }
  productivityDrilldown() {
    const dialogRef = this.dialog.open(ProductivityDrilldownComponent, {
      width: '90%',
      data: this.filtervalues
    });
  }

  efficiencyDrilldown() {
    const dialogRef = this.dialog.open(EfficiencyDrilldownComponent, {
      width: '90%',
      data: this.filtervalues
    });
  }

  utilizationDrilldown() {
    const dialogRef = this.dialog.open(UtilizationDrilldownComponent, {
      width: '60%',
      data: this.filtervalues
    });
  }
  loadingCompleted() {
    if (!this.isProductivityDetailsInProgress && !this.isHrStatsInProgress && !this.isTrendInsightsInProgress) {
      this.loadingComplete.emit(true);
    }
  }
}
