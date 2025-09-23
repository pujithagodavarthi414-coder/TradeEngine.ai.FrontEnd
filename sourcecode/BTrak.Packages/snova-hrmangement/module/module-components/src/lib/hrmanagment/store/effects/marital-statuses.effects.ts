import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of, empty } from "rxjs";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";

import { EmployeeService } from "../../services/employee-service";

import { State } from "../reducers/index";
import * as hrManagementModuleReducer from "../reducers/index";

import { MaritalStatusesActionTypes, LoadMaritalStatusesTriggered, LoadMaritalStatusesCompleted, LoadMaritalStatusesFailed, MaritalExceptionHandled } from "../actions/marital-statuses.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()
export class MaritalStatusesEffects {
    @Effect()
    loadMaritalStatusesList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMaritalStatusesTriggered>(MaritalStatusesActionTypes.LoadMaritalStatusesTriggered),
        withLatestFrom(this.store$.pipe(select(hrManagementModuleReducer.getMaritalStatusesAll))),
        switchMap(([searchAction, maritalStatuses]) => {
            if (maritalStatuses && maritalStatuses.length > 0) {
                console.log("marital statuses list is already in cache.");
                return empty();
            }
            else {
                return this.employeeService
                    .getMaritalStatuses(searchAction.maritalStatusesSearchResult)
                    .pipe(
                        map((maritalStatusesList: any) => {
                            if (maritalStatusesList.success === true) {
                                return new LoadMaritalStatusesCompleted(maritalStatusesList.data);
                            } else {
                                return new LoadMaritalStatusesFailed(maritalStatusesList.apiResponseMessages);
                            }
                        }),
                        catchError(error => {
                            return of(new MaritalExceptionHandled(error));
                        })
                    );
            }
        })
    );

    @Effect()
    showValidationMessagesForLoadMaritalStatusesFailed$: Observable<Action> = this.actions$.pipe(
        ofType<LoadMaritalStatusesFailed>(MaritalStatusesActionTypes.LoadMaritalStatusesFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    exceptionHandled$: Observable<Action> = this.actions$.pipe(
        ofType<MaritalExceptionHandled>(MaritalStatusesActionTypes.MaritalExceptionHandled),
        switchMap(searchAction => {
            return of(new ShowExceptionMessages({
                message: searchAction.errorMessage, // TODO: Change to proper toast message
            })
            )
        })
    );

    constructor(
        private actions$: Actions,
        private store$: Store<State>,
        private employeeService: EmployeeService
    ) { }
}