import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action, Store, select } from "@ngrx/store";
import { Observable, of, pipe } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { ProjectGoalsService } from "./../../services/goals.service";
import {
  GoalActionTypes, Search, SearchComplete,
  CreateGoalTriggered,
  CreateGoalCompleted,
  CreateGoalFailed,
  GoalExceptionHandled,
  ArchiveGoalTriggered,
  ArchiveGoalCompleted,
  ArchiveGoalFailed,
  ParkGoalTriggered,
  ParkGoalCompleted,
  ParkGoalFailed,
  GetGoalByIdTriggered,
  GetGoalByIdFailed,
  GetGoalByIdCompleted,
  UpdateGoalList,
  SearchFailed,
  SearchAllGoals,
  ApproveGoalCompleted,
  ReplanGoalCompleted,
  GetGoalDetailsByMultipleGoalIdsTriggered,
  GetGoalDetailsByMultipleGoalIdsCompleted,
  GetGoalDetailsByMultipleGoalIdsFailed,
  RefreshGoalsList,
  GetUniqueGoalByIdTriggered,
  GetUniqueGoalByIdCompleted,
  GetUniqueGoalByIdFailed,
  GetUniqueGoalByUniqueIdTriggered,
  CreateUniqueGoalCompleted,
  CreateUniqueGoalTriggered,
  CreateUniqueGoalFailed,
  ArchiveUnArchiveGoalCompleted,
  UpsertGoalTagsTriggered,
  UpsertGoalTagsCompleted,
  UpsertGoalTagsFailed,
  GetGoalDetailsByMultipleGoalIdsForBugsTriggered,
  GetGoalDetailsByMultipleGoalIdsForBugsCompleted,
  SearchTagsTriggered,
  SearchTagsCompleted,
  SearchTagsFailed,
  CreateActiveGoalTriggered,
  GetAllGoalByIdTriggered
} from "../actions/goal.actions";
import { GoalSearchCriteriaApiInputModel } from "../../models/goalSearchInput";
import { SnackbarOpen } from "../actions/snackbar.actions";
import { ShowExceptionMessages, ShowValidationMessages } from "../actions/notification-validator.action";
import { TranslateService } from "@ngx-translate/core";
import { GoalModel } from "../../models/GoalModel";
import { GoalSearchCriteriaInputModel } from "../../models/GoalSearchCriteriaInputModel";
import { ProjectSummaryTriggered } from "../actions/project-summary.action";
import { State } from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";
import { goalUpdates } from "../../models/goalUpdates";
import { LoadMemberProjectsTriggered } from "../actions/project-members.actions";
import { LoadFeatureProjectsTriggered } from "../actions/project-features.actions";
import { ProjectFeature } from "../../models/projectFeature";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';

@Injectable()
export class GoalEffects {
  toastrMessage: string;
  goalModel: GoalSearchCriteriaApiInputModel;
  goalsList: GoalModel[];
  goal: GoalModel;
  isGoalEdit: boolean;
  isMovingToAnotherProject: boolean;
  goalId: string;
  projectId: string;
  multipleGoalIds: string;
  goal$: Observable<GoalModel[]>;
  goalUpdates: goalUpdates[] = [];
  isNewGoal: boolean;
  isGoalTags: boolean;
  isFromUniquePage: boolean;
  isActiveGoal: boolean;

