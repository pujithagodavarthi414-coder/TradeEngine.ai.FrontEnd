import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { ShowExceptionMessages, ShowValidationMessages } from "../actions/notification-validator.action";
import {
    LoadLeavesCompleted, LoadLeavesFailed, MyLeavesActionTypes, LoadLeavesTriggered, ExceptionHandled,
    AddNewLeaveFailed, AddNewLeaveCompleted, AddNewLeaveTriggered
} from "../actions/myleaves-myprofile.action";
import { DashboardService } from '../../services/dashboard.service';


@Injectable()
export class MyLeavesEffects {
    exceptionMessage: any;

    @Effect()
    loadLeavesList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLeavesTriggered>(MyLeavesActionTypes.LoadLeavesTriggered),
        switchMap(searchAction => {
            return this.dashboardService.searchLeaves(searchAction.leavesSearchModel)
                .pipe(map((leavesList: any) => {
                    if (leavesList.success === true) {
                        return new LoadLeavesCompleted(leavesList.data);
                    } else {
                        return new LoadLeavesFailed(leavesList.apiResponseMessages);
                    }
                }),
                    catchError(error => {
                        this.exceptionMessage = error;
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    upsertLeave$: Observable<Action> = this.actions$.pipe(
        ofType<AddNewLeaveTriggered>(MyLeavesActionTypes.AddNewLeaveTriggered),
        switchMap(searchAction => {
            return this.dashboardService.upsertLeave(searchAction.leavesUpsertModel)
                .pipe(map((leaveId: any) => {
                    if (leaveId.success === true) {
                        return new AddNewLeaveCompleted(leaveId.data);
                    } else {
                        return new AddNewLeaveFailed(leaveId.apiResponseMessages);
                    }
                }),
                    catchError(error => {
                        this.exceptionMessage = error;
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    showValidationMessagesForAddNewLeave$: Observable<Action> = this.actions$.pipe(
        ofType<AddNewLeaveFailed>(MyLeavesActionTypes.AddNewLeaveFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );


    @Effect()
    exceptionHandled$: Observable<Action> = this.actions$.pipe(
        ofType<ExceptionHandled>(MyLeavesActionTypes.ExceptionHandled),
        pipe(
            map(() => new ShowExceptionMessages({
                message: this.exceptionMessage.message,
            })
            )
        )
    );

    @Effect()
    showValidationMessagesForLeavesList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLeavesFailed>(MyLeavesActionTypes.LoadLeavesFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    constructor(
        private actions$: Actions,
        private dashboardService: DashboardService
    ) { }
}