// tslint:disable-next-line: ordered-imports
import { Update } from "@ngrx/entity";
import { Action } from "@ngrx/store";
import { ValidationModel } from '../../models/validation-messages';
import { ArchivedProjectInputModel } from "../../models/archivedProjectInputModel";
// tslint:disable-next-line: ordered-imports
import { GoalModel } from "../../models/GoalModel";
// tslint:disable-next-line: ordered-imports
import { Project } from "../../models/project";
import { ProjectSearchCriteriaInputModel } from "../../models/ProjectSearchCriteriaInputModel";
import { ProjectSearchResult } from "../../models/ProjectSearchResult";

export enum ProjectActionTypes {
  LoadProjectsTriggered = "[Snovasys-PM][Project Component] Initial Data Load Triggered",
  LoadProjectsCompleted = "[Snovasys-PM][Project Component] Initial Data Load Completed",
  LoadProjectsFailed = "[Snovasys-PM][Project Component] Initial Data Load Failed",
  CreateProjectTriggered = "[Snovasys-PM][Project Component] Create Project Triggered",
  CreateProjectCompleted = "[Snovasys-PM][Project Component] Create Project Completed",
  CreateProjectFailed = "[Snovasys-PM][Project Component] Create Project Failed",
  EditProjectTriggered = "[Snovasys-PM][Project Component] Edit Project Triggered",
  EditProjectsCompleted = "[Snovasys-PM][Project Component] Edit Projetc Completed",
  EditProjectsFailed = "[Snovasys-PM][Project Component] Edit Project Failed",
  ProjectExceptionHandled = "[Snovasys-PM][Project Component] HandleException",
  ArchiveProjectTriggered = "[Snovasys-PM][Project Component] Archive Projetc Triggered",
  ArchiveProjectCompleted = "[Snovasys-PM][Project Component] Archive Projetc Completed",
  ArchiveProjectFailed = "[Snovasys-PM][Project Component] Archive Projetc Failed",
  GoalChangedInGoalView = "[Snovasys-PM][Project Component] Goal Changed In Goal View",
  RefreshProjectsList = "[Snovasys-PM][Project Component] Refresh Projects List",
  ProjectCompletedWithInPlaceUpdate = "[Snovasys-PM][Project Component]Project Completed With In Place Update",
  GetProjectByIdTriggered = "[Snovasys-PM][Project Component] Get Project By Id Triggered",
  GetProjectByIdCompleted = "[Snovasys-PM][Project Component] Get Project By Id Completed",
  ProjectEditTriggered = "[Snovasys-PM][Project Component] Project Edit Triggered",
  ProjectEditCompleted = "[Snovasys-PM][Project Component]  Projetc Edit Completed",
  ProjectEditFailed = "[Snovasys-PM][Project Component] Edit Project Failed",
}

