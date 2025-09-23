import { Component, Inject, ChangeDetectorRef } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { ActivityTrackerService } from '../services/activitytracker-services';
import { DatePipe } from '@angular/common';
import { WebAppUsageSearchModel } from '../models/web-app-usage-search-model';

export interface TrackerScreenshotData {
    userActivityScreenshots: any;
    screen: any;
    webAppUsage: any;
}

@Component({
    selector: "app-view-activitytracker-screenshot-viewer",
    templateUrl: "activity-tracker-screenshot-report-component.html",
    // changeDetection: ChangeDetectionStrategy.OnPush
})

export class ActivityTrackerScreeshotViewer extends CustomAppBaseComponent {
    userActivityScreenshots: any
    screen: any;
    webAppUsage: any;
    private screenshots: any;
    loading: boolean = false;


    constructor(@Inject(MAT_DIALOG_DATA) private data: TrackerScreenshotData,
                public dialogRef: MatDialogRef<ActivityTrackerScreeshotViewer>, private timeUsageService: ActivityTrackerService, private datePipe: DatePipe,
                private cdRef: ChangeDetectorRef) {
        super();

        if (data && data.userActivityScreenshots) {
            this.userActivityScreenshots = data.userActivityScreenshots;
        }
        if (data && data.screen) {
            this.screen = data.screen;
        }
        if(data && data.webAppUsage) {
            this.webAppUsage = data.webAppUsage;
        }
    }

    closeDialog() {
        this.dialogRef.close();
    }

    onDeleted($event) {
        this.getActTrackerUserActivityScreenshots();
    }

    getActTrackerUserActivityScreenshots() {
        var webAppUsageSearch = new WebAppUsageSearchModel();
        webAppUsageSearch.userId = this.webAppUsage.userId;
        webAppUsageSearch.dateFrom = this.webAppUsage.dateFrom;
        webAppUsageSearch.dateTo = this.webAppUsage.dateTo;
        webAppUsageSearch.isApp = false;
        this.loading = true;
        this.timeUsageService.getActTrackerUserActivityScreenshots(webAppUsageSearch).subscribe((responseData: any) => {
            if (responseData.success == true) {
                this.userActivityScreenshots = [];
                this.userActivityScreenshots = responseData.data;
                if (this.userActivityScreenshots.length == 0) {
                }
                if (this.userActivityScreenshots.length > 0) {
                    let i = 0;
                    this.userActivityScreenshots.forEach((item) => {
                        item.screenshotDetails.forEach((x) => {
                            const tempdate = this.datePipe.transform(x.screenShotDateTime, "MMM d, y, h:mm:ss a");
                            this.screen.push(x);
                        })
                        this.screenshots = [];
                        i++;
                    });

                }
                else {
                    this.screenshots = [];
                    this.screen = [];
                }
            } else {
                this.screenshots = [];
                this.screen = [];
            }
            this.loading = false;
            this.cdRef.detectChanges();
        })
    }
}
