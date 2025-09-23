import { Update } from "@ngrx/entity";
import { Action } from "@ngrx/store";
// tslint:disable-next-line: ordered-imports
import { ValidationModel } from '../../models/validation-messages';
import { ProjectMember } from "../../models/projectMember";

export enum ProjectMembersActionTypes {
  LoadProjectMembersTriggered = "[Snovasys-PM][Project Member Component] Initial Data Load Triggered",
  LoadProjectMembersCompleted = "[Snovasys-PM][Project Member Component] Initial Data Load Completed",
  LoadProjectMembersFailed = "[Snovasys-PM][Project Member Component] Initial Data Load Failed",
  CreateProjectMembersTriggered = "[Snovasys-PM][Project Member Component] Create Project Member Triggered",
  CreateProjectMembersCompleted = "[Snovasys-PM][Project Member Component] Create Project Member Completed",
  CreateProjectMembersFailed = "[Snovasys-PM][Project Member Component] Create Project Member Failed",
  ProjectMembersExceptionHandled = "[Snovasys-PM][Project Member Component] Project Member Exception Handled",
  DeleteProjectMembersTriggered = "[Snovasys-PM][Project Member Component] Delete Project Member Triggered",
  DeleteProjectMembersCompleted = "[Snovasys-PM][Project Member Component] Delete Project Member Completed",
  DeleteProjectMembersFailed = "[Snovasys-PM][Project Member Component] Delete Project Member Failed",
  GetProjectMemberByIdTriggered = "[Snovasys-PM][Project Member Component] Get ProjectMember ById Triggered",
  GetProjectMemberByIdCompleted = "[Snovasys-PM][Project Member Component] Get ProjectMember ById Completed",
  GetProjectMemberByIdFailed = "[Snovasys-PM][Project Member Component] Get ProjectMember ById Failed",
  UpdateProjectMemberList = "[Snovasys-PM][Project Member Component] Update ProjectMember Component",
  RefreshProjectMembersList = "[Snovasys-PM][Project Member CComponent]Refresh ProjectMembers",
  GetNewProjectMembersList = "[Snovasys-PM][Project Member Component]Get Project Members List"

}

