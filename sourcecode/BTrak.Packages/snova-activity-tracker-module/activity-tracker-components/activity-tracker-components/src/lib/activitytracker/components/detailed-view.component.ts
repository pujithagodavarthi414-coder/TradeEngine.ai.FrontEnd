import { Component } from "@angular/core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatDialogRef } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
import { ActivityTimeFilterPipe } from "../../globaldependencies/pipes/activityTimeConversion.pipe";
import { SoftLabelConfigurationModel } from "../models/softlabels-model";
import { WebAppUsageModel } from "../models/web-app-usage-model";
import { WebAppUsageSearchModel } from "../models/web-app-usage-search-model";
import { TimeUsageService } from "../services/time-usage.service";

@Component({
    selector: "app-view-activitytracker-detailed-usage",
    templateUrl: "detailed-view.component.html",
})

export class DetailedViewComponent {

    loading: boolean = false;
    webAppUsage: WebAppUsageModel[];
    webAppUsageSearch: WebAppUsageSearchModel = new WebAppUsageSearchModel();
    sortDirectionAsc: boolean = false;
    sortBy: string = null;
    pageNumber: number = 0;
    pageSize = 15;
    totalCount: number;
    days: number;
    totalTime: number;
    time: number = 28800;
    dateFrom: Date = new Date();
    dateTo: Date = new Date();
    fromDate: Date = new Date();
    toDate: Date = new Date();
    maxDate = new Date();
    minDate = new Date();
    fromMinDate = new Date();
    softLabels: SoftLabelConfigurationModel[];
    loggedUser: string;
    constructor(private activityTime: ActivityTimeFilterPipe, private cookieService: CookieService,
        private timeUsageService: TimeUsageService, public dialogRef: MatDialogRef<DetailedViewComponent>, private translateService: TranslateService) {

    }

    ngOnInit() {
        this.pageNumber = 0;
        this.pageSize = 15;
        var today = new Date();
        this.days = 1;
        var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
        this.fromMinDate = endDate;

        this.getWebAppTimeusage();
    }

    getSoftLabelConfigurations() {
        if (localStorage.getItem(LocalStorageProperties.SoftLabels)) {
            this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
        }
    }

    onSort(event) {
        const sort = event.column.prop;
        this.sortBy = sort;
        this.pageNumber = 0;
        if (event.newValue === 'asc')
            this.sortDirectionAsc = true;
        else
            this.sortDirectionAsc = false;
        this.getWebAppTimeusage();
    }

    getWebAppTimeusage() {
        this.loading = true;
        let WebAppUsageModel = new WebAppUsageSearchModel();
        WebAppUsageModel.pageSize = this.pageSize;
        WebAppUsageModel.pageNumber = this.pageNumber + 1;
        WebAppUsageModel.dateFrom = this.fromDate;
        WebAppUsageModel.dateTo = this.toDate;
        WebAppUsageModel.userId = this.webAppUsageSearch.userId;
        WebAppUsageModel.roleId = this.webAppUsageSearch.roleId;
        WebAppUsageModel.branchId = this.webAppUsageSearch.branchId;
        WebAppUsageModel.searchText = this.webAppUsageSearch.searchText;
        WebAppUsageModel.sortBy = this.sortBy;
        WebAppUsageModel.sortDirectionAsc = this.sortDirectionAsc;
        WebAppUsageModel.isApp = this.webAppUsageSearch.isApp;
        WebAppUsageModel.isDetailedView = true;
        this.totalTime = this.time * this.days;
        this.timeUsageService.getWebAppTimeUsage(WebAppUsageModel).subscribe((responseData: any) => {
            if (responseData.success == false) {
                // this.validationMessage = responseData.apiResponseMessages[0].message;
                this.webAppUsage = [];
                this.totalCount = 0;
            }
            if (responseData.data == null) {
                this.webAppUsage = [];
                this.totalCount = 0;
            } else {
                this.webAppUsage = responseData.data;
                var response = this.webAppUsage;
                for (var i = 0; i < this.webAppUsage.length; i++) {
                    this.webAppUsage[i].timeValue = Math.round((this.webAppUsage[i].spentValue / this.totalTime) * 100);
                    if (this.webAppUsage[i].timeValue == 0) {
                        this.webAppUsage[i].timeValue = 1;
                    }
                }
                this.totalCount = this.webAppUsage[0].totalCount;
            }
            this.loading = false;
        })
    }

    dateFromChanged(event: MatDatepickerInputEvent<Date>) {
        this.fromDate = event.target.value;
        this.minDate = this.fromDate;
        this.setFromDate(this.minDate);
        if (this.toDate < this.fromDate) {
            this.toDate = this.fromDate;
        }
        this.setDateTo(this.toDate);
        var diffInTime = this.dateTo.getTime() - this.dateFrom.getTime();
        this.days = diffInTime / (1000 * 3600 * 24) + 1;
        this.pageNumber = 0;
        this.pageSize = 15;
        this.getWebAppTimeusage();
    }

    setDateTo(date) {
        var day = date.getDate();
        const month = 0 + (date.getMonth() + 1);
        const year = date.getFullYear();
        var newDate = day + '/' + month + '/' + year;
        this.dateTo = new Date(month + '/' + day + '/' + year + " UTC");
    }

    setFromDate(date) {
        var day = date._i["date"];
        const month = 0 + (date._i["month"] + 1);
        const year = date._i["year"];
        var newDate = day + '/' + month + '/' + year;
        this.dateFrom = new Date(month + '/' + day + '/' + year + " UTC");
    }


    dateToChanged(event: MatDatepickerInputEvent<Date>) {
        this.toDate = event.target.value;
        this.setFromDate(this.minDate);
        this.setToDate(this.toDate);
        var diffInTime = this.dateTo.getTime() - this.dateFrom.getTime();
        this.days = diffInTime / (1000 * 3600 * 24) + 1;
        this.pageNumber = 0;
        this.pageSize = 15;
        this.getWebAppTimeusage();
    }

    setToDate(date) {
        var day = date._i["date"];
        const month = 0 + (date._i["month"] + 1);
        const year = date._i["year"];
        var newDate = day + '/' + month + '/' + year;
        this.dateTo = new Date(month + '/' + day + '/' + year + " UTC");
    }

    resetAllFilters() {
        this.fromDate = new Date();
        this.toDate = new Date();
        this.getWebAppTimeusage();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    setPage(data) {
        this.pageNumber = data.offset;
        this.pageSize = 15;
        this.getWebAppTimeusage();
    }

    getLoggedInUser() {
        this.timeUsageService.getLoggedInUser().subscribe((responseData: any) => {
            this.loggedUser = responseData.data.id;
        })
    }

    getProductiveToolTip(row) {
        if (row.applicationTypeName == 'Productive') {
            return this.activityTime.transform(row.spentValue) + ' (' + this.translateService.instant('ACTIVITYTRACKER.PRODUCTIVE') + ')';
        } else if (row.applicationTypeName == 'UnProductive') {
            return this.activityTime.transform(row.spentValue) + ' (' + this.translateService.instant('ACTIVITYTRACKER.UNPRODUCTIVE') + ')';
        } else {
            return this.activityTime.transform(row.spentValue) + ' (' + this.translateService.instant('ACTIVITYTRACKER.NEUTRAL') + ')';
        }
    }
}
