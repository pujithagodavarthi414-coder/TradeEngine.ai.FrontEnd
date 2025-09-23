// tslint:disable-next-line: ordered-imports
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { SpentTimeReport } from "../../models/userstorySpentTimeModel";
import {
  SpentTimeReportsActions,
  SpentTimeReportsActionTypes
} from "../actions/userstory-spent-time-report.action";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<SpentTimeReport> {
  loadingSpentTimeReport: boolean;
  exceptionMessage: string;
}

export const SpentTimeReportAdapter: EntityAdapter<
  SpentTimeReport
> = createEntityAdapter<SpentTimeReport>({
  selectId: (spentTimeReport: SpentTimeReport) => spentTimeReport.userId
});

export const initialState: State = SpentTimeReportAdapter.getInitialState({
  loadingSpentTimeReport: false,
  exceptionMessage: ""
});

export function reducer(
  state: State = initialState,
  action: SpentTimeReportsActions
): State {
  switch (action.type) {
    case SpentTimeReportsActionTypes.LoadSpentTimeReportsTriggered:
      return { ...state, loadingSpentTimeReport: true };
    case SpentTimeReportsActionTypes.LoadSpentTimeReportsCompleted:
      return SpentTimeReportAdapter.addAll(action.spentTimeReportsList, {
        ...state,
        loadingSpentTimeReport: false
      });
    case SpentTimeReportsActionTypes.UserStorySpentTimeExceptionHandled:
      return {
        ...state,
        loadingSpentTimeReport: false,
        exceptionMessage: action.errorMessage
      };
    default:
      return state;
  }
}
