import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";

import { AssetInputModel } from "../../models/asset-input-model";
import { AssetUpdates } from "../../models/asset-updates.model";

import { AssetService } from "../../services/assets.service";

import { SnackbarOpen } from "../../project-store/actions/snackbar.actions";
import {
  AssetsActionTypes, LoadAssetsTriggered, LoadAssetsCompleted, CreateAssetsTriggered, CreateAssetsCompleted, CreateAssetsFailed,
  ExceptionHandled, GetAssetByIdTriggered, GetAssetByIdCompleted, CreateAssetCompletedWithInPlaceUpdate, RefreshAssetsList, LoadAssetsFailed,
  GetAssetByIdFailed, RemoveAssetsFromTheList, GetSelectedAssetTriggered, GetSelectedAssetCompleted, AssetsTotalCountTriggered,
  AssetsTotalCountCompleted, GetAssetsByIdsTriggered, GetAssetsByIdsCompleted, RemoveMultipleAssetsIdsCompleted, GetAssetsByIdsFailed
} from "../actions/assets.actions";
import { ShowExceptionMessages, ShowValidationMessages } from "../../project-store/actions/notification-validator.action";

import * as assetModuleReducer from "../reducers/index";
import { State } from "../reducers/index";
import { ConstantVariables } from '../../constants/constant-variables';

@Injectable()
export class AssetEffects {
  assetSearchResult: AssetInputModel;
  assetIdToBeRemoved: string;
  isNewAsset: boolean;
  toastrMessage: string;

