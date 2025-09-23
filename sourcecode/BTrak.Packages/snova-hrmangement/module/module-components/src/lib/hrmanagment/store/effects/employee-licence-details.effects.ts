import { Injectable } from "@angular/core";
import { switchMap, map, catchError } from "rxjs/operators";
import { Observable, of, pipe } from "rxjs";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";


import { EmployeeDetailsSearchModel } from "../../models/employee-details-search-model";
import { EmployeeLicenceDetailsModel } from "../../models/employee-licence-details-model";
import { EmployeeLicenceDetailsSearchModel } from "../../models/employee-licence-details-search-model";

import { EmployeeService } from "../../services/employee-service";

import { LoadEmployeeLicenceDetailsTriggered, EmployeeLicenceDetailsActionTypes, LoadEmployeeLicenceDetailsCompleted, ExceptionHandled, CreateEmployeeLicenceDetailsTriggered, CreateEmployeeLicenceDetailsCompleted, CreateEmployeeLicenceDetailsFailed, GetEmployeeLicenceDetailsByIdTriggered, GetEmployeeLicenceDetailsByIdCompleted, RefreshEmployeeLicenceDetailsList, UpdateEmployeeLicenceDetailsById, DeleteEmployeeLicenceDetailsCompleted, LoadEmployeeLicenceDetailsFailed } from "../actions/employee-licence-details.actions";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
//import { GetReferenceIdOfFile } from '@snovasys/snova-file-uploader';

@Injectable()
export class EmployeeLicenceDetailsEffects {
  employeeLicenceDetailsData: EmployeeLicenceDetailsModel;
  employeeLicenceDetailsSearchResult: EmployeeDetailsSearchModel;
  employeeLicenceDetailId: string;
  totalCount: number;
  employeeId: string;
  isNewEmployeeLicenceDetails: boolean;
  toastrMessage: string;

