import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable, of, empty } from "rxjs";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";

import { EmployeeService } from "../../services/employee-service";

import { State } from "../reducers/index";
import * as hrManagementModuleReducer from "../reducers/index";

import { LoadPayGradeTriggered, PayGradeListActionTypes, LoadPayGradeCompleted, LoadPayGradeFailed, ExceptionHandled } from "../actions/pay-grade.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';


@Injectable()
export class PayGradeEffects {

  @Effect()
  loadPayGradeList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadPayGradeTriggered>(PayGradeListActionTypes.LoadPayGradeTriggered),
    withLatestFrom(this.store$.pipe(select(hrManagementModuleReducer.getPayGradeAll))),
    switchMap(([searchAction, PayGrade]) => {
      if (PayGrade && PayGrade.length > 0) {
        console.log("Employee payGrade list is already in cache.");
        return empty();
      }
      else {
        return this.employeeService.getAllPayGrade(searchAction.payGradeSearchResult)
          .pipe(map((PayGradeList: any) => {
            if (PayGradeList.success === true) {
              return new LoadPayGradeCompleted(PayGradeList.data);
            } else {
              return new LoadPayGradeFailed(PayGradeList.apiResponseMessages);
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
  showValidationMessagesForPayGradeList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadPayGradeFailed>(PayGradeListActionTypes.LoadPayGradeFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandledForPayGradeList$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(PayGradeListActionTypes.ExceptionHandled),
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