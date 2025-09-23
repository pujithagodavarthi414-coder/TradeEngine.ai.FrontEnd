import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { Observable, of, pipe } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { EmployeeDetailsSearchModel } from "../../models/employee-details-search-model";
import { EmployeeRateSheetInsertModel } from "../../models/employee-ratesheet-insert-model";
import { EmployeeRateSheetModel } from "../../models/employee-ratesheet-model";
import { EmployeeService } from "../../services/employee-service";
import {
    CreateEmployeeRateSheetDetailsCompleted, CreateEmployeeRateSheetDetailsFailed, CreateEmployeeRateSheetDetailsTriggered,
    DeleteEmployeeRateSheetDetailsCompleted,
    EmployeeRateSheetDetailsActionTypes,
    LoadEmployeeRateSheetDetailsCompleted, LoadEmployeeRateSheetDetailsFailed, LoadEmployeeRateSheetDetailsTriggered,
    UpdateEmployeeRateSheetDetailsCompleted, UpdateEmployeeRateSheetDetailsFailed, UpdateEmployeeRateSheetDetailsTriggered,
    GetEmployeeRateSheetDetailsByIdTriggered, GetEmployeeRateSheetDetailsByIdCompleted, GetEmployeeRateSheetDetailsByIdFailed,
    UpdateEmployeeRateSheetDetailsById,
    RefreshEmployeeRateSheetDetailsList
} from "../actions/employee-ratesheet-details.actions";
import { ExceptionHandled } from "../actions/employee-ratesheet-details.actions";
import { EmployeeRatesheetDetailsSearchModel } from "../../models/employee-ratesheet-details-search-model";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages } from '../actions/notification-validator.action';

@Injectable()
export class EmployeeRateSheetDetailsEffects {
    employeeRateSheet: EmployeeRateSheetModel;
    employeeRateSheetInsertModel: EmployeeRateSheetInsertModel;
    employeeRateSheetList: EmployeeRateSheetModel[];
    employeeRateSheetDetailsSearchResult: EmployeeDetailsSearchModel;
    employeeRateSheetId: string;
    employeeId: string;
    totalCount: number;
    isNewRateSheetDetails: boolean;
    toasterMessage: string;

