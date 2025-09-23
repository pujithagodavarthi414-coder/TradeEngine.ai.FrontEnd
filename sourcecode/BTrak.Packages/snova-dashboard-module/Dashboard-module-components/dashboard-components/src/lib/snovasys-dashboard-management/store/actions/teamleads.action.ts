import { Action } from "@ngrx/store";
import { TeamLeads } from "../../models/teamleads.model";

export enum TeamLeadsActionTypes {
  LoadTeamLeadsTriggered = "[Dashboard Module TeamLeads Component] Initial Data Load Triggered",
  LoadTeamLeadsCompleted = "[Dashboard Module TeamLeads Component] Initial Data Load Completed",
  LoadTeamLeadsFailed = "[Dashboard Module TeamLeads Component] Initial Data Load Failed",
  ExceptionHandled = "[Dashboard Module TeamLeads Component] Exception Handled"
}

export class LoadTeamLeadsTriggered implements Action {
  type = TeamLeadsActionTypes.LoadTeamLeadsTriggered;
  teamLeadsList: TeamLeads[];
  errorMessage:string;
  validationMessages:string[];
}

export class LoadTeamLeadsCompleted implements Action {
  type = TeamLeadsActionTypes.LoadTeamLeadsCompleted;
  validationMessages:string[];
  errorMessage:string;
  constructor(public teamLeadsList: TeamLeads[]) {}
}


export class LoadTeamLeadsFailed implements Action {
    type = TeamLeadsActionTypes.LoadTeamLeadsFailed;
    errorMessage:string;
    teamLeadsList: TeamLeads[];
    constructor(public validationMessages:string[]) {}
  }

  
export class ExceptionHandled implements Action {
    type = TeamLeadsActionTypes.ExceptionHandled;
    teamLeadsList: TeamLeads[];
    validationMessages:string[];
    constructor(public errorMessage:string) {}
  }

export type TeamLeadsActions =
  | LoadTeamLeadsTriggered
  | LoadTeamLeadsCompleted
  | LoadTeamLeadsFailed
  | ExceptionHandled;
