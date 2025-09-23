import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { FoodItemSearchInputModel } from "../../models/canteen-food-item-search-input-model";
import { CanteenManagementService } from "../../services/canteen-management.service";
import { LoadCanteenPurchaseFoodItemsTriggered, CanteenPurchaseFoodItemActionTypes, LoadCanteenPurchaseFoodItemsCompleted, ExceptionHandled, LoadCanteenPurchaseFoodItemFailed } from "../actions/canteen-purchase-food-item.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()
export class PurchaseFoodItemEffects {
    foodItemSearchResult: FoodItemSearchInputModel;
    toastrMessage: string;
    validationMessages: any[];
    exceptionMessage: any;

    @Effect()
    loadFoodItemsList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadCanteenPurchaseFoodItemsTriggered>(CanteenPurchaseFoodItemActionTypes.LoadCanteenPurchaseFoodItemsTriggered),
        switchMap(searchAction => {
            this.foodItemSearchResult = searchAction.foodItemSearchResult;
            return this.canteenManagementService
                .searchFoodItems(searchAction.foodItemSearchResult)
                .pipe(map((foodItemsList: any) => {
                    if(foodItemsList.success == true)
                    return new LoadCanteenPurchaseFoodItemsCompleted(foodItemsList.data);
                    else
                    this.validationMessages = foodItemsList.apiResponseMessages;
                    return new LoadCanteenPurchaseFoodItemFailed(foodItemsList.apiResponseMessages);
                }),
                    
                    catchError(error => {
                        this.exceptionMessage = error;
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    showValidationMessagesForCanteenPurchaseFoodItem$: Observable<Action> = this.actions$.pipe(
        ofType<LoadCanteenPurchaseFoodItemFailed>(CanteenPurchaseFoodItemActionTypes.LoadCanteenPurchaseFoodItemFailed),
        pipe(
            map(() => {
                return new ShowValidationMessages({
                    validationMessages: this.validationMessages, // TODO: Change to proper toast message
                })
            })
        )
    );

    @Effect()
    exceptionHandledForCanteenFoodItem$: Observable<Action> = this.actions$.pipe(
        ofType<ExceptionHandled>(CanteenPurchaseFoodItemActionTypes.ExceptionHandled),
        pipe(
            map(() => new ShowExceptionMessages({
                message: this.exceptionMessage.message, // TODO: Change to proper toast message
            })
            )
        )
    );

    constructor(
        private actions$: Actions,
        private canteenManagementService: CanteenManagementService
    ) { }
}