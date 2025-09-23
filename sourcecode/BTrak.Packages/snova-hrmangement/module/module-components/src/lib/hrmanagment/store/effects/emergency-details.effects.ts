import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { switchMap, map, catchError } from "rxjs/operators";
import { Action } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";

import { EmployeeEmergencyContactDetails } from '../../models/employee-emergency-contact-details-model';

import { EmergencyDetailsService } from "../../services/emergency-details.service";
import {
  EmergencyDetailsActionTypes, LoadEmergencyDetailsTriggered, LoadEmergencyDetailsCompleted, CreateEmergencyDetailsTriggered, CreateEmergencyDetailsCompleted,
  CreateEmergencyDetailsFailed, ExceptionHandled, GetEmergencyContactByIdCompleted, GetEmergencyContactByIdTriggered, RefreshEmergencyDetails, CreateEmergencyContactCompletedWithInPlaceUpdate, LoadEmergencyDetailsFailed, DeleteEmergencyContactDetailsCompleted
} from "../actions/emergency-details.actions";
import { EmployeeDetailsSearchModel } from "../../models/employee-details-search-model";
import { EmployeeEmergencyContactSearchModel } from "../../models/employee-emergency-contact-details-search-model";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
//import { GetReferenceIdOfFile } from '@snovasys/snova-file-uploader';

