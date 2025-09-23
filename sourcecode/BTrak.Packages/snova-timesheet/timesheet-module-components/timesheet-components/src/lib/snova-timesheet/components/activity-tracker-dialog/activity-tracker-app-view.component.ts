import { Component, Inject, Input } from '@angular/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { Page } from '../../models/Page';
import { TimeUsageDrillDownModel } from '../../models/time-usage-drill-down-model';
import { TimesheetService } from '../../services/timesheet-service.service';
import { State } from '@progress/kendo-data-query';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: "app-activity-tracker-view",
    templateUrl: "activity-tracker-app-view.component.html"
})

export class ActivityTrackerAppViewComponent extends CustomAppBaseComponent {

    @Input('appType')
    set _appType(data: string) {
        if (data) {
            this.appType = data;
        }
    }

    @Input('trackerParameters')
    set _trackerParameters(data: any) {
        if (data) {
            this.trackerParameters = data;
            if (!this.trackerParameters.dateFrom) {
                this.trackerParameters.dateFrom = new Date();
            }
            if (!this.trackerParameters.dateTo) {
                this.trackerParameters.dateTo = new Date();
            }
            // let dateFrom = this.trackerParameters.dateFrom;
            // dateFrom = dateFrom.split('-');
            // let monthDate = dateFrom[2].split('T');
            // monthDate[0] = '01';
            // this.trackerParameters.dateFrom = dateFrom[0] + '-' + dateFrom[1] + '-' + monthDate[0];
            // this.trackerParameters.dateTo = new Date();
            this.getTrackingData(data);
        }
    }

    appType: string;
    page = new Page();
    sortBy: string;
    sortDirectionAsc: boolean;
    timeUsageDrill: any;
    loadingIndicator: boolean;
    totalCount: number; trackerParameters

    state: State = {
        skip: 0,
        take: 20,
    };

    gridDataList: GridDataResult;

    constructor(private timesheetService: TimesheetService) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    getTrackingData(data: any) {
        this.loadingIndicator = true;
        let timeUsage = new TimeUsageDrillDownModel();
        timeUsage.userId = data.userId;
       // timeUsage.dateFrom = data.dateFrom;
        //timeUsage.dateTo = data.dateTo;
        timeUsage.pageSize = this.state.take;;
        timeUsage.pageNumber = (this.state.skip / this.state.take) + 1;;
        timeUsage.sortBy = this.sortBy;
        timeUsage.sortDirectionAsc = this.sortDirectionAsc;
        timeUsage.applicationType = this.appType;
        timeUsage.date = data.dateFrom;
        this.timesheetService.getTimeUsageDrillDown(timeUsage).subscribe((responseData: any) => {
            if (responseData.success == false) {
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
                this.gridDataList = {
                    data: responseData.data,
                    total: responseData.data.length > 0 ? responseData.data[0].totalCount : 0,
                }
                this.loadingIndicator = false;
                this.totalCount = this.timeUsageDrill[0].totalCount;
            }
        });
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort[0]) {
            this.sortBy = this.state.sort[0].field;
            this.sortDirectionAsc = this.state.sort[0].dir == "asc" ? true : false;
        }
        this.getTrackingData(this.trackerParameters);
    }
}