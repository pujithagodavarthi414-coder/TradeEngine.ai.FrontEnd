import { Inject, Injectable, InjectionToken } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { Observable, of, pipe } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import {
  AuthenticationActionTypes,
  RoleDetailsFetched,
  RoleDetailsFetchOnReload,
  RolesFetchFailed,
  UserDetailsFetching,
  UserDetailsFetched,
  AuthenticationExceptionHandled,
  GetCompanySettingsTriggered,
  GetCompanySettingsCompleted,
  GetCompanySettingsFailed
} from "../actions/authentication.actions";
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { GetsoftLabelsCompleted, GetsoftLabelsFailed, GetsoftLabelsTriggered } from "../actions/soft-labels.actions";
import { CompanysettingsModel } from '../../models/company-model';
import { AssetService } from '../../services/assets.service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Injectable()
export class AuthenticationEffects {
  validationMessages: any[];
  goalId: string;
  userStoryId: string;
  sprintId: string;
  isSprintType: boolean;
  logInData: any;

  @Effect()
  initializeRolesAfterLoginData$: Observable<Action> = this.actions$.pipe(
    ofType<UserDetailsFetched>(
      AuthenticationActionTypes.UserDetailsFetched
    ),
    pipe(
      map(() => {
        var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
        return new RoleDetailsFetched(roles);
      })
    )
  );

  @Effect()
  initializeSoftLabelsAfterLoginData$: Observable<Action> = this.actions$.pipe(
    ofType<UserDetailsFetched>(
      AuthenticationActionTypes.UserDetailsFetched
    ),
    pipe(
      map(() => {
        var softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
        return new GetsoftLabelsCompleted(softLabels);
      })
    )
  );

  @Effect()
  companySettingsTriggered$: Observable<Action> = this.actions$.pipe(
    ofType<UserDetailsFetched>(
      AuthenticationActionTypes.UserDetailsFetched
    ),
    pipe(
      map(() => {
        var companySettingsModel = new CompanysettingsModel();
        companySettingsModel.isArchived = false;
        return new GetCompanySettingsTriggered(companySettingsModel);
      })
    )
  );

  @Effect()
  loadCompanySettings$: Observable<Action> = this.actions$.pipe(
    ofType<GetCompanySettingsTriggered>(
      AuthenticationActionTypes.GetCompanySettingsTriggered
    ),
    switchMap((action) => {
      return this.assetService.getAllCompanySettingsDetails(action.companySettingsModel).pipe(
        map((roleFeatures: any) => {
          if (roleFeatures.success) {
            return new GetCompanySettingsCompleted(roleFeatures.data);
          } else {
            return new GetCompanySettingsFailed(roleFeatures.apiResponseMessages);
          }
        })
      );
    })
  );

  @Effect()
  showValidationMessagesFoRoleFeatures$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<RolesFetchFailed>(
      AuthenticationActionTypes.RolesFetchFailed
    ),
    pipe(
      map(
        () => {
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
  showValidationMessagesForCompanySettings$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<GetCompanySettingsFailed>(
      AuthenticationActionTypes.GetCompanySettingsFailed
    ),
    switchMap((searchAction) => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages
      })
      )
    })
  );

  @Effect()
  AuthenticationExceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<AuthenticationExceptionHandled>(AuthenticationActionTypes.AuthenticationExceptionHandled),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  constructor(
    private actions$: Actions,
    private assetService: AssetService,
  ) { }
}
