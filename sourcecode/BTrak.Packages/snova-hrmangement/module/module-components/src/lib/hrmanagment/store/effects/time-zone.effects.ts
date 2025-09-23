import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { Action, select, Store } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";

import { EmployeeService } from "../../services/employee-service";

import { State } from "../reducers/index";
import * as hrManagementModuleReducer from "../reducers/index";

import { LoadTimeZoneListItemsTriggered, TimeZoneListActionTypes, ExceptionHandled, LoadTimeZoneListItemsCompleted, LoadTimeZoneListItemsFailed } from "../actions/time-zone.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()
export class TimeZoneListEffects {

  @Effect()
  loadTimeZoneList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadTimeZoneListItemsTriggered>(TimeZoneListActionTypes.LoadTimeZoneListItemsTriggered),
    withLatestFrom(this.store$.pipe(select(hrManagementModuleReducer.getTimeZoneAll))),
    switchMap(([searchAction, TimeZone]) => {
      // if (TimeZone && TimeZone.length > 0) {
      //   console.log("TimeZone list is already in cache.");
      //   return Observable.empty();
      // }
      // else {
        return this.timeZoneService
          .getAllTimeZones(searchAction.timeZoneListSearchResult)
          .pipe(
            map((TimeZoneList: any) => {
              if (TimeZoneList.success === true) {
                return new LoadTimeZoneListItemsCompleted(TimeZoneList.data);
              } else {
                return new LoadTimeZoneListItemsFailed(TimeZoneList.apiResponseMessages);
              }
            }),
            catchError(error => {
              return of(new ExceptionHandled(error));
            })
          );
      //}
    })
  );

  @Effect()
  showValidationMessagesForTimeZoneList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadTimeZoneListItemsFailed>(TimeZoneListActionTypes.LoadTimeZoneListItemsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandledForTimeZoneList$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(TimeZoneListActionTypes.ExceptionHandled),
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
    private timeZoneService: EmployeeService
  ) { }
}