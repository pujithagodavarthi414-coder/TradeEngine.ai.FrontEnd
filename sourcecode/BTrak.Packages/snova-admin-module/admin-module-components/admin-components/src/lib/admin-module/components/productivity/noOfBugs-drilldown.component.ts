import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { GetProductivityDetails } from '../../models/productivity-models/getProductivityDetails.models';
import { ProductivityService } from '../../services/productivity.service';
import { orderBy, State } from "@progress/kendo-data-query";



@Component({
  selector: 'lib-numberOfBugs-drilldown',
  templateUrl: 'noOfBugs-drilldown.component.html',
  styleUrls: ['./productivity-drilldown.component.css']
})
export class NoOfBugsDrilldownComponent implements OnInit {

  NoOfBugsDrilldownData: GridDataResult = {
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




  constructor(public dialogRef: MatDialogRef<NoOfBugsDrilldownComponent>, private productivityService: ProductivityService,
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
    this.getNoOfBugsDrilldownData();
  }

  getNoOfBugsDrilldownData() {
    this.state.skip = 0;
    this.state.take = 15;
    this.isAnyOperationIsInprogress = true;
    var getNoOfBugsInputModel = new GetProductivityDetails();
    getNoOfBugsInputModel.dateFrom = this.data.dateFrom;
    getNoOfBugsInputModel.dateTo = this.data.dateTo;
    getNoOfBugsInputModel.filterType = this.data.filterType;
    getNoOfBugsInputModel.rankbasedOn = "Time";
    getNoOfBugsInputModel.lineManagerId = this.data.lineManagerId;
    getNoOfBugsInputModel.branchId = this.data.branchId;
    getNoOfBugsInputModel.userId = this.data.userId;
    this.productivityService.getNoOfBugssDrillDown(getNoOfBugsInputModel).subscribe((res: any) => {
      if (res.success === true) {
        this.temp = res.data;
        this.filteredList = res.data;
        if (res.data != null) {
          this.NoOfBugsDrilldownData = {
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
    this.NoOfBugsDrilldownData = {
      data: inductionsList.slice(this.state.skip, this.state.take + this.state.skip),
      total: this.filteredList.length
    }
  }


}
