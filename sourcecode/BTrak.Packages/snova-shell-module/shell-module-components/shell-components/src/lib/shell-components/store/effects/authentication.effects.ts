import { Inject, Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { Observable, of, pipe } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import {
  Authenticated,
  AuthenticateUser,
  AuthenticationActionTypes,
  CompanyWorkItemStartFunctionalityRequired,
  CompanyWorkItemStartFunctionalityRequiredSuccess,
  AuthenticationFailed,
  ClearDemoDataCompleted,
  ClearDemoDataFailed,
  ClearDemoDataTriggred,
  EntityReolesByUserIdFetchCompleted,
  EntityRoleDetailsFetched,
  EntityRolesByUserIdFetchFailed,
  EntityRolesByUserIdFetchTriggered,
  EntityRolesFetchTriggered,
  GetCompanyThemeCompleted,
  GetCompanyThemeFailed,
  GetCompanyThemeTriggered,
  InitializeAfterLoginData,
  RoleDetailsFetched,
  RoleDetailsFetchOnReload,
  RolesFetchFailed,
  SignedOff,
  UserDetailsFetching,
  UserDetailsFetched,
  GetUserStoreIdTriggered,
  GetUserStoreIdCompleted,
  GetUserStoreIdFailed,
  ExceptionHandled,
  AuthenticateNewUser,
  GetCompanySettingsTriggered,
  GetCompanySettingsCompleted,
  GetCompanySettingsFailed,
  UserDetailsFetchedAfterLogin,
  UserDetailsFetchedAfterCompanyLogin,
  UserInitialDetailsFetched,
  UserInitialDetailsFetchedCompleted,
  FetchTimeSheetButtonDetails
} from "../actions/authentication.actions";
import { AuthenticationService } from "../../services/authentication.service";
import { MenuItemService } from "../../services/feature.service";
import { CookieService } from "ngx-cookie-service";
import { ShowExceptionMessages, ShowValidationMessages } from "../actions/notification-validator.action";
import { ToastrService } from "ngx-toastr";
import { WINDOW } from '../../../globaldependencies/helpers/window.helper';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { CommonService } from '../../services/common-used.service';
import { CompanysettingsModel } from '../../models/company-model';

/** @dynamic */

@Injectable()

export class AuthenticationEffects {
  validationMessages: any[];
  goalId: string;
  userStoryId: string;
  sprintId: string;
  isSprintType: boolean;
  logInData: any;
  @Effect()
  authenticate$: Observable<Action> = this.actions$.pipe(
    ofType<AuthenticateUser>(AuthenticationActionTypes.AuthenticateUser),
    switchMap((action) => {
      return this.authenticationService
        .login(action.userName, action.password)
        .pipe(
          map((userToken: any) => {
            this.logInData = userToken.data;
            console.log(this.window.location.hostname);
            let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
            this.cookieService.set(LocalStorageProperties.CurrentUser, userToken.data.authToken, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
            // this.cookieService.set(LocalStorageProperties.DefaultDashboard, JSON.stringify(userToken.data.defaultDashboardId), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
            this.cookieService.set(LocalStorageProperties.CompanyDetails, JSON.stringify(userToken.data.companyDetails), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
            localStorage.setItem(LocalStorageProperties.RoleFeatures, JSON.stringify(userToken.data.roleFeatures));
            localStorage.setItem(LocalStorageProperties.SoftLabels, JSON.stringify(userToken.data.softLabels));
            this.cookieService.set(LocalStorageProperties.FromLogIn, JSON.stringify(true), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
            // return new Authenticated(
            //   action.userName,
            //   JSON.stringify(userToken.data.authToken)
            // );
            this.cookieService.set(LocalStorageProperties.CurrentUserId, userToken.data.usersModel.id, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
            this.cookieService.set(LocalStorageProperties.CompanyName, userToken.data.usersModel.companyName, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
            this.cookieService.set(LocalStorageProperties.CompanyId, userToken.data.usersModel.companyId, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
            return new UserDetailsFetched(userToken.data.usersModel);
          }),
          catchError((error) => of(new AuthenticationFailed(error)))
        );
    })
  );

  @Effect()
  authenticateNewUser$: Observable<Action> = this.actions$.pipe(
    ofType<AuthenticateNewUser>(AuthenticationActionTypes.AuthenticateNewUser),
    switchMap((action) => {
      return this.authenticationService
        .loginNewUser(action.userName)
        .pipe(
          map((userToken: any) => {
            this.logInData = userToken.data;
            console.log(this.window.location.hostname);
            let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
            this.cookieService.set(LocalStorageProperties.CurrentUser, userToken.data.authToken, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
            this.cookieService.set(LocalStorageProperties.DefaultDashboard, JSON.stringify(userToken.data.defaultDashboardId), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
            this.cookieService.set(LocalStorageProperties.CompanyDetails, JSON.stringify(userToken.data.companyDetails), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
            localStorage.setItem(LocalStorageProperties.RoleFeatures, JSON.stringify(userToken.data.roleFeatures));
            localStorage.setItem(LocalStorageProperties.SoftLabels, JSON.stringify(userToken.data.softLabels));
            this.cookieService.set(LocalStorageProperties.FromLogIn, JSON.stringify(true), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
            // return new Authenticated(
            //   action.userName,
            //   JSON.stringify(userToken.data.authToken)
            // );
            this.cookieService.set(LocalStorageProperties.CurrentUserId, userToken.data.usersModel.id, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
            this.cookieService.set(LocalStorageProperties.CompanyName, userToken.data.usersModel.companyName, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
            this.cookieService.set(LocalStorageProperties.CompanyId, userToken.data.usersModel.companyId, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
            return new UserDetailsFetched(userToken.data.usersModel);
          }),
          catchError((error) => of(new AuthenticationFailed(error)))
        );
    })
  );

  @Effect()
  authenticated$: Observable<Action> = this.actions$.pipe(
    ofType<Authenticated>(AuthenticationActionTypes.Authenticated),
    switchMap((action) => {
      return this.userService.getLoggedInUser().pipe(
        map((userRecord: any) => {
          console.log(this.window.location.hostname);
          let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
          this.cookieService.set(LocalStorageProperties.CurrentUserId, userRecord.data.id, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          this.cookieService.set(LocalStorageProperties.CompanyName, userRecord.data.companyName, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          this.cookieService.set(LocalStorageProperties.CompanyId, userRecord.data.companyId, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          return new UserDetailsFetched(userRecord.data);
        })
      );
    })
  );

  @Effect()
  companyWorkItemStartFunctionalityRequired$: Observable<Action> = this.actions$.pipe(
    ofType<CompanyWorkItemStartFunctionalityRequired>(AuthenticationActionTypes.CompanyWorkItemStartFunctionalityRequired),
    switchMap((action) => {
      return this.userService.getCompanyWorkItemStartFunctionalityRequired().pipe(
        map((record: any) => {
          console.log(this.window.location.hostname);
          return new CompanyWorkItemStartFunctionalityRequiredSuccess(record.data);
        })
      );
    })
  );
  

  // @Effect()
  // UserDetailsFetching$: Observable<Action> = this.actions$.pipe(
  //   ofType<UserDetailsFetching>(AuthenticationActionTypes.UserDetailsFetching),
  //   pipe(
  //     map((action: any) => {
  //       //var configurations = new SoftLabelConfigurationModel();
  //       //return new GetsoftLabelsTriggered(configurations);
  //       return new UserDetailsFetched(action.loginData.UsersModel);
  //     })
  //   )
  // );

  @Effect({ dispatch: false })
  authenticateSignedOff$: Observable<Action> = this.actions$.pipe(
    ofType<SignedOff>(AuthenticationActionTypes.SignedOff),
    tap((action) => {
      this.cookieService.delete(LocalStorageProperties.CurrentUser);
    })
  );

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

  // @Effect()
  // initializeSoftLabelsAfterLoginData$: Observable<Action> = this.actions$.pipe(
  //   ofType<UserDetailsFetched>(
  //     AuthenticationActionTypes.UserDetailsFetched
  //   ),
  //   pipe(
  //     map(() => {
  //       var softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  //       return new GetsoftLabelsCompleted(softLabels);
  //     })
  //   )
  // );

  @Effect()
  initializeRolesAfterLoginDataForUser$: Observable<Action> = this.actions$.pipe(
    ofType<UserDetailsFetchedAfterLogin>(
      AuthenticationActionTypes.UserDetailsFetchedAfterLogin
    ),
    pipe(
      map(() => {
        var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures));
        return new RoleDetailsFetched(roles);
      })
    )
  );


  @Effect()
  initializeLoginDataForUserCompany$: Observable<Action> = this.actions$.pipe(
    ofType<UserDetailsFetchedAfterCompanyLogin>(
      AuthenticationActionTypes.UserDetailsFetchedAfterCompanyLogin
    ),
    pipe(
      map((action) => {
        return new UserDetailsFetchedAfterLogin(action.userModel);
      })
    )
  );
  
  @Effect()
  initializeLoginDataForUser$: Observable<Action> = this.actions$.pipe(
    ofType<UserDetailsFetchedAfterLogin>(
      AuthenticationActionTypes.UserDetailsFetchedAfterLogin
    ),
    switchMap(() => {
      return this.commonService.getUserInitialData()
        .pipe(map((res: any) => {
          console.log(res.data);
          let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
          let data = res.data;
          localStorage.setItem(LocalStorageProperties.UserRoleFeatures, JSON.stringify(data.entityFeatures));
          this.cookieService.set(LocalStorageProperties.AddOrEditCustomAppIsRequired, data.addOrEditCustomAppIsRequired, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          return new UserInitialDetailsFetchedCompleted(res.data.timeSheetButtonDetails);
        })
        )
    })
  );

  @Effect()
  fetchUserTimeSheetButtonDetails$: Observable<Action> = this.actions$.pipe(
    ofType<FetchTimeSheetButtonDetails>(
      AuthenticationActionTypes.FetchTimeSheetButtonDetails
    ),
    switchMap(() => {
      return  this.commonService.getTimeSheetEnabledInformation()
        .pipe(map((res: any) => {
            return new UserInitialDetailsFetchedCompleted(res);
        })
        )
    })
  );

  // @Effect()
  // initializeCompanySettingsLoginDataForUserCompleted: Observable<Action> = this.actions$.pipe(
  //   ofType<UserInitialDetailsFetchedCompleted>(
  //     AuthenticationActionTypes.UserInitialDetailsFetchedCompleted
  //   ),
  //   pipe(
  //     map((res: any) => {
  //       return new GetCompanySettingsCompleted(res.companySettings);
  //     })
  //   )
  // );

  // @Effect()
  // initializeEntityRoleFeaturesLoginDataForUserCompleted: Observable<Action> = this.actions$.pipe(
  //   ofType<UserInitialDetailsFetchedCompleted>(
  //     AuthenticationActionTypes.UserInitialDetailsFetchedCompleted
  //   ),
  //   pipe(
  //     map((res: any) => {
  //       return new EntityReolesByUserIdFetchCompleted(res.entityFeatures);
  //     })
  //   )
  // );


  // @Effect()
  // initializeSoftLabelsAfterLoginDataForUser$: Observable<Action> = this.actions$.pipe(
  //   ofType<UserDetailsFetchedAfterLogin>(
  //     AuthenticationActionTypes.UserDetailsFetchedAfterLogin
  //   ),
  //   pipe(
  //     map(() => {
  //       var softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
  //       return new GetsoftLabelsCompleted(softLabels);
  //     })
  //   )
  // );

  // @Effect()
  // initializeAfterGettingSoftLabels$: Observable<Action> = this.actions$.pipe(
  //   ofType<UserDetailsFetched>(
  //     AuthenticationActionTypes.UserDetailsFetched
  //   ),
  //   pipe(
  //     map((action: any) => {        
  //       var fromLogIn = JSON.parse(localStorage.getItem('FromLogIn'));
  //       if(fromLogIn) {
  //         return new GetsoftLabelsCompleted(this.logInData.softLabels);
  //       } else {
  //         var configurations = new SoftLabelConfigurationModel();
  //          return new GetsoftLabelsTriggered(configurations);
  //       }        
  //     })
  //   )
  // );

  // @Effect()
  // initializeAfterGettingRoleFeatures$: Observable<Action> = this.actions$.pipe(
  //   ofType<UserDetailsFetching>(
  //     AuthenticationActionTypes.UserDetailsFetched
  //   ),
  //   pipe(
  //     map((action: any) => {
  //      // var roles = localStorage.getItem('Roles');
  //      var fromLogIn = JSON.parse(localStorage.getItem('FromLogIn'));
  //       if(fromLogIn) {
  //       return new RoleDetailsFetched(this.logInData.roleFeatures);
  //       } else {
  //         return new RoleDetailsFetchOnReload();
  //       }
  //     })
  //   )
  // );

  // @Effect()
  // initializeThemeAfterLogin$: Observable<Action> = this.actions$.pipe(
  //   ofType<UserDetailsFetched>(
  //     AuthenticationActionTypes.UserDetailsFetched
  //   ),
  //   pipe(
  //     map(() => {
  //       return new GetCompanyThemeTriggered();
  //     })
  //   )
  // );

  @Effect()
  gettingRoleDetailsAfterInitializeLoginData$: Observable<Action> = this.actions$.pipe(
    ofType<EntityRolesFetchTriggered>(
      AuthenticationActionTypes.EntityRolesFetchTriggered
    ),
    switchMap((action) => {
      return this.featureService.getAllPermittedEntityRoleFeatures(action.projectId).pipe(
        map((roleFeatures: any) => {
          if (roleFeatures.success) {
            localStorage.setItem(LocalStorageProperties.EntityRoleFeatures, JSON.stringify(roleFeatures.data));
            return new EntityRoleDetailsFetched(roleFeatures.data);
          } else {
            this.validationMessages = roleFeatures.apiResponseMessages;
            return new RolesFetchFailed(roleFeatures.apiResponseMessages);
          }
        })
      );
    })
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
  entityRolesTRiggered$: Observable<Action> = this.actions$.pipe(
    ofType<UserDetailsFetched>(
      AuthenticationActionTypes.UserDetailsFetched
    ),
    pipe(
      map(() => {
        return new EntityRolesByUserIdFetchTriggered("null", "null", false);
      })
    )
  );

  // @Effect()
  // companySettingsTriggeredAfterLogin$: Observable<Action> = this.actions$.pipe(
  //   ofType<UserDetailsFetchedAfterLogin>(
  //     AuthenticationActionTypes.UserDetailsFetchedAfterLogin
  //   ),
  //   pipe(
  //     map(() => {
  //       var companySettingsModel = new CompanysettingsModel();
  //       companySettingsModel.isArchived = false;
  //       return new GetCompanySettingsTriggered(companySettingsModel);
  //     })
  //   )
  // );

  // @Effect()
  // entityRolesTRiggeredAfterLogin$: Observable<Action> = this.actions$.pipe(
  //   ofType<UserDetailsFetchedAfterLogin>(
  //     AuthenticationActionTypes.UserDetailsFetchedAfterLogin
  //   ),
  //   pipe(
  //     map(() => {
  //       return new EntityRolesByUserIdFetchTriggered("null", "null", false);
  //     })
  //   )
  // );

  @Effect()
  loadCompanySettings$: Observable<Action> = this.actions$.pipe(
    ofType<GetCompanySettingsTriggered>(
      AuthenticationActionTypes.GetCompanySettingsTriggered
    ),
    switchMap((action) => {
      return this.userService.getAllCompanySettingsDetails(action.companySettingsModel).pipe(
        map((roleFeatures: any) => {
          if (roleFeatures.success) {
            localStorage.setItem(LocalStorageProperties.CompanySettings, JSON.stringify(roleFeatures.data));
            return new GetCompanySettingsCompleted(roleFeatures.data);
          } else {
            return new GetCompanySettingsFailed(roleFeatures.apiResponseMessages);
          }
        })
      );
    })
  );

  @Effect()
  gettingRoleDetailsByUserIdAfterInitializeLoginData$: Observable<Action> = this.actions$.pipe(
    ofType<EntityRolesByUserIdFetchTriggered>(
      AuthenticationActionTypes.EntityRolesByUserIdFetchTriggered
    ),
    switchMap(action => {
      if (action.requiredType == 'goal') {
        this.goalId = action.projectId;
        this.userStoryId = null;
        this.sprintId = null;
      }
      else if (action.requiredType == 'userStory') {
        this.userStoryId = action.projectId;
        this.goalId = null;
        this.sprintId = null;
      } else if (action.requiredType == 'sprint') {
        this.sprintId = action.projectId;
        this.goalId = null;
        this.userStoryId = null;
      }
      else {
        this.userStoryId = null;
        this.goalId = null;
        this.sprintId = null;
      }
      this.isSprintType = action.isSprintType;
      return this.featureService.getAllPermittedEntityRoleFeaturesByUserId().pipe(
        map((roleFeatures: any) => {
          if (roleFeatures.success) {
            localStorage.setItem(LocalStorageProperties.UserRoleFeatures, JSON.stringify(roleFeatures.data));
            return new EntityReolesByUserIdFetchCompleted(roleFeatures.data);
          } else {
            this.validationMessages = roleFeatures.apiResponseMessages;
            return new EntityRolesByUserIdFetchFailed(roleFeatures.apiResponseMessages);
          }
        }),
        catchError(err => {
          return of(new ExceptionHandled(err));
        })
      );
    })
  );

  @Effect()
  initializeAfterLoginData2$: Observable<Action> = this.actions$.pipe(
    ofType<InitializeAfterLoginData>(
      AuthenticationActionTypes.InitializeAfterLoginData
    ),
    switchMap((action) => {
      return this.userService.getLoggedInUser().pipe(
        map((userRecord: any) => {
          console.log(this.window.location.hostname);
          let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
          this.cookieService.set(LocalStorageProperties.CurrentUserId, userRecord.data.id, null,
            environment.cookiePath, this.window.location.hostname, false, "Strict");
          this.cookieService.set(LocalStorageProperties.CompanyName, userRecord.data.companyName, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          this.cookieService.set(LocalStorageProperties.CompanyId, userRecord.data.companyId, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
          return new UserDetailsFetched(userRecord.data);
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
  showValidationMessagesForEntityRoles$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<EntityRolesByUserIdFetchFailed>(
      AuthenticationActionTypes.EntityRolesByUserIdFetchFailed
    ),
    switchMap((searchAction) => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages
      })
      )
    })
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
  demoDataClearEventTriggred$: Observable<Action> = this.actions$.pipe(
    ofType<ClearDemoDataTriggred>(
      AuthenticationActionTypes.ClearDemoDataTriggred
    ),
    switchMap((action) => {
      return this.featureService.clearDemoData().pipe(
        map((response: any) => {
          if (response.success) {
            this.toastr.success("Demo data cleared successfully");
            return new ClearDemoDataCompleted(response.data);
          } else {
            this.validationMessages = response.apiResponseMessages;
            this.toastr.error(this.validationMessages[0].message);
            return new ClearDemoDataFailed(response.apiResponseMessages);
          }
        })
      );
    })
  );

  @Effect()
  getThemeColor$: Observable<Action> = this.actions$.pipe(
    ofType<GetCompanyThemeTriggered>(
      AuthenticationActionTypes.GetCompanyThemeTriggered,
    ),
    switchMap(action => {
      return this.authenticationService.getThemes().pipe(
        map((response: any) => {
          if (response.success) {
            let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
            this.cookieService.set(LocalStorageProperties.CompanyTheme, JSON.stringify(response.data), null, environment.cookiePath, this.window.location.hostname, false, "Strict");
            return new GetCompanyThemeCompleted(response.data);
          }
          else {
            return new GetCompanyThemeFailed(response.apiResponseMessages);
          }
        })
      );
    })
  );

  @Effect()
  demoDataClearEventSuccessful$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ClearDemoDataCompleted>(
      AuthenticationActionTypes.ClearDemoDataCompleted
    ),
    pipe(
      map(() => {
        return new InitializeAfterLoginData();
      })
    )
  );

  // @Effect()
  // loadGoalAndUserStoryData$: Observable<
  //   Action
  // > = this.actions$.pipe(
  //   ofType<EntityReolesByUserIdFetchCompleted>(
  //     AuthenticationActionTypes.EntityReolesByUserIdFetchCompleted
  //   ),
  //   pipe(
  //     map(() => {
  //       if (this.goalId) {
  //         return new GetUniqueGoalByIdTriggered(this.goalId);
  //       }
  //       else if (this.userStoryId) {
  //         if (this.isSprintType) {
  //           return new GetUniqueSprintWorkItemByIdTriggered(this.userStoryId);
  //         } else {
  //           return new GetUniqueUserStoryByIdTriggered(this.userStoryId);
  //         }
  //       } else if (this.sprintId) {
  //         return new GetUniqueSprintsByIdTriggered(this.sprintId);
  //       }
  //       else {
  //         return new ArchiveUnArchiveGoalCompleted();
  //       }

  //     })
  //   )
  // );

  @Effect()
  getUserStoreIdDetails$: Observable<Action> = this.actions$.pipe(
    ofType<GetUserStoreIdTriggered>(AuthenticationActionTypes.GetUserStoreIdTriggered),
    switchMap(searchAction => {
      return this.userService
        .getStores(searchAction.searchUserStoreDetailsModel)
        .pipe(map((storeData: any) => {
          if (storeData.success === true)
            return new GetUserStoreIdCompleted(storeData.data[0]);
          else
            return new GetUserStoreIdFailed(storeData.apiResponseMessages);
        }),
          catchError(error => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  showValidationMessagesForGetUserStoreId$: Observable<Action> = this.actions$.pipe(
    ofType<GetUserStoreIdFailed>(AuthenticationActionTypes.GetUserStoreIdFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  exceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(AuthenticationActionTypes.ExceptionHandled),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  constructor(
    private actions$: Actions,
    private authenticationService: AuthenticationService,
    private userService: CommonService,
    private commonService: CommonService,
    private featureService: MenuItemService,
    private cookieService: CookieService,
    private toastr: ToastrService,
    @Inject(WINDOW) private window: Window
  ) { }
}
