import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable, of, empty } from "rxjs";
import { Action, select, Store } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";

import { State } from "../reducers/index";
import * as hrManagementModuleReducer from "../reducers/index";

import { LoadDesignationListItemsTriggered, DesignationListActionTypes, ExceptionHandled, LoadDesignationListItemsCompleted, LoadDesignationListItemsFailed } from "../actions/designation.action";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { EmployeeListService } from '../../services/employee-list.service';

@Injectable()
export class DesignationListEffects {

  @Effect()
  loadDesignationList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadDesignationListItemsTriggered>(DesignationListActionTypes.LoadDesignationListItemsTriggered),
    withLatestFrom(this.store$.pipe(select(hrManagementModuleReducer.getDesignationAll))),
    switchMap(([searchAction, designation]) => {
      // if (designation && designation.length > 0) {
      //   console.log("designation list is already in cache.");
      //   return empty();
      // }
      // else {
        return this.DesignationService
          .getAllDesignations(searchAction.designationListSearchResult)
          .pipe(
            map((designationList: any) => {
              if (designationList.success === true) {
                return new LoadDesignationListItemsCompleted(designationList.data);
              } else {
                return new LoadDesignationListItemsFailed(designationList.apiResponseMessages);
              }
            }),
            catchError(error => {
              return of(new ExceptionHandled(error));
            })
          );
      // }
    })
  );

  @Effect()
  showValidationMessagesForDesignationList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadDesignationListItemsFailed>(DesignationListActionTypes.LoadDesignationListItemsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandledForDesignationList$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(DesignationListActionTypes.ExceptionHandled),
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
    private DesignationService: EmployeeListService
  ) { }
}