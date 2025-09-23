// tslint:disable-next-line: ordered-imports
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { ProjectFeature } from "../../models/projectFeature";
import {
  ProjectFeatureActions,
  ProjectFeaturesActionTypes
} from "../actions/project-features.actions";
import { ValidationModel } from '../../models/validation-messages';

// tslint:disable-next-line: interface-name
export interface State extends EntityState<ProjectFeature> {
  loadingProjectFeatures: boolean;
  creatingProjectFeature: boolean;
  projectFeature: ProjectFeature;
  creatingProjectFeatureErrors: ValidationModel[];
  exceptionMessage: string;
  projectFeatureByIdLoading: boolean;
}

export const projectAdapter: EntityAdapter<
  ProjectFeature
> = createEntityAdapter<ProjectFeature>({
  selectId: (projectFeature: ProjectFeature) => projectFeature.projectFeatureId
});

export const initialState: State = projectAdapter.getInitialState({
  loadingProjectFeatures: true,
  creatingProjectFeature: false,
  projectFeatureByIdLoading: false,
  creatingProjectFeatureErrors: [],
  exceptionMessage: "",
  projectFeature: null
});

export function reducer(
  state: State = initialState,
  action: ProjectFeatureActions
): State {
  switch (action.type) {
    case ProjectFeaturesActionTypes.LoadProjectFeaturesTriggered:
      return initialState;
    case ProjectFeaturesActionTypes.LoadProjectFeaturesCompleted:
      return projectAdapter.addAll(action.projectFeatures, {
        ...state,
        loadingProjectFeatures: false
      });
    case ProjectFeaturesActionTypes.CreateProjectFeaturesTriggered:
      return { ...state, creatingProjectFeature: true };
    case ProjectFeaturesActionTypes.CreateProjectFeaturesCompleted:
      return { ...state, creatingProjectFeature: false };
    case ProjectFeaturesActionTypes.CreateProjectFeaturesFailed:
      return {
        ...state,
        creatingProjectFeature: false,
        creatingProjectFeatureErrors: action.validationMessages
      };
    case ProjectFeaturesActionTypes.ProjectFeaturesExceptionHandled:
      return { ...state, exceptionMessage: action.errorMessage, creatingProjectFeature: false, loadingProjectFeatures: false };
    case ProjectFeaturesActionTypes.UpdateProjectFeature:
      return projectAdapter.updateOne(action.projectFeatureUpdate.projectFeatureUpdate, state);
    case ProjectFeaturesActionTypes.RefreshProjectFeaturesList:
      return projectAdapter.upsertOne(action.projectFeature, state);
    case ProjectFeaturesActionTypes.GetProjectFeatureByIdTriggered:
      return { ...state, projectFeatureByIdLoading: true };
    case ProjectFeaturesActionTypes.GetProjectFeatureByIdCompleted:
      return { ...state, projectFeature: action.projectFeature, projectFeatureByIdLoading: false };
    case ProjectFeaturesActionTypes.GetProjectFeatureByIdFailed:
      return { ...state, projectFeatureByIdLoading: false };
    case ProjectFeaturesActionTypes.ArchiveProjectFeatureTriggered:
      return { ...state, creatingProjectFeature: true };
    case ProjectFeaturesActionTypes.ArchiveProjectFeatureCompleted:
      state = projectAdapter.removeOne(action.projectFeatureId, state);
      return { ...state, creatingProjectFeature: false };
    case ProjectFeaturesActionTypes.ArchiveProjectFeatureFailed:
      return { ...state, creatingProjectFeature: false };
    default:
      return state;
  }
}
