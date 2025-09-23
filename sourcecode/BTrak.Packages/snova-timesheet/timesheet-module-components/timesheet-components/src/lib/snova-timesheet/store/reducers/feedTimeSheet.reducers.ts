import { EntityState, createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import {
  FeedTimeSheetUsersActions,
  FeedTimeSheetUsersActionTypes
} from "../actions/feedTimeSheet.action";
import { UserModel } from '../../models/user';

export interface State extends EntityState<UserModel> {
  loadingFeedTimeSheetUsers: boolean;
}

export const feedTimeSheetAdapter: EntityAdapter<UserModel> = createEntityAdapter<UserModel>({
  selectId: (userModel: UserModel) => userModel.id
});

export const initialState: State = feedTimeSheetAdapter.getInitialState({
  loadingFeedTimeSheetUsers: false
});

export function reducer(
  state: State = initialState,
  action: FeedTimeSheetUsersActions
): State {
  switch (action.type) {
    case FeedTimeSheetUsersActionTypes.LoadFeedTimeSheetUsersTriggered:
      return { ...state, loadingFeedTimeSheetUsers: true };
    case FeedTimeSheetUsersActionTypes.LoadFeedTimeSheetUsersCompleted:
      return feedTimeSheetAdapter.addAll(action.userDetails, {
        ...state,
        loadingFeedTimeSheetUsers: false
      });
    case FeedTimeSheetUsersActionTypes.LoadFeedTimeSheetUsersFailed:
      return { ...state, loadingFeedTimeSheetUsers: false };
    default:
      return state;
  }
}
