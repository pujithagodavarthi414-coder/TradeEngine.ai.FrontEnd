import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable, of, pipe, empty } from "rxjs";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";

import { EmployeeService } from "../../services/employee-service";

import { State } from "../reducers/index";
import * as hrManagementModuleReducer from "../reducers/index";

import { LoadEmployeeEducationLevelsTriggered, EmployeeEducationLevelsListActionTypes, ExceptionHandled, LoadEmployeeEducationLevelsCompleted, LoadEmployeeEducationLevelsFailed } from "../actions/employee-education-levels-details.action";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()
export class EmployeeEducationLevelsEffects {
  toastrMessage: string;

  @Effect()
  loadEmployeeEducationLevelsList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadEmployeeEducationLevelsTriggered>(EmployeeEducationLevelsListActionTypes.LoadEmployeeEducationLevelsTriggered),
    withLatestFrom(this.store$.pipe(select(hrManagementModuleReducer.getEmployeeEducationLevelsAll))),
    switchMap(([searchAction, EmployeeEducationLevels]) => {
      if (EmployeeEducationLevels && EmployeeEducationLevels.length > 0) {
        console.log("Employee Education Levels list is already in cache.");
        return empty();
      }
      else {
        return this.employeeService.getAllEmployeeEducationLevels(searchAction.employeeEducationLevelsSearchResult)
          .pipe(map((employeeEducationLevelsList: any) => {
            if (employeeEducationLevelsList.success === true) {
              return new LoadEmployeeEducationLevelsCompleted(employeeEducationLevelsList.data);
            } else {
              return new LoadEmployeeEducationLevelsFailed(employeeEducationLevelsList.apiResponseMessages);
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
  showValidationMessagesForEmployeeEducationLevelsList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadEmployeeEducationLevelsFailed>(EmployeeEducationLevelsListActionTypes.LoadEmployeeEducationLevelsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandledForEmployeeEducationLevelsList$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(EmployeeEducationLevelsListActionTypes.ExceptionHandled),
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