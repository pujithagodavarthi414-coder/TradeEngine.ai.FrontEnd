// tslint:disable-next-line: ordered-imports
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { ValidationModel } from "../../models/validation-messages";
import { UserStory } from "../../models/userStory";
// tslint:disable-next-line: ordered-imports
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import {
  UserStoryActionsUnion,
  UserStoryActionTypes
} from "../actions/userStory.actions";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<UserStory> {
  selectedUserStoryId: string | null;
  ids: string[];
  insertAutoLogTime: boolean;
  loadingUserStories: boolean;
  error: string;
  query: UserStorySearchCriteriaInputModel;
  creatingUserStory: boolean;
  createUserStoryErrors: ValidationModel[];
  exceptionMessage: string;
  userStory: UserStory;
  getUserStoryById: boolean;
  reOrderUserStoriesLoading: boolean;
  archiveUserStoriesLoading: boolean;
  getUniqueUserStoryById: boolean;
  archiveUserStory: boolean;
  parkUserStory: boolean;
  archiveUniqueUserStory: boolean;
  parkUniqueUserStory: boolean;
  goalId: string;
  updateUserStoryGoal: boolean;
  creatingMultipleUserStories: boolean;
  amendDeadlineLoading: boolean;
  userStoriesList: UserStory[];
  loadingSubTasks: boolean;
  autoCompleteUserStories: UserStory[];
  loading: boolean;
  creatingUserStoryTags: boolean;
}

export const adapter: EntityAdapter<UserStory> = createEntityAdapter<UserStory>(
  {
    selectId: (userStory: UserStory) => userStory.userStoryId,
    sortComparer: sortByUserStories
  }
);

export function sortByUserStories(userStoriesSortAsc: UserStory, userStoriesSortDesc: UserStory): any {
  const goalSort = localStorage.getItem("allgoals");
  if (goalSort === "true") {
    return false;
  } else {
    return userStoriesSortDesc.order - userStoriesSortAsc.order
  }
}

export const initialState: State = adapter.getInitialState({
  selectedUserStoryId: null,
  ids: [],
  insertAutoLogTime: false,
  loadingUserStories: false,
  error: "",
  query: undefined,
  creatingUserStory: false,
  createUserStoryErrors: [],
  exceptionMessage: "",
  userStory: null,
  getUserStoryById: false,
  getUniqueUserStoryById: false,
  goalId: "",
  reOrderUserStoriesLoading: false,
  archiveUserStoriesLoading: false,
  archiveUserStory: false,
  parkUserStory: false,
  archiveUniqueUserStory: false,
  parkUniqueUserStory: false,
  updateUserStoryGoal: false,
  creatingMultipleUserStories: false,
  amendDeadlineLoading: false,
  userStoriesList: [],
  loadingSubTasks: false,
  autoCompleteUserStories: [],
  loading: false,
  creatingUserStoryTags: false
});

