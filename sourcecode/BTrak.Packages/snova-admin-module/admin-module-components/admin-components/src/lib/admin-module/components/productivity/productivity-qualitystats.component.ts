import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { GetProductivityDetails } from '../../models/productivity-models/getProductivityDetails.models';
import { ProductivityService } from '../../services/productivity.service';
import { Router } from '@angular/router';
import { Productivityfilters } from '../../models/productivity-dashboard-filters.model';
import { MatDialog } from '@angular/material/dialog';
import { CompletedTasksDrilldownComponent } from './completetedtasks-drilldown.component';
import { NoOfBugsDrilldownComponent } from './noOfBugs-drilldown.component';
import { PlannedHoursDrilldownComponent } from './planned-hours-drilldown.component';
import { DeliveredHoursDrilldownComponent } from './delivered-hours-drilldown.component';
import { SpentHoursDrilldownComponent } from './spent-hours-drilldown.component';
import { PendingTasksDrilldownComponent } from './pendingtasks-drilldown.component';
import { BounceBacksDrilldownComponent } from './bouncebacks-drilldown.component';
import { ReplansDrilldownComponent } from './replans-drilldown.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-productivity-qualitystats',
  templateUrl: './productivity-qualitystats.component.html',
  styleUrls: ['./productivity-qualitystats.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductivityQualitystatsComponent implements OnInit {
  @Output() loadingComplete = new EventEmitter<boolean>();
  isAnyOprationInProgress: boolean = false;
  productivityAndQualityStats: any;
  capacityHours: any;
  plannedHours: any;
  deliveredHours: any;
  totalSpentHours: any;
  completedTasks: any;
  pendingTasks: any;
  noOfBugs: any;
  noOfbouncebacks: any;
  othersTimeInMIn: any;
  p0Bugs: any;
  totalOthersTime: any;
  bugs: any;
  replanedTasks: any;
  isMyProductivityDashboard: boolean;
  isTeamProductivityDashboard: boolean;
  isCompanyProductivityDashboard: boolean;
  isBranchProductivityDashboard: boolean;
  filterType: any;
  lineManagerId: any;
  filtervalues: Productivityfilters;
  fromDate: any;
  toDate: any;
  userId: any;
  branchId: any;
  allLoadCompleted: boolean = false;
  sampleData: Productivityfilters;
  loadActive: boolean;

  constructor(private productivityService: ProductivityService, private cdRef: ChangeDetectorRef, private router: Router, public dialog: MatDialog) { }
  @Input('loadingCompelete')
  set loadingCompelete(data: boolean) {
    this.allLoadCompleted = data;
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
    if (this.sampleData != data) {
      this.getProductivityandQualityStats();
      this.sampleData = data;
    }
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

  plannedHoursDrilldown() {
    const dialogRef = this.dialog.open(PlannedHoursDrilldownComponent, {
      width: '90%',
      data: this.filtervalues
    });
  }

  deliveredHoursDrilldown() {
    const dialogRef = this.dialog.open(DeliveredHoursDrilldownComponent, {
      width: '90%',
      data: this.filtervalues
    });
  }

  spentHoursDrilldown() {
    const dialogRef = this.dialog.open(SpentHoursDrilldownComponent, {
      width: '90%',
      data: this.filtervalues
    });
  }

  getProductivityandQualityStats() {
    this.isAnyOprationInProgress = true;
    this.loadActive = false;
    var getProductivityDetailsInputModel = new GetProductivityDetails();
    getProductivityDetailsInputModel.dateFrom = this.fromDate;
    getProductivityDetailsInputModel.dateTo = this.toDate;
    getProductivityDetailsInputModel.filterType = this.filterType;
    getProductivityDetailsInputModel.rankbasedOn = "Time";
    getProductivityDetailsInputModel.lineManagerId = this.lineManagerId;
    getProductivityDetailsInputModel.branchId = this.branchId;
    getProductivityDetailsInputModel.userId = this.userId;
    this.productivityService.getProductivityandQualityStats(getProductivityDetailsInputModel).subscribe((res: any) => {
      if (res.success === true && res.data != null) {
        this.loadActive = true;
        this.productivityAndQualityStats = res.data[0];
        this.capacityHours = this.productivityAndQualityStats.capacityHours;
        this.plannedHours = this.gethours(this.productivityAndQualityStats.plannedHours);
        this.deliveredHours = this.gethours(this.productivityAndQualityStats.deliveredHours);
        this.totalSpentHours = this.gethours(this.productivityAndQualityStats.spentHoursInMIn);
        this.completedTasks = this.productivityAndQualityStats.completedTasks;
        this.pendingTasks = this.productivityAndQualityStats.pendingTasks;
        this.noOfBugs = this.productivityAndQualityStats.noOfBugs;
        this.noOfbouncebacks = this.productivityAndQualityStats.noOfbouncebacks;
        this.replanedTasks = this.productivityAndQualityStats.replanedTasks;
        this.totalOthersTime = this.gethours(this.productivityAndQualityStats.othersTimeInMIn);
        this.p0Bugs = this.productivityAndQualityStats.p0Bugs;
        this.bugs = this.productivityAndQualityStats.p0Bugs + '/' + this.productivityAndQualityStats.p1Bugs + '/'
          + this.productivityAndQualityStats.p2Bugs + '/' + this.productivityAndQualityStats.p3Bugs
      }
      else {
        this.loadActive = true;
        this.capacityHours = 0;
        this.plannedHours = 0;
        this.deliveredHours = this.gethours(0);
        this.totalSpentHours = this.gethours(0);
        this.completedTasks = 0;
        this.pendingTasks = 0;
        this.noOfBugs = 0;
        this.noOfbouncebacks = 0;
        this.replanedTasks = 0;
        this.totalOthersTime = this.gethours(0);
        this.p0Bugs = 0;
        this.bugs = '0/0/0/0';
      }
      this.isAnyOprationInProgress = false;
      this.loadingComplete.emit(true);
      this.cdRef.detectChanges();
    });
  }
  completedTasksDrilldown() {
    const dialogRef = this.dialog.open(CompletedTasksDrilldownComponent, {
      width: '90%',
      data: this.filtervalues
    });
  }
  noOfBugsDrilldown() {
    const dialogRef = this.dialog.open(NoOfBugsDrilldownComponent, {
      width: '90%',
      data: this.filtervalues
    });
  }
  pendingTasksDrilldown() {
    const dialogRef = this.dialog.open(PendingTasksDrilldownComponent, {
      width: '90%',
      data: this.filtervalues
    });
  }
  noOfBounceBacksDrilldown() {
    const dialogRef = this.dialog.open(BounceBacksDrilldownComponent, {
      width: '90%',
      data: this.filtervalues
    });
  }
  noOfReplansDrilldown() {
    const dialogRef = this.dialog.open(ReplansDrilldownComponent, {
      width: '90%',
      data: this.filtervalues
    });
  }
  gethours(mins: number) {
    if (mins != null) {
      var hours = Math.floor(mins / 60).toString();
      var minutes = Math.round((mins % 60)).toString();
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
    else {
      return '0h'
    }
  }
}
