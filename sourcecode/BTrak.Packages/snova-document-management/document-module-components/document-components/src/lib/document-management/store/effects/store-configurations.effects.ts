import { Injectable } from "@angular/core";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Action, select, Store } from "@ngrx/store";
import { StoreConfigurationActionTypes, LoadStoreConfigurationsTriggered, LoadStoreConfigurationsCompleted, LoadStoreConfigurationsFailed, StoreConfigurationExceptionHandled } from "../actions/store-configurations.actions";


import * as CommonState from "../reducers";
import { StoreManagementService } from '../../services/store-management.service';
import { ShowExceptionMessages, ShowValidationMessages } from '../actions/notification-validator.action';

@Injectable()
export class StoreConfigurationEffects {

    @Effect()
    loadStoreConfigurations$: Observable<Action> = this.actions$.pipe(
        ofType<LoadStoreConfigurationsTriggered>(StoreConfigurationActionTypes.LoadStoreConfigurationsTriggered),
        switchMap(searchAction => {
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
                        return of(new StoreConfigurationExceptionHandled(error));
                    })
                );
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
        ofType<StoreConfigurationExceptionHandled>(StoreConfigurationActionTypes.StoreConfigurationExceptionHandled),
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
