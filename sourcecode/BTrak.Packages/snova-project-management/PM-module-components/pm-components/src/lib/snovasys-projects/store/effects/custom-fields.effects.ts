import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core"
import { UpsertCustomFieldTriggered, CustomFieldsActionTypes, UpsertCustomFieldCompleted, UpsertCustomFieldFailed, CustomExceptionHandled, GetCustomFieldsTriggered, GetCustomFieldsCompleted, GetCustomFieldsFailed, GetCustomFieldByIdTriggered, GetCustomFieldByIdCompleted, GetCustomFieldByIdFailed, UpdateCustomFormField, RefreshCustomFormsList, ArchiveCustomFieldTriggered, ArchiveCustomFieldCompleted, ArchiveCustomFieldFailed, UpdateCustomFieldDataTriggered, UpdateCustomFieldDataCompleted, UpdateCustomFieldDataFailed } from "../actions/custom-fields.action";
import { CustomFormFieldModel } from '../../models/custom-fileds-model';
import { GetUserStoryByIdTriggered } from '../actions/userStory.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { CustomFieldService } from '../../services/custom-field.service';


@Injectable()
export class CustomFieldEffects {
  toastrMessage: string;
  isNewField: boolean;
  customFieldId: string;
  userStoryId: string;
  customField: CustomFormFieldModel;
  @Effect()
  upsertCustomField: Observable<Action> = this.actions$.pipe(
    ofType<UpsertCustomFieldTriggered>(CustomFieldsActionTypes.UpsertCustomFieldTriggered),
    switchMap(action => {
      if (action.customFormComponent.customFieldId) {
        this.toastrMessage = this.translateService.instant('GENERICFORM.CUSTOMFIELDUPDATEDSUCCESSFULLY');
        this.isNewField = false;
      } else {
        this.toastrMessage = this.translateService.instant('GENERICFORM.CUSTOMFIELDADDEDSUCCESSFULLY');
        this.isNewField = true;
      }
      return this.customFieldService
        .upsertcustomField(action.customFormComponent)
        .pipe(map((response: any) => {
          if (response.success === true) {
            this.customFieldId = response.data;
            return new UpsertCustomFieldCompleted(response.data);
          } else {
            return new UpsertCustomFieldFailed(
              response.apiResponseMessages
            );
          }
        }),
          catchError(error => {
            return of(new CustomExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  searchCustomField: Observable<Action> = this.actions$.pipe(
    ofType<GetCustomFieldsTriggered>(CustomFieldsActionTypes.GetCustomFieldsTriggered),
    switchMap(action => {
      return this.customFieldService
        .searchCustomFields(action.customFormComponent)
        .pipe(map((response: any) => {
          if (response.success === true) {
            return new GetCustomFieldsCompleted(response.data);
          } else {
            return new GetCustomFieldsFailed(
              response.apiResponseMessages
            );
          }
        }),
          catchError(error => {
            return of(new CustomExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  updateCustomField: Observable<Action> = this.actions$.pipe(
    ofType<UpdateCustomFieldDataTriggered>(CustomFieldsActionTypes.UpdateCustomFieldDataTriggered),
    switchMap(action => {
      return this.customFieldService
        .updatecustomField(action.customFormComponent)
        .pipe(map((response: any) => {
          if (response.success === true) {
            this.customFieldId = action.customFormComponent.customFieldId;
            this.userStoryId = action.customFormComponent.referenceId;
            return new UpdateCustomFieldDataCompleted(response.data);
          } else {
            return new UpdateCustomFieldDataFailed(
              response.apiResponseMessages
            );
          }
        }),
          catchError(error => {
            return of(new CustomExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  getCustomFieldById: Observable<Action> = this.actions$.pipe(
    ofType<GetCustomFieldByIdTriggered>(CustomFieldsActionTypes.GetCustomFieldByIdTriggered),
    switchMap(action => {
      return this.customFieldService
        .getCustomFieldById(action.customFieldId)
        .pipe(map((response: any) => {
          if (response.success === true) {
            this.customField = response.data;
            return new GetCustomFieldByIdCompleted(response.data);
          } else {
            return new GetCustomFieldByIdFailed(
              response.apiResponseMessages
            );
          }
        }),
          catchError(error => {
            return of(new CustomExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  loadCustomFieldDataById$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateCustomFieldDataCompleted>(CustomFieldsActionTypes.UpdateCustomFieldDataCompleted),
    pipe(
      map(() => {
        return new GetCustomFieldByIdTriggered(this.customFieldId);
      })
    )
  );

  @Effect()
  loadCustomFieldDataByIdCompleted$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateCustomFieldDataCompleted>(CustomFieldsActionTypes.UpdateCustomFieldDataCompleted),
    pipe(
      map(() => {
        return new GetUserStoryByIdTriggered(this.userStoryId);
      })
    )
  );

  @Effect()
  loadCustomFieldById$: Observable<Action> = this.actions$.pipe(
    ofType<UpsertCustomFieldCompleted>(CustomFieldsActionTypes.UpsertCustomFieldCompleted),
    pipe(
      map(() => {
        return new GetCustomFieldByIdTriggered(this.customFieldId);
      })
    )
  );

  @Effect()
  archiveCustomField: Observable<Action> = this.actions$.pipe(
    ofType<ArchiveCustomFieldTriggered>(CustomFieldsActionTypes.ArchiveCustomFieldTriggered),
    switchMap(action => {
      return this.customFieldService
        .upsertcustomField(action.customFormComponent)
        .pipe(map((response: any) => {
          if (response.success === true) {
            this.customField = response.data;
            return new ArchiveCustomFieldCompleted(response.data);
          } else {
            return new ArchiveCustomFieldFailed(
              response.apiResponseMessages
            );
          }
        }),
          catchError(error => {
            return of(new CustomExceptionHandled(error));
          })
        );
    })
  );


  @Effect()
  UpdateCustomFieldChanges$: Observable<Action> = this.actions$.pipe(
    ofType<GetCustomFieldByIdCompleted>(CustomFieldsActionTypes.GetCustomFieldByIdCompleted),
    pipe(
      map(() => {
        if (!this.isNewField) {
          return new UpdateCustomFormField({
            customFieldUpdate: {
              id: this.customField.customFieldId,
              changes: this.customField
            }
          });
        } else {
          this.isNewField = false;
          return new RefreshCustomFormsList(this.customField);
        }
      })
    )
  );

  @Effect()
  showValidationMessagesForUpsertCustomFieldFailed$: Observable<Action> = this.actions$.pipe(
    ofType<UpsertCustomFieldFailed>(CustomFieldsActionTypes.UpsertCustomFieldFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForUpdateCustomFieldFailed$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateCustomFieldDataFailed>(CustomFieldsActionTypes.UpdateCustomFieldDataFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForArchiveCustomFieldFailed$: Observable<Action> = this.actions$.pipe(
    ofType<ArchiveCustomFieldFailed>(CustomFieldsActionTypes.ArchiveCustomFieldFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  CustomExceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<CustomExceptionHandled>(CustomFieldsActionTypes.CustomExceptionHandled),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  @Effect()
  upsertCustomFieldSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<UpsertCustomFieldCompleted>(CustomFieldsActionTypes.UpsertCustomFieldCompleted),
    pipe(
      map(
        () =>
          new SnackbarOpen({
            message: this.toastrMessage, // TODO: Change to proper toast message
            action: "Success",
            config: {
              panelClass: "toaster-alignment"
            }
          })
      )
    )
  );

  @Effect()
  archiveCustomFieldSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<ArchiveCustomFieldCompleted>(CustomFieldsActionTypes.ArchiveCustomFieldCompleted),
    pipe(
      map(
        () =>
          new SnackbarOpen({
            message: this.translateService.instant('GENERICFORM.CUSTOMFIELDDELETEDSUCCESSFULLY'), // TODO: Change to proper toast message
            action: "Success",
            config: {
              panelClass: "toaster-alignment"
            }
          })
      )
    )
  );

  constructor(
    private actions$: Actions,
    private translateService: TranslateService,
    private customFieldService: CustomFieldService
  ) { }
}