import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable, of, pipe } from "rxjs";
import { Action } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { switchMap, map, catchError } from "rxjs/operators";

import { EmployeeDetailsSearchModel } from "../../models/employee-details-search-model";
import { EmployeeWorkExperienceDetailsSearchModel } from "../../models/employee-work-experience-details-search-model";
import { EmployeeWorkExperienceDetailsModel } from "../../models/employee-work-experience-details-model";

import { EmployeeService } from "../../services/employee-service";
import { LoadEmployeeWorkExperienceDetailsTriggered, LoadEmployeeWorkExperienceDetailsCompleted, EmployeeWorkExperienceDetailsActionTypes, ExceptionHandled, CreateEmployeeWorkExperienceDetailsTriggered, DeleteEmployeeWorkExperienceDetailsCompleted, CreateEmployeeWorkExperienceDetailsCompleted, GetEmployeeWorkExperienceDetailsByIdTriggered, GetEmployeeWorkExperienceDetailsByIdCompleted, UpdateEmployeeWorkExperienceDetailsById, LoadEmployeeWorkExperienceDetailsFailed, CreateEmployeeWorkExperienceDetailsFailed, GetEmployeeWorkExperienceDetailsByIdFailed } from "../actions/employee-work-experience-details.actions";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
//import { GetReferenceIdOfFile } from '@snovasys/snova-file-uploader';

@Injectable()
export class EmployeeWorkExperienceDetailsEffects {
    employeeWorkExperienceDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeWorkExperienceDetailsData: EmployeeWorkExperienceDetailsModel;
    isNewEmployeeWorkExperienceDetails: boolean;
    employeeWorkExperienceId: string;
    totalCount: number;
    employeeId: string;
    toastrMessage: string;

