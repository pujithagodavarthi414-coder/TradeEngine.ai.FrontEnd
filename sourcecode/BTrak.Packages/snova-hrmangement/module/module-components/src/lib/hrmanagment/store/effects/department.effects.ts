import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable, of, empty } from "rxjs";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";

import { EmployeeService } from "../../services/employee-service";

import { State } from "../reducers/index";
import * as hrManagementModuleReducer from "../reducers/index";

import { LoadDepartmentListItemsTriggered, DepartmentListActionTypes, ExceptionHandled, LoadDepartmentListItemsCompleted, LoadDepartmentListItemsFailed } from "../actions/department.action";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()
export class DepartmentListEffects {
  toastrMessage: string;
  validationMessages: any[];
  exceptionMessage: any;

  @Effect()
  loadDepartmentList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadDepartmentListItemsTriggered>(DepartmentListActionTypes.LoadDepartmentListItemsTriggered),
    withLatestFrom(this.store$.pipe(select(hrManagementModuleReducer.getDepartmentAll))),
    switchMap(([searchAction, department]) => {
      if (department && department.length > 0) {
        console.log("department list is already in cache.");
        return empty();
      }
      else {
        return this.departmentService
          .getAllDepartments(searchAction.departmentSearchResult)
          .pipe(
            map((departmentList: any) => {
              if (departmentList.success === true) {
                return new LoadDepartmentListItemsCompleted(departmentList.data);
              } else {
                return new LoadDepartmentListItemsFailed(departmentList.apiResponseMessages);
              }
            }),
            catchError(error => {
              this.exceptionMessage = error;
              return of(new ExceptionHandled(error));
            })
          );
      }
    })
  );

  @Effect()
  showValidationMessagesForDepartmentList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadDepartmentListItemsFailed>(DepartmentListActionTypes.LoadDepartmentListItemsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandledForDepartmentList$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(DepartmentListActionTypes.ExceptionHandled),
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
    private departmentService: EmployeeService
  ) { }
}