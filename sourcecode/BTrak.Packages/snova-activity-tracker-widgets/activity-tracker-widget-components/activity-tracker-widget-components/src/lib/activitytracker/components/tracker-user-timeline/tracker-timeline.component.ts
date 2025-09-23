import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventStyleArgs, SchedulerEvent } from '@progress/kendo-angular-scheduler';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { TimelineSearchModel, TimelineUserModel } from '../../models/tracker-timeline-search.model';
import { ActivityTrackerService } from '../../services/activitytracker-services';
import * as $_ from 'jquery';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
const $ = $_;

@Component({
    selector: 'app-at-tracker-user-timeline',
    templateUrl: `tracker-timeline.component.html`
})

export class TrackerTimelineComponent extends CustomAppBaseComponent implements OnInit {

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        this.dashboardFilters = data;
        this.resetFilter(this.dashboardFilters.date ? this.dashboardFilters.date : null);
    }

    dashboardFilters: DashboardFilterModel;

    @Input("isFromDashboard")
    set _isFromDashboard(data: boolean) {
        if (data && data !== undefined) {
            this.isFromDashboard = data;
        }
    }

    isFromDashboard = true;
    public selectedDate: any = null;
    public rawData: any[] = [];
    selectedUserIds: string[] = [];
    operationInProgress = false;
    selectedUser: string = null;
    open = false;
    employeesDropDown: any;
    filterApplied = false;
    userId: any;
    loggedUser: string = null;
    maxDate = new Date();
    uniqueNumberUrl: any;
    uniqueUsers: TimelineUserModel[] = [];

    constructor(
        private activityTrackerService: ActivityTrackerService,
        private toasterService: ToastrService,
        private datePipe: DatePipe,
        private cookieService: CookieService,
        private cdRef: ChangeDetectorRef,
        private router: Router) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.loggedUser = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        this.getAllEmployees();
    }

    getAllEmployees() {
        var teamMemberModel;
        if (this.canAccess_feature_ViewActivityReportsForAllEmployee) {
            teamMemberModel = {
                isAllUsers: true
            }
        }
        else {
            teamMemberModel = {
                isAllUsers: false
            }
        }
        teamMemberModel.isArchived = false;
        this.activityTrackerService.getTeamLeadsList(teamMemberModel).subscribe((responseData: any) => {
            this.employeesDropDown = responseData.data;
        })
    }


    getUserTimelineDetails() {
        this.operationInProgress = true;
        const timelineSearchModel = new TimelineSearchModel();
        timelineSearchModel.userId = this.selectedUserIds.length > 0 ? this.selectedUserIds : null;
        timelineSearchModel.onDate = this.selectedDate ? this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd') : null;
        this.activityTrackerService.GetUserTrackerTimeline(timelineSearchModel).subscribe((result: any) => {
            if (result.success && result.data) {
                this.rawData = result.data;
                this.rawData.forEach(element => {
                    element.title = element.title.length > 55 ? element.title.substring(0, 53) + ".." : element.title;
                });
            } else if (result.success) {
                this.rawData = [];
            } else {
                this.toasterService.error(result.apiResponseMessages[0].message);
            }
            this.operationInProgress = false;
            this.cdRef.detectChanges();
        })
    }

    getUserTimeDetails(data) {
        if (this.selectedDate != data.selectedDate) {
            this.selectedDate = data.selectedDate;
            this.getUserTimelineDetails();
        }
    }

    dateFilterApplied(event) {
        this.filterApplied = true;
        this.selectedDate = event.value;
        this.getUserTimelineDetails();
    }

    redirectToCommit(dataItem) {
        if (dataItem.reference) {
            window.open(dataItem.reference, "_blank");
        }
    }

    redirectToWorkItem(dataItem) {
        const angularRoute = this.router.url;
        const url = window.location.href;
        this.uniqueNumberUrl = url.replace(angularRoute, '');
        this.uniqueNumberUrl = this.uniqueNumberUrl + '/projects/workitem/' + dataItem.reference;
        window.open(this.uniqueNumberUrl, "_blank");
    }

    getEventStyles(dataItem) {
        return dataItem.categoryType == 'WorkItemStart' ? '#00acc1' :
            dataItem.categoryType == 'WorkItemEnd' ? '#00acc1' :
                dataItem.categoryType == 'TimesheetStart' ? '#087f23' :
                    dataItem.categoryType == 'TimesheetFinish' ? '#087f23' :
                        dataItem.categoryType == 'LunchStart' ? '#1976d2' :
                            dataItem.categoryType == 'LunchEnd' ? '#1976d2' :
                                dataItem.categoryType == 'BreakStart' ? '#ab47bc' :
                                    dataItem.categoryType == 'BreakEnd' ? '#ab47bc' :
                                        dataItem.categoryType == 'Commit' ? '#f06292' : '#80deea';
    }

    getEventHeight(dataItem) {
        return dataItem.differenceMinutes > 50 ? (dataItem.differenceMinutes).toString() + "px" : "50px";
    }

    filterClick() {
        this.open = !this.open;
    }

    resetFilter(date) {
        this.selectedDate = date;
        this.selectedUser = null;
        this.userId = this.loggedUser;
        this.filterApplied = false;
        this.selectedUserIds = [];
        this.selectedUserIds.push(this.loggedUser);
        this.getUserTimelineDetails();
    }

    changeUser(value) {
        if (value != "0" && value != "") {
            this.filterApplied = true;
            this.userId = value;
            this.selectedUserIds = [];
            var index = this.employeesDropDown.findIndex(p => p.teamMemberId == value);
            if (index > -1) {
                this.selectedUser = this.employeesDropDown[index].teamMemberName;
            }
            this.selectedUserIds.push(value);
            this.getUserTimelineDetails();
        }
    }

    fitContent(optionalParameters: any) {
        var interval;
        var count = 0;
        if (optionalParameters['gridsterView']) {
            interval = setInterval(() => {
                try {
                    if (count > 30) {
                        clearInterval(interval);
                    }
                    count++;
                    if ($(optionalParameters['gridsterViewSelector'] + ' .tracker-timeline-height').length > 0) {
                        var appHeight = $(optionalParameters['gridsterViewSelector']).height();
                        var contentHeight = appHeight - 45;
                        $(optionalParameters['gridsterViewSelector'] + ' .tracker-timeline-height').height(contentHeight);
                        clearInterval(interval);
                    }

                } catch (err) {
                    clearInterval(interval);
                }
            }, 1000);

        } else if (optionalParameters['popupView']) {

            interval = setInterval(() => {
                try {

                    if (count > 30) {
                        clearInterval(interval);
                    }

                    count++;

                    if ($(optionalParameters['popupViewSelector'] + ' .gridster-noset').length > 0) {
                        $(optionalParameters['popupViewSelector'] + ' .gridster-noset #widget-scroll-id').css("cssText", `height: calc(100vh - 400px) !important;`);
                        clearInterval(interval);
                    }

                } catch (err) {
                    clearInterval(interval);
                }
            }, 1000);

        } else if (optionalParameters['individualPageView']) {

            interval = setInterval(() => {
                try {

                    if (count > 30) {
                        clearInterval(interval);
                    }

                    count++;

                    if ($(optionalParameters['individualPageSelector'] + ' .gridster-noset').length > 0) {
                        $(optionalParameters['individualPageSelector'] + ' .gridster-noset #widget-scroll-id').css("cssText", `height: calc(100vh - 178px) !important;`);
                        clearInterval(interval);
                    }

                } catch (err) {
                    clearInterval(interval);
                }
            }, 1000);
        }
    }
}