    @Effect()
    loadEmployeeWorkExperienceDetails$: Observable<Action> = this.actions$.pipe(
        ofType<LoadEmployeeWorkExperienceDetailsTriggered>(EmployeeWorkExperienceDetailsActionTypes.LoadEmployeeWorkExperienceDetailsTriggered),
        switchMap(searchAction => {
            this.employeeWorkExperienceDetailsSearchResult = searchAction.employeeWorkExperienceDetailsSearchResult;
            return this.employeeService
                .getEmployeeDetails(searchAction.employeeWorkExperienceDetailsSearchResult)
                .pipe(map((employeeWorkExperienceDetailsList: any) => {
                    if (employeeWorkExperienceDetailsList.success === true) {
                        if(employeeWorkExperienceDetailsList.data.employeeWorkExperienceDetails.length > 0)
                            this.totalCount = employeeWorkExperienceDetailsList.data.employeeWorkExperienceDetails[0].totalCount;
                        return new LoadEmployeeWorkExperienceDetailsCompleted(employeeWorkExperienceDetailsList.data.employeeWorkExperienceDetails);
                    } else {
                        return new LoadEmployeeWorkExperienceDetailsFailed(
                            employeeWorkExperienceDetailsList.apiResponseMessages
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
    upsertEmployeeWorkExperienceDetails$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeWorkExperienceDetailsTriggered>(EmployeeWorkExperienceDetailsActionTypes.CreateEmployeeWorkExperienceDetailsTriggered),
        switchMap(workExperienceDetailsTriggeredAction => {
            if (workExperienceDetailsTriggeredAction.employeeWorkExperienceDetails.employeeWorkExperienceId === null || workExperienceDetailsTriggeredAction.employeeWorkExperienceDetails.employeeWorkExperienceId === '' || workExperienceDetailsTriggeredAction.employeeWorkExperienceDetails.employeeWorkExperienceId === undefined) {
                this.isNewEmployeeWorkExperienceDetails = true;
                this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForWorkExperienceCreated)
            } else if (
                workExperienceDetailsTriggeredAction.employeeWorkExperienceDetails.employeeWorkExperienceId !== undefined &&
                workExperienceDetailsTriggeredAction.employeeWorkExperienceDetails.isArchived === true
            ) {
                this.isNewEmployeeWorkExperienceDetails = false;
                this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForWorkExperienceDeleted)
            } else {
                this.isNewEmployeeWorkExperienceDetails = false;
                this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForWorkExperienceUpdated)
            }
            this.employeeId = workExperienceDetailsTriggeredAction.employeeWorkExperienceDetails.employeeId;
            return this.employeeService
                .upsertEmployeeWorkExperience(workExperienceDetailsTriggeredAction.employeeWorkExperienceDetails)
                .pipe(
                    map((employeeWorkExperienceId: any) => {
                        if (employeeWorkExperienceId.success === true) {
                            workExperienceDetailsTriggeredAction.employeeWorkExperienceDetails.employeeWorkExperienceId = employeeWorkExperienceId.data;
                            this.employeeWorkExperienceId = employeeWorkExperienceId.data;
                            if (workExperienceDetailsTriggeredAction.employeeWorkExperienceDetails.isArchived)
                                return new DeleteEmployeeWorkExperienceDetailsCompleted(employeeWorkExperienceId.data);
                            else
                                return new CreateEmployeeWorkExperienceDetailsCompleted(employeeWorkExperienceId.data);
                        } else {
                            return new CreateEmployeeWorkExperienceDetailsFailed(employeeWorkExperienceId.apiResponseMessages);
                        }
                    }),
                    catchError(error => {
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    upsertEmployeeWorkExperienceDetailsSuccessfulAndLoad$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeWorkExperienceDetailsCompleted>(EmployeeWorkExperienceDetailsActionTypes.CreateEmployeeWorkExperienceDetailsCompleted),
        pipe(map(() => {
            if (this.isNewEmployeeWorkExperienceDetails) {
                return new LoadEmployeeWorkExperienceDetailsTriggered(this.employeeWorkExperienceDetailsSearchResult);
            }
            else
                return new GetEmployeeWorkExperienceDetailsByIdTriggered(this.employeeWorkExperienceId);
        }),
        )
    );

    @Effect()
    upsertEmployeeWorkExperienceDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeWorkExperienceDetailsCompleted>(EmployeeWorkExperienceDetailsActionTypes.CreateEmployeeWorkExperienceDetailsCompleted),
        pipe(map(() =>
            new SnackbarOpen({
                message: this.toastrMessage, // TODO: Change to proper toast message
                action: this.translateService.instant(ConstantVariables.success)
            })
        )
        )
    );

    @Effect()
    deleteEmployeeWorkExperienceDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
        ofType<DeleteEmployeeWorkExperienceDetailsCompleted>(EmployeeWorkExperienceDetailsActionTypes.DeleteEmployeeWorkExperienceDetailsCompleted),
        pipe(map(() =>
            new SnackbarOpen({
                message: this.toastrMessage, // TODO: Change to proper toast message
                action: this.translateService.instant(ConstantVariables.success)
            })
        )
        )
    );

    @Effect()
    deleteEmployeeWorkExperienceDetailsSuccessfulAndLoad$: Observable<Action> = this.actions$.pipe(
        ofType<DeleteEmployeeWorkExperienceDetailsCompleted>(EmployeeWorkExperienceDetailsActionTypes.DeleteEmployeeWorkExperienceDetailsCompleted),
        pipe(map(() => {
            return new LoadEmployeeWorkExperienceDetailsTriggered(this.employeeWorkExperienceDetailsSearchResult);
        })
        )
    );

    @Effect()
    getEmployeeWorkExperienceDetailsById$: Observable<Action> = this.actions$.pipe(
        ofType<GetEmployeeWorkExperienceDetailsByIdTriggered>(EmployeeWorkExperienceDetailsActionTypes.GetEmployeeWorkExperienceDetailsByIdTriggered),
        switchMap(searchAction => {
            let employeeWorkExperienceDetailsSearchModel = new EmployeeWorkExperienceDetailsSearchModel();
            employeeWorkExperienceDetailsSearchModel.employeeId = this.employeeId;
            employeeWorkExperienceDetailsSearchModel.employeeWorkExperienceId = searchAction.employeeWorkExperienceDetailId;
            return this.employeeService
                .searchEmployeeWorkExperienceDetails(employeeWorkExperienceDetailsSearchModel)
                .pipe(map((employeeWorkExperienceDetailsData: any) => {
                    this.employeeId = '';
                    if (employeeWorkExperienceDetailsData.success === true) {
                        employeeWorkExperienceDetailsData.data.totalCount = this.totalCount;
                        this.employeeWorkExperienceDetailsData = employeeWorkExperienceDetailsData.data;
                        return new GetEmployeeWorkExperienceDetailsByIdCompleted(employeeWorkExperienceDetailsData.data);
                    } else {
                        return new GetEmployeeWorkExperienceDetailsByIdFailed(
                            employeeWorkExperienceDetailsData.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        this.employeeId = '';
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    upsertEmployeeWorkExperienceDetailsSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<GetEmployeeWorkExperienceDetailsByIdCompleted>(EmployeeWorkExperienceDetailsActionTypes.GetEmployeeWorkExperienceDetailsByIdCompleted),
        pipe(map(() => {
            return new UpdateEmployeeWorkExperienceDetailsById({
                employeeWorkExperienceDetailsUpdate: {
                    id: this.employeeWorkExperienceDetailsData.employeeWorkExperienceId,
                    changes: this.employeeWorkExperienceDetailsData
                }
            });
        })
        )
    );

    @Effect()
    showValidationMessagesForLoadEmployeeWorkExperienceDetails$: Observable<Action> = this.actions$.pipe(
        ofType<LoadEmployeeWorkExperienceDetailsFailed>(EmployeeWorkExperienceDetailsActionTypes.LoadEmployeeWorkExperienceDetailsFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForCreateEmployeeWorkExperienceDetails$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeWorkExperienceDetailsFailed>(EmployeeWorkExperienceDetailsActionTypes.CreateEmployeeWorkExperienceDetailsFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForGetEmployeeWorkExperienceDetails$: Observable<Action> = this.actions$.pipe(
        ofType<GetEmployeeWorkExperienceDetailsByIdFailed>(EmployeeWorkExperienceDetailsActionTypes.GetEmployeeWorkExperienceDetailsByIdFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    exceptionHandledForEmployeeWorkExperience$: Observable<Action> = this.actions$.pipe(
        ofType<ExceptionHandled>(EmployeeWorkExperienceDetailsActionTypes.ExceptionHandled),
        switchMap(searchAction => {
            return of(new ShowExceptionMessages({
                message: searchAction.errorMessage, // TODO: Change to proper toast message
            })
            )
        })
    );

    // @Effect()
    // sendUpsertedIdAsReferenceId$: Observable<Action> = this.actions$.pipe(
    //   ofType<CreateEmployeeWorkExperienceDetailsCompleted>(EmployeeWorkExperienceDetailsActionTypes.CreateEmployeeWorkExperienceDetailsCompleted),
    //   switchMap(searchAction => {
    //     return of(new GetReferenceIdOfFile(searchAction.employeeWorkExperienceDetailId)
    //     )
    //   })
    // )

    constructor(
        private actions$: Actions,
        private employeeService: EmployeeService,
        private translateService: TranslateService
    ) { }
}