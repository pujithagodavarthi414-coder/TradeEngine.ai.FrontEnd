import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { empty, Observable, of, pipe } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import {
  catchError,
  debounceTime,
  map,
  switchMap,
  mergeMap
} from "rxjs/operators";
import {
  UserStoryActionTypes,
  SearchUserStoriesComplete,
  SearchUserStories,
  CreateUserStoryCompleted,
  CreateUserStoryFailed,
  CreateUserStoryTriggered,
  InsertUserStoryReplanTriggered,
  InsertUserStoryReplanCompleted,
  InsertUserStoryReplanFailed,
  UserStoryExceptionHandled,
  CreateMultipleUserStoriestriggered,
  CreateMultipleUserStoryCompleted,
  CreateMultipleUserStoriesFailed,
  MultipleUserStoriesUsingFileTriggered,
  MultipleUserStoriesUsingFileCompleted,
  MultipleUserStoriesUsingFileFailed,
  CreateUserStoryCompletedWithInPlaceUpdate,
  RefreshUserStoriesList,
  GetUserStoryByIdTriggered,
  GetUserStoryByIdCompleted,
  CreateMultipleUserStoriesSplitTriggered,
  CreateMultipleUserStoriesSplitCompleted,
  CreateMultipleUserStoriesSplitFailed,
  ArchivedUserStoryTriggered,
  ArchiveUserStoryCompleted,
  ArchiveUserStoryFailed,
  ParkUserStoryTriggered,
  ParkUserStoryCompleted,
  ParkUserStoryFailed,
  UpdateUserStoryGoalTriggred,
  UpdateUserStoryGoalCompleted,
  UpdateUserStoryGoaalFailed,
  ReOrderUserStoriesTriggred,
  ReOrderUserStoriesCompleted,
  ReOrderUserStoriesFailed,
  SearchAllUserStories,
  GetUniqueUserStoryByIdTriggered,
  GetUniqueUserStoryByIdCompleted,
  ArchivekanbanGoalsTriggered,
  ArchivekanbanGoalsCompleted,
  ArchivekanbanGoalsFailed,
  UpdateMultipleUserStories,
  CreateBugForUserStoryTriggered,
  CreateBugForUserStoryCompleted,
  CreateBugForTestCaseStatusTriggered,
  CreateBugForTestCaseStatusCompleted,
  RefreshMultipleUserStoriesList,
  ArchivedUniqueUserStoryTriggered,
  ArchiveUniqueUserStoryCompleted,
  ArchiveUniqueUserStoryFailed,
  ParkUniqueUserStoryCompleted,
  ParkUniqueUserStoryTriggered,
  ParkUniqueUserStoryFailed,
  AmendUserStoryDeadlineTriggered,
  AmendUserStoryDeadlineCompleted,
  AmendUserStoryDeadlineFailed,
  UpsertUserStoryTagsTriggered,
  UpsertUserStoryTagsCompleted,
  UpsertUserStoryTagsFailed,
  UpsertSubTaskCompleted,
  GetUserStorySubTasksTriggered,
  GetUserStorySubTasksCompleted,
  GetUserStorySubTasksFailed,
  SearchAutoCompleteTriggered,
  SearchAutoCompleteCompleted,
  SearchAutoCompleteFailed,
  UpdateSubTaskUserStoryTriggered,
  UpdateSubTaskUserStoryCompleted,
  UpdateSubTaskUserStoryFailed,
  UpdateSubTaskInUniquePageTriggered,
  ArchivedSubTaskUserStoryTriggered,
  ArchiveSubTaskUserStoryCompleted,
  ParkSubTaskUserStoryCompleted,
  ParkSubTaskUserStoryTriggered,
  ParkSubTaskUserStoryFailed,
  ArchiveSubTaskUserStoryFailed,
  UpdateReOrderUserStories,
  ReOrderSubUserStoriesTriggred,
  ReOrderSubUserStoriesCompleted,
  ReOrderSubUserStoriesFailed,
  UpdateSingleUserStoryForBugsTriggered,
  UpdateSingleUserStoryForBugsCompleted,
  UpsertUserStoryByIdTriggered,
  SearchUserStoriesFailed,
  GetUniqueUserStoryByUniqueIdTriggered,
  UpdateUniquePageUserStories, RemoveUniquePageUserStories, UpdateUniqueUserStories
} from "../actions/userStory.actions";

import { ProjectGoalsService } from "../../services/goals.service";
import { UserStory } from "../../models/userStory";
import { Select, GoalActionTypes, GetGoalByIdTriggered, GetGoalDetailsByMultipleGoalIdsTriggered, GetUniqueGoalByIdTriggered, ArchiveUnArchiveGoalCompleted, GetGoalDetailsByMultipleGoalIdsForBugsTriggered, GetAllGoalByIdTriggered } from "../actions/goal.actions";
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import { SnackbarOpen } from "../actions/snackbar.actions";
import { ToastrService } from "ngx-toastr";
import { ShowExceptionMessages, ShowValidationMessages } from "../actions/notification-validator.action";

import { TranslateService } from "@ngx-translate/core";
import { userStoryUpdates } from "../../models/userStoryUpdates";
import { ProjectFeature } from "../../models/projectFeature";
import { LoadFeatureProjectsTriggered } from "../actions/project-features.actions";
import { LoadBugPriorityTypesTriggered } from "../actions/bug-priority.action";
import { LoadMemberProjectsTriggered } from "../actions/project-members.actions";
import { InsertAutoLogTimeCompleted } from "../actions/userStory-logTime.action";
import { GetSprintWorkItemByIdTriggered, RefreshMoreSprintWorkItem, UpdateSingleSprintUserStoryForBugsTriggered, SprintWorkItemActionTypes, UpdateSingleSprintUserStoryForBugsCompleted, UpdateSprintWorkItemField } from "../actions/sprint-userstories.action";
import { LoadUserstoryHistoryTriggered } from "../actions/userstory-history.action";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { TestCase } from '@snovasys/snova-testrepo';
import { LoadBugsCountByUserStoryIdTriggered, LoadLinksCountByUserStoryIdTriggered } from '../actions/comments.actions';
import { LoadBugsByUserStoryIdTriggered } from '@snovasys/snova-testrepo';
import { LinkUserStoryInputModel } from '../../models/link-userstory-input-model';
import { LoadUserstoryLinksTriggered } from '../actions/userstory-links.action';

@Injectable()
export class UserStoryEffects {
  toastrMessage: string;
  userStorySearchModel: UserStorySearchCriteriaInputModel;
  subTasksCriteriaModel: UserStorySearchCriteriaInputModel;
  isNewUserStory: boolean;
  isStatusChanged: boolean;
  isAssigneeChanged: boolean;
  userStory: UserStory;
  inputUserStory: UserStory;
  userStoryId: string;
  testCaseId: string;
  testRunId: string;
  isSubTasksCalling: boolean;
  isGoalChanged: boolean;
  userStoryTypeId: string;
  isBug: boolean = false;
  workItemId: string;
  goalId: string;
  parentUserStoryGoalId: string;
  //myWorkModel: MyWorkModel;
  userStoryGoalId: string;
  userStories: UserStory[] = [];
  oldGoalId: string;
  userStoryIds: string[] = [];
  userStoryUpdates: userStoryUpdates[] = [];
  isParentUserStoryId: boolean;
  isUniqueDetailsPage: boolean;
  isBacklog: boolean;
  projectId: string;
  isSprintUserstories: boolean;
  reloadHistoryId: string;
  childUserStoryId: string;
  isAllGoalsPage: boolean;
  isParent: boolean;
  isGoalUniquePage: boolean;
  parentUserStoryId: string;
  @Effect()
  upsertUserStory$: Observable<Action> = this.actions$.pipe(
    ofType<CreateUserStoryTriggered>(
      UserStoryActionTypes.CreateUserStoryTriggered
    ),
    switchMap(projectTriggeredAction => {
      this.inputUserStory = projectTriggeredAction.userStory;
      this.goalId = projectTriggeredAction.userStory.goalId;
      this.parentUserStoryGoalId = projectTriggeredAction.userStory.parentUserStoryGoalId;
      this.isStatusChanged = projectTriggeredAction.userStory.isStatusChanged;
      this.isAssigneeChanged = projectTriggeredAction.userStory.isAssigneeChanged;
      this.isBug = projectTriggeredAction.userStory.isBug;
      this.isAllGoalsPage = projectTriggeredAction.userStory.isGoalsPage;
      if (
        projectTriggeredAction.userStory.userStoryId === undefined ||
        projectTriggeredAction.userStory.userStoryId === null ||
        projectTriggeredAction.userStory.userStoryId === ""
      ) {
        this.isNewUserStory = true;
      } else {
        this.isNewUserStory = false;
      }
      if (this.isNewUserStory && this.isBug) {
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForBug);
      }
      else if (this.isNewUserStory && (!this.isBug || (this.userStoryTypeId === null || this.userStoryTypeId === undefined || this.userStoryTypeId === ""))) {
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForUserStory);
      }
      else if (this.isStatusChanged != true && (this.isBug)) {
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForBugEdit);
      }
      else if (this.isStatusChanged != true) {
        this.toastrMessage = '';
      }
      else if (this.isStatusChanged = true) {
        this.toastrMessage = '';
      }
      else if (this.isStatusChanged = true) {
        this.toastrMessage = '';
      }

      this.userStory = projectTriggeredAction.userStory;
      this.isGoalChanged = projectTriggeredAction.userStory.isGoalChanged;
      this.parentUserStoryId = projectTriggeredAction.userStory.parentUserStoryId;