  @Effect()
  goalsSearch$: Observable<Action> = this.actions$.pipe(
    ofType<Search>(GoalActionTypes.Search),
    switchMap((searchAction) => {
      this.goalModel = searchAction.goalSearchResult;
      return this.projectGoalsService
        .searchGoals(searchAction.goalSearchResult)
        .pipe(
          map((goals: any) => {
            if (goals.success) {
              this.isMovingToAnotherProject = false;
              return new SearchComplete(goals.data)
            } else {
              return new SearchFailed(goals.apiResponseMessages)
            }
          }),
          catchError((err) => {
            return of(new GoalExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  searchAllGoals$: Observable<Action> = this.actions$.pipe(
    ofType<SearchAllGoals>(GoalActionTypes.SearchAllGoals),
    switchMap((searchAction) => {
      this.goalModel = searchAction.goalSearchResult;

      return this.projectGoalsService
        .searchAllGoals(searchAction.goalSearchResult)
        .pipe(
          map((goals: any) => {
            if (goals.success) {
              // this.goalsList = this.convertJSONToGoals(goals.data);
              return new SearchComplete(goals.data)
            } else {
              return new SearchFailed(goals.apiResponseMessages)
            }
          }),
          catchError((err) => {
            return of(new GoalExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  archiveGoal$: Observable<Action> = this.actions$.pipe(
    ofType<ArchiveGoalTriggered>(GoalActionTypes.ArchiveGoalTriggered),
    switchMap((goalTriggeredAction) => {
      this.projectId = goalTriggeredAction.archivedGoalModel.projectId;
      this.multipleGoalIds = goalTriggeredAction.archivedGoalModel.multipleGoalIds;
      this.goalId = goalTriggeredAction.archivedGoalModel.goalId;
      this.isFromUniquePage = goalTriggeredAction.archivedGoalModel.isUniquePage;
      if (goalTriggeredAction.archivedGoalModel.archive) {
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForGoalArchive);
      } else {
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForGoalUnArchive);
      }
      return this.projectGoalsService
        .archiveGoal(goalTriggeredAction.archivedGoalModel)
        .pipe(
          map((result: any) => {
            if (result.success === true) {
              return new ArchiveGoalCompleted(goalTriggeredAction.archivedGoalModel.goalId);
            } else {
              return new ArchiveGoalFailed(result.apiResponseMessages);
            }
          }),
          catchError((err) => {
            return of(new GoalExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  parkGoal$: Observable<Action> = this.actions$.pipe(
    ofType<ParkGoalTriggered>(GoalActionTypes.ParkGoalTriggered),
    switchMap((goalTriggeredAction) => {
      this.projectId = goalTriggeredAction.parkGoalModel.projectId;
      this.isFromUniquePage = goalTriggeredAction.parkGoalModel.isUniquePage;
      this.goalId = goalTriggeredAction.parkGoalModel.goalId;
      if (goalTriggeredAction.parkGoalModel.park) {
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForGoalPark);
      } else {
        this.toastrMessage = this.translateService.instant(ConstantVariables.SuccessMessageForGoalResume);
      }
      return this.projectGoalsService
        .parkGoal(goalTriggeredAction.parkGoalModel)
        .pipe(
          map((result: any) => {
            if (result.success === true) {
              return new ParkGoalCompleted(goalTriggeredAction.parkGoalModel.goalId);
            } else {
              return new ParkGoalFailed(result.apiResponseMessages);
            }
          }),
          catchError((err) => {
            return of(new GoalExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  getGoalById$: Observable<Action> = this.actions$.pipe(
    ofType<GetGoalByIdTriggered>(GoalActionTypes.GetGoalByIdTriggered),
    switchMap((goalTriggeredAction) => {

      return this.projectGoalsService
        .getGoalById(goalTriggeredAction.goalId, false)
        .pipe(
          map((result: any) => {
            if (result.success === true) {
              let goalDetails;
              if (this.isGoalEdit || this.isGoalTags) {
                this.goal$ = this.store.pipe(
                  select(projectModuleReducer.getGoalDetailsByGoalId, { goalId: goalTriggeredAction.goalId })
                );
                let goal;
                this.goal$.subscribe((x) => goal = x);
                goalDetails = result.data;
                if (goal != null && goal != undefined && goal.length > 0) {
                  goalDetails.updatedDateTime = goal[0].updatedDateTime;
                }
                this.goal = goalDetails;
              } else {
                if (!this.isNewGoal) {
                  localStorage.setItem('goalDetails', 'true');
                }
                this.goal = result.data;
              }
              if (this.isGoalTags) {
                localStorage.setItem('goalDetails', 'true');
              }
              return new GetGoalByIdCompleted(this.goal);
            } else {
              return new GetGoalByIdFailed(result.apiResponseMessages);
            }
          }),
          catchError((err) => {
            return of(new GoalExceptionHandled(err));
          })
        );
    })
  );

  
  @Effect()
  getAllUniqueGoalById$: Observable<Action> = this.actions$.pipe(
    ofType<GetAllGoalByIdTriggered>(GoalActionTypes.GetAllGoalByIdTriggered),
    switchMap((goalTriggeredAction) => {
      this.goalModel.goalId = goalTriggeredAction.goalId;
      return this.projectGoalsService
        .searchAllGoals(this.goalModel)
        .pipe(
          map((result: any) => {
            if (result.success === true) {
              const goalsList = this.convertGoalsToJson(result.data);
              localStorage.setItem("goalDetails", "true");
              return new GetGoalDetailsByMultipleGoalIdsCompleted({
                goalUpdateMultiple: goalsList
              });
            } else {
              return new GetGoalByIdFailed(result.apiResponseMessages);
            }
          }),
          catchError((err) => {
            return of(new GoalExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  getUniqueGoalById$: Observable<Action> = this.actions$.pipe(
    ofType<GetUniqueGoalByIdTriggered>(GoalActionTypes.GetUniqueGoalByIdTriggered),
    switchMap((goalTriggeredAction) => {

      return this.projectGoalsService
        .getGoalById(goalTriggeredAction.goalId, false)
        .pipe(
          map((result: any) => {
            if (result.success === true) {
              this.projectId = result.data.projectId;
              return new GetUniqueGoalByIdCompleted(result.data);
            } else {
              return new GetUniqueGoalByIdFailed(result.apiResponseMessages);
            }
          }),
          catchError((err) => {
            return of(new GoalExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  getUniqueGoalByUniqueId$: Observable<Action> = this.actions$.pipe(
    ofType<GetUniqueGoalByUniqueIdTriggered>(GoalActionTypes.GetUniqueGoalByUniqueIdTriggered),
    switchMap((goalTriggeredAction) => {

      return this.projectGoalsService
        .getGoalById(goalTriggeredAction.goalId, true)
        .pipe(
          map((result: any) => {
            if (result.success === true) {
              this.projectId = result.data.projectId;
              return new GetUniqueGoalByIdCompleted(result.data);
            } else {
              return new GetUniqueGoalByIdFailed(result.apiResponseMessages);
            }
          }),
          catchError((err) => {
            return of(new GoalExceptionHandled(err));
          })
        );
    })
  );


  @Effect()
  loadProjectMembersAfterUniqueGoalCompleted$: Observable<Action> = this.actions$.pipe(
    ofType<GetUniqueGoalByIdCompleted>(GoalActionTypes.GetUniqueGoalByIdCompleted),
    pipe(
      map(() => {
        return new LoadMemberProjectsTriggered(this.projectId);
      })
    )
  );

  @Effect()
  loadFeatureProjectsAfterUniqueGoalCompleted$: Observable<Action> = this.actions$.pipe(
    ofType<GetUniqueGoalByIdCompleted>(GoalActionTypes.GetUniqueGoalByIdCompleted),
    pipe(
      map(() => {
        const projectFeature = new ProjectFeature();
        projectFeature.projectId = this.projectId;
        projectFeature.IsDelete = false;
        return new LoadFeatureProjectsTriggered(projectFeature);
      })
    )
  );

  @Effect()
  upsertUniqueGoal$: Observable<Action> = this.actions$.pipe(
    ofType<CreateUniqueGoalTriggered>(GoalActionTypes.CreateUniqueGoalTriggered),
    switchMap((goalTriggeredAction) => {
      this.isNewGoal = false;
      this.isGoalEdit = true;
      this.goalId = goalTriggeredAction.goal.goalId;
      this.toastrMessage =
        goalTriggeredAction.goal.goalName + " " + this.translateService.instant(ConstantVariables.SuccessMessageForGoalEdit);

      this.goal = goalTriggeredAction.goal;
      return this.projectGoalsService
        .UpsertGoals(goalTriggeredAction.goal)
        .pipe(
          map((goalId: any) => {
            if (goalId.success === true) {
              this.goalId = goalId.data;
              return new CreateUniqueGoalCompleted(goalId);
            } else {
              return new CreateUniqueGoalFailed(goalId.apiResponseMessages);
            }
          }),
          catchError((err) => {
            return of(new GoalExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  upsertGoal$: Observable<Action> = this.actions$.pipe(
    ofType<CreateGoalTriggered>(GoalActionTypes.CreateGoalTriggered),
    switchMap((goalTriggeredAction) => {
      this.isGoalTags = false;
      this.isActiveGoal = false;
      if (
        goalTriggeredAction.goal.goalId === undefined ||
        goalTriggeredAction.goal.goalId === null ||
        goalTriggeredAction.goal.goalId === ""
      ) {
        this.isNewGoal = true;
        this.toastrMessage =
          goalTriggeredAction.goal.goalName + " " + this.translateService.instant(ConstantVariables.SuccessMessageForGoal);
      } else if (
        goalTriggeredAction.goal.goalId !== undefined &&
        goalTriggeredAction.goal.isApproved === true &&
        goalTriggeredAction.goal.goalStatusId !==
        ConstantVariables.ActiveGoalStatusId.toLowerCase()
      ) {
        this.toastrMessage =  

        
          goalTriggeredAction.goal.goalName +
          " " +
          this.translateService.instant(ConstantVariables.SuccessMessageForGoalApproved);
      } else if (
        goalTriggeredAction.goal.goalId !== undefined &&
        goalTriggeredAction.goal.isLocked === false
      ) {
        this.toastrMessage =
          goalTriggeredAction.goal.goalName +
          " " +
          this.translateService.instant(ConstantVariables.SuccessMessageForGoalReplan);
      } else {
        this.isNewGoal = false;
        this.isGoalEdit = true;
        this.goalId = goalTriggeredAction.goal.goalId;
        this.toastrMessage =
          goalTriggeredAction.goal.goalName + " " + this.translateService.instant(ConstantVariables.SuccessMessageForGoalEdit);
      }
      this.goal = goalTriggeredAction.goal;
      this.isMovingToAnotherProject = goalTriggeredAction.goal.isMovingToAnotherProject;
      return this.projectGoalsService
        .UpsertGoals(goalTriggeredAction.goal)
        .pipe(
          map((goalId: any) => {
            if (goalId.success === true) {
              if (goalTriggeredAction.goal.isApproved && !goalTriggeredAction.goal.isEdit) {
                this.isNewGoal = false;
                return new ApproveGoalCompleted();
              } else if (goalTriggeredAction.goal.goalId !== undefined &&
                goalTriggeredAction.goal.isLocked === false && !goalTriggeredAction.goal.isEdit) {
                this.isNewGoal = false;
                return new ReplanGoalCompleted();
              } else {
                if (!this.isNewGoal) {
                  localStorage.setItem("goalEdit", "true");
                }
                this.goalId = goalId.data;
                return new CreateGoalCompleted(goalId);
              }
            } else {
              return new CreateGoalFailed(goalId.apiResponseMessages);
            }
          }),
          catchError((err) => {
            return of(new GoalExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  upsertActiveGoal$: Observable<Action> = this.actions$.pipe(
    ofType<CreateActiveGoalTriggered>(GoalActionTypes.CreateActiveGoalTriggered),
    switchMap((goalTriggeredAction) => {
        this.isActiveGoal = true;
        this.projectId = goalTriggeredAction.goal.projectId
        this.toastrMessage =
          goalTriggeredAction.goal.goalName + " " + this.translateService.instant(ConstantVariables.SuccessMessageForGoal);
      return this.projectGoalsService
        .UpsertGoals(goalTriggeredAction.goal)
        .pipe(
          map((goalId: any) => {
            if (goalId.success === true) {
                this.goalId = goalId.data;
                return new CreateGoalCompleted(goalId);
            } else {
              return new CreateGoalFailed(goalId.apiResponseMessages);
            }
          }),
          catchError((err) => {
            return of(new GoalExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  upsertGoalSuccessfulAndLoadGoals$: Observable<Action> = this.actions$.pipe(
    ofType<CreateGoalCompleted>(GoalActionTypes.CreateGoalCompleted),
    pipe(
      map(() => {
        if (!this.isMovingToAnotherProject && !this.isActiveGoal) {
          return new GetGoalByIdTriggered(this.goalId);
        } else {
          return new Search(this.goalModel);
        }
      })
    )
  );

  @Effect()
  upsertUniqueGoalSuccessfulAndLoadGoals$: Observable<Action> = this.actions$.pipe(
    ofType<CreateUniqueGoalCompleted>(GoalActionTypes.CreateUniqueGoalCompleted),
    pipe(
      map(() => {
        if (!this.isMovingToAnotherProject) {
          return new GetUniqueGoalByIdTriggered(this.goalId);
        } else {
          return new Search(this.goalModel);
        }
      })
    )
  );

  @Effect()
  upsertGoalTags$: Observable<Action> = this.actions$.pipe(
    ofType<UpsertGoalTagsTriggered>(GoalActionTypes.UpsertGoalTagsTriggered),
    switchMap((goalTriggeredAction) => {
      this.isGoalTags = true;
      if (goalTriggeredAction.goalTagsUpsertModel.tags) {
        this.toastrMessage = this.translateService.instant("GOALS.TAGSADDEDSUCCESSFULLY")
      } else {
        this.toastrMessage = this.translateService.instant("GOALS.TAGSDELETEDSUCCESSFULLY")
      }
      return this.projectGoalsService
        .upsertGoalTags(goalTriggeredAction.goalTagsUpsertModel)
        .pipe(
          map((result: any) => {
            if (result.success === true) {

              this.goalId = goalTriggeredAction.goalTagsUpsertModel.goalId;
              return new UpsertGoalTagsCompleted(result.data);
            } else {
              return new UpsertGoalTagsFailed(result.apiResponseMessages);
            }
          }),
          catchError((err) => {
            return of(new GoalExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  upsertGoalTagsSuccessfulAndLoadGoals$: Observable<Action> = this.actions$.pipe(
    ofType<UpsertGoalTagsCompleted>(GoalActionTypes.UpsertGoalTagsCompleted),
    pipe(
      map(() => {
        return new GetGoalByIdTriggered(this.goalId);
      })
    )
  );



  @Effect()
  UpdateGoalChanges$: Observable<Action> = this.actions$.pipe(
    ofType<GetGoalByIdCompleted>(GoalActionTypes.GetGoalByIdCompleted),
    pipe(
      map(() => {
        const goalDetails$ = this.store.pipe(select(projectModuleReducer.getGoalDetailsByGoalId, { goalId: this.goal.goalId }));
        let subscribedResults = [];
        goalDetails$.subscribe((x) => subscribedResults = x);
        if (subscribedResults.length === 0) {
          this.isNewGoal = true;
        }
        if (!this.isNewGoal) {
          this.isGoalEdit = false;
          return new UpdateGoalList({
            goalUpdate: {
              id: this.goal.goalId,
              changes: this.goal
            }
          });
        
        }else {
          this.isNewGoal = false;
          return new RefreshGoalsList(this.goal);
        }
      })
    )
  );

  @Effect()
  UpdateGoalChangesandCountIncrease$: Observable<Action> = this.actions$.pipe(
    ofType<GetGoalByIdCompleted>(GoalActionTypes.GetGoalByIdCompleted),
    pipe(
      map(() => {
        if (localStorage.getItem("isFeedback")) {
          localStorage.removeItem("isFeedback");
          return new ProjectSummaryTriggered(this.projectId);
        } else {
          return new ArchiveUnArchiveGoalCompleted();
        }
      })
    )
  );

  @Effect()
  getGoalDetailsByMultipleGoalIds$: Observable<Action> = this.actions$.pipe(
    ofType<GetGoalDetailsByMultipleGoalIdsTriggered>(GoalActionTypes.GetGoalDetailsByMultipleGoalIdsTriggered),
    switchMap((goalTriggeredAction) => {
      const goalSearchCriteria = new GoalSearchCriteriaInputModel();
      goalSearchCriteria.goalIds = goalTriggeredAction.goalIds;
      return this.projectGoalsService
        .searchGoals(goalSearchCriteria)
        .pipe(
          map((result: any) => {
            if (result.success === true) {
              const goalsList = this.convertGoalsToJson(result.data);
              localStorage.setItem("goalDetails", "true");
              return new GetGoalDetailsByMultipleGoalIdsCompleted({
                goalUpdateMultiple: goalsList
              });
            } else {
              return new GetGoalDetailsByMultipleGoalIdsFailed(result.apiResponseMessages);
            }
          }),
          catchError((err) => {
            return of(new GoalExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  getGoalDetailsByMultipleGoalIdsDone$: Observable<Action> = this.actions$.pipe(
    ofType<GetGoalDetailsByMultipleGoalIdsForBugsTriggered>(GoalActionTypes.GetGoalDetailsByMultipleGoalIdsForBugsTriggered),
    switchMap((goalTriggeredAction) => {
      const goalSearchCriteria = new GoalSearchCriteriaInputModel();
      goalSearchCriteria.goalIds = goalTriggeredAction.goalIds;
      return this.projectGoalsService
        .searchGoals(goalSearchCriteria)
        .pipe(
          map((result: any) => {
            if (result.success === true) {
              const goalsList = this.convertGoalsToJson(result.data);
              localStorage.setItem("goalDetails", "true");
              return new GetGoalDetailsByMultipleGoalIdsForBugsCompleted({
                goalUpdateMultiple: goalsList
              });
            } else {
              return new GetGoalDetailsByMultipleGoalIdsFailed(result.apiResponseMessages);
            }
          }),
          catchError((err) => {
            return of(new GoalExceptionHandled(err));
          })
        );
    })
  );

  @Effect()
  archiveGoalChanges$: Observable<Action> = this.actions$.pipe(
    ofType<ArchiveGoalCompleted>(GoalActionTypes.ArchiveGoalCompleted),
    pipe(
      map(() => {

        return new ProjectSummaryTriggered(this.projectId);

      })
    )
  );

  @Effect()
  archiveGoalChanged$: Observable<Action> = this.actions$.pipe(
    ofType<ArchiveGoalCompleted>(GoalActionTypes.ArchiveGoalCompleted),
    pipe(
      map(() => {
        if (this.isFromUniquePage) {
          return new GetGoalByIdTriggered(this.goalId);
        }
        else if (this.multipleGoalIds !== null) {
          return new GetGoalDetailsByMultipleGoalIdsTriggered(this.multipleGoalIds);
        } else {
          return new ArchiveUnArchiveGoalCompleted();
        }
      })
    )
  );

  @Effect()
  parkGoalChanges$: Observable<Action> = this.actions$.pipe(
    ofType<ParkGoalCompleted>(GoalActionTypes.ParkGoalCompleted),
    pipe(
      map(() => {
        return new ProjectSummaryTriggered(this.projectId);
      })
    )
  );

  @Effect()
  parkGoalbyIdChanges$: Observable<Action> = this.actions$.pipe(
    ofType<ParkGoalCompleted>(GoalActionTypes.ParkGoalCompleted),
    pipe(
      map(() => {
        if (this.isFromUniquePage) {
          return new GetGoalByIdTriggered(this.goalId);
        }
        else {
          return new ArchiveUnArchiveGoalCompleted();
        }
      })
    )
  );

  @Effect()
  searchCustomTags$: Observable<Action> = this.actions$.pipe(
    ofType<SearchTagsTriggered>(GoalActionTypes.SearchTagsTriggered),
    switchMap((goalTriggeredAction) => {
      return this.projectGoalsService
        .searchCustomTags(goalTriggeredAction.searchText)
        .pipe(
          map((result: any) => {
            if (result.success === true) {
              return new SearchTagsCompleted(result.data);
            } else {
              return new SearchTagsFailed(result.apiResponseMessages);
            }
          }),
          catchError((err) => {
            return of(new GoalExceptionHandled(err));
          })
        );
    })
  );


  @Effect()
  upsertGoalSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<CreateGoalCompleted>(GoalActionTypes.CreateGoalCompleted),
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
    ofType<UpsertGoalTagsCompleted>(GoalActionTypes.UpsertGoalTagsCompleted),
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
  showValidationMessagesForUpsertGoal$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<CreateGoalFailed>(
      GoalActionTypes.CreateGoalFailed
    ),
    switchMap((searchAction) => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForUpsertUniqueGoal$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<CreateUniqueGoalFailed>(
      GoalActionTypes.CreateUniqueGoalFailed
    ),
    switchMap((searchAction) => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForMultipleGoalFailed$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<GetGoalDetailsByMultipleGoalIdsFailed>(
      GoalActionTypes.GetGoalDetailsByMultipleGoalIdsFailed
    ),
    switchMap((searchAction) => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForArchiveGoal$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ArchiveGoalFailed>(
      GoalActionTypes.ArchiveGoalFailed
    ),
    switchMap((searchAction) => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForUpsertGoalTags$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<UpsertGoalTagsFailed>(
      GoalActionTypes.UpsertGoalTagsFailed
    ),
    switchMap((searchAction) => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForParkGoal$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<ParkGoalFailed>(
      GoalActionTypes.ParkGoalFailed
    ),
    switchMap((searchAction) => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForLoadingGoal$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<SearchFailed>(
      GoalActionTypes.SearchFailed
    ),
    switchMap((searchAction) => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages
      })
      )
    })
  );

  @Effect()
  searchTagsFailed$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<SearchTagsFailed>(
      GoalActionTypes.SearchTagsFailed
    ),
    switchMap((searchAction) => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages
      })
      )
    })
  );

  @Effect()
  upsertArchiveGoalSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<ArchiveGoalCompleted>(GoalActionTypes.ArchiveGoalCompleted),
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
  upsertParkGoalSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<ParkGoalCompleted>(GoalActionTypes.ParkGoalCompleted),
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
  searchError$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<GoalExceptionHandled>(
      GoalActionTypes.SearchError
    ),
    switchMap((searchAction) => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage // TODO: Change to proper toast message
      })
      )
    })
  );

  @Effect()
  GoalExceptionHandled$: Observable<
    Action
  > = this.actions$.pipe(
    ofType<GoalExceptionHandled>(
      GoalActionTypes.GoalExceptionHandled
    ),
    switchMap((searchAction) => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage // TODO: Change to proper toast message
      })
      )
    })
  );

  convertJSONToGoals(goalsList) {
    goalsList.forEach((goal) => {
      goal.entityFeaturesList = [];
      const featuresListJson = JSON.parse(goal.entityFeaturesXml);
      goal.entityFeaturesList.push(featuresListJson);
    })

    return goalsList;
  }

  convertGoalsToJson(goalsList) {
    this.goalUpdates = [];
    goalsList.forEach((element) => {
        const goalUpdatesModel = new goalUpdates();
        goalUpdatesModel.id = element.goalId;
        goalUpdatesModel.changes = element;
        this.goalUpdates.push(goalUpdatesModel);
    });
    return this.goalUpdates;
  }

  convertJSONToGoal(goal) {
    goal.entityFeaturesList = [];
    const featuresListJson = JSON.parse(goal.entityFeaturesXml);
    goal.entityFeaturesList.push(featuresListJson);
    return goal;
  }

  constructor(
    private actions$: Actions,
    private projectGoalsService: ProjectGoalsService,
    private translateService: TranslateService,
    private store: Store<State>
  ) { }
}
