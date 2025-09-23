import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';

import { FoodItemModel } from '../models/canteen-food-item-model';

import * as hrManagementModuleReducer  from '../store/reducers/index';
import { State } from '../store/reducers/index';

import { CanteenFoodItemActionTypes, CreateCanteenFoodItemTriggered } from '../store/actions/canteen-food-item.actions';
import { Currency } from '../models/currency';
import { Branch } from '../models/branch';
import { CurrencyActionTypes, LoadCurrencyTriggered } from '../store/actions/currency.actions';
import { LoadBranchTriggered } from '../store/actions/branch.actions';
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-hr-component-add-canteen-food-item',
  templateUrl: 'add-canteen-food-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddCanteenFoodItemComponent implements OnInit {
  @Output() closeAddFoodItemPopover = new EventEmitter<string>();

  @Input('CanteenFoodItemDetails')
  set setFoodItemDetails(foodItemDetails: FoodItemModel) {
    if (!foodItemDetails) {
      this.foodItemDetails = null;
      this.initializeAddFoodItemForm();
    }
    else {
      this.foodItemDetails = foodItemDetails;
      this.editFoodItem = true;
      this.foodItemId = foodItemDetails.foodItemId;
      this.timeStamp = foodItemDetails.timeStamp;
      this.addFoodItemForm.patchValue(foodItemDetails);
    }
  }

  addFoodItemForm: FormGroup;
  formDirective: FormGroupDirective;
  addFoodItem: FoodItemModel;
  foodItemDetails: FoodItemModel;
  editFoodItem: boolean;
  foodItemId: string;
  timeStamp: any;

  upsertFoodItemInProgress$: Observable<boolean>;
  currencyList$: Observable<Currency[]>;
  branchList$: Observable<Branch[]>;
  currencyList: Currency[];

  public ngDestroyed$ = new Subject();
  validationMessage: string;
  isThereAnError: boolean;

  constructor(private actionUpdates$: Actions, private toastr: ToastrService, private cdRef: ChangeDetectorRef, private store: Store<State>) {
    this.initializeAddFoodItemForm();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(CurrencyActionTypes.LoadCurrencyCompleted),
        tap(() => {
          this.currencyList$ = this.store.pipe(select(hrManagementModuleReducer.getCurrencyAll));
          this.currencyList$.subscribe((result) => {
            this.currencyList = result;
          })
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(CanteenFoodItemActionTypes.CreateCanteenFoodItemCompleted),
        tap(() => {
          this.formDirective.resetForm();
          this.closeAddFoodItemForm();
        })
      )
      .subscribe();

      this.actionUpdates$
      .pipe(
        ofType(CurrencyActionTypes.LoadCurrencyCompleted),
        tap(() => {
          this.currencyList$ = this.store.pipe(select(hrManagementModuleReducer.getCurrencyAll), tap(result => {
            this.currencyList = result
          }));
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.GetCurrencyList();
    this.getBranchesList();
    this.upsertFoodItemInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createCanteenFoodItemLoading))
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode > 57 )) {
        this.validationMessage = "Only numbers are allowed in bug order";
        this.isThereAnError = true;
        return false;
    }
    this.isThereAnError = false;
    return true;
}

  GetCurrencyList() {
    this.store.dispatch(new LoadCurrencyTriggered());
  }

  getBranchesList() {
    const branchSearchResult = new Branch();
    branchSearchResult.isArchived = false;
    this.store.dispatch(new LoadBranchTriggered(branchSearchResult));
    this.branchList$ = this.store.pipe(select(hrManagementModuleReducer.getBranchAll));
  }

  initializeAddFoodItemForm() {
    this.foodItemId = null;
    this.timeStamp = null;
    this.addFoodItemForm = new FormGroup({
      foodItemName: new FormControl("",
        Validators.compose([
          Validators.required,
          Validators.maxLength(250)
        ])
      ),
      price: new FormControl("",
        Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.max(100000),
          Validators.pattern("[0-9]*(\.)?[0-9]+$")
        ])
      ),
      branchId: new FormControl('',
        Validators.compose([
          Validators.required
        ])
      )
    });
  }

  closeAddFoodItemForm() {
    if (this.formDirective != null) {
      this.formDirective.resetForm();
    }
    if (this.foodItemDetails) {
      this.addFoodItemForm.patchValue(this.foodItemDetails);
    }
    else {
      this.initializeAddFoodItemForm();
    }
    this.closeAddFoodItemPopover.emit();
  }

  UpsertFoodItem(formDirective: FormGroupDirective) {
    let indinaCurrencyId = null;

    if (this.currencyList && this.currencyList.length > 0) {
      indinaCurrencyId = this.currencyList.find(x => x.currencyName.toLowerCase() == "indian rupee").currencyId;

      if (!indinaCurrencyId) {
        indinaCurrencyId = this.currencyList[0].currencyId;
      }
    }

    this.formDirective = formDirective;
    this.addFoodItem = this.addFoodItemForm.value;
    if (this.editFoodItem) {
      this.addFoodItem.foodItemId = this.foodItemId;
      this.addFoodItem.timeStamp = this.timeStamp;
    }
    this.addFoodItem.currencyId = indinaCurrencyId;
    this.store.dispatch(new CreateCanteenFoodItemTriggered(this.addFoodItem));
    this.upsertFoodItemInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createCanteenFoodItemLoading))
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.ngDestroyed$.next();
  }
}