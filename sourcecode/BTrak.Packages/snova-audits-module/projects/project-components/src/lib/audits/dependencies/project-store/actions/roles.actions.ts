import { Action } from "@ngrx/store";
import { RoleModelBase } from "../../models/RoleModelBase";

export enum RoleActionTypes {
  LoadRolesTriggered = "[SnovaAudisModule Role Component] Initial Data Load Triggered",
  LoadRolesCompleted = "[SnovaAudisModule Role Component] Initial Data Load Completed",
  LoadRolesCompletedFromCache = "[SnovaAudisModule Role Component] Initial Data Load Completed From Cache"
}

export class LoadRolesTriggered implements Action {
  type = RoleActionTypes.LoadRolesTriggered;
  Roles: RoleModelBase[];
}

// tslint:disable-next-line: max-classes-per-file
export class LoadRolesCompleted implements Action {
  type = RoleActionTypes.LoadRolesCompleted;

  constructor(public Roles: RoleModelBase[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadRolesCompletedFromCache implements Action {
  type = RoleActionTypes.LoadRolesCompletedFromCache;
  Roles: RoleModelBase[]
  constructor() {}
}

export type RoleActions = LoadRolesTriggered | LoadRolesCompleted | LoadRolesCompletedFromCache;
