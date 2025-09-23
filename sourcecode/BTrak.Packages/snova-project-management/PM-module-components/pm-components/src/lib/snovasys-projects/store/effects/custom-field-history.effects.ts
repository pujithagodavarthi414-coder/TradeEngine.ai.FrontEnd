import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";

import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { LoadCustomFieldHistoryTriggered, CustomFieldHistoryActionTypes, LoadCustomFieldHistoryCompleted, LoadCustomFieldHistoryFailed, CustomFieldExceptionHandled } from "../actions/custom-field-history.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { CustomFieldService } from '../../services/custom-field.service';

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
                return of(new CustomFieldExceptionHandled(err));
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
  CustomFieldExceptionHandled$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<CustomFieldExceptionHandled>(
        CustomFieldHistoryActionTypes.CustomFieldExceptionHandled
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
        private customFieldService:CustomFieldService
      ) {}
}