import { EntityState, createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { CustomFieldsActionTypes, CustomFieldsActions } from "../actions/custom-fields.action";
import { CustomFormFieldModel } from '../../models/custom-fileds-model';


export interface State extends EntityState<CustomFormFieldModel> {
    createingCustomForm: boolean;
    loadingCustomFields: boolean;
    getByIdLoading: boolean;
    archiveCustomFieldLoading: boolean;
}

export const customFieldAdapter: EntityAdapter<
    CustomFormFieldModel
> = createEntityAdapter<CustomFormFieldModel>({
    selectId: (customFields: CustomFormFieldModel) => customFields.customFieldId,
    sortComparer: (customFieldsSortAsc: CustomFormFieldModel, customFieldsSortDesc: CustomFormFieldModel) => customFieldsSortDesc.formCreatedDateTime.localeCompare(customFieldsSortAsc.formCreatedDateTime)
});

export const initialState: State = customFieldAdapter.getInitialState({
    createingCustomForm: false,
    loadingCustomFields: false,
    getByIdLoading: false,
    archiveCustomFieldLoading: false
})

export function reducer(state: State = initialState, action: CustomFieldsActions): State {
    switch (action.type) {
        case CustomFieldsActionTypes.GetCustomFieldsTriggered:
               return { ...initialState, loadingCustomFields: true };
        case CustomFieldsActionTypes.GetCustomFieldsCompleted:
            return customFieldAdapter.addAll(action.customFormComponentsList, {
                ...state,
                loadingCustomFields: false
            })
        case CustomFieldsActionTypes.GetCustomFieldsFailed:
            return { ...state, loadingCustomFields: false };
        case CustomFieldsActionTypes.UpsertCustomFieldTriggered:
            return { ...state, createingCustomForm: true };
        case CustomFieldsActionTypes.UpsertCustomFieldCompleted:
            return { ...state, createingCustomForm: false };
        case CustomFieldsActionTypes.UpsertCustomFieldFailed:
            return { ...state, createingCustomForm: false };
        case CustomFieldsActionTypes.UpdateCustomFieldDataTriggered:
            return { ...state, createingCustomForm: true };
        case CustomFieldsActionTypes.UpdateCustomFieldDataCompleted:
            return { ...state, createingCustomForm: false };
        case CustomFieldsActionTypes.UpdateCustomFieldDataFailed:
            return { ...state, createingCustomForm: false };
        case CustomFieldsActionTypes.ExceptionHandled:
            return { ...state, createingCustomForm: false };
        case CustomFieldsActionTypes.GetCustomFieldByIdTriggered:
            return { ...state, getByIdLoading: true };
        case CustomFieldsActionTypes.GetCustomFieldByIdCompleted:
            return { ...state, getByIdLoading: false };
        case CustomFieldsActionTypes.GetCustomFieldByIdFailed:
            return { ...state, getByIdLoading: false };
        case CustomFieldsActionTypes.ArchiveCustomFieldTriggered:
            return { ...state, archiveCustomFieldLoading: true };
        case CustomFieldsActionTypes.ArchiveCustomFieldCompleted:
            state = customFieldAdapter.removeOne(action.formId, state);
            return { ...state, archiveCustomFieldLoading: false };
        case CustomFieldsActionTypes.ArchiveCustomFieldFailed:
            return { ...state, archiveCustomFieldLoading: false };
        case CustomFieldsActionTypes.RefreshCustomFormsList:
            return customFieldAdapter.upsertOne(action.customFormComponent, state);
        case CustomFieldsActionTypes.UpdateCustomFormField:
            return customFieldAdapter.updateOne(action.customFieldUpdates.customFieldUpdate, state);
        default:
            return state;
    }
}