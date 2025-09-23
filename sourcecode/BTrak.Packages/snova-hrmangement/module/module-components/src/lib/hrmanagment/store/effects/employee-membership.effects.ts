import { Injectable } from "@angular/core";
import { switchMap, map, catchError } from "rxjs/operators";
import { Observable, of, pipe } from "rxjs";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";


import { EmployeeDetailsSearchModel } from "../../models/employee-details-search-model";
import { EmployeeMembershipDetailsModel } from "../../models/employee-Membership-details-model";
import { EmployeeMembershipDetailsSearchModel } from "../../models/employee-Membership-details-search-model";

import { EmployeeService } from "../../services/employee-service";
import { TranslateService } from "@ngx-translate/core"

import { LoadEmployeeMembershipDetailsTriggered, EmployeeMembershipDetailsActionTypes, LoadEmployeeMembershipDetailsCompleted, ExceptionHandled, CreateEmployeeMembershipDetailsTriggered, DeleteEmployeeMembershipDetailsCompleted, CreateEmployeeMembershipDetailsCompleted, CreateEmployeeMembershipDetailsFailed, GetEmployeeMembershipDetailsByIdTriggered, GetEmployeeMembershipDetailsByIdCompleted, UpdateEmployeeMembershipDetailsById, LoadEmployeeMembershipDetailsFailed } from "../actions/employee-Membership-details.action";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
//import { GetReferenceIdOfFile } from '@snovasys/snova-file-uploader';

@Injectable()
export class EmployeeMembershipDetailsEffects {
  employeeMembershipDetailsData: EmployeeMembershipDetailsModel;
  employeeMembershipDetailsSearchResult: EmployeeDetailsSearchModel;
  employeeMembershipDetailId: string;
  employeeId: string;
  totalCount: number;
  isNewEmployeeMembershipDetails: boolean;
  toastrMessage: string;

