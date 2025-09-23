import { Injectable } from "@angular/core";
import { switchMap, map, catchError } from "rxjs/operators";
import { Observable, of, pipe } from "rxjs";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core"


import { EmployeeDetailsSearchModel } from "../../models/employee-details-search-model";

import { EmployeeService } from "../../services/employee-service";

import { CreateEmployeeContactDetailsTriggered, EmployeeContactDetailsActionTypes, CreateEmployeeContactDetailsCompleted, GetEmployeeContactDetailsTriggered, GetEmployeeContactDetailsCompleted, GetEmployeeContactDetailsFailed, ExceptionHandled, CreateEmployeeContactDetailsFailed } from "../actions/employee-contact-details.actions";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowExceptionMessages, ShowValidationMessages } from '../actions/notification-validator.action';

@Injectable()
export class EmployeeContactDetailsEffects {
  isNewEmployeeContactDetails: boolean;
  toastrMessage: string;
  employeeId: string;

  @Effect()
  upsertEmployeeContactDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeContactDetailsTriggered>(EmployeeContactDetailsActionTypes.CreateEmployeeContactDetailsTriggered),
    switchMap(contactDetailsTriggeredAction => {
      if (contactDetailsTriggeredAction.employeeContactDetails.employeeId === null || contactDetailsTriggeredAction.employeeContactDetails.employeeId === '' || contactDetailsTriggeredAction.employeeContactDetails.employeeId === undefined) {
        this.isNewEmployeeContactDetails = true;
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForContactDetailsCreated);
      } else {
        this.isNewEmployeeContactDetails = false;
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForContactDetailsUpdated);
      }
      return this.employeeService
        .upsertEmployeeContactDetails(contactDetailsTriggeredAction.employeeContactDetails)
        .pipe(
          map((employeeContactDetailId: any) => {
            if (employeeContactDetailId.success === true) {
              this.employeeId = contactDetailsTriggeredAction.employeeContactDetails.employeeId;
              return new CreateEmployeeContactDetailsCompleted(employeeContactDetailId.data);
            } else {
              return new CreateEmployeeContactDetailsFailed(employeeContactDetailId.apiResponseMessages);
            }
          }),
          catchError(error => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  getEmployeeContactDetailsAfterSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeContactDetailsCompleted>(EmployeeContactDetailsActionTypes.CreateEmployeeContactDetailsCompleted),
    pipe(
      map(() => {
        let employeeDetailsSearchModel = new EmployeeDetailsSearchModel();
        employeeDetailsSearchModel.employeeId = this.employeeId;
        employeeDetailsSearchModel.employeeDetailType = 'ContactDetails';
        return new GetEmployeeContactDetailsTriggered(employeeDetailsSearchModel);
      }),
    )
  );

  @Effect()
  upsertEmployeeContactDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeContactDetailsCompleted>(EmployeeContactDetailsActionTypes.CreateEmployeeContactDetailsCompleted),
    pipe(
      map(() => new SnackbarOpen({
        message: this.toastrMessage, // TODO: Change to proper toast message
        action: this.translateService.instant(ConstantVariables.success)
      })
      )
    )
  );

  @Effect()
  getEmployeeContactDetails$: Observable<Action> = this.actions$.pipe(
    ofType<GetEmployeeContactDetailsTriggered>(EmployeeContactDetailsActionTypes.GetEmployeeContactDetailsTriggered),
    switchMap(ContactDetailsTriggeredAction => {
      return this.employeeService
        .getEmployeeDetails(ContactDetailsTriggeredAction.employeeDetailsSearchModel)
        .pipe(
          map((employeeContactDetailsData: any) => {
            if (employeeContactDetailsData.success === true) {
              return new GetEmployeeContactDetailsCompleted(employeeContactDetailsData.data.employeeContactDetails);
            } else {
              return new GetEmployeeContactDetailsFailed(employeeContactDetailsData.apiResponseMessages);
            }
          }),
          catchError(error => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  showValidationMessagesForEmployeeContactDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeContactDetailsFailed>(EmployeeContactDetailsActionTypes.CreateEmployeeContactDetailsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForEmployeeContactDetailsById$: Observable<Action> = this.actions$.pipe(
    ofType<GetEmployeeContactDetailsFailed>(EmployeeContactDetailsActionTypes.GetEmployeeContactDetailsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(EmployeeContactDetailsActionTypes.ExceptionHandled),
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