import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable, of, empty } from "rxjs";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";

import { EmployeeService } from "../../services/employee-service";

import { State } from "../reducers/index";
import * as hrManagementModuleReducer from "../reducers/index";

import { LoadSubscriptionPaidByOptionsTriggered, SubscriptionPaidByOptionsListActionTypes, ExceptionHandled, LoadSubscriptionPaidByOptionsCompleted, LoadSubscriptionPaidByOptionsFailed } from "../actions/subscription-paid-by-options.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';


@Injectable()
export class SubscriptionPaidByOptionsEffects {

  @Effect()
  loadSubscriptionPaidByOptionsList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadSubscriptionPaidByOptionsTriggered>(SubscriptionPaidByOptionsListActionTypes.LoadSubscriptionPaidByOptionsTriggered),
    withLatestFrom(this.store$.pipe(select(hrManagementModuleReducer.getSubscriptionPaidByOptionsAll))),
    switchMap(([searchAction, SubscriptionPaidByOptions]) => {
      if (SubscriptionPaidByOptions && SubscriptionPaidByOptions.length > 0) {
        console.log("Subscription paid by options list is already in cache.");
        return empty();
      }
      else {
        return this.employeeService.getAllSubscriptionPaidByOptions(searchAction.SubscriptionPaidByOptionsSearchResult)
          .pipe(map((SubscriptionPaidByOptionsList: any) => {
            if (SubscriptionPaidByOptionsList.success === true) {
              return new LoadSubscriptionPaidByOptionsCompleted(SubscriptionPaidByOptionsList.data);
            } else {
              return new LoadSubscriptionPaidByOptionsFailed(SubscriptionPaidByOptionsList.apiResponseMessages);
            }
          }),
            catchError(error => {
              return of(new ExceptionHandled(error));
            })
          );
      }
    })
  );

  @Effect()
  showValidationMessagesForSubscriptionPaidByOptionsList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadSubscriptionPaidByOptionsFailed>(SubscriptionPaidByOptionsListActionTypes.LoadSubscriptionPaidByOptionsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandledForSubscriptionPaidByOptionsList$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(SubscriptionPaidByOptionsListActionTypes.ExceptionHandled),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  constructor(
    private actions$: Actions,
    private store$: Store<State>,
    private employeeService: EmployeeService
  ) { }
}