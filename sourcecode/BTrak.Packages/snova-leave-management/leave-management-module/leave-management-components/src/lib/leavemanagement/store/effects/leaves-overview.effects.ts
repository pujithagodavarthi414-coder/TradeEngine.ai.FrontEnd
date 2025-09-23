import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { ExceptionHandled } from "../actions/leave-applicability.actions";
import { LoadLeavesOverviewTriggered, LoadLeavesOverviewCompleted, LoadLeavesOverviewFailed, LeaveOverviewActionTypes } from "../actions/leave-overview.action";
import { ShowValidationMessages, ShowExceptionMessages } from "../actions/notification-validator.action";
import { LeavesService } from "../../services/leaves-service";
@Injectable()
export class LeavesOverviewEffects {
    exceptionMessage: any;

    @Effect()
    loadLeavesList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLeavesOverviewTriggered>(LeaveOverviewActionTypes.LoadLeavesOverviewTriggered),
        switchMap(searchAction => {
            return this.leaveManagementService.getLeaveOverviewReport(searchAction.leavesSearchModel)
                .pipe(map((leavesOverviewList: any) => {
                    if (leavesOverviewList.success === true) {
                        return new LoadLeavesOverviewCompleted(leavesOverviewList.data);
                    } else {
                        return new LoadLeavesOverviewFailed(leavesOverviewList.apiResponseMessages);
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
        ofType<LoadLeavesOverviewFailed>(LeaveOverviewActionTypes.LoadLeavesOverviewFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );


    @Effect()
    exceptionHandled$: Observable<Action> = this.actions$.pipe(
        ofType<ExceptionHandled>(LeaveOverviewActionTypes.ExceptionHandled),
        pipe(
            map(() => new ShowExceptionMessages({
                message: this.exceptionMessage.message,
            })
            )
        )
    );

    constructor(
        private actions$: Actions,
        private leaveManagementService: LeavesService
    ) { }
}