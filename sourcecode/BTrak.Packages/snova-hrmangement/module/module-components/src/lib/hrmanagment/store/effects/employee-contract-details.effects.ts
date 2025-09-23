import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable, of, pipe } from "rxjs";
import { Action } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { switchMap, map, catchError } from "rxjs/operators";

import { EmployeeDetailsSearchModel } from "../../models/employee-details-search-model";

import { EmployeeService } from "../../services/employee-service";


import { EmployeeContractModel } from "../../models/employee-contract-model";
import { LoadEmployeeContractDetailsTriggered, LoadEmployeeContractDetailsCompleted, LoadEmployeeContractDetailsFailed, CreateEmployeeContractDetailsTriggered, DeleteEmployeeContractDetailsCompleted, CreateEmployeeContractDetailsCompleted, CreateEmployeeContractDetailsFailed, GetEmployeeContractDetailsByIdTriggered, GetEmployeeContractDetailsByIdCompleted, GetEmployeeContractDetailsByIdFailed, ExceptionHandled, UpdateEmployeeContractDetailsById, EmployeeContractDetailsActionTypes } from "../actions/employee-contract-details.actions";
import { EmployeeContractSearchModel } from "../../models/employee-contract-search-model";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
//import { GetReferenceIdOfFile } from '@snovasys/snova-file-uploader';

@Injectable()
export class EmployeeContractDetailsEffects {
    employeeContractDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeContractDetailsData: EmployeeContractModel;
    isNewEmployeeContractDetails: boolean;
    employeeContractId: string;
    totalCount: number;
    employeeId: string;
    toastrMessage: string;

