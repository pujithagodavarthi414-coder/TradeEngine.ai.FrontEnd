import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { CurrencyActionTypes, LoadCurrencyTriggered, LoadCurrencyCompleted, ExceptionHandled, LoadCurrencyFailed } from "../actions/currency.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { CanteenManagementService } from '../../services/canteen-management.service';

@Injectable()
export class CurrencyEffects {
  @Effect()
  loadCurrency$: Observable<Action> = this.actions$.pipe(
    ofType<LoadCurrencyTriggered>(CurrencyActionTypes.LoadCurrencyTriggered),
    switchMap(() => {
      return this.employeeService.getCurrencyList().pipe(map((currencyList: any) => {
        if (currencyList.success === true) {
          return new LoadCurrencyCompleted(currencyList.data);
        } else {
          return new LoadCurrencyFailed(currencyList.apiResponseMessages);
        }
      }),
        catchError(error => of(new ExceptionHandled(error)))
      );
    })
  );

  @Effect()
  showValidationMessagesForCurrencyList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadCurrencyFailed>(CurrencyActionTypes.LoadCurrencyFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(CurrencyActionTypes.ExceptionHandled),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  constructor(
    private actions$: Actions,
    private employeeService: CanteenManagementService
  ) { }
}