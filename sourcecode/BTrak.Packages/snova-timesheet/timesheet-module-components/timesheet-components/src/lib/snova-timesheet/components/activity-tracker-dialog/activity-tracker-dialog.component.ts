import { ChangeDetectorRef, Component, Inject, Input, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { RepositoryCommitsModel } from '../../models/repository-commits.model';
import { SearchCommitModel } from '../../models/search-repository-commits.model';
import { TimesheetService } from '../../services/timesheet-service.service';

declare var $_tracker: any;
@Component({
    selector: "app-activity-tracker-dialog",
    templateUrl: "activity-tracker-dialog.component.html"
})

export class ActivityTrackerDialogComponent extends CustomAppBaseComponent {

    @ViewChild("liveCastDialog") liveCastDialog: TemplateRef<any>;
    
    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            let trackerData = data[0];
            if (trackerData) {
                this.currentDialogId = trackerData.dialogId;
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
                this.trackerParameters = trackerData.trackerParameters;
                if (this.trackerParameters.type == "Productive") {
                    this.tabIndex = 0;
                }
                else if (this.trackerParameters.type == "UnProductive") {
                    this.tabIndex = 1;
                }
                else if (this.trackerParameters.type == "Neutral") {
                    this.tabIndex = 2;
                }
                else if (this.trackerParameters.type == "SystemBreaks") {
                    this.tabIndex = 3;
                }
                else if (this.trackerParameters.type == "Screenshots") {
                    this.tabIndex = 4;
                } else {
                    this.tabIndex = 0;
                }
                this.SearchRepositoryCommits(this.trackerParameters);
                this.userDetails = null;
                // this.userDetails = {
                //     userId: this.trackerParameters.userId,
                //     isLeave: (this.trackerParameters.rowData.leaveTypeName != null || 
                //                 this.trackerParameters.rowData.leaveReason != null || 
                //                 this.trackerParameters.rowData.leaveSessionName != null) ? true : false,
                //     status: this.trackerParameters.rowData.status,
                //     profileImage: this.trackerParameters.rowData.userProfileImage,
                //     userName: this.trackerParameters.rowData.employeeName
                // }
            }
        }
    }

    tabIndex: number = 0;
    trackerParameters: any;
    currentDialogId: string;
    currentDialog: any;
    userCommitDetails: RepositoryCommitsModel[] = [];
    screenshot: boolean = false;
    liveCast: boolean = false;
    liveScreenshotInProgress: boolean = false;
    loader: boolean = false;
    totalLoadingTime: number = 0;
    interval;
    liveImageUserName: string;
    liveImageUserId: string;
    liveImageUrl: any;
    liveImageUserProfileImage: string;
    livescreenShotDateTime: string;
    liveScreentimeZoneName: string;
    liveImageroleName: string;
    connection: any;
    environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    apiURL = this.environment.apiURL;
    loggedInUserId: string;
    timer: any;
    cancelScreenCast: boolean = false;
    userDetails: any;
    liveScreenshotStreamInProgress: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<ActivityTrackerDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private timesheetService: TimesheetService,
        private cdRef: ChangeDetectorRef,
        private cookieService: CookieService,
        private toastrService: ToastrService,
        private translateService: TranslateService,
        private _sanitizer: DomSanitizer) {
        super();
        this.trackerParameters = this.data.trackerParameters;
    }

    ngOnInit() {
        super.ngOnInit();
        this.loggedInUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    }

    onTabClick(event) {

    }

    onNoClick() {
        this.currentDialog.close();
    }

    SearchRepositoryCommits(data: any) {
        let searchCommits = new SearchCommitModel();
        searchCommits.userId = data.userId;
        searchCommits.onDate = data.dateFrom;
        this.timesheetService.SearchRepositoryCommits(searchCommits).subscribe((responseData: any) => {
            if (responseData.success == false || responseData.data == null) {
                this.userCommitDetails = [];
            } else {
                this.userCommitDetails = responseData.data;
            }
            this.cdRef.detectChanges();
        });
    }

    getLiveScreenshot(user, screenShot, screenCast) {
        if (screenShot) {
            this.screenshot = true;
            this.liveCast = false;
        }
        else {
            this.liveCast = true;
            this.screenshot = false;
        }
        if (!this.liveScreenshotInProgress) {
            this.loader = true;
            this.totalLoadingTime = 0;
            this.startTimer();
            this.liveScreenshotInProgress = true;
            this.cdRef.detectChanges();
            this.liveImageUserName = user.userName;
            this.liveImageUserProfileImage = user.profileImage;
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
                        self.closeLoader();
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
                        self.closeLoader();
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
                        self.closeLoader();
                    }
                });
                trackerHub.on('clientNotAvailable', function (clientValue) {
                    if (screenShot) {
                        self.liveScreenshotInProgress = false;
                        self.toastrService.warning(self.translateService.instant('ACTIVITYTRACKER.USERISNOTACTIVEFORSCREENSHOT'));
                        self.closeLoader();
                        self.cdRef.detectChanges();
                    } else if (screenCast) {
                        self.liveScreenshotInProgress = false;
                        self.toastrService.warning(self.translateService.instant('ACTIVITYTRACKER.USERISNOTACTIVEFORSCREENCAST'));
                        self.closeLoader();
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
                    self.closeLoader();
                    self.liveScreenshotInProgress = false;
                });
            } else {
                self.closeLoader();
                this.liveScreenshotInProgress = false;
            }
        }
    }

    dispalyliveImage(url) {
        var data = JSON.parse(url);
        var base64String = `data:image/png;base64, ${data.ScreenShotUrl}`;
        this.liveImageUrl = this._sanitizer.bypassSecurityTrustResourceUrl(base64String);
        this.livescreenShotDateTime = data.ScreenShotDate;
        this.liveScreentimeZoneName = data.TimeZoneName;
        // (document.querySelector(".my-live-slides") as HTMLElement).style.display = "block";
        // (document.querySelector(".custom-live-modal") as HTMLElement).style.display = "block";
        let currentDialog = this.dialog.getDialogById("live-cast");
        if (!currentDialog)
            this.openLiveCastDialog();
    }

    setScreenshotTimer(screenShot) {
        var self = this;
        this.timer = setTimeout(function () {
            // set showloader to false to hide loading div from view after 15 seconds
            if (self.liveScreenshotInProgress) {
                self.liveScreenshotInProgress = false;
                self.closeLoader();
                if (screenShot) {
                    self.toastrService.warning(self.translateService.instant('ACTIVITYTRACKER.CANTGETLIVESCREENSHOT'));
                } else {
                    self.toastrService.warning(self.translateService.instant('ACTIVITYTRACKER.CANTGETLIVESCREENSTREAM'));
                }
                self.cdRef.detectChanges();
            }
        }, 45000);
    }


    startTimer() {
        this.interval = setInterval(() => {
            this.totalLoadingTime++;
        }, 1000)
    }

    closeLoader() {
        this.loader = false;
        clearInterval(this.interval);
        this.cdRef.detectChanges();
    }

    openLiveCastDialog() {
        let dialogId = "live-cast-timesheet"
        const dialogRef = this.dialog.open(this.liveCastDialog, {
            width: "90%",
            direction: 'ltr',
            data: {
                liveImageUserName: this.liveImageUserName, liveImageUserProfileImage: this.liveImageUserProfileImage, dialogId: dialogId,
                liveImageroleName: this.liveImageroleName, liveScreentimeZoneName: this.liveScreentimeZoneName, livescreenShotDateTime: this.livescreenShotDateTime
            },
            height: "78vh",
            disableClose: true,
            id: dialogId
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.connection.stop();
            this.cancelScreenCast = true;
            this.cdRef.detectChanges();
        });
    }
}
