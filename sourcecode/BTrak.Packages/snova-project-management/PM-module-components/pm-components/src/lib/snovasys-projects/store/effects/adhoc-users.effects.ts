import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";

import { ShowExceptionMessages, ShowValidationMessages } from "../../store/actions/notification-validator.action";
import { AdhocUsersActionTypes, GetAdhocUsersCompleted, AdhocUsersExceptionHandled, GetAdhocUsersTriggered } from "../actions/adhoc-users.action";
import { AdhocWorkService } from "../../services/adhoc-work.service";


@Injectable()
export class AdhocUsersEffects {

  @Effect()
  getAdhocUsers$: Observable<Action> = this.actions$.pipe(
    ofType<GetAdhocUsersTriggered>(AdhocUsersActionTypes.GetAdhocUsersTriggered),
    switchMap(searchAction => {
        return this.adhocWorkService
          .getAdhocUsersDropDown(searchAction.searchText, searchAction.isUserStoryDropDown)
          .pipe(
            map((AdhocUsers: any) => {
              if (AdhocUsers.success === true) {
                return new GetAdhocUsersCompleted(AdhocUsers.data);
              } 
            }),
            catchError(error => {
              return of(new AdhocUsersExceptionHandled(error));
            })
          );
    })
  );


  @Effect()
  AdhocUsersExceptionHandledForGoalReplanHistory$: Observable<Action> = this.actions$.pipe(
    ofType<AdhocUsersExceptionHandled>(AdhocUsersActionTypes.AdhocUsersExceptionHandled),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  constructor(
    private actions$: Actions,
    private adhocWorkService: AdhocWorkService
  ) { }
}