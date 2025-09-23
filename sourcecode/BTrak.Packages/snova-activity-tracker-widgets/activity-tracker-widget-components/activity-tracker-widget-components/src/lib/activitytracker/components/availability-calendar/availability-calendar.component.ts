import { Component, ViewEncapsulation, Inject, ViewChild, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { extend } from '@syncfusion/ej2-base';
// import {
//     EventSettingsModel, View, GroupModel, ResourceDetails
// } from '@syncfusion/ej2-angular-schedule';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { ActivityTrackerService } from '../../services/activitytracker-services';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import * as $_ from 'jquery';
import { event } from "d3";
import { AvailabilityInputModel } from '../../models/calendar-availability.model';
import { UtcToLocalTimePipe } from '../../../globaldependencies/pipes/utctolocaltime.pipe';
const $ = $_;

@Component({
    selector: 'app-at-availability-calendar',
    templateUrl: 'availability-calendar.component.html',
    encapsulation: ViewEncapsulation.None
})

export class AvailabilityCalendarComponent extends CustomAppBaseComponent implements OnInit {

    // @ViewChild('scheduleObj') scheduleObj;

    // public selectedDate: any = new Date();

    // public currentView: View = 'TimelineDay';

    // public allowMultiple: Boolean = false;
    // public ReadOnly = true;
    // public AllowDragAndDrop = false;

    // public employeeDataSource: Object[] = [];

    // public group: GroupModel = { enableCompactView: false, resources: ['Employee'] };

    // public modifiedData: Object[];

    // eventSettings: EventSettingsModel = {
    //     dataSource: [],
    //     allowAdding: false,
    //     allowEditing: false,
    //     allowDeleting: false,
    //     editFollowingEvents: false,

    // }

    // @Input("isFromDashboard")
    // set _isFromDashboard(data: boolean) {
    //     if (data && data !== undefined) {
    //         this.isFromDashboard = data;
    //     }
    // }

    // rawData: any[] = [];
    // isFromDashboard = true;
    // selectedUserIds: string[] = [];
    // operationInProgress = false;
    // selectedUser: string = null;
    // open = false;
    // employeesDropDown: any;
    // filterApplied = false;
    // userId: any;
    // loggedUser: string = null;
    // maxDate = new Date();
    // uniqueNumberUrl: any;
    // dateFrom: string;
    // dateTo: string;
    // loadInProgress = false;

    // resources: any[] = [];

    constructor(
        private activityTrackerService: ActivityTrackerService,
        private toasterService: ToastrService,
        private datePipe: DatePipe,
        private utcToLocal: UtcToLocalTimePipe,
        private cookieService: CookieService,
        private cdRef: ChangeDetectorRef,
        private router: Router) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        // this.loggedUser = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        // if (this.canAccess_feature_ViewActivityReports) {
        //     this.resetFilter();
        // }
    }

    // getAllEmployees() {
    //     var teamMemberModel;
    //     if (this.canAccess_feature_ViewActivityReportsForAllEmployee) {
    //         teamMemberModel = {
    //             isAllUsers: true
    //         }
    //     }
    //     else {
    //         teamMemberModel = {
    //             isAllUsers: false
    //         }
    //     }
    //     teamMemberModel.isArchived = false;
    //     this.loadInProgress = true;
    //     this.employeeDataSource = [];
    //     this.activityTrackerService.getTeamLeadsList(teamMemberModel).subscribe((responseData: any) => {
    //         this.employeesDropDown = responseData.data;
    //         for (let i = 0; i < this.employeesDropDown.length; i++) {
    //             const element = {
    //                 teamMemberName: this.employeesDropDown[i].teamMemberName,
    //                 teamMemberId: this.employeesDropDown[i].teamMemberId,
    //                 profileImage: this.employeesDropDown[i].profileImage,
    //                 id: i + 1
    //             };
    //             this.employeeDataSource.push(element);
    //         }
    //         // this.employeeDataSource = responseData.data.map(dataItem => (
    //         //     <Object>{
    //         //         teamMe: dataItem.id,
    //         //         endTime: new Date(this.utcToLocal.transform(dataItem.endTime)),
    //         //         startTime: dataItem.startTime ? new Date(this.utcToLocal.transform(dataItem.startTime)) : new Date(),
    //         //         color: dataItem.color,
    //         //         date: dataItem.date,
    //         //         isAllDay: dataItem.isAllDay,
    //         //         isBlock: dataItem.isBlock,
    //         //         isHoliday: dataItem.isHoliday,
    //         //         isNoShift: dataItem.isNoShift,
    //         //         subject: dataItem.subject,
    //         //         userId: dataItem.userId,
    //         //     }
    //         // ));
    //         // responseData.data.forEach(element => {
    //         //     const data = {
    //         //         userId: element.teamMemberId,
    //         //         teamMemberName: element.teamMemberName,
    //         //         profileImage: element.profileImage,
    //         //     }
    //         //     this.employeeDataSource.push(data);
    //         // });
    //         this.loadInProgress = false;
    //         this.cdRef.detectChanges();
    //         console.log(this.employeeDataSource);
    //     })
    // }
    // getName(data) {
    //     console.log(data);
    // }

    // onActionComplete(args) {
    //     if (args.requestType === "viewNavigate" || args.requestType === "dateNavigate") {
    //         var currentViewDates = this.scheduleObj.getCurrentViewDates();
    //         this.dateFrom = currentViewDates[0];
    //         this.dateTo = currentViewDates[currentViewDates.length - 1];
    //         this.getUserAvailabilityDetails();
    //     }
    // }

    // getEmployeeName(value: ResourceDetails): string {
    //     return (value as ResourceDetails).resourceData.teamMemberName as string;
    // }

    // getEmployeeImageName(value: ResourceDetails): string {
    //     return (value as ResourceDetails).resourceData.profileImage as string;
    // }

    // getUserAvailabilityDetails() {
    //     this.operationInProgress = true;
    //     const getAvailabilityModel = new AvailabilityInputModel();
    //     getAvailabilityModel.userId = this.selectedUserIds.length > 0 ? this.selectedUserIds[0] : null;
    //     getAvailabilityModel.dateFrom = this.datePipe.transform(this.dateFrom, 'yyyy-MM-dd');
    //     getAvailabilityModel.dateTo = this.datePipe.transform(this.dateTo, 'yyyy-MM-dd');
    //     this.activityTrackerService.GetUserAvailabilityDetails(getAvailabilityModel).subscribe((result: any) => {
    //         if (result.success && result.data) {
    //             this.rawData = result.data;
    //             this.rawData
    //             this.modifiedData = this.rawData.map(dataItem => (
    //                 <Object>{
    //                     Id: dataItem.id,
    //                     StartTime: new Date(dataItem.startTime),
    //                     EndTime: new Date(dataItem.endTime),
    //                     Color: dataItem.color,
    //                     IsAllDay: false,
    //                     IsBlock: true,
    //                     Subject: dataItem.subject,
    //                     UserId: dataItem.userId,
    //                 }
    //             ));
    //             this.eventSettings = {
    //                 dataSource: this.modifiedData,
    //                 allowAdding: false,
    //                 allowEditing: false,
    //                 allowDeleting: false,
    //                 editFollowingEvents: false
    //             }
    //             this.operationInProgress = false;
    //             this.cdRef.detectChanges();
    //         } else if (result.success) {
    //             this.rawData = [];
    //             this.modifiedData = <Object[]>extend([], this.rawData.map(dataItem => (
    //                 <Object>{
    //                     id: dataItem.id,
    //                     startTime: new Date(dataItem.startTime),
    //                     endTime: new Date(dataItem.endTime),
    //                     color: dataItem.color,
    //                     isAllDay: false,
    //                     isBlock: true,
    //                     subject: dataItem.subject,
    //                     userId: dataItem.userId,
    //                 }
    //             )), null, true);
    //             this.eventSettings = {
    //                 dataSource: this.modifiedData,
    //                 allowAdding: false,
    //                 allowEditing: false,
    //                 allowDeleting: false,
    //                 editFollowingEvents: false
    //             }
    //             this.operationInProgress = false;
    //             this.cdRef.detectChanges();
    //         } else {
    //             this.operationInProgress = false;
    //             this.toasterService.error(result.apiResponseMessages[0].message);
    //         }
    //         console.log(this.eventSettings);
    //     })
    // }

    // redirectToWorkItem(dataItem) {
    //     const angularRoute = this.router.url;
    //     const url = window.location.href;
    //     this.uniqueNumberUrl = url.replace(angularRoute, '');
    //     this.uniqueNumberUrl = this.uniqueNumberUrl + '/projects/workitem/' + dataItem.reference;
    //     window.open(this.uniqueNumberUrl, "_blank");
    // }

    // filterClick() {
    //     this.open = !this.open;
    // }

    // resetFilter() {
    //     this.selectedDate = new Date();
    //     this.dateFrom = this.selectedDate;
    //     this.dateTo = this.selectedDate;
    //     this.currentView = 'TimelineDay';
    //     this.selectedUser = null;
    //     this.userId = this.loggedUser;
    //     this.filterApplied = false;
    //     this.selectedUserIds = [];
    //     this.getAllEmployees();
    //     this.getUserAvailabilityDetails();
    // }

    // changeUser(value) {
    //     if (value != "0" && value != "") {
    //         this.filterApplied = true;
    //         this.userId = value;
    //         this.selectedUserIds = [];
    //         this.employeeDataSource = [];
    //         var index = this.employeesDropDown.findIndex(p => p.teamMemberId == value);
    //         if (index > -1) {
    //             this.selectedUser = this.employeesDropDown[index].teamMemberName;
    //             const element = {
    //                 teamMemberName: this.employeesDropDown[index].teamMemberName,
    //                 teamMemberId: this.employeesDropDown[index].teamMemberId,
    //                 profileImage: this.employeesDropDown[index].profileImage,
    //                 id: 1
    //             };
    //             this.employeeDataSource.push(element);
    //         }
    //         this.selectedUserIds.push(value);
    //         this.getUserAvailabilityDetails();
    //     }
    // }

    // fitContent(optionalParameters: any) {
    //     var interval;
    //     var count = 0;
    //     if (optionalParameters['gridsterView']) {
    //         interval = setInterval(() => {
    //             try {
    //                 if (count > 30) {
    //                     clearInterval(interval);
    //                 }
    //                 count++;
    //                 if ($(optionalParameters['gridsterViewSelector'] + ' .availability-calendar-height').length > 0) {
    //                     var appHeight = $(optionalParameters['gridsterViewSelector']).height();
    //                     var contentHeight = appHeight - 45;
    //                     $(optionalParameters['gridsterViewSelector'] + ' .availability-calendar-height').height(contentHeight);
    //                     clearInterval(interval);
    //                 }

    //             } catch (err) {
    //                 clearInterval(interval);
    //             }
    //         }, 1000);
    //     }
    // }
}
