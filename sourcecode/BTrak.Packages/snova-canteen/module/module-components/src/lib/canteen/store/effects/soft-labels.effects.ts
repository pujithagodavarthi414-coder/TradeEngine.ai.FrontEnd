import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core"
import { UpsertsoftLabelTriggered, softLabelsActionTypes, UpsertsoftLabelCompleted, UpsertsoftLabelFailed, ExceptionHandled, GetsoftLabelsTriggered, GetsoftLabelsCompleted, GetsoftLabelsFailed, GetsoftLabelByIdTriggered, GetsoftLabelByIdCompleted, GetsoftLabelByIdFailed, UpdatesoftLabelField } from "../actions/soft-labels.actions";
import { SoftLabelConfigurationModel } from '../../models/softLabels-model';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { CanteenManagementService } from '../../services/canteen-management.service';


@Injectable()
export class SoftLabelConfigurationEffects {
    toastrMessage: string;
    softLabel: SoftLabelConfigurationModel
    softLabelId: string;
    @Effect()
    upsertsoftLabelConfiguration: Observable<Action> = this.actions$.pipe(
        ofType<UpsertsoftLabelTriggered>(softLabelsActionTypes.UpsertsoftLabelTriggered),
        switchMap(action => {
            return this.employeeService
                .upsertsoftLabelConfigurations(action.softLabelConfiguration)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        this.softLabelId = response.data;
                        return new UpsertsoftLabelCompleted(response.data);
                    } else {
                        return new UpsertsoftLabelFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    searchsoftLabels: Observable<Action> = this.actions$.pipe(
        ofType<GetsoftLabelsTriggered>(softLabelsActionTypes.GetsoftLabelsTriggered),
        switchMap(action => {
            return this.employeeService
                .getSoftLabelConfigurations(action.softLabelConfiguration)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        return new GetsoftLabelsCompleted(response.data);
                    } else {
                        return new GetsoftLabelsFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    getSoftLabelById: Observable<Action> = this.actions$.pipe(
        ofType<GetsoftLabelByIdTriggered>(softLabelsActionTypes.GetsoftLabelByIdTriggered),
        switchMap(action => {
            return this.employeeService
                .getsoftLabelById(action.softLabelId)
                .pipe(map((response: any) => {
                    if (response.success === true) {
                        this.softLabel = response.data;
                        return new GetsoftLabelByIdCompleted(response.data);
                    } else {
                        return new GetsoftLabelByIdFailed(
                            response.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    loadsoftLabelById$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertsoftLabelCompleted>(softLabelsActionTypes.UpsertsoftLabelCompleted),
        pipe(
            map(() => {
                return new GetsoftLabelByIdTriggered(this.softLabelId);
            })
        )
    );

    @Effect()
    UpdatesoftLabelChanges$: Observable<Action> = this.actions$.pipe(
        ofType<GetsoftLabelByIdCompleted>(softLabelsActionTypes.GetsoftLabelByIdCompleted),
        pipe(
            map(() => {
                return new UpdatesoftLabelField({
                    softLabelUpdate: {
                        id: this.softLabel.softLabelConfigurationId,
                        changes: this.softLabel
                    }
                });

            })
        )
    );

    @Effect()
    showValidationMessagesForUpsertCustomFieldFailed$: Observable<Action> = this.actions$.pipe(
        ofType<UpsertsoftLabelFailed>(softLabelsActionTypes.UpsertsoftLabelFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForUpdateCustomFieldFailed$: Observable<Action> = this.actions$.pipe(
        ofType<GetsoftLabelsFailed>(softLabelsActionTypes.GetsoftLabelsFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForArchiveCustomFieldFailed$: Observable<Action> = this.actions$.pipe(
        ofType<GetsoftLabelByIdFailed>(softLabelsActionTypes.GetsoftLabelByIdFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    exceptionHandled$: Observable<Action> = this.actions$.pipe(
        ofType<ExceptionHandled>(softLabelsActionTypes.ExceptionHandled),
        switchMap(searchAction => {
            return of(new ShowExceptionMessages({
                message: searchAction.errorMessage, // TODO: Change to proper toast message
            })
            )
        })
    );

    constructor(
        private actions$: Actions,
        private translateService: TranslateService,
        private employeeService: CanteenManagementService
    ) { }
}