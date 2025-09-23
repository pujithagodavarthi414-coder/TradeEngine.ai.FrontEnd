import { Actions, Effect, ofType } from "@ngrx/effects";
import { State } from "../reducers/index";
import { Injectable } from "@angular/core";
import { Observable, of, pipe } from "rxjs";
import { Action, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { switchMap, map, catchError } from "rxjs/operators";
import {
  UserActionTypes,
  LoadUsersTriggered,
  LoadUsersCompleted,
  LoggedUserTriggered,
  LoggedUserCompleted,
  ExceptionHandled,
  CreateUsersTriggered,
  CreateUsersCompleted,
  CreateUsersFailed,
  GetUserByIdCompleted,
  GetUserByIdTriggered,
  RefreshUsersList,
  CreateUserCompletedWithInPlaceUpdate,
  RemoveUserFromList,
  LoadUsersListTriggered,
  LoadUsersListCompleted
} from "../actions/users.actions";
import { ShowExceptionMessages, ShowValidationMessages } from "../actions/notification-validator.action";
import { UserModel } from '../../models/user-model';
import { AssetService } from '../../services/assets.service';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';


@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private assetService: AssetService, private store$: Store<State>, private translateService: TranslateService) { }
  toastrMessage: string;
  userData: UserModel;
  users: UserModel;
  userId: string;
  isNewUser: boolean;
  totalCount: number;

  @Effect()
  loadUsers$: Observable<Action> = this.actions$.pipe(
    ofType<LoadUsersTriggered>(UserActionTypes.LoadUsersTriggered),
    switchMap(() => {
      return this.assetService.GetAllUsers().pipe(
        map((users: any) => new LoadUsersCompleted(users.data)),
        catchError(err => {
          return of(new ExceptionHandled(err));
        })
      );
    })
  );

  @Effect()
  loadUsersList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadUsersListTriggered>(UserActionTypes.LoadUsersListTriggered),
    switchMap(searchAction => {
      this.users = searchAction.users;
      if (this.users)
        this.users.isUsersPage = true;
      return this.assetService
        .GetUsersList(searchAction.users)
        .pipe(map((users: any) => {
          if (users.success) {
            if (users.data.length > 0)
              this.totalCount = users.data[0].totalCount;
            return new LoadUsersListCompleted(users.data)
          }
          else {
            return new CreateUsersFailed(users.apiResponseMessages);
          }
        }),
          catchError(err => {
            return of(new ExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  upsertUser$: Observable<Action> = this.actions$.pipe(
    ofType<CreateUsersTriggered>(UserActionTypes.CreateUsersTriggered),
    switchMap(CreateUsersTriggeredAction => {
      if (CreateUsersTriggeredAction.users.userId === null || CreateUsersTriggeredAction.users.userId === '' || CreateUsersTriggeredAction.users.userId === undefined) {
        this.isNewUser = true;
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForUserCreated)
      } else if (
        CreateUsersTriggeredAction.users.userId !== undefined &&
        CreateUsersTriggeredAction.users.isArchived === true
      ) {
        this.isNewUser = false;
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForUserArchived)
      } else {
        this.isNewUser = false;
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForUserUpdated)
      }
      return this.assetService
        .upsertUser(CreateUsersTriggeredAction.users)
        .pipe(
          map((userId: any) => {
            if (userId.success === true) {
              this.userId = userId.data;
              return new CreateUsersCompleted(userId.data);
            }
            else {
              return new CreateUsersFailed(userId.apiResponseMessages);
            }
          }),
          catchError(error => {
            return of(new ExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertUserSuccessfulAndLoadUsers$: Observable<Action> = this.actions$.pipe(
    ofType<CreateUsersCompleted>(UserActionTypes.CreateUsersCompleted),
    switchMap(searchAction => {
      if (this.isNewUser) {
        return of(new LoadUsersListTriggered(this.users));
      }
      else
        return of(new LoadUsersListTriggered(this.users));
    })
  );

  @Effect()
  UpdateUserSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<CreateUsersCompleted>(UserActionTypes.CreateUsersCompleted),
    pipe(map(() =>
      new SnackbarOpen({
        message: this.toastrMessage, // TODO: Change to proper toast message
        action: this.translateService.instant(ConstantVariables.success)
      })
    )
    )
  );

  @Effect()
  upsertUserSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<RemoveUserFromList>(UserActionTypes.RemoveUserFromList),
    pipe(map(() =>
      new SnackbarOpen({
        message: this.toastrMessage, // TODO: Change to proper toast message
        action: this.translateService.instant(ConstantVariables.success)
      })
    )
    )
  );

  @Effect()
  getUserById$: Observable<Action> = this.actions$.pipe(
    ofType<GetUserByIdTriggered>(UserActionTypes.GetUserByIdTriggered),
    switchMap(searchAction => {
      return this.assetService
        .getUserById(searchAction.userId)
        .pipe(map((user: any) => {
          if (user.success === true) {
            if(user.data){
              user.data.totalCount = this.totalCount;}
              this.userData = user.data;
              return new GetUserByIdCompleted(user.data);
            } else {
              return new CreateUsersFailed(
                user.apiResponseMessages
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
  upsertUserSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<GetUserByIdCompleted>(UserActionTypes.GetUserByIdCompleted),
    pipe(map(() => {
      if (this.isNewUser) {
        return new RefreshUsersList(this.userData);
      }
      else {
        if (this.userData) {
          // return new CreateUserCompletedWithInPlaceUpdate({
          //   userUpdate: {
          //     id: this.userData.id,
          //     changes: this.userData
          //   }
          // });
          return new LoadUsersListTriggered(this.users);
        }
        else
          return new LoadUsersListTriggered(this.users);
      }
    })
    )
  );

  @Effect()
  LoggedUserId$: Observable<Action> = this.actions$.pipe(
    ofType<LoggedUserTriggered>(UserActionTypes.LoggedUserTriggered),
    switchMap(searchAction => {
      return this.assetService.getLoggedUserData().pipe(
        map((user: any) => new LoggedUserCompleted(user.data)),
        catchError(err => {
          return of(new ExceptionHandled(err));
        })
      );

    })
  );

  @Effect()
  exceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ExceptionHandled>(
      UserActionTypes.ExceptionHandled
    ),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForCreateUsersFailed$: Observable<Action> = this.actions$.pipe(
    ofType<CreateUsersFailed>(UserActionTypes.CreateUsersFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );
}