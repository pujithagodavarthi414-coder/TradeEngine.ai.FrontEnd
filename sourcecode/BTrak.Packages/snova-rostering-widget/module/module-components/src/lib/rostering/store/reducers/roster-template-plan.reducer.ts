import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { RosterTemplatePlanOutputByRequestModel } from "../../models/roster-request-template-plan-model";
import { EmployeeRosterActions, EmployeeRosterActionTypes } from "../actions/roster.action";

export interface State extends EntityState<RosterTemplatePlanOutputByRequestModel> {
    loadingEmployeeRoster: boolean;
    creatingEmployeeRoster: boolean;
    validationMessages: any[];
    errorMessage: string;
    rosterRequestId: string;
    rosterTemplatePlans: RosterTemplatePlanOutputByRequestModel[];
    gettingRosterSolutionById: boolean;
}

export const rosterPlanAdapter: EntityAdapter<RosterTemplatePlanOutputByRequestModel> =
    createEntityAdapter<RosterTemplatePlanOutputByRequestModel>({
        selectId: (rosterPlan: RosterTemplatePlanOutputByRequestModel) => rosterPlan.planId
    });

const initialState: State = rosterPlanAdapter.getInitialState({
    loadingEmployeeRoster: false,
    creatingEmployeeRoster: false,
    validationMessages: [""],
    errorMessage: "",
    rosterRequestId: "",
    rosterTemplatePlans: [],
    gettingRosterSolutionById: false
});

export function reducer(state: State = initialState, action: EmployeeRosterActions): State {
    switch (action.type) {
        case EmployeeRosterActionTypes.LoadEmployeeRosterTemplatePlansTriggered: return { ...state, loadingEmployeeRoster: true };
        case EmployeeRosterActionTypes.LoadEmployeeRosterTemplatePlansCompleted:
            return rosterPlanAdapter.addAll(action.rosterTemplatePlans, {
                ...state, loadingEmployeeRoster: false
            });
        case EmployeeRosterActionTypes.LoadEmployeeRosterTemplatePlansFailed:
            return { ...state, loadingEmployeeRoster: false, validationMessages: action.validationMessages, };
        default:
            return state;
    }
}
