  import {
  ActionReducerMap,
  createSelector,
  createFeatureSelector,
  ActionReducer,
  MetaReducer
} from "@ngrx/store";
// import { environment } from "../../../../module-components/src/lib/globaldependencies/environments/environment";
import * as fromRouter from "@ngrx/router-store";

/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 */
import { storeFreeze } from "ngrx-store-freeze";
import { LocalStorageProperties } from '../../lib/globaldependencies/constants/localstorage-properties';
// import { ROUTER_NAVIGATION } from "@ngrx/router-store";

/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */

let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
console.log(environment)
// let APIEndpoint = environment.apiURL;

export interface State {
  router: fromRouter.RouterReducerState;
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */
export const reducers: ActionReducerMap<State> = {
  router: fromRouter.routerReducer
};

// console.log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function(state: State, action: any): State {
        return reducer(state, action);
  };
}

export function clearState(reducer) {
  return function(state, action) {
    // if (action.type === AuthenticationActionTypes.SignedOff) {
    //   state = undefined;
    // }

    return reducer(state, action);
  };
}

// const eventsMap: EventsMap = {
//   [ROUTER_NAVIGATION]: trackPageView(action => ({
//     page: action.payload.routerState.url
//   }))
// };

// const gaMetaReducer = createMetaReducer(eventsMap, GoogleAnalytics());

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [logger, storeFreeze, clearState]
  : [clearState];
