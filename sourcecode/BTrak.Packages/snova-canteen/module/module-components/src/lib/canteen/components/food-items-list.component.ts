import { Component, ChangeDetectionStrategy, OnInit, ViewChildren, Input } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { FoodItemModel } from '../models/canteen-food-item-model';
import { FoodItemSearchInputModel } from '../models/canteen-food-item-search-input-model';

import { LoadCanteenFoodItemsTriggered, CanteenFoodItemActionTypes, } from '../store/actions/canteen-food-item.actions';

import { State } from '../store/reducers/index';
import * as hrManagementModuleReducer from '../store/reducers/index'
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { Employee } from 'ng2-org-chart/src/employee';
import { Page } from '../models/Page';
import { EntityDropDownModel } from '../models/entity-dropdown.module';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { CanteenManagementService } from '../services/canteen-management.service';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-hr-component-food-items-list',
  templateUrl: `food-items-list.component.html`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodItemsListComponent extends CustomAppBaseComponent implements OnInit {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  @ViewChildren('upsertFoodItemPopUp') newFoodItemPopover;
  @ViewChildren("addFoodItemPopover") addFoodItemPopover;

  @Input('buttonView')
  set buttonView(data: boolean) {
      this.buttonEnable = data;
  }

  buttonEnable: boolean;
  sortBy: string;
  searchText: string;
  sortDirection: boolean;
  isScrollable: boolean = false;
  isEditFoodItem: boolean = false;
  page = new Page();
  CanteenFoodItemDetails: FoodItemModel;
  isAddFoodItem: boolean = false;
  validationMessage: string;
  selectedEntity: string ;
  entities:EntityDropDownModel[];
  foodItemsListRecords$: Observable<FoodItemModel[]>
  foodItemListGridSpinner$: Observable<boolean>;

  public ngDestroyed$ = new Subject();

  constructor(private store: Store<State>, private actionUpdates$: Actions, private toastr: ToastrService,private canteenService: CanteenManagementService,
    private toaster: ToastrService) {
    super();
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(CanteenFoodItemActionTypes.LoadCanteenFoodItemsCompleted),
        tap(() => {
          this.foodItemsListRecords$ = this.store.pipe(select(hrManagementModuleReducer.getCanteenFoodItemsAll));
          this.foodItemsListRecords$.subscribe((result) => {
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
    //this.canAccess_feature_FoodItemsList$.subscribe(result => {
      if(this.canAccess_feature_FoodItemsList){
        this.page.size = 10;
        this.page.pageNumber = 0;
        this.getCanteenFoodItemsList();
      }
    //});
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getCanteenFoodItemsList();
  }

  onSort(event) {
    const sort = event.sorts[0];
    this.sortBy = sort.prop;
    if (sort.dir === 'asc')
      this.sortDirection = true;
    else
      this.sortDirection = false;
    this.page.size = 10;
    this.page.pageNumber = 0;
    this.getCanteenFoodItemsList();
  }

  searchFoodItemList() {
    if (this.searchText && this.searchText.length <= 0) return;
    this.page.pageNumber = 0;
    this.getCanteenFoodItemsList();
  }

  closeSearch() {
    this.searchText = '';
    this.getCanteenFoodItemsList();
  }

  getCanteenFoodItemsList() {
    const canteenFoodItemSearchResult = new FoodItemSearchInputModel();
    canteenFoodItemSearchResult.sortBy = this.sortBy;
    canteenFoodItemSearchResult.sortDirectionAsc = this.sortDirection;
    canteenFoodItemSearchResult.pageNumber = this.page.pageNumber + 1;
    canteenFoodItemSearchResult.pageSize = this.page.size;
    canteenFoodItemSearchResult.searchText = this.searchText;
    canteenFoodItemSearchResult.entityId = this.selectedEntity;
    this.store.dispatch(new LoadCanteenFoodItemsTriggered(canteenFoodItemSearchResult));
    this.foodItemListGridSpinner$ = this.store.pipe(select(hrManagementModuleReducer.getCanteenFoodItemLoading));
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.ngDestroyed$.next();
  }

  upsertFoodItemPopUpOpen(row, upsertFoodItemPopUp) {
    upsertFoodItemPopUp.openPopover();
    this.CanteenFoodItemDetails = row;
  }

  closeAddFoodItemPopover() {
    this.newFoodItemPopover.forEach((p) => p.closePopover());
    this.isEditFoodItem = false;
  }

  openEditFoodItem()
  {
    this.isEditFoodItem = true;
  }

  addFoodItemPopupOpen(addFoodItemPopover){
    this.isAddFoodItem = true;
    addFoodItemPopover.openPopover();
  }

  closeAddFoodPopover() {
    this.addFoodItemPopover.forEach((p) => p.closePopover());
    this.isAddFoodItem = false;
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
    this.getCanteenFoodItemsList();
  }
  resetAllFilters(){
    this.selectedEntity ="";
    this.searchText = "";
    this.getCanteenFoodItemsList();
  }
}