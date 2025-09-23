import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { AssetService } from "../../services/assets.service";
import { DamagedAssetsActionTypes, LoadRecentlyDamagedAssetsTriggered, LoadRecentlyDamagedAssetsCompleted, DamagedAssetsExceptionHandled, LoadRecentlyDamagedAssetsFailed } from "../actions/damaged-assets.actions";
import { ShowExceptionMessages, ShowValidationMessages } from '../actions/notification-validator.action';

@Injectable()
export class DamagedAssetsEffects {
  @Effect()
  loadDamagedAssets$: Observable<Action> = this.actions$.pipe(
    ofType<LoadRecentlyDamagedAssetsTriggered>(DamagedAssetsActionTypes.LoadRecentlyDamagedAssetsTriggered),
    switchMap(searchAction => {
      return this.assetService
        .getAllAssets(searchAction.damagedAssetsSearchResult)
        .pipe(map((recentlyDamagedAssetsList: any) =>{
          if (recentlyDamagedAssetsList.success === true) {
            return new LoadRecentlyDamagedAssetsCompleted(recentlyDamagedAssetsList.data);
          } else {
            return new LoadRecentlyDamagedAssetsFailed(recentlyDamagedAssetsList.apiResponseMessages);
          }
        }),
          catchError(error => {
            return of(new DamagedAssetsExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  showValidationMessagesForAssignedAssets$: Observable<Action> = this.actions$.pipe(
    ofType<LoadRecentlyDamagedAssetsFailed>(DamagedAssetsActionTypes.LoadRecentlyDamagedAssetsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  DamagedAssetsExceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<DamagedAssetsExceptionHandled>(DamagedAssetsActionTypes.DamagedAssetsExceptionHandled),
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