import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of, empty } from "rxjs";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";

import { EmployeeService } from "../../services/employee-service";

import { State } from "../reducers/index";
import * as hrManagementModuleReducer from "../reducers/index";

import { NationalitiesActionTypes, LoadNationalitiesTriggered, LoadNationalitiesCompleted, LoadNationalitiesFailed, ExceptionHandled } from "../actions/nationalities.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';


@Injectable()
export class NationalitiesEffects {
    @Effect()
    loadNationalitiesList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadNationalitiesTriggered>(NationalitiesActionTypes.LoadNationalitiesTriggered),
        withLatestFrom(this.store$.pipe(select(hrManagementModuleReducer.getNationalitiesAll))),
        switchMap(([searchAction, nationalities]) => {
            if (nationalities && nationalities.length > 0) {
                console.log("nationalities list is already in cache.");
                return empty();
            }
            else {
                return this.employeeService
                    .getAllNationalities(searchAction.nationalitiesSearchResult)
                    .pipe(
                        map((nationalitiesList: any) => {
                            if (nationalitiesList.success === true) {
                                return new LoadNationalitiesCompleted(nationalitiesList.data);
                            } else {
                                return new LoadNationalitiesFailed(nationalitiesList.apiResponseMessages);
                            }
                        }),
                        catchError(error => {
                            return of(new ExceptionHandled(error));
                        })
                    );
            }
        })
    );

    @Effect()
    showValidationMessagesForLoadNationalitiesFailed$: Observable<Action> = this.actions$.pipe(
        ofType<LoadNationalitiesFailed>(NationalitiesActionTypes.LoadNationalitiesFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    exceptionHandled$: Observable<Action> = this.actions$.pipe(
        ofType<ExceptionHandled>(NationalitiesActionTypes.ExceptionHandled),
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