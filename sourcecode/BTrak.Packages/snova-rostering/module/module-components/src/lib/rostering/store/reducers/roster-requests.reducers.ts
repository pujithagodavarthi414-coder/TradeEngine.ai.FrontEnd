import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { RosterRequestModel } from "../../models/roster-request-model";
import { EmployeeRosterActions, EmployeeRosterActionTypes } from "../actions/roster.action";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<RosterRequestModel> {
    loadingEmployeeRoster: boolean;
    creatingEmployeeRoster: boolean;
    validationMessages: any[];
    errorMessage: string;
    rosterRequestId: string;
    rosterRequest: RosterRequestModel;
    rosterRequests: RosterRequestModel[];
    gettingRosterSolutionById: boolean;
}

export const rosterRequestAdapter: EntityAdapter<RosterRequestModel> =
    createEntityAdapter<RosterRequestModel>({
        selectId: (rosterRequest: RosterRequestModel) => rosterRequest.requestId
    });

const initialState: State = rosterRequestAdapter.getInitialState({
    loadingEmployeeRoster: false,
    creatingEmployeeRoster: false,
    validationMessages: [""],
    errorMessage: "",
    rosterRequestId: "",
    rosterRequest: null,
    rosterRequests: [],
    gettingRosterSolutionById: false
});

export function reducer(state: State = initialState, action: EmployeeRosterActions): State {
    switch (action.type) {
        case EmployeeRosterActionTypes.LoadEmployeeRosterPlansTriggered: return { ...state, loadingEmployeeRoster: true };
        case EmployeeRosterActionTypes.LoadEmployeeRosterPlansCompleted:
            return rosterRequestAdapter.addAll(action.rosterRequests, {
                ...state, loadingEmployeeRoster: false
            });
        case EmployeeRosterActionTypes.LoadEmployeeRosterPlansFailed:
            return { ...state, loadingEmployeeRoster: false };
        case EmployeeRosterActionTypes.UpdateEmployeeRosterPlanByRequestId:
            return rosterRequestAdapter.updateOne(action.rosterRequestUpdates.rosterRequestUpdate, state);
        default:
            return state;
    }
}
