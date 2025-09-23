import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { EmployeeRateSheetModel } from "../../models/employee-ratesheet-model";
import { EmployeeRosterActions, EmployeeRosterActionTypes } from "../actions/roster.action";

export interface State extends EntityState<EmployeeRateSheetModel> {
    loadingEmployeeRateSheetDetails: boolean;
    validationMessages: any[];
    errorMessage: string;
    employeeRateSheetID: string;
    employeeRateSheet: EmployeeRateSheetModel;
}

export const employeeRateSheetDetailsAdapter: EntityAdapter<EmployeeRateSheetModel> =
    createEntityAdapter<EmployeeRateSheetModel>({
        selectId: (employeeRateSheet: EmployeeRateSheetModel) => employeeRateSheet.employeeRateSheetId
    });

export const initialState: State = employeeRateSheetDetailsAdapter.getInitialState({
    loadingEmployeeRateSheetDetails: false,
    validationMessages: [""],
    errorMessage: "",
    employeeRateSheetID: "",
    employeeRateSheet: null,
});

export function reducer(state: State = initialState, action: EmployeeRosterActions): State {
    switch (action.type) {
        case EmployeeRosterActionTypes.LoadEmployeeRateSheetDetailsTriggered:
            return { ...state, loadingEmployeeRateSheetDetails: true };
        case EmployeeRosterActionTypes.LoadEmployeeRateSheetDetailsCompleted:
            return employeeRateSheetDetailsAdapter.addAll(action.employeeRateSheetDetails, {
                ...state, loadingEmployeeRateSheetDetails: false
            });
        case EmployeeRosterActionTypes.LoadEmployeeRateSheetDetailsFailed:
            return { ...state, loadingEmployeeRateSheetDetails: false, validationMessages: action.validationMessages };
        default:
            return state;
    }
}
