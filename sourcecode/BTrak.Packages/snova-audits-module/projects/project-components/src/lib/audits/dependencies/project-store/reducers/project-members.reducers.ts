// tslint:disable-next-line: ordered-imports
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { ValidationModel } from "../../models/validation-messages";
import { ProjectMember } from "../../models/projectMember";
import {
  ProjectMemberActions,
  ProjectMembersActionTypes
} from "../actions/project-members.actions";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<ProjectMember> {
  loadingProjectMembers: boolean;
  creatingProjectMember: boolean;
  creatingProjectMemberErrors: ValidationModel[];
  exceptionMessage: string;
}

export const projectAdapter: EntityAdapter<ProjectMember> = createEntityAdapter<
  ProjectMember
>({
  selectId: (projectMember: ProjectMember) => projectMember.id
});

export const initialState: State = projectAdapter.getInitialState({
  loadingProjectMembers: true,
  creatingProjectMember: false,
  creatingProjectMemberErrors: [],
  exceptionMessage: ""
});

export function reducer(
  state: State = initialState,
  action: ProjectMemberActions
): State {
  switch (action.type) {
    case ProjectMembersActionTypes.LoadProjectMembersTriggered:
      return initialState;
    case ProjectMembersActionTypes.LoadProjectMembersCompleted:
      return projectAdapter.addAll(action.projectMembers, {
        ...state,
        loadingProjectMembers: false
      });
    case ProjectMembersActionTypes.CreateProjectMembersTriggered:
      return { ...state, creatingProjectMember: true };
    case ProjectMembersActionTypes.CreateProjectMembersCompleted:
      return { ...state, creatingProjectMember: false };
    case ProjectMembersActionTypes.CreateProjectMembersFailed:
      return {
        ...state,
        creatingProjectMemberErrors: action.validationMessages,
        creatingProjectMember: false
      };
    case ProjectMembersActionTypes.DeleteProjectMembersTriggered:
      return { ...state, creatingProjectMember: true };
    case ProjectMembersActionTypes.DeleteProjectMembersCompleted:
      state = projectAdapter.removeOne(action.projectMemberId, state);
      return { ...state, creatingProjectMember: false };
    case ProjectMembersActionTypes.DeleteProjectMembersFailed:
      return {
        ...state,
        creatingProjectMemberErrors: action.validationMessages,
        creatingProjectMember: false
      };
    case ProjectMembersActionTypes.UpdateProjectMemberList:
      return projectAdapter.updateOne(action.projectMemberUpdate.projectMemberUpdate, state);
    case ProjectMembersActionTypes.RefreshProjectMembersList:
      return projectAdapter.upsertMany(action.projectMembers, state);

    case ProjectMembersActionTypes.ExceptionHandled:
      return { ...state, exceptionMessage: action.errorMessage, creatingProjectMember: false, loadingProjectMembers: false };
    default:
      return state;
  }
}