export class LoadMemberProjectsTriggered implements Action {
  type = ProjectMembersActionTypes.LoadProjectMembersTriggered;
  projectMembers: ProjectMember[];
  projectMemberId: string;
  projectMember: ProjectMember;
  validationMessages: ValidationModel[];
  errorMessage: string;
  projectMemberUpdate: { projectMemberUpdate: Update<ProjectMember>};
  constructor(public projectId: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadMemberProjectsCompleted implements Action {
  type = ProjectMembersActionTypes.LoadProjectMembersCompleted;
  projectId: string;
  projectMemberId: string;
  projectMember: ProjectMember;
  validationMessages: ValidationModel[];
  errorMessage: string;
  projectMemberUpdate: { projectMemberUpdate: Update<ProjectMember>};
  constructor(public projectMembers: ProjectMember[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class CreateProjectMemberTriggered implements Action {
  type = ProjectMembersActionTypes.CreateProjectMembersTriggered;
  projectId: string;
  validationMessages: ValidationModel[];
  projectMembers: ProjectMember[];
  projectMemberId: string;
  errorMessage: string;
  projectMemberUpdate: { projectMemberUpdate: Update<ProjectMember>};
  constructor(public projectMember: ProjectMember) {}
}

// tslint:disable-next-line: max-classes-per-file
export class CreateProjectMemberCompleted implements Action {
  type = ProjectMembersActionTypes.CreateProjectMembersCompleted;
  validationMessages: ValidationModel[];
  projectMembers: ProjectMember[];
  projectMember: ProjectMember;
  projectMemberId: string;
  errorMessage: string;
  projectMemberUpdate: { projectMemberUpdate: Update<ProjectMember>};
  constructor(public projectId: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class CreateProjectMemberFailed implements Action {
  type = ProjectMembersActionTypes.CreateProjectMembersFailed;
  projectMembers: ProjectMember[];
  projectMember: ProjectMember;
  projectId: string;
  projectMemberId: string;
  errorMessage: string;
  projectMemberUpdate: { projectMemberUpdate: Update<ProjectMember>};
  constructor(public validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadProjectMembersFailed implements Action {
  type = ProjectMembersActionTypes.LoadProjectMembersFailed;
  projectMembers: ProjectMember[];
  projectMember: ProjectMember;
  projectId: string;
  projectMemberId: string;
  errorMessage: string;
  projectMemberUpdate: { projectMemberUpdate: Update<ProjectMember>};
  constructor(public validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class DeleteProjectMembersTriggered implements Action {
  type = ProjectMembersActionTypes.DeleteProjectMembersTriggered;
  projectMembers: ProjectMember[];
  projectMemberId: string;
  projectId: string;
  validationMessages: ValidationModel[];
  errorMessage: string;
  projectMemberUpdate: { projectMemberUpdate: Update<ProjectMember>};
  constructor(public  projectMember: ProjectMember) {}
}

// tslint:disable-next-line: max-classes-per-file
export class DeleteProjectMembersCompleted implements Action {
  type = ProjectMembersActionTypes.DeleteProjectMembersCompleted;
  projectMembers: ProjectMember[];
  projectMember: ProjectMember;
  projectId: string;
  validationMessages: ValidationModel[];
  errorMessage: string;
  projectMemberUpdate: { projectMemberUpdate: Update<ProjectMember>};
  constructor(public  projectMemberId: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class DeleteProjectMembersFailed implements Action {
  type = ProjectMembersActionTypes.DeleteProjectMembersFailed;
  projectMembers: ProjectMember[];
  projectMember: ProjectMember;
  projectId: string;
  projectMemberId: string;
  errorMessage: string;
  projectMemberUpdate: { projectMemberUpdate: Update<ProjectMember>};
  constructor(public validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class GetProjectMemberByIdTriggered implements Action {
  type = ProjectMembersActionTypes.GetProjectMemberByIdTriggered;
  projectMembers: ProjectMember[];
  projectMember: ProjectMember;
  validationMessages: ValidationModel[];
  errorMessage: string;
  projectMemberUpdate: { projectMemberUpdate: Update<ProjectMember>};
  constructor(public  projectMemberId: string,public projectId: string) {}
}

// tslint:disable-next-line: max-classes-per-file
export class GetProjectMemberByIdCompleted implements Action {
  type = ProjectMembersActionTypes.GetProjectMemberByIdCompleted;
  projectMembers: ProjectMember[];
  projectMemberId: string;
  projectId: string;
  validationMessages: ValidationModel[];
  errorMessage: string;
  projectMemberUpdate: { projectMemberUpdate: Update<ProjectMember>};
  constructor(public  projectMember: ProjectMember) {}
}

// tslint:disable-next-line: max-classes-per-file
export class GetProjectMemberByIdFailed implements Action {
  type = ProjectMembersActionTypes.GetProjectMemberByIdFailed;
  projectMembers: ProjectMember[];
  projectMember: ProjectMember;
  projectId: string;
  projectMemberId: string;
  errorMessage: string;
  projectMemberUpdate: { projectMemberUpdate: Update<ProjectMember>};
  constructor(public validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class UpdateProjectMemberList implements Action {
  type = ProjectMembersActionTypes.UpdateProjectMemberList;
  projectMembers: ProjectMember[];
  projectMember: ProjectMember;
  projectId: string;
  projectMemberId: string;
  errorMessage: string;
  validationMessages: ValidationModel[];
  constructor(public projectMemberUpdate: { projectMemberUpdate: Update<ProjectMember>}) {}
}

// tslint:disable-next-line: max-classes-per-file
export class RefreshProjectMembersList implements Action {
  type = ProjectMembersActionTypes.RefreshProjectMembersList;
  projectId: string;
  projectMemberId: string;
  projectMember: ProjectMember;
  validationMessages: ValidationModel[];
  errorMessage: string;
  projectMemberUpdate: { projectMemberUpdate: Update<ProjectMember>};
  constructor(public projectMembers: ProjectMember[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class GetNewProjectMembersList implements Action {
  type = ProjectMembersActionTypes.GetNewProjectMembersList;
  projectId: string;
  projectMemberId: string;
  validationMessages: ValidationModel[];
  errorMessage: string;
  projectMemberUpdate: { projectMemberUpdate: Update<ProjectMember>};
  projectMembers: ProjectMember[];
  constructor(public  projectMember: ProjectMember) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ProjectMembersExceptionHandled implements Action {
  type = ProjectMembersActionTypes.CreateProjectMembersCompleted;
  projectMembers: ProjectMember[];
  projectMember: ProjectMember;
  projectId: string;
  projectMemberId: string;
  validationMessages: ValidationModel[];
  projectMemberUpdate: { projectMemberUpdate: Update<ProjectMember>};
  constructor(public errorMessage: string) {}
}

export type ProjectMemberActions =
  | LoadMemberProjectsTriggered
  | LoadMemberProjectsCompleted
  | CreateProjectMemberTriggered
  | CreateProjectMemberCompleted
  | CreateProjectMemberFailed
  | ProjectMembersExceptionHandled
  | DeleteProjectMembersTriggered
  | DeleteProjectMembersCompleted
  | DeleteProjectMembersFailed
  | LoadProjectMembersFailed
  | GetProjectMemberByIdTriggered
  | GetProjectMemberByIdCompleted
  | GetProjectMemberByIdFailed
  | UpdateProjectMemberList
  | RefreshProjectMembersList
  | GetNewProjectMembersList;
