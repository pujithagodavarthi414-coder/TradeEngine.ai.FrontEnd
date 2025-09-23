import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import {
    CanteenPurchaseItemActionTypes, LoadCanteenPurchaseItemsTriggered,
    CreateCanteenPurchaseItemTriggered, CreateCanteenPurchaseItemCompleted,
    CreateCanteenPurchaseItemFailed, CanteenExceptionHandled, LoadCanteenPurchaseItemsCompleted,
    LoadMyCanteenPurchasesTriggered, LoadMyCanteenPurchasesCompleted, LoadCanteenPurchaseItemsFailed,
    LoadMyCanteenPurchasesFailed
} from "../actions/canteen-purchage.actions";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { DashboardService } from '../../services/dashboard.service';
import { CanteenPurchaseItemSearchModel } from '../../models/canteen-purchase-item-search.model';
import { CanteenBalanceSearchInputModel } from '../../models/canteen-balance-search-input.model';
import { LoadCanteenBalanceTriggered } from '../actions/canteen-balance.actions';

@Injectable()
export class CanteenPurchaseItemEffects {
    canteenPurchaseItemSearchResult: CanteenPurchaseItemSearchModel;
    myCanteenPurchaseItemSearchResult: CanteenPurchaseItemSearchModel;
    toastrMessage: string;
    validationMessages: any[];
    exceptionMessage: any;

