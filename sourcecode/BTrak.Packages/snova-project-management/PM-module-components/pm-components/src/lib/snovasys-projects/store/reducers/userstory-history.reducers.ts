// tslint:disable-next-line: ordered-imports
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import {UserStoryHistory} from "../../models/userstory-history.model";
// tslint:disable-next-line: ordered-imports
import {UserstoryHistoryActions, UserstoryHistoryActionTypes} from "../actions/userstory-history.action";
import { ValidationModel } from '../../models/validation-messages';

// tslint:disable-next-line: interface-name
export interface State extends EntityState<UserStoryHistory> {
   loadUserStoryHistory: boolean;
   loadUserStoryErrors: ValidationModel[];
   errorMessage: string;
  }
export const userstoryHistoryAdapter: EntityAdapter<UserStoryHistory> = createEntityAdapter<UserStoryHistory>(
    {
      selectId: (userstoryHistory: UserStoryHistory) => userstoryHistory.userStoryHistoryId,
      sortComparer: false
    }
  );
export const initialState: State = userstoryHistoryAdapter.getInitialState({
    loadUserStoryHistory: false,
    loadUserStoryErrors: [],
    errorMessage: ""
  });
export function reducer(
    state = initialState,
    action: UserstoryHistoryActions
  ): State {
    switch (action.type) {
      case UserstoryHistoryActionTypes.LoadUserstoryHistoryTriggered:
        return { ...initialState, loadUserStoryHistory: true };
      case UserstoryHistoryActionTypes.LoadUserstoryHistoryCompleted:
        return userstoryHistoryAdapter.addAll(action.userstoryHistoryList, {
          ...state,
          loadUserStoryHistory: false
        });
      case UserstoryHistoryActionTypes.LoadUserstoryHistoryFailed:
        return { ...state, loadUserStoryHistory: false, loadUserStoryErrors: action.validationMessages};
      case UserstoryHistoryActionTypes.UserStoryHistoryExceptionHandled:
        return {
          ...state,
          errorMessage: action.errorMessage,
          loadUserStoryHistory: false
        };
      default:
        return state;
    }
  }
