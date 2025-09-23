import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { LogTimeOption } from "../../models/logTimeOption";
import {
  LogTimeOptionsActions,
  userStoryLogTimeActionTypes
} from "../actions/logTimeOptions.action";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<LogTimeOption> {
  loadingLogTimeOption: boolean;
}

export const logTimeActionAdapter: EntityAdapter<
  LogTimeOption
> = createEntityAdapter<LogTimeOption>({
  selectId: (logTimeOption: LogTimeOption) => logTimeOption.logTimeOptionId
});

export const initialState: State = logTimeActionAdapter.getInitialState({
  loadingLogTimeOption: false
});

export function reducer(
  state: State = initialState,
  action: LogTimeOptionsActions
): State {
  switch (action.type) {
    case userStoryLogTimeActionTypes.LogTimeOptionsTriggered:
      return { ...state, loadingLogTimeOption: true };
      case userStoryLogTimeActionTypes.LogTimeOptionsCompletedfromCache:
      return { ...state, loadingLogTimeOption: false };
    case userStoryLogTimeActionTypes.LogTimeOptionsCompleted:
      return logTimeActionAdapter.addAll(action.logTimeOptions, {
        ...state,
        loadingLogTimeOption: false
      });
    default:
      return state;
  }
}
