import { Component, Input, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FoodOrderManagementApiInput, FoodOrderModel } from '../models/all-food-orders';
import { LoadRecentIndividualFoodOrdersTriggered, RecentIndividualFoodOrdersActionTypes } from '../store/actions/recent-individual-food-orders.actions';
import { State } from '../store/reducers/index';
import * as hrManagementModuleReducer from '../store/reducers/index';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { EntityDropDownModel } from '../models/entity-dropdown.module';
import { Page } from '../models/Page';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { FoodOrderService } from '../services/food-order.service';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-hr-component-recent-individual-food-orders',
  templateUrl: `recent-individual-food-orders.component.html`,
})
export class RecentFoodOrdersComponent extends CustomAppBaseComponent implements OnInit {

  @Input('canAccessPermission')
  set _canAccessPermission(data: boolean) {
    if (data) {
    }
  }

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  public opened: any = false;

  recentIndividualFoodOrderRecords: any;
  searchText: string = '';
  sortBy: string;
  skip: number = 0;
  pageSize: number = 30;
  sortDirection: boolean;
  page = new Page();
  pageable: boolean = false;
  isScrollable: boolean = false;
  roleFeaturesIsInProgress$: Observable<boolean>;
  recentIndividualFoodOrdersList$: Observable<FoodOrderModel[]>;
  recentIndividualFoodOrdersGridSpinner$: Observable<boolean>;
  validationMessage: string;
  selectedEntity: string;
  entities: EntityDropDownModel[];
  hide: boolean = true;

  public close(status) {
    console.log(`Dialog result: ${status}`);
    this.opened = false;
  }

  public open() {
    this.opened = true;
  }

  constructor(private store: Store<State>, private actionUpdates$: Actions, private toaster: ToastrService,private foodOrderService: FoodOrderService) {
    super();
    this.actionUpdates$
      .pipe(
        ofType(RecentIndividualFoodOrdersActionTypes.LoadRecentIndividualFoodOrdersCompleted),
        tap(() => {
          this.recentIndividualFoodOrdersList$ = this.store.pipe(select(hrManagementModuleReducer.getRecentIndividualFoodOrderAll));
          this.recentIndividualFoodOrdersList$.subscribe((result) => {
            this.page.totalElements = result.length > 0 ? result[0].totalCount : 0;
            this.page.totalPages = this.page.totalElements / this.page.size;
            this.isScrollable = true;
          })
        })
      )
      .subscribe();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getEntityDropDown();
    //this.canAccess_feature_RecentIndividualFoodOrders$.subscribe(result => {
    if (this.canAccess_feature_RecentIndividualFoodOrders) {
      this.page.size = 20;
      this.page.pageNumber = 0;
      this.getRecentIndividualFoodOrders();
    }
    //});
  }

  closeSearch() {
    this.searchText = '';
    this.getRecentIndividualFoodOrders();
  }

  searchFoodOrders() {
    if (this.searchText && this.searchText.trim().length <= 0) { return; }
    this.getRecentIndividualFoodOrders();
  }

  public dataStateChange(state: any): void {
    this.sortBy = state.sort[0].field;
    if (state.sort[0].dir === 'asc') {
      this.sortDirection = true;
    } else {
      this.sortDirection = false;
    }
    this.skip = state.skip;
    this.pageSize = state.take;
    this.getRecentIndividualFoodOrders();
  }

  getRecentIndividualFoodOrders() {
    const recentFoodOrderSearchResult = new FoodOrderManagementApiInput();
    recentFoodOrderSearchResult.searchText = this.searchText;
    recentFoodOrderSearchResult.sortBy = this.sortBy;
    recentFoodOrderSearchResult.sortDirectionAsc = this.sortDirection;
    recentFoodOrderSearchResult.pageNumber = this.page.pageNumber + 1;
    recentFoodOrderSearchResult.pageSize = this.page.size;
    recentFoodOrderSearchResult.isRecent = true;
    recentFoodOrderSearchResult.entityId = this.selectedEntity;
    this.store.dispatch(new LoadRecentIndividualFoodOrdersTriggered(recentFoodOrderSearchResult));
    this.recentIndividualFoodOrdersGridSpinner$ = this.store.pipe(select(hrManagementModuleReducer.getRecentIndividualFoodOrderLoading));
  }

  onSort(event) {
    const sort = event.sorts[0];
    this.sortBy = sort.prop;
    console.log(sort);
    if (sort.dir === 'asc') {
      this.sortDirection = true;
    } else {
      this.sortDirection = false;
    }
    this.getRecentIndividualFoodOrders();
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getRecentIndividualFoodOrders();
  }

  getEntityDropDown() {
    let searchText = "";
    this.foodOrderService.getEntityDropDown(searchText).subscribe((responseData: any) => {
      if (responseData.success === false) {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
      else {
        this.entities = responseData.data;
      }
    });
  }

  entityValues(name) {
    this.selectedEntity = name;
    this.getRecentIndividualFoodOrders();
  }

  filterClick() {
    this.opened = !this.opened;
  }

  resetAllFilters() {
    this.selectedEntity = "";
    this.searchText = '';
    this.getRecentIndividualFoodOrders();
  }
}
