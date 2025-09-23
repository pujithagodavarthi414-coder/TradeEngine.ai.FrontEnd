// tslint:disable-next-line: ordered-imports
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { ValidationModel } from "../../models/validation-messages";
// tslint:disable-next-line: ordered-imports
import { UserStoryLogTimeModel } from "../../models/userStoryLogTimeModel";
import {
  // tslint:disable-next-line: ordered-imports
  UserStoryLogTimeActions,
  UserStoryLogTimeActionTypes
} from "../actions/userStory-logTime.action";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<UserStoryLogTimeModel> {
  insertLogTime: boolean;
  insertAutoLogTime: boolean,
  loadingUserStoryLogTime: boolean;
  insertLogTimeErrors: ValidationModel[];
  insertuserStoryLogTimeId: string | null;
  exceptionMessage: string;
}

export const logTimeAdapter: EntityAdapter<
  UserStoryLogTimeModel
> = createEntityAdapter<UserStoryLogTimeModel>({
  selectId: (userStoryLogTime: UserStoryLogTimeModel) =>
    userStoryLogTime.userStorySpentTimeId
});

export const initialState: State = logTimeAdapter.getInitialState({
  insertLogTime: false,
  insertAutoLogTime: false,
  loadingUserStoryLogTime: false,
  insertLogTimeErrors: [],
  insertuserStoryLogTimeId: null,
  exceptionMessage: ""
});

export function reducer(
  state: State = initialState,
  action: UserStoryLogTimeActions
): State {
  switch (action.type) {
    case UserStoryLogTimeActionTypes.SearchLogTimeTriggered:
      return { ...state, loadingUserStoryLogTime: true };
    case UserStoryLogTimeActionTypes.SearchLogTimeCompleted:
      return logTimeAdapter.addAll(action.userStoryLogTimeModelList, {
        ...state,
        loadingUserStoryLogTime: false
      });
    case UserStoryLogTimeActionTypes.InsertLogTimeTriggered:
      return { ...state, insertLogTime: true };
    case UserStoryLogTimeActionTypes.InsertAutoLogTimeTriggered:
        return { ...state, insertAutoLogTime: true };
    case UserStoryLogTimeActionTypes.InsertAutoLogTimeCompleted:
        return { ...state, insertAutoLogTime: false };
    case UserStoryLogTimeActionTypes.InsertLogTimeCompleted:
      return { ...state, insertLogTime: false };
    case UserStoryLogTimeActionTypes.InsertLogTimeFailed:
      return { ...state, insertLogTimeErrors: action.validationMessages, insertLogTime: false };
    case UserStoryLogTimeActionTypes.ExceptionHandled:
      return { ...state, exceptionMessage: action.errorMessage, insertLogTime: false  };

    default:
      return state;
  }
}

export const getSelectedId = (state: State) => state.insertuserStoryLogTimeId;
