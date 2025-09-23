import { Injectable } from "@angular/core";
import { switchMap, map, catchError } from "rxjs/operators";
import { Observable, of, pipe } from "rxjs";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core"


import { EmployeeDetailsSearchModel } from "../../models/employee-details-search-model";
import { EmployeeEducationDetailsModel } from "../../models/employee-education-details-model";
import { EmployeeEducationDetailsSearchModel } from "../../models/employee-education-details-search-model";

import { EmployeeService } from "../../services/employee-service";

import { LoadEmployeeEducationDetailsTriggered, EmployeeEducationDetailsActionTypes, LoadEmployeeEducationDetailsCompleted, ExceptionHandled, CreateEmployeeEducationDetailsTriggered, DeleteEmployeeEducationDetailsCompleted, CreateEmployeeEducationDetailsCompleted, CreateEmployeeEducationDetailsFailed, GetEmployeeEducationDetailsByIdTriggered, GetEmployeeEducationDetailsByIdCompleted, UpdateEmployeeEducationDetailsById, LoadEmployeeEducationDetailsFailed } from "../actions/employee-education-details.action";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
//import { GetReferenceIdOfFile } from '@snovasys/snova-file-uploader';

@Injectable()
export class EmployeeEducationDetailsEffects {
  employeeEducationDetailsData: EmployeeEducationDetailsModel;
  employeeEducationDetailsSearchResult: EmployeeDetailsSearchModel;
  employeeEducationDetailId: string;
  totalCount: number;
  employeeId: string;
  isNewEmployeeEducationDetails: boolean;
  toastrMessage: string;

