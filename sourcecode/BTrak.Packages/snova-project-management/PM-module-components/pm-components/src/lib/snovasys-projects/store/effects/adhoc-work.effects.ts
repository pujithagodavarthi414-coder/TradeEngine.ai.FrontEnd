import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of, pipe } from "rxjs";
import { AdhocWorkActionTypes, CreateAdhocWorkTriggered, CreateAdhocWorkCompleted, CreateAdhocWorkFailed, AdhocWorkExceptionHandled, LoadAdhocUserStoriesTriggered, LoadAdhocUserStoriesCompleted, LoadAdhocUserStoriesFailed, GetAdhocWorkUserStoryByIdTriggered, GetAdhocWorkUserStoryByIdCompleted, GetAdhocWorkUserStoryByIdFailed, RefreshAhocUserStories, UpdateAdhocUserStories, LoadMoreAdhocUserStoriesTriggered, AdhocParkUserStoryTriggered, AdhocParkUserStoryCompleted, AdhocParkUserStoryFailed, AdhocArchiveUserStoryCompleted, AdhocArchiveUserStoryFailed, AdhocArchiveUserStoryTriggered, AdhocWorkStatusChangedTriggered, AdhocWorkStatusChangedCompleted, UpsertAdhocUserStoryTagsTriggered, UpsertAdhocUserStoryTagsCompleted, UpsertAdhocUserStoryTagsFailed, SearchAdhocTagsTriggered, SearchAdhocTagsCompleted, SearchAdhocTagsFailed, GetAdhocWorkUniqueUserStoryByIdTriggered, GetAdhocWorkUniqueUserStoryByIdCompleted, GetAdhocWorkUniqueUserStoryByIdFailed } from "../actions/adhoc-work.action";
import { switchMap, map, catchError, mergeMap } from "rxjs/operators";
import { ShowExceptionMessages, ShowValidationMessages } from "../../store/actions/notification-validator.action";
import { AdhocWorkService } from "../../services/adhoc-work.service";
import { Action } from "@ngrx/store";
import { SnackbarOpen } from "../../store/actions/snackbar.actions";
import { GetUserStoryByIdTriggered, UpsertUserStoryByIdTriggered } from "../../store/actions/userStory.actions";
import { UserStory } from "../../models/userStory";
import { ProjectGoalsService } from "../../services/goals.service";
import { TranslateService } from "@ngx-translate/core";
import { ConstantVariables } from "../../../globaldependencies/constants/constant-variables";
import { InsertAutoLogTimeCompleted } from "../../store/actions/userStory-logTime.action";
import { ArchiveUnArchiveGoalCompleted } from '../actions/goal.actions';

@Injectable()
export class AdhocWorkEffects {
  toastrMessage: string;
  isNewUserStory: boolean;
  userStories: UserStory[];
  userStoryId: string;
  isAdhoc: boolean;

  constructor(
    private actions$: Actions,
    private adhocWorkService: AdhocWorkService,
    private projectGoalsService: ProjectGoalsService,
    private translateService: TranslateService,


  ) { }

