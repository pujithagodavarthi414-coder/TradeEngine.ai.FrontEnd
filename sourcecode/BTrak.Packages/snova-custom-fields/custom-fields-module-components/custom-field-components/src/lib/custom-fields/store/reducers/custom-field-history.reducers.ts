// tslint:disable-next-line: ordered-imports
import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { CustomFieldHistoryActions, CustomFieldHistoryActionTypes } from "../actions/custom-field-history.actions";
import { ValidationModel } from '../../models/validation-messages';
import { CustomFieldHistoryModel } from '../../models/custom-field-history.model';
// tslint:disable-next-line: ordered-imports

// tslint:disable-next-line: interface-name
export interface State extends EntityState<CustomFieldHistoryModel> {
   loadCustomFieldsHistory: boolean;
   loadCustomFieldErrors: ValidationModel[];
   errorMessage: string;
  }
export const custmFieldHistoryAdapter: EntityAdapter<CustomFieldHistoryModel> = createEntityAdapter<CustomFieldHistoryModel>(
    {
      selectId: (customFieldHistory: CustomFieldHistoryModel) => customFieldHistory.customFieldHistoryId,
      sortComparer: false
    }
  );
export const initialState: State = custmFieldHistoryAdapter.getInitialState({
    loadCustomFieldsHistory: false,
    loadCustomFieldErrors: [],
    errorMessage: ""
  });
export function reducer(
    state = initialState,
    action: CustomFieldHistoryActions
  ): State {
    switch (action.type) {
      case CustomFieldHistoryActionTypes.LoadCustomFieldHistoryTriggered:
        return { ...initialState, loadCustomFieldsHistory: true };
      case CustomFieldHistoryActionTypes.LoadCustomFieldHistoryCompleted:
        return custmFieldHistoryAdapter.addAll(action.CustomFieldHistoryList, {
          ...state,
          loadCustomFieldsHistory: false
        });
      case CustomFieldHistoryActionTypes.LoadCustomFieldHistoryFailed:
        return { ...state, loadCustomFieldsHistory: false, loadCustomFieldErrors: action.validationMessages};
      case CustomFieldHistoryActionTypes.ExceptionsHandled:
        return {
          ...state,
          errorMessage: action.errorMessage,
          loadCustomFieldsHistory: false
        };
      default:
        return state;
    }
  }
