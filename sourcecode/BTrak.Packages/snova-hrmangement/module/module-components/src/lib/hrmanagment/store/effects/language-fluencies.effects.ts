import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of, empty } from "rxjs";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";

import { EmployeeService } from "../../services/employee-service";

import { State } from "../reducers/index";
import * as hrManagementModuleReducer from "../reducers/index";

import { LanguageFluencyActionTypes, LoadLanguageFluencyTriggered, LoadLanguageFluencyCompleted, LoadLanguageFluencyFailed, ExceptionHandled } from "../actions/language-fluencies.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()
export class LanguageFluencyEffects {
    @Effect()
    loadLanguageFluencyList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLanguageFluencyTriggered>(LanguageFluencyActionTypes.LoadLanguageFluencyTriggered),
        withLatestFrom(this.store$.pipe(select(hrManagementModuleReducer.getLanguageFluenciesAll))),
        switchMap(([searchAction, languageFluencies]) => {
            if (languageFluencies && languageFluencies.length > 0) {
                console.log("language fluency list is already in cache.");
                return empty();
            }
            else {
                return this.employeeService
                    .getAllLanguageFluencies(searchAction.languageFluencySearchResult)
                    .pipe(
                        map((languagesList: any) => {
                            if (languagesList.success === true) {
                                return new LoadLanguageFluencyCompleted(languagesList.data);
                            } else {
                                return new LoadLanguageFluencyFailed(languagesList.apiResponseMessages);
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
    showValidationMessagesForLanguageFluency$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLanguageFluencyFailed>(LanguageFluencyActionTypes.LoadLanguageFluencyFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    exceptionHandledForLanguageFluency$: Observable<Action> = this.actions$.pipe(
        ofType<ExceptionHandled>(LanguageFluencyActionTypes.ExceptionHandled),
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