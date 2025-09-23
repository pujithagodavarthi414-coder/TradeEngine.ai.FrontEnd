import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { GetProductivityDetails } from '../../models/productivity-models/getProductivityDetails.models';
import { ProductivityService } from '../../services/productivity.service';
import { orderBy, State } from "@progress/kendo-data-query";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'lib-delivered-hours-drilldown',
  templateUrl: './delivered-hours-drilldown.component.html'
})
export class DeliveredHoursDrilldownComponent implements OnInit {

  deliveredHoursDrilldownsData: GridDataResult = {
    data: [],
    total: 0
  };
  state: State = {
    skip: 0,
    take: 20
  };
  temp: any;
  filteredList: any[] = [];
  isAnyOperationIsInprogress = false;
  displayNamesColum: boolean = false;


  constructor(public dialogRef: MatDialogRef<DeliveredHoursDrilldownComponent>, private productivityService: ProductivityService,
    private cdRef: ChangeDetectorRef, @Inject(MAT_DIALOG_DATA) public data: any, private toastr: ToastrService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    if (this.data.filterType != 'Individual') {
      this.displayNamesColum = true;
    }
    this.getDeliveredHoursDrillDown();
  }

  getDeliveredHoursDrillDown() {
    this.state.skip = 0;
    this.state.take = 20;
    this.isAnyOperationIsInprogress = true;
    var getProductivityDetailsInputModel = new GetProductivityDetails();
    getProductivityDetailsInputModel.dateFrom = this.data.dateFrom;
    getProductivityDetailsInputModel.dateTo = this.data.dateTo;
    getProductivityDetailsInputModel.filterType = this.data.filterType;
    getProductivityDetailsInputModel.rankbasedOn = "Time";
    getProductivityDetailsInputModel.lineManagerId = this.data.lineManagerId;
    getProductivityDetailsInputModel.branchId = this.data.branchId;
    getProductivityDetailsInputModel.userId = this.data.userId;
    this.productivityService.getDeliveredDetailsDrillDown(getProductivityDetailsInputModel).subscribe((res: any) => {
      if (res.success === true) {
        if (res.apiResponseMessages.length == 0) {
          this.temp = res.data;
          this.filteredList = res.data;
          if (this.temp != null) {
            this.deliveredHoursDrilldownsData = {
              data: this.temp.slice(this.state.skip, this.state.take + this.state.skip),
              total: this.temp.length
            };
          }
        }
        else {
          this.toastr.error(res.apiResponseMessages[0].message);
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
    this.deliveredHoursDrilldownsData = {
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
