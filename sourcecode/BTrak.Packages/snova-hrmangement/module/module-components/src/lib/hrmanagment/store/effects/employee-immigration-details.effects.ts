import { Injectable } from "@angular/core";
import { switchMap, map, catchError } from "rxjs/operators";
import { Observable, of, pipe } from "rxjs";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core"


import { EmployeeDetailsSearchModel } from "../../models/employee-details-search-model";
import { EmployeeImmigrationDetailsModel } from "../../models/employee-immigration-details-model";
import { EmployeeImmigrationDetailsSearchModel } from "../../models/employee-immigration-details-search-model";

import { EmployeeService } from "../../services/employee-service";

import { LoadEmployeeImmigrationDetailsTriggered, EmployeeImmigrationDetailsActionTypes, ExceptionHandled, LoadEmployeeImmigrationDetailsCompleted, CreateEmployeeImmigrationDetailsTriggered, DeleteEmployeeImmigrationDetailsCompleted, CreateEmployeeImmigrationDetailsCompleted, CreateEmployeeImmigrationDetailsFailed, GetEmployeeImmigrationDetailsByIdTriggered, GetEmployeeImmigrationDetailsByIdCompleted, UpdateEmployeeImmigrationDetailsById, LoadEmployeeImmigrationDetailsFailed } from "../actions/employee-immigration-details.action";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
//import { GetReferenceIdOfFile } from '@snovasys/snova-file-uploader';

@Injectable()
export class EmployeeImmigrationDetailsEffects {
  employeeImmigrationDetailsData: EmployeeImmigrationDetailsModel;
  employeeImmigrationDetailsSearchResult: EmployeeDetailsSearchModel;
  employeeImmigrationId: string;
  employeeId: string;
  totalCount: number;
  isNewEmployeeImmigrationDetails: boolean;
  toastrMessage: string;

