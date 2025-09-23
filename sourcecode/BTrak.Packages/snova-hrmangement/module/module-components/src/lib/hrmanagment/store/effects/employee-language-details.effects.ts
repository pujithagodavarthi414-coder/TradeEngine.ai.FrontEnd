import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable, of, pipe } from "rxjs";
import { Action } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { switchMap, map, catchError } from "rxjs/operators";

import { EmployeeDetailsSearchModel } from "../../models/employee-details-search-model";
import { EmployeeLanguageDetailsModel } from "../../models/employee-language-details-model";
import { EmployeeLanguageDetailsSearchModel } from "../../models/employee-language-details-search-model";

import { EmployeeService } from "../../services/employee-service";

import { EmployeeLanguageDetailsActionTypes, LoadEmployeeLanguageDetailsTriggered, LoadEmployeeLanguageDetailsCompleted, CreateEmployeeLanguageDetailsTriggered, DeleteEmployeeLanguageDetailsCompleted, CreateEmployeeLanguageDetailsCompleted, ExceptionHandled, GetEmployeeLanguageDetailsByIdTriggered, GetEmployeeLanguageDetailsByIdCompleted, UpdateEmployeeLanguageDetailsById, LoadEmployeeLanguageDetailsFailed, CreateEmployeeLanguageDetailsFailed, GetEmployeeLanguageDetailsByIdFailed } from "../actions/employee-language-details.actions";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';


@Injectable()
export class EmployeeLanguageDetailsEffects {
    employeeLanguageDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeLanguageDetailsData: EmployeeLanguageDetailsModel;
    isNewEmployeeLanguageDetails: boolean;
    employeeLanguageId: string;
    totalCount: number;
    employeeId: string;
    toastrMessage: string;

