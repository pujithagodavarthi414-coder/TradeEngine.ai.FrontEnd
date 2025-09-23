import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";

import { State } from "../reducers/index";
import * as hrManagementReducer from '../../store/reducers/index';

import { BranchActionTypes, LoadBranchTriggered, LoadBranchCompleted, ExceptionHandled, LoadBranchFailed } from "../actions/branch.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { CanteenManagementService } from '../../services/canteen-management.service';

@Injectable()
export class BranchEffects {
  @Effect()
  loadBranch$: Observable<Action> = this.actions$.pipe(
    ofType<LoadBranchTriggered>(BranchActionTypes.LoadBranchTriggered),
    withLatestFrom(this.store$.pipe(select(hrManagementReducer.getBranchAll))),
    switchMap(([searchAction, branches]) => {
      // if (branches && branches.length > 0) {
      //   console.log("branch list is already in cache.");
      //   return Observable.empty();
      // }
      // else {
        return this.canteenService
        .getBranchList(searchAction.branchSearchResult)
        .pipe(map((branchList: any) => {
          if (branchList.success === true) {
            return new LoadBranchCompleted(branchList.data);
          } else {
            return new LoadBranchFailed(branchList.apiResponseMessages);
          }
        }),
          catchError(error => of(new ExceptionHandled(error)))
        );
      //}
    })
  );

  @Effect()
  showValidationMessagesForLoadBranchFailed$: Observable<Action> = this.actions$.pipe(
    ofType<LoadBranchFailed>(BranchActionTypes.LoadBranchFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(BranchActionTypes.ExceptionHandled),
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
    private canteenService: CanteenManagementService
  ) { }
}