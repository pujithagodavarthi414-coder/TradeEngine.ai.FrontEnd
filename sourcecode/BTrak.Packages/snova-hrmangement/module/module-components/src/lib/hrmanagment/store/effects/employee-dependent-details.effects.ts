import { Injectable } from "@angular/core";
import { switchMap, map, catchError } from "rxjs/operators";
import { Observable, of, pipe } from "rxjs";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";


import { EmployeeDependentContactModel } from "../../models/employee-dependent-contact-model";
import { EmployeeDependentContactSearchModel } from "../../models/employee-dependent-contact-search-model";

import { EmployeeService } from "../../services/employee-service";

import { EmployeeDependentDetailsActionTypes, LoadEmployeeDependentDetailsTriggered, LoadEmployeeDependentDetailsCompleted, CreateEmployeeDependentDetailsTriggered, DeleteEmployeeDependentDetailsCompleted, CreateEmployeeDependentDetailsCompleted, EmployeeDependentDetailsFailed, ExceptionHandled, GetEmployeeDependentDetailsByIdTriggered, GetEmployeeDependentDetailsByIdCompleted, UpdateEmployeeDependentDetailsById } from "../actions/employee-dependent-details.actions";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()
export class EmployeeDependentDetailsEffects {
  employeeDependentDetailsData: EmployeeDependentContactModel;
  employeeDependentDetailsSearchResult: EmployeeDependentContactSearchModel;
  employeeDependentDetailId: string;
  employeeId: string;
  totalCount: number;
  isNewEmployeeDependentDetails: boolean;
  toastrMessage: string;

