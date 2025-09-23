import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of, empty } from "rxjs";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";

import { EmployeeService } from "../../services/employee-service";

import { State } from "../reducers/index";
import * as hrManagementModuleReducer from "../reducers/index";

import { LoadContractTypeTriggered, LoadContractTypeCompleted, LoadContractTypeFailed, ExceptionHandled, ContractTypeActionTypes } from "../actions/contract-type.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()
export class ContractTypeEffects {
    @Effect()
    loadContractTypeList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadContractTypeTriggered>(ContractTypeActionTypes.LoadContractTypeTriggered),
        withLatestFrom(this.store$.pipe(select(hrManagementModuleReducer.getContractTypeAll))),
        switchMap(([searchAction, contractType]) => {
            if (contractType && contractType.length > 0) {
                console.log("Contract type list is already in cache.");
                return empty();
            }
            else {
                return this.employeeService
                    .getContractTypes(searchAction.contractTypeSearchResult)
                    .pipe(
                        map((contractTypeList: any) => {
                            if (contractTypeList.success === true) {
                                return new LoadContractTypeCompleted(contractTypeList.data);
                            } else {
                                return new LoadContractTypeFailed(contractTypeList.apiResponseMessages);
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
    showValidationMessagesForContractType$: Observable<Action> = this.actions$.pipe(
        ofType<LoadContractTypeFailed>(ContractTypeActionTypes.LoadContractTypeFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    exceptionHandledForContractType$: Observable<Action> = this.actions$.pipe(
        ofType<ExceptionHandled>(ContractTypeActionTypes.ExceptionHandled),
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