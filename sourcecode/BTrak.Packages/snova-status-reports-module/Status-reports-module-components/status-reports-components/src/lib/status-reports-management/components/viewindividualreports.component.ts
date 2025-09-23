import { Component, Input, Output, EventEmitter, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { StatusreportService } from '../services/statusreport.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StatusReporting } from '../models/statusReporting';
import { CookieService } from 'ngx-cookie-service';
import "../../globaldependencies/helpers/fontawesome-icons"
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

@Component({
    selector: 'app-dashboard-component-viewindividualreports',
    templateUrl: './viewindividualreports.component.html'
})

export class ViewindividualreportsComponent {
    statusReport: any;
    intialLoad: boolean = true;
    formObject: any;
    statusReportDescription: string;
    formData = { data: {} };
    statusReportsDetails: any;
    selectedUserId: string;
    anyOperationInProgress: boolean = false;

    @Input('report') set report(report: any) {
        this.statusReport = new StatusReporting();
        if (report != null && report != undefined) {
            this.intialLoad = false;
            this.anyOperationInProgress = true;
            this.statusReport.id = report.id;
            this.formData.data = null;
            this.statusReportDescription = null;
            this.formObject = null;
            this.statusreportService.GetStatusReports(this.statusReport).subscribe((responses: any) => {
                this.statusReportsDetails = responses.data[0];
                this.statusReportDescription = this.statusReportsDetails.description;
                this.formObject = JSON.parse(this.statusReportsDetails.formJson);
                this.formData.data = JSON.parse(this.statusReportsDetails.formDataJson);
                this.anyOperationInProgress = false;
                this.cdRef.detectChanges();
            });
        }
    }

    ngOnInit() {
    }

    constructor(private statusreportService: StatusreportService, private route: Router, private cookieService: CookieService, private cdRef : ChangeDetectorRef, private activatedRoute: ActivatedRoute) {
        this.selectedUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    }
}