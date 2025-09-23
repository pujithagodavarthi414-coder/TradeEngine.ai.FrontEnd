import { Component, OnInit, ViewChildren, ViewChild, ElementRef, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';


import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import * as _ from 'underscore';

import { ScreenshotModel } from '../models/screenshot-model';
import { WebAppUsageSearchModel } from '../models/web-app-usage-search-model';
import { TimeUsageService } from '../services/time-usage.service';
import { EmployeeModel } from '../models/employee-model';
import { DeleteScreenShotModel } from '../models/delete-screenshot-model';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import * as introJs from 'intro.js/intro.js';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxGalleryImageSize, NgxGalleryOptions } from 'ngx-gallery-9';

declare var $_tracker: any;

@Component({
    selector: 'app-fm-component-activity-screenshots',
    templateUrl: `activity-screenshots-component.html`
})

export class ActivityScreenshotsComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChild("myLiveModal") divView: ElementRef;
    @ViewChildren("deleteScreenshotPopUp") deleteScreenshotPopover;
    @ViewChild("allUsersSelected") private allUsersSelected: MatOption;
    // @ViewChild("liveCastDialog") liveCastDialog: TemplateRef<any>;

    galleryOptions: NgxGalleryOptions[];
    galleryImages: ScreenshotModel[];
    emptyImages: ScreenshotModel[];
    screenshots: any[] = [];
    employeesDropDown: EmployeeModel[];
    employeeList: any;
    webAppUsageSearch: WebAppUsageSearchModel = new WebAppUsageSearchModel();
    deleteForm: FormGroup;
    selectFilter: FormGroup;
    userActivityScreenshots: any[] = [];
    rows = [];
    date: Date = new Date();
    weekDate: Date = new Date();
    monthDate: Date = new Date();
    selectedDate: string = this.date.toISOString();
    selectedWeek: string = this.date.toISOString();
    selectedMonth: string = this.date.toISOString();
    loggedUser: string;
    dateFrom: Date = new Date();
    dateTo: Date = new Date();
    fromDate: Date = new Date();
    toDate: Date = new Date();
    todayDate: Date = new Date();
    maxDate = new Date();
    minDate = new Date();
    weekNumber: number;
    days: number;
    totalTime: number;
    time: number = 480;
    totalCount: number = 0;
    direction: any;
    searchText: string = '';
    searchParam: string = '';
    sortBy: number = 1;
    type: string = ConstantVariables.Month;
    primaryDay: string = "primary";
    primaryWeek: string;
    primaryMonth: string;
    primaryDateRange: string;
    validationMessage: string;
    selectedUser: string;
    day: boolean = true;
    week: boolean;
    month: boolean;
    prevarrow: boolean = false;
    nextarrow: boolean = false;
    dateRange: boolean;
    images: boolean = false;
    isSelected: boolean = false;
    isPreview: boolean = false;
    selectAll: boolean = false;
    isSelectAllUsers: boolean = false;
    dispalyForward: boolean = false;
    screenId: any[] = [];
    deletescreenId: string;
    screen: any[] = [];
    screenImg: string;
    imageDetails: any;
    slideIndex: number = 1;
    totalScreenshot: number = 0;
    userId: string;
    loading: boolean = false;
    noData: boolean = false;
    pageSizeOptions: number[] = [25, 50, 100, 150, 200];
    pageSize: number = 25;
    pageNumber: number = 1;
    pageIndex: number = 0;
    selectedUserId: string;
    temp: any;
    isActive: number = 0;
    AllUser: string = "All latest screenshots";
    selectedAllUser: string = '';
    selectedUserList: any;
    minDateOnTrailExpired: Date = null;
    isTrailExpired: boolean = false;
    isDay: any = 0;
    dayCount: any = 7;
    isNextDisable: boolean = true;
    isPreviousDisable: boolean = false;
    introJS = new introJs();
    multiPage: string = null;
    subscription: Subscription;
    // timer: Observable<any>;
    timer: any;
    liveScreenshotInProgress: boolean = false;
    loggedInUserId: string;
    liveImageUserName: string;
    liveImageUserId: string;
    liveImageUrl: any;
    liveImageUserProfileImage: string;
    livescreenShotDateTime: string;
    liveScreentimeZoneName: string;
    liveImageroleName: string;
    liveScreenshotStreamInProgress: boolean = false;
    cancelScreenCast: boolean = false;
    connection: any;
    isAllUser: boolean = false;
    totalLoadingTime: number = 0;
    interval;
    environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    apiURL = this.environment.apiURL;
    loader: boolean = false;
    screenshot: boolean = false;
    liveCast: boolean = false;
    // apiURL = "http://localhost:55224/";

    constructor(private datePipe: DatePipe, private toastrService: ToastrService,
        private timeUsageService: TimeUsageService, private cookieService: CookieService,
        private cdRef: ChangeDetectorRef, private route: ActivatedRoute, private router: Router,
        private translateService: TranslateService, private _sanitizer: DomSanitizer, private dialog: MatDialog) {
        super();
        this.route.queryParams.subscribe(params => {
            if (!this.multiPage) {
                this.multiPage = params['multipage'];
            }
        });
        var response = JSON.parse(this.cookieService.get(LocalStorageProperties.CompanyDetails));
        if (response && (response.trailDays > 0 || response.noOfPurchasedLicences > 0)) {
            this.isTrailExpired = false;
        }
        else {
            this.isTrailExpired = true;
        }
        if (this.isTrailExpired) {
            var today = new Date();
            var endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
            // var month;
            // var year;
            // if (endDate.getDate() > today.getDate()) {
            //     month = today.getMonth() != 0 ? today.getMonth() - 1 : 11;
            //     if (month == 11) {
            //         year = today.getFullYear() - 1;
            //     }
            //     year = today.getFullYear();
            // }
            // else {
            //     month = today.getMonth();
            //     year = today.getFullYear();
            // }
            this.minDateOnTrailExpired = endDate;
        }
    }

    ngOnInit() {
        super.ngOnInit();
        this.formValidate();
        this.setDateFrom(this.fromDate);
        this.setDateTo(this.dateTo);
        this.getAllEmployees();
        (document.querySelector('.custom-live-modal') as HTMLElement).style.display = "none";
        this.loggedInUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        this.galleryOptions = [
            {
                image: false, height: "150px", width: "1200px", thumbnailsPercent: 40, thumbnailSize: NgxGalleryImageSize.Cover,
                thumbnailsColumns: 4, thumbnailMargin: 5, previewZoom: true, previewCloseOnEsc: true, previewKeyboardNavigation: true,
                arrowNextIcon: 'fa fa-chevron-right', arrowPrevIcon: 'fa fa-chevron-left'
            },
            {
                breakpoint: 800,
                image: false,
                width: '100%',
                height: '80px',
                thumbnailsPercent: 40,
                thumbnailSize: NgxGalleryImageSize.Cover,
                thumbnailsColumns: 6,
                thumbnailMargin: 5,
                previewZoom: true,
                previewRotate: true,
                previewCloseOnEsc: true,
                previewKeyboardNavigation: true,
                arrowNextIcon: 'fa fa-chevron-right',
                arrowPrevIcon: 'fa fa-chevron-left'
            },
            {
                breakpoint: 375,
                image: false,
                width: '100%',
                height: '80px',
                thumbnailsPercent: 40,
                thumbnailSize: NgxGalleryImageSize.Cover,
                thumbnailsColumns: 3,
                thumbnailMargin: 5,
                previewZoom: true,
                previewRotate: true,
                previewCloseOnEsc: true,
                previewKeyboardNavigation: true,
                arrowNextIcon: 'fa fa-chevron-right',
                arrowPrevIcon: 'fa fa-chevron-left'
            },
        ]
    }

    ngAfterViewInit() {
        this.introJS.setOptions({
            steps: [
                {
                    element: '#screen-1',
                    intro: "It will diplay all the screen-shots of the tracking system.",
                    position: 'bottom'
                },
                {
                    element: '#screen-2',
                    intro: "It shows the list of users and it has search filter to filter the required user screen-shots.",
                    position: 'bottom'
                },
                {
                    element: '#screen-3',
                    intro: "Here we can select any of the buttons Day, Week, data range to get the screen-shots of respected dates.",
                    position: 'bottom'
                }

            ]
        });
        //this.introJS.start();
    }

    getLiveScreenshot(user, screenShot, screenCast) {
        // if (screenShot) {
        //     this.screenshot = true;
        //     this.liveCast = false;
        // }
        // else {
        //     this.liveCast = true;
        //     this.screenshot = false;
        // }
        if (!this.liveScreenshotInProgress) {
            // this.loader = true;
            // this.totalLoadingTime = 0;
            // this.startTimer();
            this.liveScreenshotInProgress = true;
            this.cdRef.detectChanges();
            this.liveImageUserName = user.userName;
            this.liveImageUserProfileImage = user.profileImage;
            this.liveImageroleName = user.roleName;
            this.liveImageUserId = user.userId;
            if (this.liveImageUserId) {
                var self = this;
                self.connection = $_tracker.hubConnection(this.apiURL + 'signalr', { useDefaultPath: false });
                // self.connection = $_tracker.hubConnection('http://localhost:55224/signalr', { useDefaultPath: false });
                if (self.connection) {
                    self.connection.stop();
                }
                var trackerHub = self.connection.createHubProxy('ActivityTrackerHub');
                var clientTrackerUserId = this.liveImageUserId + ConstantVariables.TrackerValueExtenstion;
                var clientWebUserId = this.loggedInUserId + ConstantVariables.WebValueExtension;
                this.liveScreenshotInProgress = true;
                var hubRequestData = {
                    WebConnectionValue: clientWebUserId,
                    TrackerConnectionValue: clientTrackerUserId,
                    FromWeb: true
                };
                trackerHub.on('shapeMoved', function (x, y) {
                    // alert(x + y);
                });
                trackerHub.on('screenShotCaptured', function (url) {
                    clearTimeout(self.timer);
                    if (screenCast && self.cancelScreenCast) {
                        trackerHub.invoke("CancelLiveScreenCast", JSON.stringify(hubRequestData));
                        self.cdRef.detectChanges();
                    } else {
                        self.liveScreenshotInProgress = false;
                        //self.closeLoader();
                        self.dispalyliveImage(url);
                    }
                });
                trackerHub.on('screenShotFailed', function (clientValue) {
                    clearTimeout(self.timer);
                    if (self.liveScreenshotInProgress) {
                        self.liveScreenshotInProgress = false;
                        self.cancelScreenCast = true;
                        self.toastrService.error(self.translateService.instant('ACTIVITYTRACKER.SOMETHINGWENTWRONG'));
                        self.cdRef.detectChanges();
                        //self.closeLoader();
                    }
                });
                trackerHub.on('contactMade', function (message) {
                    console.log(message);
                });
                trackerHub.on('someThingWentWrong', function (message) {
                    clearTimeout(self.timer);
                    if (self.liveScreenshotInProgress) {
                        self.liveScreenshotInProgress = false;
                        self.cdRef.detectChanges();
                        self.toastrService.error(self.translateService.instant('ACTIVITYTRACKER.SOMETHINGWENTWRONG'));
                        //self.closeLoader();
                    }
                });
                trackerHub.on('clientNotAvailable', function (clientValue) {
                    if (screenShot) {
                        self.liveScreenshotInProgress = false;
                        self.toastrService.warning(self.translateService.instant('ACTIVITYTRACKER.USERISNOTACTIVEFORSCREENSHOT'));
                        //self.closeLoader();
                        self.cdRef.detectChanges();
                    } else if (screenCast) {
                        self.liveScreenshotInProgress = false;
                        self.toastrService.warning(self.translateService.instant('ACTIVITYTRACKER.USERISNOTACTIVEFORSCREENCAST'));
                        //self.closeLoader();
                        self.cdRef.detectChanges();
                    }
                });
                self.connection.start().done(function () {
                    trackerHub.invoke("UpdateClientCredData", JSON.stringify({ ClientUserId: clientWebUserId }));
                    if (screenShot) {
                        trackerHub.invoke("CaptureLiveScreenShot", JSON.stringify(hubRequestData));
                    }

                    if (screenCast) {
                        self.cancelScreenCast = false;
                        trackerHub.invoke("CaptureLiveScreenCast", JSON.stringify(hubRequestData));
                    }
                    self.setScreenshotTimer(screenShot);
                }).fail(function () {
                    self.toastrService.warning(self.translateService.instant('ACTIVITYTRACKER.COULDNOTCONNECT'));
                    //self.closeLoader();
                    self.liveScreenshotInProgress = false;
                });
            } else {
                //self.closeLoader();
                this.liveScreenshotInProgress = false;
            }
        }
    }

    setScreenshotTimer(screenShot) {
        var self = this;
        this.timer = setTimeout(function () {
            // set showloader to false to hide loading div from view after 15 seconds
            if (self.liveScreenshotInProgress) {
                self.liveScreenshotInProgress = false;
                if (screenShot) {
                    self.toastrService.warning(self.translateService.instant('ACTIVITYTRACKER.CANTGETLIVESCREENSHOT'));
                } else {
                    self.toastrService.warning(self.translateService.instant('ACTIVITYTRACKER.CANTGETLIVESCREENSTREAM'));
                }
                self.cdRef.detectChanges();
            }
        }, 45000);
    }

    dispalyliveImage(url) {
        var data = JSON.parse(url);
        var base64String = `data:image/png;base64, ${data.ScreenShotUrl}`;
        this.liveImageUrl = this._sanitizer.bypassSecurityTrustResourceUrl(base64String);
        this.livescreenShotDateTime = data.ScreenShotDate;
        this.liveScreentimeZoneName = data.TimeZoneName;
        (document.querySelector(".my-live-slides") as HTMLElement).style.display = "block";
        (document.querySelector(".custom-live-modal") as HTMLElement).style.display = "block";
        // let currentDialog = this.dialog.getDialogById("live-cast");
        // if (!currentDialog)
        //     this.openLiveCastDialog();
    }

    formValidate() {

        this.deleteForm = new FormGroup({
            reason: new FormControl('',
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
        }),
            this.selectFilter = new FormGroup({
                userIds: new FormControl('',
                    Validators.compose([
                    ])
                )
            })
    }

    dayTypeForTimeUsage(clickType) {
        this.isDay = 0;
        this.dayCount = 7;
        this.isNextDisable = true;
        this.isPreviousDisable = false;
        if (clickType == "day") {
            this.primaryDay = "primary";
            this.primaryWeek = "";
            this.primaryMonth = "";
            this.primaryDateRange = "";
            this.days = 1;
            this.day = true;
            this.month = false;
            this.week = false;
            this.dateRange = false;
            this.todayDate = new Date();
            this.dateFrom = this.todayDate;
            this.dateTo = this.todayDate;
        }
        else if (clickType == "week") {
            this.primaryDay = "";
            this.primaryWeek = "primary";
            this.primaryMonth = "";
            this.primaryDateRange = "";
            this.days = 6;
            this.day = false;
            this.week = true;
            this.month = false;
            this.dateRange = false;
            this.weekDate = new Date();
            var dateLocal = new Date();
            var first = this.weekDate.getDate() - this.weekDate.getDay();
            var last = first + 6;
            this.dateFrom = new Date(this.weekDate.setDate(first));
            this.dateTo = new Date(dateLocal.setDate(last));
            this.weekNumber = this.getWeekNumber(this.weekDate);
        }
        else if (clickType == "month") {
            this.primaryDay = "";
            this.primaryWeek = "";
            this.primaryMonth = "primary";
            this.primaryDateRange = "";
            this.day = false;
            this.week = false;
            this.dateRange = false;
            this.month = true;
            this.monthDate = new Date();
            const month = 0 + (this.monthDate.getMonth() + 1);
            const year = this.monthDate.getFullYear();
            //this.days = new Date(year, month, 0).getDate() - 4;
            this.selectedMonth = this.date.toISOString();
            this.dateFrom = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth(), 1);
            this.dateTo = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth() + 1, 0);
        }
        else {
            this.primaryDay = "";
            this.primaryWeek = "";
            this.primaryMonth = "";
            this.primaryDateRange = "primary";
            this.day = false;
            this.week = false;
            this.month = false;
            this.dateRange = true;
            this.dateFrom = new Date();
            this.dateTo = new Date();
        }
        this.dispalyForward = false;
        this.pageIndex = 0;
        this.pageNumber = 1;
        this.selectedAllUser = '';
        this.cdRef.detectChanges();
        this.setDateFrom(this.dateFrom);
        this.setDateTo(this.dateTo);
        this.getAllEmployees();
        // this.getActTrackerUserActivityScreenshots();
    }

    resetUser() {
        this.selectedUser = null;
        this.userId = null;
        this.webAppUsageSearch.userId = null;
        this.selectedAllUser = '';
        this.getActTrackerUserActivityScreenshots();
    }

    filterStatus() {
        // if (this.userId ||
        //     this.fromDate || this.toDate)
        if ((this.fromDate && this.dateRange) || (this.toDate && this.dateRange) || this.selectedUser)
            return true;
        else
            return false;
    }

    timeSheetDetailsForDay(clickType, buttonType) {
        this.todayDate = new Date(this.todayDate);
        if (clickType == "backward") {
            this.todayDate = this.parse(this.todayDate.setDate(buttonType == "week" ? this.todayDate.getDate() - 7 : this.todayDate.getDate() - 1));
            if (buttonType == "week") {
                this.isDay = 8;
                this.dayCount = 1;
                this.isNextDisable = false;
                this.isPreviousDisable = true;
            }
        }
        else {
            this.todayDate = this.parse(this.todayDate.setDate(buttonType == "week" ? this.todayDate.getDate() + 7 : this.todayDate.getDate() + 1));
            if (buttonType == "week") {
                this.isDay = 0;
                this.dayCount = 7;
                this.isNextDisable = true;
                this.isPreviousDisable = false;
            }
        }
        if (this.todayDate <= this.maxDate) {
            if (this.maxDate.toLocaleDateString() == this.todayDate.toLocaleDateString()) {
                this.dispalyForward = false;
            } else {
                this.dispalyForward = true;
            }
            this.setDateFrom(this.todayDate);
            this.setDateTo(this.todayDate);
        }
        else {
            this.dispalyForward = false;
            this.todayDate = this.maxDate;
            this.dateFrom = this.todayDate;
            this.dateTo = this.todayDate;
        }
        this.pageIndex = 0;
        this.pageNumber = 1;
        this.selectedAllUser = '';
        this.getAllEmployees();
        // this.getActTrackerUserActivityScreenshots();
    }

    setDateFrom(date) {
        var day = date.getDate();
        const month = 0 + (date.getMonth() + 1);
        const year = date.getFullYear();
        var newDate = day + '/' + month + '/' + year;
        this.fromDate = this.parse(newDate);
        this.dateFrom = new Date(month + '/' + day + '/' + year + " UTC");
    }

    setDateTo(date) {
        var day = date.getDate();
        const month = 0 + (date.getMonth() + 1);
        const year = date.getFullYear();
        var newDate = day + '/' + month + '/' + year;
        this.toDate = this.parse(newDate);
        this.dateTo = new Date(month + '/' + day + '/' + year + " UTC");
    }

    setFromDate(date) {
        var day = date._i["date"];
        const month = 0 + (date._i["month"] + 1);
        const year = date._i["year"];
        var newDate = day + '/' + month + '/' + year;
        this.fromDate = this.parse(newDate);
        this.dateFrom = new Date(month + '/' + day + '/' + year + " UTC");
    }

    setToDate(date) {
        var day = date._i["date"];
        const month = 0 + (date._i["month"] + 1);
        const year = date._i["year"];
        var newDate = day + '/' + month + '/' + year;
        this.toDate = this.parse(newDate);
        this.dateTo = new Date(month + '/' + day + '/' + year + " UTC");
    }

    parse(value: any): Date | null {
        if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
            const str = value.split('/');
            const year = Number(str[2]);
            const month = Number(str[1]) - 1;
            const date = Number(str[0]);
            return new Date(year, month, date);
        } else if ((typeof value === 'string') && value === '') {
            return new Date();
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
    }

    getScreenshotsBasedOnDate(direction) {
        this.direction = direction;
        var monthValue;
        if (direction === 'right') {
            const day = this.monthDate.getDate();
            const month = 0 + (this.monthDate.getMonth() + 1) + 1;
            const year = this.monthDate.getFullYear();
            const newDate = day + '/' + month + '/' + year;
            this.monthDate = this.parse(newDate);
            this.selectedMonth = this.monthDate.toISOString();
            this.dateFrom = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth(), 1);
            this.dateTo = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth() + 1, 0);
            monthValue = this.monthDate.getMonth() + 1;
        } else {
            const day = this.monthDate.getDate();
            const month = (this.monthDate.getMonth() + 1) - 1;
            const year = 0 + this.monthDate.getFullYear();
            const newDate = day + '/' + month + '/' + year;
            this.monthDate = this.parse(newDate);
            this.selectedMonth = this.monthDate.toISOString();
            this.dateFrom = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth(), 1);
            this.dateTo = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth() + 1, 0);
            monthValue = this.monthDate.getMonth() + 1;
        }
        if (this.dateFrom <= this.maxDate) {
            if ((this.maxDate.getMonth() + 1) == monthValue) {
                this.dispalyForward = false;
            } else {
                this.dispalyForward = true;
            }
            this.pageIndex = 0;
            this.pageNumber = 1;
            this.setDateFrom(this.dateFrom);
            this.setDateTo(this.dateTo);
            this.getAllEmployees();
            this.selectedAllUser = '';
            // this.getActTrackerUserActivityScreenshots();
        }
        else {
            this.dispalyForward = false;
            this.selectedMonth = this.maxDate.toISOString();
            this.dateFrom = this.maxDate;
        }
    }

    getWeekNumber(selectedWeek) {
        const currentDate = selectedWeek.getDate();
        const monthStartDay = (new Date(this.weekDate.getFullYear(), this.weekDate.getMonth(), 1)).getDay();
        const weekNumber = (selectedWeek.getDate() + monthStartDay) / 7;
        const week = (selectedWeek.getDate() + monthStartDay) % 7;
        this.selectedWeek = selectedWeek.toISOString();
        if (week !== 0) {
            return Math.ceil(weekNumber);
        } else {
            return weekNumber;
        }
    }

    getWeekBasedOnDate(direction) {
        this.direction = direction;
        if (direction === 'right') {
            const day = this.weekDate.getDate() + 7;
            const month = 0 + (this.weekDate.getMonth() + 1);
            const year = this.weekDate.getFullYear();
            const newDate = day + '/' + month + '/' + year;
            this.weekDate = this.parse(newDate);
            this.weekNumber = this.getWeekNumber(this.weekDate);
            var first = this.weekDate.getDate() - this.weekDate.getDay();
            var last = first + 6;
            if (first <= 0) {
                first = 1;
                this.dateFrom = new Date(this.parse(newDate).setDate(first));
                this.dateTo = new Date(this.parse(newDate).setDate(last));
            } else {
                this.dateFrom = new Date(this.weekDate.setDate(first));
                this.dateTo = new Date(this.parse(newDate).setDate(last));
            }
        }
        else {
            const day = this.weekDate.getDate() - 7;
            const month = 0 + (this.weekDate.getMonth() + 1);
            const year = this.weekDate.getFullYear();
            const newDate = day + '/' + month + '/' + year;
            this.weekDate = this.parse(newDate);
            this.weekNumber = this.getWeekNumber(this.weekDate);
            var first = this.weekDate.getDate() - this.weekDate.getDay();
            var last = first + 6;
            if (first <= 0) {
                first = 1;
                this.dateFrom = new Date(this.parse(newDate).setDate(first));
                this.dateTo = new Date(this.parse(newDate).setDate(last));
            } else {
                this.dateFrom = new Date(this.weekDate.setDate(first));
                this.dateTo = new Date(this.parse(newDate).setDate(last));
            }
        }
        if (this.dateFrom <= this.maxDate) {
            if (this.dateTo >= this.maxDate) {
                this.dispalyForward = false;
            } else {
                this.dispalyForward = true;
            }
            this.pageIndex = 0;
            this.pageNumber = 1;
            this.setDateFrom(this.dateFrom);
            this.setDateTo(this.dateTo);
            this.getAllEmployees();
            this.selectedAllUser = '';
            // this.getActTrackerUserActivityScreenshots();
        }
        else {
            this.dispalyForward = false;
            this.weekDate = this.parse(this.maxDate);
            this.weekNumber = this.getWeekNumber(this.weekDate);
            this.dateFrom = this.maxDate;
        }
    }

    onDateChange(event: MatDatepickerInputEvent<Date>) {
        this.todayDate = event.target.value;
        this.todayDate = event.target.value;
        this.pageIndex = 0;
        this.pageNumber = 1;
        this.setFromDate(this.todayDate);
        this.setToDate(this.todayDate);
        this.days = 1;
        this.getAllEmployees();
        this.selectedAllUser = '';
        this.getActTrackerUserActivityScreenshots();
    }

    dateFromChanged(event: MatDatepickerInputEvent<Date>) {
        this.fromDate = event.target.value;
        this.minDate = this.fromDate;
        this.pageIndex = 0;
        this.pageNumber = 1;
        this.setFromDate(this.minDate);
        this.setDateTo(this.toDate);
        this.getAllEmployees();
        this.selectedAllUser = '';
        this.getActTrackerUserActivityScreenshots();
    }

    dateToChanged(event: MatDatepickerInputEvent<Date>) {
        this.toDate = event.target.value;
        this.setFromDate(this.minDate);
        this.setToDate(this.toDate);
        this.getAllEmployees();
        this.selectedAllUser = '';
        this.getActTrackerUserActivityScreenshots();
    }

    toggleUsersPerOne() {
        this.webAppUsageSearch.userId = [];
        this.webAppUsageSearch.userId.push(this.selectFilter.value.userIds);
        this.getActTrackerUserActivityScreenshots();
    }

    toggleAllUsersSelected() {
        this.userSelected();
        this.webAppUsageSearch.userId = null;
        this.getActTrackerUserActivityScreenshots();
    }

    userSelected() {
        const userLst = this.employeesDropDown;
        const selected = this.selectFilter.value.userIds;
        const filteredList = _.filter(userLst, function (member) {
            return selected.toString().includes(member.userId);
        })
        const user = filteredList.map((x) => x.name);
        this.selectedUser = user.toString();
    }

    getScreenshotsBasedOnUser(user) {
        this.selectedUserId = user.userId;
        this.selectedAllUser = null;
        this.cdRef.detectChanges();
        // this.getAllEmployees();
        this.getActTrackerUserActivityScreenshots();
    }

    getLatestScreenshots(val) {
        this.selectedAllUser = val;
        var userId = [];
        this.employeeList.forEach(element => {
            userId.push(element.userId);
        });
        this.selectedUserId = val;
        this.selectedUserList = userId;
        this.cdRef.detectChanges();
        // this.getAllEmployees();
        this.getActTrackerUserActivityScreenshots();
    }

    changeState() {
        this.searchText = "";
        this.searchParam = "";
        this.selectedUserId = null;
        this.selectedAllUser = null;
        this.applyActiveFilter(this.temp, true);
    }

    getAllEmployees() {
        this.loading = true;
        var webAppUsage = new WebAppUsageSearchModel();
        webAppUsage.dateFrom = this.dateFrom;
        webAppUsage.dateTo = this.dateTo;
        webAppUsage.isApp = false;
        webAppUsage.isForScreenshots = true;
        this.timeUsageService.getActivityTrackerUserStatus(webAppUsage).subscribe((responseData: any) => {
            if (responseData.success === true) {
                this.employeeList = [];
                this.temp = [];
                this.temp = responseData.data;
                if (this.searchText.length > 0) {
                    this.searchListFilter();
                } else {
                    this.applyActiveFilter(this.temp, true);
                }
            } else {
                this.employeeList = [];
                this.validationMessage = responseData.apiResponseMessages[0].message;
                this.toastrService.error("", this.validationMessage);
              }
            this.loading = false;
        })
    }

    getActTrackerUserActivityScreenshots() {
        this.loading = true;
        this.isSelected = false;
        this.userActivityScreenshots = [];
        this.totalScreenshot = 0;
        this.galleryImages = [];
        this.screenshots = [];
        this.screenId = [];
        this.screen = [];
        this.webAppUsageSearch.userId = [];
        this.webAppUsageSearch.dateFrom = this.dateFrom;
        this.webAppUsageSearch.dateTo = this.dateTo;
        this.webAppUsageSearch.pageNumber = this.pageNumber;
        this.webAppUsageSearch.isApp = true;
        if (this.selectedAllUser == '') {
            var userId = [];
            this.employeeList.forEach(element => {
                userId.push(element.userId);
            });
            this.selectedUserList = userId;
            this.webAppUsageSearch.userId = this.selectedUserList;
            this.webAppUsageSearch.isAllUser = true;
            this.selectedUserId = null;
            this.isAllUser = null;
            this.cdRef.detectChanges();
            this.isAllUser = true;
            this.cdRef.detectChanges();
        } else {
            this.webAppUsageSearch.userId.push(this.selectedUserId);
            this.webAppUsageSearch.isAllUser = false;
            this.isAllUser = null;
            this.cdRef.detectChanges();
            this.isAllUser = false;
            this.cdRef.detectChanges();
        }
        this.timeUsageService.getActTrackerUserActivityScreenshots(this.webAppUsageSearch).subscribe((responseData: any) => {
            if (responseData.success == true) {
                this.userActivityScreenshots = responseData.data;
                if (this.userActivityScreenshots.length == 0) {
                    this.noData = true;
                    this.images = false;
                    this.screenshots = [];
                    this.screen = [];
                } else {
                    this.noData = false;
                    let i = 0;
                    this.totalCount = this.userActivityScreenshots[0].totalCount;
                    this.userActivityScreenshots.forEach(item => {
                        item.screenshotDetails.forEach(x => {
                            if (x.isArchived != true) {
                                this.totalScreenshot = this.totalScreenshot + 1;
                            }
                            this.screen.push(x);
                        })
                        this.images = true;
                        this.screenshots = [];
                        i++;
                    });
                }
            } else {
                this.noData = true;
            }
            this.loading = false;
            this.cdRef.detectChanges();
            if (this.multiPage == "true") {
                this.introStart();
                this.multiPage = null;
            }
        })
    }

    onChange(value) {
        var isExists = false;
        var i = 0;
        this.screenId.forEach(x => {
            if (x === value) {
                var temp = this.screenId.splice(i, 1);
                isExists = true;
                this.isSelected = false;
                if (this.selectAll) {
                    this.selectAll = false;
                }
            }
            i++;
        })
        if (!isExists) {
            this.screenId.push(value);
        }
        if (this.screenId.length > 0) {
            this.isSelected = true;
            if (this.totalScreenshot == this.screenId.length) {
                this.selectAll = true;
            }
        }
    }

    openModal(value) {
        (document.querySelector('.custom-live-modal') as HTMLElement).style.display = "block";
        var i = 0;
        this.screen.forEach(x => {
            if (x.screenShotId === value) {
                this.slideIndex = i + 1;
                this.currentSlide(this.slideIndex);
                this.deletescreenId = x.screenShotId;
            }
            i++;
        })
    }

    closeModal() {
        (document.querySelector('.custom-live-modal') as HTMLElement).style.display = "none";
        this.deletescreenId = null;
        this.connection.stop();
        this.cancelScreenCast = true;
        this.cdRef.detectChanges();
    }

    plusSlides(n) {
        this.slideIndex = this.slideIndex + n;
        this.deletescreenId = this.screen[this.slideIndex - 1].screenShotId;
        this.currentSlide(this.slideIndex);
    }

    currentSlide(n) {
        this.slideIndex = n;
        if (this.slideIndex == 1) {
            this.prevarrow = false;
            this.nextarrow = true;
        }
        else if (this.slideIndex == this.screen.length && this.slideIndex != 1) {
            this.prevarrow = true;
            this.nextarrow = false;
        }
        else if (this.slideIndex == this.screen.length && this.slideIndex == 1) {
            this.prevarrow = false;
            this.nextarrow = false;
        }
        else {
            this.prevarrow = true;
            this.nextarrow = true;
        }
        this.showSlides(this.slideIndex);
    }

    showSlides(n) {
        var i;
        (document.querySelector('.my-live-slides') as HTMLElement).style.display = "none";
        this.screenImg = this.screen[this.slideIndex - 1].screenShotUrl;
        this.imageDetails = this.screen[this.slideIndex - 1];
        (document.querySelector('.my-live-slides') as HTMLElement).style.display = "block";
    }

    deleteScreenshots(formDirective: FormGroupDirective) {
        this.deleteForm.controls["reason"].setValidators([Validators.required,
        Validators.maxLength(ConstantVariables.MaxLength)]);
        this.deleteForm.controls["reason"].updateValueAndValidity();
        if (this.deleteForm.valid) {
            var deleteScreenshot = new DeleteScreenShotModel();
            var id = this.deletescreenId;
            if (this.deletescreenId != null) {
                deleteScreenshot.ScreenshotId = [];
                deleteScreenshot.ScreenshotId.push(this.deletescreenId);
                this.closeModal();
            }
            else {
                deleteScreenshot.ScreenshotId = this.screenId;
            }
            deleteScreenshot.Reason = this.deleteForm.value.reason;
            this.timeUsageService.deleteMultipleScreenshots(deleteScreenshot).subscribe((responseData: any) => {
                var data = responseData.data;
                if (responseData.success) {
                    formDirective.resetForm();
                    //this.deleteForm.clearValidators();
                    this.formValidate();
                    this.deleteScreenshotPopover.forEach((p) => p.closePopover());
                    this.getActTrackerUserActivityScreenshots();
                    this.screenId = [];
                    this.deletescreenId = null;
                    if (id == null) {
                        this.isSelected = false;
                    }
                }
            })
        }
    }

    closePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.deleteForm.reset();
        //this.deleteForm.clearValidators();
        //this.formValidate();
        this.deleteForm.get('reason').clearValidators();
        this.deleteForm.get('reason').updateValueAndValidity();

        this.deleteScreenshotPopover.forEach((p) => p.closePopover());
    }

    openDeletePopup(deleteScreenshotPopUp) {
        this.deleteForm.reset();
        deleteScreenshotPopUp.openPopover();
    }

    onChecked(value) {
        this.selectAll = value.checked;
        this.screenId = [];
        if (this.selectAll) {
            this.userActivityScreenshots.forEach(item => {
                item.screenshotDetails.forEach(x => {
                    if (!x.isArchived) {
                        this.screenId.push(x.screenShotId);
                        x.isSelected = true;
                    }
                });
            })
        }
        else {
            this.screenId = [];
            this.isSelected = false;
            this.userActivityScreenshots.forEach(item => {
                item.screenshotDetails.forEach(x => {
                    x.isSelected = false;
                });
            })
        }

    }

    onDeleted($event) {
        this.getAllEmployees();
        this.getActTrackerUserActivityScreenshots();
    }

    search(event) {
        if (event != null) {
            this.searchText = event.target.value;
            this.searchParam = event.target.value.toLowerCase();
            this.searchParam = this.searchParam.trim();
        } else {
            this.searchParam = "";
            this.searchParam = "";
        }
        const temp = this.temp.filter(data =>
            (data.userName == null ? null : data.userName.toString().toLowerCase().indexOf(this.searchParam) > -1))
        this.applyActiveFilter(temp, false);
    }

    searchListFilter() {
        const temp = this.temp.filter(data =>
            (data.userName == null ? null : data.userName.toString().toLowerCase().indexOf(this.searchParam) > -1))
        this.applyActiveFilter(temp, true);
    }

    applyActiveFilter(temp: any, navigateToAll) {
        let filteredList = [];
        if (this.isActive == 1) {
            filteredList = temp.filter(data => (data.status == true));
        } else if (this.isActive == 2) {
            filteredList = temp.filter(data => (data.status == false));
        } else {
            filteredList = temp;
        }
        this.sortingEmployees(filteredList, navigateToAll);
    }

    resetAllFilters() {
        this.sortBy = 1;
        this.searchParam = '';
        this.searchText = '';
        this.isActive = 0;
        this.search(null);
    }

    sortingEmployees(temp: any, navigateToAll: boolean = false) {
        var sortedArray = temp;
        if (temp && temp.length > 0) {
            if (this.sortBy == 0) {
                sortedArray.sort((n1, n2) => n1.screenshotCount - n2.screenshotCount);
            } else if (this.sortBy == 1) {
                sortedArray.sort((n1, n2) => n2.screenshotCount - n1.screenshotCount);
            } else if (this.sortBy == 2) {
                sortedArray.sort((a, b) => {
                    if (a.userName > b.userName) {
                        return 1;
                    } else if (a.userName < b.userName) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
            } else if (this.sortBy == 3) {
                sortedArray.sort((a, b) => {
                    if (a.userName > b.userName) {
                        return -1;
                    } else if (a.userName < b.userName) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            } else if (this.sortBy == 4) {
                sortedArray.sort((a, b) => {
                    return new Date(b.activeTime).getTime() - new Date(a.activeTime).getTime();
                });
            } else if (this.sortBy == 5) {
                sortedArray.sort((a, b) => {
                    return new Date(a.activeTime).getTime() - new Date(b.activeTime).getTime();
                });
            }
            this.employeeList = sortedArray;
            this.cdRef.detectChanges();
            if (navigateToAll) {
                this.getLatestScreenshots('');
            }
        } else {
            this.employeeList = sortedArray;
            this.cdRef.detectChanges();
        }
    }

    closeSearch() {
        this.searchText = '';
        this.searchParam = '';
        this.search(null);
    }

    onSortChange(event) {
        this.sortingEmployees(this.employeeList, false);
    }

    getScreenshots(pageEvent) {
        if (pageEvent.pageSize != this.pageSize) {
            this.pageNumber = 1;
        }
        else {
            this.pageNumber = pageEvent.pageIndex + 1;
        }
        this.pageSize = pageEvent.pageSize;
        this.webAppUsageSearch.pageSize = this.pageSize;
        this.webAppUsageSearch.pageNumber = this.pageNumber;
        this.getActTrackerUserActivityScreenshots();
    }

    previous() {
        if (this.dayCount == 7) {
            this.isNextDisable = false;
        }
        this.isDay = this.isDay + 1;
        this.dayCount = this.dayCount - 1;
        if (this.dayCount == 1) {
            this.isPreviousDisable = true;
        } else {
            this.isPreviousDisable = false;
        }
    }

    next() {
        if (this.dayCount == 1) {
            this.isPreviousDisable = false;
        }
        this.dayCount = this.dayCount + 1;
        this.isDay = this.isDay + 1;
        if (this.dayCount == 7) {
            this.isNextDisable = true;
        } else {
            this.isNextDisable = false;
        }
    }

    introStart() {
        const navigationExtras: NavigationExtras = {
            queryParams: { multipage: true },
            queryParamsHandling: 'merge',
            // preserveQueryParams: true
        }

        this.introJS.setOption('doneLabel', 'Next page').start().oncomplete(() => {
            if (this.canAccess_feature_ViewEmployeeWebAppUsage) {
                this.router.navigate(["activitytracker/activitydashboard/detailedusage"], navigationExtras);
            }
            else if (this.canAccess_feature_ManageActivityConfig) {
                this.router.navigate(["activitytracker/activitydashboard/configuration"], navigationExtras);
            }
            else if (this.canAccess_feature_ManageActivityConfig) {
                this.router.navigate(["activitytracker/activitydashboard/configurationHistory"], navigationExtras);
            }
        });
    }

    // openLiveCastDialog() {
    //     let dialogId = "live-cast"
    //     const dialogRef = this.dialog.open(this.liveCastDialog, {
    //         width: "90%",
    //         direction: 'ltr',
    //         data: {
    //             liveImageUserName: this.liveImageUserName, liveImageUserProfileImage: this.liveImageUserProfileImage, dialogId: dialogId,
    //             liveImageroleName: this.liveImageroleName, liveScreentimeZoneName: this.liveScreentimeZoneName, livescreenShotDateTime: this.livescreenShotDateTime
    //         },
    //         height: "78vh",
    //         disableClose: true,
    //         id: dialogId
    //     });
    //     dialogRef.afterClosed().subscribe((result) => {
    //         this.connection.stop();
    //         this.cancelScreenCast = true;
    //         this.cdRef.detectChanges();
    //     });
    // }

    // startTimer() {
    //     this.interval = setInterval(() => {
    //         this.totalLoadingTime++;
    //     }, 1000)
    // }

    // closeLoader() {
    //     this.loader = false;
    //     clearInterval(this.interval);
    //     this.cdRef.detectChanges();
    // }
}