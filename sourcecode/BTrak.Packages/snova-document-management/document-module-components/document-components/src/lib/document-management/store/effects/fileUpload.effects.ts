import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { Observable, of, pipe } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { FileUploadService } from "../../services/fileUpload.service";
// tslint:disable-next-line: ordered-imports
import {
  // tslint:disable-next-line: ordered-imports
  FileUploadExceptionHandled,
  FileUploadActionTypesList,
  FileUploadCompleted,
  FileUploadFailed,
  FileUploadTriggered,
  LoadUploadedFilesCompleted,
  LoadUploadedFilesFailed,
  LoadUploadedFilesTriggered
} from "../actions/fileupload.action";
import { ShowExceptionMessages, ShowValidationMessages } from "../actions/notification-validator.action";
import { SnackbarOpen } from "../actions/snackbar.actions";
import { TranslateService } from "@ngx-translate/core";
import { ConstantVariables } from '../../constants/constant-variables';

@Injectable()
export class FileUploadEffects {
  validationMessages: any[];

  @Effect()
  upsertFile$: Observable<Action> = this.actions$.pipe(
    ofType<FileUploadTriggered>(FileUploadActionTypesList.FileUploadTriggered),
    switchMap((fileTriggeredAction) => {
      return this.fileUploadService
        .UpsertFile(fileTriggeredAction.fileUpload)
        .pipe(
          map((fileUploadId: any) => {
            if (fileUploadId.success === true) {
              return new FileUploadCompleted(fileUploadId);
            } else {
              this.validationMessages = fileUploadId.apiResponseMessages;
              return new FileUploadFailed(fileUploadId.apiResponseMessages);
            }
          }),
          catchError((err) => {
            return of(new FileUploadExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  searchFile$: Observable<Action> = this.actions$.pipe(
    ofType<LoadUploadedFilesTriggered>(FileUploadActionTypesList.LoadUploadedFilesTriggered),
    switchMap((fileTriggeredAction) => {
      return this.fileUploadService
        .searchUploadedFiles(fileTriggeredAction.fileSearchCriteriaModel)
        .pipe(
          map((fileUploadId: any) => {
            if (fileUploadId.success === true) {
              return new LoadUploadedFilesCompleted(fileUploadId.data);
            } else {
              return new LoadUploadedFilesFailed(fileUploadId.apiResponseMessages);
            }
          }),
          catchError((err) => {
            return of(new FileUploadExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  upsertFileSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<FileUploadCompleted>(FileUploadActionTypesList.FileUploadCompleted),
    pipe(
      map(
        () =>
          new SnackbarOpen({
            message: "File Uploaded successfully", // TODO: Change to proper toast message
            action: this.translateService.instant(ConstantVariables.success)
          })
      )
    )
  );

  @Effect()
  exceptionHandled$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<FileUploadFailed>(
      FileUploadActionTypesList.FileUploadExceptionHandled
    ),
    switchMap((searchAction) => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages
      })
      )
    })
  );
  @Effect()
  showValidationMessagesForFileUpload$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<FileUploadFailed>(
      FileUploadActionTypesList.FileUploadFailed
    ),
    pipe(
      map(
        () => {
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < this.validationMessages.length; i++) {
            return new ShowExceptionMessages({
              message: this.validationMessages[i].message // TODO: Change to proper toast message
            })
        }
        }
      )
    )
  );

  @Effect()
  showValidationMessagesForSearchFiles$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<LoadUploadedFilesFailed>(
      FileUploadActionTypesList.LoadUploadedFilesFailed
    ),
    switchMap((searchAction) => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages
      })
      )
    })
  );
  constructor(
    private actions$: Actions,
    private fileUploadService: FileUploadService,
    private translateService: TranslateService
  ) {}
}
