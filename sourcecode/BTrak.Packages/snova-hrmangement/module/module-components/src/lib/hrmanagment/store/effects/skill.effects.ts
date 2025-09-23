import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of, empty } from "rxjs";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";

import { EmployeeService } from "../../services/employee-service";

import { State } from "../reducers/index";
import * as hrManagementModuleReducer from "../reducers/index";

import { SkillActionTypes, LoadSkillTriggered, LoadSkillCompleted, LoadSkillFailed, ExceptionHandled } from "../actions/Skill.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()
export class SkillEffects {
    @Effect()
    loadSkillList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadSkillTriggered>(SkillActionTypes.LoadSkillTriggered),
        withLatestFrom(this.store$.pipe(select(hrManagementModuleReducer.getSkillAll))),
        switchMap(([searchAction, Skill]) => {
            if (Skill && Skill.length > 0) {
                console.log("Skill list is already in cache.");
                return empty();
            }
            else {
                return this.employeeService
                    .getAllSkill(searchAction.SkillSearchResult)
                    .pipe(
                        map((SkillList: any) => {
                            if (SkillList.success === true) {
                                return new LoadSkillCompleted(SkillList.data);
                            } else {
                                return new LoadSkillFailed(SkillList.apiResponseMessages);
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
    showValidationMessagesForSkill$: Observable<Action> = this.actions$.pipe(
        ofType<LoadSkillFailed>(SkillActionTypes.LoadSkillFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    exceptionHandledForSkill$: Observable<Action> = this.actions$.pipe(
        ofType<ExceptionHandled>(SkillActionTypes.ExceptionHandled),
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