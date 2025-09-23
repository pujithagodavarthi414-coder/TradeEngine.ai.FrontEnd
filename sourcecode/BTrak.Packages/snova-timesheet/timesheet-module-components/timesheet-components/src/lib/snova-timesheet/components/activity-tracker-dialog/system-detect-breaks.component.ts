import { Component, Input } from '@angular/core';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { TrackerTimeModel } from '../../models/tracker-time.model';
import { TimesheetService } from '../../services/timesheet-service.service';

@Component({
    selector: "app-system-detected-breaks",
    templateUrl: "system-detect-breaks.component.html"
})

export class SystemDetectBreaksComponent extends CustomAppBaseComponent {

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
            this.getTrackingData(data);
        }
    }

    trackerParameters: any;
    trackerTimeData: any;
    loadingIndicator: boolean;

    constructor(private timesheetService: TimesheetService) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    getTrackingData(data: any) {
        this.loadingIndicator = true;
        let timeUsage = new TrackerTimeModel();
        timeUsage.usageDate = data.dateFrom;
        timeUsage.userId = data.userId;
        this.timesheetService.getTrackingTime(timeUsage).subscribe((responseData: any) => {
            if (responseData.success) {
                this.loadingIndicator = false;
                if (responseData.data.length > 0) {
                    this.trackerTimeData = responseData.data;
                }
                else {
                    this.loadingIndicator = false;
                    this.trackerTimeData = null;
                }
            }
            else {
                this.loadingIndicator = false;
                this.trackerTimeData = null;
            }
        });
    }
}