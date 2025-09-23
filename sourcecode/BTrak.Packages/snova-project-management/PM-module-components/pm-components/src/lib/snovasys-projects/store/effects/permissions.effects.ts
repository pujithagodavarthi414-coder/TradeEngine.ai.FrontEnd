import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action, Store, select } from "@ngrx/store";
import { switchMap, map, catchError, withLatestFrom } from "rxjs/operators";
import {
  LoadPermissionsListTriggered,
  LoadPermissionsListCompleted,
  permissionConfigurationActionTypes,
  LoadPermissionListExceptionHandled,
  LoadPermissionsListFailed,
  LoadpermisionsListCompletedFromCache
} from "../actions/permissions.action";
import { ShowExceptionMessages, ShowValidationMessages } from "../actions/notification-validator.action";

import * as _ from 'underscore';

@Injectable()
export class permissionEffects {
  @Effect()
  // loadConfigurationPermissions$: Observable<Action> = this.actions$.pipe(
  //   ofType<LoadPermissionsListTriggered>(
  //     permissionConfigurationActionTypes.LoadPermissionsListTriggered
  //   ),
  //   withLatestFrom(this.store$.pipe(select(commonReducers.getConfigurationPermissionsAll))),
  //   switchMap(([action, workflowStatuses]) => {
  //     var filteredConfigurationPermissions = _.filter(workflowStatuses, function (workflowStatus) {
  //       return workflowStatus.configurationTypeId.toUpperCase() == action.configurationSetting.configurationTypeId.toUpperCase()
  //     });
  //     if (filteredConfigurationPermissions && filteredConfigurationPermissions.length > 0) {
  //       return of(new LoadpermisionsListCompletedFromCache());
  //     } else {
  //       return this.configurationService
  //       .GetAllConfigurationSettings(action.configurationSetting)
  //       .pipe(
  //         map((user: any) => {
  //           if(user.success == true){
  //             return new LoadPermissionsListCompleted(user.data);
  //           }else{
  //             return new LoadPermissionsListFailed(user.apiResponseMessages)
  //           }
  //         }),
  //         catchError(err => {
  //           return of(new ExceptionHandled(err));
  //         })
  //       );
  //     }
  //   })
  // );

  
  @Effect()
  showValidationMessagesForCnfigurationTypes$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<LoadPermissionsListFailed>(
      permissionConfigurationActionTypes.LoadPermissionsListFailed
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
    ofType<LoadPermissionListExceptionHandled>(
      permissionConfigurationActionTypes.LoadPermissionListExceptionHandled
    ),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  constructor(
    private actions$: Actions
  ) {}
}