  @Effect()
  loadAssets$: Observable<Action> = this.actions$.pipe(
    ofType<LoadAssetsTriggered>(AssetsActionTypes.LoadAssetsTriggered),
    switchMap((searchAction) => {
      this.assetSearchResult = JSON.parse(JSON.stringify(searchAction.assetsSearchResult));
      return this.assetService
        .getAllAssets(searchAction.assetsSearchResult)
        .pipe(map((assetsList: any) => {
          if (assetsList.success === true) {
            return new LoadAssetsCompleted(assetsList.data);
          } else {
            return new LoadAssetsFailed(assetsList.apiResponseMessages);
          }
        }),
          catchError((error) => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertAsset$: Observable<Action> = this.actions$.pipe(
    ofType<CreateAssetsTriggered>(AssetsActionTypes.CreateAssetsTriggered),
    switchMap((assetTriggeredAction) => {
      if (assetTriggeredAction.asset.assetId === null || assetTriggeredAction.asset.assetId === "" ||
        assetTriggeredAction.asset.assetId === undefined) {
        this.isNewAsset = true;
        this.toastrMessage = assetTriggeredAction.asset.assetName + " " +
          this.translateService.instant(ConstantVariables.SuccessMessageForAssetCreated);
      } else if (
        assetTriggeredAction.asset.assetId !== undefined &&
        assetTriggeredAction.asset.isWriteOff === true
      ) {
        this.isNewAsset = false;
        this.toastrMessage = assetTriggeredAction.asset.assetName + " " +
          this.translateService.instant(ConstantVariables.SuccessMessageForAssetArchived);
      } else {
        this.isNewAsset = false;
        this.toastrMessage = assetTriggeredAction.asset.assetName + " " +
          this.translateService.instant(ConstantVariables.SuccessMessageForAssetUpdated);
      }
      return this.assetService
        .upsertAssetDetails(assetTriggeredAction.asset)
        .pipe(map((assetId: any) => {
          if (assetId.success === true) {
            assetTriggeredAction.asset.assetId = assetId.data;
            return new CreateAssetsCompleted(assetId.data);
          } else {
            return new CreateAssetsFailed(assetId.apiResponseMessages);
          }
        }),
          catchError((error) => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertAssetSuccessfulAndLoadAssets$: Observable<Action> = this.actions$.pipe(
    ofType<CreateAssetsCompleted>(AssetsActionTypes.CreateAssetsCompleted),
    switchMap((searchAction) => {
      return of(new GetAssetByIdTriggered(searchAction.assetId))
    })
  );

  @Effect()
  upsertAssetSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<CreateAssetsCompleted>(AssetsActionTypes.CreateAssetsCompleted),
    pipe(map(() => new SnackbarOpen({
      message: this.toastrMessage, // TODO: Change to proper toast message
      action: this.translateService.instant(ConstantVariables.success)
    })
    )
    )
  );

  @Effect()
  getAssetById$: Observable<Action> = this.actions$.pipe(
    ofType<GetAssetByIdTriggered>(AssetsActionTypes.GetAssetByIdTriggered),
    switchMap((searchAction) => {
      this.assetIdToBeRemoved = searchAction.assetId;
      let getAssetDetailsByIdModel = new AssetInputModel();
      getAssetDetailsByIdModel = JSON.parse(JSON.stringify(this.assetSearchResult));
      getAssetDetailsByIdModel.pageNumber = 1;
      getAssetDetailsByIdModel.assetId = searchAction.assetId;
      return this.assetService
        .getAssetById(getAssetDetailsByIdModel)
        .pipe(map((asset: any) => {
          if (asset.success === true) {
            return new GetAssetByIdCompleted(asset.data);
          } else {
            return new GetAssetByIdFailed(asset.apiResponseMessages);
          }
        }),
          catchError((error) => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertAssetSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<GetAssetByIdCompleted>(AssetsActionTypes.GetAssetByIdCompleted),
    switchMap((searchAction) => {
      if (this.isNewAsset) {
        return of(new RefreshAssetsList(searchAction.asset));
      } else if (searchAction.asset[0]) {
        return of(new CreateAssetCompletedWithInPlaceUpdate({
          assetUpdate: {
            id: searchAction.asset[0].assetId,
            changes: searchAction.asset[0]
          }
        }))
      } else {
        return of(new RemoveAssetsFromTheList(this.assetIdToBeRemoved));
      }
    })
  );

  @Effect()
  showValidationMessagesForLoadAssetsFailed$: Observable<Action> = this.actions$.pipe(
    ofType<LoadAssetsFailed>(AssetsActionTypes.LoadAssetsFailed),
    switchMap((searchAction) => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForCreateAssetsFailed$: Observable<Action> = this.actions$.pipe(
    ofType<CreateAssetsFailed>(AssetsActionTypes.CreateAssetsFailed),
    switchMap((searchAction) => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForGetAssetByIdFailed$: Observable<Action> = this.actions$.pipe(
    ofType<GetAssetByIdFailed>(AssetsActionTypes.GetAssetByIdFailed),
    switchMap((searchAction) => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages
      })
      )
    })
  );

  @Effect()
  selectedAssetAfterLoadAssets$: Observable<Action> = this.actions$.pipe(
    ofType<LoadAssetsCompleted>(AssetsActionTypes.LoadAssetsCompleted),
    switchMap((searchAction) => {
      if (searchAction.assetsList.length > 0) {
        return of(new GetSelectedAssetTriggered(searchAction.assetsList[0].assetId));
      } else {
        return of(new GetSelectedAssetCompleted(""));
      }
    })
  );

  @Effect()
  assetCountAfterLoadAssetsCompleted$: Observable<Action> = this.actions$.pipe(
    ofType<LoadAssetsCompleted>(AssetsActionTypes.LoadAssetsCompleted),
    switchMap((searchAction) => {
      if (searchAction.assetsList.length > 0) {
        return of(new AssetsTotalCountCompleted(searchAction.assetsList[0].totalCount));
      } else {
        return of(new AssetsTotalCountCompleted(searchAction.assetsList.length));
      }
    })
  );

  @Effect()
  selectedAssetAfterUpsertAsset$: Observable<Action> = this.actions$.pipe(
    ofType<GetAssetByIdCompleted>(AssetsActionTypes.GetAssetByIdCompleted),
    switchMap((searchAction) => {
      if (searchAction.asset[0]) {
        return of(new GetSelectedAssetTriggered(searchAction.asset[0].assetId));
      } else {
        return of(new GetSelectedAssetCompleted(""));
      }
    })
  );
  
  @Effect()
  getSelectedAssetTriggered$: Observable<Action> = this.actions$.pipe(
    ofType<GetSelectedAssetTriggered>(AssetsActionTypes.GetSelectedAssetTriggered),
    withLatestFrom(this.store$.pipe(select(assetModuleReducer.getAssetsAll))),
    switchMap(([searchAction, assets]) => {
      if (searchAction.selectedAssetId) {
        return of(new GetSelectedAssetCompleted(searchAction.selectedAssetId));
      } else if (assets.length > 0) {
        return of(new GetSelectedAssetCompleted(assets[0].assetId));
      } else {
        return of(new GetSelectedAssetCompleted(""));
      }
    })
  );

  @Effect()
  assetCountAfterGetAssetByIdCompleted$: Observable<Action> = this.actions$.pipe(
    ofType<GetAssetByIdCompleted>(AssetsActionTypes.GetAssetByIdCompleted),
    switchMap((searchAction) => {
      return of(new AssetsTotalCountTriggered(this.assetSearchResult));
    })
  );

  @Effect()
  totalAssetsCountTriggered$: Observable<Action> = this.actions$.pipe(
    ofType<AssetsTotalCountTriggered>(AssetsActionTypes.AssetsTotalCountTriggered),
    switchMap((searchAction) => {
      return this.assetService
        .getAssetsCount(searchAction.assetsSearchResult)
        .pipe(map((assetsCount: any) => {
          if (assetsCount.success === true) {
            return new AssetsTotalCountCompleted(assetsCount.data);
          } else {
            return new LoadAssetsFailed(assetsCount.apiResponseMessages);
          }
        }),
          catchError((error) => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  exceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(AssetsActionTypes.ExceptionHandled),
    switchMap((searchAction) => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage // TODO: Change to proper toast message
      })
      )
    })
  );

  @Effect()
  removeAssetsFromTheList$: Observable<Action> = this.actions$.pipe(
    ofType<RemoveAssetsFromTheList>(AssetsActionTypes.RemoveAssetsFromTheList),
    withLatestFrom(this.store$.pipe(select(assetModuleReducer.getAssetsAll))),
    switchMap(([searchAction, assets]) => {
      if (assets.length > 0) {
        return of(new GetSelectedAssetCompleted(assets[0].assetId));
      } else {
        return of(new GetSelectedAssetCompleted(""));
      }
    })
  );

  @Effect()
  removeMultipleAssetsIdsCompleted$: Observable<Action> = this.actions$.pipe(
    ofType<RemoveMultipleAssetsIdsCompleted>(AssetsActionTypes.RemoveMultipleAssetsIdsCompleted),
    withLatestFrom(this.store$.pipe(select(assetModuleReducer.getAssetsAll))),
    switchMap(([searchAction, assets]) => {
      if (assets.length > 0) {
        return of(new GetSelectedAssetCompleted(assets[0].assetId));
      } else {
        return of(new GetSelectedAssetCompleted(""));
      }
    })
  );

  @Effect()
  getAssetsByIdsCompleted$: Observable<Action> = this.actions$.pipe(
    ofType<GetAssetsByIdsCompleted>(AssetsActionTypes.GetAssetsByIdsCompleted),
    switchMap((searchAction) => {
      if (searchAction.assetMultipleUpdates.assetMultipleUpdate.length > 0) {
        return of(new GetSelectedAssetCompleted(searchAction.assetMultipleUpdates.assetMultipleUpdate[0].changes.assetId));
      } else {
        return of(new GetSelectedAssetCompleted(""));
      }
    })
  );

  @Effect()
  totalCountAfterRemovingMultipleAssetIds$: Observable<Action> = this.actions$.pipe(
    ofType<RemoveMultipleAssetsIdsCompleted>(AssetsActionTypes.RemoveMultipleAssetsIdsCompleted),
    switchMap((searchAction) => {
      return of(new AssetsTotalCountTriggered(this.assetSearchResult));
    })
  );

  @Effect()
  getAssetsByIdsTriggered$: Observable<Action> = this.actions$.pipe(
    ofType<GetAssetsByIdsTriggered>(AssetsActionTypes.GetAssetsByIdsTriggered),
    switchMap((searchAction) => {
      return this.assetService
        .getAllAssets(searchAction.assetsSearchResult)
        .pipe(map((assetsList: any) => {
          if (assetsList.success === true) {
            const UpdatedAssetsList = this.convertUserStoriesToJson(assetsList.data);
            if (searchAction.assetsSearchResult.activeAssignee) {
              if (UpdatedAssetsList.length > 0) {
                return new GetAssetsByIdsCompleted({
                  assetMultipleUpdate: UpdatedAssetsList
                });
              } else {
                const assetIdsArray = searchAction.assetsSearchResult.assetIds.split(",");
                return new RemoveMultipleAssetsIdsCompleted(assetIdsArray);
              }
            }
          } else {
            return new GetAssetsByIdsFailed(assetsList.apiResponseMessages);
          }
        }),
          catchError((error) => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  convertUserStoriesToJson(assets) {
    const assetUpdates = [];
    assets.forEach((element) => {
      const assetUpdatesModel = new AssetUpdates();
      assetUpdatesModel.id = element.assetId;
      assetUpdatesModel.changes = element;
      assetUpdates.push(assetUpdatesModel);
    });
    return assetUpdates;
  }

  constructor(
    private actions$: Actions,
    private assetService: AssetService,
    private store$: Store<State>,
    private translateService: TranslateService
  ) { }
}