    @Effect()
    loadEmployeeLanguageDetails$: Observable<Action> = this.actions$.pipe(
        ofType<LoadEmployeeLanguageDetailsTriggered>(EmployeeLanguageDetailsActionTypes.LoadEmployeeLanguageDetailsTriggered),
        switchMap(searchAction => {
            this.employeeLanguageDetailsSearchResult = searchAction.employeeLanguageDetailsSearchResult;
            return this.employeeService
                .getEmployeeDetails(searchAction.employeeLanguageDetailsSearchResult)
                .pipe(map((employeeLanguageDetailsList: any) => {
                    if (employeeLanguageDetailsList.success === true) {
                        if (employeeLanguageDetailsList.data.employeeLanguageDetails.length > 0)
                            this.totalCount = employeeLanguageDetailsList.data.employeeLanguageDetails[0].totalCount;
                        return new LoadEmployeeLanguageDetailsCompleted(employeeLanguageDetailsList.data.employeeLanguageDetails);
                    } else {
                        return new LoadEmployeeLanguageDetailsFailed(
                            employeeLanguageDetailsList.apiResponseMessages
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
    upsertEmployeeLanguageDetails$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeLanguageDetailsTriggered>(EmployeeLanguageDetailsActionTypes.CreateEmployeeLanguageDetailsTriggered),
        switchMap(languageDetailsTriggeredAction => {
            if (languageDetailsTriggeredAction.employeeLanguageDetails.employeeLanguageId === null || languageDetailsTriggeredAction.employeeLanguageDetails.employeeLanguageId === '' || languageDetailsTriggeredAction.employeeLanguageDetails.employeeLanguageId === undefined) {
                this.isNewEmployeeLanguageDetails = true;
                this.toastrMessage = this.translateService.instant(ConstantVariables.LanguageDetailsCreatedSuccessfully)
            } else if (
                languageDetailsTriggeredAction.employeeLanguageDetails.employeeLanguageId !== undefined &&
                languageDetailsTriggeredAction.employeeLanguageDetails.isArchived === true
            ) {
                this.isNewEmployeeLanguageDetails = false;
                this.toastrMessage = this.translateService.instant(ConstantVariables.LanguageDetailsDeletedSuccessfully)
            } else {
                this.isNewEmployeeLanguageDetails = false;
                this.toastrMessage = this.translateService.instant(ConstantVariables.LanguageDetailsUpdatedSuccessfully)
            }
            this.employeeId = languageDetailsTriggeredAction.employeeLanguageDetails.employeeId;
            return this.employeeService
                .upsertEmployeeLanguages(languageDetailsTriggeredAction.employeeLanguageDetails)
                .pipe(
                    map((employeeLanguageId: any) => {
                        if (employeeLanguageId.success === true) {
                            languageDetailsTriggeredAction.employeeLanguageDetails.employeeLanguageId = employeeLanguageId.data;
                            this.employeeLanguageId = employeeLanguageId.data;
                            if (languageDetailsTriggeredAction.employeeLanguageDetails.isArchived)
                                return new DeleteEmployeeLanguageDetailsCompleted(employeeLanguageId.data);
                            else
                                return new CreateEmployeeLanguageDetailsCompleted(employeeLanguageId.data);
                        } else {
                            return new CreateEmployeeLanguageDetailsFailed(employeeLanguageId.apiResponseMessages);
                        }
                    }),
                    catchError(error => {
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    upsertEmployeeLanguageDetailsSuccessfulAndLoad$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeLanguageDetailsCompleted>(EmployeeLanguageDetailsActionTypes.CreateEmployeeLanguageDetailsCompleted),
        pipe(map(() => {
            if (this.isNewEmployeeLanguageDetails) {
                return new LoadEmployeeLanguageDetailsTriggered(this.employeeLanguageDetailsSearchResult);
            }
            else
                return new GetEmployeeLanguageDetailsByIdTriggered(this.employeeLanguageId);
        }),
        )
    );

    @Effect()
    upsertEmployeeLanguageDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeLanguageDetailsCompleted>(EmployeeLanguageDetailsActionTypes.CreateEmployeeLanguageDetailsCompleted),
        pipe(map(() =>
            new SnackbarOpen({
                message: this.toastrMessage, // TODO: Change to proper toast message
                action: this.translateService.instant(ConstantVariables.success)
            })
        )
        )
    );

    @Effect()
    deleteEmployeeLanguageDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
        ofType<DeleteEmployeeLanguageDetailsCompleted>(EmployeeLanguageDetailsActionTypes.DeleteEmployeeLanguageDetailsCompleted),
        pipe(map(() =>
            new SnackbarOpen({
                message: this.toastrMessage, // TODO: Change to proper toast message
                action: this.translateService.instant(ConstantVariables.success)
            })
        )
        )
    );

    @Effect()
    deleteEmployeeLanguageDetailsSuccessfulAndLoad$: Observable<Action> = this.actions$.pipe(
        ofType<DeleteEmployeeLanguageDetailsCompleted>(EmployeeLanguageDetailsActionTypes.DeleteEmployeeLanguageDetailsCompleted),
        pipe(map(() => {
            return new LoadEmployeeLanguageDetailsTriggered(this.employeeLanguageDetailsSearchResult);
        })
        )
    );

    @Effect()
    getEmployeeLanguageDetailsById$: Observable<Action> = this.actions$.pipe(
        ofType<GetEmployeeLanguageDetailsByIdTriggered>(EmployeeLanguageDetailsActionTypes.GetEmployeeLanguageDetailsByIdTriggered),
        switchMap(searchAction => {
            let employeeLanguageDetailsSearchModel = new EmployeeLanguageDetailsSearchModel();
            employeeLanguageDetailsSearchModel.employeeId = this.employeeId;
            employeeLanguageDetailsSearchModel.employeeLanguageId = searchAction.employeeLanguageDetailId;
            return this.employeeService
                .searchEmployeeLanguageDetails(employeeLanguageDetailsSearchModel)
                .pipe(map((employeeLanguageDetailsData: any) => {
                    this.employeeId = '';
                    if (employeeLanguageDetailsData.success === true) {
                        employeeLanguageDetailsData.data.totalCount = this.totalCount;
                        this.employeeLanguageDetailsData = employeeLanguageDetailsData.data;
                        return new GetEmployeeLanguageDetailsByIdCompleted(employeeLanguageDetailsData.data);
                    } else {
                        return new GetEmployeeLanguageDetailsByIdFailed(
                            employeeLanguageDetailsData.apiResponseMessages
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
    upsertEmployeeLanguageDetailsSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<GetEmployeeLanguageDetailsByIdCompleted>(EmployeeLanguageDetailsActionTypes.GetEmployeeLanguageDetailsByIdCompleted),
        pipe(map(() => {
            return new UpdateEmployeeLanguageDetailsById({
                employeeLanguageDetailsUpdate: {
                    id: this.employeeLanguageDetailsData.employeeLanguageId,
                    changes: this.employeeLanguageDetailsData
                }
            });
        })
        )
    );

    @Effect()
    showValidationMessagesForLoadEmployeeLanguageDetails$: Observable<Action> = this.actions$.pipe(
        ofType<LoadEmployeeLanguageDetailsFailed>(EmployeeLanguageDetailsActionTypes.LoadEmployeeLanguageDetailsFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForCreateEmployeeLanguageDetails$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeLanguageDetailsFailed>(EmployeeLanguageDetailsActionTypes.CreateEmployeeLanguageDetailsFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForGrtEmployeeLanguageDetails$: Observable<Action> = this.actions$.pipe(
        ofType<GetEmployeeLanguageDetailsByIdFailed>(EmployeeLanguageDetailsActionTypes.GetEmployeeLanguageDetailsByIdFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    exceptionHandledForEmployeeLanguage$: Observable<Action> = this.actions$.pipe(
        ofType<ExceptionHandled>(EmployeeLanguageDetailsActionTypes.ExceptionHandled),
        switchMap(searchAction => {
            return of(new ShowExceptionMessages({
                message: searchAction.errorMessage, // TODO: Change to proper toast message
            })
            )
        })
    );

    constructor(
        private actions$: Actions,
        private employeeService: EmployeeService,
        private translateService: TranslateService
    ) { }
}