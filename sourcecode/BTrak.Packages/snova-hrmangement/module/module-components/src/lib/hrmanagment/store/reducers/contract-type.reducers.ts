import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { ContractTypeActionTypes, ContractTypeActions } from '../actions/contract-type.actions';
import { ContractTypeModel } from '../../models/contract-type-model';

export interface State extends EntityState<ContractTypeModel> {
    loadingContractTypeList: boolean;
    getContractTypeErrors: string[],
    exceptionMessage: string;
}

export const contractTypeAdapter: EntityAdapter<
    ContractTypeModel
> = createEntityAdapter<ContractTypeModel>({
    selectId: (contractTypeModel: ContractTypeModel) => contractTypeModel.contractTypeId
});

export const initialState: State = contractTypeAdapter.getInitialState({
    loadingContractTypeList: false,
    getContractTypeErrors: [''],
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: ContractTypeActions
): State {
    switch (action.type) {
        case ContractTypeActionTypes.LoadContractTypeTriggered:
            return { ...state, loadingContractTypeList: true };
        case ContractTypeActionTypes.LoadContractTypeCompleted:
            return contractTypeAdapter.addAll(action.contractTypeList, {
                ...state,
                loadingContractTypeList: false
            });
        case ContractTypeActionTypes.LoadContractTypeFailed:
            return { ...state, loadingContractTypeList: false, getContractTypeErrors: action.validationMessages };
        case ContractTypeActionTypes.ExceptionHandled:
            return { ...state, loadingContractTypeList: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}