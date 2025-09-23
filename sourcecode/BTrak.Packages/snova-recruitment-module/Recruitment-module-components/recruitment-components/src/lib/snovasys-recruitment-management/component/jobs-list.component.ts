import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { JobOpening } from '../../snovasys-recruitment-management-apps/models/jobOpening.model';
import { CreateJobDetailsComponent } from './create-job-detail.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as _ from 'underscore';
import * as  moment_ from 'moment';
import { RefreshJobOpeningList } from '../../snovasys-recruitment-management-apps/store/actions/job-opening.action';
import { SoftLabelConfigurationModel } from '@snovasys/snova-custom-fields';
import { State } from '../../store/reducers.ts';
const moment = moment_;

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-jobs-list',
  templateUrl: 'jobs-list.component.html'
})
export class JobsListComponent extends CustomAppBaseComponent implements OnInit {
  @Output() selectJob = new EventEmitter<object>();
  @Output() changeCandidateJob = new EventEmitter<object>();
  @Output() addOrEditJob = new EventEmitter<any>();
  @Output() jobAdded = new EventEmitter<any>();
  @ViewChildren('addJobPopover') addOrEditJobPopover;

  @Input('activeJobs')
  set _setActiveJobs(activeJobs: JobOpening) {
    if (activeJobs != null && activeJobs !== undefined) {
      this.actvieJobsList = activeJobs;
      this.statusColor = this.actvieJobsList.statusColor;
      this.tempList = this.actvieJobsList;
      this.isActiveJobsBoard = true;
      this.isSkillsBoard = false;
      this.isInterviewerBoard = false;
      if (this.actvieJobsList.length > 0) {
        this.totalCount = this.actvieJobsList[0].totalCount;
        this.totalPagingCount = this.actvieJobsList.length;
      } else {
        this.totalCount = 0;
      }
      this.cdRef.detectChanges();
    }
  }

  @Input('selectedJob')
  set _setSelectedJob(selectedJob: any) {
    if (selectedJob != null && selectedJob !== undefined) {
      this.selectedJobOpeningId = selectedJob.jobOpeningId;
      this.cdRef.detectChanges();
    }
  }

  @Input('openingstatus')
  set _setOpeningstatus(openingstatus: any) {
    if (openingstatus != null && openingstatus !== undefined) {
      this.openingstatus = openingstatus;
      this.loadOpeningStatusList();
      this.jobOpeningStatusId = this.openingstatus.jobOpeningStatusId;
      if (this.jobOpeningStatusId && this.jobOpeningStatusId.toLowerCase() === ConstantVariables.RecruitmentReferenceTypeId.toLowerCase()) {
        this.showDropdown = false;
      } else {
        this.showDropdown = true;
      }
      this.cdRef.detectChanges();
    }
  }

  userId: string;
  isFiltersVisible = false;
  searchText: string = null;
  jobOpening: any;
  selectedJob: JobOpening;
  selectedColor: string;
  JobOpeningStatus$: Observable<JobOpening[]>;
  colorList: any;
  selectedJobStatusColor: any[] = [];
  statusColor: any;
  selectedResponsiblePersonlist: any[] = [];
  isSelectedMembers: any[] = [];
  jobs: JobOpening[] = [];
  jobResponsiblePerson: string;
  isSelected: any[] = [];
  jobOpeningStatusId: any;
  filteredStatusList: any[] = [];
  dateTo: Date;
  dateto: Date;
  totalCount: any = 0;
  pageSize = 25;
  pageIndex: number;
  pageNumber = 1;
  pageSizeOptions: number[] = [25, 50, 100, 150, 200];
  totalPagingCount: any;
  selectedTab: string;
  selectedTabIndex: number;
  isActiveJobsBoard: boolean;
  isSkillsBoard: boolean;
  isInterviewerBoard: boolean;
  showDropdown: boolean;
  searchJobTags: boolean;
  softLabels: SoftLabelConfigurationModel[];
  actvieJobsList: any;
  tempList: any;
  selectedJobOpeningId: string;
  openingstatus: any;
  showUsersList: boolean;
  showColoursList: boolean;
  showcolour:boolean;
  divActivate: boolean;
  maxDate: any = new Date();

