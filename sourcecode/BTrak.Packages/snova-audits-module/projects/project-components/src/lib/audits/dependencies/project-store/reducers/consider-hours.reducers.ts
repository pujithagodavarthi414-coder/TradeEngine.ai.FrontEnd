// tslint:disable-next-line: ordered-imports
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { ConsideredHours } from "../../models/ConsideredHours";
import {
  ConsideredHoursActions,
  ConsideredHoursActionTypes
} from "../actions/consider-hours.action";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<ConsideredHours> {
  loadingConsiderHours: boolean;
  exceptionMessage: string;
}

export const considerHourAdapter: EntityAdapter<ConsideredHours> = createEntityAdapter<
ConsideredHours
>({
  selectId: (consideredHours: ConsideredHours) => consideredHours.considerHourId
});

export const initialState: State = considerHourAdapter.getInitialState({
  loadingConsiderHours: false,
  exceptionMessage: ""
});

export function reducer(
  state: State = initialState,
  action:   ConsideredHoursActions
): State {
  switch (action.type) {
    case ConsideredHoursActionTypes.LoadConsideredHoursTriggered:
      return { ...state, loadingConsiderHours: true };
    case ConsideredHoursActionTypes.LoadConsideredHoursCompleted:
      return considerHourAdapter.addAll(action.consideredHours, {
        ...state,
        loadingConsiderHours: false
      });
    case ConsideredHoursActionTypes.ExceptionHandled:
      return { ...state, exceptionMessage: action.errorMessage, loadingConsiderHours: false };
    default:
      return state;
  }
}
