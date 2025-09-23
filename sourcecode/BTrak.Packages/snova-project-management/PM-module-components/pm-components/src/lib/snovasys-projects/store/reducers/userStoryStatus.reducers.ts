// tslint:disable-next-line: ordered-imports
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { StatusesModel } from "../../models/workflowStatusesModel";
import {
  UserStoryStatusActions,
  UserStoryStatusActionTypes
} from "../actions/userStoryStatus.action";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<StatusesModel> {
  loadingUserStoryStatus: boolean;
}

export const userStoryStatusAdapter: EntityAdapter<
  StatusesModel
> = createEntityAdapter<StatusesModel>({
  selectId: (userStoryStatus: StatusesModel) =>
    userStoryStatus.userStoryStatusId
});

export const initialState: State = userStoryStatusAdapter.getInitialState({
  loadingUserStoryStatus: false
});

export function reducer(
  state: State = initialState,
  action: UserStoryStatusActions
): State {
  switch (action.type) {
    case UserStoryStatusActionTypes.LoadUserStoryStatusTriggered:
      return { ...state, loadingUserStoryStatus: true };
    case UserStoryStatusActionTypes.LoadUserStoryStatusCompleted:
      return userStoryStatusAdapter.addAll(action.userStoryStatus, {
        ...state,
        loadingUserStoryStatus: false
      });
    default:
      return state;
  }
}
