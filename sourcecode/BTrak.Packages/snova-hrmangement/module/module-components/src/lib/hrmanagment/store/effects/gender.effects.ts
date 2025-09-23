import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of, empty } from "rxjs";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";

import { EmployeeService } from "../../services/employee-service";

import { State } from "../reducers/index";
import * as hrManagementModuleReducer from "../reducers/index";

import { LoadGendersTriggered, GenderActionTypes, LoadGendersCompleted, GenderExceptionHandled, LoadGenderFailed } from "../actions/gender.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()
export class GenderEffects {
    @Effect()
    loadGenderList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadGendersTriggered>(GenderActionTypes.LoadGendersTriggered),
        withLatestFrom(this.store$.pipe(select(hrManagementModuleReducer.getGenderAll))),
        switchMap(([searchAction, genders]) => {
            if (genders && genders.length > 0) {
                console.log("genders list is already in cache.");
                return empty();
            }
            else {
                return this.employeeService
                    .getGenders(searchAction.genderSearchResult)
                    .pipe(
                        map((genderList: any) => {
                            if (genderList.success === true) {
                                return new LoadGendersCompleted(genderList.data);
                            } else {
                                return new LoadGenderFailed(genderList.apiResponseMessages);
                            }
                        }),
                        catchError(error => {
                            return of(new GenderExceptionHandled(error));
                        })
                    );
            }
        })
    );

    @Effect()
    showValidationMessagesForLoadGenderFailed$: Observable<Action> = this.actions$.pipe(
        ofType<LoadGenderFailed>(GenderActionTypes.LoadGenderFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    exceptionHandled$: Observable<Action> = this.actions$.pipe(
        ofType<GenderExceptionHandled>(GenderActionTypes.GenderExceptionHandled),
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