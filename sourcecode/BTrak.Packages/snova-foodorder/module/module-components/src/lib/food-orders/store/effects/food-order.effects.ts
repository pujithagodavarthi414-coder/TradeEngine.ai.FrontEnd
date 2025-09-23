import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";


import { FoodOrderManagementApiInput } from "../../models/all-food-orders";

import { FoodOrderService } from "../../services/food-order.service";

import { FoodOrderActionTypes, LoadFoodOrdersTriggered, LoadFoodOrdersCompleted, CreateFoodOrderTriggered, CreateFoodOrderCompleted, CreateFoodOrderFailed, ExceptionHandled, ChangeFoodOrderStatusTriggred, ChangeFoodOrderStatusCompleted, ChangeFoodOrderStatusFailed } from "../actions/food-order.actions";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { GetReferenceIdOfFile } from '@snovasys/snova-file-uploader';

@Injectable()
export class FoodOrderEffects {
  foodOrderSearchResult: FoodOrderManagementApiInput;
  toastrMessage: string;
  validationMessages: any[];
  exceptionMessage: any;

  @Effect()
  loadFoodOrderList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadFoodOrdersTriggered>(FoodOrderActionTypes.LoadFoodOrdersTriggered),
    switchMap(searchAction => {
      this.foodOrderSearchResult = searchAction.foodOrderSearchResult;
      return this.foodOrderService
        .searchFoodOrder(searchAction.foodOrderSearchResult)
        .pipe(map((foodOrderList: any) => new LoadFoodOrdersCompleted(foodOrderList.data)),
          catchError(error => {
            this.exceptionMessage = error;
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertFoodOrder$: Observable<Action> = this.actions$.pipe(
    ofType<CreateFoodOrderTriggered>(FoodOrderActionTypes.CreateFoodOrderTriggered),
    switchMap(foodOrderTriggeredAction => {
      if (foodOrderTriggeredAction.foodOrderDetails.foodOrderId === null || foodOrderTriggeredAction.foodOrderDetails.foodOrderId === '' || foodOrderTriggeredAction.foodOrderDetails.foodOrderId === undefined) {
        this.toastrMessage = this.translateService.instant(ConstantVariables.FoodOrderText) + " " + this.translateService.instant('HRMANAGAMENT.ORDERPLACEDMESSAGE');
      } else {
        this.toastrMessage = this.translateService.instant(ConstantVariables.FoodOrderText) + " " + this.translateService.instant(ConstantVariables.SuccessMessageForUpdated);
      }
      return this.foodOrderService
        .upsertFoodOrder(foodOrderTriggeredAction.foodOrderDetails)
        .pipe(
          map((foodOrderId: any) => {
            if (foodOrderId.success === true) {
              return new CreateFoodOrderCompleted(foodOrderId.data);
            } else {
              this.validationMessages = foodOrderId.apiResponseMessages
              return new CreateFoodOrderFailed(foodOrderId.apiResponseMessages);
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
  changeFoodOrderStatus$: Observable<Action> = this.actions$.pipe(
    ofType<ChangeFoodOrderStatusTriggred>(FoodOrderActionTypes.ChangeFoodOrderStatusTriggred),
    switchMap(changeFoodOrderTriggeredAction => {
      this.toastrMessage=this.translateService.instant(ConstantVariables.Rejectorder);
      return this.foodOrderService
        .changeFoodOrderStatus(changeFoodOrderTriggeredAction.foodOrderStatusModel)
        .pipe(
          map((foodOrderStatus: any) => {
            if (foodOrderStatus.success === true) {
              return new ChangeFoodOrderStatusCompleted(foodOrderStatus);
            } else {
              this.validationMessages = foodOrderStatus.apiResponseMessages
              return new ChangeFoodOrderStatusFailed(foodOrderStatus.apiResponseMessages);
            }
          }),
          catchError(error => {
            this.exceptionMessage = error;
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  // @Effect()
  // upsertFoodOrderSuccessfulAndLoadFoodOrder$: Observable<Action> = this.actions$.pipe(
  //   ofType<CreateFoodOrderCompleted>(FoodOrderActionTypes.CreateFoodOrderCompleted),
  //   pipe(
  //     map(() => {
  //       return new LoadFoodOrdersTriggered(this.foodOrderSearchResult);
  //     }),
  //   )
  // );

  @Effect()
  upsertFoodOrderSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<CreateFoodOrderCompleted>(FoodOrderActionTypes.CreateFoodOrderCompleted),
    pipe(
      map(
        () =>
          new SnackbarOpen({
            message: this.toastrMessage, // TODO: Change to proper toast message
            action: this.translateService.instant(ConstantVariables.success)
          })
      )
    )
  );

  @Effect()
  showValidationMessagesForAssets$: Observable<Action> = this.actions$.pipe(
    ofType<CreateFoodOrderFailed>(FoodOrderActionTypes.CreateFoodOrderFailed),
    pipe(
      map(() => {
        return new ShowValidationMessages({
          validationMessages: this.validationMessages, // TODO: Change to proper toast message
        })
      })
    )
  );

  @Effect()
  changeFoodOrderStatusCompleted$: Observable<Action> = this.actions$.pipe(
    ofType<ChangeFoodOrderStatusCompleted>(FoodOrderActionTypes.ChangeFoodOrderStatusCompleted),
    pipe(
      map(
        () =>
          new SnackbarOpen({
            message: this.toastrMessage, // TODO: Change to proper toast message
            action: this.translateService.instant(ConstantVariables.success)
          })
      )
    )
  );

  @Effect()
  changeFoodOrderStatusFailed$: Observable<Action> = this.actions$.pipe(
    ofType<ChangeFoodOrderStatusFailed>(FoodOrderActionTypes.ChangeFoodOrderStatusFailed),
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
    ofType<ExceptionHandled>(FoodOrderActionTypes.ExceptionHandled),
    pipe(
      map(() => new ShowExceptionMessages({
        message: this.exceptionMessage.message, // TODO: Change to proper toast message
      })
      )
    )
  );

  @Effect()
  sendUpsertedIdAsReferenceId$: Observable<Action> = this.actions$.pipe(
    ofType<CreateFoodOrderCompleted>(FoodOrderActionTypes.CreateFoodOrderCompleted),
    switchMap(searchAction => {
      return of(new GetReferenceIdOfFile(searchAction.foodOrderId)
      )
    })
  );

  constructor(
    private actions$: Actions,
    private foodOrderService: FoodOrderService,
    private translateService: TranslateService
  ) { }
}