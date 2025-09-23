import { RosterPlanSolution } from "../../models/roster-plan-solution-model";
import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { EmployeeRosterActions, EmployeeRosterActionTypes } from "../actions/roster.action";

export interface State extends EntityState<RosterPlanSolution> {
    loadingEmployeeRoster: boolean;
    creatingEmployeeRoster: boolean;
    approvingEmployeeRoster: boolean;
    validationMessages: any[];
    errorMessage: string;
    rosterRequestId: string;
    rosterSolution: RosterPlanSolution;
    rosterSolutions: RosterPlanSolution[];
    gettingRosterSolutionById: boolean;
}

export const rosterSolutionAdapter: EntityAdapter<RosterPlanSolution> =
    createEntityAdapter<RosterPlanSolution>({
        selectId: (rosterSolution: RosterPlanSolution) => rosterSolution.solution.solutionId
    });

const initialState: State = rosterSolutionAdapter.getInitialState({
    loadingEmployeeRoster: false,
    creatingEmployeeRoster: false,
    approvingEmployeeRoster: false,
    validationMessages: [""],
    errorMessage: "",
    rosterRequestId: "",
    rosterSolution: null,
    rosterSolutions: [],
    gettingRosterSolutionById: false
});

export function reducer(state: State = initialState, action: EmployeeRosterActions): State {
    switch (action.type) {
        case EmployeeRosterActionTypes.CreateEmployeeRosterSolutionTriggered:
            return { ...state, creatingEmployeeRoster: true };
        case EmployeeRosterActionTypes.CreateEmployeeRosterSolutionCompleted:
            return rosterSolutionAdapter.addAll(action.rosterSolutions, {
                ...state, creatingEmployeeRoster: false
            });
        case EmployeeRosterActionTypes.CreateEmployeeRosterSolutionFailed:
            return { ...state, creatingEmployeeRoster: false, validationMessages: action.validationMessages };
        case EmployeeRosterActionTypes.CreateEmployeeRosterPlanTriggered: return { ...state, creatingEmployeeRoster: true };
        case EmployeeRosterActionTypes.CreateEmployeeRosterPlanCompleted:
            return { ...state, rosterRequestId: action.requestId, creatingEmployeeRoster: false };
        case EmployeeRosterActionTypes.CreateEmployeeRosterPlanFailed:
            return { ...state, creatingEmployeeRoster: false, validationMessages: action.validationMessages };
        case EmployeeRosterActionTypes.ApproveEmployeeRosterTriggered: return { ...state, approvingEmployeeRoster: true };
        case EmployeeRosterActionTypes.ApproveEmployeeRosterCompleted:
            return { ...state, rosterRequestId: action.requestId, approvingEmployeeRoster: false };
        case EmployeeRosterActionTypes.ApproveEmployeeRosterFailed:
            return { ...state, approvingEmployeeRoster: false, validationMessages: action.validationMessages };

        default:
            return state;
    }
}
