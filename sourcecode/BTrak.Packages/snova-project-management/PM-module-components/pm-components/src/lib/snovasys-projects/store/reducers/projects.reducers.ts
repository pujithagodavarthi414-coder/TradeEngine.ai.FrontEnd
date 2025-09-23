// tslint:disable-next-line: ordered-imports
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
// tslint:disable-next-line: ordered-imports
import { GoalModel } from "../../models/GoalModel";
// tslint:disable-next-line: ordered-imports
import { Project } from "../../models/project";
// tslint:disable-next-line: ordered-imports
import { ProjectSearchResult } from "../../models/ProjectSearchResult";
import { ProjectActions, ProjectActionTypes } from "../actions/project.actions";
import { ValidationModel } from '../../models/validation-messages';

// tslint:disable-next-line: interface-name
export interface State extends EntityState<ProjectSearchResult> {
  loadingProjects: boolean;
  creatingProject: boolean;
  getProjectByIdLoading: boolean;
  createProjectErrors: ValidationModel[];
  selectedProjectId: string | null;
  Project: Project;
  exceptionMessage: string;
  selectedGoal: GoalModel;
  projectEditLoading: boolean;
}

export const projectAdapter: EntityAdapter<
  ProjectSearchResult
> = createEntityAdapter<ProjectSearchResult>({
  selectId: (project: ProjectSearchResult) => project.projectId,
  // tslint:disable-next-line: max-line-length
  sortComparer: false
});

export const initialState: State = projectAdapter.getInitialState({
  loadingProjects: true,
  creatingProject: false,
  getProjectByIdLoading: false,
  createProjectErrors: [],
  selectedProjectId: null,
  Project: null,
  exceptionMessage: "",
  selectedGoal: null,
  projectEditLoading: false
});

export function reducer(
  state: State = initialState,
  action: ProjectActions
): State {
  switch (action.type) {
    case ProjectActionTypes.LoadProjectsTriggered:
      return { ...state, loadingProjects: true };
    case ProjectActionTypes.LoadProjectsCompleted:
      return projectAdapter.addAll(action.projects, {
        ...state,
        loadingProjects: false
      });
    case ProjectActionTypes.LoadProjectsFailed:
      return { ...state, loadingProjects: false };
    case ProjectActionTypes.CreateProjectTriggered:
      return { ...state, creatingProject: true };
    case ProjectActionTypes.CreateProjectCompleted:
      return { ...state, creatingProject: false };
    case ProjectActionTypes.CreateProjectFailed:
      return {
        ...state,
        creatingProject: false,
        createProjectErrors: action.validationMessages
      };
    case ProjectActionTypes.ProjectExceptionHandled:
      return {
        ...state,
        creatingProject: false,
        loadingProjects: false,
        exceptionMessage: action.errorMessage
      };
    case ProjectActionTypes.EditProjectTriggered:
      return { ...state, loadingProjects: true };
    case ProjectActionTypes.EditProjectsCompleted:
      return { ...state, Project: action.project, loadingProjects: false };
    case ProjectActionTypes.EditProjectsFailed:
      return {
        ...state,
        loadingProjects: false,
        createProjectErrors: action.validationMessages
      };
    case ProjectActionTypes.GetProjectByIdTriggered:
      return { ...state, getProjectByIdLoading: true };
    case ProjectActionTypes.GetProjectByIdCompleted:
      return { ...state, Project: action.project, getProjectByIdLoading: false };
    case ProjectActionTypes.ArchiveProjectTriggered:
      return { ...state, creatingProject: true };
    case ProjectActionTypes.ArchiveProjectCompleted:
      state = projectAdapter.removeOne(action.projectId, state);
      return { ...state, creatingProject: false };
    case ProjectActionTypes.ArchiveProjectFailed:
      return { ...state, creatingProject: false };
    case ProjectActionTypes.GoalChangedInGoalView:
      return { ...state, selectedGoal: { ...action.selectedGoal } };
    case ProjectActionTypes.ProjectCompletedWithInPlaceUpdate:
      return projectAdapter.updateOne(action.projectUpdate.projectUpdate, state);

    case ProjectActionTypes.RefreshProjectsList:
      return projectAdapter.upsertOne(action.project, state);

    case ProjectActionTypes.ProjectEditTriggered:
      return { ...state, projectEditLoading: true };
    case ProjectActionTypes.ProjectEditCompleted:
      return { ...state, Project: action.project, projectEditLoading: false };
    case ProjectActionTypes.ProjectEditFailed:
      return {
        ...state,
        projectEditLoading: false,
        createProjectErrors: action.validationMessages
      };

    default:
      return state;
  }
}

export const getSelectedId = (state: State) => state.selectedProjectId;
