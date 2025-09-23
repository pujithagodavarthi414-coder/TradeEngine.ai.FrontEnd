import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { tap } from 'rxjs/operators';

import { FoodOrderModel, FoodOrderManagementApiInput } from '../models/all-food-orders';

import { State } from "../store/reducers/index";
import * as hrManagementModuleReducer from "../store/reducers/index";

import { LoadFoodOrderStatusTriggered, FoodOrderStatusActionTypes } from '../store/actions/food-order-status.actions';
import { ToastrService } from 'ngx-toastr';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { SoftLabelConfigurationModel } from '../models/softLabels-model';
import { EntityDropDownModel } from '../models/entity-dropdown.module';
import { Page } from '../models/Page';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { FoodOrderService } from '../services/food-order.service';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-hr-component-all-food-orders-status',
  templateUrl: `all-food-orders-status.component.html`,
  styles: [`.food-order-header .datatable-header { 
    height: 38px !important;
  }`]
})

export class FoodOrdersStatusComponent extends CustomAppBaseComponent implements OnInit {

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
  allFoodOrdersStatusRecords: any;
  sortBy: string;
  searchText: string;
  skip: number = 0;
  pageSize: number = 30;
  sortDirection: boolean;
  pageable: boolean = false;
  isScrollable: boolean = false;
  softLabels: SoftLabelConfigurationModel[];
  foodOrderDetails: FoodOrderModel;
  page = new Page();
  entities: EntityDropDownModel[];
  selectedEntity: string;
  validationMessage: string;
  foodOrderList$: Observable<FoodOrderModel[]>;
  foodOrderListGridSpinner$: Observable<boolean>;
  softLabels$: Observable<SoftLabelConfigurationModel[]>;

  constructor(private actionUpdates$: Actions, private store: Store<State>,
    private toaster: ToastrService, private foodOrderService: FoodOrderService) {
    super();
    this.actionUpdates$
      .pipe(
        ofType(FoodOrderStatusActionTypes.LoadFoodOrderStatusCompleted),
        tap(() => {
          this.foodOrderList$ = this.store.pipe(select(hrManagementModuleReducer.getFoodOrderStatusAll));
          this.foodOrderList$.subscribe((result) => {
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
    this.getSoftLabels();
    this.getEntityDropDown();
    // this.canAccess_feature_AllFoodOrders$.subscribe(result => {
    if (this.canAccess_feature_AllFoodOrders) {
      this.page.size = 50;
      this.page.pageNumber = 0;
      this.getAllFoodOrders();
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

  public dataStateChange(state: any): void {
    this.sortBy = state.sort[0].field;
    if (state.sort[0].dir === 'asc')
      this.sortDirection = true;
    else
      this.sortDirection = false;
    this.skip = state.skip;
    this.pageSize = state.take;
    this.getAllFoodOrders();
  }

  closeSearch() {
    this.searchText = '';
    this.getAllFoodOrders();
  }

  SearchFoodOrderList() {
    if (this.searchText && this.searchText.trim().length <= 0) return;
    this.page.pageNumber = 0;
    this.getAllFoodOrders();
  }

  getAllFoodOrders() {
    const foodOrderSearchResult = new FoodOrderManagementApiInput();
    foodOrderSearchResult.sortBy = this.sortBy;
    foodOrderSearchResult.sortDirectionAsc = this.sortDirection;
    foodOrderSearchResult.pageNumber = this.page.pageNumber + 1;
    foodOrderSearchResult.pageSize = this.page.size;
    foodOrderSearchResult.searchText = this.searchText;
    foodOrderSearchResult.isRecent = false;
    foodOrderSearchResult.entityId = this.selectedEntity;
    this.store.dispatch(new LoadFoodOrderStatusTriggered(foodOrderSearchResult));
    this.foodOrderListGridSpinner$ = this.store.pipe(select(hrManagementModuleReducer.getFoodOrderStatusLoading));
  }

  onSort(event) {
    const sort = event.sorts[0];
    this.sortBy = sort.prop;
    console.log(sort);
    if (sort.dir === 'asc')
      this.sortDirection = true;
    else
      this.sortDirection = false;
    this.getAllFoodOrders();
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getAllFoodOrders();
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
    this.getAllFoodOrders();
  }
  resetAllFilters() {
    this.selectedEntity = "";
    this.searchText = "";
    this.getAllFoodOrders();
  }
}