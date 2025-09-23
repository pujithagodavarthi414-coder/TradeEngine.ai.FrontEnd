import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { ExceptionHandled } from "../actions/leave-applicability.actions";
import { LeavesActionTypes, LoadLeavesTriggered, LoadLeavesCompleted, LoadLeavesFailed, AddNewLeaveTriggered, AddNewLeaveCompleted, AddNewLeaveFailed, LoadLeavesByIdTriggered, LoadLeavesByIdCompleted, UpdateLeaveById } from "../actions/leaves.actions";
import { LeaveModel } from "../../models/leave-model";
import { ShowValidationMessages, ShowExceptionMessages } from "../actions/notification-validator.action";
import { LeavesService } from "../../services/leaves-service";


@Injectable()
export class LeavesEffects {
    exceptionMessage: any;
    leaveModel: LeaveModel;

    @Effect()
    loadLeavesList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLeavesTriggered>(LeavesActionTypes.LoadLeavesTriggered),
        switchMap(searchAction => {
            return this.leaveManagementService.searchLeaves(searchAction.leavesSearchModel)
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
    loadLeavesByIdList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLeavesByIdTriggered>(LeavesActionTypes.LoadLeavesByIdTriggered),
        switchMap(searchAction => {
            const leaveModel = new LeaveModel();
            leaveModel.leaveApplicationId = searchAction.getLeaveById;
            return this.leaveManagementService.searchLeaves(leaveModel)
                .pipe(map((leaveModel: any) => {
                    if (leaveModel.success === true) {
                        return new LoadLeavesByIdCompleted(leaveModel.data[0]);
                    } else {
                        return new LoadLeavesFailed(leaveModel.apiResponseMessages);
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
    leaveUpdate$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLeavesByIdCompleted>(LeavesActionTypes.LoadLeavesByIdCompleted),
        pipe(map((leaveData: any) => {
            return new UpdateLeaveById({
                leaveUpdatedmodel: {
                    id: leaveData.leavesUpsertModel.leaveApplicationId,
                    changes: leaveData.leavesUpsertModel
                }
            });
        })
        )
    );

    @Effect()
    upsertLeave$: Observable<Action> = this.actions$.pipe(
        ofType<AddNewLeaveTriggered>(LeavesActionTypes.AddNewLeaveTriggered),
        switchMap(searchAction => {
            return this.leaveManagementService.upsertLeave(searchAction.leavesUpsertModel)
                .pipe(map((leaveId: any) => {
                    if (leaveId.success === true && !searchAction.leavesUpsertModel.leaveApplicationId) {
                        return new AddNewLeaveCompleted(leaveId.data);
                    }
                    else if (leaveId.success === true && searchAction.leavesUpsertModel.leaveApplicationId) {
                        return new LoadLeavesByIdTriggered(leaveId.data);
                    }
                    else {
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
        ofType<AddNewLeaveFailed>(LeavesActionTypes.AddNewLeaveFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );


    @Effect()
    exceptionHandled$: Observable<Action> = this.actions$.pipe(
        ofType<ExceptionHandled>(LeavesActionTypes.ExceptionHandled),
        pipe(
            map(() => new ShowExceptionMessages({
                message: this.exceptionMessage.message,
            })
            )
        )
    );

    @Effect()
    showValidationMessagesForLeavesList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLeavesFailed>(LeavesActionTypes.LoadLeavesFailed),
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