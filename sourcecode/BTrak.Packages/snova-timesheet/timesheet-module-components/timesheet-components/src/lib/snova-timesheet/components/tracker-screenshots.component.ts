import { Component, Input, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { DeleteScreenShotModel } from '../models/delete-screenshot-model';
import { WebAppUsageSearchModel } from '../models/web-app-usage-search-model';
import { TimeSheetService } from '../services/timesheet.service';

@Component({
    selector: "app-ts-component-trackerscreenshots",
    templateUrl: "tracker-screenshots.component.html",
})

export class TrackerScreenshotsComponent {

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {

            let trackerData = data[0] ? data[0] : data;
            if (trackerData) {

                if (trackerData.dialogId) {
                    this.currentDialogId = trackerData.dialogId;
                    this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
                    this.userStoryId = trackerData.userStoryId;
                    this.selectedUserId = trackerData.loggedUserId;
                }

                if (!trackerData.dateFrom) {
                    trackerData.dateFrom = new Date();
                }
                if (!trackerData.dateTo) {
                    trackerData.dateTo = new Date();
                }

                this.dateFrom = trackerData.dateFrom;
                this.dateTo = trackerData.dateTo;
                if (this.currentDialog) {
                    let dateFrom = trackerData.dateFrom.toString().split('T');
                    let dateTo = trackerData.dateTo.toString().split('T');
                    this.dateFrom = dateFrom[0];
                    this.dateTo = dateTo[0];
                }

                if (this.currentDialog) {
                    this.getActTrackerUserActivityScreenshotsByWorkItemId();
                }
                else {
                    this.user.push(trackerData.userId);
                    this.getActTrackerUserActivityScreenshots();
                }
            }
        }
    }

    @ViewChildren("deleteScreenshotPopUp") deleteScreenshotPopover;

    webAppUsageSearch: WebAppUsageSearchModel = new WebAppUsageSearchModel();
    dateFrom: Date;
    dateTo: Date;
    loading: boolean;
    userActivityScreenshots: any[] = [];
    isSelected: boolean;
    noData: boolean;
    pageSizeOptions: number[] = [25, 50, 100, 150, 200];
    pageSize: number = 25;
    pageNumber: number = 1;
    pageIndex: number = 0;
    totalCount: number;
    totalScreenshot = 0;
    screen: any[] = [];
    images: boolean;
    deleteForm: FormGroup;
    selectFilter: FormGroup;
    slideIndex = 1;
    deletescreenId: string;
    prevarrow = false;
    nextarrow = false;
    isPreview = false
    screenImg: string;
    imageDetails: any;
    screenId: any[] = [];
    selectAll = false;
    currentDialogId: string;
    currentDialog: any;
    user: any[] = [];
    userStoryId: string;
    selectedUserId: string;
    public labels = {

        rotation: 75,

    };
    timeZone: string;
    max: number;
    areaChart: boolean = true;
    barChart: boolean = false;

    constructor(private timeSheetService: TimeSheetService, public dialog: MatDialog, private cookieService: CookieService, private translateService: TranslateService) {

    }

    ngOnInit() {
        this.formValidate();
    }

    getActTrackerUserActivityScreenshots() {
        this.loading = true;
        this.isSelected = false;
        this.userActivityScreenshots = [];
        this.totalScreenshot = 0;
        this.max = null;
        // this.galleryImages = [];
        // this.screenshots = [];
        // this.screenId = [];
        this.screen = [];
        this.webAppUsageSearch.dateFrom = this.dateFrom;
        this.webAppUsageSearch.dateTo = this.dateTo;
        this.webAppUsageSearch.isApp = true;
        this.webAppUsageSearch.userId = this.user;
        this.webAppUsageSearch.pageNumber = this.pageNumber;
        this.webAppUsageSearch.pageSize = this.pageSize;
        this.timeSheetService.getActTrackerUserActivityScreenshots(this.webAppUsageSearch).subscribe((responseData: any) => {
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
                        item['xAxis'] = [];
                        item['keyStroke'] = [];
                        item['mouseMovement'] = [];
                        item['dummyData'] = [];
                        if (item.trackerChartDetails) {
                            item.trackerChartDetails.forEach(element => {
                                // let hour = element.trackedHour.toString();
                                // let min = (element.tenthMinute * 10).toString();
                                // if (min == "0")
                                //     min = "00";
                                // item.xAxis.push(hour + ':' + min);
                                // this.timeZone = this.translateService.instant('ACTIVITYTRACKER.ALLTIMINGSAREINUTC') + element.timeAbbreviation;
                                // item.xAxis.push(element.formatedTime + ' ' + element.timeAbbreviation);
                                if(element.timeZoneAbbreviation)
                                this.timeZone = "All timings are in " + element.timeZoneAbbreviation;
                                // let userModel = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModel));
                                // let timeZoneId = userModel.timeZoneId;
                                // if (timeZoneId && element.timeZoneId && timeZoneId.toLowerCase() != element.timeZoneId.toLowerCase())
                                //     item.xAxis.push(element.endTime + ' ' + element.timeZoneAbbreviation);
                                // else
                                    item.xAxis.push(element.endTime);
                                //item.xAxis.push(element.trackedTenthMinute);
                                item.keyStroke.push(element.keyStroke);
                                item.mouseMovement.push(element.mouseMovement);
                                item.dummyData.push(element.keyStroke + element.mouseMovement);
                                //item.dummyData.push(element.mouseMovement);
                            });
                            if (item.dummyData.length > 0) {
                                let max = Math.max.apply(Math, item.dummyData);
                                if (max < 50) {
                                    this.max = 50;
                                }
                                else if (max < 1000) {
                                    let intialDigit;
                                    intialDigit = max.toString().charAt(0);
                                    this.max = (parseInt("" + intialDigit) + 1) * 100;
                                }
                                else {
                                    this.max = 1000;
                                }
                            }
                            else {
                                this.max = 1000;
                            }
                        }

                        item.screenshotDetails.forEach((x) => {
                            if (x.isArchived != true) {
                                this.totalScreenshot = this.totalScreenshot + 1;
                            }
                            this.screen.push(x);
                        })
                        this.images = true;
                        i++;
                    });
                }
                else {
                    this.images = false;
                    this.screen = [];
                }
            }
            this.loading = false;
        })
    }

    getActTrackerUserActivityScreenshotsByWorkItemId() {
        this.loading = true;
        this.isSelected = false;
        this.userActivityScreenshots = [];
        this.totalScreenshot = 0;
        // this.galleryImages = [];
        // this.screenshots = [];
        // this.screenId = [];
        this.screen = [];
        this.max = null;
        let webAppUsageSearch = new WebAppUsageSearchModel();
        webAppUsageSearch.dateFrom = this.dateFrom;
        webAppUsageSearch.dateTo = this.dateTo;
        webAppUsageSearch.isApp = true;
        webAppUsageSearch.userId = this.user;
        webAppUsageSearch.userStoryId = this.userStoryId;
        webAppUsageSearch.pageNumber = this.pageNumber;
        webAppUsageSearch.pageSize = this.pageSize;
        webAppUsageSearch.selectedUserId = this.selectedUserId;
        this.timeSheetService.getActTrackerUserActivityScreenshotsById(webAppUsageSearch).subscribe((responseData: any) => {
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
                        item['xAxis'] = [];
                        item['keyStroke'] = [];
                        item['mouseMovement'] = [];
                        item['dummyData'] = [];
                        if (item.trackerChartDetails) {
                            item.trackerChartDetails.forEach(element => {
                                if(element.timeZoneAbbreviation)
                                this.timeZone = "All timings are in " + element.timeZoneAbbreviation;
                                // let userModel = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModel));
                                // let timeZoneId = userModel.timeZoneId;
                                // if (timeZoneId && element.timeZoneId && timeZoneId.toLowerCase() != element.timeZoneId.toLowerCase())
                                //     item.xAxis.push(element.endTime + ' ' + element.timeZoneAbbreviation);
                                // else
                                    item.xAxis.push(element.endTime);
                                //item.xAxis.push(element.trackedTenthMinute);
                                item.keyStroke.push(element.keyStroke);
                                item.mouseMovement.push(element.mouseMovement);
                                item.dummyData.push(element.keyStroke + element.mouseMovement);
                                //item.dummyData.push(element.mouseMovement);
                            });
                            if (item.dummyData.length > 0) {
                                let max = Math.max.apply(Math, item.dummyData);
                                if (max < 50) {
                                    this.max = 50;
                                }
                                else if (max < 1000) {
                                    let intialDigit;
                                    intialDigit = max.toString().charAt(0);
                                    this.max = (parseInt("" + intialDigit) + 1) * 100;
                                }
                                else {
                                    this.max = 1000;
                                }
                            }
                            else {
                                this.max = 1000;
                            }
                        }
                        item.screenshotDetails.forEach((x) => {
                            if (x.isArchived != true) {
                                this.totalScreenshot = this.totalScreenshot + 1;
                            }
                            this.screen.push(x);
                        })
                        this.images = true;
                        i++;
                    });
                }
                else {
                    this.images = false;
                    this.screen = [];
                }
            }
            this.loading = false;
        })
    }

    formValidate() {
        this.deleteForm = new FormGroup({
            reason: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
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

    openDeletePopup(deleteScreenshotPopUp) {
        this.deleteForm.reset();
        deleteScreenshotPopUp.openPopover();
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

    closeModal() {
        (document.querySelector(".custom-modal") as HTMLElement).style.display = "none";
        this.deletescreenId = null;
    }

    plusSlides(n) {
        this.slideIndex = this.slideIndex + n;
        this.currentSlide(this.slideIndex);
    }

    deleteScreenshots(formDirective: FormGroupDirective) {
        this.deleteForm.controls["reason"].setValidators([Validators.required,
        Validators.maxLength(50)]);
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
            this.timeSheetService.deleteMultipleScreenshots(deleteScreenshot).subscribe((responseData: any) => {
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
                    if (this.currentDialog) {
                        this.getActTrackerUserActivityScreenshotsByWorkItemId();
                    }
                    else {
                        this.getActTrackerUserActivityScreenshots();
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

    onNoClick() {

        if (this.currentDialog)
            this.currentDialog.close();
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

    switchToAreaChart() {
        this.areaChart = true;
        this.barChart = false;
    }
    
    switchToBarChart() {
        this.areaChart = false;
        this.barChart = true;
    }

}