  @Effect()
  loadEmployeeEducationDetails$: Observable<Action> = this.actions$.pipe(
    ofType<LoadEmployeeEducationDetailsTriggered>(EmployeeEducationDetailsActionTypes.LoadEmployeeEducationDetailsTriggered),
    switchMap(searchAction => {
      this.employeeEducationDetailsSearchResult = searchAction.employeeEducationDetailsSearchResult;
      return this.employeeService
        .getEmployeeDetails(searchAction.employeeEducationDetailsSearchResult)
        .pipe(map((employeeEducationDetailsList: any) => {
          if (employeeEducationDetailsList.success === true) {
            if (employeeEducationDetailsList.data.employeeEducationDetails.length > 0)
              this.totalCount = employeeEducationDetailsList.data.employeeEducationDetails[0].totalCount;
            return new LoadEmployeeEducationDetailsCompleted(employeeEducationDetailsList.data.employeeEducationDetails);
          } else {
            return new LoadEmployeeEducationDetailsFailed(
              employeeEducationDetailsList.apiResponseMessages
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
  upsertEmployeeEducationDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeEducationDetailsTriggered>(EmployeeEducationDetailsActionTypes.CreateEmployeeEducationDetailsTriggered),
    switchMap(EducationDetailsTriggeredAction => {
      if (EducationDetailsTriggeredAction.employeeEducationDetails.employeeEducationDetailId === null || EducationDetailsTriggeredAction.employeeEducationDetails.employeeEducationDetailId === '' || EducationDetailsTriggeredAction.employeeEducationDetails.employeeEducationDetailId === undefined) {
        this.isNewEmployeeEducationDetails = true;
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForEducationDetailsCreated);
      } else if (
        EducationDetailsTriggeredAction.employeeEducationDetails.employeeEducationDetailId !== undefined &&
        EducationDetailsTriggeredAction.employeeEducationDetails.isArchived === true
      ) {
        this.isNewEmployeeEducationDetails = false;
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForEducationDetailsDeleted);
      } else {
        this.isNewEmployeeEducationDetails = false;
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForEducationDetailsUpdated);
      }
      this.employeeId = EducationDetailsTriggeredAction.employeeEducationDetails.employeeId;
      return this.employeeService
        .upsertEmployeeEducationDetails(EducationDetailsTriggeredAction.employeeEducationDetails)
        .pipe(
          map((employeeEducationDetailId: any) => {
            if (employeeEducationDetailId.success === true) {
              EducationDetailsTriggeredAction.employeeEducationDetails.employeeEducationDetailId = employeeEducationDetailId.data;
              this.employeeEducationDetailId = employeeEducationDetailId.data;
              if (EducationDetailsTriggeredAction.employeeEducationDetails.isArchived)
                return new DeleteEmployeeEducationDetailsCompleted(this.employeeEducationDetailId);
              else
                return new CreateEmployeeEducationDetailsCompleted(employeeEducationDetailId.data);
            } else {
              return new CreateEmployeeEducationDetailsFailed(employeeEducationDetailId.apiResponseMessages);
            }
          }),
          catchError(error => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertEmployeeEducationDetailsSuccessfulAndLoadEducationDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeEducationDetailsCompleted>(EmployeeEducationDetailsActionTypes.CreateEmployeeEducationDetailsCompleted),
    pipe(
      map(() => {
        if (this.isNewEmployeeEducationDetails) {
          return new LoadEmployeeEducationDetailsTriggered(this.employeeEducationDetailsSearchResult);
        }
        else
          return new GetEmployeeEducationDetailsByIdTriggered(this.employeeEducationDetailId);
      }),
    )
  );

  @Effect()
  upsertEmployeeEducationDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeEducationDetailsCompleted>(EmployeeEducationDetailsActionTypes.CreateEmployeeEducationDetailsCompleted),
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
  deleteEmployeeEducationDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteEmployeeEducationDetailsCompleted>(EmployeeEducationDetailsActionTypes.DeleteEmployeeEducationDetailsCompleted),
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
  deleteEmployeeEducationDetailsSuccessfulAndLoad$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteEmployeeEducationDetailsCompleted>(EmployeeEducationDetailsActionTypes.DeleteEmployeeEducationDetailsCompleted),
    pipe(
      map(() => {
        return new LoadEmployeeEducationDetailsTriggered(this.employeeEducationDetailsSearchResult);
      })
    )
  );

  @Effect()
  getEmployeeEducationDetailsById$: Observable<Action> = this.actions$.pipe(
    ofType<GetEmployeeEducationDetailsByIdTriggered>(EmployeeEducationDetailsActionTypes.GetEmployeeEducationDetailsByIdTriggered),
    switchMap(searchAction => {
      let employeeEducationDetailsSearchModel = new EmployeeEducationDetailsSearchModel();
      employeeEducationDetailsSearchModel.employeeId = this.employeeId;
      employeeEducationDetailsSearchModel.employeeEducationId = searchAction.employeeEducationDetailId;
      return this.employeeService
        .searchEmployeeEducationDetails(employeeEducationDetailsSearchModel)
        .pipe(map((employeeEducationDetailsData: any) => {
          this.employeeId = '';
          if (employeeEducationDetailsData.success === true) {
            employeeEducationDetailsData.data.totalCount = this.totalCount;
            this.employeeEducationDetailsData = employeeEducationDetailsData.data;
            return new GetEmployeeEducationDetailsByIdCompleted(employeeEducationDetailsData.data);
          } else {
            return new CreateEmployeeEducationDetailsFailed(
              employeeEducationDetailsData.apiResponseMessages
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
  upsertEmployeeEducationDetailsSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<GetEmployeeEducationDetailsByIdCompleted>(EmployeeEducationDetailsActionTypes.GetEmployeeEducationDetailsByIdCompleted),
    pipe(
      map(() => {
        return new UpdateEmployeeEducationDetailsById({
          employeeEducationDetailsUpdate: {
            id: this.employeeEducationDetailsData.employeeEducationDetailId,
            changes: this.employeeEducationDetailsData
          }
        });
      })
    )
  );

  @Effect()
  showValidationMessagesForLoadEmployeeEducationDetails$: Observable<Action> = this.actions$.pipe(
    ofType<LoadEmployeeEducationDetailsFailed>(EmployeeEducationDetailsActionTypes.LoadEmployeeEducationDetailsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForEmployeeEducationDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeEducationDetailsFailed>(EmployeeEducationDetailsActionTypes.CreateEmployeeEducationDetailsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(EmployeeEducationDetailsActionTypes.ExceptionHandled),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  // @Effect()
  // sendUpsertedIdAsReferenceId$: Observable<Action> = this.actions$.pipe(
  //   ofType<CreateEmployeeEducationDetailsCompleted>(EmployeeEducationDetailsActionTypes.CreateEmployeeEducationDetailsCompleted),
  //   switchMap(searchAction => {
  //     return of(new GetReferenceIdOfFile(searchAction.employeeEducationDetailId)
  //     )
  //   })
  //)

  constructor(
    private actions$: Actions,
    private translateService: TranslateService,
    private employeeService: EmployeeService
  ) { }
}