import { Update } from "@ngrx/entity";
import { Action } from "@ngrx/store";
import { ProjectSearchResult } from '../../models/project-search-result.model';
import { Project } from '../../models/project.model';
import { ValidationModel } from '../../models/validation.model';
import { GoalModel } from '../../models/goal.model';
import { ArchivedProjectInputModel } from '../../models/archive-project-input.model';
import { ProjectSearchCriteriaInputModel } from '../../models/project-search-criteria-input.model';

export enum ProjectActionTypes {
  LoadProjectsTriggered = "[Dashboard Module Project Component] Initial Data Load Triggered",
  LoadProjectsCompleted = "[Dashboard Module Project Component] Initial Data Load Completed",
  LoadProjectsFailed = "[Dashboard Module Project Component] Initial Data Load Failed",
  CreateProjectTriggered = "[Dashboard Module Project Component] Create Project Triggered",
  CreateProjectCompleted = "[Dashboard Module Project Component] Create Project Completed",
  CreateProjectFailed = "[Dashboard Module Project Component] Create Project Failed",
  EditProjectTriggered = "[Dashboard Module Project Component] Edit Project Triggered",
  EditProjectsCompleted = "[Dashboard Module Project Component] Edit Projetc Completed",
  EditProjectsFailed = "[Dashboard Module Project Component] Edit Project Failed",
  ExceptionHandled = "[Dashboard Module Project Component] HandleException",
  ArchiveProjectTriggered = "[Dashboard Module Project Component] Archive Projetc Triggered",
  ArchiveProjectCompleted = "[Dashboard Module Project Component] Archive Projetc Completed",
  ArchiveProjectFailed = "[Dashboard Module Project Component] Archive Projetc Failed",
  GoalChangedInGoalView = "[Dashboard Module Project Component] Goal Changed In Goal View",
  RefreshProjectsList = "[Dashboard Module Project Component] Refresh Projects List",
  ProjectCompletedWithInPlaceUpdate = "[Dashboard Module Project Component]Project Completed With In Place Update",
  GetProjectByIdTriggered = "[Dashboard Module Project Component] Get Project By Id Triggered",
  GetProjectByIdCompleted = "[Dashboard Module Project Component] Get Project By Id Completed",
  ProjectEditTriggered = "[Dashboard Module Project Component] Project Edit Triggered",
  ProjectEditCompleted = "[Dashboard Module Project Component]  Projetc Edit Completed",
  ProjectEditFailed = "[Dashboard Module Project Component] Edit Project Failed",
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
export class ExceptionHandled implements Action {
  type = ProjectActionTypes.ExceptionHandled;
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
  | ExceptionHandled
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