    @Effect()
    loadEmployeeContractDetails$: Observable<Action> = this.actions$.pipe(
        ofType<LoadEmployeeContractDetailsTriggered>(EmployeeContractDetailsActionTypes.LoadEmployeeContractDetailsTriggered),
        switchMap(searchAction => {
            this.employeeContractDetailsSearchResult = searchAction.employeeContractDetailsSearchResult;
            return this.employeeService
                .getEmployeeDetails(searchAction.employeeContractDetailsSearchResult)
                .pipe(map((employeeContractDetailsList: any) => {
                    if (employeeContractDetailsList.success === true) {
                        if(employeeContractDetailsList.data.employmentContractDetails.length > 0)
                            this.totalCount = employeeContractDetailsList.data.employmentContractDetails[0].totalCount;
                        return new LoadEmployeeContractDetailsCompleted(employeeContractDetailsList.data.employmentContractDetails);
                    } else {
                        return new LoadEmployeeContractDetailsFailed(
                            employeeContractDetailsList.apiResponseMessages
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
    upsertEmployeeContractDetails$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeContractDetailsTriggered>(EmployeeContractDetailsActionTypes.CreateEmployeeContractDetailsTriggered),
        switchMap(contractDetailsTriggeredAction => {
            if (contractDetailsTriggeredAction.employeeContractDetails.employmentContractId === null || contractDetailsTriggeredAction.employeeContractDetails.employmentContractId === '' || contractDetailsTriggeredAction.employeeContractDetails.employmentContractId === undefined) {
                this.isNewEmployeeContractDetails = true;
                this.toastrMessage = this.translateService.instant(ConstantVariables.ContractDetailsCreatedSuccessfully)
            } else if (
                contractDetailsTriggeredAction.employeeContractDetails.employmentContractId !== undefined &&
                contractDetailsTriggeredAction.employeeContractDetails.isArchived === true
            ) {
                this.isNewEmployeeContractDetails = false;
                this.toastrMessage = this.translateService.instant(ConstantVariables.ContractDetailsDeletedSuccessfully)
            } else {
                this.isNewEmployeeContractDetails = false;
                this.toastrMessage = this.translateService.instant(ConstantVariables.ContractDetailsUpdatedSuccessfully)
            }
            this.employeeId = contractDetailsTriggeredAction.employeeContractDetails.employeeId;
            return this.employeeService
                .upsertEmploymentContract(contractDetailsTriggeredAction.employeeContractDetails)
                .pipe(
                    map((employeeContractId: any) => {
                        if (employeeContractId.success === true) {
                            contractDetailsTriggeredAction.employeeContractDetails.employmentContractId = employeeContractId.data;
                            this.employeeContractId = employeeContractId.data;
                            if (contractDetailsTriggeredAction.employeeContractDetails.isArchived)
                                return new DeleteEmployeeContractDetailsCompleted(employeeContractId.data);
                            else
                                return new CreateEmployeeContractDetailsCompleted(employeeContractId.data);
                        } else {
                            return new CreateEmployeeContractDetailsFailed(employeeContractId.apiResponseMessages);
                        }
                    }),
                    catchError(error => {
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    upsertEmployeeContractDetailsSuccessfulAndLoad$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeContractDetailsCompleted>(EmployeeContractDetailsActionTypes.CreateEmployeeContractDetailsCompleted),
        pipe(map(() => {
            if (this.isNewEmployeeContractDetails) {
                return new LoadEmployeeContractDetailsTriggered(this.employeeContractDetailsSearchResult);
            }
            else
                return new GetEmployeeContractDetailsByIdTriggered(this.employeeContractId);
        }),
        )
    );

    @Effect()
    upsertEmployeeContractDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeContractDetailsCompleted>(EmployeeContractDetailsActionTypes.CreateEmployeeContractDetailsCompleted),
        pipe(map(() =>
            new SnackbarOpen({
                message: this.toastrMessage, // TODO: Change to proper toast message
                action: this.translateService.instant(ConstantVariables.success)
            })
        )
        )
    );

    @Effect()
    deleteEmployeeContractDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
        ofType<DeleteEmployeeContractDetailsCompleted>(EmployeeContractDetailsActionTypes.DeleteEmployeeContractDetailsCompleted),
        pipe(map(() =>
            new SnackbarOpen({
                message: this.toastrMessage, // TODO: Change to proper toast message
                action: this.translateService.instant(ConstantVariables.success)
            })
        )
        )
    );

    @Effect()
    deleteEmployeeContractDetailsSuccessfulAndLoad$: Observable<Action> = this.actions$.pipe(
        ofType<DeleteEmployeeContractDetailsCompleted>(EmployeeContractDetailsActionTypes.DeleteEmployeeContractDetailsCompleted),
        pipe(map(() => {
            return new LoadEmployeeContractDetailsTriggered(this.employeeContractDetailsSearchResult);
        })
        )
    );

    @Effect()
    getEmployeeContractDetailsById$: Observable<Action> = this.actions$.pipe(
        ofType<GetEmployeeContractDetailsByIdTriggered>(EmployeeContractDetailsActionTypes.GetEmployeeContractDetailsByIdTriggered),
        switchMap(searchAction => {
            let employeeContractDetailsSearchModel = new EmployeeContractSearchModel();
            employeeContractDetailsSearchModel.employeeId = this.employeeId;
            employeeContractDetailsSearchModel.isArchived = false;
            employeeContractDetailsSearchModel.employmentContractId = searchAction.employeeContractDetailId;
            return this.employeeService
                .searchEmployeeContractDetails(employeeContractDetailsSearchModel)
                .pipe(map((employeeContractDetailsData: any) => {
                    this.employeeId = '';
                    if (employeeContractDetailsData.success === true) {
                        employeeContractDetailsData.data.totalCount = this.totalCount;
                        this.employeeContractDetailsData = employeeContractDetailsData.data;
                        return new GetEmployeeContractDetailsByIdCompleted(employeeContractDetailsData.data);
                    } else {
                        return new GetEmployeeContractDetailsByIdFailed(
                            employeeContractDetailsData.apiResponseMessages
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
    upsertEmployeeContractDetailsSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<GetEmployeeContractDetailsByIdCompleted>(EmployeeContractDetailsActionTypes.GetEmployeeContractDetailsByIdCompleted),
        pipe(map(() => {
            return new UpdateEmployeeContractDetailsById({
                employeeContractDetailsUpdate: {
                    id: this.employeeContractDetailsData.employmentContractId,
                    changes: this.employeeContractDetailsData
                }
            });
        })
        )
    );

    @Effect()
    showValidationMessagesForLoadEmployeeContractDetails$: Observable<Action> = this.actions$.pipe(
        ofType<LoadEmployeeContractDetailsFailed>(EmployeeContractDetailsActionTypes.LoadEmployeeContractDetailsFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForCreateEmployeeContractDetails$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeContractDetailsFailed>(EmployeeContractDetailsActionTypes.CreateEmployeeContractDetailsFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForGetEmployeeContractDetails$: Observable<Action> = this.actions$.pipe(
        ofType<GetEmployeeContractDetailsByIdFailed>(EmployeeContractDetailsActionTypes.GetEmployeeContractDetailsByIdFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    exceptionHandledForEmployeeContract$: Observable<Action> = this.actions$.pipe(
        ofType<ExceptionHandled>(EmployeeContractDetailsActionTypes.ExceptionHandled),
        switchMap(searchAction => {
            return of(new ShowExceptionMessages({
                message: searchAction.errorMessage, // TODO: Change to proper toast message
            })
            )
        })
    );

    // @Effect()
    // sendUpsertedIdAsReferenceId$: Observable<Action> = this.actions$.pipe(
    //   ofType<CreateEmployeeContractDetailsCompleted>(EmployeeContractDetailsActionTypes.CreateEmployeeContractDetailsCompleted),
    //   switchMap(searchAction => {
    //     return of(new GetReferenceIdOfFile(searchAction.employeeContractDetailId)
    //     )
    //   })
    // );

    constructor(
        private actions$: Actions,
        private employeeService: EmployeeService,
        private translateService: TranslateService
    ) { }
}