import { Injectable } from "@angular/core";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";
import { Observable, of, empty } from "rxjs";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Action, select, Store } from "@ngrx/store";

import { State } from "../../store/reducers/index";
import * as hrManagementModuleReducer from "../../store/reducers/index";

import { StoreConfigurationActionTypes, LoadStoreConfigurationsTriggered, LoadStoreConfigurationsCompleted, LoadStoreConfigurationsFailed, ExceptionHandled } from "../actions/store-configurations.actions";

import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { EmployeeService } from '../../services/employee-service';

@Injectable()
export class StoreConfigurationEffects {

    @Effect()
    loadStoreConfigurations$: Observable<Action> = this.actions$.pipe(
        ofType<LoadStoreConfigurationsTriggered>(StoreConfigurationActionTypes.LoadStoreConfigurationsTriggered),
        withLatestFrom(this.store.pipe(select(hrManagementModuleReducer.getStoreConfigurationAll))),
        switchMap(([searchAction, storeConfiguration]) => {
            if (storeConfiguration && storeConfiguration.length > 0) {
                console.log("store configuration settings is already in cache.");
                return empty();
            } else {
                return this.employeeService
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
        private employeeService: EmployeeService,
        private store: Store<State>
    ) { }
}
