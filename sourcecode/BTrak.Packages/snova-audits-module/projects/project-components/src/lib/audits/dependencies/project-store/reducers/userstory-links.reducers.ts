// tslint:disable-next-line: ordered-imports
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
// tslint:disable-next-line: ordered-imports
import { ValidationModel } from "../../models/validation-messages";
import { UserStoryLinkModel } from "../../models/userstory-link-types-model";
import { UserStoryLinksModel } from "../../models/userstory-links.model";
// tslint:disable-next-line: ordered-imports
import { UserStoryLinksActions, UserStoryLinksActionTypes } from "../actions/userstory-links.action";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<UserStoryLinksModel> {
  loadUserStoryLinks: boolean;
  loadUserStoryErrors: ValidationModel[];
  errorMessage: string;
  userStoryLinkTypes: UserStoryLinkModel[];
  loadingUserStoryLinkTypes: boolean;
  creatingLink: boolean;
  archiveUserStoryLink: boolean;
}

export const userStoryLinkAdapter: EntityAdapter<UserStoryLinksModel> = createEntityAdapter<UserStoryLinksModel>(
  {
    selectId: (userstoryLink: UserStoryLinksModel) => userstoryLink.linkUserStoryId,
    sortComparer: false
  }
);

export const initialState: State = userStoryLinkAdapter.getInitialState({
  loadUserStoryLinks: true,
  loadUserStoryErrors: [],
  errorMessage: "",
  userStoryLinkTypes: [],
  loadingUserStoryLinkTypes: false,
  creatingLink: false,
  archiveUserStoryLink: false
});

export function reducer(
  state = initialState,
  action: UserStoryLinksActions
): State {
  switch (action.type) {
    case UserStoryLinksActionTypes.LoadUserstoryLinksTriggered:
      return initialState;
    case UserStoryLinksActionTypes.LoadUserstoryLinksCompleted:
      return userStoryLinkAdapter.addAll(action.userstoryLinksList, {
        ...state,
        loadUserStoryLinks: false
      });

    case UserStoryLinksActionTypes.LoadUserstoryLinksFailed:
      return { ...state, loadUserStoryLinks: false, loadUserStoryErrors: action.validationMessages };

    case UserStoryLinksActionTypes.GetUserStoryLinksTypesTriggered:
      return { ...state, loadingUserStoryLinkTypes: true };
    case UserStoryLinksActionTypes.GetUserStoryLinksTypesCompleted:
      return { ...state, loadingUserStoryLinkTypes: false, userStoryLinkTypes: action.linkUserStoryTypesList };
    case UserStoryLinksActionTypes.GetUserStoryLinksTypesFailed:
      return { ...state, loadingUserStoryLinkTypes: false };

    case UserStoryLinksActionTypes.UpsertUserStoryLinkTriggered:
      return { ...state, creatingLink: true };
    case UserStoryLinksActionTypes.UpsertUserStoryLinkCompleted:
      return { ...state, creatingLink: false };
    case UserStoryLinksActionTypes.UpsertUserStoryLinkFailed:
      return { ...state, creatingLink: false };
    case UserStoryLinksActionTypes.RefreshUserStoriesLink:
      return userStoryLinkAdapter.upsertOne(action.linkUserStoryModel, state);
    case UserStoryLinksActionTypes.ArchiveUserStoryLinkTriggered:
      return { ...state, archiveUserStoryLink: true };
    case UserStoryLinksActionTypes.ArchiveUserStoryLinkCompleted:
        state = userStoryLinkAdapter.removeOne(action.userStoryId, state);
        return { ...state, archiveUserStoryLink: false };
    case UserStoryLinksActionTypes.ArchiveUserStoryLinkFailed:
      return { ...state, archiveUserStoryLink: false };

    case UserStoryLinksActionTypes.ExceptionHandled:
      return {
        ...state,
        errorMessage: action.errorMessage,
        loadUserStoryLinks: false,
        loadingUserStoryLinkTypes: false,
        creatingLink: false
      };
    default:
      return state;
  }
}
