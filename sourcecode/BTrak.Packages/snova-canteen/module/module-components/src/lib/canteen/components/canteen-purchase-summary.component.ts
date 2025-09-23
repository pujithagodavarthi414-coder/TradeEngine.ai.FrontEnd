import { Component, ChangeDetectionStrategy, Input, ViewChildren } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { ofType, Actions } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';

import { CanteenPurchaseItemModel } from '../models/canteen-purchase-item-model';
import { CanteenPurchaseItemSearchModel } from '../models/canteen-purchase-item-search-model';

import { State } from '../store/reducers/index';
import * as hrManagementModuleReducer from '../store/reducers/index';

import { CanteenPurchaseItemActionTypes, LoadCanteenPurchaseItemsTriggered } from '../store/actions/canteen-purchase-item.actions';

import { CanteenCreditActionTypes } from '../store/actions/canteen-credit.actions';
import { Router } from '@angular/router';
import { Page } from '../models/Page';
import { Branch } from '../models/branch';
import { LoadBranchTriggered } from '../store/actions/branch.actions';
import { EntityDropDownModel } from '../models/entity-dropdown.module';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { CanteenManagementService } from '../services/canteen-management.service';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-hr-component-canteen-purchase-summary',
  templateUrl: `canteen-purchase-summary.component.html`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    @media only screen and (max-width: 365px) {
      .search-canteen {
        width: 30% !important;
      }
    }
    @media only screen and (max-width: 365px) {
      .purchase-icon {
        right: 195px !important;
    top: 12px !important;
      }
    }
  `]
})
export class CanteenPurchaseSummaryComponent extends CustomAppBaseComponent {

  @ViewChildren("purchaseFoodItemPopover") purchaseFoodItemPopover;

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
  searchByEmployee: boolean = false;
  searchByBranch: boolean = false;
  isScrollable: boolean = false;
  page = new Page();
  userId: string = "";
  branchId: string = "";
  isPurchaseFoodItem: boolean = false;
  purchaseData: any;
  balanceAmount: any;
  validationMessage: string;  
  selectedEntity: string ;
  entities:EntityDropDownModel[];
  open=true;
  canteenPurchaseSummaryRecords$: Observable<CanteenPurchaseItemModel[]>;
  canteenPurchaseSummaryGridSpinner$: Observable<boolean>;
  branchList$: Observable<Branch[]>;

  public ngDestroyed$ = new Subject();

  constructor(private store: Store<State>, private actionUpdates$: Actions, private router: Router, 
    private canteenService: CanteenManagementService,private toaster: ToastrService) {
    super();
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(CanteenPurchaseItemActionTypes.LoadCanteenPurchaseItemsCompleted),
        tap(() => {
          this.canteenPurchaseSummaryRecords$ = this.store.pipe(select(hrManagementModuleReducer.getCanteenPurchaseItemsAll));
          this.canteenPurchaseSummaryRecords$.subscribe((result) => {
            if (result != null && result.length > 0) {
              if (result[0].userPurchasedCanteenFoodItemId == null) {
                this.purchaseData = [];
                this.balanceAmount = result[0].balance;
              }
              else {
                this.purchaseData = result;
                this.balanceAmount = result[0].balance;
                this.page.totalElements = result.length > 0 ? result[0].totalCount : 0;
                this.page.totalPages = this.page.totalElements / this.page.size;
                this.isScrollable = true;
              }
            }
            else {
              this.purchaseData = [];
              this.balanceAmount = result.length>0 ? result[0].balance:null;
            }
          })
        })
      )
      .subscribe();
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(CanteenCreditActionTypes.CreateCanteenCreditCompleted),
        tap(() => {
          if (this.buttonEnable == true)
            this.getCanteenPurchaseSummaryList();
        })
      )
      .subscribe();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getEntityDropDown();
    // this.canAccess_feature_CanteenPurchasesSummary$.subscribe(result => {
    //   this.canAccess_feature_CanteenPurchasesSummary = result;
    // });
    if (this.canAccess_feature_CanteenPurchasesSummary) {
      this.page.size = 10;
      this.page.pageNumber = 0;
      this.getCanteenPurchaseSummaryList();
      this.getAllBranches();
    }
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getCanteenPurchaseSummaryList();
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
    this.getCanteenPurchaseSummaryList();
  }

  searchCanteenPurchaseList() {
    if (this.searchText && this.searchText.length <= 0) return;
    this.page.pageNumber = 0;
    this.getCanteenPurchaseSummaryList();
  }

  closeSearch() {
    this.searchText = '';
    this.getCanteenPurchaseSummaryList();
  }

  getAllBranches() {
    const branchSearchResult = new Branch();
    this.store.dispatch(new LoadBranchTriggered(branchSearchResult));
    this.branchList$ = this.store.pipe(select(hrManagementModuleReducer.getBranchAll));
  }

  branchSelected(BranchId) {
    if (BranchId == "all") {
      this.branchId = "";
      this.searchByBranch = false;
    } else {
      this.branchId = BranchId;
      this.searchByBranch = true;
    }
    this.getCanteenPurchaseSummaryList();
  }

  getCanteenPurchaseSummaryList() {
    const canteenPurchaseSummarySearchResult = new CanteenPurchaseItemSearchModel();
    canteenPurchaseSummarySearchResult.sortBy = this.sortBy;
    canteenPurchaseSummarySearchResult.sortDirectionAsc = this.sortDirection;
    canteenPurchaseSummarySearchResult.pageNumber = this.page.pageNumber + 1;
    canteenPurchaseSummarySearchResult.pageSize = this.page.size;
    canteenPurchaseSummarySearchResult.searchText = this.searchText;
    canteenPurchaseSummarySearchResult.entityid = this.selectedEntity; 
    this.store.dispatch(new LoadCanteenPurchaseItemsTriggered(canteenPurchaseSummarySearchResult));
    this.canteenPurchaseSummaryGridSpinner$ = this.store.pipe(select(hrManagementModuleReducer.getCanteenPurchaseItemLoading));
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.ngDestroyed$.next();
  }

  purchaseFoodItemPopupOpen(purchaseFoodItemPopover) {
    this.isPurchaseFoodItem = true;
    purchaseFoodItemPopover.openPopover();
  }

  closePurchaseFoodItem() {
    this.purchaseFoodItemPopover.forEach((p) => p.closePopover());
    this.isPurchaseFoodItem = false;
  }

  goToProfile(url) {
    this.router.navigateByUrl('dashboard/profile/' + url);
  }

  getEntityDropDown() {
    let searchText = "";
    this.canteenService.getEntityDropDown(searchText).subscribe((responseData: any) => {
      if (responseData.success === false) {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
      else {
        this.entities = responseData.data;       
      }     
    });
  }
  
  entityValues(name){
    this.selectedEntity=name;
    this.getCanteenPurchaseSummaryList();
  }

  filterClick(){
    this.open=!this.open;
  }
  resetAllFilters(){
    this.selectedEntity = "";
    this.searchText = "";
    this.getCanteenPurchaseSummaryList();
  }
}