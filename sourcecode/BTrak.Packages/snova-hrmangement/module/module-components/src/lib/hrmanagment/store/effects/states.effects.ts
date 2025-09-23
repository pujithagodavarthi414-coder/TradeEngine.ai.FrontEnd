import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable, of, empty } from "rxjs";
import { Action, select, Store } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";

import { EmployeeService } from "../../services/employee-service";

import { State } from "../reducers/index";
import * as hrManagementModuleReducer from "../reducers/index";

import { LoadStatesListItemsTriggered, StatesListActionTypes, ExceptionHandled, LoadStatesListItemsCompleted, LoadStatesListItemsFailed } from "../actions/states.action";
import { ShowExceptionMessages, ShowValidationMessages } from '../actions/notification-validator.action';

@Injectable()
export class StatesListEffects {

  @Effect()
  loadStatesList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadStatesListItemsTriggered>(StatesListActionTypes.LoadStatesListItemsTriggered),
    withLatestFrom(this.store$.pipe(select(hrManagementModuleReducer.getStatesAll))),
    switchMap(([searchAction, states]) => {
      if (states && states.length > 0) {
        console.log("states list is already in cache.");
        return empty();
      }
      else {
        return this.StatesService
          .getAllStates(searchAction.statesSearchResult)
          .pipe(
            map((statesList: any) => {
              if (statesList.success === true) {
                return new LoadStatesListItemsCompleted(statesList.data);
              }
              else {
                return new LoadStatesListItemsFailed(statesList.apiResponseMessages);
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
  showValidationMessagesForStatesList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadStatesListItemsFailed>(StatesListActionTypes.LoadStatesListItemsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandledForStatesList$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(StatesListActionTypes.ExceptionHandled),
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
    private StatesService: EmployeeService
  ) { }
}