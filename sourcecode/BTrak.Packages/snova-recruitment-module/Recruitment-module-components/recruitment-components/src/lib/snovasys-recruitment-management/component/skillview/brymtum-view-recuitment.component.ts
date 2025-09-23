import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import { ToastrService } from 'ngx-toastr';
import * as $_ from 'jquery';
const $ = $_;
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import SchedulerConfig from '../../../globaldependencies/components/sheduleconfig';
import { Page } from '../../../snovasys-recruitment-management-apps/models/page';
import { RecruitmentService } from '../../../snovasys-recruitment-management-apps/services/recruitment.service';
import { CookieService } from 'ngx-cookie-service';
import { JobOpening } from '../../../snovasys-recruitment-management-apps/models/jobOpening.model';

@Component({
    selector: 'app-brymtum-view-recuitment',
    templateUrl: 'brymtum-view-recuitment.component.html',
})

export class RecruitmentBryntumViewComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChild('alldepartmentsSelected') private alldepartmentsSelected: MatOption;
    @ViewChild('allEmployeesSelected') private allEmployeesSelected: MatOption;
    @ViewChild('allbranchSelected') private allbranchSelected: MatOption;
    @ViewChild('scheduler1') schedulerComponent;
    @Output() candidateArchive = new EventEmitter<any>();

    schedulerConfig: any = SchedulerConfig;
    activityTrackerInputForm: FormGroup;
    minDateForEndDateForInput: Date = null;
    sortBy: any;
    sortDirection: any;
    page = new Page();
    alldepartmentIds: any[];
    allBranchIds: any[];
    allEmployeeIds: any[];
    isSubmitted = false;
    trackerData: any;
    loadingIndicator = false;
    groupType = '1';
    loading$: Observable<boolean>;
    appUsageData: any;
    trackerTimeSheetData: any;
    trackerUserstoryData: any;
    timesheetOverlayChecker: boolean;
    userStoryOverlayChecker: boolean;
    persistanceId: string;
    trackerFilterJson: string;
    trackerFilterObject: any;
    userCountForBranch = 0;
    activityTrackerChecker: boolean;
    idleTimeOverlayChecker: boolean;
    idleTimeData: any;
    minDateOnTrailExpired: Date = null;
    isTrailExpired = false;
    multiPage: string = null;
    employeeListDataDetails: any;
    timeUsageService: any;
    jobDetails: any;

    constructor(
        private formBuilder: FormBuilder,
        private cdRef: ChangeDetectorRef,
        private activatedRoute: ActivatedRoute,
        private toastr: ToastrService, private cookieService: CookieService,
        private route: ActivatedRoute, private router: Router, private recruitmentService: RecruitmentService) {
        super();
        this.route.queryParams.subscribe(params => {
            if (!this.multiPage) {
                this.multiPage = params['multipage'.toString()];
            }
        });
    }
    ngOnInit() {
        this.page.size = 100;
        this.page.pageNumber = 0;
        this.employeeListDataDetails = [];
        this.setCreatePlanForm();
        this.activityTrackerInputForm.controls.startDate.patchValue(new Date());
        this.activityTrackerInputForm.controls.endDate.patchValue(new Date());
        this.activityTrackerInputForm.controls.groupType.patchValue('1');

    }

    setCreatePlanForm() {
        this.activityTrackerInputForm = new FormGroup({
            startDate: new FormControl('',
                Validators.compose([
                    Validators.required
                ])
            ),
            endDate: new FormControl('',
                Validators.compose([])
            ),
            groupType: new FormControl('1',
                Validators.compose([])
            )
        });

    }

    inputFormstartDateChange() {
        this.minDateForEndDateForInput = this.activityTrackerInputForm.value.startDate;
        this.cdRef.detectChanges();
    }


    showFilter() {
        this.isSubmitted = false;
    }

    getBrytumViewJobDetails() {
        const jobDetailsModel = new JobOpening();
        this.loading$ = of(true);
        jobDetailsModel.sortBy = this.sortBy;
        jobDetailsModel.sortDirectionAsc = this.sortDirection;
        jobDetailsModel.pageNumber = this.page.pageNumber + 1;
        jobDetailsModel.pageSize = this.page.size;
        jobDetailsModel.isArchived = false;
        jobDetailsModel.dateFrom = this.activityTrackerInputForm.value.startDate;
        jobDetailsModel.dateTo = this.activityTrackerInputForm.value.endDate;
        this.schedulerConfig.startDate = this.activityTrackerInputForm.value.startDate;
        this.schedulerConfig.endDate = this.activityTrackerInputForm.value.endDate;
        this.recruitmentService.GetBrytumViewJobDetails(jobDetailsModel).subscribe((response: any) => {
            if (response.success) {
                this.jobDetails = response.data;
                this.groupType = '1';
                this.isSubmitted = true;
                this.loading$ = of(false);
            } else {
                this.isSubmitted = true;
                this.loading$ = of(false);
            }
        });
    }

    zoomIn() {
        this.schedulerComponent.schedulerEngine.zoomIn();
    }

    zoomOut() {
        this.schedulerComponent.schedulerEngine.zoomOut();
    }

    fitContent(optionalParameters?: any) {
        try {
            if (optionalParameters) {
                let parentElementSelector = '';
                let minHeight = '';
                if (optionalParameters['popupView'.toString()]) {
                    parentElementSelector = optionalParameters['popupViewSelector'.toString()];
                    minHeight = `calc(90vh - 200px)`;
                } else if (optionalParameters['gridsterView'.toString()]) {
                    parentElementSelector = optionalParameters['gridsterViewSelector'.toString()];
                    minHeight = `${$(parentElementSelector).height() - 40}px`;
                } else if (optionalParameters['individualPageView'.toString()]) {
                    parentElementSelector = optionalParameters['individualPageSelector'.toString()];
                    minHeight = `calc(100vh - 90px)`;
                }

                let counter = 0;
                // tslint:disable-next-line: only-arrow-functions
                var applyHeight = setInterval(function() {
                    if (counter > 10) {
                        clearInterval(applyHeight);
                    }
                    counter++;
                    if ($(parentElementSelector + ' bry-scheduler-interview .b-widget.b-container').length > 0) {
                        $(parentElementSelector + ' bry-scheduler-interview .b-widget.b-container').css('min-height', minHeight);
                        clearInterval(applyHeight);
                    }
                }, 1000);
            }
        } catch (err) {
            clearInterval(applyHeight);
            console.log(err);
        }
    }

    candidateArchived(value) {
        if (value) {
            this.candidateArchive.emit(true);
        }
    }

}
