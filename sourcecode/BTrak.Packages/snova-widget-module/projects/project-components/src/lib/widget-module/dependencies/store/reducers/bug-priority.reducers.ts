import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { BugPriorityDropDownData } from "../../models/bugPriorityDropDown";
import {
  BugPriorityActionTypes,
  BugPriorityTypeActions
} from "../actions/bug-priority.actions";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<BugPriorityDropDownData> {
  loadingBugPriority: boolean;
}

export const bugPriorityAdapter: EntityAdapter<
  BugPriorityDropDownData
> = createEntityAdapter<BugPriorityDropDownData>({
  selectId: (bugPriorities: BugPriorityDropDownData) =>
    bugPriorities.bugPriorityId
});

export const initialState: State = bugPriorityAdapter.getInitialState({
  loadingBugPriority: false
});

export function reducer(
  state: State = initialState,
  action: BugPriorityTypeActions
): State {
  switch (action.type) {
    case BugPriorityActionTypes.LoadBugPriorityTypesTriggered:
      return { ...state, loadingBugPriority: true };
    case BugPriorityActionTypes.LoadBugPriorityTypesCompleted:
      return bugPriorityAdapter.addAll(action.bugPriorities, {
        ...state,
        loadingBugPriority: false
      });
    case BugPriorityActionTypes.LoadBugPriorityTypesFromCache:
      return { ...state, loadingBugPriority: false };
    default:
      return state;
  }
}
