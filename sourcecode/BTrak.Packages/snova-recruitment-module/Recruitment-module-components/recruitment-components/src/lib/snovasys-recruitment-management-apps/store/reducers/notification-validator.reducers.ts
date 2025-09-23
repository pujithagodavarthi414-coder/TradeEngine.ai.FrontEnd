import {
  ValidationActionTypes,
  ValidationAction,
} from '../actions/notification-validator.action';

export interface State {
  show: boolean;
}

const initialState: State = {
  show: false
};

export function reducer(state: State = initialState, action: ValidationAction) {
  switch (action.type) {
    case ValidationActionTypes.ShowExceptionMessages:
      return { ...state, show: true };

    default:
      return state;
  }
}
