import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of, empty } from "rxjs";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";

import { EmployeeService } from "../../services/employee-service";

import { State } from "../reducers/index";
import * as hrManagementModuleReducer from "../reducers/index";

import { CompetencyActionTypes, LoadCompetencyTriggered, LoadCompetencyCompleted, LoadCompetencyFailed, ExceptionHandled } from "../actions/competency.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()
export class CompetencyEffects {
    @Effect()
    loadCompetencyList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadCompetencyTriggered>(CompetencyActionTypes.LoadCompetencyTriggered),
        withLatestFrom(this.store$.pipe(select(hrManagementModuleReducer.getCompetenciesAll))),
        switchMap(([searchAction, competencies]) => {
            if (competencies && competencies.length > 0) {
                console.log("competencies list is already in cache.");
                return empty();
            }
            else {
                return this.employeeService
                    .getAllCompetencies(searchAction.competencySearchResult)
                    .pipe(
                        map((competenciesList: any) => {
                            if (competenciesList.success === true) {
                                return new LoadCompetencyCompleted(competenciesList.data);
                            } else {
                                return new LoadCompetencyFailed(competenciesList.apiResponseMessages);
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
    showValidationMessagesForCompetency$: Observable<Action> = this.actions$.pipe(
        ofType<LoadCompetencyFailed>(CompetencyActionTypes.LoadCompetencyFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    exceptionHandledForCompetency$: Observable<Action> = this.actions$.pipe(
        ofType<ExceptionHandled>(CompetencyActionTypes.ExceptionHandled),
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