import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { RosterPlanOutputByRequestModel } from "../../models/roster-request-plan-model";
import { EmployeeRosterActions, EmployeeRosterActionTypes } from "../actions/roster.action";

export interface State extends EntityState<RosterPlanOutputByRequestModel> {
    loadingEmployeeRoster: boolean;
    creatingEmployeeRoster: boolean;
    validationMessages: any[];
    errorMessage: string;
    rosterRequestId: string;
    rosterPlan: RosterPlanOutputByRequestModel;
    rosterPlans: RosterPlanOutputByRequestModel[];
    gettingRosterSolutionById: boolean;
}

export const rosterPlanAdapter: EntityAdapter<RosterPlanOutputByRequestModel> =
    createEntityAdapter<RosterPlanOutputByRequestModel>({
        selectId: (rosterPlan: RosterPlanOutputByRequestModel) => rosterPlan.planId
    });

const initialState: State = rosterPlanAdapter.getInitialState({
    loadingEmployeeRoster: false,
    creatingEmployeeRoster: false,
    validationMessages: [""],
    errorMessage: "",
    rosterRequestId: "",
    rosterPlan: null,
    rosterPlans: [],
    gettingRosterSolutionById: false
});

export function reducer(state: State = initialState, action: EmployeeRosterActions): State {
    switch (action.type) {
        case EmployeeRosterActionTypes.GetEmployeeRosterByIdTriggered: return { ...state, loadingEmployeeRoster: true };
        case EmployeeRosterActionTypes.GetEmployeeRosterByIdCompleted:
            return rosterPlanAdapter.addAll(action.rosterPlans, {
                ...state, loadingEmployeeRoster: false
            });
        case EmployeeRosterActionTypes.GetEmployeeRosterByIdFailed:
            return { ...state, loadingEmployeeRoster: false, validationMessages: action.validationMessages, };
        default:
            return state;
    }
}
