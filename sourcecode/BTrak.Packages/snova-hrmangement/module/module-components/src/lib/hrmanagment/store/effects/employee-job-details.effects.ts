import { Injectable } from "@angular/core";
import { switchMap, map, catchError } from "rxjs/operators";
import { Observable, of, pipe } from "rxjs";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";


import { EmployeeDetailsSearchModel } from "../../models/employee-details-search-model";

import { EmployeeService } from "../../services/employee-service";

import { CreateEmployeeJobDetailsTriggered, CreateEmployeeJobDetailsCompleted, CreateEmployeeJobDetailsFailed, GetEmployeeJobDetailsByIdTriggered, GetEmployeeJobDetailsByIdCompleted, GetEmployeeJobDetailsByIdFailed, ExceptionHandled, EmployeeJobDetailsActionTypes } from "../actions/employee-job-details.action";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()
export class EmployeeJobDetailsEffects {
  isNewEmployeeJobDetails: boolean;
  employeeId: string;
  toastrMessage: string;

  @Effect()
  upsertEmployeeJobDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeJobDetailsTriggered>(EmployeeJobDetailsActionTypes.CreateEmployeeJobDetailsTriggered),
    switchMap(searchAction => {
      if (searchAction.employeeJobDetails.employeeJobDetailId === null || searchAction.employeeJobDetails.employeeJobDetailId === '' || searchAction.employeeJobDetails.employeeJobDetailId === undefined) {
        this.isNewEmployeeJobDetails = true;
        this.toastrMessage = this.translateService.instant(ConstantVariables.JobDetailsCreatedSuccessfully);
      } else {
        this.isNewEmployeeJobDetails = false;
        this.toastrMessage = this.translateService.instant(ConstantVariables.JobDetailsUpdatedSuccessfully);
      }
      return this.employeeService
        .upsertEmployeeJobDetails(searchAction.employeeJobDetails)
        .pipe(
          map((employeeJobDetailId: any) => {
            if (employeeJobDetailId.success === true) {
              //searchAction.employeeJobDetails.employeeId = employeeJobDetailId.data;
              this.employeeId = searchAction.employeeJobDetails.employeeId;
              return new CreateEmployeeJobDetailsCompleted(employeeJobDetailId.data);
            } else {
              return new CreateEmployeeJobDetailsFailed(employeeJobDetailId.apiResponseMessages);
            }
          }),
          catchError(error => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertEmployeeJobDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeJobDetailsCompleted>(EmployeeJobDetailsActionTypes.CreateEmployeeJobDetailsCompleted),
    pipe(
      map(() => new SnackbarOpen({
        message: this.toastrMessage, // TODO: Change to proper toast message
        action: this.translateService.instant(ConstantVariables.success)
      })
      )
    )
  );

  @Effect()
  getEmployeeJobDetailsAfterSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeJobDetailsCompleted>(EmployeeJobDetailsActionTypes.CreateEmployeeJobDetailsCompleted),
    pipe(
      map(() => {
        let employeeJobDetailsSearchModel = new EmployeeDetailsSearchModel();
        employeeJobDetailsSearchModel.employeeId = this.employeeId;
        employeeJobDetailsSearchModel.employeeDetailType = "JobDetails";
        return new GetEmployeeJobDetailsByIdTriggered(employeeJobDetailsSearchModel);
      }),
    )
  );

  @Effect()
  getEmployeeJobDetailsById$: Observable<Action> = this.actions$.pipe(
    ofType<GetEmployeeJobDetailsByIdTriggered>(EmployeeJobDetailsActionTypes.GetEmployeeJobDetailsByIdTriggered),
    switchMap(searchAction => {
      return this.employeeService
        .getEmployeeDetails(searchAction.employeeJobDetailsSearchModel)
        .pipe(
          map((employeeJobDetailsData: any) => {
            if (employeeJobDetailsData.success === true) {
              return new GetEmployeeJobDetailsByIdCompleted(employeeJobDetailsData.data.employeeJobDetails);
            } else {
              return new GetEmployeeJobDetailsByIdFailed(employeeJobDetailsData.apiResponseMessages);
            }
          }),
          catchError(error => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  showValidationMessagesForEmployeeJobDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeJobDetailsFailed>(EmployeeJobDetailsActionTypes.CreateEmployeeJobDetailsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForEmployeeJobDetailsById$: Observable<Action> = this.actions$.pipe(
    ofType<GetEmployeeJobDetailsByIdFailed>(EmployeeJobDetailsActionTypes.GetEmployeeJobDetailsByIdFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(EmployeeJobDetailsActionTypes.ExceptionHandled),
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