import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable, of, pipe } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { EmployeeListModel } from '../../models/employee-list.model';
import { LoadEmployeeListItemsTriggered, EmployeeListActionTypes, LoadEmployeeListItemsCompleted, LoadEmployeeListItemsDetailsFailed, LoadAllEmployeeDetailsListItemsTriggered, LoadAllEmployeeDetailsListItemsCompleted, CreateEmployeeListItemTriggered, CreateEmployeeListItemCompleted, CreateEmployeeListItemFailed, GetEmployeeListDetailsByIdTriggered, GetEmployeeListDetailsByIdCompleted, RefreshEmployeeListDetailsList } from '../actions/employee-list.actions';
import { ExceptionHandled } from '../actions/teamleads.action';
import { DashboardService } from '../../services/dashboard.service';

@Injectable()
export class EmployeeListEffects {
    isNewEmployee: boolean;
    employeeItemSearchResult: EmployeeListModel;
    toastrMessage: string;
    totalCount: number;
    employeeListDetailsData: EmployeeListModel;

    @Effect()
    loadEmployeeList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadEmployeeListItemsTriggered>(EmployeeListActionTypes.LoadEmployeeListItemsTriggered),
        switchMap(searchAction => {
            this.employeeItemSearchResult = searchAction.employeeListSearchResult;
            return this.dashboardService
                .getAllEmployees(searchAction.employeeListSearchResult)
                .pipe(map((employeeList: any) => {
                    if (employeeList.success === true) {
                        if (employeeList.data.length > 0)
                            this.totalCount = employeeList.data[0].totalCount;
                        return new LoadEmployeeListItemsCompleted(employeeList.data);
                    } else {
                        return new LoadEmployeeListItemsDetailsFailed(
                            employeeList.apiResponseMessages
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
    loadAllEmployeeList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAllEmployeeDetailsListItemsTriggered>(EmployeeListActionTypes.LoadAllEmployeeDetailsListItemsTriggered),
        switchMap(searchAction => {
            this.employeeItemSearchResult = searchAction.employeeListSearchResult;
            return this.dashboardService
                .getAllEmployeesDetails(searchAction.employeeListSearchResult)
                .pipe(map((employeeList: any) => {
                    if (employeeList.success === true) {
                        if (employeeList.data.length > 0)
                            this.totalCount = employeeList.data[0].totalCount;
                        return new LoadAllEmployeeDetailsListItemsCompleted(employeeList.data);
                    } else {
                        return new LoadEmployeeListItemsDetailsFailed(
                            employeeList.apiResponseMessages
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
    upsertEmployeeItem$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeListItemTriggered>(EmployeeListActionTypes.CreateEmployeeListItemTriggered),
        switchMap(employeeListItemTriggeredAction => {
            if (employeeListItemTriggeredAction.employee.employeeId === null || employeeListItemTriggeredAction.employee.employeeId === '' || employeeListItemTriggeredAction.employee.employeeId === undefined) {
                this.isNewEmployee = true;
                this.toastrMessage = this.translateService.instant("EMPLOYEE") + ' ' + employeeListItemTriggeredAction.employee.firstName + ' ' + employeeListItemTriggeredAction.employee.surName + ' ' + this.translateService.instant(ConstantVariables.SuccessMessageForCreated);
            }
            else if (
                employeeListItemTriggeredAction.employee.employeeId !== undefined &&
                employeeListItemTriggeredAction.employee.isArchived === true
            ) {
                this.isNewEmployee = false;
                this.toastrMessage = this.translateService.instant("EMPLOYEE") + ' ' + employeeListItemTriggeredAction.employee.firstName + ' ' + employeeListItemTriggeredAction.employee.surName + ' ' + this.translateService.instant(ConstantVariables.SuccessMessageForArchived);
            } else {
                this.isNewEmployee = false;
                this.toastrMessage = this.translateService.instant("EMPLOYEE") + ' ' + employeeListItemTriggeredAction.employee.firstName + ' ' + employeeListItemTriggeredAction.employee.surName + ' ' + this.translateService.instant(ConstantVariables.SuccessMessageForUpdated);
            }
            return this.dashboardService
                .upsertEmployees(employeeListItemTriggeredAction.employee)
                .pipe(
                    map((employeeId: any) => {
                        if (employeeId.success === true) {
                            return new CreateEmployeeListItemCompleted(employeeId.data);
                        } else {
                            return new CreateEmployeeListItemFailed(employeeId.apiResponseMessages);
                        }
                    }),
                    catchError(error => {
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    );

    @Effect()
    upsertEmployeelistSuccessfulAndLoadEmployeelist$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeListItemCompleted>(EmployeeListActionTypes.CreateEmployeeListItemCompleted),
        switchMap(searchAction => {
            return of(new LoadEmployeeListItemsTriggered(this.employeeItemSearchResult));
        })
    );

    @Effect()
    upsertEmployeeListItemSuccessful$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeListItemCompleted>(EmployeeListActionTypes.CreateEmployeeListItemCompleted),
        pipe(
            map(
                () =>
                    new SnackbarOpen({
                        message: this.toastrMessage, // TODO: Change to proper toast message
                        action: this.translateService.instant(ConstantVariables.success)
                    })
            )
        )
    );

    @Effect()
    getEmployeeListDetailsById$: Observable<Action> = this.actions$.pipe(
        ofType<GetEmployeeListDetailsByIdTriggered>(EmployeeListActionTypes.GetEmployeeListDetailsByIdTriggered),
        switchMap(searchAction => {
            return this.dashboardService
                .getEmployeeById(searchAction.employeeId)
                .pipe(map((employeeListDetailsData: any) => {
                    if (employeeListDetailsData.success === true) {
                        return new GetEmployeeListDetailsByIdCompleted(employeeListDetailsData.data);
                    } else {
                        return new CreateEmployeeListItemFailed(
                            employeeListDetailsData.apiResponseMessages
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
    refreshEmployeeList$: Observable<Action> = this.actions$.pipe(
        ofType<GetEmployeeListDetailsByIdCompleted>(EmployeeListActionTypes.GetEmployeeListDetailsByIdCompleted),
        switchMap(searchAction => {
            return of(new RefreshEmployeeListDetailsList(searchAction.employee))
        })
    );

    @Effect()
    showValidationMessagesForLoadEmployeeListDetails$: Observable<Action> = this.actions$.pipe(
        ofType<LoadEmployeeListItemsDetailsFailed>(EmployeeListActionTypes.LoadEmployeeListItemsDetailsFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    showValidationMessagesForEmployeeItem$: Observable<Action> = this.actions$.pipe(
        ofType<CreateEmployeeListItemFailed>(EmployeeListActionTypes.CreateEmployeeListItemFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    @Effect()
    exceptionHandledForEmployeeList$: Observable<Action> = this.actions$.pipe(
        ofType<ExceptionHandled>(EmployeeListActionTypes.ExceptionHandled),
        switchMap(searchAction => {
            return of(new ShowExceptionMessages({
                message: searchAction.errorMessage, // TODO: Change to proper toast message
            })
            )
        })
    );


    constructor(
        private actions$: Actions,
        private dashboardService: DashboardService,
        private translateService: TranslateService
    ) { }
}
