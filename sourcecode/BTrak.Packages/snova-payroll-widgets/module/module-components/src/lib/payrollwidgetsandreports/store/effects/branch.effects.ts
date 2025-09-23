import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";
import { PayRollService } from '../../services/PayRollService'
import { State } from "../reducers";
import * as branchReducer from '../reducers';
import { BranchActionTypes, LoadBranchTriggered, LoadBranchCompleted, LoadBranchFailed, ExceptionHandled } from '../actions/branch.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';


@Injectable()
export class BranchEffects {
  [x: string]: any;
  @Effect()
  loadBranch$: Observable<Action> = this.actions$.pipe(
    ofType<LoadBranchTriggered>(BranchActionTypes.LoadBranchTriggered),
    withLatestFrom(this.store$.pipe(select(branchReducer.getBranchAll))),
    switchMap(([searchAction, branches]) => {
      // if (branches && branches.length > 0) {
      //   console.log("branch list is already in cache.");
      //   return Observable.empty();
      // }
      // else {
        return this.payRollService
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
    private payRollService: PayRollService
  ) { }
}