import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { BoardType } from "../../models/boardtypes";
import {
  BoardTypeActions,
  BoardTypesActionTypes
} from "../actions/board-types.action";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<BoardType> {
  loadingBoardTypes: boolean;
  exceptionMessage: string;
}

export const boardTypeAdapter: EntityAdapter<BoardType> = createEntityAdapter<
  BoardType
>({
  selectId: (boardTypes: BoardType) => boardTypes.boardTypeId
});

export const initialState: State = boardTypeAdapter.getInitialState({
  loadingBoardTypes: false,
  exceptionMessage: ""
});

export function reducer(
  state: State = initialState,
  action: BoardTypeActions
): State {
  switch (action.type) {
    case BoardTypesActionTypes.LoadBoardTypesTriggered:
      return { ...state, loadingBoardTypes: true };
    case BoardTypesActionTypes.LoadBoardTypesCompleted:
      return boardTypeAdapter.addAll(action.boardTypes, {
        ...state,
        loadingBoardTypes: false
      });
    case BoardTypesActionTypes.ExceptionHandled:
      return { ...state, exceptionMessage: action.errorMessage, loadingBoardTypes: false };
    default:
      return state;
  }
}
