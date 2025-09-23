import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { AssetService } from "../../services/assets.service";
import { CurrencyActionTypes, LoadCurrencyTriggered, LoadCurrencyCompleted, CurrencyExceptionHandled, LoadCurrencyFailed } from "../actions/currency.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()
export class CurrencyEffects {
  @Effect()
  loadCurrency$: Observable<Action> = this.actions$.pipe(
    ofType<LoadCurrencyTriggered>(CurrencyActionTypes.LoadCurrencyTriggered),
    switchMap(() => {
      return this.assetService.getCurrencyList().pipe(map((currencyList: any) => {
        if (currencyList.success === true) {
          return new LoadCurrencyCompleted(currencyList.data);
        } else {
          return new LoadCurrencyFailed(currencyList.apiResponseMessages);
        }
      }),
        catchError(error => of(new CurrencyExceptionHandled(error)))
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
  CurrencyExceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<CurrencyExceptionHandled>(CurrencyActionTypes.CurrencyExceptionHandled),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  constructor(
    private actions$: Actions,
    private assetService: AssetService
  ) { }
}