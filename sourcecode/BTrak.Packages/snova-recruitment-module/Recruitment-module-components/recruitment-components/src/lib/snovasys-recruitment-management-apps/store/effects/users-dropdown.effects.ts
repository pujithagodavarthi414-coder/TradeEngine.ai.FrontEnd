import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { switchMap, map, catchError } from 'rxjs/operators';
import { LoadUsersDropDownTriggered, UsersActionTypes, LoadUsersDropDownCompleted, LoadUsersDropDownFailed } from '../actions/users-dropdown.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { RecruitmentService } from '../../services/recruitment.service';
import { ExceptionHandled } from '../../../snovasys-recruitment-management-apps/store/actions/users-dropdown.actions';

@Injectable()
export class UsersEffects {
    @Effect()
    loadUsersDropDownList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadUsersDropDownTriggered>(UsersActionTypes.LoadUsersDropDownTriggered),
        switchMap(searchAction => {
            return this.recruitmentService
                .getUsersDropDown(searchAction.searchText)
                .pipe(
                    map((usersList: any) => {
                        if (usersList.success === true) {
                            return new LoadUsersDropDownCompleted(usersList.data);
                        } else {
                            return new LoadUsersDropDownFailed(usersList.apiResponseMessages);
                        }
                    }),
                    catchError(error => {
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    showValidationMessagesForLoadUsersDropDown$: Observable<Action> = this.actions$.pipe(
        ofType<LoadUsersDropDownFailed>(UsersActionTypes.LoadUsersDropDownFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            );
        })
    );

    @Effect()
    exceptionHandledForLoadUsersDropDown$: Observable<Action> = this.actions$.pipe(
        ofType<ExceptionHandled>(UsersActionTypes.ExceptionHandled),
        switchMap(searchAction => {
            return of(new ShowExceptionMessages({
                message: searchAction.errorMessage, // TODO: Change to proper toast message
            })
            );
        })
    );

    constructor(
        private actions$: Actions,
        private recruitmentService: RecruitmentService
    ) { }
}
