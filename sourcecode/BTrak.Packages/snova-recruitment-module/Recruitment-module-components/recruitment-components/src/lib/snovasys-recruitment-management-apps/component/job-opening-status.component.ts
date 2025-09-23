import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { State } from '../store/reducers/index';
import * as recruitmentModuleReducer from '../store/reducers/index';
import { DashboardFilterModel } from '../models/dashboardFilter.model';
import { Page } from '../models/page';
import '../../globaldependencies/helpers/fontawesome-icons';
import { JobOpeningStatus } from '../models/jobOpeningStatus';
import { JobOpeningStatusInputModel } from '../models/jobOpeningStatusInputModel';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { CeateJobOpeningStatusTriggered, JobOpeningStatusActionTypes, LoadJobOpeningStatusTriggered } from '../store/actions/job-opening-status.actions';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { JobOpeningStausUpsert } from '../models/job-opening-status-upsert.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-am-component-job-opening-status',
  templateUrl: `job-opening-status.component.html`
})
export class JobOpeningStatusComponent extends CustomAppBaseComponent implements OnInit {
  @ViewChildren('upsertJobOpeningStatusPopUp') upsertJobOpeningStatusPopover;
  @ViewChildren('deleteJobOpeningPopup') deleteJobOpeningPopover;
  @ViewChild('formDirective') formDirective: FormGroupDirective;

  @Input('dashboardFilters')
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  @Input('fromRoute')
  set _fromRoute(data: boolean) {
    if (data || data === false) {
      this.isFromRoute = data; } else {
      this.isFromRoute = true; }
  }

  dashboardFilters: DashboardFilterModel;
  isFromRoute = false;
  jobOpeningStatusList$: Observable<JobOpeningStatus[]>;
  jobOpeningStatusDataLoading$: Observable<boolean>;
  searchText = '';
  sortBy = 'order';
  sortDirection = true;
  page = new Page();
  roleFeaturesIsInProgress$: Observable<boolean>;
  isArchived: boolean;
  jobOpeningStatusForm: FormGroup;
  isEdit: boolean;
  isAnyOperationsInProgress: boolean;
  isThereAnError: boolean;
  validationMessage: string;
  isAddandEdit = false;

