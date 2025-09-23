import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { orderBy, State } from "@progress/kendo-data-query";
import { ToastrService } from 'ngx-toastr';
import { ProductivityService } from '../../services/productivity.service';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { GetProductivityDetails } from '../../models/productivity-models/getProductivityDetails.models';
import { DatePipe } from '@angular/common';
import { animate } from '@angular/animations';



@Component({
  selector: 'lib-utilization-drilldown',
  templateUrl: './utilization-drilldown.component.html'
})
export class UtilizationDrilldownComponent implements OnInit {

  pipe = new DatePipe('en-US');
  utilizationDrilldownsData: any
  state: State = {
    skip: 0,
    take: 20
  };
  temp: any;
  filteredList: any[] = [];
  isAnyOperationIsInprogress = false;
  labelName: any;
  barchart: boolean = false;
  nodata: boolean = false;





  constructor(public dialogRef: MatDialogRef<UtilizationDrilldownComponent>, private productivityService: ProductivityService,
    private cdRef: ChangeDetectorRef, @Inject(MAT_DIALOG_DATA) public data: any, private toastr: ToastrService, public datepipe: DatePipe) {

  }


  // public barChartOptions:any = {
  //   scaleShowVerticalLines: false,
  //   responsive: true
  // };

  //   public barChartLabels:string[] = [];
  //   public chartLabels: string[] = [];
  //   public chartUsers: string[] = [];
  //   public barChartType:string = 'bar';
  //   public barChartLegend:boolean = true;
  //   public utilizationPercentageData: any[] = [];
  //   public barChartData:any[] = [];


  graphData: any[] = [];
  view: any[] = [];
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = false;
  yAxisLabel: string = 'Productivity Stats';
  showYAxisLabel: boolean = false;
  xAxisLabel: string = 'Percentages';
  showGridLines: boolean = true;
  showDataLabel: boolean = true;

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.getUtilizationDrillDown();
  }


  getUtilizationDrillDown() {
    this.isAnyOperationIsInprogress = true;
    var getProductivityDetailsInputModel = new GetProductivityDetails();
    getProductivityDetailsInputModel.dateFrom = this.data.dateFrom;
    getProductivityDetailsInputModel.dateTo = this.data.dateTo;
    getProductivityDetailsInputModel.filterType = this.data.filterType;
    getProductivityDetailsInputModel.rankbasedOn = "Time";
    getProductivityDetailsInputModel.lineManagerId = this.data.lineManagerId;
    getProductivityDetailsInputModel.branchId = this.data.branchId;
    getProductivityDetailsInputModel.userId = this.data.userId;
    this.productivityService.getUtilizationDrillDown(getProductivityDetailsInputModel).subscribe((res: any) => {
      if (res.success === true) {
        if (res.apiResponseMessages.length == 0) {
          this.utilizationDrilldownsData = res.data;
          if (this.data.filterType == 'Individual') {
            this.individualUtilizationGraph(this.utilizationDrilldownsData);
          }
          else if (this.data.filterType == 'Team' || this.data.filterType == 'Branch' || this.data.filterType == 'Company') {
            this.teamOrBranchOrCompanyUtilizationGraph(this.utilizationDrilldownsData);
          }

          if (this.utilizationDrilldownsData.length == 0) {
            this.nodata = true;
          }
          else {
            if (this.utilizationDrilldownsData.length == 1) {
              this.view = [200, 600];
            }
            else if (this.utilizationDrilldownsData.length == 2) {
              this.view = [300, 600];
            }
            else if (this.utilizationDrilldownsData.length == 3) {
              this.view = [400, 600];
            }
            else if (this.utilizationDrilldownsData.length == 4) {
              this.view = [500, 600];
            }
            else {
              this.view = [800, 600]
            }
          }

        }
        else {
          this.toastr.error(res.apiResponseMessages[0].message);
        }
      }
      this.isAnyOperationIsInprogress = false;
      this.cdRef.detectChanges();
    });
  }

  teamOrBranchOrCompanyUtilizationGraph(utilizationDrilldownsData) {
    for (var i = 0; i < utilizationDrilldownsData.length; i++) {
      var date = this.datepipe.transform(utilizationDrilldownsData[i].date, 'dd-MMM-yyyy');
      this.graphData.push({
        "name": date,
        "value": utilizationDrilldownsData[i].utilizationPercentage
      })
    }
    this.barchart = true;
  }

  individualUtilizationGraph(utilizationDrilldownsData) {    
    for (var i = 0; i < utilizationDrilldownsData.length; i++) {
      var date = this.datepipe.transform(utilizationDrilldownsData[i].date, 'dd-MMM-yyyy');
      this.graphData.push({
        "name": date,
        "value": utilizationDrilldownsData[i].utilizationPercentage
      })
    }
    this.barchart = true;
  }
}


