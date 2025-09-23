import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { ShowExceptionMessages, ShowValidationMessages } from "../actions/notification-validator.action";
import { ProjectGoalsService } from "../../services/goals.service";
import { LoadUserstoryLinksTriggered, UserStoryLinksActionTypes, LoadUserstoryLinksCompleted, LoadUserstoryLinksFailed, UserStoryLinksExceptionHandled, GetUserStoryLinksTypesTriggered, GetUserStoryLinksTypesFailed, GetUserStoryLinksTypesCompleted, UpsertUserStoryLinkTriggered, UpsertUserStoryLinkCompleted, UpsertUserStoryLinkFailed, RefreshUserStoriesLink, ArchiveUserStoryLinkTriggered, ArchiveUserStoryLinkCompleted, ArchiveUserStoryLinkFailed } from "../actions/userstory-links.action";
import { LinkUserStoryInputModel } from "../../models/link-userstory-input-model";

@Injectable()
export class UserStoryLinksEffects {
 userStoryId : string;
 userStoryLinkId : string;
 isSprintUserStories: boolean;
  @Effect()
  loadUserStoryLinks$: Observable<Action> = this.actions$.pipe(
    ofType<LoadUserstoryLinksTriggered>(UserStoryLinksActionTypes.LoadUserstoryLinksTriggered),
    switchMap(userStoryTriggeredAction => {
      this.isSprintUserStories = userStoryTriggeredAction.linkUserStoryInputModel.isSprintUserStories;
      return this.goalsService
        .getLinkUserStories(userStoryTriggeredAction.linkUserStoryInputModel)
        .pipe(
          map((result: any) => {
            if (result.success === true) {
              return new LoadUserstoryLinksCompleted(result.data);
            } else {
              return new LoadUserstoryLinksFailed(result.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryLinksExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  loadUserStoryLinksTypes$: Observable<Action> = this.actions$.pipe(
    ofType<GetUserStoryLinksTypesTriggered>(UserStoryLinksActionTypes.GetUserStoryLinksTypesTriggered),
    switchMap(searchAction => {
      {
        return this.goalsService
          .getLinkUserStoryTypes(searchAction.linkUserStoryInputModel)
          .pipe(
            map((userStories: any) => {
              if (userStories.success) {
                return new GetUserStoryLinksTypesCompleted(userStories.data)
              }
              else {
                return new GetUserStoryLinksTypesFailed(userStories.apiResponseMessages);
              }
            }),
            catchError(err => {
              return of(new UserStoryLinksExceptionHandled(err));
            })
          );
      }
    })
  );

  @Effect()
  upsertUserStoryLinks$: Observable<Action> = this.actions$.pipe(
    ofType<UpsertUserStoryLinkTriggered>(UserStoryLinksActionTypes.UpsertUserStoryLinkTriggered),
    switchMap(searchAction => {
      {
        this.userStoryId = searchAction.linkUserStoryInputModel.userStoryId;
        return this.goalsService
          .upsertUserStoryLink(searchAction.linkUserStoryInputModel)
          .pipe(
            map((userStories: any) => {
              if (userStories.success) {
                this.userStoryLinkId = userStories.data;
                return new UpsertUserStoryLinkCompleted(userStories.data)
              }
              else {
                return new UpsertUserStoryLinkFailed(userStories.apiResponseMessages);
              }
            }),
            catchError(err => {
              return of(new UserStoryLinksExceptionHandled(err));
            })
          );
      }
    })
  );

  @Effect()
  getUserStoryById$: Observable<Action> = this.actions$.pipe(
    ofType<UpsertUserStoryLinkCompleted>(UserStoryLinksActionTypes.UpsertUserStoryLinkCompleted),
    switchMap(searchAction => {
      {
        var model = new LinkUserStoryInputModel();
        model.userStoryLinkId = this.userStoryLinkId;
        model.isSprintUserStories = this.isSprintUserStories;
        return this.goalsService
          .getLinkUserStories(model)
          .pipe(
            map((userStories: any) => {
              if (userStories.success) {
                return new RefreshUserStoriesLink(userStories.data[0])
              }
              else {
                return new GetUserStoryLinksTypesFailed(userStories.apiResponseMessages);
              }
            }),
            catchError(err => {
              return of(new UserStoryLinksExceptionHandled(err));
            })
          );
      }
    })
  );

  @Effect()
  archiveUserStoryLink$: Observable<Action> = this.actions$.pipe(
    ofType<ArchiveUserStoryLinkTriggered>(UserStoryLinksActionTypes.ArchiveUserStoryLinkTriggered),
    switchMap(searchAction => {
      {
        return this.goalsService
          .archiveUserStoryLink(searchAction.archivedLinkModel)
          .pipe(
            map((userStories: any) => {
              if (userStories.success) {
                return new ArchiveUserStoryLinkCompleted(searchAction.archivedLinkModel.userStoryLinkId);
              }
              else {
                return new ArchiveUserStoryLinkFailed(userStories.apiResponseMessages);
              }
            }),
            catchError(err => {
              return of(new UserStoryLinksExceptionHandled(err));
            })
          );
      }
    })
  );
  


  @Effect()
  showValidationMessagesForUserStoryList$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<GetUserStoryLinksTypesFailed>(
      UserStoryLinksActionTypes.GetUserStoryLinksTypesFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForUpsertUserStoryLink$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<UpsertUserStoryLinkFailed>(
      UserStoryLinksActionTypes.UpsertUserStoryLinkFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForArchiveUserStoryList$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ArchiveUserStoryLinkFailed>(
      UserStoryLinksActionTypes.ArchiveUserStoryLinkFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForUserStoryHistory$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<LoadUserstoryLinksFailed>(
      UserStoryLinksActionTypes.LoadUserstoryLinksFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  UserStoryLinksExceptionHandled$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<UserStoryLinksExceptionHandled>(
      UserStoryLinksActionTypes.UserStoryLinksExceptionHandled
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
    private goalsService: ProjectGoalsService
  ) { }
}