export class LoadProjectsTriggered implements Action {
  type = ProjectActionTypes.LoadProjectsTriggered;
  projects: ProjectSearchResult[];
  project: Project;
  validationMessages: ValidationModel[];
  projectId: string;
  errorMessage: string;
   selectedGoal: GoalModel;
   projectUpdate: { projectUpdate: Update<Project>};
   archivedProject: ArchivedProjectInputModel;
  constructor(public projectsSearchResult: ProjectSearchCriteriaInputModel) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadingAllProjectsTriggered implements Action {
  type = ProjectActionTypes.LoadProjectsTriggered;
  projects: ProjectSearchResult[];
  project: Project;
  validationMessages: ValidationModel[];
  projectId: string;
  errorMessage: string;
  selectedGoal: GoalModel;
  projectUpdate: { projectUpdate: Update<Project>};
  archivedProject: ArchivedProjectInputModel;
  projectsSearchResult: ProjectSearchCriteriaInputModel;
  constructor() {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadProjectsCompleted implements Action {
  type = ProjectActionTypes.LoadProjectsCompleted;
  project: Project;
  validationMessages: ValidationModel[];
  projectId: string;
  projectsSearchResult: ProjectSearchCriteriaInputModel;
  errorMessage: string;
  selectedGoal: GoalModel;
  projectUpdate: { projectUpdate: Update<Project>};
  archivedProject: ArchivedProjectInputModel;
  constructor(public projects: ProjectSearchResult[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class EditProjectTriggered implements Action {
  type = ProjectActionTypes.EditProjectTriggered;
  projects: ProjectSearchResult[];
  project: Project;
  validationMessages: ValidationModel[];
  projectsSearchResult: ProjectSearchCriteriaInputModel;
  errorMessage: string;
  selectedGoal: GoalModel;
  projectUpdate: { projectUpdate: Update<Project>};
  archivedProject: ArchivedProjectInputModel;
  constructor(public projectId: string) {}
}

export class ProjectEditTriggered implements Action {
  type = ProjectActionTypes.ProjectEditTriggered;
  projects: ProjectSearchResult[];
  project: Project;
  validationMessages: ValidationModel[];
  projectsSearchResult: ProjectSearchCriteriaInputModel;
  errorMessage: string;
  selectedGoal: GoalModel;
  projectUpdate: { projectUpdate: Update<Project>};
  archivedProject: ArchivedProjectInputModel;
  constructor(public projectId: string) {}
}

export class ProjectEditCompleted implements Action {
  type = ProjectActionTypes.ProjectEditCompleted;
  validationMessages: ValidationModel[];
  projectId: string;
  projects: ProjectSearchResult[];
  projectsSearchResult: ProjectSearchCriteriaInputModel;
  errorMessage: string;
  selectedGoal: GoalModel;
  projectUpdate: { projectUpdate: Update<Project>};
  archivedProject: ArchivedProjectInputModel;
  constructor(public project: Project) {}
}

export class ProjectEditFailed implements Action {
  type = ProjectActionTypes.ProjectEditFailed;
  project: Project;
  projectId: string;
  projects: ProjectSearchResult[];
  projectsSearchResult: ProjectSearchCriteriaInputModel;
  errorMessage: string;
  selectedGoal: GoalModel;
  projectUpdate: { projectUpdate: Update<Project>};
  archivedProject: ArchivedProjectInputModel;
  constructor(public validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class EditProjectCompleted implements Action {
  type = ProjectActionTypes.EditProjectsCompleted;
  validationMessages: ValidationModel[];
  projectId: string;
  projects: ProjectSearchResult[];
  projectsSearchResult: ProjectSearchCriteriaInputModel;
  errorMessage: string;
  selectedGoal: GoalModel;
  projectUpdate: { projectUpdate: Update<Project>};
  archivedProject: ArchivedProjectInputModel;
  constructor(public project: Project) {}
}

// tslint:disable-next-line: max-classes-per-file
export class EditProjectsFailed implements Action {
  type = ProjectActionTypes.EditProjectsFailed;
  project: Project;
  projectId: string;
  projects: ProjectSearchResult[];
  projectsSearchResult: ProjectSearchCriteriaInputModel;
  errorMessage: string;
  selectedGoal: GoalModel;
  projectUpdate: { projectUpdate: Update<Project>};
  archivedProject: ArchivedProjectInputModel;
  constructor(public validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadProjectsFailed implements Action {
  type = ProjectActionTypes.LoadProjectsFailed;
  project: Project;
  projectId: string;
  projects: ProjectSearchResult[];
  projectsSearchResult: ProjectSearchCriteriaInputModel;
  errorMessage: string;
  selectedGoal: GoalModel;
  projectUpdate: { projectUpdate: Update<Project>};
  archivedProject: ArchivedProjectInputModel;
  constructor(public validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class CreateProjectTriggered implements Action {
  type = ProjectActionTypes.CreateProjectTriggered;
  projectId: string;
  validationMessages: ValidationModel[];
  projects: ProjectSearchResult[];
  projectsSearchResult: ProjectSearchCriteriaInputModel;
  errorMessage: string;
  selectedGoal: GoalModel;
  projectUpdate: { projectUpdate: Update<Project>};
  archivedProject: ArchivedProjectInputModel;
  constructor(public project: Project) {}
}

// tslint:disable-next-line: max-classes-per-file
export class CreateProjectCompleted implements Action {
  type = ProjectActionTypes.CreateProjectCompleted;
  project: Project;
  validationMessages: ValidationModel[];
  projects: ProjectSearchResult[];
  projectsSearchResult: ProjectSearchCriteriaInputModel;
  errorMessage: string;
  selectedGoal: GoalModel;
  projectUpdate: { projectUpdate: Update<Project>};
  archivedProject: ArchivedProjectInputModel;
  constructor(public projectId: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class CreateProjectFailed implements Action {
  type = ProjectActionTypes.CreateProjectFailed;
  project: Project;
  projectId: string;
  projects: ProjectSearchResult[];
  projectsSearchResult: ProjectSearchCriteriaInputModel;
  errorMessage: string;
  selectedGoal: GoalModel;
  projectUpdate: { projectUpdate: Update<Project>};
  archivedProject: ArchivedProjectInputModel;
  constructor(public validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ArchiveProjectTriggered implements Action {
  type = ProjectActionTypes.ArchiveProjectTriggered;
  projectId: string;
  validationMessages: ValidationModel[];
  projects: ProjectSearchResult[];
  projectsSearchResult: ProjectSearchCriteriaInputModel;
  errorMessage: string;
  selectedGoal: GoalModel;
  projectUpdate: { projectUpdate: Update<Project>};
  project: Project;
  constructor(public archivedProject: ArchivedProjectInputModel) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ArchiveProjectFailed implements Action {
  type = ProjectActionTypes.ArchiveProjectFailed;
  project: Project;
  projectId: string;
  projects: ProjectSearchResult[];
  projectsSearchResult: ProjectSearchCriteriaInputModel;
  errorMessage: string;
  selectedGoal: GoalModel;
  projectUpdate: { projectUpdate: Update<Project>};
  archivedProject: ArchivedProjectInputModel;
  constructor(public validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ArchiveProjectCompleted implements Action {
  type = ProjectActionTypes.ArchiveProjectCompleted;
  project: Project;
  projects: ProjectSearchResult[];
  projectsSearchResult: ProjectSearchCriteriaInputModel;
  errorMessage: string;
  validationMessages: ValidationModel[];
  selectedGoal: GoalModel;
  projectUpdate: { projectUpdate: Update<Project>};
  archivedProject: ArchivedProjectInputModel;
  constructor(public projectId: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class GoalChangedInGoalView implements Action {
     type = ProjectActionTypes.GoalChangedInGoalView;
     project: Project;
    projects: ProjectSearchResult[];
    projectsSearchResult: ProjectSearchCriteriaInputModel;
    errorMessage: string;
    validationMessages: ValidationModel[];
     projectUpdate: { projectUpdate: Update<Project>};
     archivedProject: ArchivedProjectInputModel;
     projectId: string;
     constructor(public selectedGoal: GoalModel) {}
   }

// tslint:disable-next-line: max-classes-per-file
export class RefreshProjectsList implements Action {
  type = ProjectActionTypes.RefreshProjectsList;
  validationMessages: ValidationModel[];
  projectId: string;
  projects: ProjectSearchResult[];
  projectsSearchResult: ProjectSearchCriteriaInputModel;
  errorMessage: string;
  selectedGoal: GoalModel;
  projectUpdate: { projectUpdate: Update<Project>};
  archivedProject: ArchivedProjectInputModel;
  constructor(public project: Project) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ProjectCompletedWithInPlaceUpdate implements Action {
  type = ProjectActionTypes.ProjectCompletedWithInPlaceUpdate;
  validationMessages: ValidationModel[];
  projectId: string;
  projects: ProjectSearchResult[];
  projectsSearchResult: ProjectSearchCriteriaInputModel;
  errorMessage: string;
  selectedGoal: GoalModel;
  project: Project;
  archivedProject: ArchivedProjectInputModel;
  constructor(public projectUpdate: { projectUpdate: Update<Project>}) {}
}
// tslint:disable-next-line: max-classes-per-file
export class ProjectExceptionHandled implements Action {
  type = ProjectActionTypes.ProjectExceptionHandled;
  project: Project;
  projectId: string;
  projects: ProjectSearchResult[];
  projectsSearchResult: ProjectSearchCriteriaInputModel;
  validationMessages: ValidationModel[];
  selectedGoal: GoalModel;
  projectUpdate: { projectUpdate: Update<Project>};
  archivedProject: ArchivedProjectInputModel;
  constructor(public errorMessage: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class GetProjectByIdTriggered implements Action {
  type = ProjectActionTypes.GetProjectByIdTriggered;
  projects: ProjectSearchResult[];
  project: Project;
  validationMessages: ValidationModel[];
  projectsSearchResult: ProjectSearchCriteriaInputModel;
  errorMessage: string;
  selectedGoal: GoalModel;
  projectUpdate: { projectUpdate: Update<Project>};
  archivedProject: ArchivedProjectInputModel;
  constructor(public projectId: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class GetProjectByIdCompleted implements Action {
  type = ProjectActionTypes.GetProjectByIdCompleted;
  validationMessages: ValidationModel[];
  projectId: string;
  projects: ProjectSearchResult[];
  projectsSearchResult: ProjectSearchCriteriaInputModel;
  errorMessage: string;
  selectedGoal: GoalModel;
  projectUpdate: { projectUpdate: Update<Project>};
  archivedProject: ArchivedProjectInputModel;
  constructor(public project: Project) {}
}

export type ProjectActions =
  | LoadProjectsTriggered
  | LoadProjectsCompleted
  | CreateProjectTriggered
  | CreateProjectFailed
  | CreateProjectCompleted
  | EditProjectTriggered
  | EditProjectCompleted
  | EditProjectsFailed
  | ProjectExceptionHandled
  | ArchiveProjectTriggered
  | ArchiveProjectCompleted
  | ArchiveProjectFailed
  | GoalChangedInGoalView
  | RefreshProjectsList
  | ProjectCompletedWithInPlaceUpdate
  | GetProjectByIdTriggered
  | GetProjectByIdCompleted
  | LoadProjectsFailed
  | ProjectEditTriggered
  | ProjectEditCompleted
  | ProjectEditFailed