  @Effect()
  loadEmployeeLicenceDetails$: Observable<Action> = this.actions$.pipe(
    ofType<LoadEmployeeLicenceDetailsTriggered>(EmployeeLicenceDetailsActionTypes.LoadEmployeeLicenceDetailsTriggered),
    switchMap(searchAction => {
      this.employeeLicenceDetailsSearchResult = searchAction.employeeLicenceDetailsSearchResult;
      return this.employeeService
        .getEmployeeDetails(searchAction.employeeLicenceDetailsSearchResult)
        .pipe(map((employeeLicenceDetailsList: any) => {
          if (employeeLicenceDetailsList.success === true) {
            if(employeeLicenceDetailsList.data.employeeLicenceDetails.length > 0)
              this.totalCount = employeeLicenceDetailsList.data.employeeLicenceDetails[0].totalCount;
            return new LoadEmployeeLicenceDetailsCompleted(employeeLicenceDetailsList.data.employeeLicenceDetails);
          } else {
            return new LoadEmployeeLicenceDetailsFailed(
              employeeLicenceDetailsList.apiResponseMessages
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
  upsertEmployeeLicenceDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeLicenceDetailsTriggered>(EmployeeLicenceDetailsActionTypes.CreateEmployeeLicenceDetailsTriggered),
    switchMap(licenceDetailsTriggeredAction => {
      if (licenceDetailsTriggeredAction.employeeLicenceDetails.employeeLicenceDetailId === null || licenceDetailsTriggeredAction.employeeLicenceDetails.employeeLicenceDetailId === '' || licenceDetailsTriggeredAction.employeeLicenceDetails.employeeLicenceDetailId === undefined) {
        this.isNewEmployeeLicenceDetails = true;
        this.toastrMessage = this.translateService.instant(ConstantVariables.LicenceDetailsCreatedSuccessfully);
      } else if (
        licenceDetailsTriggeredAction.employeeLicenceDetails.employeeLicenceDetailId !== undefined &&
        licenceDetailsTriggeredAction.employeeLicenceDetails.isArchived === true
      ) {
        this.isNewEmployeeLicenceDetails = false;
        this.toastrMessage = this.translateService.instant(ConstantVariables.LicenceDetailsDeletedSuccessfully);
      } else {
        this.isNewEmployeeLicenceDetails = false;
        this.toastrMessage = this.translateService.instant(ConstantVariables.LicenceDetailsUpdatedSuccessfully);
      }
      this.employeeId = licenceDetailsTriggeredAction.employeeLicenceDetails.employeeId;
      return this.employeeService
        .upsertEmployeeLicenceDetails(licenceDetailsTriggeredAction.employeeLicenceDetails)
        .pipe(
          map((employeeLicenceDetailId: any) => {
            if (employeeLicenceDetailId.success === true) {
              licenceDetailsTriggeredAction.employeeLicenceDetails.employeeLicenceDetailId = employeeLicenceDetailId.data;
              this.employeeLicenceDetailId = employeeLicenceDetailId.data;
              if (licenceDetailsTriggeredAction.employeeLicenceDetails.isArchived)
                return new DeleteEmployeeLicenceDetailsCompleted(this.employeeLicenceDetailId);
              else
                return new CreateEmployeeLicenceDetailsCompleted(employeeLicenceDetailId.data);
            } else {
              return new CreateEmployeeLicenceDetailsFailed(employeeLicenceDetailId.apiResponseMessages);
            }
          }),
          catchError(error => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertEmployeeLicenceDetailsSuccessfulAndLoadLicenceDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeLicenceDetailsCompleted>(EmployeeLicenceDetailsActionTypes.CreateEmployeeLicenceDetailsCompleted),
    pipe(
      map(() => {
        if (this.isNewEmployeeLicenceDetails) {
          return new LoadEmployeeLicenceDetailsTriggered(this.employeeLicenceDetailsSearchResult);
        }
        else
          return new GetEmployeeLicenceDetailsByIdTriggered(this.employeeLicenceDetailId);
      }),
    )
  );

  @Effect()
  upsertEmployeeLicenceDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeLicenceDetailsCompleted>(EmployeeLicenceDetailsActionTypes.CreateEmployeeLicenceDetailsCompleted),
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
  deleteEmployeeLicenceDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteEmployeeLicenceDetailsCompleted>(EmployeeLicenceDetailsActionTypes.DeleteEmployeeLicenceDetailsCompleted),
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
  deleteEmployeeLicenceDetailsSuccessfulAndLoad$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteEmployeeLicenceDetailsCompleted>(EmployeeLicenceDetailsActionTypes.DeleteEmployeeLicenceDetailsCompleted),
    pipe(
      map(() => {
        return new LoadEmployeeLicenceDetailsTriggered(this.employeeLicenceDetailsSearchResult);
      })
    )
  );

  @Effect()
  getEmployeeLicenceDetailsById$: Observable<Action> = this.actions$.pipe(
    ofType<GetEmployeeLicenceDetailsByIdTriggered>(EmployeeLicenceDetailsActionTypes.GetEmployeeLicenceDetailsByIdTriggered),
    switchMap(searchAction => {
      let employeeLicenceDetailsSearchModel = new EmployeeLicenceDetailsSearchModel();
      employeeLicenceDetailsSearchModel.employeeId = this.employeeId;
      employeeLicenceDetailsSearchModel.employeeLicenceId = searchAction.employeeLicenceDetailId;
      return this.employeeService
        .searchEmployeeLicenseDetails(employeeLicenceDetailsSearchModel)
        .pipe(map((employeeLicenceDetailsData: any) => {
          this.employeeId = '';
          if (employeeLicenceDetailsData.success === true) {
            employeeLicenceDetailsData.data.totalCount = this.totalCount;
            this.employeeLicenceDetailsData = employeeLicenceDetailsData.data;
            return new GetEmployeeLicenceDetailsByIdCompleted(employeeLicenceDetailsData.data);
          } else {
            return new CreateEmployeeLicenceDetailsFailed(
              employeeLicenceDetailsData.apiResponseMessages
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
  upsertEmployeeLicenceDetailsSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<GetEmployeeLicenceDetailsByIdCompleted>(EmployeeLicenceDetailsActionTypes.GetEmployeeLicenceDetailsByIdCompleted),
    pipe(
      map(() => {
        return new UpdateEmployeeLicenceDetailsById({
          employeeLicenceDetailsUpdate: {
            id: this.employeeLicenceDetailsData.employeeLicenceDetailId,
            changes: this.employeeLicenceDetailsData
          }
        });
      })
    )
  );

  @Effect()
  showValidationMessagesForLoadEmployeeLicenceDetails$: Observable<Action> = this.actions$.pipe(
    ofType<LoadEmployeeLicenceDetailsFailed>(EmployeeLicenceDetailsActionTypes.LoadEmployeeLicenceDetailsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForEmployeeLicenceDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeLicenceDetailsFailed>(EmployeeLicenceDetailsActionTypes.CreateEmployeeLicenceDetailsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(EmployeeLicenceDetailsActionTypes.ExceptionHandled),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  // @Effect()
  // sendUpsertedIdAsReferenceId$: Observable<Action> = this.actions$.pipe(
  //   ofType<CreateEmployeeLicenceDetailsCompleted>(EmployeeLicenceDetailsActionTypes.CreateEmployeeLicenceDetailsCompleted),
  //   switchMap(searchAction => {
  //     return of(new GetReferenceIdOfFile(searchAction.employeeLicenceDetailId)
  //     )
  //   })
  // );

  constructor(
    private actions$: Actions,
    private employeeService: EmployeeService,
    private translateService: TranslateService
  ) { }
}