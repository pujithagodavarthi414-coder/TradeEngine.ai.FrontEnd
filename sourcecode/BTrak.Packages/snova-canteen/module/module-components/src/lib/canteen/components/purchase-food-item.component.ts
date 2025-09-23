import { Component, ChangeDetectionStrategy, OnInit, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder, FormArray, FormGroupDirective } from '@angular/forms';
import { ofType, Actions } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, ReplaySubject } from 'rxjs';

import { FoodItemModel } from '../models/canteen-food-item-model';
import { CanteenPurchaseItemModel } from '../models/canteen-purchase-item-model';
import { FoodItemSearchInputModel } from '../models/canteen-food-item-search-input-model';

import { State } from '../store/reducers/index';
import * as hrManagementModuleReducer from '../store/reducers/index';

import { CanteenPurchaseItemActionTypes, CreateCanteenPurchaseItemTriggered } from '../store/actions/canteen-purchase-item.actions';
import { CanteenPurchaseFoodItemActionTypes, LoadCanteenPurchaseFoodItemsTriggered } from '../store/actions/canteen-purchase-food-item.actions';
import { Currency } from '../models/currency';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-hr-component-purchase-food-item',
  templateUrl: 'purchase-food-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PurchaseFoodItemComponent implements OnInit {
  @Input() currencyList: Currency[];
  @Output() closePurchaseItemPopup = new EventEmitter<string>();

  addCanteenPurchaseItemForm: FormGroup;
  formDirective: FormGroupDirective;
  addPurchaseItemElement: FormArray;
  addCanteenPurchaseItems: CanteenPurchaseItemModel[];

  public bankCtrl: FormControl = new FormControl();
  public selectedCanteenItemId: string;
  public filteredItems: ReplaySubject<FoodItemModel[]> = new ReplaySubject<FoodItemModel[]>(1);

  upsertCanteenPurchaseItemInProgress$: Observable<boolean>;
  foodItemsListRecords$: Observable<FoodItemModel[]>;
  foodItemsListRecords: FoodItemModel[];

  protected _onDestroy = new Subject<void>();

  public ngDestroyed$ = new Subject();

  constructor(private store: Store<State>, private actionUpdates$: Actions, private toastr: ToastrService, private cdRef: ChangeDetectorRef, private formBuilder: FormBuilder) {
    this.initializePurchaseItemForm();
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(CanteenPurchaseItemActionTypes.CreateCanteenPurchaseItemCompleted),
        tap(() => {
          this.formDirective.resetForm();
          this.closePurchaseItemForm();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(CanteenPurchaseFoodItemActionTypes.LoadCanteenPurchaseFoodItemsCompleted),
        tap(() => {
          this.foodItemsListRecords$.subscribe(result => {
            this.foodItemsListRecords = result;
          })
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.upsertCanteenPurchaseItemInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createCanteenPurchaseItemLoading))
    this.getFoodItemsList();
  }

  initializePurchaseItemForm() {
    this.addCanteenPurchaseItemForm = new FormGroup({
      addPurchaseItemElement: this.formBuilder.array([this.createItem()])
    });
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      canteenItemId: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      ),
      quantity: new FormControl("",
        Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.max(999999999)
        ])
      ),
      itemsFilter: new FormControl("",
        Validators.compose([])
      )
    });
  }

  addItem(): void {
    (<FormArray>this.addCanteenPurchaseItemForm.get('addPurchaseItemElement')).push(this.createItem())
  }

  removeItemAtIndex(addPurchaseItemIndex: number) {
    (<FormArray>this.addCanteenPurchaseItemForm.get('addPurchaseItemElement')).removeAt(addPurchaseItemIndex)
  }

  closePurchaseItemForm() {
    if (this.formDirective != null) {
      this.formDirective.resetForm();
    }
    this.initializePurchaseItemForm();
    this.closePurchaseItemPopup.emit();
  }

  upsertCanteenPurchaseItem(formDirective: FormGroupDirective) {
    this.formDirective = formDirective;
    this.addCanteenPurchaseItems = this.addCanteenPurchaseItemForm.value.addPurchaseItemElement;
    this.store.dispatch(new CreateCanteenPurchaseItemTriggered(this.addCanteenPurchaseItems));
    this.upsertCanteenPurchaseItemInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createCanteenPurchaseItemLoading));
  }

  getFoodItemsList() {
    const canteenFoodItemSearchResult = new FoodItemSearchInputModel();
    this.store.dispatch(new LoadCanteenPurchaseFoodItemsTriggered(canteenFoodItemSearchResult));
    this.foodItemsListRecords$ = this.store.pipe(select(hrManagementModuleReducer.getPurchaseFoodItemsAll));
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.ngDestroyed$.next();
  }

  ngAfterViewInit() {
    (document.querySelector('.max-width-style') as HTMLElement).parentElement.parentElement.parentElement.style.overflow = 'auto';
  }

  displayFn(foodItem?: FoodItemModel): string | undefined {
    if (foodItem != null && foodItem.foodItemId != null) {
      this.selectedCanteenItemId = foodItem.foodItemId;
      return foodItem ? foodItem.foodItemName : undefined;
    }
  }

  selectedFoodItem(selectedFoodItem, index) {
    let val = this.addPurchaseItemElement.at(index);
    this.selectedCanteenItemId = val.get('itemsFilter').value;
    val.get('canteenItemId').setValue(selectedFoodItem.foodItemId);
  }

  sample(value, i) {
    this.addPurchaseItemElement = this.addCanteenPurchaseItemForm.get('addPurchaseItemElement') as FormArray;
    let val = this.addPurchaseItemElement.at(i);
    if (val.get('itemsFilter').value != null) {
      if (this.foodItemsListRecords != null && this.foodItemsListRecords.length > 0) {
        this.filteredItems.next(
          this.foodItemsListRecords.filter(foodItem => foodItem.foodItemName.toLowerCase().indexOf(val.get('itemsFilter').value.toLowerCase()) > -1)
        );
      }
    }
    if (val.get('canteenItemId').value != null) {
      val.get('canteenItemId').setValue(null);
    }
  }

  checkCondition(i) {
    let items = this.addCanteenPurchaseItemForm.get('addPurchaseItemElement') as FormArray;
    if ((items && items.length - 1) == i) {
      return true;
    }
    else {
      return false;
    }
  }

  checkLength() {
    let items = this.addCanteenPurchaseItemForm.get('addPurchaseItemElement') as FormArray;
    if (items && items.length > 1) {
      return true;
    }
    else {
      return false;
    }
  }
}
