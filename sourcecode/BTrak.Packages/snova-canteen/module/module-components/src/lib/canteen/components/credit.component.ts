import { Component, ChangeDetectionStrategy, Input, ViewChildren } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { ofType, Actions } from '@ngrx/effects';
import { ToastrService } from 'ngx-toastr';

import { CanteenBalanceModel } from '../models/canteen-balance-model';
import { CanteenBalanceSearchInputModel } from '../models/canteen-balance-search-model';

import { CanteenBalanceActionTypes, LoadCanteenBalanceTriggered } from '../store/actions/canteen-balance.actions';

import { State } from '../store/reducers/index';
import * as hrManagementModuleReducer from '../store/reducers/index';

import { CanteenCreditActionTypes } from '../store/actions/canteen-credit.actions';
import { Router } from '@angular/router';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { Page } from '../models/Page';
import { SoftLabelConfigurationModel } from '../models/softLabels-model';
import { EntityDropDownModel } from '../models/entity-dropdown.module';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { CanteenManagementService } from '../services/canteen-management.service';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-hr-component-credit',
  templateUrl: `credit.component.html`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    @media only screen and (max-width: 365px) {
      .search-canteen {
        width: 30% !important;
      }
    }
    @media only screen and (max-width: 365px) {
      .credit-icon {
        right: 169px !important;
    top: 12px !important;
      }
    }
  `]
})
export class CreditComponent extends CustomAppBaseComponent {

  @ViewChildren("creditPopover") creditPopover;

  @Input('buttonView')
  set buttonView(data: boolean) {
    this.buttonEnable = data;
  }

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  buttonEnable: boolean;

  sortBy: string;
  searchText: string;
  sortDirection: boolean;
  isScrollable: boolean = false;
  page = new Page();
  isAddCanteenCredit: boolean = false;

  softLabels: SoftLabelConfigurationModel[];

  softLabels$: Observable<SoftLabelConfigurationModel[]>;

  validationMessage: string;
  selectedEntity: string;
  entities: EntityDropDownModel[];
  creditRecords$: Observable<CanteenBalanceModel[]>;
  creditGridSpinner$: Observable<boolean>;
  open = true;
  public ngDestroyed$ = new Subject();

  constructor(private canteenService: CanteenManagementService, private store: Store<State>, private actionUpdates$: Actions, private router: Router, private toastr: ToastrService) {
    super();
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(CanteenBalanceActionTypes.LoadCanteenBalanceCompleted),
        tap(() => {
          this.creditRecords$ = this.store.pipe(select(hrManagementModuleReducer.getCanteenBalanceAll));
          this.creditRecords$.subscribe((result) => {
            this.page.totalElements = result.length > 0 ? result[0].totalCount : 0;
            this.page.totalPages = this.page.totalElements / this.page.size;
            this.isScrollable = true;
          })
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(CanteenCreditActionTypes.CreateCanteenCreditCompleted),
        tap(() => {
          this.searchText = '';
        })
      )
      .subscribe();


  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabels();
    this.getEntityDropDown();
    //this.canAccess_feature_ViewEmployeeCredits.subscribe(result => {
    if (this.canAccess_feature_ViewEmployeeCredits) {
      this.page.size = 10;
      this.page.pageNumber = 0;
      this.getCreditList();
    }
    //});
  }

  getSoftLabels() {
    this.softLabels$ = this.store.pipe(select(hrManagementModuleReducer.getSoftLabelsAll));
    this.softLabels$.subscribe((x) => this.softLabels = x);
    if (!this.softLabels) {
      this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    }
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getCreditList();
  }

  onSort(event) {
    const sort = event.sorts[0];
    this.sortBy = sort.prop;
    console.log(sort);
    if (sort.dir === 'asc')
      this.sortDirection = true;
    else
      this.sortDirection = false;
    this.page.size = 10;
    this.page.pageNumber = 0;
    this.getCreditList();
  }

  searchCreditList() {
    if (this.searchText && this.searchText.length <= 0) return;
    this.page.pageNumber = 0;
    this.getCreditList();
  }

  closeSearch() {
    this.searchText = '';
    this.getCreditList();
  }

  getCreditList() {
    const creditSearchResult = new CanteenBalanceSearchInputModel();
    creditSearchResult.sortBy = this.sortBy;
    creditSearchResult.sortDirectionAsc = this.sortDirection;
    creditSearchResult.pageNumber = this.page.pageNumber + 1;
    creditSearchResult.pageSize = this.page.size;
    creditSearchResult.searchText = this.searchText;
    creditSearchResult.entityId = this.selectedEntity;
    this.store.dispatch(new LoadCanteenBalanceTriggered(creditSearchResult));
    this.creditGridSpinner$ = this.store.pipe(select(hrManagementModuleReducer.getCanteenBalanceLoading));
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.ngDestroyed$.next();
  }

  creditPopupOpen(creditPopover) {
    this.isAddCanteenCredit = true;
    creditPopover.openPopover();
  }

  closeCanteenCreditPopover() {
    this.creditPopover.forEach((p) => p.closePopover());
    this.isAddCanteenCredit = false;
  }

  goToProfile(url) {
    this.router.navigateByUrl('dashboard/profile/' + url);
  }
  getEntityDropDown() {
    let searchText = "";
    this.canteenService.getEntityDropDown(searchText).subscribe((responseData: any) => {
      if (responseData.success === false) {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
      }
      else {
        this.entities = responseData.data;
      }
    });
  }

  entityValues(name) {
    this.selectedEntity = name;
    this.getCreditList();
  }

  filterClick() {
    this.open = !this.open;
  }
  resetAllFilters() {
    this.selectedEntity = "";
    this.searchText = "";
    this.getCreditList();
  }
}