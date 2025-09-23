import { Injectable } from "@angular/core";
import { switchMap, map, catchError } from "rxjs/operators";
import { Observable, of, pipe } from "rxjs";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";


import { EmployeeDetailsSearchModel } from "../../models/employee-details-search-model";
import { EmployeeSalaryDetailsModel } from "../../models/employee-Salary-details-model";
import { EmployeeSalaryDetailsSearchModel } from "../../models/employee-Salary-details-search-model";

import { EmployeeService } from "../../services/employee-service";
import { TranslateService } from "@ngx-translate/core"

import { LoadEmployeeSalaryDetailsTriggered, EmployeeSalaryDetailsActionTypes, LoadEmployeeSalaryDetailsCompleted, ExceptionHandled, CreateEmployeeSalaryDetailsTriggered, DeleteEmployeeSalaryDetailsCompleted, CreateEmployeeSalaryDetailsCompleted, CreateEmployeeSalaryDetailsFailed, GetEmployeeSalaryDetailsByIdTriggered, GetEmployeeSalaryDetailsByIdCompleted, UpdateEmployeeSalaryDetailsById, LoadEmployeeSalaryDetailsFailed, GetEmployeeSalaryDetailsByIdFailed } from "../actions/employee-salary-details.actions";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
//import { GetReferenceIdOfFile } from '@snovasys/snova-file-uploader';

@Injectable()
export class EmployeeSalaryDetailsEffects {
  employeeSalaryDetailsData: EmployeeSalaryDetailsModel;
  employeeSalaryDetailsSearchResult: EmployeeDetailsSearchModel;
  employeeSalaryDetailId: string;
  employeeId: string;
  totalCount: number;
  isNewEmployeeSalaryDetails: boolean;
  toastrMessage: string;

