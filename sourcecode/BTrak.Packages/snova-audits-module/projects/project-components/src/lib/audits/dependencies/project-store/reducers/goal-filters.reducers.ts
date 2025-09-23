// tslint:disable-next-line: ordered-imports
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
// import { GoalsFilter } from "../../models/goal-filter.model";
import { UserGoalFilter } from "../../models/user-goal-filter.model";
import { GoalFilterActions, GoalFiltersActionTypes } from "../actions/goal-filters.action";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<UserGoalFilter> {
    upsertGoalFilters: boolean;
    loadingGoalFilters: boolean;
    archiveGoalFilters: boolean;
  }
export const goalFiltersAdapter: EntityAdapter<UserGoalFilter> = createEntityAdapter<
  UserGoalFilter
  >({
    selectId: (goalFilters: UserGoalFilter) => goalFilters.goalFilterId,
    // tslint:disable-next-line: max-line-length
    sortComparer: (goalFiltersSortAsc: UserGoalFilter, goalFiltersSortDesc: UserGoalFilter) => goalFiltersSortDesc.createdDateTime.toString().localeCompare(goalFiltersSortAsc.createdDateTime.toString())
  });
export const initialState: State = goalFiltersAdapter.getInitialState({
    upsertGoalFilters: false,
    loadingGoalFilters : true,
    archiveGoalFilters : false
  });
export function reducer(
    state: State = initialState,
    action: GoalFilterActions
  ): State {
    switch (action.type) {
      case GoalFiltersActionTypes.GetGoalFiltersTriggered:
        return initialState;
        case GoalFiltersActionTypes.GetGoalFiltersCompleted:
            return goalFiltersAdapter.addAll(action.goalFiltersList, {
              ...state,
              loadingGoalFilters: false
            });
      case GoalFiltersActionTypes.UpsertGoalFiltersTriggered:
        return { ...state, upsertGoalFilters: true };
      case GoalFiltersActionTypes.UpsertGoalFiltersCompleted:
        return { ...state, upsertGoalFilters: false };
      case GoalFiltersActionTypes.UpsertGoalFiltersFailed:
        return { ...state, upsertGoalFilters: false };
        case GoalFiltersActionTypes.ArchiveGoalFiltersTriggered:
          return { ...state, archiveGoalFilters: true };
        case GoalFiltersActionTypes.ArchiveGoalFiltersCompleted:
            state = goalFiltersAdapter.removeOne(action.goalFilterId, state);
            return { ...state, archiveGoalFilters: false };
        case GoalFiltersActionTypes.ArchiveGoalFiltersFailed:
          return { ...state, archiveGoalFilters: false };
      default:
        return state;
    }
  }
