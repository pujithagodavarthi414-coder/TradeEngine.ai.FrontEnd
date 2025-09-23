import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";


import { FoodItemSearchInputModel } from "../../models/canteen-food-item-search-input-model";

import { CanteenManagementService } from "../../services/canteen-management.service";

import { CanteenFoodItemActionTypes, LoadCanteenFoodItemsTriggered, LoadCanteenFoodItemsCompleted, CreateCanteenFoodItemTriggered, CreateCanteenFoodItemCompleted, CreateCanteenFoodItemFailed, ExceptionHandled, LoadCanteenFoodItemsFailed } from "../actions/canteen-food-item.actions";
import { LoadCanteenPurchaseFoodItemsTriggered } from "../actions/canteen-purchase-food-item.actions";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()
export class FoodItemEffects {
  foodItemSearchResult: FoodItemSearchInputModel;
  toastrMessage: string;
  validationMessages: any[];
  exceptionMessage: any;

  @Effect()
  loadFoodItemsList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadCanteenFoodItemsTriggered>(CanteenFoodItemActionTypes.LoadCanteenFoodItemsTriggered),
    switchMap(searchAction => {
      this.foodItemSearchResult = searchAction.foodItemSearchResult;
      return this.canteenManagementService
        .searchFoodItems(searchAction.foodItemSearchResult)
        .pipe(map((foodItemsList: any) => 
        {
          if (foodItemsList.success === true) {
            return new LoadCanteenFoodItemsCompleted(foodItemsList.data);
          } else {
            return new LoadCanteenFoodItemsFailed(foodItemsList.apiResponseMessages);
          }
        }),
          catchError(error => {
            this.exceptionMessage = error;
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertFoodItem$: Observable<Action> = this.actions$.pipe(
    ofType<CreateCanteenFoodItemTriggered>(CanteenFoodItemActionTypes.CreateCanteenFoodItemTriggered),
    switchMap(foodItemTriggeredAction => {
      if (foodItemTriggeredAction.foodItem.foodItemId === null || foodItemTriggeredAction.foodItem.foodItemId === '' || foodItemTriggeredAction.foodItem.foodItemId === undefined) {
        this.toastrMessage =this.translateService.instant(ConstantVariables.CanteenFoodItem) + " " + foodItemTriggeredAction.foodItem.foodItemName + " " + this.translateService.instant(ConstantVariables.SuccessMessageForCreated);
      }
      else if (
        foodItemTriggeredAction.foodItem.foodItemId !== undefined &&
        foodItemTriggeredAction.foodItem.isArchived === true
      ) {
        this.toastrMessage = this.translateService.instant(ConstantVariables.CanteenFoodItem) + " " + foodItemTriggeredAction.foodItem.foodItemName + " " + this.translateService.instant(ConstantVariables.SuccessMessageForArchived);
      } else {
        this.toastrMessage = this.translateService.instant(ConstantVariables.CanteenFoodItem) + " " + foodItemTriggeredAction.foodItem.foodItemName + " " + this.translateService.instant(ConstantVariables.SuccessMessageForUpdated);
      }
      return this.canteenManagementService
        .upsertCanteenFoodItem(foodItemTriggeredAction.foodItem)
        .pipe(
          map((foodItemId: any) => {
            if (foodItemId.success === true) {
              return new CreateCanteenFoodItemCompleted(foodItemId);
            } else {
              this.validationMessages = foodItemId.apiResponseMessages
              return new CreateCanteenFoodItemFailed(foodItemId.apiResponseMessages);
            }
          }),
          catchError(error => {
            this.exceptionMessage = error;
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertFoodItemSuccessfulAndLoadFoodItems$: Observable<Action> = this.actions$.pipe(
    ofType<CreateCanteenFoodItemCompleted>(CanteenFoodItemActionTypes.CreateCanteenFoodItemCompleted),
    pipe(
      map(() => {
        return new LoadCanteenFoodItemsTriggered(this.foodItemSearchResult);
      }),

    )
  );

  @Effect()
  upsertFoodItemSuccessfulAndLoadPurchaseFoodItems$: Observable<Action> = this.actions$.pipe(
    ofType<CreateCanteenFoodItemCompleted>(CanteenFoodItemActionTypes.CreateCanteenFoodItemCompleted),
    pipe(
      map(() => {
        return new LoadCanteenPurchaseFoodItemsTriggered(this.foodItemSearchResult);
      }),

    )
  );

  @Effect()
  upsertFoodItemSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<CreateCanteenFoodItemCompleted>(CanteenFoodItemActionTypes.CreateCanteenFoodItemCompleted),
    pipe(
      map(
        () =>
          new SnackbarOpen({
            message: this.toastrMessage, // TODO: Change to proper toast message
            action: "Success"
          })
      )
    )
  );

  @Effect()
  showValidationMessagesForCanteenFoodItem$: Observable<Action> = this.actions$.pipe(
    ofType<CreateCanteenFoodItemFailed>(CanteenFoodItemActionTypes.CreateCanteenFoodItemFailed),
    pipe(
      map(() => {
        return new ShowValidationMessages({
          validationMessages: this.validationMessages, // TODO: Change to proper toast message
        })
      })
    )
  );

  @Effect()
  showValidationMessagesForFoodItemsList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadCanteenFoodItemsFailed>(CanteenFoodItemActionTypes.LoadCanteenFoodItemsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandledForCanteenFoodItem$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(CanteenFoodItemActionTypes.ExceptionHandled),
    pipe(
      map(() => new ShowExceptionMessages({
        message: this.exceptionMessage.message, // TODO: Change to proper toast message
      })
      )
    )
  );

  constructor(
    private actions$: Actions,
    private canteenManagementService: CanteenManagementService,
    private translateService: TranslateService
  ) { }
}