  constructor(
    private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef,
    private toastr: ToastrService) {
    super();
    this.actionUpdates$
      .pipe(
        ofType(JobOpeningStatusActionTypes.LoadJobOpeningStatusCompleted),
        tap(() => {
          this.jobOpeningStatusList$.subscribe((result) => {
            this.page.totalElements = result.length > 0 ? result[0].totalCount : 0;
            this.page.totalPages = this.page.totalElements / this.page.size;
          });
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        ofType(JobOpeningStatusActionTypes.CreateJobOpeningStatusCompleted),
        tap((result: any) => {
          if (result.jobOppeningStatusId) {
            this.isAnyOperationsInProgress = false;
            this.cdRef.detectChanges();
            this.closeUpsertJobOpeningStatusPopup();
            this.closeDeleteJobOpeningStatusPopup();
          }
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        ofType(JobOpeningStatusActionTypes.CreateJobOpeningStatusFailed),
        tap((response: any) => {
          this.toastr.error(response.validationMessages[0].message);
          this.isAnyOperationsInProgress = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe();
  }

  ngOnInit() {
    super.ngOnInit();
    this.formValidate();
    this.page.size = 10;
    this.page.pageNumber = 0;
    this.getJobOpeningStatus();
    this.roleFeaturesIsInProgress$ = this.store.pipe(select(recruitmentModuleReducer.getRoleFeaturesLoading));
  }

  formValidate() {
    this.jobOpeningStatusForm = new FormGroup({
      jobOpeningStatusId: new FormControl(null,
        Validators.compose([

        ])
      ),
      status: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      order: new FormControl(null,
        Validators.compose([
          Validators.required
        ])
      ),
      timeStamp: new FormControl(null,
        Validators.compose([

        ])
      )
    });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getJobOpeningStatus();
  }

  onSort(event) {
    if (this.page.totalElements > 0) {
      const sort = event.sorts[0];
      this.sortBy = sort.prop;
      if (sort.dir === 'asc') {
        this.sortDirection = true;
      } else {
        this.sortDirection = false;
      }
      this.page.size = 10;
      this.page.pageNumber = 0;
      this.getJobOpeningStatus();
    }
  }

  search() {
    if (this.searchText.length > 0) {
      this.searchText = this.searchText.trim();
      if (this.searchText.length <= 0) { return; }
    }
    this.page.size = 10;
    this.page.pageNumber = 0;
    this.getJobOpeningStatus();
  }

  createJobOpeningStatus(upsertJobOpeningStatusPopUp) {
    this.formValidate();
    this.isEdit = false;
    upsertJobOpeningStatusPopUp.openPopover();
  }

  editJobOpeningStatus(row, upsertJobOpeningStatusPopUp) {
    this.jobOpeningStatusForm.patchValue(row);
    this.isEdit = true;
    upsertJobOpeningStatusPopUp.openPopover();
  }

  deleteJobOpeningStatusPopupOpen(row, deleteJobOpeningPopup) {
    this.jobOpeningStatusForm.patchValue(row);
    deleteJobOpeningPopup.openPopover();
  }

  closeUpsertJobOpeningStatusPopup() {
    this.isEdit = false;
    this.formDirective.resetForm();
    this.formValidate();
    this.upsertJobOpeningStatusPopover.forEach((p) => p.closePopover());
  }

  closeDeleteJobOpeningStatusPopup() {
    this.formDirective.resetForm();
    this.formValidate();
    this.deleteJobOpeningPopover.forEach((p) => p.closePopover());
  }

  deleteJobOpeningStatus() {
    this.isAnyOperationsInProgress = true;
    const jobOpeningStatusUpsert = new JobOpeningStausUpsert();
    jobOpeningStatusUpsert.jobOpeningStatusId = this.jobOpeningStatusForm.value.jobOpeningStatusId;
    jobOpeningStatusUpsert.order = this.jobOpeningStatusForm.value.order;
    jobOpeningStatusUpsert.status = this.jobOpeningStatusForm.value.status;
    jobOpeningStatusUpsert.timeStamp = this.jobOpeningStatusForm.value.timeStamp;
    jobOpeningStatusUpsert.isArchived = !this.isArchived;
    this.store.dispatch(new CeateJobOpeningStatusTriggered(jobOpeningStatusUpsert));
  }

  getJobOpeningStatus() {
    const jobOpeningStatusSearchResult = new JobOpeningStatusInputModel();
    jobOpeningStatusSearchResult.searchText = this.searchText;
    jobOpeningStatusSearchResult.sortBy = this.sortBy;
    jobOpeningStatusSearchResult.sortDirectionAsc = this.sortDirection;
    jobOpeningStatusSearchResult.pageNumber = this.page.pageNumber + 1;
    jobOpeningStatusSearchResult.pageSize = this.page.size;
    jobOpeningStatusSearchResult.isArchived = this.isArchived;
    this.store.dispatch(new LoadJobOpeningStatusTriggered(jobOpeningStatusSearchResult));
    this.jobOpeningStatusList$ = this.store.pipe(select(recruitmentModuleReducer.getAllJobOpeningStatus));
    this.jobOpeningStatusDataLoading$ = this.store.pipe(select(recruitmentModuleReducer.getJobOpeningStatusLoading));
  }

  onSelect(selected) {}

  upsertJobOpeningStatus(formDirective: FormGroupDirective) {
    this.isAnyOperationsInProgress = true;
    const jobOpeningStatusUpsert = new JobOpeningStausUpsert();
    jobOpeningStatusUpsert.jobOpeningStatusId = this.jobOpeningStatusForm.value.jobOpeningStatusId;
    jobOpeningStatusUpsert.order = this.jobOpeningStatusForm.value.order;
    jobOpeningStatusUpsert.status = this.jobOpeningStatusForm.value.status;
    jobOpeningStatusUpsert.isArchived = false;
    jobOpeningStatusUpsert.timeStamp = this.jobOpeningStatusForm.value.timeStamp;
    this.store.dispatch(new CeateJobOpeningStatusTriggered(jobOpeningStatusUpsert));
  }

  closeSearch() {
    this.searchText = '';
    this.getJobOpeningStatus();
  }
}
