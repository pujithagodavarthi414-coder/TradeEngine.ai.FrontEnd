import { Component, Input, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { StatusreportService } from '../services/statusreport.service';
import { StatusReporting, StatusReportSeenStatus } from '../models/statusReporting';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import "../../globaldependencies/helpers/fontawesome-icons"
import { TeamLeads } from '../models/teamleads.model';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import * as introJs from 'intro.js/intro.js';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-dashboard-component-viewsubmitedreports',
    templateUrl: './viewsubmitedreports.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '(document:click)': 'onClick($event)',
    },
})

export class ViewSubmitedReportsComponent extends CustomAppBaseComponent {
    Arr = Array;
    num: number = 4;
    selectedTab: number = 0;
    isAnyOperationIsInprogress: boolean;
    isOpen: boolean = true;
    selectedUserId: string;
    isLoadMoreEnabled: boolean = false;
    isLoadingMoreInProgress: boolean = false;
    changeRoute: boolean = false;
    pageNumber: number = 1;
    statusReportsCount: number = 0;
    pageSize: number = 20;
    pageIndex: number = 0;
    pageSizeOptions: number[] = [20, 40, 60, 80];
    selectedReportId: string = null;
    selectedReport: any;
    searchText: string = null;
    createdOn: Date = null;
    maxDate: Date = new Date();
    showUsersList: boolean;
    statusReports: boolean;
    usersList: TeamLeads[] = [];
    divActivate: boolean;
    isSelectedMembers: any[] = [];
    selectedReportingPersonlist: any = [];
    isUnread: boolean = false;
    firstLoad: boolean = false;
    isSelected: any[] = [];
    reportingPerson: string = null;
    statusReportStatusModel: StatusReportSeenStatus;
    introJS = new introJs();
    multiPage: string = null;

    @Input('statusReports') set _statusReports(value: any) {
        this.statusReports = value;
        if (this.statusReports) {
            this.pageNumber = 1;
            this.getStatusReports();
        }
    }

    statusReport: StatusReporting;
    statusReportsDetails: any[] = [];
    softLabels: SoftLabelConfigurationModel[];

    constructor(
        private statusreportService: StatusreportService, private _el: ElementRef,
        private cdRef: ChangeDetectorRef, private toastr: ToastrService,
        private translateService: TranslateService, private routes: Router, private route: ActivatedRoute,
        private datePipe: DatePipe, private cookieService: CookieService) {
        super();
        this.selectedUserId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        this.route.queryParams.subscribe(params => {
            if (!this.multiPage) {
                this.multiPage = params['multipage'];
            }
        });
        this.introEnable();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabels();
        this.isAnyOperationIsInprogress = true;
        this.getStatusReports();
        this.statusreportService.getTeamLeadsList().subscribe((response: any) => {
            this.usersList = response.data;
        })
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }

    getStatusReports() {
        this.isAnyOperationIsInprogress = true;
        this.statusReport = new StatusReporting();
        this.statusReport.pageNumber = this.pageNumber;
        this.statusReport.pageSize = this.pageSize;
        this.statusReport.searchText = this.searchText;
        this.statusReport.isUnread = this.isUnread;
        if (this.createdOn != null) {
            this.statusReport.createdOn = this.datePipe.transform(this.createdOn, 'yyyy-MM-dd');
        } else {
            this.statusReport.createdOn = null;
        }
        this.statusReport.assignedTo = this.reportingPerson;
        this.statusreportService.GetStatusReports(this.statusReport).subscribe((responses: any) => {
            if (responses.success) {
                this.isAnyOperationIsInprogress = false;
                this.statusReportsDetails = responses.data;
                if (this.statusReportsDetails.length > 0) {
                    // this.reportDetails(responses.data[0]);
                    this.statusReportsCount = responses.data[0].totalCount;
                    this.reportDetails(this.statusReportsDetails[0], false);
                } else {
                    this.statusReportsCount = 0
                }
                this.cdRef.detectChanges();
            }
            if (this.multiPage == "true") {
                this.introStart();
                this.multiPage = null;
            }
            if (responses.success == false) {
                var validationmessage = responses.apiResponseMessages[0].message;
                this.toastr.error("", validationmessage);
            }
        });
    }