  @Effect()
  loadEmployeeDependentDetails$: Observable<Action> = this.actions$.pipe(
    ofType<LoadEmployeeDependentDetailsTriggered>(EmployeeDependentDetailsActionTypes.LoadEmployeeDependentDetailsTriggered),
    switchMap(searchAction => {
      this.employeeDependentDetailsSearchResult = searchAction.employeeDependentDetailsSearchResult;
      return this.employeeService
        .searchEmployeeDependentContacts(searchAction.employeeDependentDetailsSearchResult)
        .pipe(map((employeeDependentDetailsList: any) => {
          if (employeeDependentDetailsList.success === true) {
            if (employeeDependentDetailsList.data.length > 0)
              this.totalCount = employeeDependentDetailsList.data[0].totalCount;
            return new LoadEmployeeDependentDetailsCompleted(employeeDependentDetailsList.data);
          } else {
            return new EmployeeDependentDetailsFailed(
              employeeDependentDetailsList.apiResponseMessages
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
  upsertEmployeeDependentDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeDependentDetailsTriggered>(EmployeeDependentDetailsActionTypes.CreateEmployeeDependentDetailsTriggered),
    switchMap(dependentDetailsTriggeredAction => {
      if (dependentDetailsTriggeredAction.employeeDependentDetails.emergencyContactId === null || dependentDetailsTriggeredAction.employeeDependentDetails.emergencyContactId === '' || dependentDetailsTriggeredAction.employeeDependentDetails.emergencyContactId === undefined) {
        this.isNewEmployeeDependentDetails = true;
        this.toastrMessage = this.translateService.instant(ConstantVariables.DependentDetailsCreatedSuccessfully);
      } else if (
        dependentDetailsTriggeredAction.employeeDependentDetails.emergencyContactId !== undefined &&
        dependentDetailsTriggeredAction.employeeDependentDetails.isArchived === true
      ) {
        this.isNewEmployeeDependentDetails = false;
        this.toastrMessage = this.translateService.instant(ConstantVariables.DependentDetailsDeletedSuccessfully);
      } else {
        this.isNewEmployeeDependentDetails = false;
        this.toastrMessage = this.translateService.instant(ConstantVariables.DependentDetailsUpdatedSuccessfully);
      }
      this.employeeId = dependentDetailsTriggeredAction.employeeDependentDetails.employeeId;
      return this.employeeService
        .upsertEmployeeDependentContact(dependentDetailsTriggeredAction.employeeDependentDetails)
        .pipe(
          map((employeeDependentDetailId: any) => {
            if (employeeDependentDetailId.success === true) {
              dependentDetailsTriggeredAction.employeeDependentDetails.emergencyContactId = employeeDependentDetailId.data;
              this.employeeDependentDetailId = employeeDependentDetailId.data;
              if (dependentDetailsTriggeredAction.employeeDependentDetails.isArchived)
                return new DeleteEmployeeDependentDetailsCompleted(this.employeeDependentDetailId);
              else
                return new CreateEmployeeDependentDetailsCompleted(employeeDependentDetailId.data);
            } else {
              return new EmployeeDependentDetailsFailed(employeeDependentDetailId.apiResponseMessages);
            }
          }),
          catchError(error => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertEmployeeDependentDetailsSuccessfulAndLoadDependentDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeDependentDetailsCompleted>(EmployeeDependentDetailsActionTypes.CreateEmployeeDependentDetailsCompleted),
    pipe(
      map(() => {
        if (this.isNewEmployeeDependentDetails) {
          return new LoadEmployeeDependentDetailsTriggered(this.employeeDependentDetailsSearchResult);
        }
        else
          return new GetEmployeeDependentDetailsByIdTriggered(this.employeeDependentDetailId);
      }),
    )
  );

  @Effect()
  upsertEmployeeDependentDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeDependentDetailsCompleted>(EmployeeDependentDetailsActionTypes.CreateEmployeeDependentDetailsCompleted),
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
  deleteEmployeeDependentDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteEmployeeDependentDetailsCompleted>(EmployeeDependentDetailsActionTypes.DeleteEmployeeDependentDetailsCompleted),
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
  deleteEmployeeDependentDetailsSuccessfulAndLoad$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteEmployeeDependentDetailsCompleted>(EmployeeDependentDetailsActionTypes.DeleteEmployeeDependentDetailsCompleted),
    pipe(
      map(() => {
        return new LoadEmployeeDependentDetailsTriggered(this.employeeDependentDetailsSearchResult);
      })
    )
  );

  @Effect()
  getEmployeeDependentDetailsById$: Observable<Action> = this.actions$.pipe(
    ofType<GetEmployeeDependentDetailsByIdTriggered>(EmployeeDependentDetailsActionTypes.GetEmployeeDependentDetailsByIdTriggered),
    switchMap(searchAction => {
      let employeeDependentDetailsSearchModel = new EmployeeDependentContactSearchModel();
      employeeDependentDetailsSearchModel.employeeId = this.employeeId;
      employeeDependentDetailsSearchModel.isEmergencyContact = false;
      employeeDependentDetailsSearchModel.isDependentContact = true;
      employeeDependentDetailsSearchModel.employeeDependentId = searchAction.employeeDependentDetailId;
      return this.employeeService
        .getEmployeeDependentContacts(employeeDependentDetailsSearchModel)
        .pipe(map((employeeDependentDetailsData: any) => {
          this.employeeId = '';
          if (employeeDependentDetailsData.success === true) {
            employeeDependentDetailsData.data.totalCount = this.totalCount;
            this.employeeDependentDetailsData = employeeDependentDetailsData.data;
            return new GetEmployeeDependentDetailsByIdCompleted(employeeDependentDetailsData.data);
          } else {
            return new EmployeeDependentDetailsFailed(
              employeeDependentDetailsData.apiResponseMessages
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
  upsertEmployeeDependentDetailsSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<GetEmployeeDependentDetailsByIdCompleted>(EmployeeDependentDetailsActionTypes.GetEmployeeDependentDetailsByIdCompleted),
    pipe(
      map(() => {
        return new UpdateEmployeeDependentDetailsById({
          employeeDependentDetailsUpdate: {
            id: this.employeeDependentDetailsData.employeeDependentId,
            changes: this.employeeDependentDetailsData
          }
        });
      })
    )
  );

  @Effect()
  showValidationMessagesForEmployeeDependentDetails$: Observable<Action> = this.actions$.pipe(
    ofType<EmployeeDependentDetailsFailed>(EmployeeDependentDetailsActionTypes.EmployeeDependentDetailsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(EmployeeDependentDetailsActionTypes.ExceptionHandled),
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