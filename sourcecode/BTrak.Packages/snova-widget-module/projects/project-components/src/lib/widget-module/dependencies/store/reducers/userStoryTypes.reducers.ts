import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { UserStoryTypesModel } from "../../models/userStoryTypesModel";
import {
  UserStoryTypesActions,
  UserStoryTypesActionTypes
} from "../actions/user-story-types.action";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<UserStoryTypesModel> {
  loadingUserStoryTypes: boolean;
}

export const userStoryTypesAdapter: EntityAdapter<
UserStoryTypesModel
> = createEntityAdapter<UserStoryTypesModel>({
  selectId: (userStoryTypes: UserStoryTypesModel) =>
    userStoryTypes.userStoryTypeId
});

export const initialState: State = userStoryTypesAdapter.getInitialState({
  loadingUserStoryTypes: false
});

export function reducer(
  state: State = initialState,
  action: UserStoryTypesActions
): State {
  switch (action.type) {
    case UserStoryTypesActionTypes.LoadUserStoryTypesTriggered:
      return { ...state, loadingUserStoryTypes: true };
    case UserStoryTypesActionTypes.LoadUserStoryTypesCompleted:
      return userStoryTypesAdapter.addAll(action.userStoryTypes, {
        ...state,
        loadingUserStoryTypes: false
      });
    default:
      return state;
  }
}
