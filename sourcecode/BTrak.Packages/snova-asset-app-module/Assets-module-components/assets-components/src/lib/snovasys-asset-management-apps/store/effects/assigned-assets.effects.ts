import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { AssetService } from "../../services/assets.service";
import { AssignedAssetsActionTypes, LoadRecentlyAssignedAssetsTriggered, LoadRecentlyAssignedAssetsCompleted, AssignedAssetsExceptionHandled, LoadRecentlyAssignedAssetsFailed } from "../actions/assigned-assets.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()
export class AssignedAssetsEffects {
  @Effect()
  loadAssignedAssets$: Observable<Action> = this.actions$.pipe(
    ofType<LoadRecentlyAssignedAssetsTriggered>(AssignedAssetsActionTypes.LoadRecentlyAssignedAssetsTriggered),
    switchMap(searchAction => {
      return this.assetService
        .getAllAssets(searchAction.assignedAssetsSearchResult)
        .pipe(map((recentlyAssignedAssetsList: any) => {
          if (recentlyAssignedAssetsList.success === true) {
            return new LoadRecentlyAssignedAssetsCompleted(recentlyAssignedAssetsList.data);
          } else {
            return new LoadRecentlyAssignedAssetsFailed(recentlyAssignedAssetsList.apiResponseMessages);
          }
        }),
          catchError(error => {
            return of(new AssignedAssetsExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  showValidationMessagesForAssignedAssets$: Observable<Action> = this.actions$.pipe(
    ofType<LoadRecentlyAssignedAssetsFailed>(AssignedAssetsActionTypes.LoadRecentlyAssignedAssetsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  AssignedAssetsExceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<AssignedAssetsExceptionHandled>(AssignedAssetsActionTypes.AssignedAssetsExceptionHandled),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  constructor(
    private actions$: Actions,
    private assetService: AssetService
  ) { }
}