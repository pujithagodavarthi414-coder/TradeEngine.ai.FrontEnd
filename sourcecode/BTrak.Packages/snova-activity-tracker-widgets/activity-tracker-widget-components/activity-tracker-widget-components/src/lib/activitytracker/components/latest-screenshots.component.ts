import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { DeleteScreenShotModel } from '../models/delete-screenshot-model';
import { WebAppUsageSearchModel } from '../models/web-app-usage-search-model';
import { ActivityTrackerService } from '../services/activitytracker-services';

@Component({
    selector: "app-ts-component-latestscreenshots",
    templateUrl: "latest-screenshots.component.html",
})

export class LatestScreenshotsComponent {

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        this.dashboardFilters = data;
        this.dateFrom = this.dashboardFilters ? this.dashboardFilters.date : null;
        this.dateTo = this.dashboardFilters ? this.dashboardFilters.date : null;
        this.getActTrackerUserActivityScreenshots();
    }
  
    dashboardFilters: DashboardFilterModel;

    @ViewChildren("deleteScreenshotPopUp") deleteScreenshotPopover;
    webAppUsageSearch: WebAppUsageSearchModel = new WebAppUsageSearchModel();
    dateFrom: string;
    dateTo: string;
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

    constructor(
        private timeUsageService: ActivityTrackerService, 
        public dialog: MatDialog, 
        private cookieService: CookieService, 
        private cdRef: ChangeDetectorRef,
        private datePipe: DatePipe) {

    }

    ngOnInit() {
        this.formValidate();
    }

    getActTrackerUserActivityScreenshots() {
        this.loading = true;
        this.isSelected = false;
        this.userActivityScreenshots = [];
        this.totalScreenshot = 0;
        this.screen = [];
        this.webAppUsageSearch.dateFrom = this.dateFrom ? this.datePipe.transform(this.dateFrom, 'yyyy-MM-dd') : this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        this.webAppUsageSearch.dateTo = this.dateTo ? this.datePipe.transform(this.dateTo, 'yyyy-MM-dd') : this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        this.webAppUsageSearch.isApp = true;
        let userId = [];
        userId.push(this.cookieService.get(LocalStorageProperties.CurrentUserId));
        this.webAppUsageSearch.userId = userId;
        this.webAppUsageSearch.pageNumber = this.pageNumber;
        this.webAppUsageSearch.pageSize = this.pageSize;
        this.webAppUsageSearch.isForLatestScreenshots = true;
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
                }
                else {
                    this.images = false;
                    this.screen = [];
                }
            }
            this.loading = false;
            this.cdRef.detectChanges();
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
                    // if (this.currentDialog) {
                    //     this.getActTrackerUserActivityScreenshotsByWorkItemId();
                    // }
                    // else {
                    this.getActTrackerUserActivityScreenshots();
                    //}
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

    resetFilter() {
        this.getActTrackerUserActivityScreenshots();
    }
}