import { RosterRequestModel } from "../../models/roster-request-model";
import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { EmployeeRosterActions, EmployeeRosterActionTypes } from "../actions/roster.action";

export interface State extends EntityState<any> {
    loadingEmployeeRoster: boolean;
    creatingEmployeeRoster: boolean;
    requestId: string;
    validationMessages: any[];
    errorMessage: string;
    rosterRequestId: string;
    rosterSolutionsOutput: any[];
    rosterRequest: RosterRequestModel;
    gettingRosterSolutionById: boolean;
}

export const rosterRequestAdapter: EntityAdapter<RosterRequestModel> =
    createEntityAdapter<RosterRequestModel>({
        selectId: (request: RosterRequestModel) => request.requestId
    });

const initialState: State = rosterRequestAdapter.getInitialState({
    loadingEmployeeRoster: false,
    creatingEmployeeRoster: false,
    requestId: "",
    validationMessages: [""],
    errorMessage: "",
    rosterRequestId: "",
    rosterRequest: null,
    rosterSolutionsOutput: [],
    gettingRosterSolutionById: false
});

export function reducer(state: State = initialState, action: EmployeeRosterActions): State {
    switch (action.type) {
        case EmployeeRosterActionTypes.GetRosterSolutionsByIdTriggered:
            return { ...state, creatingEmployeeRoster: true };
        case EmployeeRosterActionTypes.GetRosterSolutionsByIdCompleted:
            return rosterRequestAdapter.addAll(action.rosterSolutionsOutput, {
                ...state, creatingEmployeeRoster: false
            });
        case EmployeeRosterActionTypes.GetRosterSolutionsByIdFailed:
            return { ...state, creatingEmployeeRoster: false, validationMessages: action.validationMessages };
        case EmployeeRosterActionTypes.GetEmployeeRosterPlanRequestByIdTriggered:
            return { ...state, creatingEmployeeRoster: true };
        case EmployeeRosterActionTypes.GetEmployeeRosterPlanRequestByIdCompleted:
            return {...state, creatingEmployeeRoster: false, rosterRequest: action.rosterRequest };
        case EmployeeRosterActionTypes.GetEmployeeRosterPlanRequestByIdFailed:
            return { ...state, creatingEmployeeRoster: false, validationMessages: action.validationMessages };
            
        default:
            return state;
    }
}
