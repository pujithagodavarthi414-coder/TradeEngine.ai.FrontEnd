import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { ChangePasswordTriggered, ChangePasswordActionTypes, ChangePasswordCompleted, ChangePasswordExceptionHandled, ChangePasswordFailed } from "../actions/change-password.actions";
import { TranslateService } from "@ngx-translate/core";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { DashboardService } from '../../services/dashboard.service';


@Injectable()
export class ChangePasswordEffects {
  exceptionMessage: any;
  password: string;
  validationMessages: any[];
  toastrMessage: string;

  @Effect()
  changePassword$: Observable<Action> = this.actions$.pipe(
    ofType<ChangePasswordTriggered>(ChangePasswordActionTypes.ChangePasswordTriggered),
    switchMap(ChangePasswordTriggeredAction => {
      if (ChangePasswordTriggeredAction.changePasswordModel.confirmPassword === null || ChangePasswordTriggeredAction.changePasswordModel.confirmPassword === '' || ChangePasswordTriggeredAction.changePasswordModel.confirmPassword === undefined) {
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForPasswordCreated)
      } else {
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForPasswordChanged)
      }
      return this.dashboardService
        .changePassword(ChangePasswordTriggeredAction.changePasswordModel)
        .pipe(
          map((result: any) => {
            if (result.success === true) {
              return new ChangePasswordCompleted(result.data);
            } else {
              this.validationMessages = result.apiResponseMessages
              return new ChangePasswordFailed(result.apiResponseMessages);
            }
          }),
          catchError(error => {
            this.exceptionMessage = error;
            return of(new ChangePasswordExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertChangePasswordSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<ChangePasswordCompleted>(ChangePasswordActionTypes.ChangePasswordCompleted),
    pipe(map(() =>
          new SnackbarOpen({
            message: this.toastrMessage, // TODO: Change to proper toast message
            action: this.translateService.instant(ConstantVariables.success)
          })
      )
    )
  );

  @Effect()
  showValidationMessagesForChangePassword$: Observable<Action> = this.actions$.pipe(
    ofType<ChangePasswordFailed>(ChangePasswordActionTypes.ChangePasswordFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
          validationMessages: searchAction.validationMessages,
      })
      )
  })
  );

  @Effect()
  exceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ChangePasswordExceptionHandled>(ChangePasswordActionTypes.ChangePasswordExceptionHandled),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
          message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
  })
  );

  constructor(
    private actions$: Actions,
    private dashboardService: DashboardService,
    private translateService: TranslateService
  ) { }
}