import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of, empty } from "rxjs";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";

import { EmployeeService } from "../../services/employee-service";

import { State } from "../reducers/index";
import * as hrManagementModuleReducer from "../reducers/index";

import { LanguagesActionTypes, LoadLanguagesTriggered, LoadLanguagesCompleted, LoadLanguagesFailed, ExceptionHandled } from "../actions/languages.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()
export class LanguagesEffects {
    @Effect()
    loadLanguagesList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLanguagesTriggered>(LanguagesActionTypes.LoadLanguagesTriggered),
        withLatestFrom(this.store$.pipe(select(hrManagementModuleReducer.getLanguagesAll))),
        switchMap(([searchAction, languages]) => {
            if (languages && languages.length > 0) {
                console.log("languages list is already in cache.");
                return empty();
            }
            else {
                return this.employeeService
                    .getAllLanguages(searchAction.languagesSearchResult)
                    .pipe(
                        map((languagesList: any) => {
                            if (languagesList.success === true) {
                                return new LoadLanguagesCompleted(languagesList.data);
                            } else {
                                return new LoadLanguagesFailed(languagesList.apiResponseMessages);
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
    showValidationMessagesForLanguages$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLanguagesFailed>(LanguagesActionTypes.LoadLanguagesFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    exceptionHandledForLanguages$: Observable<Action> = this.actions$.pipe(
        ofType<ExceptionHandled>(LanguagesActionTypes.ExceptionHandled),
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