export function reducer(
  state = initialState,
  action: UserStoryActionsUnion
): State {
  switch (action.type) {
    case UserStoryActionTypes.Search:
      return { ...initialState, loadingUserStories: true };

    case UserStoryActionTypes.SearchComplete:
      return adapter.addAll(action.userStoryList, {
        ...state,
        loadingUserStories: false
      });

    case UserStoryActionTypes.SearchFailed:
      return { ...state, loadingUserStories: false };

    case UserStoryActionTypes.Load:
      return adapter.addOne(action.userStory, state);

    case UserStoryActionTypes.Select:
      return {
        ...state,
        selectedUserStoryId: action.userStory.userStoryId
      };

    case UserStoryActionTypes.SearchAllGoals:
      return { ...state, loadingUserStories: true };

    case UserStoryActionTypes.CreateUserStoryTriggered:
      return { ...state, creatingUserStory: true };

    case UserStoryActionTypes.CreateUserStoryCompleted:
      return { ...state, creatingUserStory: false };

    case UserStoryActionTypes.CreateUserStoryFailed:
      return {
        ...state,
        createUserStoryErrors: action.validationMessages,
        creatingUserStory: false
      };

    case UserStoryActionTypes.CreateMultipleUserStoriesSplitTriggered:
      return { ...state, creatingMultipleUserStories: true };

    case UserStoryActionTypes.CreateMultipleUserStoriesSplitCompleted:
      return { ...state, creatingMultipleUserStories: false };

    case UserStoryActionTypes.CreateMultipleUserStoriesSplitFailed:
      return { ...state, creatingMultipleUserStories: false };

    case UserStoryActionTypes.CreateMultipleUserStoriesFailed:
      return {
        ...state,
        createUserStoryErrors: action.validationMessages,
        creatingUserStory: false
      };

    case UserStoryActionTypes.CreateUserStoryCompletedWithInPlaceUpdate:
      return adapter.updateOne(action.userStoryUpdates.userStoryUpdate, state);
     
    case UserStoryActionTypes.CreateUserStoryCompletedWithInPlaceUpdate:
      return { ...state, insertAutoLogTime: false }
    
      case UserStoryActionTypes.UpdateSingleUserStoryForBugsCompleted:
      return adapter.updateOne(action.userStoryUpdates.userStoryUpdate, state);

    case UserStoryActionTypes.UpdateMultipleUserStories:
      return adapter.updateMany(action.userStoryUpdatesMultiple.userStoryUpdateMultiple, {
        ...state,
        loadingUserStories: false,
        reOrderUserStoriesLoading: false
      });

    case UserStoryActionTypes.RefreshUserStoriesList:
      return adapter.upsertOne(action.userStory, state);

    case UserStoryActionTypes.RefreshMultipleUserStoriesList:
      return adapter.upsertMany(action.userStoryList, state);

    case UserStoryActionTypes.GetUserStoryByIdTriggered:
      return { ...state, getUserStoryById: true };

    case UserStoryActionTypes.GetUserStoryByIdCompleted:
      return { ...state, getUserStoryById: false, userStory: action.userStory };

    case UserStoryActionTypes.GetUniqueUserStoryByIdTriggered:
      return { ...state, getUniqueUserStoryById: true };

    case UserStoryActionTypes.GetUniqueUserStoryByIdCompleted:
      return { ...state, getUniqueUserStoryById: false, userStory: action.userStory };

    case UserStoryActionTypes.CreateMultipleUserStoriesCompleted:
      return { ...state, creatingUserStory: false };

    case UserStoryActionTypes.CreateMultipleUserStoriesTriggered:
      return { ...state, creatingUserStory: true };

    case UserStoryActionTypes.CreateMultipleUserStoriesFailed:
      return { ...state, creatingUserStory: false, createUserStoryErrors: action.validationMessages };

    case UserStoryActionTypes.UpdateUserStoryGoalTriggred:
      return { ...state, updateUserStoryGoal: true };

    case UserStoryActionTypes.UpdateUserStoryGoalCompleted:
      state = adapter.removeOne(action.userStoryId, state);
      return { ...state, updateUserStoryGoal: false };

    case UserStoryActionTypes.UpdateUserStoryGoaalFailed:
      return { ...state, updateUserStoryGoal: false, createUserStoryErrors: action.validationMessages };

    case UserStoryActionTypes.ArchiveUserStoryTriggred:
      return { ...state, archiveUserStory: true };

    case UserStoryActionTypes.ArchiveUserStoryCompleted:
      state = adapter.removeOne(action.userStoryId, state);
      return { ...state, archiveUserStory: false };

    case UserStoryActionTypes.ArchiveUserStoryFailed:
      return { ...state, archiveUserStory: false };

    case UserStoryActionTypes.ArchiveUniqueUserStoryTriggred:
      return { ...state, archiveUniqueUserStory: true };

    case UserStoryActionTypes.ArchiveUniqueUserStoryCompleted:
      state = adapter.removeOne(action.userStoryId, state);
      return { ...state, archiveUniqueUserStory: false };

    case UserStoryActionTypes.ArchiveSubTaskUserStoryFailed:
      return { ...state, archiveUniqueUserStory: false };

    case UserStoryActionTypes.ArchiveSubTaskUserStoryTriggred:
      return { ...state, archiveUniqueUserStory: true };

    case UserStoryActionTypes.ArchiveSubTaskUserStoryCompleted:
      state = adapter.removeOne(action.userStoryId, state);
      return { ...state, archiveUniqueUserStory: false };

    case UserStoryActionTypes.ArchiveUniqueUserStoryFailed:
      return { ...state, archiveUniqueUserStory: false };

    case UserStoryActionTypes.ParkUserStoryTriggred:
      return { ...state, parkUserStory: true };

    case UserStoryActionTypes.ParkUserStoryCompleted:
      state = adapter.removeOne(action.userStoryId, state);
      return { ...state, parkUserStory: false };

    case UserStoryActionTypes.ParkUserStoryFailed:
      return { ...state, parkUserStory: false };

    case UserStoryActionTypes.ParkUniqueUserStoryTriggred:
      return { ...state, parkUniqueUserStory: true };

    case UserStoryActionTypes.ParkUniqueUserStoryCompleted:
      state = adapter.removeOne(action.userStoryId, state);
      return { ...state, parkUniqueUserStory: false };

    case UserStoryActionTypes.ParkUniqueUserStoryFailed:
      return { ...state, parkUniqueUserStory: false };

    case UserStoryActionTypes.ParkSubTaskUserStoryTriggred:
      return { ...state, parkUniqueUserStory: true };

    case UserStoryActionTypes.ParkSubTaskUserStoryCompleted:
      state = adapter.removeOne(action.userStoryId, state);
      return { ...state, parkUniqueUserStory: false };

    case UserStoryActionTypes.ParkSubTaskUserStoryFailed:
      return { ...state, parkUniqueUserStory: false };

    case UserStoryActionTypes.CreateMultipleUserStoriesFailed:
      return { ...state, createUserStoryErrors: action.validationMessages };

    case UserStoryActionTypes.MultipleUserStoriesUsingFileTriggered:
      return { ...state, creatingUserStory: true };

    case UserStoryActionTypes.MultipleUserStoriesUsingFileCompleted:
      return { ...state, creatingUserStory: false };

    case UserStoryActionTypes.MultipleUserStoriesUsingFileFailed:
      return { ...state, createUserStoryErrors: action.validationMessages };

    case UserStoryActionTypes.InsertUserStoryReplanTriggered:
      return { ...state, creatingUserStory: true };

    case UserStoryActionTypes.InsertUserStoryReplanCompleted:
      return { ...state, creatingUserStory: false };

    case UserStoryActionTypes.InsertUserStoryReplanFailed:
      return { ...state, creatingUserStory: false };

    case UserStoryActionTypes.ExceptionHandled:
      return { ...state, exceptionMessage: action.errorMessage, creatingUserStory: false, loadingUserStories: false };

    case UserStoryActionTypes.InsertUserStoryReplanFailed:
      return { ...state, createUserStoryErrors: action.validationMessages };

    case UserStoryActionTypes.GetUserStorySubTasksTriggered:
      return { ...state, loadingSubTasks: true };

    case UserStoryActionTypes.GetUserStorySubTasksCompleted:
      return { ...state, loadingSubTasks: false, userStoriesList: action.userStoryList }

    case UserStoryActionTypes.UpdateSubTaskUserStoryTriggered:
      return { ...state, creatingUserStory: true };

    case UserStoryActionTypes.UpdateSubTaskUserStoryCompleted:
      return { ...state, creatingUserStory: false }

    case UserStoryActionTypes.ExceptionHandled:
      return {
        ...state,
        exceptionMessage: action.errorMessage,
        creatingUserStory: false,
        loadingUserStories: false
      };

    case UserStoryActionTypes.ClearUserStories:
      return adapter.removeAll(state);

    case UserStoryActionTypes.ArchivekanbanGoalsTriggered:
      return { ...state, archiveUserStoriesLoading: true };
    case UserStoryActionTypes.ArchivekanbanGoalsCompleted:
      state = adapter.removeMany(action.userStories, state);
      return { ...state, archiveUserStoriesLoading: false };
    case UserStoryActionTypes.ArchivekanbanGoalsFailed:
      return { ...state, archiveUserStoriesLoading: false };

    case UserStoryActionTypes.SearchError:
      return { ...state, exceptionMessage: action.errorMessage };

    case UserStoryActionTypes.ReOrderUserStoriesTriggred:
      return { ...state, reOrderUserStoriesLoading: true };

    case UserStoryActionTypes.ReOrderUserStoriesCompleted:
      return { ...state, reOrderUserStoriesLoading: false };

    case UserStoryActionTypes.ReOrderUserStoriesFailed:
      return { ...state, reOrderUserStoriesLoading: false };

    case UserStoryActionTypes.ReOrderSubUserStoriesTriggred:
      return { ...state, reOrderUserStoriesLoading: true };

    case UserStoryActionTypes.ReOrderSubUserStoriesCompleted:
      return { ...state, reOrderUserStoriesLoading: false };

    case UserStoryActionTypes.ReOrderSubUserStoriesFailed:
      return { ...state, reOrderUserStoriesLoading: false };

    case UserStoryActionTypes.UpdateReOrderUserStories:
      return { ...state, reOrderUserStoriesLoading: true };

    case UserStoryActionTypes.AmendUserStoriesDeadlineTriggered:
      return { ...state, amendDeadlineLoading: true };

    case UserStoryActionTypes.AmendUserStoriesDeadlineCompleted:
      return { ...state, amendDeadlineLoading: false };

    case UserStoryActionTypes.AmendUserStoriesDeadlineFailed:
      return { ...state, amendDeadlineLoading: false };

    case UserStoryActionTypes.UpsertUserStoryTagsTriggered:
      return { ...state, creatingUserStoryTags: true };

    case UserStoryActionTypes.UpsertUserStoryTagsCompleted:
      return { ...state, creatingUserStoryTags: false };

    case UserStoryActionTypes.UpsertSubTaskCompleted:
      return {
        ...state, creatingUserStory: false, loadingUserStories: false, creatingMultipleUserStories: false,
        reOrderUserStoriesLoading: false,
        archiveUserStory: false,
        parkUniqueUserStory: false,
        archiveUniqueUserStory: false,
        parkUserStory: false
      };

    case UserStoryActionTypes.UpsertUserStoryTagsFailed:
      return {
        ...state,
        createUserStoryErrors: action.validationMessages,
        creatingUserStoryTags: false
      };

    case UserStoryActionTypes.SearchAutoCompleteTriggered:
      return { ...state, loading: true };

    case UserStoryActionTypes.SearchAutoCompleteCompleted:
      return { ...state, loading: false, autoCompleteUserStories: action.userStoryList };
    case UserStoryActionTypes.SearchAutoCompleteFailed:
      return { ...state, loading: false };

    case UserStoryActionTypes.RemoveUserStoryFromBacklogList:
      state = adapter.removeOne(action.userStoryId, state);
      return { ...state, archiveUserStoriesLoading: false };

    default:
      return state;
  }
}

export const getSelectedId = (state: State) => state.selectedUserStoryId;

export const getUserStories = (state: State) => state.entities;

export const getIds = (state: State) => state.ids;
