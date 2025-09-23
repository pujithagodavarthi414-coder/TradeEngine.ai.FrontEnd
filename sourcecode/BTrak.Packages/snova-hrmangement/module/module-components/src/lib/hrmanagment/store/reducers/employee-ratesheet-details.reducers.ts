import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { EmployeeRateSheetModel } from "../../models/employee-ratesheet-model";
import { EmployeeRateSheetDetailsActions, EmployeeRateSheetDetailsActionTypes } from "../actions/employee-ratesheet-details.actions";

export interface State extends EntityState<EmployeeRateSheetModel> {
    loadingEmployeeRateSheetDetails: boolean;
    creatingEmployeeRateSheetDetails: boolean;
    validationMessages: any[];
    errorMessage: string;
    employeeRateSheetID: string;
    employeeRateSheet: EmployeeRateSheetModel;
    gettingEmployeeRateSheetDetailsById: boolean;
}

export const employeeRateSheetDetailsAdapter: EntityAdapter<EmployeeRateSheetModel> =
    createEntityAdapter<EmployeeRateSheetModel>({
        selectId: (employeeRateSheet: EmployeeRateSheetModel) => employeeRateSheet.employeeRateSheetId
    });

export const initialState: State = employeeRateSheetDetailsAdapter.getInitialState({
    loadingEmployeeRateSheetDetails: false,
    creatingEmployeeRateSheetDetails: false,
    validationMessages: [""],
    errorMessage: "",
    employeeRateSheetID: "",
    employeeRateSheet: null,
    gettingEmployeeRateSheetDetailsById: false
});

export function reducer(state: State = initialState, action: EmployeeRateSheetDetailsActions): State {
    switch (action.type) {
        case EmployeeRateSheetDetailsActionTypes.LoadEmployeeRateSheetDetailsTriggered:
            return { ...state, loadingEmployeeRateSheetDetails: true };
        case EmployeeRateSheetDetailsActionTypes.LoadEmployeeRateSheetDetailsCompleted:
            return employeeRateSheetDetailsAdapter.addAll(action.employeeRateSheetDetails, {
                ...state, loadingEmployeeRateSheetDetails: false
            });
        case EmployeeRateSheetDetailsActionTypes.LoadEmployeeRateSheetDetailsFailed:
            return { ...state, loadingEmployeeRateSheetDetails: false, validationMessages: action.validationMessages };
        case EmployeeRateSheetDetailsActionTypes.CreateEmployeeRateSheetDetailsTriggered:
            return { ...state, creatingEmployeeRateSheetDetails: true };
        case EmployeeRateSheetDetailsActionTypes.CreateEmployeeRateSheetDetailsCompleted:
            return { ...state, creatingEmployeeRateSheetDetails: false, employeeRateSheetID: action.employeeRateSheetID };
        case EmployeeRateSheetDetailsActionTypes.DeleteEmployeeRateSheetDetailsCompleted:
            return employeeRateSheetDetailsAdapter.removeOne(action.employeeRateSheetID, {
                ...state, creatingEmployeeRateSheetDetails: false
            });
        case EmployeeRateSheetDetailsActionTypes.CreateEmployeeRateSheetDetailsFailed:
            return { ...state, creatingEmployeeRateSheetDetails: false, validationMessages: action.validationMessages };
        case EmployeeRateSheetDetailsActionTypes.UpdateEmployeeRateSheetDetailsTriggered:
            return { ...state, creatingEmployeeRateSheetDetails: true };
        case EmployeeRateSheetDetailsActionTypes.UpdateEmployeeRateSheetDetailsCompleted:
            return { ...state, creatingEmployeeRateSheetDetails: false, employeeRateSheetID: action.employeeRateSheetID };
        case EmployeeRateSheetDetailsActionTypes.UpdateEmployeeRateSheetDetailsFailed:
            return { ...state, creatingEmployeeRateSheetDetails: false, validationMessages: action.validationMessages };
        case EmployeeRateSheetDetailsActionTypes.GetEmployeeRateSheetDetailsByIdTriggered:
            return { ...state, gettingEmployeeRateSheetDetailsById: true };
        case EmployeeRateSheetDetailsActionTypes.GetEmployeeRateSheetDetailsByIdCompleted:
            return { ...state, gettingEmployeeRateSheetDetailsById: false, employeeRateSheet: action.employeeRateSheet };
        case EmployeeRateSheetDetailsActionTypes.GetEmployeeRateSheetDetailsByIdFailed:
            return { ...state, gettingEmployeeRateSheetDetailsById: false, validationMessages: action.validationMessages };
        case EmployeeRateSheetDetailsActionTypes.UpdateEmployeeRateSheetDetailsById:
            return employeeRateSheetDetailsAdapter.updateOne(action.employeeRateSheetUpdates.employeeRateSheetUpdate, state);
        case EmployeeRateSheetDetailsActionTypes.RefreshEmployeeRateSheetDetailsList:
            return employeeRateSheetDetailsAdapter.upsertOne(action.employeeRateSheet, state);
        case EmployeeRateSheetDetailsActionTypes.ExceptionHandled:
            return { ...state, loadingEmployeeRateSheetDetails: false, errorMessage: action.errorMessage };
        default:
            return state;
    }
}
