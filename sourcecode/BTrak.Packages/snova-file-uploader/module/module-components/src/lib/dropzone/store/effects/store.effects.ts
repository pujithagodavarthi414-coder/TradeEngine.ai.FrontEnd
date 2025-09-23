import { Injectable } from "@angular/core";
import { switchMap, map, catchError } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";

import { StoreSearchModel } from "../../models/store-search-model";

import { StoreActionTypes, LoadStoreTriggered, LoadStoreCompleted, LoadStoreFailed, CreateStoreTriggered, CreateStoreCompleted, DeleteStoreCompleted, CreateStoreFailed, GetStoreByIdTriggered, GetStoreByIdCompleted, UpdateStoreById, RefreshStoreList, ExceptionHandled } from "../actions/store.actions";
import { StoreManagementService } from '../../services/store-management.service';
import { ShowExceptionMessages, ShowValidationMessages } from '../actions/notification-validator.action';

@Injectable()
export class StoreEffects {
    isNewStore: boolean;
    toastrMessage: string;

    @Effect()
    loadStore$: Observable<Action> = this.actions$.pipe(
        ofType<LoadStoreTriggered>(StoreActionTypes.LoadStoreTriggered),
        switchMap(searchAction => {
            return this.storeManagementService
                .getStores(searchAction.storeSearchModel)
                .pipe(map((StoreList: any) => {
                    if (StoreList.success === true)
                        return new LoadStoreCompleted(StoreList.data);
                    else
                        return new LoadStoreFailed(StoreList.apiResponseMessages);
                }),
                    catchError(error => {
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    upsertStore$: Observable<Action> = this.actions$.pipe(
        ofType<CreateStoreTriggered>(StoreActionTypes.CreateStoreTriggered),
        switchMap(searchAction => {
            if (searchAction.upsertStoreModel.storeId === null || searchAction.upsertStoreModel.storeId === '' || searchAction.upsertStoreModel.storeId === undefined) {
                this.isNewStore = true;
                // this.toastrMessage = this.translateService.instant(ConstantVariables.StoreCreatedSuccessfully);
            } else if (
                searchAction.upsertStoreModel.storeId !== undefined &&
                searchAction.upsertStoreModel.isArchived === true
            ) {
                this.isNewStore = false;
                // this.toastrMessage = this.translateService.instant(ConstantVariables.StoreDeletedSuccessfully);
            } else {
                this.isNewStore = false;
                // this.toastrMessage = this.translateService.instant(ConstantVariables.StoreUpdatedSuccessfully);
            }
            return this.storeManagementService
                .upsertStore(searchAction.upsertStoreModel)
                .pipe(
                    map((result: any) => {
                        if (result.success === true) {
                            if (searchAction.upsertStoreModel.isArchived)
                                return new DeleteStoreCompleted(result.data);
                            else
                                return new CreateStoreCompleted(result.data);
                        } else {
                            return new CreateStoreFailed(result.apiResponseMessages);
                        }
                    }),
                    catchError(error => {
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    upsertStoreSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<CreateStoreCompleted>(StoreActionTypes.CreateStoreCompleted),
        switchMap(searchAction => {
            const storeModel = new StoreSearchModel;
            storeModel.storeId = searchAction.upsertedStoreId
            return of(new GetStoreByIdTriggered(storeModel));
        })
    );
    
    @Effect()
    getStoreById$: Observable<Action> = this.actions$.pipe(
        ofType<GetStoreByIdTriggered>(StoreActionTypes.GetStoreByIdTriggered),
        switchMap(searchAction => {
            return this.storeManagementService
                .getStores(searchAction.getStoreByIdSearchModel)
                .pipe(map((StoreData: any) => {
                    if (StoreData.success === true) {
                        return new GetStoreByIdCompleted(StoreData.data[0]);
                    } else {
                        return new CreateStoreFailed(
                            StoreData.apiResponseMessages
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
    getStoreByIdSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<GetStoreByIdCompleted>(StoreActionTypes.GetStoreByIdCompleted),
        switchMap(searchAction => {
            if (this.isNewStore) {
                return of(new RefreshStoreList(searchAction.getStoreByIdStoreModel));
            } else {
                return of(new UpdateStoreById({
                    storeDetailsUpdate: {
                        id: searchAction.getStoreByIdStoreModel.storeId,
                        changes: searchAction.getStoreByIdStoreModel
                    }
                }));
            }
        })
    );

    @Effect()
    showValidationMessagesForLoadStore$: Observable<Action> = this.actions$.pipe(
        ofType<LoadStoreFailed>(StoreActionTypes.LoadStoreFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForCreateStore$: Observable<Action> = this.actions$.pipe(
        ofType<CreateStoreFailed>(StoreActionTypes.CreateStoreFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    exceptionHandled$: Observable<Action> = this.actions$.pipe(
        ofType<ExceptionHandled>(StoreActionTypes.ExceptionHandled),
        switchMap(searchAction => {
            return of(new ShowExceptionMessages({
                message: searchAction.errorMessage, // TODO: Change to proper toast message
            })
            )
        })
    );

    constructor(
        private actions$: Actions,
        private storeManagementService: StoreManagementService,
        private translateService: TranslateService
    ) { }
}