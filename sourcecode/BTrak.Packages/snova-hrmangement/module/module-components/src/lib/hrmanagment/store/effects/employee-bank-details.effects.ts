import { Injectable } from "@angular/core";
import { switchMap, map, catchError } from "rxjs/operators";
import { Observable, of, pipe } from "rxjs";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";


import { EmployeeBankDetailsModel } from "../../models/employee-Bank-details-model";

import { EmployeeService } from "../../services/employee-service";
import { TranslateService } from "@ngx-translate/core"

import { LoadEmployeeBankDetailsTriggered, EmployeeBankDetailsActionTypes, LoadEmployeeBankDetailsCompleted, ExceptionHandled, CreateEmployeeBankDetailsTriggered, DeleteEmployeeBankDetailsCompleted, CreateEmployeeBankDetailsCompleted, CreateEmployeeBankDetailsFailed, GetEmployeeBankDetailsByIdTriggered, GetEmployeeBankDetailsByIdCompleted, UpdateEmployeeBankDetailsById, LoadEmployeeBankDetailsFailed, GetEmployeeBankDetailsByIdFailed } from "../actions/employee-bank-details.actions";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()
export class EmployeeBankDetailsEffects {
  employeeBankDetailsData: EmployeeBankDetailsModel;
  employeeBankDetailsSearchResult: EmployeeBankDetailsModel;
  employeeBankDetailId: string;
  employeeId: string;
  totalCount: number;
  isNewEmployeeBankDetails: boolean;
  toastrMessage: string;