    GetReportedPerson(userId, isChecked, selectedIndex) {
        if (isChecked) {
            this.selectedReportingPersonlist.push(userId);
            this.isSelected[selectedIndex] = true;
        } else {
            var index = this.selectedReportingPersonlist.indexOf(userId);
            this.selectedReportingPersonlist.splice(index, 1);
            this.isSelected[selectedIndex] = false;
        }

        this.reportingPerson = this.selectedReportingPersonlist.toString();
        this.getStatusReports();
    }

    changeSeenStatus(report) {
        this.statusReportStatusModel = new StatusReportSeenStatus();
        this.statusReportStatusModel.SeenStatus = !report.seen;
        this.statusReportStatusModel.StatusReportId = report.id;
        this.statusreportService.UpsertStatusReportSeenStatus(this.statusReportStatusModel).subscribe((responses: any) => {
            if (responses.success) {
                var index = this.statusReportsDetails.findIndex(x => x.id == report.id);
                this.statusReportsDetails[index].seen = !this.statusReportsDetails[index].seen;
                this.cdRef.detectChanges();
            }
            if (responses.success == false) {
                var validationmessage = responses.apiResponseMessages[0].message;
                this.toastr.error("", validationmessage);
                this.cdRef.detectChanges();
            }
        })

    }

    getSelectedMember(userId, selectedIndex) {
        var index = this.selectedReportingPersonlist.indexOf(userId);
        if (index > -1) {
            this.selectedReportingPersonlist.splice(index, 1);
            this.isSelectedMembers[selectedIndex] = false;
        }
        else {
            this.selectedReportingPersonlist.push(userId);
            this.isSelectedMembers[selectedIndex] = true;
        }
        this.reportingPerson = this.selectedReportingPersonlist.toString();
        this.getStatusReports();
    }

    getStatusReportsFromFilter() {
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.getStatusReports();
    }

    getStatusReportsPagination(pageEvent) {
        if (pageEvent.pageSize != this.pageSize) {
            this.pageNumber = 1;
            this.pageIndex = 0;
        }
        else {
            this.pageNumber = pageEvent.pageIndex + 1;
            this.pageIndex = pageEvent.pageIndex;
        }
        this.pageSize = pageEvent.pageSize;
        this.getStatusReports();
    }

    closeSearch() {
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.searchText = null;
        this.getStatusReports();
    }

    closeDateFilter() {
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.createdOn = null;
        this.getStatusReports();
    }

    reportDetails(report, changeSeenStatus) {
        if (report.seen == false && changeSeenStatus == true) {
            this.changeSeenStatus(report);
        }
        this.selectedReport = report;
        this.selectedReportId = report.id;
        // this.route.navigate(['forms/view-reports/' + this.selectedTab + '/' + status.id]);
    }

    closeAssigneeDropdown() {
        this.showUsersList = false;
    }

    onClick(event) {
        if (!this._el.nativeElement.contains(event.target)) // similar checks
            this.closeAssigneeDropdown();
        // this.isSelected = [];
    }
    public async introStart() {
        await this.delay(2000);
        const navigationExtras: NavigationExtras = {
            queryParams: { multipage: true },
            queryParamsHandling: 'merge',
           // preserveQueryParams: true
        }

        this.introJS.start().oncomplete(() => {

        });
    }
   
    introEnable() {
        this.introJS.setOptions({
            steps: [
                {
                    element: '#ar-1',
                    intro: this.translateService.instant('INTROTEXT.AR-1'),
                    position: 'top'
                },
                {
                    element: '#ar-3',
                    intro: this.translateService.instant('INTROTEXT.AR-3'),
                    position: 'bottom'
                },
                {
                    element: '#ar-4',
                    intro: this.translateService.instant('INTROTEXT.AR-4'),
                    position: 'bottom'
                }

            ]
        });
    }


    resetAllFilters() {
        this.pageNumber = 1;
        this.pageIndex = 0;
        this.searchText = null;
        this.createdOn = null;
        this.selectedReportingPersonlist = [];
        this.reportingPerson = null;
        for (let i = 0; i < this.usersList.length; i++) {
            this.isSelectedMembers[i] = false;
            this.isSelected[i] = false;
        }
        this.getStatusReports();
    }

    private delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}