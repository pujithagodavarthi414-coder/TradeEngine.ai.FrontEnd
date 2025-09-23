import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";

import { EmployeeService } from "../../services/employee-service";

import { State } from "../reducers/index";
import * as hrManagementModuleReducer from "../reducers/index";

import { LoadJobCategoryTriggered, LoadJobCategoryCompleted, LoadJobCategoryFailed, JobCategoryActionTypes, ExceptionHandled } from "../actions/job-category.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()
export class JobCategoryEffects {
    @Effect()
    loadJobCategoryList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadJobCategoryTriggered>(JobCategoryActionTypes.LoadJobCategoryTriggered),
        withLatestFrom(this.store$.pipe(select(hrManagementModuleReducer.getJobCategoryAll))),
        switchMap(([searchAction, jobCategory]) => {
            // if (jobCategory && jobCategory.length > 0) {
            //     console.log("Job category list is already in cache.");
            //     return Observable.empty();
            // }
            // else {
                return this.employeeService
                    .getJobCategoryDetails(searchAction.jobCategorySearchResult)
                    .pipe(
                        map((jobCategoryList: any) => {
                            if (jobCategoryList.success === true) {
                                return new LoadJobCategoryCompleted(jobCategoryList.data);
                            } else {
                                return new LoadJobCategoryFailed(jobCategoryList.apiResponseMessages);
                            }
                        }),
                        catchError(error => {
                            return of(new ExceptionHandled(error));
                        })
                    );
            //}
        })
    );

    @Effect()
    showValidationMessagesForJobCategory$: Observable<Action> = this.actions$.pipe(
        ofType<LoadJobCategoryFailed>(JobCategoryActionTypes.LoadJobCategoryFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    exceptionHandledForJobCategory$: Observable<Action> = this.actions$.pipe(
        ofType<ExceptionHandled>(JobCategoryActionTypes.ExceptionHandled),
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