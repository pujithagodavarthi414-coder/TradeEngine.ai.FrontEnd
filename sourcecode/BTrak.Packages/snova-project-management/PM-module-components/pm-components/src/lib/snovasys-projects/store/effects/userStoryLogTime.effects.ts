import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError, mergeMap } from "rxjs/operators";
import { LogTimeService } from "../../services/logTimeService";
import {
  UserStoryLogTimeActions,
  UserStoryLogTimeActionTypes,
  InsertLogTimeTriggered,
  InsertLogTimeCompleted,
  InsertLogTimeFailed,
  UserStoryLogTimeExceptionHandled,
  SearchLogTimeTriggered,
  SearchLogTimeCompleted,
  InsertAutoLogTimeCompleted,
  InsertAutoLogTimeTriggered,
  UpsertUserStoryAutoLogOnPunchCardTriggered,
  InsertAutoLogTimeCompletedAction
} from "../actions/userStory-logTime.action";
import { SnackbarOpen } from "../actions/snackbar.actions";
import { UserStoryLogTimeModel } from "../../models/userStoryLogTimeModel";
import {
  ShowExceptionMessages,
  ShowValidationMessages
} from "../actions/notification-validator.action";
import { TranslateService } from "@ngx-translate/core";
import { GetUserStoryByIdTriggered, UpsertUserStoryByIdTriggered, GetUserStoryByIdCompleted, GetUserStorySubTasksTriggered } from "../actions/userStory.actions";
import { GetSprintWorkItemByIdTriggered, GetSprintWorkItemSubTasksTriggered } from '../actions/sprint-userstories.action';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { UserStory } from '../../models/userStory';
import { GetAdhocWorkUserStoryByIdTriggered } from '../actions/adhoc-work.action';
import { ArchiveUnArchiveGoalCompleted } from '../actions/goal.actions';
import { UserStorySearchCriteriaInputModel } from '../../models/userStorySearchInput';

