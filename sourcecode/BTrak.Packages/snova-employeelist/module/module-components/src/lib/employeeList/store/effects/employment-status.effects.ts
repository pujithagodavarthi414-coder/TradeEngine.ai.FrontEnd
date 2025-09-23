import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable, of, empty } from "rxjs";
import { Action, select, Store } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";

import { State } from "../reducers/index";
import * as hrManagementModuleReducer from "../reducers/index";

import { LoadEmploymentStatusListItemsTriggered, EmploymentStatusListActionTypes, LoadEmploymentStatusListItemsCompleted, EmploymentExceptionHandled, LoadEmploymentListItemsFailed } from "../actions/employment-status.action";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { EmployeeListService } from '../../services/employee-list.service';

@Injectable()
export class EmploymentStatusListEffects {
  toastrMessage: string;

  @Effect()
  loadEmploymentList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadEmploymentStatusListItemsTriggered>(EmploymentStatusListActionTypes.LoadEmploymentStatusListItemsTriggered),
    withLatestFrom(this.store$.pipe(select(hrManagementModuleReducer.getEmploymentStatusAll))),
    switchMap(([searchAction, employmentStatus]) => {
      if (employmentStatus && employmentStatus.length > 0) {
        console.log("employmentStatus list is already in cache.");
        return empty();
      }
      else {
        return this.EmploymentService
          .getAllEmploymentStatus(searchAction.employmentStatusListSearchResult)
          .pipe(map((employmentList: any) => {
            if (employmentList.success === true) {
              return new LoadEmploymentStatusListItemsCompleted(employmentList.data);
            } else {
              return new LoadEmploymentListItemsFailed(employmentList.apiResponseMessages);
            }
          }),
            catchError(error => {
              return of(new EmploymentExceptionHandled(error));
            })
          );
      }
    })
  );

  @Effect()
  showValidationMessagesForEmploymentList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadEmploymentListItemsFailed>(EmploymentStatusListActionTypes.LoadEmploymentListItemsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandledForEmploymentList$: Observable<Action> = this.actions$.pipe(
    ofType<EmploymentExceptionHandled>(EmploymentStatusListActionTypes.EmploymentExceptionHandled),
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
    private EmploymentService: EmployeeListService
  ) { }
}