  @Effect()
  loadEmployeeMembershipDetails$: Observable<Action> = this.actions$.pipe(
    ofType<LoadEmployeeMembershipDetailsTriggered>(EmployeeMembershipDetailsActionTypes.LoadEmployeeMembershipDetailsTriggered),
    switchMap(searchAction => {
      this.employeeMembershipDetailsSearchResult = searchAction.employeeMembershipDetailsSearchResult;
      return this.employeeService
        .getEmployeeDetails(searchAction.employeeMembershipDetailsSearchResult)
        .pipe(map((employeeMembershipDetailsList: any) => {
          if (employeeMembershipDetailsList.success === true) {
            if(employeeMembershipDetailsList.data.employeeMembershipDetails.length > 0)
                this.totalCount = employeeMembershipDetailsList.data.employeeMembershipDetails[0].totalCount;
            return new LoadEmployeeMembershipDetailsCompleted(employeeMembershipDetailsList.data.employeeMembershipDetails);
        } else {
            return new LoadEmployeeMembershipDetailsFailed(
              employeeMembershipDetailsList.apiResponseMessages
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
  upsertEmployeeMembershipDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeMembershipDetailsTriggered>(EmployeeMembershipDetailsActionTypes.CreateEmployeeMembershipDetailsTriggered),
    switchMap(MembershipDetailsTriggeredAction => {
      if (MembershipDetailsTriggeredAction.employeeMembershipDetails.employeeMembershipId === null || MembershipDetailsTriggeredAction.employeeMembershipDetails.employeeMembershipId === '' || MembershipDetailsTriggeredAction.employeeMembershipDetails.employeeMembershipId === undefined) {
        this.isNewEmployeeMembershipDetails = true;
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForMembershipDetailsCreated);
      } else if (
        MembershipDetailsTriggeredAction.employeeMembershipDetails.employeeMembershipId !== undefined &&
        MembershipDetailsTriggeredAction.employeeMembershipDetails.isArchived === true
      ) {
        this.isNewEmployeeMembershipDetails = false;
        this.toastrMessage =this.translateService.instant(ConstantVariables.SuccessMessageForMembershipDetailsDeleted);
      } else {
        this.isNewEmployeeMembershipDetails = false;
        this.toastrMessage =this.translateService.instant(ConstantVariables.SuccessMessageForMembershipDetailsUpdated);
      }
      this.employeeId = MembershipDetailsTriggeredAction.employeeMembershipDetails.employeeId;
      return this.employeeService
        .upsertEmployeeMembershipDetails(MembershipDetailsTriggeredAction.employeeMembershipDetails)
        .pipe(
          map((employeeMembershipDetailId: any) => {
            if (employeeMembershipDetailId.success === true) {
              MembershipDetailsTriggeredAction.employeeMembershipDetails.employeeMembershipId = employeeMembershipDetailId.data;
              this.employeeMembershipDetailId = employeeMembershipDetailId.data;
              if (MembershipDetailsTriggeredAction.employeeMembershipDetails.isArchived)
                return new DeleteEmployeeMembershipDetailsCompleted(this.employeeMembershipDetailId);
              else
                return new CreateEmployeeMembershipDetailsCompleted(employeeMembershipDetailId.data);
            } else {
              return new CreateEmployeeMembershipDetailsFailed(employeeMembershipDetailId.apiResponseMessages);
            }
          }),
          catchError(error => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertEmployeeMembershipDetailsSuccessfulAndLoadMembershipDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeMembershipDetailsCompleted>(EmployeeMembershipDetailsActionTypes.CreateEmployeeMembershipDetailsCompleted),
    pipe(
      map(() => {
        if (this.isNewEmployeeMembershipDetails) {
          return new LoadEmployeeMembershipDetailsTriggered(this.employeeMembershipDetailsSearchResult);
        }
        else
          return new GetEmployeeMembershipDetailsByIdTriggered(this.employeeMembershipDetailId);
      }),
    )
  );

  @Effect()
  upsertEmployeeMembershipDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeMembershipDetailsCompleted>(EmployeeMembershipDetailsActionTypes.CreateEmployeeMembershipDetailsCompleted),
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
  deleteEmployeeMembershipDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteEmployeeMembershipDetailsCompleted>(EmployeeMembershipDetailsActionTypes.DeleteEmployeeMembershipDetailsCompleted),
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
  deleteEmployeeMembershipDetailsSuccessfulAndLoad$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteEmployeeMembershipDetailsCompleted>(EmployeeMembershipDetailsActionTypes.DeleteEmployeeMembershipDetailsCompleted),
    pipe(
      map(() => {
        return new LoadEmployeeMembershipDetailsTriggered(this.employeeMembershipDetailsSearchResult);
      })
    )
  );

  @Effect()
  getEmployeeMembershipDetailsById$: Observable<Action> = this.actions$.pipe(
    ofType<GetEmployeeMembershipDetailsByIdTriggered>(EmployeeMembershipDetailsActionTypes.GetEmployeeMembershipDetailsByIdTriggered),
    switchMap(searchAction => {
      let employeeMembershipDetailsSearchModel = new EmployeeMembershipDetailsSearchModel();
      employeeMembershipDetailsSearchModel.employeeId = this.employeeId;
      employeeMembershipDetailsSearchModel.employeeMembershipId = searchAction.employeeMembershipDetailId;
      return this.employeeService
        .searchEmployeeMembershipDetails(employeeMembershipDetailsSearchModel)
        .pipe(map((employeeMembershipDetailsData: any) => {
          this.employeeId = '';
          if (employeeMembershipDetailsData.success === true) {
            this.employeeMembershipDetailsData = employeeMembershipDetailsData.data;
            employeeMembershipDetailsData.data.totalCount = this.totalCount;
            return new GetEmployeeMembershipDetailsByIdCompleted(employeeMembershipDetailsData.data);
          } else {
            return new CreateEmployeeMembershipDetailsFailed(
              employeeMembershipDetailsData.apiResponseMessages
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
  upsertEmployeeMembershipDetailsSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<GetEmployeeMembershipDetailsByIdCompleted>(EmployeeMembershipDetailsActionTypes.GetEmployeeMembershipDetailsByIdCompleted),
    pipe(
      map(() => {
        return new UpdateEmployeeMembershipDetailsById({
          employeeMembershipDetailsUpdate: {
            id: this.employeeMembershipDetailsData.employeeMembershipId,
            changes: this.employeeMembershipDetailsData
          }
        });
      })
    )
  );

  @Effect()
    showValidationMessagesForLoadEmployeeMembershipDetails$: Observable<Action> = this.actions$.pipe(
        ofType<LoadEmployeeMembershipDetailsFailed>(EmployeeMembershipDetailsActionTypes.LoadEmployeeMembershipDetailsFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

  @Effect()
  showValidationMessagesForEmployeeMembershipDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmployeeMembershipDetailsFailed>(EmployeeMembershipDetailsActionTypes.CreateEmployeeMembershipDetailsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(EmployeeMembershipDetailsActionTypes.ExceptionHandled),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  // @Effect()
  // sendUpsertedIdAsReferenceId$: Observable<Action> = this.actions$.pipe(
  //   ofType<CreateEmployeeMembershipDetailsCompleted>(EmployeeMembershipDetailsActionTypes.CreateEmployeeMembershipDetailsCompleted),
  //   switchMap(searchAction => {
  //     return of(new GetReferenceIdOfFile(searchAction.employeeMembershipDetailId)
  //     )
  //   })
  // )

  constructor(
    private actions$: Actions,
    private translateService: TranslateService,
    private employeeService: EmployeeService
  ) { }
}