  @Effect()
  loadEmployeeSalaryDetails$: Observable<Action> = this.actions$.pipe(
    ofType<LoadEmployeeSalaryDetailsTriggered>(EmployeeSalaryDetailsActionTypes.LoadEmployeeSalaryDetailsTriggered),
    switchMap(searchAction => {
      this.employeeSalaryDetailsSearchResult = searchAction.employeeSalaryDetailsSearchResult;
      return this.employeeService
        .getEmployeeDetails(searchAction.employeeSalaryDetailsSearchResult)
        .pipe(map((employeeSalaryDetailsList: any) => {
          if (employeeSalaryDetailsList.success === true) {
            if(employeeSalaryDetailsList.data.employeeSalaryDetails.length > 0)
                this.totalCount = employeeSalaryDetailsList.data.employeeSalaryDetails[0].totalCount;
            return new LoadEmployeeSalaryDetailsCompleted(employeeSalaryDetailsList.data.employeeSalaryDetails);
        } else {
            return new LoadEmployeeSalaryDetailsFailed(
              employeeSalaryDetailsList.apiResponseMessages
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
  upsertEmployeeSalaryDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeSalaryDetailsTriggered>(EmployeeSalaryDetailsActionTypes.CreateEmployeeSalaryDetailsTriggered),
    switchMap(SalaryDetailsTriggeredAction => {
      if (SalaryDetailsTriggeredAction.employeeSalaryDetails.employeeSalaryDetailId === null || SalaryDetailsTriggeredAction.employeeSalaryDetails.employeeSalaryDetailId === '' || SalaryDetailsTriggeredAction.employeeSalaryDetails.employeeSalaryDetailId === undefined) {
        this.isNewEmployeeSalaryDetails = true;
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForSalaryDetailsCreated);
      } else if (
        SalaryDetailsTriggeredAction.employeeSalaryDetails.employeeSalaryDetailId !== undefined &&
        SalaryDetailsTriggeredAction.employeeSalaryDetails.isArchived === true
      ) {
        this.isNewEmployeeSalaryDetails = false;
        this.toastrMessage =this.translateService.instant(ConstantVariables.SuccessMessageForSalaryDetailsDeleted);
      } else {
        this.isNewEmployeeSalaryDetails = false;
        this.toastrMessage =this.translateService.instant(ConstantVariables.SuccessMessageForSalaryDetailsUpdated);
      }
      this.employeeId = SalaryDetailsTriggeredAction.employeeSalaryDetails.employeeId;
      return this.employeeService
        .upsertEmployeeSalaryDetails(SalaryDetailsTriggeredAction.employeeSalaryDetails)
        .pipe(
          map((employeeSalaryDetailId: any) => {
            if (employeeSalaryDetailId.success === true) {
              SalaryDetailsTriggeredAction.employeeSalaryDetails.employeeSalaryDetailId = employeeSalaryDetailId.data;
              this.employeeSalaryDetailId = employeeSalaryDetailId.data;
              if (SalaryDetailsTriggeredAction.employeeSalaryDetails.isArchived)
                return new DeleteEmployeeSalaryDetailsCompleted(this.employeeSalaryDetailId);
              else
                return new CreateEmployeeSalaryDetailsCompleted(employeeSalaryDetailId.data);
            } else {
              return new CreateEmployeeSalaryDetailsFailed(employeeSalaryDetailId.apiResponseMessages);
            }
          }),
          catchError(error => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertEmployeeSalaryDetailsSuccessfulAndLoadSalaryDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeSalaryDetailsCompleted>(EmployeeSalaryDetailsActionTypes.CreateEmployeeSalaryDetailsCompleted),
    pipe(
      map(() => {
        if (this.isNewEmployeeSalaryDetails) {
          return new LoadEmployeeSalaryDetailsTriggered(this.employeeSalaryDetailsSearchResult);
        }
        else
          return new GetEmployeeSalaryDetailsByIdTriggered(this.employeeSalaryDetailId);
      }),
    )
  );

  @Effect()
  upsertEmployeeSalaryDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeSalaryDetailsCompleted>(EmployeeSalaryDetailsActionTypes.CreateEmployeeSalaryDetailsCompleted),
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
  deleteEmployeeSalaryDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteEmployeeSalaryDetailsCompleted>(EmployeeSalaryDetailsActionTypes.DeleteEmployeeSalaryDetailsCompleted),
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
  deleteEmployeeSalaryDetailsSuccessfulAndLoad$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteEmployeeSalaryDetailsCompleted>(EmployeeSalaryDetailsActionTypes.DeleteEmployeeSalaryDetailsCompleted),
    pipe(
      map(() => {
        return new LoadEmployeeSalaryDetailsTriggered(this.employeeSalaryDetailsSearchResult);
      })
    )
  );

  @Effect()
  getEmployeeSalaryDetailsById$: Observable<Action> = this.actions$.pipe(
    ofType<GetEmployeeSalaryDetailsByIdTriggered>(EmployeeSalaryDetailsActionTypes.GetEmployeeSalaryDetailsByIdTriggered),
    switchMap(searchAction => {
      let employeeSalaryDetailsSearchModel = new EmployeeSalaryDetailsSearchModel();
      employeeSalaryDetailsSearchModel.employeeId = this.employeeId;
      employeeSalaryDetailsSearchModel.isArchived = false;
      employeeSalaryDetailsSearchModel.employeeSalaryDetailId = searchAction.employeeSalaryDetailId;
      return this.employeeService
        .searchEmployeeSalaryDetails(employeeSalaryDetailsSearchModel)
        .pipe(map((employeeSalaryDetailsData: any) => {
          this.employeeId = '';
          if (employeeSalaryDetailsData.success === true) {
            employeeSalaryDetailsData.data.totalCount = this.totalCount;
            this.employeeSalaryDetailsData = employeeSalaryDetailsData.data;
            return new GetEmployeeSalaryDetailsByIdCompleted(employeeSalaryDetailsData.data);
          } else {
            return new GetEmployeeSalaryDetailsByIdFailed(
              employeeSalaryDetailsData.apiResponseMessages
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
  showValidationMessagesForGetEmployeeSalaryDetails$: Observable<Action> = this.actions$.pipe(
      ofType<GetEmployeeSalaryDetailsByIdFailed>(EmployeeSalaryDetailsActionTypes.GetEmployeeSalaryDetailsByIdFailed),
      switchMap(searchAction => {
          return of(new ShowValidationMessages({
              validationMessages: searchAction.validationMessages,
          })
          )
      })
  );

  @Effect()
  upsertEmployeeSalaryDetailsSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<GetEmployeeSalaryDetailsByIdCompleted>(EmployeeSalaryDetailsActionTypes.GetEmployeeSalaryDetailsByIdCompleted),
    pipe(
      map(() => {
        return new UpdateEmployeeSalaryDetailsById({
          employeeSalaryDetailsUpdate: {
            id: this.employeeSalaryDetailsData.employeeSalaryDetailId,
            changes: this.employeeSalaryDetailsData
          }
        });
      })
    )
  );

  @Effect()
    showValidationMessagesForLoadEmployeeSalaryDetails$: Observable<Action> = this.actions$.pipe(
        ofType<LoadEmployeeSalaryDetailsFailed>(EmployeeSalaryDetailsActionTypes.LoadEmployeeSalaryDetailsFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

  @Effect()
  showValidationMessagesForEmployeeSalaryDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeSalaryDetailsFailed>(EmployeeSalaryDetailsActionTypes.CreateEmployeeSalaryDetailsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(EmployeeSalaryDetailsActionTypes.ExceptionHandled),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  // @Effect()
  // sendUpsertedIdAsReferenceId$: Observable<Action> = this.actions$.pipe(
  //   ofType<CreateEmployeeSalaryDetailsCompleted>(EmployeeSalaryDetailsActionTypes.CreateEmployeeSalaryDetailsCompleted),
  //   switchMap(searchAction => {
  //     return of(new GetReferenceIdOfFile(searchAction.employeeSalaryDetailId)
  //     )
  //   })
  // )

  constructor(
    private actions$: Actions,
    private translateService: TranslateService,
    private employeeService: EmployeeService
  ) { }
}