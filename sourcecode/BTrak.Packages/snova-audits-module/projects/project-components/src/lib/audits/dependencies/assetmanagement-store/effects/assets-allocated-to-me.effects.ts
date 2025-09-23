import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";

import { AssetService } from "../../services/assets.service";

import { AssetsAllocatedToMeActionTypes, LoadAssetsAllocatedToMeTriggered, LoadAssetsAllocatedToMeCompleted, ExceptionHandled, LoadAssetsAllocatedToMeFailed } from "../actions/assets-assigned-to-me.actions";
import { ShowExceptionMessages, ShowValidationMessages } from "../../project-store/actions/notification-validator.action";

@Injectable()
export class AssetsAllocatedToMeEffects {
  @Effect()
  loadAssetsAllocatedToMe$: Observable<Action> = this.actions$.pipe(
    ofType<LoadAssetsAllocatedToMeTriggered>(AssetsAllocatedToMeActionTypes.LoadAssetsAllocatedToMeTriggered),
    switchMap(searchAction => {
      return this.assetService
        .getAllAssets(searchAction.assetsAllocatedToMeSearchResult)
        .pipe(map((assetsAllocatedToMeList: any) => {
          if (assetsAllocatedToMeList.success === true) {
            return new LoadAssetsAllocatedToMeCompleted(assetsAllocatedToMeList.data);
          } else {
            return new LoadAssetsAllocatedToMeFailed(
              assetsAllocatedToMeList.apiResponseMessages
            );
          }
        }),
          catchError(error => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  showValidationMessagesForAssetsAllocatedToMe$: Observable<Action> = this.actions$.pipe(
    ofType<LoadAssetsAllocatedToMeFailed>(AssetsAllocatedToMeActionTypes.LoadAssetsAllocatedToMeFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(AssetsAllocatedToMeActionTypes.ExceptionHandled),
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