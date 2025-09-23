import { Injectable } from "@angular/core";
import { Action, select, Store } from "@ngrx/store";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Observable, of, empty } from "rxjs";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";

import { State } from "../reducers/index";
import * as hrManagementModuleReducer from "../reducers/index";

import { LicenceTypesActionTypes, LoadLicenceTypeTriggered, LoadLicenceTypeCompleted, ExceptionHandled, LoadLicenceTypeFailed } from "../actions/licence-types.actions";
import { EmployeeService } from "../../services/employee-service";
import { ShowExceptionMessages, ShowValidationMessages } from '../actions/notification-validator.action';

@Injectable()
export class LicenceTypesEffects {
    @Effect()
    loadLicenceTypesList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLicenceTypeTriggered>(LicenceTypesActionTypes.LoadLicenceTypeTriggered),
        withLatestFrom(this.store$.pipe(select(hrManagementModuleReducer.getLicenceTypeAll))),
        switchMap(([searchAction, licenceTypes]) => {
            if (licenceTypes && licenceTypes.length > 0) {
                console.log("licence types list is already in cache.");
                return empty();
            }
            else {
                return this.employeeService
                    .getLicenceTypes(searchAction.licenceTypesSearchResult)
                    .pipe(
                        map((licenceTypesList: any) => {
                            if (licenceTypesList.success === true) {
                                return new LoadLicenceTypeCompleted(licenceTypesList.data);
                            } else {
                                return new LoadLicenceTypeFailed(licenceTypesList.apiResponseMessages);
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
    showValidationMessagesForLicenceTypes$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLicenceTypeFailed>(LicenceTypesActionTypes.LoadLicenceTypeFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    exceptionHandledForLicenceTypes$: Observable<Action> = this.actions$.pipe(
        ofType<ExceptionHandled>(LicenceTypesActionTypes.ExceptionHandled),
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