    @Effect()
    loadRateSheetDetails$: Observable<Action> = this.actions$.pipe(
        ofType<LoadEmployeeRateSheetDetailsTriggered>(EmployeeRateSheetDetailsActionTypes.LoadEmployeeRateSheetDetailsTriggered),
        switchMap((searchAction) => {
            this.employeeRateSheetDetailsSearchResult = searchAction.employeeRateSheetDetailsSearchResult;
            return this.employeeService
                .getEmployeeDetails(searchAction.employeeRateSheetDetailsSearchResult)
                .pipe(map((employeeRateSheetDetailsList: any) => {
                    if (employeeRateSheetDetailsList.success === true) {
                        if (employeeRateSheetDetailsList.data.employeeRateSheetDetails.length > 0) {
                            this.totalCount = employeeRateSheetDetailsList.data.employeeRateSheetDetails[0].totalCount;
                        }
                        return new LoadEmployeeRateSheetDetailsCompleted(employeeRateSheetDetailsList.data.employeeRateSheetDetails);
                    } else {
                        return new LoadEmployeeRateSheetDetailsFailed(employeeRateSheetDetailsList.apiResponseMessage);
                    }
                }),
                    catchError((error) => {
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    )

    @Effect()
    getEmployeeRatesheetDetailsById$: Observable<Action> = this.actions$.pipe(
        ofType<GetEmployeeRateSheetDetailsByIdTriggered>(EmployeeRateSheetDetailsActionTypes.GetEmployeeRateSheetDetailsByIdTriggered),
        switchMap(searchAction => {
            let employeeRatesheetDetailsSearchModel = new EmployeeRatesheetDetailsSearchModel();
            employeeRatesheetDetailsSearchModel.employeeId = this.employeeId;
            employeeRatesheetDetailsSearchModel.isArchived = false;
            employeeRatesheetDetailsSearchModel.employeeRatesheetId = this.employeeRateSheetId;
            return this.employeeService
                .searchEmployeeRatesheetDetails(employeeRatesheetDetailsSearchModel)
                .pipe(map((employeeRatesheetDetailsData: any) => {
                    this.employeeId = '';
                    if (employeeRatesheetDetailsData.success === true) {
                        employeeRatesheetDetailsData.data.totalCount = this.totalCount;
                        this.employeeRateSheet = employeeRatesheetDetailsData.data;
                        return new GetEmployeeRateSheetDetailsByIdCompleted(employeeRatesheetDetailsData.data);
                    } else {
                        return new GetEmployeeRateSheetDetailsByIdFailed(
                            employeeRatesheetDetailsData.apiResponseMessages
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
    insertRateSheetDetails$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeRateSheetDetailsTriggered>(EmployeeRateSheetDetailsActionTypes.CreateEmployeeRateSheetDetailsTriggered),
        switchMap((rateSheetInsertTriggeredAction) => {
            this.employeeId = rateSheetInsertTriggeredAction.employeeRateSheetInsertModel.rateSheetEmployeeId;
            this.isNewRateSheetDetails = true;
            this.toasterMessage = this.translateService.instant(ConstantVariables.SuccessMessageForEmployeeRateSheetCreated);

            return this.employeeService
                .insertEmployeeRateSheetDetails(rateSheetInsertTriggeredAction.employeeRateSheetInsertModel)
                .pipe(map((employeeRateSheetDetailsId: any) => {
                    if (employeeRateSheetDetailsId.success) {
                        this.employeeRateSheetId = employeeRateSheetDetailsId.data;
                        return new CreateEmployeeRateSheetDetailsCompleted(this.employeeRateSheetId);
                    } else {
                        return new CreateEmployeeRateSheetDetailsFailed(employeeRateSheetDetailsId.apiResponseMessages);
                    }
                }),
                    catchError((error) => {
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    )

    @Effect()
    updateRateSheetDetails$: Observable<Action> = this.actions$.pipe(
        ofType<UpdateEmployeeRateSheetDetailsTriggered>(EmployeeRateSheetDetailsActionTypes.UpdateEmployeeRateSheetDetailsTriggered),
        switchMap((rateSheetUpdateTriggeredAction) => {
            this.employeeId = rateSheetUpdateTriggeredAction.employeeRateSheet.rateSheetEmployeeId;
            if (rateSheetUpdateTriggeredAction.employeeRateSheet.employeeRateSheetId !== undefined &&
                rateSheetUpdateTriggeredAction.employeeRateSheet.isArchived === true) {
                this.isNewRateSheetDetails = false;
                this.toasterMessage = this.translateService.instant(ConstantVariables.SuccessMessageForEmployeeRateSheetDeleted);
            } else {
                this.isNewRateSheetDetails = false;
                this.toasterMessage = this.translateService.instant(ConstantVariables.SuccessMessageForEmployeeRateSheetUpdated);
            }

            if (rateSheetUpdateTriggeredAction.employeeRateSheet.employeeRateSheetId == undefined) {
                this.isNewRateSheetDetails = true;
            }

            return this.employeeService
                .updateEmployeeRateSheetDetails(rateSheetUpdateTriggeredAction.employeeRateSheet)
                .pipe(map((employeeRateSheetDetailsId: any) => {
                    if (employeeRateSheetDetailsId.success) {
                        rateSheetUpdateTriggeredAction.employeeRateSheet.employeeRateSheetId = employeeRateSheetDetailsId.data;
                        this.employeeRateSheetId = employeeRateSheetDetailsId.data;
                        if (rateSheetUpdateTriggeredAction.employeeRateSheet.isArchived) {
                            return new DeleteEmployeeRateSheetDetailsCompleted(this.employeeRateSheetId);
                        } else {
                            return new UpdateEmployeeRateSheetDetailsCompleted(this.employeeRateSheetId);
                        }
                    } else {

                        return new UpdateEmployeeRateSheetDetailsFailed(employeeRateSheetDetailsId.apiResponseMessages);
                    }
                }),
                    catchError((error) => {
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    )

    @Effect()
    insertRateSheetDetailsSuccessfulAndLoadSalaryDetails$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeRateSheetDetailsCompleted>(EmployeeRateSheetDetailsActionTypes.CreateEmployeeRateSheetDetailsCompleted),
        pipe(
            map(() => {
                return new LoadEmployeeRateSheetDetailsTriggered(this.employeeRateSheetDetailsSearchResult);
            })
        )
    );

    @Effect()
    createEmployeeRatesheetDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeRateSheetDetailsCompleted>(EmployeeRateSheetDetailsActionTypes.CreateEmployeeRateSheetDetailsCompleted),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.toasterMessage, // TODO: Change to proper toast message
                        action: this.translateService.instant(ConstantVariables.success)
                    })
            )
        )
    );

    @Effect()
    updateRateSheetDetailsSuccessfulAndLoadSalaryDetails$: Observable<Action> = this.actions$.pipe(
        ofType<UpdateEmployeeRateSheetDetailsCompleted>(EmployeeRateSheetDetailsActionTypes.UpdateEmployeeRateSheetDetailsCompleted),
        pipe(
            map(() => {
                return new GetEmployeeRateSheetDetailsByIdTriggered(this.employeeRateSheetId);
            }),
        )
    );

    @Effect()
    updateEmployeeRatesheetDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
        ofType<UpdateEmployeeRateSheetDetailsCompleted>(EmployeeRateSheetDetailsActionTypes.UpdateEmployeeRateSheetDetailsCompleted),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.toasterMessage, // TODO: Change to proper toast message
                        action: this.translateService.instant(ConstantVariables.success)
                    })
            )
        )
    );


    @Effect()
    upsertEmployeeSalaryDetailsSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<GetEmployeeRateSheetDetailsByIdCompleted>(EmployeeRateSheetDetailsActionTypes.GetEmployeeRateSheetDetailsByIdCompleted),
        pipe(
            map(() => {
                if(this.isNewRateSheetDetails){
                    return new RefreshEmployeeRateSheetDetailsList(this.employeeRateSheet);
                }
                else{
                    return new UpdateEmployeeRateSheetDetailsById({
                        employeeRateSheetUpdate: {
                            id: this.employeeRateSheet.employeeRateSheetId,
                            changes: this.employeeRateSheet
                        }
                    });
                }
                
            })
        )
    );

    // @Effect()
    // showValidationMessagesForCreateEmployeeRatesheetDetails$: Observable<Action> = this.actions$.pipe(
    //     ofType<CreateEmployeeRateSheetDetailsFailed>(EmployeeRateSheetDetailsActionTypes.CreateEmployeeRateSheetDetailsFailed),
    //     switchMap(searchAction => {
    //         return of(new ShowValidationMessages({
    //             validationMessages: searchAction.validationMessages,
    //         })
    //         )
    //     })
    // );

    @Effect()
    showValidationMessagesForUpdateEmployeeRatesheetDetails$: Observable<Action> = this.actions$.pipe(
        ofType<UpdateEmployeeRateSheetDetailsFailed>(EmployeeRateSheetDetailsActionTypes.UpdateEmployeeRateSheetDetailsFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );
    
    @Effect()
    deleteRateSheetDetailsSuccessfulAndLoadSalaryDetails$: Observable<Action> = this.actions$.pipe(
        ofType<DeleteEmployeeRateSheetDetailsCompleted>(EmployeeRateSheetDetailsActionTypes.DeleteEmployeeRateSheetDetailsCompleted),
        pipe(
            map(() => {
                return new LoadEmployeeRateSheetDetailsTriggered(this.employeeRateSheetDetailsSearchResult);
            })
        )
    );

    constructor(
        private actions$: Actions,
        private translateService: TranslateService,
        private employeeService: EmployeeService
    ) { }

}