    @Effect()
    loadCanteenPurchaseItemsList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadCanteenPurchaseItemsTriggered>(CanteenPurchaseItemActionTypes.LoadCanteenPurchaseItemsTriggered),
        switchMap(searchAction => {
            this.canteenPurchaseItemSearchResult = searchAction.canteenPurchaseItemSearchResult;
            return this.dashboardService
                .searchCanteenPurchaseItem(searchAction.canteenPurchaseItemSearchResult)
                .pipe(map((canteenPurchasedItemsList: any) => {
                    if (canteenPurchasedItemsList.success == true)
                        return new LoadCanteenPurchaseItemsCompleted(canteenPurchasedItemsList.data);
                    else
                        return new LoadCanteenPurchaseItemsFailed(canteenPurchasedItemsList.apiResponseMessages);
                }),
                    catchError(error => {
                        this.exceptionMessage = error;
                        return of(new CanteenExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    loadMyCanteenPurchasesList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMyCanteenPurchasesTriggered>(CanteenPurchaseItemActionTypes.LoadMyCanteenPurchasesTriggered),
        switchMap(searchCanteenPurchasesActionTriggred => {
            this.myCanteenPurchaseItemSearchResult = searchCanteenPurchasesActionTriggred.myCanteenPurchaseItemSearchResult;
            return this.dashboardService
                .searchMyCanteenPurchases(searchCanteenPurchasesActionTriggred.myCanteenPurchaseItemSearchResult)
                .pipe(map((myCanteenPurchasesList: any) => new LoadMyCanteenPurchasesCompleted(myCanteenPurchasesList.data)),
                    catchError(error => {
                        this.exceptionMessage = error;
                        return of(new CanteenExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    upsertCanteenPurchaseItem$: Observable<Action> = this.actions$.pipe(
        ofType<CreateCanteenPurchaseItemTriggered>(CanteenPurchaseItemActionTypes.CreateCanteenPurchaseItemTriggered),
        switchMap(purchaseItemTriggeredAction => {
            if (purchaseItemTriggeredAction.canteenPurchaseItems[0].userPurchasedCanteenFoodItemId === null || purchaseItemTriggeredAction.canteenPurchaseItems[0].userPurchasedCanteenFoodItemId === '' || purchaseItemTriggeredAction.canteenPurchaseItems[0].userPurchasedCanteenFoodItemId === undefined) {
                this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForPurchaseCanteenItem);
            } else {
                this.toastrMessage = this.translateService.instant(ConstantVariables.PurchaseItem) + purchaseItemTriggeredAction.canteenPurchaseItems[0].canteenItemName + this.translateService.instant(ConstantVariables.SuccessMessageForUpdated);
            }
            return this.dashboardService
                .upsertCanteenPurchaseItem(purchaseItemTriggeredAction.canteenPurchaseItems)
                .pipe(
                    map((purchasedItemsCreated: any) => {
                        if (purchasedItemsCreated.success === true) {
                            return new CreateCanteenPurchaseItemCompleted(purchasedItemsCreated);
                        } else {
                            this.validationMessages = purchasedItemsCreated.apiResponseMessages
                            return new CreateCanteenPurchaseItemFailed(purchasedItemsCreated.apiResponseMessages);
                        }
                    }),
                    catchError(error => {
                        this.exceptionMessage = error;
                        return of(new CanteenExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    upsertCanteenPurchaseItemSuccessfulAndLoadCanteenPurchaseItem$: Observable<Action> = this.actions$.pipe(
        ofType<CreateCanteenPurchaseItemCompleted>(CanteenPurchaseItemActionTypes.CreateCanteenPurchaseItemCompleted),
        pipe(
            map(() => {
                return new LoadCanteenPurchaseItemsTriggered(this.canteenPurchaseItemSearchResult);
            }),
        )
    );

    @Effect()
    upsertCanteenPurchaseItemSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<CreateCanteenPurchaseItemCompleted>(CanteenPurchaseItemActionTypes.CreateCanteenPurchaseItemCompleted),
        pipe(
            map(() =>
                new SnackbarOpen({
                    message: this.toastrMessage, // TODO: Change to proper toast message
                    action: "Success"
                })
            )
        )
    );

    @Effect()
    triggerCanteenCreditAfterCanteenPurchaseItemSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<CreateCanteenPurchaseItemCompleted>(CanteenPurchaseItemActionTypes.CreateCanteenPurchaseItemCompleted),
        pipe(
            map(() => {
                const creditSearchResult = new CanteenBalanceSearchInputModel();
                return new LoadCanteenBalanceTriggered(creditSearchResult);
            })
        )
    );

    @Effect()
    showValidationMessagesForCanteenPurchaseItem$: Observable<Action> = this.actions$.pipe(
        ofType<CreateCanteenPurchaseItemFailed>(CanteenPurchaseItemActionTypes.CreateCanteenPurchaseItemFailed),
        pipe(
            map(() => {
                return new ShowValidationMessages({
                    validationMessages: this.validationMessages, // TODO: Change to proper toast message
                })
            })
        )
    );

    @Effect()
    showValidationMessagesForCanteenPurchaseItemFailed$: Observable<Action> = this.actions$.pipe(
        ofType<LoadCanteenPurchaseItemsFailed>(CanteenPurchaseItemActionTypes.LoadCanteenPurchaseItemsFailed),
        pipe(
            map(() => {
                return new ShowValidationMessages({
                    validationMessages: this.validationMessages, // TODO: Change to proper toast message
                })
            })
        )
    );

    @Effect()
    showValidationMessagesForCanteenPurchaseFailed$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMyCanteenPurchasesFailed>(CanteenPurchaseItemActionTypes.LoadMyCanteenPurchasesFailed),
        pipe(
            map(() => {
                return new ShowValidationMessages({
                    validationMessages: this.validationMessages, // TODO: Change to proper toast message
                })
            })
        )
    );

    @Effect()
    exceptionHandled$: Observable<Action> = this.actions$.pipe(
        ofType<CanteenExceptionHandled>(CanteenPurchaseItemActionTypes.CanteenExceptionHandled),
        pipe(
            map(() => new ShowExceptionMessages({
                message: this.exceptionMessage.message, // TODO: Change to proper toast message
            })
            )
        )
    );

    constructor(
        private actions$: Actions,
        private dashboardService: DashboardService,
        private translateService: TranslateService
    ) { }
}