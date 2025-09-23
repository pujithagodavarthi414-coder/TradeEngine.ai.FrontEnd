import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { LoadLeaveTypesTriggered, LoadLeaveTypesCompleted, LoadLeaveTypesFailed, AddNewLeaveTypeFailed, AddNewLeaveTypeCompleted, AddNewLeaveTypeTriggered, LeaveTypeActionTypes, LoadLeaveTypeByIdTriggered, LoadLeaveTypeByIdCompleted, LoadLeaveTypeByIdFailed, UpdateLeaveTypeTriggered, UpdateLeaveTypeCompleted, UpdateLeaveTypeFailed, ExceptionHandled } from "../actions/leave-types.actions";
import { ShowExceptionMessages, ShowValidationMessages } from "../actions/notification-validator.action";
import { LeavesService } from "../../services/leaves-service";


@Injectable()
export class LeaveFrequencyEffects {
    exceptionMessage: any;

    @Effect()
    loadLeaveTypesList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLeaveTypesTriggered>(LeaveTypeActionTypes.LoadLeaveTypesTriggered),
        switchMap(searchAction => {
            return this.leaveManagementService.getAllLeaveTypes(searchAction.leaveTypeSearchModel)
                .pipe(map((leaveTypesList: any) => {
                    if (leaveTypesList.success === true) {
                        return new LoadLeaveTypesCompleted(leaveTypesList.data);
                    } else {
                        return new LoadLeaveTypesFailed(leaveTypesList.apiResponseMessages);
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
    loadLeaveTypeById$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLeaveTypeByIdTriggered>(LeaveTypeActionTypes.LoadLeaveTypeByIdTriggered),
        switchMap(searchAction => {
            return this.leaveManagementService.getAllLeaveTypes(searchAction.leaveTypeSearchModel)
                .pipe(map((leaveTypesList: any) => {
                    if (leaveTypesList.success === true) {
                        return new LoadLeaveTypeByIdCompleted(leaveTypesList.data);
                    } else {
                        return new LoadLeaveTypeByIdFailed(leaveTypesList.apiResponseMessages);
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
    upsertLeaveType$: Observable<Action> = this.actions$.pipe(
        ofType<AddNewLeaveTypeTriggered>(LeaveTypeActionTypes.AddNewLeaveTypeTriggered),
        switchMap(searchAction => {
            return this.leaveManagementService.upsertLeaveType(searchAction.leaveTypeInputModel)
                .pipe(map((leaveFrequencyId: any) => {
                    if (leaveFrequencyId.success === true) {
                        return new AddNewLeaveTypeCompleted(leaveFrequencyId.data);
                    } else {
                        return new AddNewLeaveTypeFailed(leaveFrequencyId.apiResponseMessages);
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
    upsertExistingLeaveType$: Observable<Action> = this.actions$.pipe(
        ofType<UpdateLeaveTypeTriggered>(LeaveTypeActionTypes.UpdateLeaveTypeTriggered),
        switchMap(searchAction => {
            return this.leaveManagementService.upsertLeaveType(searchAction.leaveTypeInputModel)
                .pipe(map((leaveFrequencyId: any) => {
                    if (leaveFrequencyId.success === true) {
                        return new UpdateLeaveTypeCompleted(leaveFrequencyId.data);
                    } else {
                        return new UpdateLeaveTypeFailed(leaveFrequencyId.apiResponseMessages);
                    }
                }),
                    catchError(error => {
                        this.exceptionMessage = error;
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    );

    // @Effect()
    // getLeaveDetailsByIdAfterSuccessful$: Observable<Action> = this.actions$.pipe(
    //   ofType<AddNewLeaveTypeCompleted>(LeaveTypeActionTypes.AddNewLeaveTypeCompleted),
    //   switchMap(searchAction => {
    //     let leaveFrequencyTypeSearchInputModel = new LeaveFrequencyTypeSearchInputModel();
    //     leaveFrequencyTypeSearchInputModel.leaveTypeId = searchAction.leaveTypeId;
    //     return of(new LoadLeaveTypeByIdTriggered(leaveFrequencyTypeSearchInputModel));
    //   })
    // );

    @Effect()
    exceptionHandled$: Observable<Action> = this.actions$.pipe(
        ofType<ExceptionHandled>(LeaveTypeActionTypes.ExceptionHandled),
        pipe(
            map(() => new ShowExceptionMessages({
                message: this.exceptionMessage.message,
            })
            )
        )
    );

    @Effect()
    showValidationMessagesForLeaveTypesList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLeaveTypesFailed>(LeaveTypeActionTypes.LoadLeaveTypesFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForLeaveTypeById$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLeaveTypeByIdFailed>(LeaveTypeActionTypes.LoadLeaveTypeByIdFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForAddNewLeaveType$: Observable<Action> = this.actions$.pipe(
        ofType<AddNewLeaveTypeFailed>(LeaveTypeActionTypes.AddNewLeaveTypeFailed),
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