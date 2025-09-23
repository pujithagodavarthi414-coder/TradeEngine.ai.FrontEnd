import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable, of, pipe } from "rxjs";
import { Action } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { switchMap, map, catchError } from "rxjs/operators";

import { EmployeeService } from '../../services/employee-service';

import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { UserProfileActionTypes, ExceptionHandled, GetUserProfileByIdTriggered, GetUserProfileByIdCompleted, GetUserProfileByIdFailed } from "../actions/user-profile.action";

import { CookieService } from "ngx-cookie-service";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';


@Injectable()
export class UserProfileEffects {
    toastrMessage: string;

    @Effect()
    getUserProfileDetailsById$: Observable<Action> = this.actions$.pipe(
        ofType<GetUserProfileByIdTriggered>(UserProfileActionTypes.GetUserProfileByIdTriggered),
        switchMap(searchAction => {
            return this.employeeService
                .getUserById(searchAction.userId)
                .pipe(map((result: any) => {
                    if (result.success === true) {
                        return new GetUserProfileByIdCompleted(result.data);
                    } else {
                        return new GetUserProfileByIdFailed(
                            result.apiResponseMessages
                        );
                    }
                }),
                    catchError(error => {
                        return of(new ExceptionHandled(error));
                    })
                );
        })
    );

    // @Effect()
    // upsertUserProfileImage$: Observable<Action> = this.actions$.pipe(
    //     ofType<CreateProfileImageTriggered>(UserProfileActionTypes.CreateProfileImageTriggered),
    //     switchMap(searchAction => {
    //         if (searchAction.uploadProfileImageModel.profileImage === null || searchAction.uploadProfileImageModel.profileImage === '' || searchAction.uploadProfileImageModel.profileImage === undefined) {
    //             this.toastrMessage = this.translateService.instant(ConstantVariables.ProfileImageRemovedSuccessfully)
    //         } else {
    //             this.toastrMessage = this.translateService.instant(ConstantVariables.ProfileImageUpdatedSuccessfully)
    //         }
    //         return this.profileService
    //             .uploadProfileImage(searchAction.uploadProfileImageModel)
    //             .pipe(map((result: any) => {
    //                     if (result.success === true) 
    //                         return new CreateProfileImageCompleted(result.data);
    //                      else 
    //                         return new CreateProfileImageFailed(result.apiResponseMessages);
    //                 }),
    //                 catchError(error => {
    //                     return of(new ExceptionHandled(error));
    //                 })
    //             );
    //     })
    // );

    // @Effect()
    // upsertUserProfileImageSuccessfullAndLoadLoggedInUser$: Observable<Action> = this.actions$.pipe(
    //     ofType<CreateProfileImageCompleted>(UserProfileActionTypes.CreateProfileImageCompleted),
    //     switchMap(searchAction => {
    //             return of(new GetUserProfileByIdTriggered(searchAction.userId));
    //     })
    // );

    // @Effect()
    // userProfilePhoto$: Observable<Action> = this.actions$.pipe(
    //     ofType<GetUserProfileByIdCompleted>(UserProfileActionTypes.GetUserProfileByIdCompleted),
    //     switchMap(searchAction => {
    //         let userId = this.cookieService.get(LocalStorageProperties.CurrentUserId)
    //         if(searchAction.userModel.id == userId)
    //             return of(new UserDetailsFetched(searchAction.userModel));
    //         else
    //             return of(new UserIsViewingOthersProfile());
    //     })
    // );

    // @Effect()
    // upsertEmployeeLanguageDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    //     ofType<CreateProfileImageCompleted>(UserProfileActionTypes.CreateProfileImageCompleted),
    //     pipe(map(() =>
    //         new SnackbarOpen({
    //             message: this.toastrMessage, // TODO: Change to proper toast message
    //             action: this.translateService.instant(ConstantVariables.success)
    //         })
    //     )
    //     )
    // );

    @Effect()
    showValidationMessagesForGetUserProfileById$: Observable<Action> = this.actions$.pipe(
        ofType<GetUserProfileByIdFailed>(UserProfileActionTypes.GetUserProfileByIdFailed),
        switchMap(searchAction => {
            return of(new ShowValidationMessages({
                validationMessages: searchAction.validationMessages,
            })
            )
        })
    );

    // @Effect()
    // showValidationMessagesForCreateProfileImage$: Observable<Action> = this.actions$.pipe(
    //     ofType<CreateProfileImageFailed>(UserProfileActionTypes.CreateProfileImageFailed),
    //     switchMap(searchAction => {
    //         return of(new ShowValidationMessages({
    //             validationMessages: searchAction.validationMessages,
    //         })
    //         )
    //     })
    // );

    @Effect()
    exceptionHandledForUserProfile$: Observable<Action> = this.actions$.pipe(
        ofType<ExceptionHandled>(UserProfileActionTypes.ExceptionHandled),
        switchMap(searchAction => {
            return of(new ShowExceptionMessages({
                message: searchAction.errorMessage, // TODO: Change to proper toast message
            })
            )
        })
    );

    constructor(
        private actions$: Actions,
        private employeeService: EmployeeService,
    ) { }
}