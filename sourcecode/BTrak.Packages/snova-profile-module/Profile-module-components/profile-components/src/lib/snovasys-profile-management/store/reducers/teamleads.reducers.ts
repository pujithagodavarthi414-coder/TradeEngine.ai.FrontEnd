import { EntityState, createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { TeamLeads } from "../../models/teamleads.model";
import {
  TeamLeadsActions,
  TeamLeadsActionTypes
} from "../actions/teamleads.action";

export interface State extends EntityState<TeamLeads> {
  loadingTeamLeads: boolean;
  exceptionMessage:string;
  validationMessages:string[];
}

export const teamLeadsAdapter: EntityAdapter<TeamLeads> = createEntityAdapter<
TeamLeads
>({
  selectId: (teamLeads: TeamLeads) => teamLeads.teamMemberId
});

export const initialState: State = teamLeadsAdapter.getInitialState({
    loadingTeamLeads: false,
  exceptionMessage:'',
  validationMessages:['']
});

export function reducer(
  state: State = initialState,
  action: TeamLeadsActions
): State {
  switch (action.type) {
    case TeamLeadsActionTypes.LoadTeamLeadsTriggered:
      return { ...state, loadingTeamLeads: true };
    case TeamLeadsActionTypes.LoadTeamLeadsCompleted:
      return teamLeadsAdapter.addAll(action.teamLeadsList, {
        ...state,
        loadingTeamLeads: false
      });
    case TeamLeadsActionTypes.ExceptionHandled:
      return { ...state, exceptionMessage: action.errorMessage,loadingTeamLeads: false };
      case TeamLeadsActionTypes.LoadTeamLeadsFailed:
        return { ...state, validationMessages: action.validationMessages,loadingTeamLeads: false };
    default:
      return state;
  }
}
