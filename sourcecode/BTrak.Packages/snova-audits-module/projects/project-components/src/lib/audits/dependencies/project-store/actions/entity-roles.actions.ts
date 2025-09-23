import { Action } from "@ngrx/store";
import { EntityRoleModel } from "../../models/entity-role-model";

export enum EntityRoleActionTypes {
  LoadEntityRolesTriggered = "[SnovaAudisModule EntityRole Component] Initial Data Load Triggered",
  LoadEntityRolesCompleted = "[SnovaAudisModule EntityRole Component] Initial Data Load Completed",
  LoadEntityRolesCompletedFromCache = "[SnovaAudisModule EntityRole Component] Initial Data Load Completed From Cache"
}

export class LoadEntityRolesTriggered implements Action {
  type = EntityRoleActionTypes.LoadEntityRolesTriggered;
  entityRoles: EntityRoleModel[];
}

// tslint:disable-next-line: max-classes-per-file
export class LoadEntityRolesCompleted implements Action {
  type = EntityRoleActionTypes.LoadEntityRolesCompleted;

  constructor(public entityRoles: EntityRoleModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadEntityRolesCompletedFromCache implements Action {
  type = EntityRoleActionTypes.LoadEntityRolesCompletedFromCache;
  entityRoles: EntityRoleModel[]
  constructor() {}
}

export type EntityRoleActions = LoadEntityRolesTriggered | LoadEntityRolesCompleted | LoadEntityRolesCompletedFromCache;