      return this.projectGoalsService
        .UpsertUserStory(projectTriggeredAction.userStory)
        .pipe(
          map((userUpsertReturnResult: any) => {

            if (userUpsertReturnResult.success === true) {
              this.reloadHistoryId = userUpsertReturnResult.data;
              if (this.parentUserStoryId != null && !projectTriggeredAction.userStory.isBugBoard) {
                this.userStoryId = this.parentUserStoryId;
                this.isParentUserStoryId = true;
              }
              else {
                this.userStoryId = userUpsertReturnResult.data;
                this.isParentUserStoryId = false;
              }
              if (projectTriggeredAction.userStory.isUniqueDetailsPage) {
                this.isUniqueDetailsPage = true;
              }
              else {
                this.isUniqueDetailsPage = false;
              }

              return new CreateUserStoryCompleted(userUpsertReturnResult);
            } else {
              return new CreateUserStoryFailed(
                userUpsertReturnResult.apiResponseMessages
              );
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  createBugForUserStory$: Observable<Action> = this.actions$.pipe(
    ofType<CreateBugForUserStoryTriggered>(
      UserStoryActionTypes.CreateBugForUserStoryTriggered
    ),
    switchMap(getAction => {
      let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
      if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
        this.toastrMessage = " Bug added successfully";
      }
      else {
        this.toastrMessage = "బగ్ విజయవంతంగా జోడించబడింది";
      }

      return this.projectGoalsService
        .UpsertUserStory(getAction.bugForUserStory)
        .pipe(
          map((result: any) => {
            if (result.success === true) {
              this.parentUserStoryGoalId = getAction.bugForUserStory.goalId;
              this.goalId = getAction.bugForUserStory.goalIdForBug;
              this.isSprintUserstories = getAction.bugForUserStory.isFromSprint;
              this.isAllGoalsPage = getAction.bugForUserStory.isGoalsPage;

              this.userStoryId = getAction.bugForUserStory.parentUserStoryId;

              if (getAction.bugForUserStory.isChildUserStory) {
                this.workItemId = getAction.bugForUserStory.isChildUserStory
              } else {
                this.workItemId = getAction.bugForUserStory.parentUserStoryId;
              }


              localStorage.setItem('bugToGoalAdded', 'true');
              return new CreateBugForUserStoryCompleted(result);
            }
            else
              return new CreateUserStoryFailed(
                result.apiResponseMessages
              );
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  )

  @Effect()
  createBugForTestCaseStatus$: Observable<Action> = this.actions$.pipe(
    ofType<CreateBugForTestCaseStatusTriggered>(
      UserStoryActionTypes.CreateBugForTestCaseStatusTriggered
    ),
    switchMap(getAction => {
      return this.projectGoalsService
        .UpsertUserStory(getAction.bugForTestCaseStatus)
        .pipe(
          map((result: any) => {
            if (result.success === true) {
              this.testCaseId = getAction.bugForTestCaseStatus.testCaseId;
              this.testRunId = getAction.bugForTestCaseStatus.testRunId;
              this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForBug);
              return new CreateBugForTestCaseStatusCompleted(result);
            }
            else
              return new CreateUserStoryFailed(
                result.apiResponseMessages
              );
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  createBugForUserStorySuccessfull$: Observable<Action> = this.actions$.pipe(
    ofType<CreateBugForUserStoryCompleted>(
      UserStoryActionTypes.CreateBugForUserStoryCompleted
    ),
    pipe(
      map(() => {
        // return new GetGoalDetailsByMultipleGoalIdsTriggered(this.parentUserStoryGoalId + ',' + this.goalId);
        if (this.isSprintUserstories) {
          return new ArchiveUnArchiveGoalCompleted();
        } else {
          return new GetGoalDetailsByMultipleGoalIdsForBugsTriggered(this.parentUserStoryGoalId + ',' + this.goalId);
        }

      })
    )
  );

  @Effect()
  loadLinksCount$: Observable<Action> = this.actions$.pipe(
    ofType<CreateBugForUserStoryCompleted>(
      UserStoryActionTypes.CreateBugForUserStoryCompleted
    ),
    pipe(
      map(() => {
        // return new GetGoalDetailsByMultipleGoalIdsTriggered(this.parentUserStoryGoalId + ',' + this.goalId);
        return new LoadLinksCountByUserStoryIdTriggered(this.userStoryId, this.isSprintUserstories);
      })
    )
  );

  @Effect()
  loadLinks$: Observable<Action> = this.actions$.pipe(
    ofType<CreateBugForUserStoryCompleted>(
      UserStoryActionTypes.CreateBugForUserStoryCompleted
    ),
    pipe(
      map(() => {
        var linkUserStoryModel = new LinkUserStoryInputModel();
        linkUserStoryModel.userStoryId = this.userStoryId;
        linkUserStoryModel.isSprintUserStories = this.isSprintUserstories;
        return new LoadUserstoryLinksTriggered(linkUserStoryModel);
      })
    )
  );


  @Effect()
  createBugForUserStoriesDone$: Observable<Action> = this.actions$.pipe(
    ofType<CreateBugForUserStoryCompleted>(
      UserStoryActionTypes.CreateBugForUserStoryCompleted
    ),
    pipe(
      map(() => {
        if (this.isSprintUserstories) {
          return new UpdateSingleSprintUserStoryForBugsTriggered(this.workItemId);
        } else {
          if (this.isAllGoalsPage) {
            return new UpdateUniquePageUserStories(this.workItemId);
          } else {
            return new UpdateSingleUserStoryForBugsTriggered(this.workItemId);
          }
        }
      })
    )
  );

  @Effect()
  createBugForUserStoriesDoneFully$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateSingleUserStoryForBugsTriggered>(
      UserStoryActionTypes.UpdateSingleUserStoryForBugsTriggered
    ),
    switchMap(projectTriggeredAction => {
      return this.projectGoalsService
        .GetUserStoryById(projectTriggeredAction.userStoryId)
        .pipe(
          map((userStories: any) => {
            if (userStories.success === true) {
              let result = userStories.data;
              this.userStory = this.convertJSONToUserStory(result);
              // return new GetUserStoryByIdCompleted(this.userStory);
              return new UpdateSingleUserStoryForBugsCompleted({
                userStoryUpdate: {
                  id: this.userStory.userStoryId,
                  changes: this.userStory
                }
              });
            } else {
              return new CreateUserStoryFailed(userStories.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  createBugForSprintUserStoriesDoneFully$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateSingleSprintUserStoryForBugsTriggered>(
      SprintWorkItemActionTypes.UpdateSingleSprintUserStoryForBugsTriggered
    ),
    switchMap(projectTriggeredAction => {
      return this.projectGoalsService
        .searchSprintUserStoryById(projectTriggeredAction.WorkItemId, null)
        .pipe(
          map((userStories: any) => {
            if (userStories.success === true) {
              let result = userStories.data;
              this.userStory = this.convertJSONToUserStory(result);
              // return new GetUserStoryByIdCompleted(this.userStory);
              return new UpdateSprintWorkItemField({
                WorkItemUpdate: {
                  id: this.userStory.userStoryId,
                  changes: this.userStory
                }
              });
            } else {
              return new CreateUserStoryFailed(userStories.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );


  @Effect()
  createBugForUserStoryFullyDone$: Observable<Action> = this.actions$.pipe(
    ofType<CreateBugForUserStoryCompleted>(
      UserStoryActionTypes.CreateBugForUserStoryCompleted
    ),
    pipe(
      map(() => {
        let bugsCountsModel = new TestCase();
        bugsCountsModel.userStoryId = this.userStoryId;
        bugsCountsModel.isArchived = false;
        return new LoadBugsByUserStoryIdTriggered(bugsCountsModel);
      })
    )
  );

  @Effect()
  loadBugs$: Observable<Action> = this.actions$.pipe(
    ofType<CreateUserStoryCompleted>(
      UserStoryActionTypes.CreateUserStoryCompleted
    ),
    pipe(
      map(() => {
        let bugsCountsModel = new TestCase();
        bugsCountsModel.userStoryId = this.userStoryId;
        bugsCountsModel.isArchived = false;
        return new LoadBugsByUserStoryIdTriggered(bugsCountsModel);
      })
    )
  );


  @Effect()
  createBugForUserStoryCompleted$: Observable<Action> = this.actions$.pipe(
    ofType<CreateBugForUserStoryCompleted>(
      UserStoryActionTypes.CreateBugForUserStoryCompleted
    ),
    pipe(
      map(
        () =>
          new SnackbarOpen({
            message: this.toastrMessage,
            action: this.translateService.instant(ConstantVariables.success)
          })
      )
    )
  );

  @Effect()
  createBugForTestCaseStatusCompleted$: Observable<Action> = this.actions$.pipe(
    ofType<CreateBugForTestCaseStatusCompleted>(
      UserStoryActionTypes.CreateBugForTestCaseStatusCompleted
    ),
    pipe(
      map(
        () =>
          new SnackbarOpen({
            message: this.toastrMessage,
            action: this.translateService.instant(ConstantVariables.success)
          })
      )
    )
  );

  @Effect()
  upsertUserStoryGoalSuccessfulAndUpdateOldGoalId$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<UpdateUserStoryGoalCompleted>(
      UserStoryActionTypes.UpdateUserStoryGoalCompleted
    ),
    pipe(
      map(() => {
        return new GetGoalByIdTriggered(this.oldGoalId);
      })
    )
  );

  @Effect()
  reOrderUserStories: Observable<Action> = this.actions$.pipe(
    ofType<ReOrderUserStoriesTriggred>(
      UserStoryActionTypes.ReOrderUserStoriesTriggred
    ),
    switchMap(searchUserstoriesTriggeredAction => {
      if (searchUserstoriesTriggeredAction.parentUserStoryId) {
        this.userStoryIds = searchUserstoriesTriggeredAction.parentUserStoryId.split(',');
      }
      else {
        this.userStoryIds = searchUserstoriesTriggeredAction.reOrderedUserstoriesList;
      }
      return this.projectGoalsService
        .reOrderUserStories(searchUserstoriesTriggeredAction.reOrderedUserstoriesList)
        .pipe(
          map((reOrderList: any) => {
            if (reOrderList.success) {

              return new ReOrderUserStoriesCompleted();

            } else {
              return new ReOrderUserStoriesFailed(reOrderList.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  reOrderSubUserStories: Observable<Action> = this.actions$.pipe(
    ofType<ReOrderSubUserStoriesTriggred>(
      UserStoryActionTypes.ReOrderSubUserStoriesTriggred
    ),
    switchMap(searchUserstoriesTriggeredAction => {
      this.userStoryIds = searchUserstoriesTriggeredAction.reOrderedUserstoriesList;

      return this.projectGoalsService
        .reOrderUserStories(searchUserstoriesTriggeredAction.reOrderedUserstoriesList)
        .pipe(
          map((reOrderList: any) => {
            if (reOrderList.success) {

              return new ReOrderSubUserStoriesCompleted();

            } else {
              return new ReOrderSubUserStoriesFailed(reOrderList.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  reOrderUserStoriesSuccessful$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ReOrderUserStoriesCompleted>(
      UserStoryActionTypes.ReOrderUserStoriesCompleted
    ),
    pipe(
      map(() => {
        return new UpdateReOrderUserStories();
      })
    )
  );

  @Effect()
  reOrderSubUserStoriesSuccessful$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ReOrderUserStoriesCompleted>(
      UserStoryActionTypes.ReOrderUserStoriesCompleted
    ),
    pipe(
      map(() => {
        return new GetUserStorySubTasksTriggered(this.subTasksCriteriaModel);
      })
    )
  );

  @Effect()
  getSubTasksByUserStoryId: Observable<Action> = this.actions$.pipe(
    ofType<GetUserStorySubTasksTriggered>(
      UserStoryActionTypes.GetUserStorySubTasksTriggered
    ),
    switchMap(searchUserstoriesTriggeredAction => {
      this.subTasksCriteriaModel = searchUserstoriesTriggeredAction.userStorySearchCriteriaModel;
      return this.projectGoalsService
        .searchUserStories(searchUserstoriesTriggeredAction.userStorySearchCriteriaModel)
        .pipe(
          map((userStories: any) => {
            if (userStories.success) {
              return new GetUserStorySubTasksCompleted(userStories.data);
            } else {
              return new GetUserStorySubTasksCompleted(userStories.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );





  @Effect()
  upsertUserStoryReplan$: Observable<Action> = this.actions$.pipe(
    ofType<InsertUserStoryReplanTriggered>(
      UserStoryActionTypes.InsertUserStoryReplanTriggered
    ),
    switchMap(projectTriggeredAction => {
      this.toastrMessage = this.translateService.instant('USERSTORY.USERSTORYREPLANNEDSUCCESSFULLY')
      return this.projectGoalsService
        .UpsertUserStoryReplan(projectTriggeredAction.userStoryReplan)
        .pipe(
          map((userUpsertReturnResult: any) => {

            if (userUpsertReturnResult.success === true) {
              if (projectTriggeredAction.userStoryReplan.parentUserStoryId) {
                this.isParentUserStoryId = true;
                this.userStoryId = projectTriggeredAction.userStoryReplan.parentUserStoryId;
              }
              else {
                this.userStoryId = projectTriggeredAction.userStoryReplan.userStoryId;
              }

              return new InsertUserStoryReplanCompleted(userUpsertReturnResult.data);
            } else {
              return new InsertUserStoryReplanFailed(
                userUpsertReturnResult.apiResponseMessages
              );
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  upsertMultipleUserStoriesSplit: Observable<Action> = this.actions$.pipe(
    ofType<CreateMultipleUserStoriesSplitTriggered>(
      UserStoryActionTypes.CreateMultipleUserStoriesSplitTriggered
    ),
    switchMap(projectTriggeredAction => {
      this.inputUserStory = projectTriggeredAction.userStory;
      if (
        projectTriggeredAction.userStory.userStoryId === undefined ||
        projectTriggeredAction.userStory.userStoryId === null ||
        projectTriggeredAction.userStory.userStoryId === ""
      ) {
        this.isNewUserStory = true;
      } else {
        this.isNewUserStory = false;
      }

      if (
        projectTriggeredAction.userStory.userStoryId === undefined ||
        projectTriggeredAction.userStory.userStoryId === null ||
        projectTriggeredAction.userStory.userStoryId === ""
      ) {
        this.toastrMessage = this.translateService.instant('USERSTORY.USERSTORYADDEDSUCCESSFULLY');
      }
      this.userStory = projectTriggeredAction.userStory;
      this.goalId = projectTriggeredAction.userStory.goalId;
      this.isBacklog = projectTriggeredAction.userStory.isBacklog;
      this.isAllGoalsPage = projectTriggeredAction.userStory.isGoalsPage;
      this.parentUserStoryId = projectTriggeredAction.userStory.parentUserStoryId;
      return this.projectGoalsService
        .UpsertMultipleUserStoriesSplit(projectTriggeredAction.userStory)
        .pipe(
          map((userUpsertReturnResult: any) => {
            if (userUpsertReturnResult.success === true) {
             
              if (projectTriggeredAction.userStory.parentUserStoryId) {
                this.userStoryId = this.parentUserStoryId;
                this.isSubTasksCalling = true;
                if (this.isAllGoalsPage) {
                  return new UpdateUniquePageUserStories(this.userStoryId);
                } else {
                  return new GetUserStoryByIdTriggered(this.userStoryId);
                }
              }
              else {
                this.userStoryIds = userUpsertReturnResult.data;
                this.isSubTasksCalling = false;
                return new CreateMultipleUserStoriesSplitCompleted(
                  userUpsertReturnResult
                );
              }
            } else {
              return new CreateMultipleUserStoriesSplitFailed(
                userUpsertReturnResult.apiResponseMessages
              );
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  getUserStoryByMultipleIds$: Observable<Action> = this.actions$.pipe(
    ofType<CreateMultipleUserStoriesSplitCompleted>(
      UserStoryActionTypes.CreateMultipleUserStoriesSplitCompleted
    ),
    switchMap(projectTriggeredAction => {
      var userStorySearchCriteriaModel = new UserStorySearchCriteriaInputModel();
      userStorySearchCriteriaModel.goalId = this.goalId;
      userStorySearchCriteriaModel.userStoryIds = this.userStoryIds.toString();
      return this.projectGoalsService
        .searchUserStories(userStorySearchCriteriaModel)
        .pipe(
          map((userStories: any) => {
            if (userStories.success === true) {
              var userStories = this.convertJSONToUserStories(userStories.data);
              if (this.isBacklog) {
                userStories.forEach((userStory) => {
                  this.userStories.push(userStory);
                })
              }
              return new RefreshMultipleUserStoriesList(userStories);

            } else {
              return new SearchUserStoriesFailed(userStories.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  getUserStoryUpdatesByMultipleIds$: Observable<Action> = this.actions$.pipe(
    ofType<CreateMultipleUserStoryCompleted>(
      UserStoryActionTypes.CreateMultipleUserStoriesCompleted
    ),
    switchMap(projectTriggeredAction => {
      var userStorySearchCriteriaModel = new UserStorySearchCriteriaInputModel();
      userStorySearchCriteriaModel.goalId = this.goalId;
      userStorySearchCriteriaModel.userStoryIds = this.userStoryIds.toString();
      return this.projectGoalsService
        .searchUserStories(userStorySearchCriteriaModel)
        .pipe(
          map((userStories: any) => {
            if (userStories.success === true) {
              var userStoriesList = this.convertJSONToUserStories(userStories.data);
              var userStoryUpdates = this.convertUserStoriesToJson(userStories.data);
              return new UpdateMultipleUserStories({
                userStoryUpdateMultiple: userStoryUpdates
              });
            } else {
              return new SearchUserStoriesFailed(userStories.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );


  @Effect()
  updateMultipleIds$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateUniquePageUserStories>(
      UserStoryActionTypes.UpdateUniquePageUserStories
    ),
    switchMap(projectTriggeredAction => {
      var userStorySearchCriteriaModel = new UserStorySearchCriteriaInputModel();
      userStorySearchCriteriaModel = this.userStorySearchModel;
      userStorySearchCriteriaModel.pageNumber = 1;
      userStorySearchCriteriaModel.userStoryIds = projectTriggeredAction.userStoryId.toString();
      let userStoryIds = [];
      userStoryIds.push(projectTriggeredAction.userStoryId);

      return this.projectGoalsService
        .searchUserStories(userStorySearchCriteriaModel)
        .pipe(
          map((userStories: any) => {
            if (userStories.success === true) {
              var userStoriesList = this.convertJSONToUserStories(userStories.data);
              var userStoryUpdates = this.convertUserStoriesToJson(userStoriesList);
              if (userStories.data.length == 0) {
                return new RemoveUniquePageUserStories(userStoryIds);
              } else {
                return new UpdateUniqueUserStories({
                  userStoryUpdateMultiple: userStoryUpdates
                });
              }
            } else {
              return new SearchUserStoriesFailed(userStories.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );



  @Effect()
  amendDeadlineConfigurations: Observable<Action> = this.actions$.pipe(
    ofType<AmendUserStoryDeadlineTriggered>(
      UserStoryActionTypes.AmendUserStoriesDeadlineTriggered
    ),
    switchMap(projectTriggeredAction => {
      return this.projectGoalsService
        .amendUserStoryDeadline(projectTriggeredAction.amendUserStoryModel)
        .pipe(
          map((userUpsertReturnResult: any) => {
            if (userUpsertReturnResult.success === true) {
              this.userStoryIds = projectTriggeredAction.amendUserStoryModel.userStoryIds;
              this.goalId = projectTriggeredAction.amendUserStoryModel.goalId;
              return new AmendUserStoryDeadlineCompleted(
                userUpsertReturnResult.data
              );
            } else {
              return new AmendUserStoryDeadlineFailed(
                userUpsertReturnResult.apiResponseMessages
              );
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  getUserStoryDeadlineUpdatesByMultipleIds$: Observable<Action> = this.actions$.pipe(
    ofType<AmendUserStoryDeadlineCompleted>(
      UserStoryActionTypes.AmendUserStoriesDeadlineCompleted
    ),
    switchMap(projectTriggeredAction => {
      var userStorySearchCriteriaModel = new UserStorySearchCriteriaInputModel();
      userStorySearchCriteriaModel.userStoryIds = this.userStoryIds.toString();
      userStorySearchCriteriaModel.goalId = this.goalId;
      userStorySearchCriteriaModel.isForUserStoryoverview = true;
      return this.projectGoalsService
        .searchUserStories(userStorySearchCriteriaModel)
        .pipe(
          map((userStories: any) => {
            if (userStories.success === true) {
              var userStories = this.convertJSONToUserStories(userStories.data);
              var userStoryUpdates = this.convertUserStoriesToJson(userStories);
              return new UpdateMultipleUserStories({
                userStoryUpdateMultiple: userStoryUpdates
              });
            } else {
              return new SearchUserStoriesFailed(userStories.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );





  @Effect()
  updateUserStoryUpdatesByMultipleIds$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateReOrderUserStories>(
      UserStoryActionTypes.UpdateReOrderUserStories
    ),
    switchMap(projectTriggeredAction => {
      var userStorySearchCriteriaModel = new UserStorySearchCriteriaInputModel();
      userStorySearchCriteriaModel.goalId = this.goalId;
      userStorySearchCriteriaModel.userStoryIds = this.userStoryIds.toString();
      userStorySearchCriteriaModel.isForUserStoryoverview = true;
      userStorySearchCriteriaModel.isUserStoryArchived = false;
      userStorySearchCriteriaModel.isUserStoryParked = false;
      return this.projectGoalsService
        .searchUserStories(userStorySearchCriteriaModel)
        .pipe(
          map((userStories: any) => {
            if (userStories.success === true) {
              var userStories = this.convertJSONToUserStories(userStories.data);
              var userStoryUpdates = this.convertUserStoriesToJson(userStories);
              return new UpdateMultipleUserStories({
                userStoryUpdateMultiple: userStoryUpdates
              });
            } else {
              return new SearchUserStoriesFailed(userStories.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  updateUserStorySubTaskUpdatesByMultipleIds$: Observable<Action> = this.actions$.pipe(
    ofType<UpsertSubTaskCompleted>(
      UserStoryActionTypes.UpsertSubTaskCompleted
    ),
    mergeMap(projectTriggeredAction => {
      var userStorySearchCriteriaModel = new UserStorySearchCriteriaInputModel();
      userStorySearchCriteriaModel.goalId = this.goalId;
      userStorySearchCriteriaModel.userStoryIds = this.userStoryId.toString();
      if (this.userStorySearchModel) {
        userStorySearchCriteriaModel.isUserStoryArchived = false;
        userStorySearchCriteriaModel.isUserStoryParked = false;
        userStorySearchCriteriaModel.includeArchive = this.userStorySearchModel.includeArchive;
        userStorySearchCriteriaModel.includePark = this.userStorySearchModel.includePark;
        userStorySearchCriteriaModel.isForUserStoryoverview = true;
      }
      return this.projectGoalsService
        .searchUserStories(userStorySearchCriteriaModel)
        .pipe(
          map((userStories: any) => {
            if (userStories.success === true) {
              var userStories = this.convertJSONToUserStories(userStories.data);
              var userStoryUpdates = this.convertUserStoriesToJson(userStories);
              return new UpdateMultipleUserStories({
                userStoryUpdateMultiple: userStoryUpdates
              });
            } else {
              return new SearchUserStoriesFailed(userStories.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );


  @Effect()
  upsertUserStorySuccessfulAndUpdateSubTaskUserStories$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<GetUserStoryByIdTriggered>(
      UserStoryActionTypes.GetUserStoryByIdTriggered
    ),
    pipe(
      map(() => {
        if (this.isSubTasksCalling) {
          var userStorySearchCriteria = new UserStorySearchCriteriaInputModel();
          userStorySearchCriteria.parentUserStoryId = this.userStoryId;
          userStorySearchCriteria.isForUserStoryoverview = true;
          userStorySearchCriteria.isUserStoryArchived = false;
          userStorySearchCriteria.isUserStoryParked = false;
          userStorySearchCriteria.goalId = this.goalId;
          return new GetUserStorySubTasksTriggered(userStorySearchCriteria);
        } else {
          return new ArchiveUnArchiveGoalCompleted();
        }
      })
    )
  );


  @Effect()
  upsertUserStorySuccessfulAndLoadUserStories$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<CreateUserStoryCompleted>(
      UserStoryActionTypes.CreateUserStoryCompleted
    ),
    pipe(
      map(() => {
        if (this.isParentUserStoryId && !this.isUniqueDetailsPage) {
          if (this.isAllGoalsPage) {
            return new UpdateUniquePageUserStories(this.userStoryId);
          } else {
            return new UpsertSubTaskCompleted();
          }
        }
        else {
            return new GetUserStoryByIdTriggered(this.userStoryId);
        }
      })
    )
  );


  @Effect()
  upsertUserStorySuccessfully$: Observable<Action> = this.actions$.pipe(
    ofType<GetUserStoryByIdCompleted>(
      UserStoryActionTypes.GetUserStoryByIdCompleted
    ),
    pipe(
      map(() => {
        if(this.isAllGoalsPage) {
          return new ArchiveUnArchiveGoalCompleted();
        } else {
          return new GetGoalByIdTriggered(this.goalId);
        }
      })
    )
  );

  @Effect()
  loadUserStoryHistory$: Observable<Action> = this.actions$.pipe(
    ofType<CreateUserStoryCompleted>(
      UserStoryActionTypes.CreateUserStoryCompleted
    ),
    pipe(
      map(() => {
        return new LoadUserstoryHistoryTriggered(this.reloadHistoryId);
      })
    )
  );


  @Effect()
  upsertUserStoryIsSuccessfull$: Observable<Action> = this.actions$.pipe(
    ofType<CreateUserStoryCompleted>(
      UserStoryActionTypes.CreateUserStoryCompleted
    ),
    pipe(
      map(() => {
        if (this.parentUserStoryGoalId && this.parentUserStoryGoalId != null)
          return new GetGoalDetailsByMultipleGoalIdsTriggered(this.parentUserStoryGoalId);
        else
          return new ArchiveUnArchiveGoalCompleted();
      })
    )
  );

  @Effect()
  upsertUserStoryReplanSuccessfulAndLoadUserStories$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<InsertUserStoryReplanCompleted>(
      UserStoryActionTypes.InsertUserStoryReplanCompleted
    ),
    pipe(
      map(() => {
        if(this.isParentUserStoryId) {
          return new UpsertSubTaskCompleted();
        } else {
          return new GetUserStoryByIdTriggered(this.userStoryId);
        }
      })
    )
  );

  @Effect()
  getUserStoryById$: Observable<Action> = this.actions$.pipe(
    ofType<GetUserStoryByIdTriggered>(
      UserStoryActionTypes.GetUserStoryByIdTriggered
    ),
    mergeMap(projectTriggeredAction => {
      this.userStoryId = projectTriggeredAction.userStoryId;
      return this.projectGoalsService
        .GetUserStoryById(projectTriggeredAction.userStoryId)
        .pipe(
          map((userStories: any) => {
            if (userStories.success === true) {
              this.goalId = userStories.data.goalId;
              this.userStory = userStories.data;
              // this.myWorkModel = userStories.data;
              this.userStory = this.convertJSONToUserStory(userStories.data);
              return new GetUserStoryByIdCompleted(this.userStory);
            } else {
              return new CreateUserStoryFailed(userStories.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );


  @Effect()
  getUserStoryByIdInProjects$: Observable<Action> = this.actions$.pipe(
    ofType<UpsertUserStoryByIdTriggered>(
      UserStoryActionTypes.UpsertUserStoryByIdTriggered
    ),
    mergeMap(projectTriggeredAction => {
      var userStory = new UserStory();
      userStory.userStoryId = projectTriggeredAction.requestId;
      return this.projectGoalsService
        .GetUserStoryById(userStory.userStoryId)
        .pipe(
          map((userStories: any) => {
            if (userStories.success === true) {
              this.goalId = userStories.data.goalId;
              this.userStory = userStories.data;
              //this.myWorkModel = userStories.data;
              this.userStory = this.convertJSONToUserStory(userStories.data);
              return new GetUserStoryByIdCompleted(this.userStory);
            } else {
              return new CreateUserStoryFailed(userStories.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  getUniqueUserStoryById$: Observable<Action> = this.actions$.pipe(
    ofType<GetUniqueUserStoryByIdTriggered>(
      UserStoryActionTypes.GetUniqueUserStoryByIdTriggered
    ),
    switchMap(projectTriggeredAction => {
      return this.projectGoalsService
        .GetUserStoryById(projectTriggeredAction.userStoryId)
        .pipe(
          map((userStories: any) => {
            if (userStories.success === true) {
              this.userStory = userStories.data;
              if (this.userStory) {
                this.projectId = this.userStory.projectId;
                this.userStory = this.convertJSONToUserStory(userStories.data);
              }
              //this.myWorkModel = userStories.data;
              return new GetUniqueUserStoryByIdCompleted(userStories.data);
            } else {
              return new CreateUserStoryFailed(userStories.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  getUniqueUserStoryByUniqueId$: Observable<Action> = this.actions$.pipe(
    ofType<GetUniqueUserStoryByUniqueIdTriggered>(
      UserStoryActionTypes.GetUniqueUserStoryByUniqueIdTriggered
    ),
    switchMap(projectTriggeredAction => {
      return this.projectGoalsService
        .GetUserStoryById(null, projectTriggeredAction.userStoryId)
        .pipe(
          map((userStories: any) => {
            if (userStories.success === true) {
              this.userStory = userStories.data;
              //this.myWorkModel = userStories.data;
              if(this.userStory) {
                this.projectId = this.userStory.projectId;
                this.userStory = this.convertJSONToUserStory(userStories.data);
              }
              return new GetUniqueUserStoryByIdCompleted(userStories.data);
            } else {
              return new CreateUserStoryFailed(userStories.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );

  // @Effect()
  // upsertUserStorySuccessful$: Observable<Action> = this.actions$.pipe(
  //   ofType<CreateUserStoryCompleted>(
  //     UserStoryActionTypes.CreateUserStoryCompleted
  //   ),
  //   pipe(
  //     map(
  //       () =>
  //         new SnackbarOpen({
  //           message: this.toastrMessage, // TODO: Change to proper toast message
  //           action: this.translateService.instant(ConstantVariables.success)
  //         })
  //     )
  //   )
  // );



  @Effect()
  upsertCreateUserStorySuccessfulAndLoadProjectFeatures$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<GetUniqueUserStoryByIdCompleted>(
      UserStoryActionTypes.GetUniqueUserStoryByIdCompleted
    ),
    pipe(
      map(() => {
        if(this.projectId) {
          const projectFeature = new ProjectFeature();
          projectFeature.projectId = this.projectId;
          projectFeature.IsDelete = false;
          return new LoadFeatureProjectsTriggered(projectFeature);
        } else {
          return new ArchiveUnArchiveGoalCompleted();
        }
      })
    )
  );

  @Effect()
  upsertCreateUserStorySuccessfulAndLoadBugPriorities$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<GetUniqueUserStoryByIdCompleted>(
      UserStoryActionTypes.GetUniqueUserStoryByIdCompleted
    ),
    pipe(
      map(() => {
        return new LoadBugPriorityTypesTriggered();
      })
    )
  );


  @Effect()
  upsertCreateUserStorySuccessfulAndLoadProjectMembers$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<GetUniqueUserStoryByIdCompleted>(
      UserStoryActionTypes.GetUniqueUserStoryByIdCompleted
    ),
    pipe(
      map(() => {
        if(this.projectId) {
          return new LoadMemberProjectsTriggered(this.projectId);
        }
        else {
          return new ArchiveUnArchiveGoalCompleted();
        }
      })
    )
  );



  // // @Effect()
  // // upsertCreateUserStorySuccessfulAndLoadMyWorkDetails$: Observable<
  // //   Action
  // // > = this.actions$.pipe(
  // //   ofType<GetUserStoryByIdCompleted>(
  // //     UserStoryActionTypes.GetUserStoryByIdCompleted
  // //   ),
  // //   pipe(
  // //     map(() => {
  // //       return new UserStoryCompletedWithInPlaceUpdate({
  // //         userStoryUpdate: {
  // //           id: this.myWorkModel.userStoryId,
  // //           changes: this.myWorkModel
  // //         }
  // //       });
  // //     })
  // //   )
  // // );


  @Effect()
  updateUserStorySuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<GetUserStoryByIdCompleted>(
      UserStoryActionTypes.GetUserStoryByIdCompleted
    ),
    pipe(
      map(() => {
        if (this.isNewUserStory) {
          return new RefreshUserStoriesList(this.userStory);
        }
        else {
          return new CreateUserStoryCompletedWithInPlaceUpdate({
            userStoryUpdate: {
              id: this.userStory.userStoryId,
              changes: this.userStory
            }
          });
        }
      })
    )
  );

  @Effect()
  archiveUserStory$: Observable<Action> = this.actions$.pipe(
    ofType<ArchivedUserStoryTriggered>(UserStoryActionTypes.ArchiveUserStoryTriggred),
    switchMap(userStoryTriggeredAction => {
      this.goalId = userStoryTriggeredAction.archiveUserStory.goalId;
      this.parentUserStoryGoalId = userStoryTriggeredAction.archiveUserStory.parentUserStoryGoalId;
      this.isAllGoalsPage = userStoryTriggeredAction.archiveUserStory.isAllGoalsPage;
      let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
      if (userStoryTriggeredAction.archiveUserStory.isArchive) {

        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
          this.toastrMessage = " Work item archived successfully";
        }
        else if (currentCulture == 'ko') {
          this.toastrMessage = "작업 항목이 성공적으로 아카이브되었습니다.";
        }
        else {
          this.toastrMessage = "పని అంశం విజయవంతంగా ఆర్కైవ్ చేయబడింది";
        }
      }
      else {
        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
          this.toastrMessage = "Work item unarchived successfully";
        }
        else if (currentCulture == 'ko') {
          this.toastrMessage = "작업 항목이 성공적으로 보관 취소되었습니다.";
        }
        else {
          this.toastrMessage = "పని అంశం విజయవంతంగా ఆర్కైవ్ చేయబడలేదు";
        }
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForUserStoryUnArchive);
      }
      return this.projectGoalsService
        .archiveUserStory(userStoryTriggeredAction.archiveUserStory)
        .pipe(
          map((result: any) => {
            if (result.success === true) {
              this.goalId = userStoryTriggeredAction.archiveUserStory.goalId;
              this.isAllGoalsPage = userStoryTriggeredAction.archiveUserStory.isAllGoalsPage;
              let parentUserStoryGoalId = userStoryTriggeredAction.archiveUserStory.parentUserStoryGoalId;
              if (userStoryTriggeredAction.archiveUserStory.parentUserStoryId && ((parentUserStoryGoalId == this.goalId) || !parentUserStoryGoalId)) {
                this.userStoryId = userStoryTriggeredAction.archiveUserStory.parentUserStoryId;
                this.childUserStoryId = userStoryTriggeredAction.archiveUserStory.userStoryId;
                if (this.isAllGoalsPage) {
                  return new UpdateUniquePageUserStories(this.userStoryId);
                } else {
                  return new UpsertSubTaskCompleted();
                }
              }
              else {
                this.userStoryId = userStoryTriggeredAction.archiveUserStory.userStoryId;
                return new ArchiveUserStoryCompleted(userStoryTriggeredAction.archiveUserStory.userStoryId);
              }

            } else {
              return new ArchiveUserStoryFailed(result.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  archiveUniqueUserStory$: Observable<Action> = this.actions$.pipe(
    ofType<ArchivedUniqueUserStoryTriggered>(UserStoryActionTypes.ArchiveUniqueUserStoryTriggred),
    switchMap(userStoryTriggeredAction => {
      this.goalId = userStoryTriggeredAction.archiveUserStory.goalId;
      let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
      if (userStoryTriggeredAction.archiveUserStory.isArchive) {

        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
          this.toastrMessage = " Work item archived successfully";
        }
        else if (currentCulture == 'ko') {
          this.toastrMessage = "작업 항목이 성공적으로 아카이브되었습니다.";
        }
        else {
          this.toastrMessage = "పని అంశం విజయవంతంగా ఆర్కైవ్ చేయబడింది";
        }
      }
      else {
        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
          this.toastrMessage = "Work item unarchived successfully";
        }
        else if (currentCulture == 'ko') {
          this.toastrMessage = "작업 항목이 성공적으로 보관 취소되었습니다.";
        }
        else {
          this.toastrMessage = "పని అంశం విజయవంతంగా ఆర్కైవ్ చేయబడలేదు";
        } this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForUserStoryUnArchive);
      }

      return this.projectGoalsService
        .archiveUserStory(userStoryTriggeredAction.archiveUserStory)
        .pipe(
          map((result: any) => {
            if (result.success === true) {
              this.goalId = userStoryTriggeredAction.archiveUserStory.goalId;
              this.userStoryId = userStoryTriggeredAction.archiveUserStory.userStoryId;
              return new ArchiveUniqueUserStoryCompleted(userStoryTriggeredAction.archiveUserStory.userStoryId);
            } else {
              return new ArchiveUniqueUserStoryFailed(result.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  archiveSubTaskUserStory$: Observable<Action> = this.actions$.pipe(
    ofType<ArchivedSubTaskUserStoryTriggered>(UserStoryActionTypes.ArchiveSubTaskUserStoryTriggred),
    switchMap(userStoryTriggeredAction => {
      this.goalId = userStoryTriggeredAction.archiveUserStory.goalId;
      let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
      if (userStoryTriggeredAction.archiveUserStory.isArchive) {

        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
          this.toastrMessage = " Work item archived successfully";
        }
        else if (currentCulture == 'ko') {
          this.toastrMessage = "작업 항목이 성공적으로 아카이브되었습니다.";
        }
        else {
          this.toastrMessage = "పని అంశం విజయవంతంగా ఆర్కైవ్ చేయబడింది";
        }
      }
      else {
        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
          this.toastrMessage = "Work item unarchived successfully";
        }
        else if (currentCulture == 'ko') {
          this.toastrMessage = "작업 항목이 성공적으로 보관 취소되었습니다.";
        }
        else {
          this.toastrMessage = "పని అంశం విజయవంతంగా ఆర్కైవ్ చేయబడలేదు";
        } this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForUserStoryUnArchive);
      }
      return this.projectGoalsService
        .archiveUserStory(userStoryTriggeredAction.archiveUserStory)
        .pipe(
          map((result: any) => {
            if (result.success === true) {
              this.userStoryId = userStoryTriggeredAction.archiveUserStory.parentUserStoryId;
              this.childUserStoryId = userStoryTriggeredAction.archiveUserStory.userStoryId;
              return new ArchiveSubTaskUserStoryCompleted(userStoryTriggeredAction.archiveUserStory.userStoryId);
            } else {
              return new ArchiveSubTaskUserStoryFailed(result.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );


  @Effect()
  updateUserStoryGoal$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateUserStoryGoalTriggred>(UserStoryActionTypes.UpdateUserStoryGoalTriggred),
    switchMap(userStoryTriggeredAction => {
      this.goalId = userStoryTriggeredAction.userStory.goalId;
      this.oldGoalId = userStoryTriggeredAction.userStory.oldGoalId;
      this.isGoalUniquePage = userStoryTriggeredAction.userStory.isGoalUniquePage;
      let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
      if (userStoryTriggeredAction.userStory.parentUserStoryId) {
        this.userStoryGoalId = userStoryTriggeredAction.userStory.parentUserStoryId;
      }
      else {
        this.userStoryGoalId = userStoryTriggeredAction.userStory.userStoryId;
      }
      if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
        this.toastrMessage = " Work item goal updated successfully";
      }
      else if (currentCulture == 'ko') {
        this.toastrMessage = "작업 항목 목표가 업데이트되었습니다.";
      }
      else {
        this.toastrMessage = "పని అంశం లక్ష్యం విజయవంతంగా నవీకరించబడింది";
      }

      return this.projectGoalsService
        .updateUserStoryGoal(userStoryTriggeredAction.userStory)
        .pipe(
          map((result: any) => {
            if (result.success === true) {
              return new UpdateUserStoryGoalCompleted(userStoryTriggeredAction.userStory.userStoryId);
            } else {
              return new UpdateUserStoryGoaalFailed(result.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  parkUserStory$: Observable<Action> = this.actions$.pipe(
    ofType<ParkUserStoryTriggered>(UserStoryActionTypes.ParkUserStoryTriggred),
    switchMap(goalTriggeredAction => {
      this.goalId = goalTriggeredAction.parkUserStory.goalId;
      this.parentUserStoryGoalId = goalTriggeredAction.parkUserStory.parentUserStoryGoalId;
      this.isAllGoalsPage = goalTriggeredAction.parkUserStory.isAllGoalsPage;
      let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
      if (goalTriggeredAction.parkUserStory.isParked) {
        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
          this.toastrMessage = "Work item Parked successfully";
        }
        else if (currentCulture == 'ko') {
          this.toastrMessage = "작업 항목이 성공적으로 파킹되었습니다.";
        }
        else {
          this.toastrMessage = "పని అంశం విజయవంతంగా నిలిపివేయబడింది";
        }

      }
      else {
        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
          this.toastrMessage = "Work item resumed successfully";
        }
        else if (currentCulture == 'ko') {
          this.toastrMessage = "작업 항목이 성공적으로 재개되었습니다.";
        }
        else {
          this.toastrMessage = "పని అంశం విజయవంతంగా తిరిగి ప్రారంభమైంది";
        }

      }
      return this.projectGoalsService
        .parkUserStory(goalTriggeredAction.parkUserStory)
        .pipe(
          map((result: any) => {
            if (result.success === true) {
              this.goalId = goalTriggeredAction.parkUserStory.goalId;
              let parentUserStoryGoalId = goalTriggeredAction.parkUserStory.parentUserStoryGoalId;
              this.isAllGoalsPage = goalTriggeredAction.parkUserStory.isAllGoalsPage;
              if (goalTriggeredAction.parkUserStory.parentUserStoryId && ((parentUserStoryGoalId == this.goalId) || !parentUserStoryGoalId)) {
                this.userStoryId = goalTriggeredAction.parkUserStory.parentUserStoryId.toLowerCase();
                this.childUserStoryId = goalTriggeredAction.parkUserStory.userStoryId.toLowerCase();
                if (this.isAllGoalsPage) {
                  return new UpdateUniquePageUserStories(this.userStoryId);
                } else {
                  return new UpsertSubTaskCompleted();
                }
              }
              else {
                return new ParkUserStoryCompleted(goalTriggeredAction.parkUserStory.userStoryId);
              }
            } else {
              return new ParkUserStoryFailed(result.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  parkUniqueUserStory$: Observable<Action> = this.actions$.pipe(
    ofType<ParkUniqueUserStoryTriggered>(UserStoryActionTypes.ParkUniqueUserStoryTriggred),
    switchMap(goalTriggeredAction => {
      this.goalId = goalTriggeredAction.parkUserStory.goalId;
      let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
      if (goalTriggeredAction.parkUserStory.isParked) {
        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
          this.toastrMessage = "Work item Parked successfully";
        }
        else if (currentCulture == 'ko') {
          this.toastrMessage = "작업 항목이 성공적으로 파킹되었습니다.";
        }
        else {
          this.toastrMessage = "పని అంశం విజయవంతంగా నిలిపివేయబడింది";
        }

      }
      else {
        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
          this.toastrMessage = "Work item resumed successfully";
        }
        else if (currentCulture == 'ko') {
          this.toastrMessage = "작업 항목이 성공적으로 재개되었습니다.";
        }
        else {
          this.toastrMessage = "పని అంశం విజయవంతంగా తిరిగి ప్రారంభమైంది";
        }

      }
      return this.projectGoalsService
        .parkUserStory(goalTriggeredAction.parkUserStory)
        .pipe(
          map((result: any) => {
            if (result.success === true) {
              this.goalId = goalTriggeredAction.parkUserStory.goalId;
              return new ParkUniqueUserStoryCompleted(goalTriggeredAction.parkUserStory.userStoryId);
            } else {
              return new ParkUniqueUserStoryFailed(result.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  parkSubTaskUserStory$: Observable<Action> = this.actions$.pipe(
    ofType<ParkSubTaskUserStoryTriggered>(UserStoryActionTypes.ParkSubTaskUserStoryTriggred),
    switchMap(goalTriggeredAction => {
      this.goalId = goalTriggeredAction.parkUserStory.goalId;
      let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
      if (goalTriggeredAction.parkUserStory.isParked) {
        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
          this.toastrMessage = "Work item Parked successfully";
        }
        else if (currentCulture == 'ko') {
          this.toastrMessage = "작업 항목이 성공적으로 파킹되었습니다.";
        }
        else {
          this.toastrMessage = "పని అంశం విజయవంతంగా నిలిపివేయబడింది";
        }

      }
      else {
        if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == null || currentCulture == 'undefined') {
          this.toastrMessage = "Work item resumed successfully";
        }
        else if (currentCulture == 'ko') {
          this.toastrMessage = "작업 항목이 성공적으로 재개되었습니다.";
        }
        else {
          this.toastrMessage = "పని అంశం విజయవంతంగా తిరిగి ప్రారంభమైంది";
        }

      }
      return this.projectGoalsService
        .parkUserStory(goalTriggeredAction.parkUserStory)
        .pipe(
          map((result: any) => {
            if (result.success === true) {
              this.goalId = goalTriggeredAction.parkUserStory.goalId;
              this.userStoryId = goalTriggeredAction.parkUserStory.parentUserStoryId;
              return new ParkSubTaskUserStoryCompleted(goalTriggeredAction.parkUserStory.userStoryId);
            } else {
              return new ParkSubTaskUserStoryFailed(result.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  SearchUserStories$: Observable<
    Action
  > =
    this.actions$.pipe(
      ofType<SearchUserStories>(UserStoryActionTypes.SearchUserStories),
      switchMap(query => {
        if (query === undefined) {
          return empty();
        }
        // const nextSearch$ = this.actions$.pipe(
        //   ofType(UserStoryActionTypes.SearchUserStories),
        //   skip(1)
        // );
        if (query.userStorySearchCriteriaModel.pageNumber == 1) {
          this.userStories = [];
        }
        this.goalId = query.goalId;
        this.userStorySearchModel = query.userStorySearchCriteriaModel;

        return this.projectGoalsService.searchUserStories(query.userStorySearchCriteriaModel).pipe(
          // takeUntil(nextSearch$),
          map((userStories: any) => {
            if (userStories.success) {
              var userStoriesList = userStories.data;
              var userStories = this.convertJSONToUserStories(userStoriesList);
              return new SearchUserStoriesComplete(userStories)
            }
            else {
              return new SearchUserStoriesFailed(userStories.apiResponseMessages)
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
      })
    );

  @Effect()
  SearchAllUserStories$: Observable<
    Action
  > =
    this.actions$.pipe(
      ofType<SearchAllUserStories>(UserStoryActionTypes.SearchAllUserStories),
      switchMap(action => {
        if (action.userStorySearchCriteriaModel.pageNumber <= 1) {
          this.userStories = [];
        }
        this.goalId = action.userStorySearchCriteriaModel.goalId;
        this.userStorySearchModel = action.userStorySearchCriteriaModel;
        return this.projectGoalsService.searchUserStories(action.userStorySearchCriteriaModel).pipe(
          // takeUntil(nextSearch$),
          map((userStories: any) => {
            if (userStories.success) {
              var userStoriesList = userStories.data;
              var userStories = this.convertJSONToUserStories(userStoriesList);
              userStoriesList.forEach(userStory => {
                this.userStories.push(userStory);
              });
              return new SearchUserStoriesComplete(this.userStories)
            }
            else {
              return new SearchUserStoriesFailed(userStories.apiResponseMessages)
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
      })
    );


  @Effect()
  upsertMultipleUserStories$: Observable<Action> = this.actions$.pipe(
    ofType<CreateMultipleUserStoriestriggered>(
      UserStoryActionTypes.CreateMultipleUserStoriesTriggered
    ),
    switchMap(projectTriggeredAction => {
      this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForMultipleUserStoriesUpdate)
      this.goalId = projectTriggeredAction.userStory.goalId;
      if (projectTriggeredAction.userStory.parentUserStoryIds.length > 0) {
        this.userStoryIds = projectTriggeredAction.userStory.UserStoryIds.concat(projectTriggeredAction.userStory.parentUserStoryIds);
      }
      else {
        this.userStoryIds = projectTriggeredAction.userStory.UserStoryIds;
      }
      return this.projectGoalsService
        .UpdateMultipleUserStories(projectTriggeredAction.userStory)
        .pipe(
          map((userStories: any) => {
            if (userStories.success === true) {
              return new CreateMultipleUserStoryCompleted(userStories);
            } else {
              return new CreateMultipleUserStoriesFailed(
                userStories.apiResponseMessages
              );
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  archivekanban$: Observable<Action> = this.actions$.pipe(
    ofType<ArchivekanbanGoalsTriggered>(
      UserStoryActionTypes.ArchivekanbanGoalsTriggered
    ),
    switchMap(result => {
      this.toastrMessage = this.translateService.instant(ConstantVariables.ArchivedSuccessFully);
      return this.projectGoalsService
        .archiveKanban(result.archivedkanbanModel)
        .pipe(
          map((data: any) => {
            if (data.success === true) {
              this.goalId = result.archivedkanbanModel.goalId;
              return new ArchivekanbanGoalsCompleted(result.archivedkanbanModel.userStories)

            } else {
              return new ArchivekanbanGoalsFailed(
                data.apiResponseMessages
              );
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  upsertUserStorytags$: Observable<Action> = this.actions$.pipe(
    ofType<UpsertUserStoryTagsTriggered>(
      UserStoryActionTypes.UpsertUserStoryTagsTriggered
    ),
    switchMap(tags => {
      return this.projectGoalsService
        .upsertUserStoryTags(tags.tagsInputModel)
        .pipe(
          map((result: any) => {
            if (result.success === true) {
              if (tags.tagsInputModel.parentUserStoryId) {
                this.userStoryId = tags.tagsInputModel.parentUserStoryId
              } else {
                this.userStoryId = result.data;
              }
              this.isAllGoalsPage = tags.tagsInputModel.isAllGoalsPage
              return new UpsertUserStoryTagsCompleted(this.userStoryId)

            } else {
              return new UpsertUserStoryTagsFailed(
                result.apiResponseMessages
              );
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  upsertUserStoryTagsSuccessful: Observable<
    Action
  > = this.actions$.pipe(
    ofType<UpsertUserStoryTagsCompleted>(
      UserStoryActionTypes.UpsertUserStoryTagsCompleted
    ),
    pipe(
      map(() => {
        if (this.isAllGoalsPage) {
          return new UpdateUniquePageUserStories(this.userStoryId);

        } else {
          return new GetUserStoryByIdTriggered(this.userStoryId);
        }
      })
    )
  );

  @Effect()
  updateUserStoryGoalFailed: Observable<
    Action
  > = this.actions$.pipe(
    ofType<UpdateUserStoryGoaalFailed>(
      UserStoryActionTypes.UpdateUserStoryGoaalFailed
    ),
    pipe(
      map(() => {
        return new GetUserStoryByIdTriggered(this.userStoryGoalId);
      })
    )
  );


  @Effect()
  upsertEmployeeEducationDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<ArchivekanbanGoalsCompleted>(UserStoryActionTypes.ArchivekanbanGoalsCompleted),
    pipe(
      map(
        () =>
          new SnackbarOpen({
            message: this.toastrMessage, // TODO: Change to proper toast message
            action: this.translateService.instant(ConstantVariables.success)
          })
      )
    )
  );



  @Effect()
  upsertUserStoryReplanSuccessfulAndUpdate$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<CreateMultipleUserStoryCompleted>(
      UserStoryActionTypes.CreateMultipleUserStoriesCompleted
    ),
    pipe(
      map(() => {
        return new GetGoalByIdTriggered(this.goalId);
      })
    )
  );

  @Effect()
  upsertUserStoryGoalSuccessfulAndUpdateOldGoal$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<UpdateUserStoryGoalCompleted>(
      UserStoryActionTypes.UpdateUserStoryGoalCompleted
    ),
    pipe(
      map(() => {
        return new GetGoalDetailsByMultipleGoalIdsTriggered(this.oldGoalId + ',' + this.goalId);
      })
    )
  );

  // @Effect()
  // upsertUserStoryGoalSuccessfulAndUpdateGoalId$: Observable<
  //   Action
  // > = this.actions$.pipe(
  // //   ofType<UpdateUserStoryGoalCompleted>(
  //     UserStoryActionTypes.UpdateUserStoryGoalCompleted
  //   ),
  //   pipe(
  //     map(() => {
  //       return new GetGoalByIdTriggered(this.oldGoalId);
  //     })
  //   )
  // );


  @Effect()
  archiveKanbanUserStoriesSuccessfulAndUpdate$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ArchivekanbanGoalsCompleted>(
      UserStoryActionTypes.ArchivekanbanGoalsCompleted
    ),
    pipe(
      map(() => {
        return new GetGoalByIdTriggered(this.goalId);
      })
    )
  );


  @Effect()
  UserStoryParkSuccessfulAndUpdate$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ParkUserStoryCompleted>(
      UserStoryActionTypes.ParkUserStoryCompleted
    ),
    pipe(
      map(() => {
        if(this.isAllGoalsPage) {
          return new GetAllGoalByIdTriggered(this.goalId);
        } else {
          return new GetGoalByIdTriggered(this.goalId);
        }
      })
    )
  );

  @Effect()
  UserStoryParkSuccessfulAndUpdated$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ParkUserStoryCompleted>(
      UserStoryActionTypes.ParkUserStoryCompleted
    ),
    pipe(
      map(() => {
        if (this.parentUserStoryGoalId && this.parentUserStoryGoalId != null)
          return new GetGoalDetailsByMultipleGoalIdsTriggered(this.parentUserStoryGoalId);
        else
          return new ArchiveUnArchiveGoalCompleted();
      })
    )
  );


  @Effect()
  UniqueUserStoryParkSuccessfulAndUpdate$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ParkUniqueUserStoryCompleted>(
      UserStoryActionTypes.ParkUniqueUserStoryCompleted
    ),
    pipe(
      map(() => {
        return new GetUniqueGoalByIdTriggered(this.goalId);
      })
    )
  );

  @Effect()
  SubTaskUserStoryParkSuccessfulAndUpdate$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ParkSubTaskUserStoryCompleted>(
      UserStoryActionTypes.ParkSubTaskUserStoryCompleted
    ),
    pipe(
      map(() => {
        return new GetUniqueGoalByIdTriggered(this.goalId);
      })
    )
  );


  // tslint:disable-next-line: member-ordering
  @Effect()
  UserStorySuccessfulAndUpdate$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ParkSubTaskUserStoryCompleted>(
      UserStoryActionTypes.ParkSubTaskUserStoryCompleted
    ),
    pipe(
      map(() => {
        return new UpsertSubTaskCompleted();
      })
    )
  );

  // tslint:disable-next-line: member-ordering
  @Effect()
  UserStorySubtaskArchiveSuccessfulAndUpdate$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ArchiveSubTaskUserStoryCompleted>(
      UserStoryActionTypes.ArchiveSubTaskUserStoryCompleted
    ),
    pipe(
      map(() => {
        return new UpsertSubTaskCompleted();
      })
    )
  );

  @Effect()
  UserStorysubtaskArchiveSuccessfulAndUpdated$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ArchiveSubTaskUserStoryCompleted>(
      UserStoryActionTypes.ArchiveSubTaskUserStoryCompleted
    ),
    pipe(
      map(() => {
        return new GetUserStorySubTasksTriggered(this.subTasksCriteriaModel);
      })
    )
  );


  @Effect()
  UserStorysubtaskParkSuccessfulAndUpdated$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ParkSubTaskUserStoryCompleted>(
      UserStoryActionTypes.ParkSubTaskUserStoryCompleted
    ),
    pipe(
      map(() => {
        return new GetUserStorySubTasksTriggered(this.subTasksCriteriaModel);
      })
    )
  );

  @Effect()
  UserStoryArchiveSuccessfulAndUpdate$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ArchiveUserStoryCompleted>(
      UserStoryActionTypes.ArchiveUserStoryCompleted
    ),
    pipe(
      map(() => {
        if(this.isAllGoalsPage) {
          return new GetAllGoalByIdTriggered(this.goalId);
        } else {
          return new GetGoalByIdTriggered(this.goalId);
        }
      })
    )
  );

  @Effect()
  loadLinksCounts$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ArchiveUserStoryCompleted>(
      UserStoryActionTypes.ArchiveUserStoryCompleted
    ),
    pipe(
      map(() => {
        return new LoadLinksCountByUserStoryIdTriggered(this.userStoryId, false);
      })
    )
  );

  @Effect()
  loadUserStoryLinks$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ArchiveUserStoryCompleted>(
      UserStoryActionTypes.ArchiveUserStoryCompleted
    ),
    pipe(
      map(() => {
        var linkUserStoryModel = new LinkUserStoryInputModel();
        linkUserStoryModel.userStoryId = this.userStoryId;
        return new LoadUserstoryLinksTriggered(linkUserStoryModel);
      })
    )
  );

  @Effect()
  loadParkLinksCount$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ParkUserStoryCompleted>(
      UserStoryActionTypes.ParkUserStoryCompleted
    ),
    pipe(
      map(() => {
        return new LoadLinksCountByUserStoryIdTriggered(this.userStoryId, false);
      })
    )
  );

  @Effect()
  loadParkUserStoryLinks$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ParkUserStoryCompleted>(
      UserStoryActionTypes.ParkUserStoryCompleted
    ),
    pipe(
      map(() => {
        var linkUserStoryModel = new LinkUserStoryInputModel();
        linkUserStoryModel.userStoryId = this.userStoryId;
        return new LoadUserstoryLinksTriggered(linkUserStoryModel);
      })
    )
  );





  @Effect()
  loadUniqueUserStoryLinks$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ArchiveUniqueUserStoryCompleted>(
      UserStoryActionTypes.ArchiveUniqueUserStoryCompleted
    ),
    pipe(
      map(() => {
        var linkUserStoryModel = new LinkUserStoryInputModel();
        linkUserStoryModel.userStoryId = this.userStoryId;
        return new LoadUserstoryLinksTriggered(linkUserStoryModel);
      })
    )
  );

  @Effect()
  UserStoryArchiveSuccessfulAndUpdated$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ArchiveUserStoryCompleted>(
      UserStoryActionTypes.ArchiveUserStoryCompleted
    ),
    pipe(
      map(() => {
        if (this.parentUserStoryGoalId && this.parentUserStoryGoalId != null)
          return new GetGoalDetailsByMultipleGoalIdsTriggered(this.parentUserStoryGoalId);
        else
          return new ArchiveUnArchiveGoalCompleted();
      })
    )
  );
  @Effect()
  UniqueUserStoryArchiveSuccessfulAndUpdate$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ArchiveUniqueUserStoryCompleted>(
      UserStoryActionTypes.ArchiveUniqueUserStoryCompleted
    ),
    pipe(
      map(() => {
        return new GetUniqueGoalByIdTriggered(this.goalId);
      })
    )
  );

  @Effect()
  SubTaskUserStoryArchiveSuccessfulAndUpdate$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ArchiveSubTaskUserStoryCompleted>(
      UserStoryActionTypes.ArchiveSubTaskUserStoryCompleted
    ),
    pipe(
      map(() => {
        return new GetUniqueGoalByIdTriggered(this.goalId);
      })
    )
  );

  @Effect()
  upsertMultipleUserStoriesSuccessfulAndLoadGoal$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<CreateMultipleUserStoriesSplitCompleted>(
      UserStoryActionTypes.CreateMultipleUserStoriesSplitCompleted
    ),
    pipe(
      map(() => {
        return new GetGoalByIdTriggered(this.goalId);
      })
    )
  );

  @Effect()
  upsertMultipleUserStoriesUsingFileSuccessfulAndLoadGoal$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<MultipleUserStoriesUsingFileCompleted>(
      UserStoryActionTypes.MultipleUserStoriesUsingFileCompleted
    ),
    pipe(
      map(() => {
        return new GetGoalByIdTriggered(this.goalId);
      })
    )
  );

  @Effect()
  loadLinksCountForSubTasks$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<UpsertSubTaskCompleted>(
      UserStoryActionTypes.UpsertSubTaskCompleted
    ),
    pipe(
      map(() => {
        return new LoadLinksCountByUserStoryIdTriggered(this.childUserStoryId, false);
      })
    )
  );

  @Effect()
  loadUserStoryLinksForSubTasks$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<UpsertSubTaskCompleted>(
      UserStoryActionTypes.UpsertSubTaskCompleted
    ),
    pipe(
      map(() => {
        var linkUserStoryModel = new LinkUserStoryInputModel();
        linkUserStoryModel.userStoryId = this.childUserStoryId;
        return new LoadUserstoryLinksTriggered(linkUserStoryModel);
      })
    )
  );

  @Effect()
  loadSubTasks$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<UpsertSubTaskCompleted>(
      UserStoryActionTypes.UpsertSubTaskCompleted
    ),
    pipe(
      map(() => {
        var userStorySearchCriteria = new UserStorySearchCriteriaInputModel();
        userStorySearchCriteria.parentUserStoryId = this.userStoryId;
        userStorySearchCriteria.goalId = this.goalId;
        userStorySearchCriteria.isForUserStoryoverview = true;
        userStorySearchCriteria.isUserStoryArchived = false;
        userStorySearchCriteria.isUserStoryParked = false;
        userStorySearchCriteria.sortDirectionAsc = true;
        userStorySearchCriteria.isForUserStoryoverview = true;
        return new GetUserStorySubTasksTriggered(userStorySearchCriteria);
      })
    )
  );


  @Effect()
  upsertMultipleUserStoriesSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<CreateMultipleUserStoryCompleted>(
      UserStoryActionTypes.CreateMultipleUserStoriesCompleted
    ),
    pipe(
      map(
        () =>
          new SnackbarOpen({
            message: this.toastrMessage, // TODO: Change to proper toast message
            action: this.translateService.instant(ConstantVariables.success)
          })
      )
    )
  );

  @Effect()
  upsertUniqueGoalSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<UpsertUserStoryTagsCompleted>(UserStoryActionTypes.UpsertUserStoryTagsCompleted),
    pipe(
      map(
        () => {
          let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
          if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == 'undefined') {
            return new SnackbarOpen({
              message: "Tags updated successfully",
              action: this.translateService.instant(ConstantVariables.success)
            })
          }
          else {
            return new SnackbarOpen({
              message: "ట్యాగ్‌లు విజయవంతంగా నవీకరించబడ్డాయి",
              action: this.translateService.instant(ConstantVariables.success)
            })
          }
        })
    )
  );

  @Effect()
  multipleUserStories$: Observable<Action> = this.actions$.pipe(
    ofType<CreateMultipleUserStoriesSplitCompleted>(UserStoryActionTypes.CreateMultipleUserStoriesSplitCompleted),
    pipe(
      map(
        () => {
          let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
          if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == 'undefined') {
            return new SnackbarOpen({
              message: "Work items added successfully",
              action: this.translateService.instant(ConstantVariables.success)
            })
          }
          else {
            return new SnackbarOpen({
              message: "పని అంశాలు విజయవంతంగా జోడించబడ్డాయి",
              action: this.translateService.instant(ConstantVariables.success)
            })
          }
        })
    )
  );

  @Effect()
  replan$: Observable<Action> = this.actions$.pipe(
    ofType<InsertUserStoryReplanCompleted>(UserStoryActionTypes.InsertUserStoryReplanCompleted),
    pipe(
      map(
        () => {
          let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
          if (currentCulture == 'en' || currentCulture == 'null' || currentCulture == 'undefined') {
            return new SnackbarOpen({
              message: "Work items replanned successfully",
              action: this.translateService.instant(ConstantVariables.success)
            })
          }
          else {
            return new SnackbarOpen({
              message: "పని అంశాలు విజయవంతంగా రీప్లేన్ చేయబడ్డాయి",
              action: this.translateService.instant(ConstantVariables.success)
            })
          }
        })
    )
  );

  @Effect()
  upsertMultipleUserStoriesUsingFile$: Observable<Action> = this.actions$.pipe(
    ofType<MultipleUserStoriesUsingFileTriggered>(
      UserStoryActionTypes.MultipleUserStoriesUsingFileTriggered
    ),
    switchMap(projectTriggeredAction => {
      this.goalId = projectTriggeredAction.fileModel.goalId
      return this.projectGoalsService
        .UpsertMultipleUserStories(
          projectTriggeredAction.fileModel.goalId,
          projectTriggeredAction.fileModel.filePath
        )
        .pipe(
          map((userStories: any) => {
            if (userStories.success === true) {
              return new MultipleUserStoriesUsingFileCompleted(userStories);
            } else {
              return new MultipleUserStoriesUsingFileFailed(
                userStories.apiResponseMessages
              );
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  upsertMultipleUserStoriesUsingFileSuccessfulAndLoadUserStories$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<MultipleUserStoriesUsingFileCompleted>(
      UserStoryActionTypes.MultipleUserStoriesUsingFileCompleted
    ),
    pipe(
      map(() => {
        return new SearchUserStories(this.userStorySearchModel);
      })
    )
  );

  @Effect()
  upsertMultipleUserStoriesUsingFileSuccessful$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<MultipleUserStoriesUsingFileCompleted>(
      UserStoryActionTypes.MultipleUserStoriesUsingFileCompleted
    ),
    pipe(
      map(
        () =>
          new SnackbarOpen({
            message: this.translateService.instant(ConstantVariables.SuccessMessageForMultipleUserStories), // TODO: Change to proper toast message
            action: this.translateService.instant(ConstantVariables.success)
          })
      )
    )
  );

  @Effect()
  searchMultipleUserStoriesUsingAutoComplete$: Observable<Action> = this.actions$.pipe(
    ofType<SearchAutoCompleteTriggered>(
      UserStoryActionTypes.SearchAutoCompleteTriggered
    ),
    switchMap(projectTriggeredAction => {
      return this.projectGoalsService
        .searchLinkUserStories(
          projectTriggeredAction.userStorySearchCriteriaModel
        )
        .pipe(
          map((userStories: any) => {
            if (userStories.success === true) {
              return new SearchAutoCompleteCompleted(userStories.data);
            } else {
              return new SearchAutoCompleteFailed(
                userStories.apiResponseMessages
              );
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  updateUserStorySubTask$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateSubTaskUserStoryTriggered>(
      UserStoryActionTypes.UpdateSubTaskUserStoryTriggered
    ),
    switchMap(projectTriggeredAction => {
      this.userStoryIds = projectTriggeredAction.userStory.parentUserStoryIds;
      return this.projectGoalsService
        .updateSubTaskUserStory(
          projectTriggeredAction.userStory
        )
        .pipe(
          map((userStories: any) => {
            if (userStories.success === true) {
              return new UpdateSubTaskUserStoryCompleted(userStories.data);
            } else {
              return new UpdateSubTaskUserStoryFailed(
                userStories.apiResponseMessages
              );
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  updateUserStorySubTaskUpdatesCompleted$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateSubTaskUserStoryCompleted>(
      UserStoryActionTypes.UpdateSubTaskUserStoryCompleted
    ),
    switchMap(projectTriggeredAction => {
      var userStorySearchCriteriaModel = new UserStorySearchCriteriaInputModel();
      userStorySearchCriteriaModel.userStoryIds = this.userStoryIds.toString();
      return this.projectGoalsService
        .searchUserStories(userStorySearchCriteriaModel)
        .pipe(
          map((userStories: any) => {
            if (userStories.success === true) {
              var userStories = this.convertJSONToUserStories(userStories.data);
              var userStoryUpdates = this.convertUserStoriesToJson(userStories);
              return new UpdateMultipleUserStories({
                userStoryUpdateMultiple: userStoryUpdates
              });
            } else {
              return new SearchUserStoriesFailed(userStories.apiResponseMessages);
            }
          }),
          catchError(err => {
            return of(new UserStoryExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  showValidationMessagesForUpdateUserStoriesSubTask$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateSubTaskUserStoryFailed>(UserStoryActionTypes.UpdateSubTaskUserStoryFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );


  @Effect()
  showValidationMessagesForArchiveUserStories$: Observable<Action> = this.actions$.pipe(
    ofType<ArchivekanbanGoalsFailed>(UserStoryActionTypes.ArchivekanbanGoalsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );


  @Effect()
  showValidationMessagesForFileUploadUserStories$: Observable<Action> = this.actions$.pipe(
    ofType<MultipleUserStoriesUsingFileFailed>(UserStoryActionTypes.MultipleUserStoriesUsingFileFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForSearchAutoComplete$: Observable<Action> = this.actions$.pipe(
    ofType<SearchAutoCompleteFailed>(UserStoryActionTypes.SearchAutoCompleteFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  upsertArchiveUserStorySuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<ArchiveUserStoryCompleted>(UserStoryActionTypes.ArchiveUserStoryCompleted),
    pipe(
      map(
        () =>
          new SnackbarOpen({
            message: this.toastrMessage, // TODO: Change to proper toast message
            action: this.translateService.instant(ConstantVariables.success)
          })
      )
    )
  );

  @Effect()
  upsertArchiveUniqueUserStorySuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<ArchiveUniqueUserStoryCompleted>(UserStoryActionTypes.ArchiveUniqueUserStoryCompleted),
    pipe(
      map(
        () =>
          new SnackbarOpen({
            message: this.toastrMessage, // TODO: Change to proper toast message
            action: this.translateService.instant(ConstantVariables.success)
          })
      )
    )
  );

  @Effect()
  upsertArchiveSubTaskUserStorySuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<ArchiveSubTaskUserStoryCompleted>(UserStoryActionTypes.ArchiveSubTaskUserStoryCompleted),
    pipe(
      map(
        () =>
          new SnackbarOpen({
            message: this.toastrMessage, // TODO: Change to proper toast message
            action: this.translateService.instant(ConstantVariables.success)
          })
      )
    )
  );

  @Effect()
  updateUserStoryGoalSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateUserStoryGoalCompleted>(UserStoryActionTypes.UpdateUserStoryGoalCompleted),
    pipe(
      map(
        () =>
          new SnackbarOpen({
            message: this.toastrMessage, // TODO: Change to proper toast message
            action: this.translateService.instant(ConstantVariables.success)
          })
      )
    )
  );

  @Effect()
  upsertParkUserStorySuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<ParkUserStoryCompleted>(UserStoryActionTypes.ParkUserStoryCompleted),
    pipe(
      map(
        () =>
          new SnackbarOpen({
            message: this.toastrMessage, // TODO: Change to proper toast message
            action: this.translateService.instant(ConstantVariables.success)
          })
      )
    )
  );

  @Effect()
  upsertParkUniqueUserStorySuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<ParkUniqueUserStoryCompleted>(UserStoryActionTypes.ParkUniqueUserStoryCompleted),
    pipe(
      map(
        () =>
          new SnackbarOpen({
            message: this.toastrMessage, // TODO: Change to proper toast message
            action: this.translateService.instant(ConstantVariables.success)
          })
      )
    )
  );


  @Effect()
  upsertParkSubTaskUserStorySuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<ParkSubTaskUserStoryCompleted>(UserStoryActionTypes.ParkSubTaskUserStoryCompleted),
    pipe(
      map(
        () =>
          new SnackbarOpen({
            message: this.toastrMessage, // TODO: Change to proper toast message
            action: this.translateService.instant(ConstantVariables.success)
          })
      )
    )
  );

  @Effect()
  showValidationMessages$: Observable<Action> = this.actions$.pipe(
    ofType<CreateUserStoryFailed>(UserStoryActionTypes.CreateUserStoryFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForArchiveUserStory$: Observable<Action> = this.actions$.pipe(
    ofType<ArchiveUserStoryFailed>(UserStoryActionTypes.ArchiveUserStoryFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForArchiveUniqueUserStory$: Observable<Action> = this.actions$.pipe(
    ofType<ArchiveUniqueUserStoryFailed>(UserStoryActionTypes.ArchiveUniqueUserStoryFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForParkUniqueUserStory$: Observable<Action> = this.actions$.pipe(
    ofType<ArchiveSubTaskUserStoryFailed>(UserStoryActionTypes.ArchiveSubTaskUserStoryFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForUpdateUserStoryGoal$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateUserStoryGoaalFailed>(UserStoryActionTypes.UpdateUserStoryGoaalFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForParkUserStory$: Observable<Action> = this.actions$.pipe(
    ofType<ParkUserStoryFailed>(UserStoryActionTypes.ParkUserStoryFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForParkSubTaskUserStory$: Observable<Action> = this.actions$.pipe(
    ofType<ParkSubTaskUserStoryFailed>(UserStoryActionTypes.ParkSubTaskUserStoryFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForUserStoryTags$: Observable<Action> = this.actions$.pipe(
    ofType<UpsertUserStoryTagsFailed>(UserStoryActionTypes.UpsertUserStoryTagsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForMultipleUserStoriesSpilt$: Observable<Action> = this.actions$.pipe(
    ofType<CreateMultipleUserStoriesSplitFailed>(UserStoryActionTypes.CreateMultipleUserStoriesSplitFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForMultipleUserStories$: Observable<Action> = this.actions$.pipe(
    ofType<CreateMultipleUserStoriesFailed>(UserStoryActionTypes.CreateMultipleUserStoriesFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );


  @Effect()
  showValidationMessagesForUserStoriesSearch$: Observable<Action> = this.actions$.pipe(
    ofType<SearchUserStoriesFailed>(UserStoryActionTypes.SearchUserStoriesFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForUserStoryReplan$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<InsertUserStoryReplanFailed>(
      UserStoryActionTypes.InsertUserStoryReplanFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  SearchUserStoriesError$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<UserStoryExceptionHandled>(
      UserStoryActionTypes.SearchUserStoriesError
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  reOrderUserStoriesError$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ReOrderUserStoriesFailed>(
      UserStoryActionTypes.ReOrderUserStoriesFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  subTasksUserStoriesError$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<GetUserStorySubTasksFailed>(
      UserStoryActionTypes.GetUserStorySubTasksFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  amendDeadlineError$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<AmendUserStoryDeadlineFailed>(
      UserStoryActionTypes.AmendUserStoriesDeadlineFailed
    ),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  UserStoryExceptionHandled$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<UserStoryExceptionHandled>(
      UserStoryActionTypes.UserStoryExceptionHandled
    ),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  convertJSONToUserStory(userStory) {
    userStory.subUserStoriesList = [];
    if (userStory.subUserStories) {
      let featuresListJson = JSON.parse(userStory.subUserStories);
      userStory.subUserStoriesList = featuresListJson.ChildUserStories;
    }
    else {
      userStory.subUserStoriesList = [];
    }
    return userStory;
  }

  convertJSONToUserStories(userStories) {
    userStories.forEach(userStory => {
      userStory.subUserStoriesList = [];
      if (userStory.subUserStories) {
        var subLists = [];
        let featuresListJson = JSON.parse(userStory.subUserStories);
        var subUserStoriesList = featuresListJson.ChildUserStories;
        subUserStoriesList.forEach((userStory) => {
          var userStoryModel = new UserStory();
          userStoryModel = userStory;
          subLists.push(userStoryModel);
        })
        userStory.subUserStoriesList = subLists;
      }
      else {
        userStory.subUserStoriesList = [];
      }
    })
    return userStories;
  }

  convertUserStoriesToJson(userStories) {
    this.userStoryUpdates = [];
    userStories.forEach(element => {
      var userStoryUpdatesModel = new userStoryUpdates();
      userStoryUpdatesModel.id = element.userStoryId;
      userStoryUpdatesModel.changes = element;
      this.userStoryUpdates.push(userStoryUpdatesModel);
    });
    return this.userStoryUpdates;
  }

  constructor(
    private actions$: Actions,
    private projectGoalsService: ProjectGoalsService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private cookieService: CookieService
  ) { }
}