  constructor(
    private store: Store<State>,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
  closeSearch() {
    this.filterByName(null);
  }

  getclass() {
    if ((this.actvieJobsList && this.actvieJobsList.length > 0 && this.actvieJobsList[0].totalCount > 25
       && this.actvieJobsList.length > 24 && this.actvieJobsList !== undefined
        && this.actvieJobsList.length !== 0) || (this.totalCount > 25 && this.pageNumber > 1)) {
      return 'p-0 m-0 alljobs-list';
    } else if (this.actvieJobsList.length < 25 && this.tempList && this.tempList.length > 0 && this.tempList[0].totalCount > 25) {
      return 'p-0 m-0 alljobs-list';
    } else {
      return 'p-0 m-0 allgoals-list';
    }
  }

  getJobOpeningsList(pageEvent) {
    const jobOpening = new JobOpening();
    if (pageEvent.pageSize !== this.pageSize) {
      this.pageNumber = 1;
      this.pageIndex = 0;
    } else {
      this.pageNumber = pageEvent.pageIndex + 1;
      this.pageIndex = pageEvent.pageIndex;
    }
    this.pageSize = pageEvent.pageSize;
    jobOpening.pageSize = this.pageSize;
    jobOpening.pageNumber = this.pageNumber;
    this.store.dispatch(new RefreshJobOpeningList(jobOpening));
  }

  filterByName(event) {
    if (event != null) {
      this.searchText = event.target.value.toLowerCase();
      this.searchText = this.searchText.trim();
    } else {
      this.searchText = '';
    }
    const temp = this.tempList.filter(address => (address.jobOpeningTitle.toLowerCase().indexOf(this.searchText) > -1));

    this.actvieJobsList = temp;
    this.totalPagingCount = this.actvieJobsList.length;
    if (this.actvieJobsList.length > 0) {
    this.totalCount = this.actvieJobsList[0].totalCount;
    }
    this.cdRef.detectChanges();
  }

  createJobDetails(result) {
    const dialogRef = this.dialog.open(CreateJobDetailsComponent, {
      disableClose: true,
      width: '850px', height: '720px',
      data: { data: result }
    });
    // tslint:disable-next-line: no-shadowed-variable
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.success) {
        if (result.addedJob != null && result.addedJob !== '') {
          this.jobAdd(result.addedJob);
        } else {
        }
      }
      console.log('The dialog was closed');
    });
  }

  jobAdd(value) {
    if (value != null && value !== '') {
      this.jobAdded.emit(value);
    }
  }

  jobEdited(value) {
    if (value != null && value !== '') {
      this.getJobOpenings(value);
    }
  }

  getJobOpenings(value) {
    this.addOrEditJob.emit(value);
  }

  handleClickOnJobSummaryComponent(selectedJobModel: JobOpening) {
    this.selectedJob = selectedJobModel;
    this.selectedJobOpeningId = selectedJobModel.jobOpeningId;
    this.selectJob.emit({ job: selectedJobModel, checked: true });
  }

  clearJobForm() { }

  closeJobSearch() { }

  selectedJobbyClick(jobId) {
    this.changeCandidateJob.emit(jobId);
  }
  resetAllFilters() {
    this.searchText = null;
    this.jobResponsiblePerson = null;
    this.selectedJobStatusColor = [];
    this.selectedColor = null;
    this.colorList = undefined;
    this.filterByName(null);
    this.dateToChanged(null);
  }

  selectJobStatusColor(jobStatus) {
    const index = this.selectedJobStatusColor.indexOf(jobStatus);
    if (index > -1) {
      this.selectedJobStatusColor.splice(index, 1);
    } else {
      this.selectedJobStatusColor.push(jobStatus);
    }
    this.selectedColor = this.selectedJobStatusColor.toString();
    this.colorList = this.selectedJobStatusColor;
    if (this.selectedJobStatusColor.length === 0) {
      this.colorList = undefined;
    }
  }

  setMyStyles(color) {
    // tslint:disable-next-line:prefer-const
    let styles = {
      'background-color': color
    };
    return styles;
  }

  getSelectedMember(userId, selectedIndex) {
    const index = this.selectedResponsiblePersonlist.indexOf(userId);
    if (index > -1) {
      this.selectedResponsiblePersonlist.splice(index, 1);
      this.isSelectedMembers[selectedIndex] = false;
    } else {
      this.selectedResponsiblePersonlist.push(userId);
      this.isSelectedMembers[selectedIndex] = true;
    }
    this.jobResponsiblePerson = this.selectedResponsiblePersonlist.toString();
  }

  GetAssigne(userId, isChecked, selectedIndex) {
    if (isChecked) {
      this.selectedResponsiblePersonlist.push(userId);
      this.isSelected[selectedIndex] = true;
    } else {
      const index = this.selectedResponsiblePersonlist.indexOf(userId);
      this.selectedResponsiblePersonlist.splice(index, 1);
      this.isSelected[selectedIndex] = false;
    }
    this.jobResponsiblePerson = this.selectedResponsiblePersonlist.toString();
  }
  loadOpeningStatusList() {
    this.openingstatus = this.openingstatus.filter((v, i, a) => a.findIndex(t => (t.status === v.status)) === i);
    console.log(this.openingstatus);
  }

  dateToChanged(event: MatDatepickerInputEvent<Date>) {
    const dateto = moment(event.value).format('YYYY-MM-DD').toString();
    const tempList = this.tempList.filter(actvieJobsList =>
      (actvieJobsList.dateTo == null ? null : actvieJobsList.dateTo.indexOf(dateto) > -1));
    this.actvieJobsList = tempList;
  }

  closeDateFilter() {
    this.dateTo = null;
    this.actvieJobsList = this.tempList;
  }
}
