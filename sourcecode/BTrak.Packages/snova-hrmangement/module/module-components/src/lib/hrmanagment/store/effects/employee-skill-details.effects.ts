import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable, of, pipe } from "rxjs";
import { Action } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { switchMap, map, catchError } from "rxjs/operators";

import { EmployeeDetailsSearchModel } from "../../models/employee-details-search-model";
import { EmployeeSkillDetailsSearchModel } from "../../models/employee-skill-details-search-model";
import { EmployeeSkillDetailsModel } from "../../models/employee-skill-details-model";

import { EmployeeService } from "../../services/employee-service";
import { LoadEmployeeSkillDetailsTriggered, LoadEmployeeSkillDetailsCompleted, EmployeeSkillDetailsActionTypes, ExceptionHandled, CreateEmployeeSkillDetailsTriggered, DeleteEmployeeSkillDetailsCompleted, CreateEmployeeSkillDetailsCompleted, GetEmployeeSkillDetailsByIdTriggered, GetEmployeeSkillDetailsByIdCompleted, UpdateEmployeeSkillDetailsById, LoadEmployeeSkillDetailsFailed, CreateEmployeeSkillDetailsFailed, GetEmployeeSkillDetailsByIdFailed } from "../actions/employee-skill-details.actions";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';


@Injectable()
export class EmployeeSkillDetailsEffects {
    employeeSkillDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeSkillDetailsData: EmployeeSkillDetailsModel;
    isNewEmployeeSkillDetails: boolean;
    employeeSkillId: string;
    totalCount: number;
    employeeId: string;
    toastrMessage: string;

