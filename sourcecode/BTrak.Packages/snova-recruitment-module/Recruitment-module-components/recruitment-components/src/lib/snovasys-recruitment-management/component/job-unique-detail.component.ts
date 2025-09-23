import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { ComponentModel } from '@snovasys/snova-comments';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CandidateSearchtModel } from '../models/candidate-search.model';
import { RecruitmentService } from '../../snovasys-recruitment-management-apps/services/recruitment.service';
import { JobOpening } from '../../snovasys-recruitment-management-apps/models/jobOpening.model';
import { ToastrService } from 'ngx-toastr';
import { Actions, ofType } from '@ngrx/effects';
import { State } from '../../snovasys-recruitment-management-apps/store/reducers/index';
import { Store } from '@ngrx/store';
import { CandidateActionTypes, LoadCandidateItemsTriggered } from '../../snovasys-recruitment-management-apps/store/actions/candidate.action';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { SatPopover } from '@ncstate/sat-popover';
import { JobOpeningStatusInputModel } from '../../snovasys-recruitment-management-apps/models/jobOpeningStatusInputModel';
import { InterviewProcessComponent } from './interview-process-component';
import { CandidateJobLinkComponent } from './candidate-link.component';
import { SoftLabelConfigurationModel } from '@snovasys/snova-custom-fields';
import { BasicJobDetailsComponent } from './basic-job-detail.component';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'app-job-unique-detail',
    templateUrl: 'job-unique-detail.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class JobUniqueDetailComponent extends CustomAppBaseComponent implements OnInit, OnDestroy {
    @ViewChild('editJobMenuPopover') editJobMenuPopover: SatPopover;
    @ViewChild('archivePopover') archivePopover: SatPopover;
    @ViewChild('closeJobOpeningPopover') closeJobOpeningPopover: SatPopover;

    componentModel: ComponentModel = new ComponentModel();
    jobOpeningId: any;
    actvieJob: any = null;
    isAnyOperationIsInprogress: boolean;
    description: string;
    isEditorVisible: boolean;
    selectedCandidate: any;
    candidateSearchCriteria: any;
    selectedTab: string;
    timeStamp: any;
    softLabels: SoftLabelConfigurationModel[];
    savingInProgress: boolean;
    isArchived = false;
    isJobArchived: boolean;
    isCandidateExists = true;
    isFirstCandidateLoad = true;
    openingstatus; any = null;
    isJobOpeningClosed = false;
    public ngDestroyed$ = new Subject();

    constructor(
        private cookieService: CookieService,
        private route: ActivatedRoute,
        private recruitmentService: RecruitmentService,
        private cdRef: ChangeDetectorRef,
        private toastr: ToastrService,
        private store: Store<State>,
        private actionUpdates$: Actions,
        public dialog: MatDialog,
        private router: Router,
    ) {
        super();
        this.route.params.subscribe((params: Params) => {
            if (params) {
                this.jobOpeningId = params['id'.toString()];
                this.getJobOpenings();
            }
        });

        this.actionUpdates$
            .pipe(
                ofType(CandidateActionTypes.LoadCandidateItemsCompleted),
                tap((result: any) => {
                    this.candidateSearchCriteria = result.candidate;
                    this.actvieJob.totalCandidatesInJobOpening = this.candidateSearchCriteria.length;
                    if (this.candidateSearchCriteria.length > 0) {
                        this.isCandidateExists = true;
                    } else {
                        this.isCandidateExists = false;
                    }

                    if (this.selectedCandidate) {
                        this.selectedUserInfoUpdate();
                    }
                    this.cdRef.detectChanges();
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                ofType(CandidateActionTypes.LoadCandidateItemsDetailsFailed),
                tap((result: any) => {
                    this.toastr.error(result.validationMessages);
                    this.cdRef.detectChanges();
                })
            )
            .subscribe();
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    // tslint:disable-next-line: member-ordering
    public initSettings = {
        plugins: "paste,lists advlist",
        branding: false,
        //powerpaste_allow_local_images: true,
        //powerpaste_word_import: 'prompt',
        //powerpaste_html_import: 'prompt',
        toolbar: 'link image code'
    };

    ngOnInit() {
        super.ngOnInit();
        this.componentModel.accessToken = this.cookieService.get(LocalStorageProperties.CurrentUser);
        this.componentModel.backendApi = environment.apiURL;
        this.componentModel.parentComponent = this;
        this.componentModel.callBackFunction =
         ((component: any, commentsCount: number) => { component.componentModel.commentsCount = commentsCount; });
        this.getCandiates();
        this.getSoftLabelConfiguration();
    }

    enableEditor() {
        if (this.canAccess_feature_AddorEditJobOpening) {
            this.isEditorVisible = true;
        }
    }

    handleDescriptionEvent(value) {
        if (this.description !== this.actvieJob.jobDescription) {
            this.description = this.description.replace(/<(.|\n)*?>/g, '');
            this.upsertJobDescription();
        }
    }

    cancelDescription() {
        this.description = this.actvieJob.jobDescription;
        this.isEditorVisible = false;
        this.cdRef.detectChanges();
    }

    descriptionReset() {
        this.description = this.actvieJob.jobDescription;
    }

    candidateCloseClicked() {
        this.selectedCandidate = null;
    }

    candidateUpdated(value) {
        this.getJobOpenings();
    }

    checkPermissionsForMatMenu() {

        if ((this.canAccess_feature_ArchiveJobOpening && !this.isJobOpeningClosed)
         || (this.canAccess_feature_AddorEditJobOpening && !this.isJobOpeningClosed) || this.canAccess_feature_LinkCandidateToJobOpening
            || this.canAccess_feature_LinkInterviewProcess) {
            return true;
        } else {
            return false;
        }
    }

    selectCandidate(event) {
        if (event) {
            this.selectedCandidate = event;

        } else {
            this.selectedCandidate = null;
        }
    }

    selectedUserInfoUpdate() {
        this.candidateSearchCriteria.forEach(x => {
            if (x.candidateId === this.selectedCandidate.candidateId && x.jobOpeningId === this.selectedCandidate.jobOpeningId) {
                this.selectedCandidate = x;
            }
        });
        this.cdRef.detectChanges();
    }

    editJobOpening() {
        const dialogRef = this.dialog.open(BasicJobDetailsComponent, {
            disableClose: true,
            width: '850px', height: '700px',
            data: { data: this.actvieJob }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result.success) {
                if (result.addedJob != null && result.addedJob !== '') {
                    this.getJobOpenings();
                }
                this.closePopover();
            }
        });
    }

    openInterviewProcess() {
        const dialogRef = this.dialog.open(InterviewProcessComponent, {
            disableClose: true,
            width: '600px', height: '450px',
            data: { data: this.actvieJob }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }

    openLinkCandidate() {
        const dialogRef = this.dialog.open(CandidateJobLinkComponent, {
            disableClose: true,
            maxWidth: '1000px', maxHeight: '600px',
            data: { data: this.actvieJob }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result.success) {
                this.closePopover();
                if (result.addedJob) {
                    this.getCandiates();
                }
                console.log('The dialog was closed');
            }
        });
    }

    closePopover() {
        const popover = this.editJobMenuPopover;
        if (popover) { popover.close(); }
    }

    archiveJobOpening() {
        this.isArchived = true;
        this.upsertJobDescription();
    }

    closeDialog() {
        const popover = this.archivePopover;
        if (popover) { popover.close(); }
        const popover1 = this.closeJobOpeningPopover;
        if (popover1) { popover1.close(); }
        this.closePopover();
    }

    redirectToRecruitment() {
        this.router.navigate(['recruitment/recruitmentmanagement']);
    }

    getSoftLabelConfiguration() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    candiateAdded(event) {
        this.getCandiates();
        if (event.isUpdated !== '') {
            this.getJobOpenings();
        }
    }

    getJobOpenings() {
        this.isAnyOperationIsInprogress = true;
        const jobOpening = new JobOpening();
        jobOpening.jobOpeningId = this.jobOpeningId;
        this.recruitmentService.getJobOpenings(jobOpening).subscribe((response: any) => {
            if (response.success) {
                if (response.data.length > 0) {
                    this.isAnyOperationIsInprogress = false;
                    this.actvieJob = response.data[0];
                    if (this.openingstatus == null) {
                        this.getjobOpeningStatus();
                    } else {
                        this.openingstatus.forEach(x => {
                            if (x.order === 3 && x.jobOpeningStatusId === this.actvieJob.jobOpeningStatusId) {
                                this.isJobOpeningClosed = true;
                            }
                        });
                    }
                    this.isJobArchived = false;
                    this.description = this.actvieJob.jobDescription;
                    this.timeStamp = this.actvieJob.timeStamp;
                }
                if (response.data.length === 0) {
                    this.isJobArchived = true;
                    this.isAnyOperationIsInprogress = false;
                }
            } else {
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    getCandiates() {
        const candidateSearchtModel = new CandidateSearchtModel();
        candidateSearchtModel.jobOpeningId = this.jobOpeningId;
        this.store.dispatch(new LoadCandidateItemsTriggered(candidateSearchtModel));
    }

    closeJobOpening() {
        this.openingstatus.forEach(x => {
            if (x.order === 3) {
                this.actvieJob.jobOpeningStatusId = x.jobOpeningStatusId;
            }
        });
        this.upsertJobDescription();
    }

    upsertJobDescription() {
        this.savingInProgress = true;
        let jobOpening = new JobOpening();
        jobOpening = this.actvieJob;
        jobOpening.jobOpeningTitle = this.actvieJob.jobOpeningTitle;
        jobOpening.jobDescription = this.description;
        jobOpening.jobOpeningId = this.actvieJob.jobOpeningId;
        jobOpening.dateFrom = this.actvieJob.dateFrom;
        jobOpening.dateTo = this.actvieJob.dateTo;
        jobOpening.minExperience = this.actvieJob.minExperience;
        jobOpening.maxExperience = this.actvieJob.maxExperience;
        jobOpening.minSalary = this.actvieJob.minSalary;
        jobOpening.maxExperience = this.actvieJob.maxSalary;
        jobOpening.certification = this.actvieJob.certification;
        jobOpening.noOfOpenings = this.actvieJob.noOfOpenings;
        jobOpening.qualification = this.actvieJob.qualification;
        jobOpening.jobTypeId = this.actvieJob.jobTypeId;
        jobOpening.jobLocations = this.actvieJob.locationIds;
        jobOpening.jobSkills = this.actvieJob.skillIds;
        jobOpening.timeStamp = this.timeStamp;
        if (this.isArchived) {
            jobOpening.isArchived = this.isArchived;
        } else {
            jobOpening.isArchived = false;
        }
        this.recruitmentService.upsertJobOpening(jobOpening).subscribe((response: any) => {
            if (response.success) {
                this.isEditorVisible = false;
                if (this.isArchived) {
                    this.isArchived = false;
                    this.closeDialog();
                    this.redirectToRecruitment();
                } else {
                    this.closeDialog();
                    this.getJobOpenings();
                }
            } else {
                this.toastr.error(response.apiResponseMessages[0].message);
                this.description = this.actvieJob.description;
                this.isEditorVisible = false;
                this.isArchived = false;
                this.getJobOpenings();
            }
            this.savingInProgress = false;
            this.cdRef.detectChanges();
        });
    }

    getjobOpeningStatus() {
        this.isAnyOperationIsInprogress = false;
        const jobOpeningStatusInputModel = new JobOpeningStatusInputModel();
        jobOpeningStatusInputModel.isArchived = false;
        this.recruitmentService.getJobOpeningStatus(jobOpeningStatusInputModel).subscribe((response: any) => {
            if (response.success === true) {
                this.openingstatus = response.data;
                this.openingstatus.forEach(x => {
                    if (x.order === 3 && x.jobOpeningStatusId === this.actvieJob.jobOpeningStatusId) {
                        this.isJobOpeningClosed = true;
                    }
                });
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            } else {
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }
}
