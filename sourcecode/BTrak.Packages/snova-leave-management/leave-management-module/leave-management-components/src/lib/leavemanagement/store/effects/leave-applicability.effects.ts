import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { LeaveApplicabilityActionTypes, LoadLeaveApplicabilityTriggered, LoadLeaveApplicabilityCompleted, LoadLeaveApplicabilityFailed, ExceptionHandled, AddNewLeaveLeaveApplicabilityTriggered, AddNewLeaveLeaveApplicabilityCompleted, AddNewLeaveLeaveApplicabilityFailed } from "../actions/leave-applicability.actions";
import { LeavesService } from "../../services/leaves-service";
import { ShowExceptionMessages, ShowValidationMessages } from "../actions/notification-validator.action";


@Injectable()
export class LeaveApplicabilityEffects {
    exceptionMessage: any;

    @Effect()
    loadLeaveApplicability$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLeaveApplicabilityTriggered>(LeaveApplicabilityActionTypes.LoadLeaveApplicabilityTriggered),
        switchMap(searchAction => {
            return this.leaveManagementService.getLeaveApplicability(searchAction.leaveApplicabilitySearchModel)
                .pipe(map((leaveTypesList: any) => {
                    if (leaveTypesList.success === true) {
                        return new LoadLeaveApplicabilityCompleted(leaveTypesList.data);
                    } else {
                        return new LoadLeaveApplicabilityFailed(leaveTypesList.apiResponseMessages);
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
    upsertLeaveApplicability$: Observable<Action> = this.actions$.pipe(
        ofType<AddNewLeaveLeaveApplicabilityTriggered>(LeaveApplicabilityActionTypes.AddNewLeaveLeaveApplicabilityTriggered),
        switchMap(searchAction => {
            return this.leaveManagementService.upsertLeaveApplicability(searchAction.leaveFrequencyInputModel)
                .pipe(map((leaveApplicabilityId: any) => {
                    if (leaveApplicabilityId.success === true) {
                        return new AddNewLeaveLeaveApplicabilityCompleted(leaveApplicabilityId.data);
                    } else {
                        return new AddNewLeaveLeaveApplicabilityFailed(leaveApplicabilityId.apiResponseMessages);
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
    showValidationMessagesForAddNewLeaveType$: Observable<Action> = this.actions$.pipe(
        ofType<AddNewLeaveLeaveApplicabilityFailed>(LeaveApplicabilityActionTypes.AddNewLeaveLeaveApplicabilityFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );


    @Effect()
    exceptionHandled$: Observable<Action> = this.actions$.pipe(
        ofType<ExceptionHandled>(LeaveApplicabilityActionTypes.ExceptionHandled),
        pipe(
            map(() => new ShowExceptionMessages({
                message: this.exceptionMessage.message,
            })
            )
        )
    );

    @Effect()
    showValidationMessagesForLeaveTypesList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLeaveApplicabilityFailed>(LeaveApplicabilityActionTypes.LoadLeaveApplicabilityFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    constructor(
        private actions$: Actions,
        private leaveManagementService: LeavesService
    ) { }
}