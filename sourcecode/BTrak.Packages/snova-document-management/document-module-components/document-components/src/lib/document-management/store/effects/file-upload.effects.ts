import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core"
import { FileUploadActionTriggered, FileUploadActionCompleted, FileUploadActionTypes, FileUploadActionFailed, ExceptionHandled } from "../actions/file-upload.action";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { FileUploadService } from '../../services/fileUpload.service';

@Injectable()
export class FileUploadEffects {
  @Effect()
  fileUploadActionTriggered$: Observable<Action> = this.actions$.pipe(
    ofType<FileUploadActionTriggered>(FileUploadActionTypes.FileUploadActionTriggered),
    switchMap(action => {
      return this.fileUploadService
        .UploadFile(action.fileModel, action.moduleTypeId)
        .pipe(map((response: any) => {
          if (response.success === true) {
            return new FileUploadActionCompleted(response.data);
          } else {
            return new FileUploadActionFailed(
              response.apiResponseMessages
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
  showValidationMessagesForFileUploadFailed$: Observable<Action> = this.actions$.pipe(
    ofType<FileUploadActionFailed>(FileUploadActionTypes.FileUploadActionFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(FileUploadActionTypes.ExceptionHandled),
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
    private fileUploadService: FileUploadService
  ) { }

}
