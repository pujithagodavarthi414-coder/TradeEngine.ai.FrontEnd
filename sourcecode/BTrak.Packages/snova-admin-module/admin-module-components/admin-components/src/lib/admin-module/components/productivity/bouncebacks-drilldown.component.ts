import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { GetProductivityDetails } from '../../models/productivity-models/getProductivityDetails.models';
import { ProductivityService } from '../../services/productivity.service';
import { orderBy, State } from "@progress/kendo-data-query";



@Component({
  selector: 'bouncebacks-drilldown',
  templateUrl: 'bouncebacks-drilldown.component.html',
  styleUrls: ['./productivity-drilldown.component.css']
})
export class BounceBacksDrilldownComponent implements OnInit {

  BounceBacksDrilldownData: GridDataResult = {
    data: [],
    total: 0
  };
  state: State = {
    skip: 0,
    take: 15
  };
  temp: any;
  filteredList: any[] = [];
  isAnyOperationIsInprogress = false;
  OwnerNameVisible: boolean = true;




  constructor(public dialogRef: MatDialogRef<BounceBacksDrilldownComponent>, private productivityService: ProductivityService,
    private cdRef: ChangeDetectorRef, @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    if (this.data.filterType == 'Individual') {
      this.OwnerNameVisible = false;
    }
    else {
      this.OwnerNameVisible = true;
    }
    this.getBounceBacksDrilldownData();
  }

  getBounceBacksDrilldownData() {
    this.state.skip = 0;
    this.state.take = 15;
    this.isAnyOperationIsInprogress = true;
    var getBounceBacksInputModel = new GetProductivityDetails();
    getBounceBacksInputModel.dateFrom = this.data.dateFrom;
    getBounceBacksInputModel.dateTo = this.data.dateTo;
    getBounceBacksInputModel.filterType = this.data.filterType;
    getBounceBacksInputModel.rankbasedOn = "Time";
    getBounceBacksInputModel.lineManagerId = this.data.lineManagerId;
    getBounceBacksInputModel.branchId = this.data.branchId;
    getBounceBacksInputModel.userId = this.data.userId;
    this.productivityService.getBounceBacksDrillDown(getBounceBacksInputModel).subscribe((res: any) => {
      if (res.success === true) {
        this.temp = res.data;
        this.filteredList = res.data;
        if (this.temp != null) {
          this.BounceBacksDrilldownData = {
            data: this.temp.slice(this.state.skip, this.state.take + this.state.skip),
            total: this.temp.length
          };
        }
      }
      this.cdRef.detectChanges();
      this.isAnyOperationIsInprogress = false;
    });
  }

  dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    let inductionsList = this.filteredList;
    if (this.state.sort) {
      inductionsList = orderBy(this.filteredList, this.state.sort);
    }
    this.BounceBacksDrilldownData = {
      data: inductionsList.slice(this.state.skip, this.state.take + this.state.skip),
      total: this.filteredList.length
    }
  }

  getHours(mins: number) {
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