    @Effect()
    loadEmployeeSkillDetails$: Observable<Action> = this.actions$.pipe(
        ofType<LoadEmployeeSkillDetailsTriggered>(EmployeeSkillDetailsActionTypes.LoadEmployeeSkillDetailsTriggered),
        switchMap(searchAction => {
            this.employeeSkillDetailsSearchResult = searchAction.employeeSkillDetailsSearchResult;
            return this.employeeService
                .getEmployeeDetails(searchAction.employeeSkillDetailsSearchResult)
                .pipe(map((employeeSkillDetailsList: any) => {
                    if (employeeSkillDetailsList.success === true) {
                        if(employeeSkillDetailsList.data){
                            if(employeeSkillDetailsList.data.employeeSkillDetails.length > 0)
                            this.totalCount = employeeSkillDetailsList.data.employeeSkillDetails[0].totalCount;
                        return new LoadEmployeeSkillDetailsCompleted(employeeSkillDetailsList.data.employeeSkillDetails);
                    } else {
                        return new LoadEmployeeSkillDetailsFailed(
                            employeeSkillDetailsList.apiResponseMessages
                        );
                    }
                        }
                       
                }),
                    catchError(error => {
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    upsertEmployeeSkillDetails$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeSkillDetailsTriggered>(EmployeeSkillDetailsActionTypes.CreateEmployeeSkillDetailsTriggered),
        switchMap(SkillDetailsTriggeredAction => {
            if (SkillDetailsTriggeredAction.employeeSkillDetails.employeeSkillId === null || SkillDetailsTriggeredAction.employeeSkillDetails.employeeSkillId === '' || SkillDetailsTriggeredAction.employeeSkillDetails.employeeSkillId === undefined) {
                this.isNewEmployeeSkillDetails = true;
                this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForSkillCreated)
            } else if (
                SkillDetailsTriggeredAction.employeeSkillDetails.employeeSkillId !== undefined &&
                SkillDetailsTriggeredAction.employeeSkillDetails.isArchived === true
            ) {
                this.isNewEmployeeSkillDetails = false;
                this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForSkillDeleted)
            } else {
                this.isNewEmployeeSkillDetails = false;
                this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForSkillUpdated)
            }
            this.employeeId = SkillDetailsTriggeredAction.employeeSkillDetails.employeeId;
            return this.employeeService
                .upsertEmployeeSkill(SkillDetailsTriggeredAction.employeeSkillDetails)
                .pipe(
                    map((employeeSkillId: any) => {
                        if (employeeSkillId.success === true) {
                            SkillDetailsTriggeredAction.employeeSkillDetails.employeeSkillId = employeeSkillId.data;
                            this.employeeSkillId = employeeSkillId.data;
                            if (SkillDetailsTriggeredAction.employeeSkillDetails.isArchived)
                                return new DeleteEmployeeSkillDetailsCompleted(employeeSkillId.data);
                            else
                                return new CreateEmployeeSkillDetailsCompleted(employeeSkillId.data);
                        } else {
                            return new CreateEmployeeSkillDetailsFailed(employeeSkillId.apiResponseMessages);
                        }
                    }),
                    catchError(error => {
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    upsertEmployeeSkillDetailsSuccessfulAndLoad$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeSkillDetailsCompleted>(EmployeeSkillDetailsActionTypes.CreateEmployeeSkillDetailsCompleted),
        pipe(map(() => {
            if (this.isNewEmployeeSkillDetails) {
                return new LoadEmployeeSkillDetailsTriggered(this.employeeSkillDetailsSearchResult);
            }
            else
                return new GetEmployeeSkillDetailsByIdTriggered(this.employeeSkillId);
        }),
        )
    );

    @Effect()
    upsertEmployeeSkillDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeSkillDetailsCompleted>(EmployeeSkillDetailsActionTypes.CreateEmployeeSkillDetailsCompleted),
        pipe(map(() =>
            new SnackbarOpen({
                message: this.toastrMessage, // TODO: Change to proper toast message
                action: this.translateService.instant(ConstantVariables.success)
            })
        )
        )
    );

    @Effect()
    deleteEmployeeSkillDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
        ofType<DeleteEmployeeSkillDetailsCompleted>(EmployeeSkillDetailsActionTypes.DeleteEmployeeSkillDetailsCompleted),
        pipe(map(() =>
            new SnackbarOpen({
                message: this.toastrMessage, // TODO: Change to proper toast message
                action: this.translateService.instant(ConstantVariables.success)
            })
        )
        )
    );

    @Effect()
    deleteEmployeeSkillDetailsSuccessfulAndLoad$: Observable<Action> = this.actions$.pipe(
        ofType<DeleteEmployeeSkillDetailsCompleted>(EmployeeSkillDetailsActionTypes.DeleteEmployeeSkillDetailsCompleted),
        pipe(map(() => {
            return new LoadEmployeeSkillDetailsTriggered(this.employeeSkillDetailsSearchResult);
        })
        )
    );

    @Effect()
    getEmployeeSkillDetailsById$: Observable<Action> = this.actions$.pipe(
        ofType<GetEmployeeSkillDetailsByIdTriggered>(EmployeeSkillDetailsActionTypes.GetEmployeeSkillDetailsByIdTriggered),
        switchMap(searchAction => {
            let employeeSkillDetailsSearchModel = new EmployeeSkillDetailsSearchModel();
            employeeSkillDetailsSearchModel.employeeId = this.employeeId;
            employeeSkillDetailsSearchModel.employeeSkillId = searchAction.employeeSkillDetailId;
            return this.employeeService
                .searchSkillDetails(employeeSkillDetailsSearchModel)
                .pipe(map((employeeSkillDetailsData: any) => {
                    this.employeeId = '';
                    if (employeeSkillDetailsData.success === true) {
                        if(employeeSkillDetailsData.data){
                            employeeSkillDetailsData.data.totalCount = this.totalCount;
                            this.employeeSkillDetailsData = employeeSkillDetailsData.data;
                            return new GetEmployeeSkillDetailsByIdCompleted(employeeSkillDetailsData.data);
                        }
                        else{
                            return new GetEmployeeSkillDetailsByIdFailed(
                                employeeSkillDetailsData.apiResponseMessages
                            );
                        }
                        
                    } else {
                        return new GetEmployeeSkillDetailsByIdFailed(
                            employeeSkillDetailsData.apiResponseMessages
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
    upsertEmployeeSkillDetailsSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<GetEmployeeSkillDetailsByIdCompleted>(EmployeeSkillDetailsActionTypes.GetEmployeeSkillDetailsByIdCompleted),
        pipe(map(() => {
            return new UpdateEmployeeSkillDetailsById({
                employeeSkillDetailsUpdate: {
                    id: this.employeeSkillDetailsData.employeeSkillId,
                    changes: this.employeeSkillDetailsData
                }
            });
        })
        )
    );

    @Effect()
    showValidationMessagesForLoadEmployeeSkillDetails$: Observable<Action> = this.actions$.pipe(
        ofType<LoadEmployeeSkillDetailsFailed>(EmployeeSkillDetailsActionTypes.LoadEmployeeSkillDetailsFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForCreateEmployeeSkillDetails$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeSkillDetailsFailed>(EmployeeSkillDetailsActionTypes.CreateEmployeeSkillDetailsFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForGetEmployeeSkillDetails$: Observable<Action> = this.actions$.pipe(
        ofType<GetEmployeeSkillDetailsByIdFailed>(EmployeeSkillDetailsActionTypes.GetEmployeeSkillDetailsByIdFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    exceptionHandledForEmployeeSkill$: Observable<Action> = this.actions$.pipe(
        ofType<ExceptionHandled>(EmployeeSkillDetailsActionTypes.ExceptionHandled),
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