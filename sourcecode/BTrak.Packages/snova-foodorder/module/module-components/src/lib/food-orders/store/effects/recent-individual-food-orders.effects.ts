import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";

import { FoodOrderService } from "../../services/food-order.service";

import { RecentIndividualFoodOrdersActionTypes, LoadRecentIndividualFoodOrdersTriggered, LoadRecentIndividualFoodOrdersCompleted, ExceptionHandled } from "../actions/recent-individual-food-orders.actions";
import { ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()
export class RecentIndividualFoodOrderEffects {
  exceptionMessage: any;
  @Effect()
  loadRecentIndividualFoodOrders$: Observable<Action> = this.actions$.pipe(
    ofType<LoadRecentIndividualFoodOrdersTriggered>(RecentIndividualFoodOrdersActionTypes.LoadRecentIndividualFoodOrdersTriggered),
    switchMap(searchAction => {
      return this.foodOrderService
        .getRecentFoodOrders(searchAction.recentIndividualFoodOrdersSearchResult)
        .pipe(map((recentIndividualFoodOrdersList: any) => new LoadRecentIndividualFoodOrdersCompleted(recentIndividualFoodOrdersList.data)),
          catchError(error => {
            this.exceptionMessage = error;
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  exceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(RecentIndividualFoodOrdersActionTypes.ExceptionHandled),
    pipe(
      map(() => new ShowExceptionMessages({
        message: this.exceptionMessage.message, // TODO: Change to proper toast message
      })
      )
    )
  );

  constructor(
    private actions$: Actions,
    private foodOrderService: FoodOrderService
  ) { }
}