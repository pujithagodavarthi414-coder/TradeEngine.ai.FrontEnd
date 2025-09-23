import { Component, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ofType, Actions } from '@ngrx/effects';
import { Observable, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { SatPopover } from '@ncstate/sat-popover';
import { ToastrService } from 'ngx-toastr';

import { CanteenBalanceModel } from '../models/canteen-balance-model';

import { CanteenManagementService } from '../services/canteen-management.service';

import { State } from '../store/reducers/index';
import * as canteenModuleReducer from '../store/reducers/index'

import { CanteenCreditActionTypes } from '../store/actions/canteen-credit.actions';
import { CanteenPurchaseItemActionTypes } from '../store/actions/canteen-purchase-item.actions';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { CurrencyActionTypes, LoadCurrencyTriggered } from '../../canteen/store/actions/currency.actions';
import { Currency } from '../models/currency';

@Component({
  selector: 'app-hr-page-canteen-management',
  templateUrl: `./canteen-management.page.template.html`
})

export class CanteenManagementPageComponent extends CustomAppBaseComponent {
  @ViewChild('addCanteenCreditPopover') newCanteenCreditPopover: SatPopover;
  @ViewChild('addNewPurchaseItemPopover') newPurchaseItemPopover: SatPopover;
  @ViewChild('addNewFoodItemPopover') newFoodItemPopover: SatPopover;

  currencyList$: Observable<Currency[]>;

  currencyList: Currency[];
  canteenBalanceModel: CanteenBalanceModel;

  balanceAmount: string;
  openCanteenPopover: boolean;
  isPurchaseFoodItem: boolean = false;
  isAddCanteenCredit: boolean = false;
  userSearchText: string = '';
  buttonView : boolean = false;

  public ngDestroyed$ = new Subject();

  constructor(private store: Store<State>, private actionUpdates$: Actions, private canteenManagementService: CanteenManagementService, private toastr: ToastrService) {
    super();
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(CurrencyActionTypes.LoadCurrencyCompleted),
        tap(() => {
          this.currencyList$ = this.store.pipe(select(canteenModuleReducer.getCurrencyAll));
          this.currencyList$.subscribe((result) => {
            this.currencyList = result;
          })
        })
      )
      .subscribe();


    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(CanteenPurchaseItemActionTypes.CreateCanteenPurchaseItemCompleted),
        tap(() => {
          this.getMyCanteenBalance();
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(CanteenCreditActionTypes.CreateCanteenCreditCompleted),
        tap(() => {
          this.getMyCanteenBalance();
        })
      )
      .subscribe();

  }

  ngOnInit() {
    super.ngOnInit();
    this.getMyCanteenBalance();
  }

  GetCurrencyList() {
    this.store.dispatch(new LoadCurrencyTriggered());
  }

  closeCanteenCreditPopover() {
    this.newCanteenCreditPopover.close();
    this.isAddCanteenCredit = false;
  }

  closeAddFoodItemPopover() {
    this.newFoodItemPopover.close();
    this.openCanteenPopover = false;
  }

  closePurchaseFoodItem() {
    this.newPurchaseItemPopover.close();
    this.isPurchaseFoodItem = false;
  }

  getMyCanteenBalance() {
    this.canteenManagementService.getMyCanteenBalance().subscribe((response: any) => {
      if (response.success == true) {
        this.canteenBalanceModel = response.data[0];
        if (this.canteenBalanceModel == null || this.canteenBalanceModel == undefined) {
          this.balanceAmount = "0.00"
        }
        else {
          this.balanceAmount = `${this.canteenBalanceModel.totalBalanceAmount}`;
        }
      }
      else {
        this.balanceAmount = "0.00"
        this.toastr.error("Error", response.apiResponseMessages[0].message);
      }
    });
  }

  addNewFoodItem() {
    this.openCanteenPopover = true;
  }

  purchaseFoodItem() {
    this.isPurchaseFoodItem = true;
  }

  addCanteenCredit() {
    this.isAddCanteenCredit = true;
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.ngDestroyed$.next();
  }
}