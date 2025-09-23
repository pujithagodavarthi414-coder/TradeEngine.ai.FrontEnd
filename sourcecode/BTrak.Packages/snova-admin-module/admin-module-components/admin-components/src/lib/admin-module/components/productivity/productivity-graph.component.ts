import { ContentObserver } from '@angular/cdk/observers';
import { Component, Input, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Browser } from '@syncfusion/ej2-base';
import { ChartTheme, ILoadedEventArgs } from '@syncfusion/ej2-charts';
import { GetProductivityDetails } from '../../models/productivity-models/getProductivityDetails.models';
import { ProductivityQualitystatsComponent } from './productivity-qualitystats.component';
import { ProductivityService } from '../../services/productivity.service';
import { Productivityfilters } from '../../models/productivity-dashboard-filters.model';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';




@Component({
  selector: 'app-productivity-graph',
  templateUrl: './productivity-graph.component.html',
  styleUrls: ['./productivity-graph.component.css']
})
export class ProductivityGraphComponent implements OnInit {
  capacityHours: any = null;
  deliveredHours: any = null;
  plannedHours: any = null;
  spentHours: any = null;
  productivityStats: any;
  productivityAndQualityStats: any;
  totalSpentHours: any = null;
  filterType: any = null;
  lineManagerId: any;
  filtervalues: Productivityfilters;
  fromDate: any;
  toDate: any;
  isMyProductivityDashboard: boolean;
  isTeamProductivityDashboard: boolean;
  isCompanyProductivityDashboard: boolean;
  isBranchProductivityDashboard: boolean;
  isAnyOprationInProgress: boolean = false;
  userId: any;
  branchId: any;

  graphData: any[] = [];
  view: any[] = [900, 200];
  showXAxis: boolean = false;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = false;
  yAxisLabel: string = 'Productivity Stats';
  showYAxisLabel: boolean = false;
  xAxisLabel: string = 'Percentages';
  showGridLines: boolean = false;
  showDataLabel: boolean = true;

  colorScheme = {
    domain: ['rgb(241, 80, 21)', 'rgb(87, 21, 241)', 'rgb(21, 180, 119)', 'rgb(44, 173, 212)']
  };


  @Input('filterValues')
  set filterValues(data: Productivityfilters) {
    this.filtervalues = data;
    if (this.filtervalues != null) {
      this.fromDate = this.filtervalues.dateFrom;
      this.toDate = this.filtervalues.dateTo;
      this.lineManagerId = this.filtervalues.lineManagerId;
      this.userId = this.filtervalues.userId;
      this.branchId = this.filtervalues.branchId;
      this.filterType = this.filtervalues.filterType;
    }
    this.getProductivityandQualityStats();
  }


  constructor(private productivityService: ProductivityService, private cdRef: ChangeDetectorRef, private router: Router,
    private translateService: TranslateService) {
  }

  ngOnInit() {

    if (this.router.url.includes('productivity/dashboard/myproductivity')) {
      this.isMyProductivityDashboard = true;
    }
    else if (this.router.url.includes('productivity/dashboard/myteamproductivity')) {
      this.isTeamProductivityDashboard = true;
    }
    else if (this.router.url.includes('productivity/dashboard/companyproductivity')) {
      this.isCompanyProductivityDashboard = true;
    }
    else if (this.router.url.includes('productivity/dashboard/branchproductivity')) {
      this.isBranchProductivityDashboard = true;
    }
  }

  getProductivityandQualityStats() {
    this.isAnyOprationInProgress = true;
    var getProductivityDetailsInputModel = new GetProductivityDetails();
    getProductivityDetailsInputModel.dateFrom = this.fromDate;
    getProductivityDetailsInputModel.dateTo = this.toDate;
    getProductivityDetailsInputModel.filterType = this.filterType;
    getProductivityDetailsInputModel.rankbasedOn = "Time";
    getProductivityDetailsInputModel.lineManagerId = this.lineManagerId;
    getProductivityDetailsInputModel.branchId = this.branchId;
    getProductivityDetailsInputModel.userId = this.userId;
    this.productivityService.getProductivityandQualityStats(getProductivityDetailsInputModel).subscribe((res: any) => {
      if (res.success === true) {
        this.productivityAndQualityStats = res.data[0];
        this.capacityHours = this.productivityAndQualityStats.capacityHours;
        this.plannedHours = this.gethours(this.productivityAndQualityStats.plannedHours);
        this.deliveredHours = this.gethours(this.productivityAndQualityStats.deliveredHours);
        this.spentHours = this.gethours(this.productivityAndQualityStats.spentHoursInMIn);

        this.graphData = [
          {
            "name": this.translateService.instant("PRODUCTIVITY.CAPACITYHOURS"),
            "value": this.capacityHours
          },
          {
            "name": this.translateService.instant("PRODUCTIVITY.PLANNEDHOURS"),
            "value": this.plannedHours
          },
          {
            "name": this.translateService.instant("PRODUCTIVITY.DELIVEREDHOURS"),
            "value": this.deliveredHours
          },
          {
            "name": this.translateService.instant("PRODUCTIVITY.SPENTHOURS"),
            "value": this.spentHours
          }
        ]
      }
      this.isAnyOprationInProgress = false;
      this.cdRef.detectChanges();
    });
  }

  gethours(mins: number) {
    if (mins != null) {
      var hours = Math.floor(mins / 60);
      var minutes = Math.round(((mins % 60) * 10) / 60);
      var h = hours + '.' + minutes;
      return Number(h);
    }
    else {
      return 0;
    }
  }
  gethoursandmin(hoursandmin: number) {
    if (hoursandmin != null) {
      var mins = hoursandmin*60
      var hours = Math.floor(mins / 60).toString();
      var minutes = (mins % 60).toString();
      if (hours == '0' && minutes == '0') {
        return '0h'
      }
      else if (hours == '0' && minutes != '0') {
        return minutes + 'min'
      }
      else if (hours != '0' && minutes == '0') {
        return hours + 'h'
      }
      else {
        return hours + 'h ' + minutes + 'min'
      }
    }
  }
}
