import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { GetProductivityDetails } from '../../models/productivity-models/getProductivityDetails.models';
import { ProductivityService } from '../../services/productivity.service';
import { orderBy, State } from "@progress/kendo-data-query";



@Component({
  selector: 'replans-drilldown',
  templateUrl: 'replans-drilldown.component.html',
  styleUrls: ['./productivity-drilldown.component.css']
})
export class ReplansDrilldownComponent implements OnInit {

  ReplansDrilldownData: GridDataResult = {
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




  constructor(public dialogRef: MatDialogRef<ReplansDrilldownComponent>, private productivityService: ProductivityService,
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
    this.getReplansDrilldownData();
  }

  getReplansDrilldownData() {
    this.state.skip = 0;
    this.state.take = 15;
    this.isAnyOperationIsInprogress = true;
    var getReplansInputModel = new GetProductivityDetails();
    getReplansInputModel.dateFrom = this.data.dateFrom;
    getReplansInputModel.dateTo = this.data.dateTo;
    getReplansInputModel.filterType = this.data.filterType;
    getReplansInputModel.rankbasedOn = "Time";
    getReplansInputModel.lineManagerId = this.data.lineManagerId;
    getReplansInputModel.branchId = this.data.branchId;
    getReplansInputModel.userId = this.data.userId;
    this.productivityService.getReplansDrillDown(getReplansInputModel).subscribe((res: any) => {
      if (res.success === true) {
        this.temp = res.data;
        this.filteredList = res.data;
        if (this.temp != null) {
          this.ReplansDrilldownData = {
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
    this.ReplansDrilldownData = {
      data: inductionsList.slice(this.state.skip, this.state.take + this.state.skip),
      total: this.filteredList.length
    }
  }

  gethours(mins: number) {
    if (mins != null) {
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
