import { Injectable } from "@angular/core";
import { switchMap, map, catchError } from "rxjs/operators";
import { Observable, of, pipe } from "rxjs";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";


import { EmployeeDetailsSearchModel } from "../../models/employee-details-search-model";

import { EmployeeListModel } from "../../models/employee-model";

import { EmployeeService } from "../../services/employee-service";

import { LoadEmployeeListItemsTriggered } from "../actions/employee-list.action";
import { EmployeePersonalDetailsActionTypes, CreateEmployeePersonalDetailsTriggered, ExceptionHandled, CreateEmployeePersonalDetailsCompleted, CreateEmployeePersonalDetailsFailed, GetEmployeeDetailsByIdTriggered, GetEmployeeDetailsByIdCompleted, GetEmployeeDetailsByIdFailed } from "../actions/employee-personal-details.actions";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
//import { GetReferenceIdOfFile } from '@snovasys/snova-file-uploader';

@Injectable()
export class EmployeePersonalDetailsEffects {
  isNewEmployeePersonalDetails: boolean;
  employeePersonalDetailId: string;
  toastrMessage: string;

  @Effect()
  upsertEmployeePersonalDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeePersonalDetailsTriggered>(EmployeePersonalDetailsActionTypes.CreateEmployeePersonalDetailsTriggered),
    switchMap(personalDetailsTriggeredAction => {
      if (personalDetailsTriggeredAction.employeePersonalDetails.employeeId === null || personalDetailsTriggeredAction.employeePersonalDetails.employeeId === '' || personalDetailsTriggeredAction.employeePersonalDetails.employeeId === undefined) {
        this.isNewEmployeePersonalDetails = true;
        this.toastrMessage = this.translateService.instant(ConstantVariables.PersonalDetailsCreatedSuccessfully);
      } else {
        this.isNewEmployeePersonalDetails = false;
        this.toastrMessage = this.translateService.instant(ConstantVariables.PersonalDetailsUpdatedSuccessfully);
      }
      return this.employeeService
        .upsertEmployeePersonalDetails(personalDetailsTriggeredAction.employeePersonalDetails)
        .pipe(
          map((employeePersonalDetailId: any) => {
            if (employeePersonalDetailId.success === true) {
              //personalDetailsTriggeredAction.employeePersonalDetails.employeeId = employeePersonalDetailId.data;
              this.employeePersonalDetailId = employeePersonalDetailId.data;
              return new CreateEmployeePersonalDetailsCompleted(employeePersonalDetailId.data);
            } else {
              return new CreateEmployeePersonalDetailsFailed(employeePersonalDetailId.apiResponseMessages);
            }
          }),
          catchError(error => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertEmployeePersonalDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeePersonalDetailsCompleted>(EmployeePersonalDetailsActionTypes.CreateEmployeePersonalDetailsCompleted),
    pipe(
      map(() => new SnackbarOpen({
        message: this.toastrMessage, // TODO: Change to proper toast message
        action: this.translateService.instant(ConstantVariables.success)
      })
      )
    )
  );

  @Effect()
  upsertEmployeePersonalDetailsSuccessfulAndLoadGetAllEmployees$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeePersonalDetailsCompleted>(EmployeePersonalDetailsActionTypes.CreateEmployeePersonalDetailsCompleted),
    pipe(
      map(() => {
        let employeeListModel = new EmployeeListModel();
        return new LoadEmployeeListItemsTriggered(employeeListModel);
      }),
    )
  );

  @Effect()
  getEmployeePersonalDetailsAfterSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeePersonalDetailsCompleted>(EmployeePersonalDetailsActionTypes.CreateEmployeePersonalDetailsCompleted),
    pipe(
      map(() => {
        let employeeDetailsSearchModel = new EmployeeDetailsSearchModel();
        employeeDetailsSearchModel.employeeId = this.employeePersonalDetailId;
        return new GetEmployeeDetailsByIdTriggered(employeeDetailsSearchModel);
      }),
    )
  );

  @Effect()
  getEmployeePersonalDetailsById$: Observable<Action> = this.actions$.pipe(
    ofType<GetEmployeeDetailsByIdTriggered>(EmployeePersonalDetailsActionTypes.GetEmployeeDetailsByIdTriggered),
    switchMap(personalDetailsTriggeredAction => {
      return this.employeeService
        .getEmployeeDetails(personalDetailsTriggeredAction.employeeDetailsSearchModel)
        .pipe(
          map((employeePersonalDetailsData: any) => {
            if (employeePersonalDetailsData.success === true) {
              return new GetEmployeeDetailsByIdCompleted(employeePersonalDetailsData.data.employeePersonalDetails);
            } else {
              return new GetEmployeeDetailsByIdFailed(employeePersonalDetailsData.apiResponseMessages);
            }
          }),
          catchError(error => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  showValidationMessagesForEmployeePersonalDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeePersonalDetailsFailed>(EmployeePersonalDetailsActionTypes.CreateEmployeePersonalDetailsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForEmployeePersonalDetailsById$: Observable<Action> = this.actions$.pipe(
    ofType<GetEmployeeDetailsByIdFailed>(EmployeePersonalDetailsActionTypes.GetEmployeeDetailsByIdFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(EmployeePersonalDetailsActionTypes.ExceptionHandled),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  // @Effect()
  // sendUpsertedIdAsReferenceId$: Observable<Action> = this.actions$.pipe(
  //   ofType<CreateEmployeePersonalDetailsCompleted>(EmployeePersonalDetailsActionTypes.CreateEmployeePersonalDetailsCompleted),
  //   switchMap(searchAction => {
  //     return of(new GetReferenceIdOfFile(searchAction.employeePersonalDetailsId)
  //     )
  //   })
  // );

  constructor(
    private actions$: Actions,
    private employeeService: EmployeeService,
    private translateService: TranslateService
  ) { }
}