@Injectable()
export class UserStoryLogTimeEffects {
  logTimeModel: UserStoryLogTimeModel;
  userStory: UserStory;
  userStoryId: string;
  isFromAdhoc: boolean;
  endTime: string;
  isSubTasksPage: boolean;
  isFromSprint: boolean;
  parentUserstoryId: string;
  goalId: string;
  sprintId: string;
  @Effect()
  loadUserHistoryLogTime$: Observable<Action> = this.actions$.pipe(
    ofType<SearchLogTimeTriggered>(
      UserStoryLogTimeActionTypes.SearchLogTimeTriggered
    ),
    switchMap(searchAction => {
      this.logTimeModel = searchAction.userStoryLogTimeModel;
      return this.logTimeService
        .SearchLogTimeHistory(searchAction.userStoryLogTimeModel)
        .pipe(
          map((userStories: any) => {
            if (userStories.success === true) {
              return new SearchLogTimeCompleted(userStories.data)
            } else {
              return new InsertLogTimeFailed(userStories.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryLogTimeExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  upsertLogTime$: Observable<Action> = this.actions$.pipe(
    ofType<InsertLogTimeTriggered>(
      UserStoryLogTimeActionTypes.InsertLogTimeTriggered
    ),
    mergeMap(searchAction => {
      //this.userStoryId = searchAction.userStoryLogTimeModel.userStoryId;
      return this.logTimeService
        .UpsertUserStoryLogTime(searchAction.userStoryLogTimeModel)
        .pipe(
          map((userStories: any) => {
            if (userStories.success === true) {
              this.userStoryId = userStories.data;
              if (this.userStoryId) {
                return new InsertLogTimeCompleted(this.userStoryId);
              }
            } else {
              return new InsertLogTimeFailed(userStories.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryLogTimeExceptionHandled(err));
          })
        );
    })
  );



  @Effect()
  upsertLogTimeNew$: Observable<Action> = this.actions$.pipe(
    ofType<InsertAutoLogTimeTriggered>(
      UserStoryLogTimeActionTypes.InsertAutoLogTimeTriggered
    ),
    mergeMap(searchAction => {
      this.endTime = searchAction.userStoryLogTimeModel.endTime;
      this.isFromAdhoc = searchAction.userStoryLogTimeModel.isFromAdhoc;
      var parentUserstoryId = searchAction.userStoryLogTimeModel.parentUserStoryId;
      this.isFromSprint = searchAction.userStoryLogTimeModel.isFromSprint;
      this.isSubTasksPage = searchAction.userStoryLogTimeModel.isSubTasksPage;
      this.goalId = searchAction.userStoryLogTimeModel.goalId;
      this.sprintId = searchAction.userStoryLogTimeModel.sprintId;
      let isSubTask;
      if (this.isSubTasksPage) {
        isSubTask = true;
      } else {
        isSubTask = false;
      }
      return this.logTimeService
        .UpsertUserStoryLogTime(searchAction.userStoryLogTimeModel)
        .pipe(
          map((userStories: any) => {
            if (userStories.success === true) {
              if(parentUserstoryId) {
                this.userStoryId = parentUserstoryId;
              } else {
                this.userStoryId = userStories.data;
              }
              this.isFromAdhoc = searchAction.userStoryLogTimeModel.isFromAdhoc;
              this.isFromSprint = searchAction.userStoryLogTimeModel.isFromSprint;
              // let ob= new ob()
              if (this.userStoryId) {
                return new InsertAutoLogTimeCompletedAction();
              }
              else {
                return new InsertLogTimeFailed(userStories.apiResponseMessages);
              }
            } else {
              return new InsertLogTimeFailed(userStories.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryLogTimeExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  upsertLogTimeFromPunchCard$: Observable<Action> = this.actions$.pipe(
    ofType<UpsertUserStoryAutoLogOnPunchCardTriggered>(
      UserStoryLogTimeActionTypes.UpsertUserStoryAutoLogOnPunchCardTriggered
    ),
    switchMap(searchAction => {
      return this.logTimeService
        .UpsertUserStoryLogTimeFromPuncCard(searchAction.isBreakStarted)
        .pipe(
          map((userStories: any) => {
            if (userStories.success === true) {
              if (userStories.data.userStoryId) {
                if (userStories.data.isFromSprints)
                  return new GetSprintWorkItemByIdTriggered(userStories.data.userStoryId, false);
                else if (userStories.data.isFromAdhoc) {
                  return new GetAdhocWorkUserStoryByIdTriggered(userStories.data.userStoryId, false);
                } else {
                  return new GetUserStoryByIdCompleted(userStories.data.userStoryId);
                }
              }
              else {
                return new InsertLogTimeFailed(userStories.apiResponseMessages);
              }
            } else {
              return new InsertLogTimeFailed(userStories.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryLogTimeExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  upsertLogTimeCompletedAutoLog$: Observable<Action> = this.actions$.pipe(
    ofType<InsertAutoLogTimeCompleted>(
      UserStoryLogTimeActionTypes.InsertAutoLogTimeCompleted
    ),
    pipe(
      map(
        () => {
          if (this.endTime) {
            return new SnackbarOpen({
              message: this.translateService.instant(
                ConstantVariables.SuccessMessageForAutoTimeLogCompleted
              ), // TODO: Change to proper toast message
              action: "Success"
            })
          }
          else {
            return new SnackbarOpen({
              message: this.translateService.instant(
                ConstantVariables.SuccessMessageForAutoTimeLog
              ), // TODO: Change to proper toast message
              action: "Success"
            })
          }
        }
      )
    )
  );

  // @Effect()
  // upsertLogTimeAllUSerStories$: Observable<Action> = this.actions$.pipe(
  //   ofType<InsertAutoLogTimeTriggered>(
  //     UserStoryLogTimeActionTypes.InsertAutoLogTimeTriggered
  //   ),
  //   pipe(
  //     map((searchAction) => {
  //       return new UpsertUserStoryByIdTriggered(searchAction.userStoryLogTimeModel.userStoryId);
  //     })
  //   )
  // );

  @Effect()
  upsertuserStoryLogTimeSuccessfulAndLoadHistory$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<SearchLogTimeCompleted>(
      UserStoryLogTimeActionTypes.InsertLogTimeCompleted
    ),
    pipe(
      map(() => {
        return new SearchLogTimeTriggered(this.logTimeModel);
      })
    )
  );


  @Effect()
  loadUserStory$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<InsertAutoLogTimeCompletedAction>(
      UserStoryLogTimeActionTypes.InsertAutoLogTimeCompletedAction
    ),
    pipe(
      map(() => {
        if (this.isFromSprint)
          return new GetSprintWorkItemByIdTriggered(this.userStoryId, false);
        else if (this.isFromAdhoc) {
          return new GetAdhocWorkUserStoryByIdTriggered(this.userStoryId, false);
        } else {
          return new GetUserStoryByIdTriggered(this.userStoryId);
        }
      })
    )
  );

  @Effect()
  loadingSubTasks$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<InsertAutoLogTimeCompletedAction>(
      UserStoryLogTimeActionTypes.InsertAutoLogTimeCompletedAction
    ),
    pipe(
      map(() => {
          if(this.isFromSprint) {
            var userStorySearchCriteria = new UserStorySearchCriteriaInputModel();
            userStorySearchCriteria.parentUserStoryId = this.userStoryId;
            userStorySearchCriteria.sprintId = this.sprintId;
            userStorySearchCriteria.isParked = false;
            userStorySearchCriteria.isArchived = false;
            return new GetSprintWorkItemSubTasksTriggered(userStorySearchCriteria)
          } else {
            var userStorySearchCriteria = new UserStorySearchCriteriaInputModel();
            userStorySearchCriteria.parentUserStoryId = this.userStoryId;
            userStorySearchCriteria.goalId = this.goalId;
            userStorySearchCriteria.isForUserStoryoverview = true;
            userStorySearchCriteria.isUserStoryArchived = false;
            userStorySearchCriteria.isUserStoryParked = false;
            userStorySearchCriteria.sortDirectionAsc = true;
            return new GetUserStorySubTasksTriggered(userStorySearchCriteria)
          }
      })
    )
  );

  @Effect()
  showValidationMessagesForLogTime$: Observable<Action> = this.actions$.pipe(
    ofType<InsertLogTimeFailed>(
      UserStoryLogTimeActionTypes.InsertLogTimeFailed
    ),
    switchMap(searchAction => {
      return of(
        new ShowValidationMessages({
          validationMessages: searchAction.validationMessages
        })
      );
    })
  );

  @Effect()
  UserStoryLogTimeExceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<UserStoryLogTimeExceptionHandled>(UserStoryLogTimeActionTypes.UserStoryLogTimeExceptionHandled),
    switchMap(searchAction => {
      return of(
        new ShowExceptionMessages({
          message: searchAction.errorMessage // TODO: Change to proper toast message
        })
      );
    })
  );

  constructor(
    private actions$: Actions,
    private logTimeService: LogTimeService,
    private translateService: TranslateService
  ) { }
}
