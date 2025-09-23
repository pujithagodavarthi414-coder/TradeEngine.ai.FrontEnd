import { Update } from "@ngrx/entity";
import { Action } from "@ngrx/store";
// tslint:disable-next-line: ordered-imports
import { ValidationModel } from "../../models/validation-messages";
import { ProjectFeature } from "../../models/projectFeature";

export enum ProjectFeaturesActionTypes {
  LoadProjectFeaturesTriggered = "[SnovaAudisModule Project Feature Component] Initial Data Load Triggered",
  LoadProjectFeaturesCompleted = "[SnovaAudisModule Project Feature Component] Initial Data Load Completed",
  CreateProjectFeaturesTriggered = "[SnovaAudisModule Project Feature Component] Create Project Feature Triggered",
  CreateProjectFeaturesCompleted = "[SnovaAudisModule Project Feature Component] Create Project Feature Completed",
  CreateProjectFeaturesFailed = "[SnovaAudisModule Project Feature Component] Create Project Feature Failed",
  GetProjectFeatureByIdTriggered = "[SnovaAudisModule Project Feature Component] Get Project feature By Id Triggered",
  GetProjectFeatureByIdCompleted = "[SnovaAudisModule Project Feature Component] Get Project feature By Id Completed",
  GetProjectFeatureByIdFailed = "[SnovaAudisModule Project Feature Component] Get Project feature By Id Failed",
  RefreshProjectFeaturesList = "[SnovaAudisModule Project Feature Component] Refresh Project Features list",
  UpdateProjectFeature = "[SnovaAudisModule Project Feature Component] Update Project feature",
  ArchiveProjectFeatureTriggered = "[SnovaAudisModule Project Feature Component] Archive Project feature Triggered",
  ArchiveProjectFeatureCompleted = "[SnovaAudisModule Project Feature Component] Archive Project feature Completed",
  ArchiveProjectFeatureFailed = "[SnovaAudisModule Project Feature Component] Archive Project feature Failed",
  ExceptionHandled = "[SnovaAudisModule ExceptionHandled]ExceptionHandled"
}

