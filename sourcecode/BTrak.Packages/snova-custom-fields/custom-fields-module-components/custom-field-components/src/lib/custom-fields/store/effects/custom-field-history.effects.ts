import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";

import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { LoadCustomFieldHistoryTriggered, CustomFieldHistoryActionTypes, LoadCustomFieldHistoryCompleted, LoadCustomFieldHistoryFailed, ExceptionsHandled } from "../actions/custom-field-history.actions";
import { CustomFieldService } from '../../servicces/custom-field.service';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';

@Injectable()
export class CustomFieldHistoryEffects {

  @Effect()
  loadCustomFieldHistory$: Observable<Action> = this.actions$.pipe(
    ofType<LoadCustomFieldHistoryTriggered>(CustomFieldHistoryActionTypes.LoadCustomFieldHistoryTriggered),
    switchMap(userStoryTriggeredAction => {
      return this.customFieldService
        .searchCustomFieldsHistory(userStoryTriggeredAction.customFieldModel)
        .pipe(
          map((result: any) => {
            if (result.success === true) {
              return new LoadCustomFieldHistoryCompleted(result.data);
            } else {
              return new LoadCustomFieldHistoryFailed(result.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new ExceptionsHandled(err));
          })
        );
    })
  );

  @Effect()
  showValidationMessagesForUserStoryHistory$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<LoadCustomFieldHistoryFailed>(
      CustomFieldHistoryActionTypes.LoadCustomFieldHistoryFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandled$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ExceptionsHandled>(
      CustomFieldHistoryActionTypes.ExceptionsHandled
    ),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  constructor(
    private actions$: Actions,
    private customFieldService: CustomFieldService
  ) { }
}