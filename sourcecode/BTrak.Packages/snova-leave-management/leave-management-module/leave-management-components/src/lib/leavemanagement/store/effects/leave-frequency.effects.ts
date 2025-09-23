import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { LeaveFrequencyTypeSearchInputModel } from "../../models/leave-type-search-model";
import { LoadLeaveFrequenciesTriggered, LoadLeaveFrequenciesCompleted, LoadLeaveFrequenciesFailed, ExceptionHandled, LoadLeaveFrequenciesByIdTriggered, LoadLeaveFrequenciesByIdCompleted, LoadLeaveFrequenciesByIdFailed, LoadEncashmentTypesTriggered, LoadEncashmentTypesCompleted, LoadEncashmentTypesFailed, LoadLeaveFormulasTriggered, LoadLeaveFormulasCompleted, LoadLeaveFormulasFailed, AddNewLeaveTypeFrequencyTriggered, AddNewLeaveTypeFrequencyCompleted, AddNewLeaveTypeFrequencyFailed, LeaveFrequencyActionTypes, LoadRestrictionTypesTriggered, LoadRestrictionTypesCompleted, LoadRestrictionTypesFailed, LoadLeaveFrequenciesByFrequencyIdTriggered, LoadLeaveFrequenciesByFrequencyIdFailed, LoadLeaveFrequenciesByFrequencyIdCompleted, UpdateLeaveTypeFrequencyTriggered, UpdateLeaveTypeFrequencyCompleted, UpdateLeaveTypeFrequencyFailed } from "../actions/leave-frequency.actions";
import { ShowValidationMessages, ShowExceptionMessages } from "../actions/notification-validator.action";
import { LeaveManagementService } from "../../services/leaves-management-service";
import { LeavesService } from "../../services/leaves-service";

