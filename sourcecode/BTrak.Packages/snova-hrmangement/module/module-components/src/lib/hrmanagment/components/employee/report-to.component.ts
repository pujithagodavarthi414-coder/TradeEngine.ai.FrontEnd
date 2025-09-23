import { Component, ViewChildren, Input, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { State } from "../../store/reducers/index";
import { tap, takeUntil } from 'rxjs/operators';

import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';

import { Page } from '../../models/Page';
import { ReportToSearchModel } from '../../models/report-to-search-model';
import { ReportToDetailsModel } from '../../models/report-to-details-model';

import * as hrManagementModuleReducer from '../../store/reducers/index';

import { LoadReportToTriggered, CreateReportToTriggered, ReportToActionTypes } from '../../store/actions/report-to.actions';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { HRManagementService } from '../../services/hr-management.service';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-hr-component-report-to',
  templateUrl: 'report-to.component.html',
})

export class ReportToComponent extends CustomAppBaseComponent {
  @ViewChildren('editReportToDetailsPopover') editReportToDetailsPopover;
  @ViewChildren('deleteReportToPopover') deleteReportToPopovers;

  @Input('selectedEmployeeId')
  set selectedEmployeeId(data: string) {
    if (data != null && data !== undefined && this.employeeId !== data) {
      this.employeeId = data;
      this.getReportToList();
    }
  }

  @Input('isPermission')
  set isPermission(data: boolean) {
    this.permission = data;
  }

  editReportToDetailsData: ReportToDetailsModel;
  reportToModel: ReportToDetailsModel;

  permission: boolean = false;
  employeeId: string;
  sortBy: string;
  dataItem: any;
  sortDirection: boolean;
  page = new Page();
  searchText: string = '';

  reportToList$: Observable<ReportToDetailsModel[]>;
  reportToDetailsLoading$: Observable<boolean>;
  public ngDestroyed$ = new Subject();

  constructor(private actionUpdates$: Actions, private store: Store<State>, private cdRef: ChangeDetectorRef,
    private cookieService: CookieService, private hrManagementService: HRManagementService) {
    super();
    this.page.size = 30;
    this.page.pageNumber = 0;

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(ReportToActionTypes.LoadReportToCompleted),
        tap(() => {
          this.reportToList$ = this.store.pipe(select(hrManagementModuleReducer.getReportToAll));
          this.reportToList$.subscribe((result) => {
            this.page.totalElements = result.length > 0 ? result[0].totalCount : 0;
            this.page.totalPages = this.page.totalElements / this.page.size;
            this.cdRef.detectChanges();
          })
        })
      )
      .subscribe();
  }

  closeUpsertReportToPopover() {
    this.editReportToDetailsPopover.forEach((p) => p.closePopover());
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.employeeId == undefined || this.employeeId == null || this.employeeId == "")
      this.getEmployees();
  }

  getEmployees() {
    const userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    this.hrManagementService.getMyEmployeeId(userId).subscribe((result: any) => {
      if (result.success === true) {
        this.employeeId = result.data.employeeId;
        this.getReportToList();
      }
    });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getReportToList();
  }

  onSort(event) {
    const sort = event.sorts[0];
    this.sortBy = sort.prop;
    if (sort.dir === 'asc')
      this.sortDirection = true;
    else
      this.sortDirection = false;
    this.page.size = 30;
    this.page.pageNumber = 0;
    this.getReportToList();
  }

  search() {
    if (this.searchText.length > 0) {
      this.searchText = this.searchText.trim();
      if (this.searchText.length <= 0) return;
    }
    this.page.size = 30;
    this.page.pageNumber = 0;
    this.getReportToList()
  }

  closeSearch() {
    this.searchText = '';
    this.getReportToList()
  }

  editReportTo(event, editReportToDetailsPopover) {
    this.editReportToDetailsData = event;

    editReportToDetailsPopover.openPopover();
  }

  getReportToList() {
    const ReportToResult = new ReportToSearchModel();
    ReportToResult.employeeId = this.employeeId;
    ReportToResult.employeeDetailType = "ReportToDetails";
    ReportToResult.isArchived = false;
    ReportToResult.searchText = this.searchText;
    ReportToResult.sortBy = this.sortBy;
    ReportToResult.sortDirectionAsc = this.sortDirection;
    ReportToResult.pageNumber = this.page.pageNumber + 1;
    ReportToResult.pageSize = this.page.size;
    this.store.dispatch(new LoadReportToTriggered(ReportToResult));
    this.reportToDetailsLoading$ = this.store.pipe(select(hrManagementModuleReducer.getReportToLoading));
  }

  getreportToId(reportToModel, deleteReportToPopover) {
    this.reportToModel = reportToModel;
    deleteReportToPopover.openPopover();
  }

  // addReportToPopover(editReportToDetailsPopover) {
  //   editReportToDetailsPopover.openPopover();
  //   this.editReportToDetailsData = null;
  // }
  deleteReportDilogue() {
    let reportToData = new ReportToDetailsModel();
    reportToData.employeeReportToId = this.reportToModel.employeeReportToId;
    reportToData.reportToEmployeeId = this.reportToModel.reportToEmployeeId;
    reportToData.reportingMethodId = this.reportToModel.reportingMethodId;
    reportToData.reportingFrom = this.reportToModel.reportingFrom;
    reportToData.comments = this.reportToModel.comments;
    reportToData.isArchived = true;
    reportToData.employeeId = this.employeeId;
    reportToData.timeStamp = this.reportToModel.timeStamp;
    this.store.dispatch(new CreateReportToTriggered(reportToData));
    this.deleteReportToPopovers.forEach((p) => p.closePopover());
  }

  cancelDeleteEmergencyPopup() {
    this.deleteReportToPopovers.forEach((p) => p.closePopover());
  }
}