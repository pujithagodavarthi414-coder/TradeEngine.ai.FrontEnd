import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable, of, pipe } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { AssetCommentsAndHistorySearch } from "../../models/assets-comments-and-history-search.model";
import { ListOfAssetsService } from "../../services/list-of-assets.service";import { LoadAssetsCommentsAndHistoryItemsTriggered, AssetsCommentsAndHistoryActionTypes, AssetCommentsAndHistoryExceptionHandled, LoadAssetsCommentsAndHistoryItemsCompleted, LoadAssetsCommentsAndHistoryItemsFailed, AddAssetCommentTriggered, AddAssetCommentCompleted, AddAssetCommentFailed } from "../actions/assetsCommentsAndHistory.actions";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { SnackbarOpen } from '../actions/snackbar.actions';

@Injectable()
export class AssetsCommentsAndHistoryEffects {
  assetId: string;

  @Effect()
  loadAssetsCommentsAndHistory$: Observable<Action> = this.actions$.pipe(
    ofType<LoadAssetsCommentsAndHistoryItemsTriggered>(AssetsCommentsAndHistoryActionTypes.LoadAssetsCommentsAndHistoryItemsTriggered),
    switchMap((searchAction) => {
      return this.assetService
        .getComments(searchAction.assetsCommentsAndHistorySearchResult)
        .pipe(
          map((AssetsCommentsAndHistory: any) => {
            if (AssetsCommentsAndHistory.success === true) {
              return new LoadAssetsCommentsAndHistoryItemsCompleted(AssetsCommentsAndHistory.data);
            } else {
              return new LoadAssetsCommentsAndHistoryItemsFailed(AssetsCommentsAndHistory.apiResponseMessages);
            }
          }),
          catchError((error) => {
            return of(new AssetCommentsAndHistoryExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  showValidationMessagesForAssetsCommentsAndHistory$: Observable<Action> = this.actions$.pipe(
    ofType<LoadAssetsCommentsAndHistoryItemsFailed>(AssetsCommentsAndHistoryActionTypes.LoadAssetsCommentsAndHistoryItemsFailed),
    switchMap((searchAction) => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages
      })
      )
    })
  );

  @Effect()
  upsertComment$: Observable<Action> = this.actions$.pipe(
    ofType<AddAssetCommentTriggered>(AssetsCommentsAndHistoryActionTypes.AddAssetCommentTriggered),
    switchMap((searchAction) => {
      this.assetId = searchAction.assetComments.receiverId;
      return this.listOfAssets.upsertComments(searchAction.assetComments)
        .pipe(map((result: any) => {
          if (result.success === true) {
            return new AddAssetCommentCompleted(result.data);
          } else {
            return new AddAssetCommentFailed(result.apiResponseMessages);
          }
        }),
          catchError((error) => {
            return of(new AssetCommentsAndHistoryExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  loadAssetsCommentsAfterCreateComment$: Observable<Action> = this.actions$.pipe(
    ofType<AddAssetCommentCompleted>(AssetsCommentsAndHistoryActionTypes.AddAssetCommentCompleted),
    pipe(map(() => {
      const assetCommentsAndHistorySearch = new AssetCommentsAndHistorySearch()
      assetCommentsAndHistorySearch.pageNumber = 1;
      assetCommentsAndHistorySearch.pageSize = 20;
      assetCommentsAndHistorySearch.assetId = this.assetId;
      return new LoadAssetsCommentsAndHistoryItemsTriggered(assetCommentsAndHistorySearch);
    })
    )
  );

  @Effect()
  upsertProductSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<AddAssetCommentCompleted>(AssetsCommentsAndHistoryActionTypes.AddAssetCommentCompleted),
    pipe(map(() => new SnackbarOpen({
      message: this.translateService.instant("ASSETS.COMMENTEDSUCCESSFULLY"), // TODO: Change to proper toast message
      action: this.translateService.instant(ConstantVariables.success)
    })))
  );

  @Effect()
  showValidationMessagesForAddAssetCommentFailed$: Observable<Action> = this.actions$.pipe(
    ofType<AddAssetCommentFailed>(AssetsCommentsAndHistoryActionTypes.AddAssetCommentFailed),
    switchMap((searchAction) => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages
      })
      )
    })
  );

  @Effect()
  AssetCommentsAndHistoryExceptionHandledForAssetsCommentsAndHistory$: Observable<Action> = this.actions$.pipe(
    ofType<AssetCommentsAndHistoryExceptionHandled>(AssetsCommentsAndHistoryActionTypes.AssetCommentsAndHistoryExceptionHandled),
    switchMap((searchAction) => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage // TODO: Change to proper toast message
      })
      )
    })
  );

  constructor(
    private actions$: Actions,
    private assetService: ListOfAssetsService,
    private translateService: TranslateService,
    private listOfAssets: ListOfAssetsService
  ) { }
}