  @Effect()
  loadEmployeeImmigrationDetails$: Observable<Action> = this.actions$.pipe(
    ofType<LoadEmployeeImmigrationDetailsTriggered>(EmployeeImmigrationDetailsActionTypes.LoadEmployeeImmigrationDetailsTriggered),
    switchMap(searchAction => {
      this.employeeImmigrationDetailsSearchResult = searchAction.employeeImmigrationDetailsSearchResult;
      return this.employeeService
        .getEmployeeDetails(searchAction.employeeImmigrationDetailsSearchResult)
        .pipe(map((employeeImmigrationDetailsList: any) => {
          if (employeeImmigrationDetailsList.success === true) {
            if(employeeImmigrationDetailsList.data.employeeImmigrationDetails.length > 0)
            this.totalCount = employeeImmigrationDetailsList.data.employeeImmigrationDetails[0].totalCount;
            return new LoadEmployeeImmigrationDetailsCompleted(employeeImmigrationDetailsList.data.employeeImmigrationDetails);
          } else {
            return new LoadEmployeeImmigrationDetailsFailed(
              employeeImmigrationDetailsList.apiResponseMessages
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
  upsertEmployeeImmigrationDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeImmigrationDetailsTriggered>(EmployeeImmigrationDetailsActionTypes.CreateEmployeeImmigrationDetailsTriggered),
    switchMap(ImmigrationDetailsTriggeredAction => {
      if (ImmigrationDetailsTriggeredAction.employeeImmigrationDetails.employeeImmigrationId === null || ImmigrationDetailsTriggeredAction.employeeImmigrationDetails.employeeImmigrationId === '' || ImmigrationDetailsTriggeredAction.employeeImmigrationDetails.employeeImmigrationId === undefined) {
        this.isNewEmployeeImmigrationDetails = true;
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForImmigrationDetailsCreated);
      } else if (
        ImmigrationDetailsTriggeredAction.employeeImmigrationDetails.employeeImmigrationId !== undefined &&
        ImmigrationDetailsTriggeredAction.employeeImmigrationDetails.isArchived === true
      ) {
        this.isNewEmployeeImmigrationDetails = false;
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForImmigrationDeleted);
      } else {
        this.isNewEmployeeImmigrationDetails = false;
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForImmigrationDetailsUpdated);
      }
      this.employeeId = ImmigrationDetailsTriggeredAction.employeeImmigrationDetails.employeeId;
      return this.employeeService
        .upsertEmployeeImmigrationDetails(ImmigrationDetailsTriggeredAction.employeeImmigrationDetails)
        .pipe(
          map((employeeImmigrationId: any) => {
            if (employeeImmigrationId.success === true) {
              ImmigrationDetailsTriggeredAction.employeeImmigrationDetails.employeeImmigrationId = employeeImmigrationId.data;
              this.employeeImmigrationId = employeeImmigrationId.data;
              if (ImmigrationDetailsTriggeredAction.employeeImmigrationDetails.isArchived)
                return new DeleteEmployeeImmigrationDetailsCompleted(this.employeeImmigrationId);
              else
                return new CreateEmployeeImmigrationDetailsCompleted(employeeImmigrationId.data);
            } else {
              return new CreateEmployeeImmigrationDetailsFailed(employeeImmigrationId.apiResponseMessages);
            }
          }),
          catchError(error => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertEmployeeImmigrationDetailsSuccessfulAndLoadImmigrationDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeImmigrationDetailsCompleted>(EmployeeImmigrationDetailsActionTypes.CreateEmployeeImmigrationDetailsCompleted),
    pipe(
      map(() => {
        if (this.isNewEmployeeImmigrationDetails) {
          return new LoadEmployeeImmigrationDetailsTriggered(this.employeeImmigrationDetailsSearchResult);
        }
        else
          return new GetEmployeeImmigrationDetailsByIdTriggered(this.employeeImmigrationId);
      }),
    )
  );

  @Effect()
  upsertEmployeeImmigrationDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeImmigrationDetailsCompleted>(EmployeeImmigrationDetailsActionTypes.CreateEmployeeImmigrationDetailsCompleted),
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
  deleteEmployeeImmigrationDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteEmployeeImmigrationDetailsCompleted>(EmployeeImmigrationDetailsActionTypes.DeleteEmployeeImmigrationDetailsCompleted),
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
  deleteEmployeeImmigrationDetailsSuccessfulAndLoad$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteEmployeeImmigrationDetailsCompleted>(EmployeeImmigrationDetailsActionTypes.DeleteEmployeeImmigrationDetailsCompleted),
    pipe(
      map(() => {
        return new LoadEmployeeImmigrationDetailsTriggered(this.employeeImmigrationDetailsSearchResult);
      })
    )
  );

  @Effect()
  getEmployeeImmigrationDetailsById$: Observable<Action> = this.actions$.pipe(
    ofType<GetEmployeeImmigrationDetailsByIdTriggered>(EmployeeImmigrationDetailsActionTypes.GetEmployeeImmigrationDetailsByIdTriggered),
    switchMap(searchAction => {
      let employeeImmigrationDetailsSearchModel = new EmployeeImmigrationDetailsSearchModel();
      employeeImmigrationDetailsSearchModel.employeeId = this.employeeId;
      employeeImmigrationDetailsSearchModel.employeeImmigrationId = searchAction.employeeImmigrationDetailId;
      return this.employeeService
        .searchEmployeeImmigrationDetails(employeeImmigrationDetailsSearchModel)
        .pipe(map((employeeImmigrationDetailsData: any) => {
          this.employeeId = '';
          if (employeeImmigrationDetailsData.success === true) {
            employeeImmigrationDetailsData.data.totalCount = this.totalCount;
            this.employeeImmigrationDetailsData = employeeImmigrationDetailsData.data;
            return new GetEmployeeImmigrationDetailsByIdCompleted(employeeImmigrationDetailsData.data);
          } else {
            return new CreateEmployeeImmigrationDetailsFailed(
              employeeImmigrationDetailsData.apiResponseMessages
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
  upsertEmployeeImmigrationDetailsSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<GetEmployeeImmigrationDetailsByIdCompleted>(EmployeeImmigrationDetailsActionTypes.GetEmployeeImmigrationDetailsByIdCompleted),
    pipe(
      map(() => {
        return new UpdateEmployeeImmigrationDetailsById({
          employeeImmigrationDetailsUpdate: {
            id: this.employeeImmigrationDetailsData.employeeImmigrationId,
            changes: this.employeeImmigrationDetailsData
          }
        });
      })
    )
  );

  @Effect()
    showValidationMessagesForLoadEmployeeImmigrationDetails$: Observable<Action> = this.actions$.pipe(
        ofType<LoadEmployeeImmigrationDetailsFailed>(EmployeeImmigrationDetailsActionTypes.LoadEmployeeImmigrationDetailsFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

  @Effect()
  showValidationMessagesForEmployeeImmigrationDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeImmigrationDetailsFailed>(EmployeeImmigrationDetailsActionTypes.CreateEmployeeImmigrationDetailsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(EmployeeImmigrationDetailsActionTypes.ExceptionHandled),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  // @Effect()
  // sendUpsertedIdAsReferenceId$: Observable<Action> = this.actions$.pipe(
  //   ofType<CreateEmployeeImmigrationDetailsCompleted>(EmployeeImmigrationDetailsActionTypes.CreateEmployeeImmigrationDetailsCompleted),
  //   switchMap(searchAction => {
  //     return of(new GetReferenceIdOfFile(searchAction.employeeImmigrationDetailId)
  //     )
  //   })
  // );

  constructor(
    private actions$: Actions,
    private translateService: TranslateService,
    private employeeService: EmployeeService
  ) { }
}