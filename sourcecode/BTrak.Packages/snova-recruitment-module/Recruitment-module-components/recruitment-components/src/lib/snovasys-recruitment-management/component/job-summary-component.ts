
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input,
   OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SatPopover } from '@ncstate/sat-popover';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import * as _ from 'underscore';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { InterviewProcessComponent } from './interview-process-component';
import { JobOpening } from '../../snovasys-recruitment-management-apps/models/jobOpening.model';
import { RecruitmentService } from '../../snovasys-recruitment-management-apps/services/recruitment.service';
import { CreateJobOpeningItemTriggered } from '../../snovasys-recruitment-management-apps/store/actions/job-opening.action';
import { Store } from '@ngrx/store';
import { State } from '../../snovasys-recruitment-management-apps/store/reducers/index';
import { CandidateJobLinkComponent } from './candidate-link.component';
import { CandidateSearchtModel } from '../models/candidate-search.model';
import { LoadCandidateItemsTriggered } from '../../snovasys-recruitment-management-apps/store/actions/candidate.action';
import { CreateJobDetailsComponent } from './create-job-detail.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'gc-job-summary',
  templateUrl: 'job-summary-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class JobSummaryComponent extends CustomAppBaseComponent implements OnInit {
  @Input() isAnyOperationIsInProgress = false;
  @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
  @ViewChild('archivePopover') archiveJobOpeningPopover: SatPopover;
  @ViewChild('closeJobOpeningPopover') closeJobOpeningPopover: SatPopover;
  @Output() jobEdited = new EventEmitter<any>();
  @Input('job')
  set _job(data: any) {
    this.expansionIcon = false;
    this.panelOpenState = false;
    this.isCloseClicked = false;
    this.job = data;
    if (this.openingstatus != null) {
      this.openingstatus.forEach(x => {
        if (x.order === 3 && x.jobOpeningStatusId === this.job.jobOpeningStatusId) {
          this.isJobOpeningClosed = true;
        }
        if (x.order === 1 && x.jobOpeningStatusId === this.job.jobOpeningStatusId) {
          this.isJobOpeningDraft = true;
        }
      });
    }
  }

  @Input('jobSelected')
  set _jobSelected(data: boolean) {
    this.jobSelected = data;
    this.expansionIcon = false;
    this.panelOpenState = false;
  }

  @Input('openingstatus')
  set _setOpeningstatus(openingstatus: any) {
    if (openingstatus != null && openingstatus !== undefined) {
      this.openingstatus = openingstatus;
      this.isJobOpeningClosed = false;
      if (this.job != null) {
        this.openingstatus.forEach(x => {
          if (x.order === 3 && x.jobOpeningStatusId === this.job.jobOpeningStatusId) {
            this.isJobOpeningClosed = true;
          }
          if (x.order === 1 && x.jobOpeningStatusId === this.job.jobOpeningStatusId) {
            this.isJobOpeningDraft = true;
          }
        });
      }
      this.cdRef.detectChanges();
    }
  }

  jobOpening: JobOpening[];
  img: string = null;
  closePopup: any;
  selectedJobStatusOrder: number;
  createJobForm: any;
  openingstatus: any = null;
  actvieJob: any;
  isJobOpeningClosed: boolean;
  isCloseClicked = false;
  isAnyOperationIsInprogress: boolean;
  isJobArchived: boolean;
  timeStamp: any;
  description: any;
  jobOpeningId: string;
  savingInProgress: boolean;
  isEditorVisible: boolean;
  toastr: any;
  isJobOpeningDraft: boolean;
  isActiveJob: boolean;
  selectedTab: string;
  job: any = null;
  jobSelected: boolean;
  expansionIcon: boolean;
  entityFeatureIds: any[];
  isTagsPopUp: boolean;
  isArchived: boolean;
  Arr = Array;
  num = 4;
  public ngDestroyed$ = new Subject();
  panelOpenState: boolean;
  uniqueNumberUrl: string;
  contextMenuPosition = { x: '0px', y: '0px' };
  anyOperationInProgress$: Observable<boolean>;

  constructor(
    private translateService: TranslateService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private store: Store<State>,
    public recruitmentService: RecruitmentService,
    private router: Router,
    private snackbar: MatSnackBar,
    private cdRef: ChangeDetectorRef) {
    super();
    this.route.params.subscribe((params) => {
      this.selectedTab = params['tab'.toString()];
    });

  }

  ngOnInit() {
    super.ngOnInit();
  }

  getJobOpenings() {
    const jobOpening = new JobOpening();
    this.isAnyOperationIsInProgress = true;
    this.recruitmentService.getJobOpenings(jobOpening).subscribe((response: any) => {
      if (response.success) {
        this.job = response.data;
      } else {
        this.isAnyOperationIsInProgress = false;
      }
    });
  }

  addJobDetail() {
    this.isAnyOperationIsInProgress = true;
    let jobOpening = new JobOpening();
    jobOpening = {...this.job, isArchived: true};
    //jobOpening.isArchived = true;
    if (this.isCloseClicked) {
      jobOpening.isArchived = false;
    }
    this.store.dispatch(new CreateJobOpeningItemTriggered(jobOpening));
  }

  closeDialog() {
    const popover = this.archiveJobOpeningPopover;
    if (popover) { popover.close(); }
    const popover1 = this.closeJobOpeningPopover;
    if (popover1) { popover1.close(); }
  }

  editJob() {
    const dialogRef = this.dialog.open(CreateJobDetailsComponent, {
      disableClose: true,
      width: '850px', height: '720px',
      data: { data: this.job }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        if (result.addedJob != null && result.addedJob !== '') {
          this.jobEdited.emit(result.addedJob);
        }
      }
      console.log('The dialog was closed');
    });
  }

  backloagtranslate(name) {
    if (name == null) {
      return name;
    }
    name = name.trim();
    name = this.translateService.instant(name);
    return name;
  }

  getColor(job) {
    if (job.totaloffered >= job.noOfOpenings) {
      return '#0ffc0fb3';
    } else {
      return '#ff1d1db3'; }
  }

  closeMatMenu() {
    const contextMenu = this.triggers.toArray()[0];
    if (contextMenu) {
      contextMenu.closeMenu();
    }
  }

  togglePanel() {
    this.expansionIcon = !this.expansionIcon;
    if (this.job.id === '0') {
      this.panelOpenState = false;
    } else {
      this.panelOpenState = !this.panelOpenState;
    }
  }

  openContextMenu(event: MouseEvent) {
    event.preventDefault();
    const contextMenu = this.triggers.toArray()[0];
    if (contextMenu) {
      console.log(event);
      this.contextMenuPosition.x = (event.clientX) + 'px';
      this.contextMenuPosition.y = (event.clientY - 30) + 'px';
      contextMenu.openMenu();
    }
  }

  navigateToJobOpeningPage() {
    this.router.navigate([
      'recruitment/jobopening/' + this.job.jobOpeningId
    ]);
  }

  copyLink() {
    const angularRoute = this.router.url;
    const url = window.location.href;
    this.uniqueNumberUrl = url.replace(angularRoute, '');
    this.uniqueNumberUrl = this.uniqueNumberUrl + '/recruitment/jobopening/' + this.job.jobOpeningId;
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.uniqueNumberUrl;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.snackbar.open('Link copied successfully', 'Ok', { duration: 3000 });
  }

  openInNewTab() {
    const angularRoute = this.router.url;
    const url = window.location.href;
    this.uniqueNumberUrl = url.replace(angularRoute, '');
    this.uniqueNumberUrl = this.uniqueNumberUrl + '/recruitment/jobopening/' + this.job.jobOpeningId;
    window.open(this.uniqueNumberUrl, '_blank');
  }

  canCopyPublicUrl() {
    if (this.job.publicUrl !== undefined && this.job.publicUrl != null) {
      return this.job.publicUrl.includes('http') ? true : false;
    } else {
      return false;
    }
  }

  copyRegistrationLink() {
    const copyText = this.job.publicUrl;
    const selBox = document.createElement('textarea');
    selBox.value = copyText;
    document.body.appendChild(selBox);
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.snackbar.open(this.translateService.instant('USERSTORY.LINKCOPIEDSUCCESSFULLY'), 'Ok', { duration: 2000 });
  }

  openInterviewProcess() {
    const dialogRef = this.dialog.open(InterviewProcessComponent, {
      disableClose: true,
      width: '600px', height: '465px',
      data: { data: this.job },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openLinkCandidate() {
    const dialogRef = this.dialog.open(CandidateJobLinkComponent, {
      disableClose: true,
      maxWidth: '1000px', maxHeight: '600px',
      data: { data: this.job }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.success) {
        if (result.addedJob) {
          this.getCanidateAfterClose();
        }
        console.log('The dialog was closed');
      }
    });
  }

  getCanidateAfterClose() {
    if (this.jobSelected) {
      const candidateSearchtModel = new CandidateSearchtModel();
      candidateSearchtModel.jobOpeningId = this.job.jobOpeningId;
      this.store.dispatch(new LoadCandidateItemsTriggered(candidateSearchtModel));
    }
  }

  closeCancelDialog() {
    const popover = this.closeJobOpeningPopover;
    if (popover) { popover.close(); }
  }

  closeJobOpening() {
    this.openingstatus.forEach(x => {
      if (x.order === 3) {
        this.job.jobOpeningStatusId = x.jobOpeningStatusId;
      }
    });
    this.isCloseClicked = true;
    this.addJobDetail();
  }

}