  @Effect()
  upsertAdhocWork$: Observable<Action> = this.actions$.pipe(
    ofType<CreateAdhocWorkTriggered>(AdhocWorkActionTypes.CreateAdhocWorkTriggered),
    switchMap(searchAction => {
      if (searchAction.userStory.userStoryId) {
        this.isNewUserStory = false;
      }
      else {
        this.isNewUserStory = true;
      }
      return this.adhocWorkService
        .upsertAdhocWork(searchAction.userStory)
        .pipe(
          map((userStories: any) => {
            if (userStories.success) {
              return new CreateAdhocWorkCompleted(userStories.data)
            }
            else {
              return new CreateAdhocWorkFailed(userStories.apiResponseMessages)
            }
          }),
          catchError(err => {
            return of(new AdhocWorkExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  upsertUserStorySuccessfulAndLoadUserStories$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<CreateAdhocWorkCompleted>(
      AdhocWorkActionTypes.CreateAdhocWorkCompleted
    ),
    switchMap(searchAction => {
      return of(new GetAdhocWorkUserStoryByIdTriggered(searchAction.userStoryId, true)
      )
    })
  );

  @Effect()
  AdhocWorkStatus$: Observable<Action> = this.actions$.pipe(
    ofType<AdhocWorkStatusChangedTriggered>(AdhocWorkActionTypes.AdhocWorkStatusChangedTriggered),
    switchMap(searchAction => {
      if (searchAction.userStory.userStoryId) {
        this.isNewUserStory = false;
      }
      else {
        this.isNewUserStory = true;
      }
      return this.adhocWorkService
        .upsertAdhocWork(searchAction.userStory)
        .pipe(
          map((userStories: any) => {
            if (userStories.success) {
              return new AdhocWorkStatusChangedCompleted(userStories.data)
            }
            else {
              return new CreateAdhocWorkFailed(userStories.apiResponseMessages)
            }
          }),
          catchError(err => {
            return of(new AdhocWorkExceptionHandled(err));
          })
        );
    })
  );


  @Effect()
  getAdhocUserStoryById$: Observable<Action> = this.actions$.pipe(
    ofType<GetAdhocWorkUserStoryByIdTriggered>(AdhocWorkActionTypes.GetAdhocWorkUserStoryByIdTriggered),
    mergeMap(searchAction => {
      this.userStoryId = searchAction.userStoryId;
      this.isAdhoc = searchAction.isAdhoc;
      return this.adhocWorkService
        .getAdhocUserStoryById(searchAction.userStoryId)
        .pipe(
          map((userStories: any) => {
            if (userStories.success) {
              return new GetAdhocWorkUserStoryByIdCompleted(userStories.data)
            }
            else {
              return new GetAdhocWorkUserStoryByIdFailed(userStories.apiResponseMessages)
            }
          }),
          catchError(err => {
            return of(new AdhocWorkExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  getUniqueAdhocUserStoryById$: Observable<Action> = this.actions$.pipe(
    ofType<GetAdhocWorkUniqueUserStoryByIdTriggered>(AdhocWorkActionTypes.GetAdhocWorkUniqueUserStoryByIdTriggered),
    switchMap(searchAction => {
      return this.adhocWorkService
        .getAdhocUserStoryById(searchAction.userStoryId)
        .pipe(
          map((userStories: any) => {
            if (userStories.success) {
              return new GetAdhocWorkUniqueUserStoryByIdCompleted(userStories.data)
            }
            else {
              return new GetAdhocWorkUniqueUserStoryByIdFailed(userStories.apiResponseMessages)
            }
          }),
          catchError(err => {
            return of(new AdhocWorkExceptionHandled(err));
          })
        );
    })
  );


  @Effect()
  getAdhocUserStoryByIdSuccessful$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<GetAdhocWorkUserStoryByIdCompleted>(
      AdhocWorkActionTypes.GetAdhocWorkUserStoryByIdCompleted
    ),
    switchMap(searchAction => {
      if (this.isNewUserStory) {
        return of(new RefreshAhocUserStories(searchAction.userStory))
      }
      else {
        return of(new UpdateAdhocUserStories({
          userStoryUpdate: {
            id: searchAction.userStory.userStoryId,
            changes: searchAction.userStory
          }
        })
        )
      }
    })
  );


  @Effect()
  upsertAdhocWorkTags$: Observable<Action> = this.actions$.pipe(
    ofType<UpsertAdhocUserStoryTagsTriggered>(AdhocWorkActionTypes.UpsertAdhocUserStoryTagsTriggered),
    switchMap(searchAction => {
      return this.projectGoalsService
        .upsertUserStoryTags(searchAction.tagsInputModel)
        .pipe(
          map((userStories: any) => {
            if (userStories.success) {
              return new UpsertAdhocUserStoryTagsCompleted(userStories.data)
            }
            else {
              return new UpsertAdhocUserStoryTagsFailed(userStories.apiResponseMessages)
            }
          }),
          catchError(err => {
            return of(new AdhocWorkExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  upsertUserStoryTagsSuccessfulAndLoadUserStories$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<UpsertAdhocUserStoryTagsCompleted>(
      AdhocWorkActionTypes.UpsertAdhocUserStoryTagsCompleted
    ),
    switchMap(searchAction => {
      return of(new GetAdhocWorkUserStoryByIdTriggered(searchAction.userStoryId, true)
      )
    })
  );

  @Effect()
  searchCustomTags$: Observable<Action> = this.actions$.pipe(
    ofType<SearchAdhocTagsTriggered>(AdhocWorkActionTypes.SearchAdhocTagsTriggered),
    switchMap(searchAction => {
      return this.projectGoalsService
        .searchCustomTags(searchAction.searchText)
        .pipe(
          map((userStories: any) => {
            if (userStories.success) {
              return new SearchAdhocTagsCompleted(userStories.data)
            }
            else {
              return new SearchAdhocTagsFailed(userStories.apiResponseMessages)
            }
          }),
          catchError(err => {
            return of(new AdhocWorkExceptionHandled(err));
          })
        );
    })
  );


  @Effect()
  loadAdhocWorkUserStories$: Observable<Action> = this.actions$.pipe(
    ofType<LoadAdhocUserStoriesTriggered>(AdhocWorkActionTypes.LoadAdhocUserStoriesTriggered),
    switchMap(searchAction => {
      return this.adhocWorkService
        .loadAdhocWorkUserStories(searchAction.adhocWorkModel)
        .pipe(
          map((userStories: any) => {
            if (userStories.success) {
              if (userStories.data === null) {
                userStories.data = [];
              }
              return new LoadAdhocUserStoriesCompleted(userStories.data)
            }
            else {
              return new LoadAdhocUserStoriesFailed(userStories.apiResponseMessages)
            }
          }),
          catchError(err => {
            return of(new AdhocWorkExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  parkUserStory$: Observable<Action> = this.actions$.pipe(
    ofType<AdhocParkUserStoryTriggered>(AdhocWorkActionTypes.AdhocParkUserStoryTriggered),
    switchMap(goalTriggeredAction => {
      if (goalTriggeredAction.parkUserStory.isParked) {
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForUserStoryPark);
      }
      else {
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForUserStoryResume);
      }
      return this.projectGoalsService
        .parkUserStory(goalTriggeredAction.parkUserStory)
        .pipe(
          map((result: any) => {
            if (result.success === true) {
              localStorage.setItem('archiveUserStoryId', goalTriggeredAction.parkUserStory.userStoryId);
              return new AdhocParkUserStoryCompleted(goalTriggeredAction.parkUserStory.userStoryId);
            } else {
              return new AdhocParkUserStoryFailed(result.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new AdhocWorkExceptionHandled(err));
          })
        );
    })
  );


  @Effect()
  archiveUserStory$: Observable<Action> = this.actions$.pipe(
    ofType<AdhocArchiveUserStoryTriggered>(AdhocWorkActionTypes.AdhocArchiveUserStoryTriggered),
    switchMap(userStoryTriggeredAction => {
      if (userStoryTriggeredAction.archiveUserStory.isArchived) {
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForUserStoryArchive);
      }
      else {
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForUserStoryUnArchive);
      }
      return this.adhocWorkService
        .upsertAdhocWork(userStoryTriggeredAction.archiveUserStory)
        .pipe(
          map((result: any) => {
            if (result.success === true) {
              return new AdhocArchiveUserStoryCompleted(userStoryTriggeredAction.archiveUserStory.userStoryId);
            } else {
              return new AdhocArchiveUserStoryFailed(result.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new AdhocWorkExceptionHandled(err));
          })
        );
    })
  );


  @Effect()
  AutoLogTime$: Observable<Action> = this.actions$.pipe(
    ofType<GetAdhocWorkUserStoryByIdCompleted>(AdhocWorkActionTypes.GetAdhocWorkUserStoryByIdCompleted),
    pipe(
      map(() => {
        if(this.isAdhoc) {
          return new ArchiveUnArchiveGoalCompleted();
        } else {
          return new InsertAutoLogTimeCompleted(this.userStoryId)
        }
      }
      )
    )
  );


  @Effect()
  showValidationMessagesForCreatingAdhocWork$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<CreateAdhocWorkFailed>(
      AdhocWorkActionTypes.CreateAdhocWorkFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForGettingAdhocWork$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<GetAdhocWorkUniqueUserStoryByIdFailed>(
      AdhocWorkActionTypes.GetAdhocWorkUniqueUserStoryByIdFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForTagsAdhocWork$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<UpsertAdhocUserStoryTagsFailed>(
      AdhocWorkActionTypes.UpsertAdhocUserStoryTagsFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForSearchAdhocWork$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<SearchAdhocTagsFailed>(
      AdhocWorkActionTypes.SearchAdhocTagsFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForGetAdhocWorkDetailsById$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<GetAdhocWorkUserStoryByIdFailed>(
      AdhocWorkActionTypes.GetAdhocWorkUserStoryByIdFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );


  @Effect()
  showValidationMessagesForLoadingAdhocWorkDetails$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<LoadAdhocUserStoriesFailed>(
      AdhocWorkActionTypes.LoadAdhocUserStoriesFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );


  @Effect()
  AdhocWorkExceptionHandled$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<AdhocWorkExceptionHandled>(
      AdhocWorkActionTypes.AdhocWorkExceptionHandled
    ),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  @Effect()
  upsertParkUserStorySuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<AdhocParkUserStoryCompleted>(AdhocWorkActionTypes.AdhocParkUserStoryCompleted),
    pipe(
      map(
        () =>
          new SnackbarOpen({
            message: this.toastrMessage, // TODO: Change to proper toast message
            action: "Success"
          })
      )
    )
  );

  @Effect()
  showValidationMessagesForParkUserStory$: Observable<Action> = this.actions$.pipe(
    ofType<AdhocParkUserStoryFailed>(AdhocWorkActionTypes.AdhocParkUserStoryFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForArchiveUserStory$: Observable<Action> = this.actions$.pipe(
    ofType<AdhocArchiveUserStoryFailed>(AdhocWorkActionTypes.AdhocArchiveUserStoryFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );
}
