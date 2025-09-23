import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { LicenceTypesModel } from '../../models/licence-types-model';

import { LicenceTypesActions, LicenceTypesActionTypes } from '../actions/licence-types.actions';

export interface State extends EntityState<LicenceTypesModel> {
    loadingLicenceTypes: boolean;
    exceptionMessage: string;
}

export const licenceTypesAdapter: EntityAdapter<
    LicenceTypesModel
> = createEntityAdapter<LicenceTypesModel>({
    selectId: (licenceTypes: LicenceTypesModel) => licenceTypes.licenceTypeId
});

export const initialState: State = licenceTypesAdapter.getInitialState({
    loadingLicenceTypes: false,
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: LicenceTypesActions
): State {
    switch (action.type) {
        case LicenceTypesActionTypes.LoadLicenceTypeTriggered:
            return { ...state, loadingLicenceTypes: true };
        case LicenceTypesActionTypes.LoadLicenceTypeCompleted:
            return licenceTypesAdapter.addAll(action.licenceTypesList, {
                ...state,
                loadingLicenceTypes: false
            });
        case LicenceTypesActionTypes.ExceptionHandled:
            return { ...state, loadingLicenceTypes: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}