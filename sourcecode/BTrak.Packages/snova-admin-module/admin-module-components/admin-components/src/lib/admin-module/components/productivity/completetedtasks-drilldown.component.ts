import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { GetProductivityDetails } from '../../models/productivity-models/getProductivityDetails.models';
import { ProductivityService } from '../../services/productivity.service';
import { orderBy, State } from "@progress/kendo-data-query";



@Component({
  selector: 'lib-completedtasks-drilldown',
  templateUrl: 'completetedtasks-drilldown.component.html',
  styleUrls: ['./productivity-drilldown.component.css']
})
export class CompletedTasksDrilldownComponent implements OnInit {

  CompletedTasksDrilldownData: GridDataResult = {
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
  OwnerNameVisible: boolean;




  constructor(public dialogRef: MatDialogRef<CompletedTasksDrilldownComponent>, private productivityService: ProductivityService,
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
    this.getCompletedTasksData();
  }

  getCompletedTasksData() {
    this.state.skip = 0;
    this.state.take = 15;
    this.isAnyOperationIsInprogress = true;
    var getCompletedTasksInputModel = new GetProductivityDetails();
    getCompletedTasksInputModel.dateFrom = this.data.dateFrom;
    getCompletedTasksInputModel.dateTo = this.data.dateTo;
    getCompletedTasksInputModel.filterType = this.data.filterType;
    getCompletedTasksInputModel.rankbasedOn = "Time";
    getCompletedTasksInputModel.lineManagerId = this.data.lineManagerId;
    getCompletedTasksInputModel.branchId = this.data.branchId;
    getCompletedTasksInputModel.userId = this.data.userId;
    this.productivityService.getCompletedTasksDrillDown(getCompletedTasksInputModel).subscribe((res: any) => {
      if (res.success === true) {
        this.temp = res.data;
        this.filteredList = res.data;
        if (this.temp != null) {
          this.CompletedTasksDrilldownData = {
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
    this.CompletedTasksDrilldownData = {
      data: inductionsList.slice(this.state.skip, this.state.take + this.state.skip),
      total: this.filteredList.length
    }
  }


}
