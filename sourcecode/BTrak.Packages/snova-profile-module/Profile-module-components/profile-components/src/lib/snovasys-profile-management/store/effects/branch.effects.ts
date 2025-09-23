import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";
import { State } from "../reducers/index";
import * as assetModuleReducer from '../../store/reducers/index';
import { BranchActionTypes, LoadBranchTriggered, LoadBranchCompleted, BranchExceptionHandled, LoadBranchFailed } from "../actions/branch.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { DashboardService } from '../../services/dashboard.service';

@Injectable()
export class BranchEffects {
  @Effect()
  loadBranch$: Observable<Action> = this.actions$.pipe(
    ofType<LoadBranchTriggered>(BranchActionTypes.LoadBranchTriggered),
    withLatestFrom(this.store$.pipe(select(assetModuleReducer.getBranchAll))),
    switchMap(([searchAction, branches]) => {
        return this.dashboardService
        .getBranchList(searchAction.branchSearchResult)
        .pipe(map((branchList: any) => {
          if (branchList.success === true) {
            return new LoadBranchCompleted(branchList.data);
          } else {
            return new LoadBranchFailed(branchList.apiResponseMessages);
          }
        }),
          catchError(error => of(new BranchExceptionHandled(error)))
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
  BranchExceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<BranchExceptionHandled>(BranchActionTypes.BranchExceptionHandled),
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
    private dashboardService: DashboardService
  ) { }
}