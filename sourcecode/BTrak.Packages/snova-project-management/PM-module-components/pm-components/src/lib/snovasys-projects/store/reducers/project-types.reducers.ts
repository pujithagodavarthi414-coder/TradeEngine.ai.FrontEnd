// tslint:disable-next-line: ordered-imports
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { ProjectType } from "../../models/projectType";
import { User } from "../../models/user";
import {
  ProjectTypeActions,
  ProjectTypeActionTypes
} from "../actions/project-types.actions";
import { UserActions, UserActionTypes } from "../actions/users.actions";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<ProjectType> {
  loadingProjectTypes: boolean;
  exceptionMessage: string;
}

export const projectTypeAdapter: EntityAdapter<
  ProjectType
> = createEntityAdapter<ProjectType>({
  selectId: (projectType: ProjectType) => projectType.projectTypeId
});

export const initialState: State = projectTypeAdapter.getInitialState({
  loadingProjectTypes: false,
  exceptionMessage: ""
});

export function reducer(
  state: State = initialState,
  action: ProjectTypeActions
): State {
  switch (action.type) {
    case ProjectTypeActionTypes.LoadProjectTypesTriggered:
      return { ...state, loadingProjectTypes: true };
    case ProjectTypeActionTypes.LoadProjectTypesCompleted:
      return projectTypeAdapter.addAll(action.ProjectTypes, {
        ...state,
        loadingProjectTypes: false
      });
    case ProjectTypeActionTypes.LoadProjectTypesCompletedFromCache:
      return { ...state, loadingProjectTypes: false };
    case ProjectTypeActionTypes.ProjectTypesExceptionHandled:
      return { ...state, exceptionMessage: action.errorMessage, loadingProjectTypes: false };
    default:
      return state;
  }
}
