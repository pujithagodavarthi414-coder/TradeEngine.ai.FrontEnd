// tslint:disable-next-line: ordered-imports
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { ValidationModel } from "../../models/validation-messages";
import {processDashboard} from "../../models/processDashboard";
// tslint:disable-next-line: ordered-imports
import {ProcessDashboardStatusActions, ProcessDashboardStatusActionTypes} from "../actions/process-dashboard-status.action";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<processDashboard> {
   loadProcessDashboardStatus: boolean;
   loadProcessDashboardErrors: ValidationModel[];
   errorMessage: string;
  }
export const processDashboardStatusAdapter: EntityAdapter<processDashboard> = createEntityAdapter<processDashboard>(
    {
      selectId: (processDashboardStatus: processDashboard) => processDashboardStatus.processDashboardStatusId,
      sortComparer: false
    }
  );
export const initialState: State = processDashboardStatusAdapter.getInitialState({
    loadProcessDashboardStatus: false,
    loadProcessDashboardErrors: [],
    errorMessage: ""
  });
export function reducer(
    state = initialState,
    action: ProcessDashboardStatusActions
  ): State {
    switch (action.type) {
      case ProcessDashboardStatusActionTypes.LoadProcessDashboardStatusTriggered:
        return { ...initialState, loadProcessDashboardStatus: true };
      case ProcessDashboardStatusActionTypes.LoadProcessDashboardStatusCompleted:
        return processDashboardStatusAdapter.addAll(action.ProcessDashboardStatusList, {
          ...state,
          loadProcessDashboardStatus: false
        });
      case ProcessDashboardStatusActionTypes.LoadProcessDashboardStatusFailed:
        return { ...state, loadProcessDashboardStatus: false, loadProcessDashboardErrors: action.validationMessages};
      case ProcessDashboardStatusActionTypes.ExceptionHandled:
        return {
          ...state,
          errorMessage: action.errorMessage,
          loadProcessDashboardStatus: false
        };
      default:
        return state;
    }
  }
