import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";

import { FoodOrderManagementApiInput } from "../../models/all-food-orders";

import { FoodOrderService } from "../../services/food-order.service";

import { LoadFoodOrderStatusTriggered, FoodOrderStatusActionTypes, LoadFoodOrderStatusCompleted, ExceptionHandled } from "../actions/food-order-status.actions";
import { ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()
export class FoodOrderEffects {
  foodOrderSearchResult: FoodOrderManagementApiInput;
  toastrMessage: string;
  validationMessages: any[];
  exceptionMessage: any;

  @Effect()
  loadFoodOrderList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadFoodOrderStatusTriggered>(FoodOrderStatusActionTypes.LoadFoodOrderStatusTriggered),
    switchMap(searchAction => {
      this.foodOrderSearchResult = searchAction.foodOrderSearchResult;
      return this.foodOrderService
        .searchFoodOrder(searchAction.foodOrderSearchResult)
        .pipe(map((foodOrderStatusList: any) => {
          if(foodOrderStatusList.success == true) 
          return new LoadFoodOrderStatusCompleted(foodOrderStatusList.data)}),
          catchError(error => {
            this.exceptionMessage = error;
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  exceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(FoodOrderStatusActionTypes.ExceptionHandled),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  constructor(
    private actions$: Actions,
    private foodOrderService: FoodOrderService,
  ) { }
}