export class LoadFeatureProjectsTriggered implements Action {
  type = ProjectFeaturesActionTypes.LoadProjectFeaturesTriggered;
  projectFeatures: ProjectFeature[];
  projectFeatureId: string;
  projectMember: ProjectFeature;
  validationMessages: ValidationModel[];
  projectId: string;
  errorMessage: string;
  projectFeatureUpdate: { projectFeatureUpdate: Update<ProjectFeature>};
  constructor(public projectFeature: ProjectFeature) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadFeatureProjectsCompleted implements Action {
  type = ProjectFeaturesActionTypes.LoadProjectFeaturesCompleted;
  projectId: string;
  projectFeatureId: string;
  projectFeature: ProjectFeature;
  validationMessages: ValidationModel[];
  errorMessage: string;
  projectFeatureUpdate: { projectFeatureUpdate: Update<ProjectFeature>};
  constructor(public projectFeatures: ProjectFeature[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class CreateProjectFeatureTriggered implements Action {
  type = ProjectFeaturesActionTypes.CreateProjectFeaturesTriggered;
  projectId: string;
  validationMessages: ValidationModel[];
  projectFeatures: ProjectFeature[];
  projectFeatureId: string;
  errorMessage: string;
  projectFeatureUpdate: { projectFeatureUpdate: Update<ProjectFeature>};
  constructor(public projectFeature: ProjectFeature) {}
}

// tslint:disable-next-line: max-classes-per-file
export class CreateProjectFeatureFailed implements Action {
  type = ProjectFeaturesActionTypes.CreateProjectFeaturesFailed;
  projectFeatures: ProjectFeature[];
  projectFeature: ProjectFeature;
  projectId: string;
  projectFeatureId: string;
  errorMessage: string;
  projectFeatureUpdate: { projectFeatureUpdate: Update<ProjectFeature>}
  constructor(public validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class CreateProjectFeatureCompleted implements Action {
  type = ProjectFeaturesActionTypes.CreateProjectFeaturesCompleted;
  validationMessages: ValidationModel[];
  projectFeatures: ProjectFeature[];
  errorMessage: string;
  projectId: string;
  projectFeatureId: string
  projectFeatureUpdate: { projectFeatureUpdate: Update<ProjectFeature>}
  constructor(public projectFeature: ProjectFeature) {}
}

// tslint:disable-next-line: max-classes-per-file
export class GetProjectFeatureByIdTriggered implements Action {
  type = ProjectFeaturesActionTypes.GetProjectFeatureByIdTriggered;
  validationMessages: ValidationModel[];
  projectFeatures: ProjectFeature[];
  projectFeature: ProjectFeature;
  errorMessage: string;
  projectId: string;
  projectFeatureUpdate: { projectFeatureUpdate: Update<ProjectFeature>};
  constructor(public projectFeatureId: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class GetProjectFeatureByIdCompleted implements Action {
  type = ProjectFeaturesActionTypes.GetProjectFeatureByIdCompleted;
  projectFeatures: ProjectFeature[];
  projectId: string;
  projectFeatureId: string;
  errorMessage: string;
  validationMessages: ValidationModel[];
  projectFeatureUpdate: { projectFeatureUpdate: Update<ProjectFeature>};
  constructor(public projectFeature: ProjectFeature) {}
}

// tslint:disable-next-line: max-classes-per-file
export class GetProjectFeatureByIdFailed implements Action {
  type = ProjectFeaturesActionTypes.GetProjectFeatureByIdFailed;
  projectFeatures: ProjectFeature[];
  projectFeature: ProjectFeature;
  projectId: string;
  projectFeatureId: string;
  errorMessage: string;
  projectFeatureUpdate: { projectFeatureUpdate: Update<ProjectFeature>};
  constructor(public validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class RefreshProjectFeaturesList implements Action {
  type = ProjectFeaturesActionTypes.RefreshProjectFeaturesList;
  projectFeatures: ProjectFeature[];
  projectId: string;
  projectFeatureId: string;
  errorMessage: string;
  validationMessages: ValidationModel[];
  projectFeatureUpdate: { projectFeatureUpdate: Update<ProjectFeature>};
  constructor(public projectFeature: ProjectFeature) {}
}

// tslint:disable-next-line: max-classes-per-file
export class UpdateProjectFeature implements Action {
  type = ProjectFeaturesActionTypes.UpdateProjectFeature;
  projectFeatures: ProjectFeature[];
  projectId: string;
  projectFeatureId: string;
  errorMessage: string;
  validationMessages: ValidationModel[];
  projectFeature: ProjectFeature;
  constructor(public projectFeatureUpdate: { projectFeatureUpdate: Update<ProjectFeature>}) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ArchiveProjectFeatureTriggered implements Action {
  type = ProjectFeaturesActionTypes.ArchiveProjectFeatureTriggered;
  projectFeatures: ProjectFeature[];
  projectId: string;
  projectFeatureId: string;
  errorMessage: string;
  validationMessages: ValidationModel[];
  projectFeatureUpdate: { projectFeatureUpdate: Update<ProjectFeature>}
  constructor(public projectFeature: ProjectFeature) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ArchiveProjectFeatureCompleted implements Action {
  type = ProjectFeaturesActionTypes.ArchiveProjectFeatureCompleted;
  projectFeatures: ProjectFeature[];
  projectId: string;
  errorMessage: string;
  validationMessages: ValidationModel[];
  projectFeatureUpdate: { projectFeatureUpdate: Update<ProjectFeature>};
  projectFeature: ProjectFeature;
  constructor(public projectFeatureId: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ArchiveProjectFeatureFailed implements Action {
  type = ProjectFeaturesActionTypes.ArchiveProjectFeatureFailed;
  projectFeatures: ProjectFeature[];
  projectFeature: ProjectFeature;
  projectId: string;
  projectFeatureId: string;
  errorMessage: string;
  projectFeatureUpdate: { projectFeatureUpdate: Update<ProjectFeature>};
  constructor(public validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ExceptionHandled implements Action {
  type = ProjectFeaturesActionTypes.CreateProjectFeaturesFailed;
  projectFeatures: ProjectFeature[];
  projectFeature: ProjectFeature;
  projectId: string;
  projectFeatureId: string;
  validationMessages: ValidationModel[];
  projectFeatureUpdate: { projectFeatureUpdate: Update<ProjectFeature>};
  constructor(public errorMessage: string) {}
}

export type ProjectFeatureActions =
  | LoadFeatureProjectsTriggered
  | LoadFeatureProjectsCompleted
  | CreateProjectFeatureTriggered
  | CreateProjectFeatureCompleted
  | CreateProjectFeatureFailed
  | GetProjectFeatureByIdTriggered
  | GetProjectFeatureByIdCompleted
  | GetProjectFeatureByIdFailed
  | ArchiveProjectFeatureTriggered
  | ArchiveProjectFeatureCompleted
  | ArchiveProjectFeatureFailed
  | UpdateProjectFeature
  | RefreshProjectFeaturesList
  | ExceptionHandled;