@Injectable()
export class LeaveFrequencyTypesEffects {
    exceptionMessage: any;
    leaveTypeId: string;
    @Effect()
    loadLeaveTypesListList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLeaveFrequenciesTriggered>(LeaveFrequencyActionTypes.LoadLeaveFrequenciesTriggered),
        switchMap(searchAction => {
            return this.leaveManagementService.getAllLeaveFrequencies(searchAction.leaveFrequencyTypeSearchModel)
                .pipe(map((leaveTypesList: any) => {
                    if (leaveTypesList.success === true) {
                        return new LoadLeaveFrequenciesCompleted(leaveTypesList.data);
                    } else {
                        return new LoadLeaveFrequenciesFailed(leaveTypesList.apiResponseMessages);
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
    loadLeaveTypesListById$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLeaveFrequenciesByIdTriggered>(LeaveFrequencyActionTypes.LoadLeaveFrequenciesByIdTriggered),
        switchMap(searchAction => {
            this.leaveTypeId = searchAction.leaveFrequencyTypeSearchModel.leaveTypeId;
            return this.leaveManagementService.getAllLeaveFrequencies(searchAction.leaveFrequencyTypeSearchModel)
                .pipe(map((leaveTypesList: any) => {
                    if (leaveTypesList.success === true) {
                        return new LoadLeaveFrequenciesByIdCompleted(leaveTypesList.data);
                    } else {
                        return new LoadLeaveFrequenciesByIdFailed(leaveTypesList.apiResponseMessages);
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
    loadFrequencyDetailsListByFrequencyId$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLeaveFrequenciesByFrequencyIdTriggered>(LeaveFrequencyActionTypes.LoadLeaveFrequenciesByFrequencyIdTriggered),
        switchMap(searchAction => {
            return this.leaveManagementService.getAllLeaveFrequencies(searchAction.leaveFrequencySearchInputModel)
                .pipe(map((leaveTypesList: any) => {
                    if (leaveTypesList.success === true) {
                        return new LoadLeaveFrequenciesByFrequencyIdCompleted(leaveTypesList.data);
                    } else {
                        return new LoadLeaveFrequenciesByFrequencyIdFailed(leaveTypesList.apiResponseMessages);
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
    loadEncashmentTypesList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadEncashmentTypesTriggered>(LeaveFrequencyActionTypes.LoadEncashmentTypesTriggered),
        switchMap(searchAction => {
            return this.leaveManagementService.getEncashmentTypes(searchAction.encashmentSearchModel)
                .pipe(map((encashmentTypes: any) => {
                    if (encashmentTypes.success === true) {
                        return new LoadEncashmentTypesCompleted(encashmentTypes.data);
                    } else {
                        return new LoadEncashmentTypesFailed(encashmentTypes.apiResponseMessages);
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
    loadLeaveFormulasList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLeaveFormulasTriggered>(LeaveFrequencyActionTypes.LoadLeaveFormulasTriggered),
        switchMap(searchAction => {
            return this.masterDataManagementService.getAllLeaveFormulas(searchAction.leaveFormula)
                .pipe(map((leaveFormulas: any) => {
                    if (leaveFormulas.success === true) {
                        return new LoadLeaveFormulasCompleted(leaveFormulas.data);
                    } else {
                        return new LoadLeaveFormulasFailed(leaveFormulas.apiResponseMessages);
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
    loadRestrictionTypesList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadRestrictionTypesTriggered>(LeaveFrequencyActionTypes.LoadRestrictionTypesTriggered),
        switchMap(searchAction => {
            return this.masterDataManagementService.getAllRestrictionTypes(searchAction.restrictionTypeModel)
                .pipe(map((restrictionTypes: any) => {
                    if (restrictionTypes.success === true) {
                        return new LoadRestrictionTypesCompleted(restrictionTypes.data);
                    } else {
                        return new LoadRestrictionTypesFailed(restrictionTypes.apiResponseMessages);
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
    LoadLeaveFrequenciesByIdCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLeaveFrequenciesByIdCompleted>(LeaveFrequencyActionTypes.LoadLeaveFrequenciesByIdCompleted),
        pipe(
            map(() => {
                if (this.leaveTypeId) {
                    let leaveFrequencyType = new LeaveFrequencyTypeSearchInputModel();
                    leaveFrequencyType.leaveTypeId = this.leaveTypeId;
                    return new LoadLeaveFrequenciesTriggered(leaveFrequencyType);
                }
            })
        )
    );

    @Effect()
    UpsertNewLeaveType$: Observable<Action> = this.actions$.pipe(
        ofType<AddNewLeaveTypeFrequencyTriggered>(LeaveFrequencyActionTypes.AddNewLeaveTypeFrequencyTriggered),
        switchMap(searchAction => {
            return this.leaveManagementService.upsertLeaveFrequency(searchAction.leaveFrequencyInputModel)
                .pipe(map((leaveTypeId: any) => {
                    if (leaveTypeId.success === true) {
                        return new AddNewLeaveTypeFrequencyCompleted(leaveTypeId.data);
                    } else {
                        return new AddNewLeaveTypeFrequencyFailed(leaveTypeId.apiResponseMessages);
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
    UpsertLeaveFrequency$: Observable<Action> = this.actions$.pipe(
        ofType<UpdateLeaveTypeFrequencyTriggered>(LeaveFrequencyActionTypes.UpdateLeaveTypeFrequencyTriggered),
        switchMap(searchAction => {
            return this.leaveManagementService.upsertLeaveFrequency(searchAction.leaveFrequencyInputModel)
                .pipe(map((leaveTypeId: any) => {
                    if (leaveTypeId.success === true) {
                        return new UpdateLeaveTypeFrequencyCompleted(leaveTypeId.data);
                    } else {
                        return new UpdateLeaveTypeFrequencyFailed(leaveTypeId.apiResponseMessages);
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
    exceptionHandled$: Observable<Action> = this.actions$.pipe(
        ofType<ExceptionHandled>(LeaveFrequencyActionTypes.ExceptionHandled),
        pipe(
            map(() => new ShowExceptionMessages({
                message: this.exceptionMessage.message,
            })
            )
        )
    );

    @Effect()
    showValidationMessagesForLeaveTypesList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLeaveFrequenciesFailed>(LeaveFrequencyActionTypes.LoadLeaveFrequenciesFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForRestrictionTypesList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadRestrictionTypesFailed>(LeaveFrequencyActionTypes.LoadRestrictionTypesFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForLeaveTypesListById$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLeaveFrequenciesByIdFailed>(LeaveFrequencyActionTypes.LoadLeaveFrequenciesByIdFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForLeaveFrequencyDetailsById$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLeaveFrequenciesByFrequencyIdFailed>(LeaveFrequencyActionTypes.LoadLeaveFrequenciesByFrequencyIdFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForEncashmentTypesList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadEncashmentTypesFailed>(LeaveFrequencyActionTypes.LoadEncashmentTypesFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForLeaveFormulasList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadLeaveFormulasFailed>(LeaveFrequencyActionTypes.LoadLeaveFormulasFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForAddNewLeaveType$: Observable<Action> = this.actions$.pipe(
        ofType<AddNewLeaveTypeFrequencyFailed>(LeaveFrequencyActionTypes.AddNewLeaveTypeFrequencyFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    constructor(
        private actions$: Actions,
        private leaveManagementService: LeavesService,
        private masterDataManagementService: LeaveManagementService
    ) { }
}