import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { ValidationModel } from "../../models/validation-messages";
import { GoalModel } from "../../models/GoalModel";
import { GoalActionsUnion, GoalActionTypes } from "../actions/goal.actions";
import { CustomTagsModel } from "../../models/custom-tags-model";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<GoalModel> {
  selectedGoalId: string | null;
  creatingGoal: boolean | false;
  createGoalErrors: ValidationModel[];
  creatingUniqueGoal: boolean | false;
  createUniqueGoalErrors: ValidationModel[];
  loadingGoals: boolean | false;
  exceptionMessage: string;
  loadingProjectStatus: boolean;
  archivingGoal: boolean | false;
  parkingGoal: boolean | false;
  archiveGoalErrors: ValidationModel[];
  parkingGoalErrors: ValidationModel[];
  goal: GoalModel;
  getGoalByIdLoading: boolean;
  getUniqueGoalByIdLoading: boolean;
  loadingGoalTags: boolean;
  customTagsModel: CustomTagsModel[];
  loadingSearchTags: boolean;
}

export const adapter: EntityAdapter<GoalModel> = createEntityAdapter<GoalModel>(
  {
    selectId: (goal: GoalModel) => goal.goalId,
    sortComparer: (goalSortAsc: GoalModel, goalSortDesc: GoalModel) =>
      goalSortDesc.createdDateTime.localeCompare(goalSortAsc.createdDateTime)
  }
);

export function sortByGoals(goalSortAsc: GoalModel, goalSortDesc: GoalModel): any {
  const goalSort = localStorage.getItem("allgoals");
  if (goalSort === "true") {
    return false;
  } else {
    if (!goalSortDesc.updatedDateTime) {
      return goalSortDesc.createdDateTime - goalSortAsc.createdDateTime
    } else {
      return goalSortDesc.updatedDateTime - goalSortAsc.updatedDateTime
    }
  }
}

export const initialState: State = adapter.getInitialState({
  selectedGoalId: null,
  creatingGoal: false,
  createGoalErrors: [],
  creatingUniqueGoal: false,
  createUniqueGoalErrors: [],
  loadingGoals: true,
  exceptionMessage: "",
  loadingProjectStatus: false,
  projectViewModel: null,
  archivingGoal: false,
  parkingGoal: false,
  archiveGoalErrors: [],
  parkingGoalErrors: [],
  goal: null,
  getGoalByIdLoading: false,
  getUniqueGoalByIdLoading: false,
  loadingGoalTags: false,
  customTagsModel: [],
  loadingSearchTags: false
});

export function reducer(state = initialState, action: GoalActionsUnion): State {
  switch (action.type) {
    case GoalActionTypes.SearchComplete:
      return adapter.addMany(action.goalResult, {
        ...state,
        loadingGoals: false
      });

    case GoalActionTypes.Search: {
      return initialState;
    }
    case GoalActionTypes.SearchAllGoals: {
      return initialState;
    }

    case GoalActionTypes.Load: {
      return initialState;
    }

    case GoalActionTypes.Select: {
      return {
        ...state,
        selectedGoalId: action.goalId
      };
    }
    case GoalActionTypes.CreateGoalTriggered:
      return { ...state, creatingGoal: true };
    case GoalActionTypes.CreateGoalCompleted:
      return { ...state, creatingGoal: false };
    case GoalActionTypes.CreateUniqueGoalTriggered:
      return { ...state, creatingUniqueGoal: true };
    case GoalActionTypes.CreateUniqueGoalCompleted:
      return { ...state, creatingUniqueGoal: false };
    case GoalActionTypes.ApproveGoalCompleted:
      return { ...state, creatingGoal: false };
    case GoalActionTypes.ReplanGoalCompleted:
      return { ...state, creatingGoal: false };
    case GoalActionTypes.CreateGoalFailed:
      return {
        ...state,
        creatingGoal: false,
        createGoalErrors: action.validationMessages
      };
    case GoalActionTypes.CreateUniqueGoalFailed:
      return {
        ...state,
        creatingUniqueGoal: false,
        createUniqueGoalErrors: action.validationMessages
      };
    case GoalActionTypes.ExceptionHandled:
      return {
        ...state,
        exceptionMessage: action.errorMessage,
        creatingGoal: false,
        loadingGoals: false
      };

    case GoalActionTypes.ArchiveGoalTriggered:
      return { ...state, archivingGoal: true };
    case GoalActionTypes.ArchiveGoalCompleted:
      state = adapter.removeOne(action.goalId, state);
      return { ...state, archivingGoal: false };
    case GoalActionTypes.ArchiveGoalFailed:
      return {
        ...state,
        archivingGoal: false,
        archiveGoalErrors: action.validationMessages
      };
    case GoalActionTypes.ParkGoalTriggered:
      return { ...state, parkingGoal: true };
    case GoalActionTypes.ParkGoalCompleted:
      state = adapter.removeOne(action.goalId, state);
      return { ...state, parkingGoal: false };
    case GoalActionTypes.GetGoalByIdTriggered:
      return { ...state, getGoalByIdLoading: true };
    case GoalActionTypes.GetGoalByIdCompleted:
      return { ...state, getGoalByIdLoading: false, goal: action.goal };
    case GoalActionTypes.GetUniqueGoalByIdTriggered:
      return { ...state, getUniqueGoalByIdLoading: true };
    case GoalActionTypes.GetUniqueGoalByIdCompleted:
      return { ...state, getUniqueGoalByIdLoading: false, goal: action.goal };
    case GoalActionTypes.RefreshGoalsList:
      return adapter.upsertOne(action.goal, state);
    case GoalActionTypes.UpdateGoalList:
      return adapter.updateOne(action.goalUpdates.goalUpdate, state);
    case GoalActionTypes.GetGoalDetailsByMultipleGoalIdsCompleted:
      return adapter.updateMany(action.goalUpdatesMultiple.goalUpdateMultiple, state);
    case GoalActionTypes.GetGoalDetailsByMultipleGoalIdsForBugsCompleted:
      return adapter.updateMany(action.goalUpdatesMultiple.goalUpdateMultiple, state);
    case GoalActionTypes.ParkGoalFailed:
      return {
        ...state,
        parkingGoal: false,
        parkingGoalErrors: action.validationMessages
      };
    case GoalActionTypes.UpsertGoalTagsTriggered:
      return { ...state, loadingGoalTags: true };
    case GoalActionTypes.UpsertGoalTagsCompleted:
      return { ...state, loadingGoalTags: false };
    case GoalActionTypes.UpsertGoalTagsFailed:
      return { ...state, loadingGoalTags: false };
    case GoalActionTypes.SearchTagsTriggered:
      return { ...state,  loadingSearchTags: true };
    case GoalActionTypes.SearchTagsCompleted:
      return { ...state,  loadingSearchTags: false ,customTagsModel: action.customTagsModel };
    case GoalActionTypes.SearchTagsFailed:
      return { ...state,  loadingSearchTags: false };
    default: {
      return state;
    }
  }
}

/**
 * Because the data structure is defined within the reducer it is optimal to
 * locate our selector functions at this level. If store is to be thought of
 * as a database, and reducers the tables, selectors can be considered the
 * queries into said database. Remember to keep your selectors small and
 * focused so they can be combined and composed to fit each particular
 * use-case.
 */

export const getSelectedId = (state: State) => state.selectedGoalId;