  @Effect()
  loadEmployeeBankDetails$: Observable<Action> = this.actions$.pipe(
    ofType<LoadEmployeeBankDetailsTriggered>(EmployeeBankDetailsActionTypes.LoadEmployeeBankDetailsTriggered),
    switchMap(searchAction => {
      this.employeeBankDetailsSearchResult = searchAction.employeeBankDetailsSearchResult;
      return this.employeeService
        .getAllBankDetails(searchAction.employeeBankDetailsSearchResult)
        .pipe(map((employeeBankDetailsList: any) => {
          if (employeeBankDetailsList.success === true) {
            if(employeeBankDetailsList.data.length > 0)
                this.totalCount = employeeBankDetailsList.data[0].totalCount;
            return new LoadEmployeeBankDetailsCompleted(employeeBankDetailsList.data);
        } else {
            return new LoadEmployeeBankDetailsFailed(
              employeeBankDetailsList.apiResponseMessages
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
  upsertEmployeeBankDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeBankDetailsTriggered>(EmployeeBankDetailsActionTypes.CreateEmployeeBankDetailsTriggered),
    switchMap(BankDetailsTriggeredAction => {
      if (BankDetailsTriggeredAction.employeeBankDetails.employeeBankId === null || BankDetailsTriggeredAction.employeeBankDetails.employeeBankId === '' || BankDetailsTriggeredAction.employeeBankDetails.employeeBankId === undefined) {
        this.isNewEmployeeBankDetails = true;
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForBankDetailsCreated);
      } else if (
        BankDetailsTriggeredAction.employeeBankDetails.employeeBankId !== undefined &&
        BankDetailsTriggeredAction.employeeBankDetails.isArchived === true
      ) {
        this.isNewEmployeeBankDetails = false;
        this.toastrMessage =this.translateService.instant(ConstantVariables.SuccessMessageForBankDetailsDeleted);
      } else {
        this.isNewEmployeeBankDetails = false;
        this.toastrMessage =this.translateService.instant(ConstantVariables.SuccessMessageForBankDetailsUpdated);
      }
      this.employeeId = BankDetailsTriggeredAction.employeeBankDetails.employeeId;
      return this.employeeService
        .upsertEmployeeBankDetails(BankDetailsTriggeredAction.employeeBankDetails)
        .pipe(
          map((employeeBankDetailId: any) => {
            if (employeeBankDetailId.success === true) {
              BankDetailsTriggeredAction.employeeBankDetails.employeeBankId = employeeBankDetailId.data;
              this.employeeBankDetailId = employeeBankDetailId.data;
              if (BankDetailsTriggeredAction.employeeBankDetails.isArchived)
                return new DeleteEmployeeBankDetailsCompleted(this.employeeBankDetailId);
              else
                return new CreateEmployeeBankDetailsCompleted(employeeBankDetailId.data);
            } else {
              return new CreateEmployeeBankDetailsFailed(employeeBankDetailId.apiResponseMessages);
            }
          }),
          catchError(error => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertEmployeeBankDetailsSuccessfulAndLoadBankDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeBankDetailsCompleted>(EmployeeBankDetailsActionTypes.CreateEmployeeBankDetailsCompleted),
    pipe(
      map(() => {
          return new LoadEmployeeBankDetailsTriggered(this.employeeBankDetailsSearchResult);
      }),
    )
  );

  @Effect()
  upsertEmployeeBankDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeBankDetailsCompleted>(EmployeeBankDetailsActionTypes.CreateEmployeeBankDetailsCompleted),
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
  deleteEmployeeBankDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteEmployeeBankDetailsCompleted>(EmployeeBankDetailsActionTypes.DeleteEmployeeBankDetailsCompleted),
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
  deleteEmployeeBankDetailsSuccessfulAndLoad$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteEmployeeBankDetailsCompleted>(EmployeeBankDetailsActionTypes.DeleteEmployeeBankDetailsCompleted),
    pipe(
      map(() => {
        return new LoadEmployeeBankDetailsTriggered(this.employeeBankDetailsSearchResult);
      })
    )
  );

  @Effect()
  getEmployeeBankDetailsById$: Observable<Action> = this.actions$.pipe(
    ofType<GetEmployeeBankDetailsByIdTriggered>(EmployeeBankDetailsActionTypes.GetEmployeeBankDetailsByIdTriggered),
    switchMap(searchAction => {
      let employeeBankDetailsSearchModel = new EmployeeBankDetailsModel();
      employeeBankDetailsSearchModel.employeeId = this.employeeId;
      employeeBankDetailsSearchModel.isArchived = false;
      employeeBankDetailsSearchModel.employeeBankId = searchAction.employeeBankDetailId;
      return this.employeeService
        .getAllBankDetails(employeeBankDetailsSearchModel)
        .pipe(map((employeeBankDetailsData: any) => {
          this.employeeId = '';
          if (employeeBankDetailsData.success === true) {
            employeeBankDetailsData.data.totalCount = this.totalCount;
            this.employeeBankDetailsData = employeeBankDetailsData.data;
            return new GetEmployeeBankDetailsByIdCompleted(employeeBankDetailsData.data);
          } else {
            return new GetEmployeeBankDetailsByIdFailed(
              employeeBankDetailsData.apiResponseMessages
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
  showValidationMessagesForGetEmployeeBankDetails$: Observable<Action> = this.actions$.pipe(
      ofType<GetEmployeeBankDetailsByIdFailed>(EmployeeBankDetailsActionTypes.GetEmployeeBankDetailsByIdFailed),
      switchMap(searchAction => {
          return of(new ShowValidationMessages({
              validationMessages: searchAction.validationMessages,
          })
          )
      })
  );

  @Effect()
  upsertEmployeeBankDetailsSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<GetEmployeeBankDetailsByIdCompleted>(EmployeeBankDetailsActionTypes.GetEmployeeBankDetailsByIdCompleted),
    pipe(
      map(() => {
        return new UpdateEmployeeBankDetailsById({
          employeeBankDetailsUpdate: {
            id: this.employeeBankDetailsData.employeeBankId,
            changes: this.employeeBankDetailsData
          }
        });
      })
    )
  );

  @Effect()
    showValidationMessagesForLoadEmployeeBankDetails$: Observable<Action> = this.actions$.pipe(
        ofType<LoadEmployeeBankDetailsFailed>(EmployeeBankDetailsActionTypes.LoadEmployeeBankDetailsFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

  @Effect()
  showValidationMessagesForEmployeeBankDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeBankDetailsFailed>(EmployeeBankDetailsActionTypes.CreateEmployeeBankDetailsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(EmployeeBankDetailsActionTypes.ExceptionHandled),
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
    private employeeService: EmployeeService
  ) { }
}