import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable, of, empty } from "rxjs";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";

import { EmployeeService } from "../../services/employee-service";

import { State } from "../reducers/index";
import * as hrManagementModuleReducer from "../reducers/index";

import { LoadPayFrequencyTriggered, PayFrequencyListActionTypes, ExceptionHandled, LoadPayFrequencyCompleted, LoadPayFrequencyFailed } from "../actions/pay-frequency.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';


@Injectable()
export class PayFrequencyEffects {

  @Effect()
  loadPayFrequencyList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadPayFrequencyTriggered>(PayFrequencyListActionTypes.LoadPayFrequencyTriggered),
    withLatestFrom(this.store$.pipe(select(hrManagementModuleReducer.getPayFrequencyAll))),
    switchMap(([searchAction, PayFrequency]) => {
      if (PayFrequency && PayFrequency.length > 0) {
        console.log("Employee payFrequency list is already in cache.");
        return empty();
      }
      else {
        return this.employeeService.getAllPayFrequency(searchAction.payFrequencySearchResult)
          .pipe(map((PayFrequencyList: any) => {
            if (PayFrequencyList.success === true) {
              return new LoadPayFrequencyCompleted(PayFrequencyList.data);
            } else {
              return new LoadPayFrequencyFailed(PayFrequencyList.apiResponseMessages);
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
  showValidationMessagesForPayFrequencyList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadPayFrequencyFailed>(PayFrequencyListActionTypes.LoadPayFrequencyFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandledForPayFrequencyList$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(PayFrequencyListActionTypes.ExceptionHandled),
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