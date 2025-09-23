import { TimeUsageDrillDownModel } from './../models/time-usage-drill-down-model';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TimeUsageService } from "../services/time-usage.service";
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: "app-view-activitytracker-component-time-usage-drilldown",
    templateUrl: "time-usage-drilldown.component.html",
})

export class TimeUsageDrillDownComponent {

    timeUsageDrill: any;
    loading: boolean;
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    localData: any;
    loadingIndicator: boolean;
    scrollbarH: boolean = false;
    sortDirectionAsc: boolean = false;
    sortBy: string = null;
    loggedUser: string;

    constructor(public dialogRef: MatDialogRef<TimeUsageDrillDownComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
                private timeUsageService: TimeUsageService, private toastr: ToastrService) {
        this.loading = true;
        this.pageNumber = 0;
        this.pageSize = 10;
        this.localData = data;
        this.sortBy = "applicationName";
        this.sortDirectionAsc = true;
        this.drillDown(data);
    }

    setPage(data) {
        this.pageNumber = data.offset;
        this.pageSize = 10;
        this.loadingIndicator = true;
        this.drillDown(this.localData);
    }

    onSort(event) {
        const sort = event.column.prop;
        this.sortBy = sort;
        this.pageNumber = 0;
        if (event.newValue === "asc") {
          this.sortDirectionAsc = true;
        } else {
          this.sortDirectionAsc = false;
        }
        this.loadingIndicator = true;
        this.drillDown(this.localData);
    }

    drillDown(data: any) {
        let timeUsage = new TimeUsageDrillDownModel();
        timeUsage.userId = data.user;
        timeUsage.dateFrom = data.dateFrom;
        timeUsage.dateTo = data.dateTo;
        timeUsage.pageSize = this.pageSize;
        timeUsage.pageNumber = this.pageNumber + 1;
        timeUsage.sortBy = this.sortBy;
        timeUsage.sortDirectionAsc = this.sortDirectionAsc;
        timeUsage.applicationType = data.applicationType;
        this.timeUsageService.getTimeUsageDrillDown(timeUsage).subscribe((responseData: any) => {
            // if (responseData.success) {
            //     this.timeUsageDrill = responseData.data;
            //     this.totalCount = this.timeUsageDrill.length;
            // } else {
            //     this.toastr.error(responseData.apiResponseMessages[0].message);
            //     this.timeUsageDrill = [];
            //     this.totalCount = 0;
            // }
            // this.loading = false;

            if (responseData.success == false) {
                // this.validationMessage = responseData.apiResponseMessages[0].message;
                this.timeUsageDrill = [];
                this.loadingIndicator = false;
                this.totalCount = 0;
              }
            if (responseData.data == null) {
                this.timeUsageDrill = [];
                this.loadingIndicator = false;
                this.totalCount = 0;

              } else {
                this.timeUsageDrill = responseData.data;
                this.loadingIndicator = false;
                this.totalCount = this.timeUsageDrill[0].totalCount;
              }
            this.loading = false;
        })
    }

    close() {
        this.dialogRef.close();
    }

    getLoggedInUser() {
        this.timeUsageService.getLoggedInUser().subscribe((responseData: any) => {
          this.loggedUser = responseData.data.id;
        })
    }
}
