import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable, of, empty } from "rxjs";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";

import { EmployeeService } from "../../services/employee-service";

import { State } from "../reducers/index";
import * as hrManagementModuleReducer from "../reducers/index";

import { LoadPaymentMethodTriggered, PaymentMethodListActionTypes, ExceptionHandled, LoadPaymentMethodCompleted, LoadPaymentMethodFailed } from "../actions/payment-method.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';


@Injectable()
export class PaymentMethodEffects {

  @Effect()
  loadPaymentMethodList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadPaymentMethodTriggered>(PaymentMethodListActionTypes.LoadPaymentMethodTriggered),
    withLatestFrom(this.store$.pipe(select(hrManagementModuleReducer.getPaymentMethodAll))),
    switchMap(([searchAction, PaymentMethod]) => {
      if (PaymentMethod && PaymentMethod.length > 0) {
        console.log("Employee paymentMethod Levels list is already in cache.");
        return empty();
      }
      else {
        return this.employeeService.getAllPaymentMethod(searchAction.paymentMethodSearchResult)
          .pipe(map((PaymentMethodList: any) => {
            if (PaymentMethodList.success === true) {
              return new LoadPaymentMethodCompleted(PaymentMethodList.data);
            } else {
              return new LoadPaymentMethodFailed(PaymentMethodList.apiResponseMessages);
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
  showValidationMessagesForPaymentMethodList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadPaymentMethodFailed>(PaymentMethodListActionTypes.LoadPaymentMethodFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandledForPaymentMethodList$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(PaymentMethodListActionTypes.ExceptionHandled),
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