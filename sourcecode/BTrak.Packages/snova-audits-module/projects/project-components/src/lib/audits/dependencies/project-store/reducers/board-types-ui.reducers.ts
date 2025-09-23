// tslint:disable-next-line: ordered-imports
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { BoardTypeUiModel } from "../../models/boardTypeUiModel";
import {
  BoardTypesUiActionTypes,
  BoardTypeUiActions
} from "../actions/board-types-ui.action";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<BoardTypeUiModel> {
  loadingBoardTypesUi: boolean;
}

export const boardTypeUiAdapter: EntityAdapter<
  BoardTypeUiModel
> = createEntityAdapter<BoardTypeUiModel>({
  selectId: (boardTypesUi: BoardTypeUiModel) => boardTypesUi.boardTypeUiId
});

export const initialState: State = boardTypeUiAdapter.getInitialState({
  loadingBoardTypesUi: false
});

export function reducer(
  state: State = initialState,
  action: BoardTypeUiActions
): State {
  switch (action.type) {
    case BoardTypesUiActionTypes.LoadBoardTypesUiTriggered:
      return { ...state, loadingBoardTypesUi: true };
    case BoardTypesUiActionTypes.LoadBoardTypesUiCompleted:
      return boardTypeUiAdapter.addAll(action.boardTypesUi, {
        ...state,
        loadingBoardTypesUi: false
      });
    default:
      return state;
  }
}
