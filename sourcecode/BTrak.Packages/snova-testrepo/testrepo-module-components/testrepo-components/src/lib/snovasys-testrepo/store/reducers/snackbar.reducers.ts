import {
  SnackbarAction,
  SnackbarActionTypes
} from "../actions/snackbar.actions";

// tslint:disable-next-line: interface-name
export interface State {
  show: boolean;
}

const initialState: State = {
  show: false
};

export function reducer(state: State = initialState, action: SnackbarAction) {
  switch (action.type) {
    case SnackbarActionTypes.SnackbarClose:
      return { ...state, show: false };
    case SnackbarActionTypes.SnackbarOpen:
      return { ...state, show: true };
    default:
      return state;
  }
}
