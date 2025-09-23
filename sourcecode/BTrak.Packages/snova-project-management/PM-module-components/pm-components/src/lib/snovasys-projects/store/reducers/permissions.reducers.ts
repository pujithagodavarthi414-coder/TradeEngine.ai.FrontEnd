// tslint:disable-next-line: ordered-imports
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { ConfigurationSettingModel } from "../../models/configurationType";
import {
  // tslint:disable-next-line: ordered-imports
  permissionConfigurationActions,
  permissionConfigurationActionTypes
} from "../actions/permissions.action";
import { ValidationModel } from '../../models/validation-messages';
// tslint:disable-next-line: interface-name
export interface State extends EntityState<ConfigurationSettingModel> {
  loadingpermissionConfigurations: boolean;
  loadingConfigurationErrors: ValidationModel[];
}

export const permissionConfigurationAdapter: EntityAdapter<
  ConfigurationSettingModel
> = createEntityAdapter<ConfigurationSettingModel>({
  selectId: (permissionConfiguration: ConfigurationSettingModel) =>
    permissionConfiguration.fieldPermissionId
});

export const initialState: State = permissionConfigurationAdapter.getInitialState(
  {
    loadingpermissionConfigurations: false,
    loadingConfigurationErrors: []
  }
);

export function reducer(
  state: State = initialState,
  action: permissionConfigurationActions
): State {
  switch (action.type) {
    case permissionConfigurationActionTypes.LoadPermissionsListTriggered:
      return { ...state, loadingpermissionConfigurations: true };
    case permissionConfigurationActionTypes.LoadPermissionsListCompleted:
      return permissionConfigurationAdapter.upsertMany(
        action.configurationSettingsList,
        {
          ...state,
          loadingpermissionConfigurations: false
        }
      );
      case permissionConfigurationActionTypes.LoadPermissionsListFailed:
      return {
        ...state,
        loadingpermissionConfigurations: false,
        loadingConfigurationErrors: action.validationMessages
      };
      case permissionConfigurationActionTypes.LoadpermisionsListCompletedFromCache:
      return { ...state, loadingpermissionConfigurations: false };
    default:
      return state;
  }
}
