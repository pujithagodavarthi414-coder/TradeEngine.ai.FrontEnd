import { Injectable } from "@angular/core";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";
import { Observable, of , EMPTY} from "rxjs";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Action, select, Store } from "@ngrx/store";

import { StoreManagementService } from "../../services/store-management.service";

import { StoreConfigurationActionTypes, LoadStoreConfigurationsTriggered, LoadStoreConfigurationsCompleted, LoadStoreConfigurationsFailed, ExceptionHandled } from "../actions/store-configurations.actions";

import * as CommonState  from "../../store/reducers/index";
import * as commonModuleReducer from '../../store/reducers/index';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()
export class StoreConfigurationEffects {

    @Effect()
    loadStoreConfigurations$: Observable<Action> = this.actions$.pipe(
        ofType<LoadStoreConfigurationsTriggered>(StoreConfigurationActionTypes.LoadStoreConfigurationsTriggered),
        withLatestFrom(this.commonStore$.pipe(select(commonModuleReducer.getStoreConfigurationAll))),
        switchMap(([searchAction, storeConfiguration]) => {
            if (storeConfiguration && storeConfiguration.length > 0) {
                console.log("store configuration settings is already in cache.");
                return EMPTY;
            } else {
                return this.storeManagementService
                    .getStoreConfiguration()
                    .pipe(map((response: any) => {
                        if (response.success === true) {
                            return new LoadStoreConfigurationsCompleted(response.data);
                        } else {
                            return new LoadStoreConfigurationsFailed(
                                response.apiResponseMessages
                            );
                        }
                    }),
                        catchError((error) => {
                            return of(new ExceptionHandled(error));
                        })
                    );
            }
        })
    );

    @Effect()
    showValidationMessagesForLoadStoreConfigurationFailed$: Observable<Action> = this.actions$.pipe(
        ofType<LoadStoreConfigurationsFailed>(StoreConfigurationActionTypes.LoadStoreConfigurationsFailed),
        switchMap((searchAction) => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages
            })
            )
        })
    );

    @Effect()
    exceptionHandled$: Observable<Action> = this.actions$.pipe(
        ofType<ExceptionHandled>(StoreConfigurationActionTypes.ExceptionHandled),
        switchMap((searchAction) => {
            return of(new ShowExceptionMessages({
                message: searchAction.errorMessage // TODO: Change to proper toast message
            })
            )
        })
    );

    constructor(
        private actions$: Actions,
        private commonStore$: Store<CommonState.State>,
        private storeManagementService: StoreManagementService
    ) { }
}
