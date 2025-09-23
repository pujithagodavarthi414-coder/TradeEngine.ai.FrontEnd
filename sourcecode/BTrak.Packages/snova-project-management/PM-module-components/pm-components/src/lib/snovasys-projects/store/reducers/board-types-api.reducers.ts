import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { boardTypeapi } from "../../models/boardTypeApi";
import {
  BoardTypeApiActions,
  BoardTypesApiActionTypes
} from "../actions/board-types-api.action";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<boardTypeapi> {
  loadingBoardTypesApi: boolean;
  exceptionMessage: string;
}

export const boardTypeApiAdapter: EntityAdapter<
  boardTypeapi
> = createEntityAdapter<boardTypeapi>({
  selectId: (boardtypesApi: boardTypeapi) => boardtypesApi.boardTypeApiId
});

export const initialState: State = boardTypeApiAdapter.getInitialState({
  loadingBoardTypesApi: false,
  exceptionMessage: ""
});

export function reducer(
  state: State = initialState,
  action: BoardTypeApiActions
): State {
  switch (action.type) {
    case BoardTypesApiActionTypes.LoadBoardTypesApiTriggered:
      return { ...state, loadingBoardTypesApi: true };
    case BoardTypesApiActionTypes.LoadBoardTypesApiCompleted:
      return boardTypeApiAdapter.addAll(action.boardTypesApi, {
        ...state,
        loadingBoardTypesApi: false
      });
    case BoardTypesApiActionTypes.LoadBoardTypesExceptionHandled:
      return { ...state, exceptionMessage: action.errorMessage, loadingBoardTypesApi: false };
    default:
      return state;
  }
}
