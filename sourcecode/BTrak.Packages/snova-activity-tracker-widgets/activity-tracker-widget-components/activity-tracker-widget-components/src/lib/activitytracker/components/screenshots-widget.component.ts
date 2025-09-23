import { ActivityTrackerService } from '../services/activitytracker-services';
import { Component, ElementRef, OnInit, ViewChild, ViewChildren, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import * as _ from 'underscore';

import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DeleteScreenShotModel } from '../models/delete-screenshot-model';
import { EmployeeOfRoleModel } from '../models/employee-of-role-model';
import { WebAppUsageSearchModel } from '../models/web-app-usage-search-model';
import { EmployeeModel } from '../models/employee-model';
import { ScreenshotModel } from '../models/screenshot-model';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';

export const MY_FORMATS = {
    parse: {
        dateInput: "LL",
    },
    display: {
        dateInput: "LL",
        monthYearLabel: "MMM YYYY",
        dateA11yLabel: "LL",
        monthYearA11yLabel: "MMMM YYYY",
    }
};

// tslint:disable-next-line: max-classes-per-file
@Component({
    selector: "app-fm-component-screenshots-widget",
    templateUrl: `screenshots-widget.component.html`,
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
    ]
})

export class ScreenshotWidgetComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChild("myModal") divView: ElementRef;
    @ViewChildren("deleteScreenshotPopUp") deleteScreenshotPopover;
    @ViewChild("allUsersSelected") private allUsersSelected: MatOption;
    // @ViewChild("deleteFormDirective") deleteFormDirective: FormGroupDirective;
    @Output() isDeleted = new EventEmitter();

    @Input("data")
    set _screenshots(data) {
        this.formValidate();
        if (data && data.length > 0) {
            this.images = true;
            this.noData = false;
            this.screen = [];
            this.userActivityScreenshots = data;
            this.totalScreenshot = 0;
            // this.totalScreenshot = this.userActivityScreenshots[0].totalCount;
            let i = 0;
            this.userActivityScreenshots.forEach((item) => {
                item.screenshotDetails.forEach((x) => {
                    if (x.isArchived != true) {
                        this.totalScreenshot = this.totalScreenshot + 1;
                    }
                    this.screen.push(x);
                })
                this.images = true;
                i++;
            });
        } else {
            this.images = false;
            this.noData = true;
            this.userActivityScreenshots = [];
            this.screen = [];
            this.totalScreenshot = 0;
        }
        this.cdRef.detectChanges();
    }

    @Input("screenshotPopups")
    set _screenshotPopups(data) {
        this.formValidate();
        if (data.length > 0 && this.userActivityScreenshots[0].totalCount == data.length) {
            this.noData = false;
            this.images = true;
            this.screen = data;
        } else {
            if (this.userActivityScreenshots.length > 0) {
                let i = 0;
                this.totalScreenshot = 0;
                this.userActivityScreenshots.forEach((item) => {
                    item.screenshotDetails.forEach((x) => {
                        if (x.isArchived != true) {
                            this.totalScreenshot = this.totalScreenshot + 1;
                        }
                        this.screen.push(x);
                    })
                    this.images = true;
                    this.noData = false;
                    i++;
                });
            } else {
                this.noData = true;
                this.images = false;
            }
        }
        this.cdRef.detectChanges();
    }

    galleryImages: ScreenshotModel[];
    emptyImages: ScreenshotModel[];
    screenshots: any[] = [];
    employeesDropDown: EmployeeModel[];
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
    time = 480;
    totalCount = 0;
    direction: any;
    searchText = "";
    sortBy: string = null;
    type: string = ConstantVariables.Month;
    primaryDay = "primary";
    primaryWeek: string;
    primaryMonth: string;
    primaryDateRange: string;
    validationMessage: string;
    selectedUser: string;
    day = true;
    week: boolean;
    month: boolean;
    prevarrow = false;
    nextarrow = false;
    dateRange: boolean;
    images = false;
    isSelected = false;
    isPreview = false;
    selectAll = false;
    isSelectAllUsers = false;
    dispalyForward = false;
    screenId: any[] = [];
    deletescreenId: string;
    screen: any[] = [];
    screenImg: string;
    imageDetails: any;
    slideIndex = 1;
    totalScreenshot = 0;
    userId: string;
    loading = false;
    noData = false;
    userLength: boolean = false;
    pageSizeOptions: number[] = [25, 50, 100, 150, 200];
    pageSize: number = 100;
    pageNumber: number = 1;

    // tslint:disable-next-line: max-line-length
    constructor(private datePipe: DatePipe, private cdRef: ChangeDetectorRef,
        private timeUsageService: ActivityTrackerService) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.loading = true;
        // this.getEmployees();
        this.formValidate();
        // this.getLoggedInUser();
        this.setDateFrom(this.fromDate);
        this.setDateTo(this.dateTo);
        // this.getActTrackerUserActivityScreenshots();
    }

    formValidate() {

        this.deleteForm = new FormGroup({
            reason: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            )
        }),
            this.selectFilter = new FormGroup({
                userIds: new FormControl("",
                    Validators.compose([
                    ])
                )
            })
    }

    dayTypeForTimeUsage(clickType) {
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
        } else if (clickType == "week") {
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
            let dateLocal = new Date();
            let first = this.weekDate.getDate() - this.weekDate.getDay();
            let last = first + 6;
            this.dateFrom = new Date(this.weekDate.setDate(first));
            this.dateTo = new Date(dateLocal.setDate(last));
            this.weekNumber = this.getWeekNumber(this.weekDate);
        } else if (clickType == "month") {
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
            // this.days = new Date(year, month, 0).getDate() - 4;
            this.selectedMonth = this.date.toISOString();
            this.dateFrom = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth(), 1);
            this.dateTo = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth() + 1, 0);
        } else {
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
        this.setDateFrom(this.dateFrom);
        this.setDateTo(this.dateTo);
        this.getActTrackerUserActivityScreenshots();
    }

    changeUser(value) {
        if (value == "") {
            this.selectedUser = null;
            this.userId = null;
        } else {
            let employeesDropdown = this.employeesDropDown;
            let selectedEmployees = _.filter(employeesDropdown, function (employee) {
                return value.toString().includes(employee.userId);
            })
            this.selectedUser = selectedEmployees.map((x) => x.name).toString();
        }
    }

    resetUser() {
        this.selectedUser = null;
        this.userId = null;
        this.webAppUsageSearch.userId = null;
        this.getActTrackerUserActivityScreenshots();
    }

    filterStatus() {
        if (this.userId ||
            this.fromDate || this.toDate) {
            return true;
        }
        else {
            return false;
        }
    }

    timeSheetDetailsForDay(clickType, buttonType) {
        this.todayDate = new Date(this.todayDate);
        if (clickType == "backward") {
            this.todayDate = this.parse(this.todayDate.setDate(buttonType == "week" ? this.todayDate.getDate() - 7 : this.todayDate.getDate() - 1));
        } else {
            this.todayDate = this.parse(this.todayDate.setDate(buttonType == "week" ? this.todayDate.getDate() + 7 : this.todayDate.getDate() + 1));
        }
        if (this.todayDate <= this.maxDate) {
            if (this.maxDate.toLocaleDateString() == this.todayDate.toLocaleDateString()) {
                this.dispalyForward = false;
            } else {
                this.dispalyForward = true;
            }
            this.setDateFrom(this.todayDate);
            this.setDateTo(this.todayDate);
            this.getActTrackerUserActivityScreenshots();
        } else {
            this.dispalyForward = false;
            this.todayDate = this.maxDate;
            this.dateFrom = this.todayDate;
            this.dateTo = this.todayDate;
            this.getActTrackerUserActivityScreenshots();
        }

    }

    setDateFrom(date) {
        let day = date.getDate();
        const month = 0 + (date.getMonth() + 1);
        const year = date.getFullYear();
        let newDate = day + "/" + month + "/" + year;
        this.fromDate = this.parse(newDate);
        day += 1;
        newDate = day + "/" + month + "/" + year;
        this.dateFrom = this.parse(newDate);
    }

    setDateTo(date) {
        let day = date.getDate();
        const month = 0 + (date.getMonth() + 1);
        const year = date.getFullYear();
        let newDate = day + "/" + month + "/" + year;
        this.toDate = this.parse(newDate);
        day += 1;
        newDate = day + "/" + month + "/" + year;
        this.dateTo = this.parse(newDate);
    }

    setFromDate(date) {
        let day = date._a[2];
        const month = 0 + (date._a[1] + 1);
        const year = date._a[0];
        let newDate = day + "/" + month + "/" + year;
        this.fromDate = this.parse(newDate);
        day += 1;
        newDate = day + "/" + month + "/" + year;
        this.dateFrom = this.parse(newDate);
    }

    setToDate(date) {
        let day = date._a[2];
        const month = 0 + (date._a[1] + 1);
        const year = date._a[0];
        let newDate = day + "/" + month + "/" + year;
        this.toDate = this.parse(newDate);
        day += 1;
        newDate = day + "/" + month + "/" + year;
        this.dateTo = this.parse(newDate);
    }

    parse(value: any): Date | null {
        if ((typeof value === "string") && (value.indexOf("/") > -1)) {
            const str = value.split("/");
            const year = Number(str[2]);
            const month = Number(str[1]) - 1;
            const date = Number(str[0]);
            return new Date(year, month, date);
        } else if ((typeof value === "string") && value === "") {
            return new Date();
        }
        const timestamp = typeof value === "number" ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
    }

    getDevQualityBasedOnDate(direction) {
        this.direction = direction;
        let monthValue;
        if (direction === "right") {
            const day = this.monthDate.getDate();
            const month = 0 + (this.monthDate.getMonth() + 1) + 1;
            const year = this.monthDate.getFullYear();
            const newDate = day + "/" + month + "/" + year;
            this.monthDate = this.parse(newDate);
            this.selectedMonth = this.monthDate.toISOString();
            this.dateFrom = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth(), 1);
            this.dateTo = new Date(this.monthDate.getFullYear(), this.monthDate.getMonth() + 1, 0);
            monthValue = this.monthDate.getMonth() + 1;
        } else {
            const day = this.monthDate.getDate();
            const month = (this.monthDate.getMonth() + 1) - 1;
            const year = 0 + this.monthDate.getFullYear();
            const newDate = day + "/" + month + "/" + year;
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
            this.setDateFrom(this.dateFrom);
            this.setDateTo(this.dateTo);
            this.getActTrackerUserActivityScreenshots();
        } else {
            this.dispalyForward = false;
            this.selectedMonth = this.maxDate.toISOString();
            this.dateFrom = this.maxDate;
        }
        // this.setDateFrom(this.dateFrom);
        // this.setDateTo(this.dateTo);
        // this.getActTrackerUserActivityScreenshots();
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
        if (direction === "right") {
            const day = this.weekDate.getDate() + 7;
            const month = 0 + (this.weekDate.getMonth() + 1);
            const year = this.weekDate.getFullYear();
            const newDate = day + "/" + month + "/" + year;
            this.weekDate = this.parse(newDate);
            this.weekNumber = this.getWeekNumber(this.weekDate);
            let first = this.weekDate.getDate() - this.weekDate.getDay();
            let last = first + 6;
            if (first <= 0) {
                first = 1;
                this.dateFrom = new Date(this.parse(newDate).setDate(first));
                this.dateTo = new Date(this.parse(newDate).setDate(last));
            } else {
                this.dateFrom = new Date(this.weekDate.setDate(first));
                this.dateTo = new Date(this.parse(newDate).setDate(last));
            }
        } else {
            const day = this.weekDate.getDate() - 7;
            const month = 0 + (this.weekDate.getMonth() + 1);
            const year = this.weekDate.getFullYear();
            const newDate = day + "/" + month + "/" + year;
            this.weekDate = this.parse(newDate);
            this.weekNumber = this.getWeekNumber(this.weekDate);
            let first = this.weekDate.getDate() - this.weekDate.getDay();
            let last = first + 6;
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
            this.setDateFrom(this.dateFrom);
            this.setDateTo(this.dateTo);
            this.getActTrackerUserActivityScreenshots();
        } else {
            this.dispalyForward = false;
            this.weekDate = this.parse(this.maxDate);
            this.weekNumber = this.getWeekNumber(this.weekDate);
            this.dateFrom = this.maxDate;
        }
        // this.setDateFrom(this.dateFrom);
        // this.setDateTo(this.dateTo);
        // this.getActTrackerUserActivityScreenshots();
    }

    onDateChange(event: MatDatepickerInputEvent<Date>) {
        this.todayDate = event.target.value;
        this.todayDate = event.target.value;
        this.setFromDate(this.todayDate);
        this.setToDate(this.todayDate);
        this.days = 1;
        this.getActTrackerUserActivityScreenshots();
    }

    dateFromChanged(event: MatDatepickerInputEvent<Date>) {
        this.fromDate = event.target.value;
        this.minDate = this.fromDate;
        this.setFromDate(this.minDate);
        this.setDateTo(this.toDate);
        this.getActTrackerUserActivityScreenshots();
    }

    dateToChanged(event: MatDatepickerInputEvent<Date>) {
        this.toDate = event.target.value;
        this.setFromDate(this.minDate);
        this.setToDate(this.toDate);
        this.getActTrackerUserActivityScreenshots();
    }

    toggleUsersPerOne(value) {
        // if (this.allUsersSelected.selected) {
        //     this.allUsersSelected.deselect();
        //     this.isSelectAllUsers = false;
        //     this.webAppUsageSearch.userId = this.selectFilter.value.userIds;
        //     this.getActTrackerUserActivityScreenshots();
        //     return false;
        // }
        // if (this.selectFilter.get("userIds").value.length === this.employeesDropDown.length) {
        //     this.allUsersSelected.select();
        //     this.isSelectAllUsers = true;
        //     this.webAppUsageSearch.userId = this.selectFilter.value.userIds;
        //     this.getActTrackerUserActivityScreenshots();
        // }
        // if (this.selectFilter.get("userIds").value.length < this.employeesDropDown.length) {
        //     this.allUsersSelected.deselect();
        //     this.isSelectAllUsers = false;
        //     this.webAppUsageSearch.userId = this.selectFilter.value.userIds;
        //     this.getActTrackerUserActivityScreenshots();
        // }
        this.webAppUsageSearch.userId = [];
        this.webAppUsageSearch.userId.push(this.selectFilter.value.userIds);
        this.getActTrackerUserActivityScreenshots();
    }

    toggleAllUsersSelected() {
        // if (this.allUsersSelected.selected && this.isSelectAllUsers == false) {
        //     this.selectFilter.get("userIds").patchValue([
        //         ...this.employeesDropDown.map((item) => item.userId),
        //         0
        //     ]);
        //     // this.selectedBranchIds = this.branchesList.map((item) => item.branchId);
        //     this.isSelectAllUsers = true;
        // } else {
        //     this.selectFilter.get("userIds").patchValue([]);
        //     this.isSelectAllUsers = false;
        // }
        this.userSelected();
        this.webAppUsageSearch.userId = null;
        this.getActTrackerUserActivityScreenshots();
    }

    userSelected() {
        const userLst = this.employeesDropDown;
        const selected = this.selectFilter.value.userIds;
        // tslint:disable-next-line: only-arrow-functions
        const filteredList = _.filter(userLst, function (member) {
            return selected.toString().includes(member.userId);
        })
        const user = filteredList.map((x) => x.name);
        this.selectedUser = user.toString();
    }

    getEmployees() {
        this.timeUsageService.getAllEmployee(new EmployeeOfRoleModel()).subscribe((responseData: any) => {
            this.employeesDropDown = [];
            this.employeesDropDown = responseData.data;
            if (this.employeesDropDown.length > 1) {
                this.userLength = true;
            } else {
                this.userLength = false;
            }
            // this.cdRef.detectChanges();
        })
    }

    getLoggedInUser() {
        this.timeUsageService.getLoggedInUser().subscribe((responseData: any) => {
            this.loggedUser = responseData.data.id;
            let logId = [];
            logId.push(this.loggedUser);
            this.selectFilter.get("userIds").patchValue(this.loggedUser);
            this.webAppUsageSearch.userId = logId;
            let employeesDropdown = this.employeesDropDown;
            let selectedEmployees = _.filter(employeesDropdown, function (employee) {
                return logId.toString().includes(employee.userId);
            })
            this.selectedUser = selectedEmployees.map((x) => x.name).toString();
            this.webAppUsageSearch.pageSize = this.pageSize;
            this.webAppUsageSearch.pageNumber = this.pageNumber;
            this.getActTrackerUserActivityScreenshots();
            // this.cdRef.detectChanges();
        })
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

    getActTrackerUserActivityScreenshots() {
        this.loading = true;
        this.isSelected = false;
        this.userActivityScreenshots = [];
        this.totalScreenshot = 0;
        this.galleryImages = [];
        this.screenshots = [];
        this.screenId = [];
        this.screen = [];
        this.webAppUsageSearch.dateFrom = this.dateFrom;
        this.webAppUsageSearch.dateTo = this.dateTo;
        this.timeUsageService.getActTrackerUserActivityScreenshots(this.webAppUsageSearch).subscribe((responseData: any) => {
            if (responseData.success == true) {
                this.userActivityScreenshots = responseData.data;
                if (this.userActivityScreenshots.length == 0) {
                    this.noData = true;
                }
                if (this.userActivityScreenshots.length > 0) {
                    this.noData = false;
                    let i = 0;
                    this.totalCount = this.userActivityScreenshots[0].totalCount;
                    this.userActivityScreenshots.forEach((item) => {
                        item.screenshotDetails.forEach((x) => {
                            if (x.isArchived != true) {
                                this.totalScreenshot = this.totalScreenshot + 1;
                            }
                            this.screen.push(x);
                        })
                        this.images = true;
                        i++;
                    });
                } else {
                    this.images = false;
                    this.screenshots = [];
                    this.screen = [];
                }
            }
            this.loading = false;
            console.log(this.screen);
        })
    }

    onChange(value) {
        let isExists = false;
        let i = 0;
        this.screenId.forEach((x) => {
            if (x === value) {
                let temp = this.screenId.splice(i, 1);
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
        (document.querySelector(".custom-modal") as HTMLElement).style.display = "block";
        let i = 0;
        this.screen.forEach((x) => {
            if (x.screenShotId === value) {
                this.slideIndex = i + 1;
                this.currentSlide(this.slideIndex);
                this.deletescreenId = x.screenShotId;
            }
            i++;
        })
    }

    closeModal() {
        (document.querySelector(".custom-modal") as HTMLElement).style.display = "none";
        this.deletescreenId = null;
    }

    plusSlides(n) {
        this.slideIndex = this.slideIndex + n;
        // this.deletescreenId = this.screen[this.slideIndex - 1].screenShotId;
        this.currentSlide(this.slideIndex);
    }

    currentSlide(n) {
        this.slideIndex = n;
        if (this.slideIndex == 1 && this.slideIndex != this.screen.length) {
            // this.prevarrow = false;
            this.prevarrow = true;
            this.nextarrow = true;
        } else if (this.slideIndex == this.screen.length && this.slideIndex != 1) {
            this.prevarrow = true;
            // this.nextarrow = false
            this.nextarrow = true;
        } else if (this.slideIndex == this.screen.length && this.slideIndex == 1) {
            this.prevarrow = false;
            this.nextarrow = false;
        } else {
            this.prevarrow = true;
            this.nextarrow = true;
            if (this.slideIndex > this.screen.length) {
                this.slideIndex = 1;
            }
            if (this.slideIndex <= 0) {
                this.slideIndex = this.screen.length;
            }
        }
        this.deletescreenId = this.screen[this.slideIndex - 1].screenShotId;
        this.showSlides(this.slideIndex);
    }

    showSlides(n) {
        let i;
        (document.querySelector(".mySlides") as HTMLElement).style.display = "none";
        this.screenImg = this.screen[this.slideIndex - 1].screenShotUrl;
        this.imageDetails = this.screen[this.slideIndex - 1];
        (document.querySelector(".mySlides") as HTMLElement).style.display = "block";
    }

    deleteScreenshots(formDirective: FormGroupDirective) {
        this.deleteForm.controls["reason"].setValidators([Validators.required,
        Validators.maxLength(ConstantVariables.MaxLength)]);
        this.deleteForm.controls["reason"].updateValueAndValidity();
        if (this.deleteForm.valid) {
            let deleteScreenshot = new DeleteScreenShotModel();
            let id = this.deletescreenId;
            if (this.deletescreenId != null) {
                deleteScreenshot.ScreenshotId = [];
                deleteScreenshot.ScreenshotId.push(this.deletescreenId);
                this.closeModal();
            } else {
                deleteScreenshot.ScreenshotId = this.screenId;
            }
            deleteScreenshot.Reason = this.deleteForm.value.reason;
            this.timeUsageService.deleteMultipleScreenshots(deleteScreenshot).subscribe((responseData: any) => {
                let data = responseData.data;
                if (responseData.success) {
                    formDirective.resetForm();
                    // this.deleteForm.clearValidators();
                    this.formValidate();
                    this.deleteScreenshotPopover.forEach((p) => p.closePopover());
                    // this.getActTrackerUserActivityScreenshots();
                    this.screenId = [];
                    this.deletescreenId = null;
                    if (id == null) {
                        this.isSelected = false;
                    }
                    this.isDeleted.emit('');
                }
            })
        }
    }

    closePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.deleteForm.reset();
        // this.deleteForm.clearValidators();
        // this.formValidate();
        this.deleteForm.get("reason").clearValidators();
        this.deleteForm.get("reason").updateValueAndValidity();

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
            this.userActivityScreenshots.forEach((item) => {
                item.screenshotDetails.forEach((x) => {
                    if (!x.isArchived) {
                        this.screenId.push(x.screenShotId);
                        x.isSelected = true;
                    }
                });
            })
        } else {
            this.screenId = [];
            this.isSelected = false;
            this.userActivityScreenshots.forEach((item) => {
                item.screenshotDetails.forEach((x) => {
                    x.isSelected = false;
                });
            })
        }
    }
}