import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { ConfigurationTypes } from "../../models/ConfigurationTypes";
import {
  ConfigurationTypesActions,
  ConfigurationTypesActionTypes
} from "../actions/configuration-types.action";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<ConfigurationTypes> {
  loadingConfigurationTypes: boolean;
}

export const configurationTypeAdapter: EntityAdapter<
  ConfigurationTypes
> = createEntityAdapter<ConfigurationTypes>({
  // tslint:disable-next-line: no-shadowed-variable
  selectId: (ConfigurationTypes: ConfigurationTypes) =>
    ConfigurationTypes.configurationTypeId
});

export const initialState: State = configurationTypeAdapter.getInitialState({
  loadingConfigurationTypes: false
});

export function reducer(
  state: State = initialState,
  action: ConfigurationTypesActions
): State {
  switch (action.type) {
    case ConfigurationTypesActionTypes.LoadConfigurationTypesTriggered:
      return { ...state, loadingConfigurationTypes: true };
    case ConfigurationTypesActionTypes.LoadConfigurationTypesCompleted:
      return configurationTypeAdapter.addAll(action.ConfigurationTypes, {
        ...state,
        loadingConfigurationTypes: false
      });
    default:
      return state;
  }
}
