import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { Action, select, Store } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";

import { EmployeeService } from "../../services/employee-service";

import { State } from "../reducers/index";
import * as hrManagementModuleReducer from "../reducers/index";

import { LoadShiftTimingListItemsTriggered, ShiftTimingListActionTypes, ExceptionHandled, LoadShiftTimingListItemsCompleted, LoadShiftTimingListItemsFailed } from "../actions/shift-timing.action";
import { ShowExceptionMessages, ShowValidationMessages } from '../actions/notification-validator.action';

@Injectable()
export class ShiftTimingListEffects {

  @Effect()
  loadShiftTimingList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadShiftTimingListItemsTriggered>(ShiftTimingListActionTypes.LoadShiftTimingListItemsTriggered),
    withLatestFrom(this.store$.pipe(select(hrManagementModuleReducer.getShiftTimingAll))),
    switchMap(([searchAction, ShiftTiming]) => {
      // if (ShiftTiming && ShiftTiming.length > 0) {
      //   console.log("Shift timing list is already in cache.");
      //   return Observable.empty();
      // }
      // else {
        return this.ShiftTimingService
          .getAllShiftTimings(searchAction.ShiftTimingListSearchResult)
          .pipe(
            map((ShiftTimingList: any) => {
              if (ShiftTimingList.success === true) {
                return new LoadShiftTimingListItemsCompleted(ShiftTimingList.data);
              } else {
                return new LoadShiftTimingListItemsFailed(ShiftTimingList.apiResponseMessages);
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
  showValidationMessagesForShiftTimingList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadShiftTimingListItemsFailed>(ShiftTimingListActionTypes.LoadShiftTimingListItemsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandledForShiftTimingList$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(ShiftTimingListActionTypes.ExceptionHandled),
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
    private ShiftTimingService: EmployeeService
  ) { }
}