@Injectable()
export class EmergencyContactDetailsEffects {
  toastrMessage: string;
  employeeEmergencyContactId: string;
  emergencyDetailsResult: EmployeeDetailsSearchModel;
  EmergencyContactData: EmployeeEmergencyContactDetails;
  employeeId: string;
  isNewEmergencyContact: boolean;
  isArchived: boolean;
  totalCount: number;
  @Effect()
  loadEmergencyDetails$: Observable<Action> = this.actions$.pipe(
    ofType<LoadEmergencyDetailsTriggered>(EmergencyDetailsActionTypes.LoadEmergencyDetailsTriggered),
    switchMap(searchAction => {
      this.emergencyDetailsResult = searchAction.emergencyDetailsResult;
      return this.emergencyDetailsService
        .getAllEmergencyDetails(searchAction.emergencyDetailsResult)
        .pipe(map((emergencyContacts: any) => {
          if (emergencyContacts.success === true) {
            if(emergencyContacts.data.employeeEmergencyContactDetails.length > 0)
              this.totalCount = emergencyContacts.data.employeeEmergencyContactDetails[0].totalCount;
            return new LoadEmergencyDetailsCompleted(emergencyContacts.data.employeeEmergencyContactDetails);
          } else {
            return new LoadEmergencyDetailsFailed(emergencyContacts.apiResponseMessages);
          }
        }),
          catchError(error => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertEmergencyContact$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmergencyDetailsTriggered>(EmergencyDetailsActionTypes.CreateEmergencyDetailsTriggered),
    switchMap(emergencyDetailsTriggeredAction => {
      if (emergencyDetailsTriggeredAction.emergencyContact.emergencyContactId === null || emergencyDetailsTriggeredAction.emergencyContact.emergencyContactId === '' || emergencyDetailsTriggeredAction.emergencyContact.emergencyContactId === undefined) {
        this.isNewEmergencyContact = true;
        // this.toastrMessage = "Emergency contact created successfully";
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForEmergencyContactCreated)
      } else if (
        emergencyDetailsTriggeredAction.emergencyContact.emergencyContactId !== undefined &&
        emergencyDetailsTriggeredAction.emergencyContact.isArchived === true
      ) {
        this.isNewEmergencyContact = false;
        this.toastrMessage = "Emergency contact deleted successfully";
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForEmergencyContactDeleted)
      } else {
        this.isNewEmergencyContact = false;
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForEmergencyContactUpdated)
      }
      this.employeeId = emergencyDetailsTriggeredAction.emergencyContact.employeeId;
      return this.emergencyDetailsService
        .upsertEmergencyContact(emergencyDetailsTriggeredAction.emergencyContact)
        .pipe(
          map((employeeEmergencyContactId: any) => {
            if (employeeEmergencyContactId.success === true) {
              emergencyDetailsTriggeredAction.emergencyContact.emergencyContactId = employeeEmergencyContactId.data;
              this.employeeEmergencyContactId = employeeEmergencyContactId.data;
              if (emergencyDetailsTriggeredAction.emergencyContact.isArchived) {
                return new DeleteEmergencyContactDetailsCompleted(employeeEmergencyContactId.data)
              }
              else {
                return new CreateEmergencyDetailsCompleted(employeeEmergencyContactId.data);
              }
            }
            else {
              return new CreateEmergencyDetailsFailed(employeeEmergencyContactId.apiResponseMessages);
            }
          }),
          catchError(error => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertEmergencyDetailSuccessfulAndLoadEmergencyDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmergencyDetailsCompleted>(EmergencyDetailsActionTypes.CreateEmergencyDetailsCompleted),
    pipe(
      map(() => {
        if (this.isNewEmergencyContact)
          return new LoadEmergencyDetailsTriggered(this.emergencyDetailsResult);
        else
          return new GetEmergencyContactByIdTriggered(this.employeeEmergencyContactId);
      }),
    )
  );

  @Effect()
  upsertEmergencyDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmergencyDetailsCompleted>(EmergencyDetailsActionTypes.CreateEmergencyDetailsCompleted),
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
  getEmployeeEmergencyDetailsById$: Observable<Action> = this.actions$.pipe(
    ofType<GetEmergencyContactByIdTriggered>(EmergencyDetailsActionTypes.GetEmergencyContactByIdTriggered),
    switchMap(searchAction => {
      let employeeEmergencyContactSearchModel = new EmployeeEmergencyContactSearchModel();
      employeeEmergencyContactSearchModel.employeeId = this.employeeId;
      employeeEmergencyContactSearchModel.emergencyContactId = searchAction.employeeEmergencyContactId;
      return this.emergencyDetailsService
        .getAllEmergencyContactDetailById(employeeEmergencyContactSearchModel)
        .pipe(map((emergencyContact: any) => {
          this.employeeId = '';
          if (emergencyContact.success === true) {
            emergencyContact.data.totalCount = this.totalCount;
            this.EmergencyContactData = emergencyContact.data;
            return new GetEmergencyContactByIdCompleted(emergencyContact.data);
          } else {
            return new CreateEmergencyDetailsFailed(
              emergencyContact.apiResponseMessages
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
  DeleteEmergencyDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteEmergencyContactDetailsCompleted>(EmergencyDetailsActionTypes.DeleteEmergencyContactDetailsCompleted),
    pipe(map(() =>
          new SnackbarOpen({
            message: this.toastrMessage, // TODO: Change to proper toast message
            action: this.translateService.instant(ConstantVariables.success)
          })
      )
    )
  );

  @Effect()
  DeleteEmergencyDetailsSuccessfulAndRefresh$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteEmergencyContactDetailsCompleted>(EmergencyDetailsActionTypes.DeleteEmergencyContactDetailsCompleted),
    pipe(map(() => {
        return new LoadEmergencyDetailsTriggered(this.emergencyDetailsResult);
      })
    )
  );

  @Effect()
  upsertEmergencyDetailsSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<GetEmergencyContactByIdCompleted>(EmergencyDetailsActionTypes.GetEmergencyContactByIdCompleted),
    pipe(map(() => {
          return new CreateEmergencyContactCompletedWithInPlaceUpdate({
            emergencyDetailsUpdate: {
              id: this.EmergencyContactData.emergencyContactId,
              changes: this.EmergencyContactData
            }
          });
      })
    )
  );


  @Effect()
  showValidationMessagesForEmergencyDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateEmergencyDetailsFailed>(EmergencyDetailsActionTypes.CreateEmergencyDetailsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForEmergencyDetailsList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadEmergencyDetailsFailed>(EmergencyDetailsActionTypes.LoadEmergencyDetailsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(EmergencyDetailsActionTypes.ExceptionHandled),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  // @Effect()
  // sendUpsertedIdAsReferenceId$: Observable<Action> = this.actions$.pipe(
  //   ofType<CreateEmergencyDetailsCompleted>(EmergencyDetailsActionTypes.CreateEmergencyDetailsCompleted),
  //   switchMap(searchAction => {
  //     return of(new GetReferenceIdOfFile(searchAction.employeeEmergencyContactId)
  //     )
  //   })
  // );

  constructor(
    private actions$: Actions,
    private emergencyDetailsService: EmergencyDetailsService,
    private translateService: TranslateService
  ) { }
}