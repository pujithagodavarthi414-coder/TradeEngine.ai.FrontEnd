// tslint:disable-next-line: ordered-imports
import { GoalSearchCriteriaApiInputModel } from "../../models/goalSearchInput";
import { GoalActionsUnion, GoalActionTypes } from "../actions/goal.actions";

// tslint:disable-next-line: interface-name
export interface State {
  ids: string[];
  loading: boolean;
  error: string;
  query: GoalSearchCriteriaApiInputModel;
}

const initialState: State = {
  ids: [],
  loading: false,
  error: "",
  query: undefined
};

export function reducer(state = initialState, action: GoalActionsUnion): State {
  switch (action.type) {
    case GoalActionTypes.Search: {
      const query = action.goalSearchResult;

      if (query === undefined) {
        return {
          ids: [],
          loading: false,
          error: "",
          query
        };
      }

      return {
        ...state,
        loading: true,
        error: "",
        query
      };
    }

    case GoalActionTypes.SearchComplete: {
      return {
        ids: action.goalResult.map((book) => book.goalId),
        loading: false,
        error: "",
        query: state.query
      };
    }

    case GoalActionTypes.SearchError: {
      return {
        ...state,
        loading: false,
        error: action.error
      };
    }

    default: {
      return state;
    }
  }
}

export const getIds = (state: State) => state.ids;

export const getQuery = (state: State) => state.query;

export const getLoading = (state: State) => state.loading;

export const getError = (state: State) => state.error;
