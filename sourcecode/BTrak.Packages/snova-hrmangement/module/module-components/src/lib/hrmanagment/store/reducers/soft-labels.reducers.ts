import { EntityState, createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { softLabelsActionTypes, SoftLabelActions } from "../actions/soft-labels.actions";
import { SoftLabelConfigurationModel } from '../../models/softLabels-model';


export interface State extends EntityState<SoftLabelConfigurationModel> {
    upsertsoftLabel: boolean;
    loadingsoftLabels: boolean;
    getByIdLoading: boolean;
}

export const softLabelAdapter: EntityAdapter<
    SoftLabelConfigurationModel
> = createEntityAdapter<SoftLabelConfigurationModel>({
    selectId: (softLabels: SoftLabelConfigurationModel) => softLabels.softLabelConfigurationId,
});

export const initialState: State = softLabelAdapter.getInitialState({
    upsertsoftLabel: false,
    loadingsoftLabels: true,
    getByIdLoading: false
})

export function reducer(state: State = initialState, action: SoftLabelActions): State {
    switch (action.type) {
        case softLabelsActionTypes.GetsoftLabelsTriggered:
            return initialState;
        case softLabelsActionTypes.GetsoftLabelsCompleted:
            return softLabelAdapter.addAll(action.softLabelsList, {
                ...state,
                loadingsoftLabels: false
            })
        case softLabelsActionTypes.GetsoftLabelsFailed:
            return { ...state, loadingsoftLabels: false };
        case softLabelsActionTypes.UpsertsoftLabelTriggered:
            return { ...state, upsertsoftLabel: true };
        case softLabelsActionTypes.UpsertsoftLabelCompleted:
            return { ...state, upsertsoftLabel: false };
        case softLabelsActionTypes.UpsertsoftLabelFailed:
            return { ...state, upsertsoftLabel: false };
        case softLabelsActionTypes.GetsoftLabelByIdTriggered:
            return { ...state, getByIdLoading: true };
        case softLabelsActionTypes.GetsoftLabelByIdCompleted:
            return { ...state, getByIdLoading: false };
        case softLabelsActionTypes.GetsoftLabelByIdFailed:
            return { ...state, getByIdLoading: false };
        case softLabelsActionTypes.UpdatesoftLabelField:
            return softLabelAdapter.updateOne(action.softLabelUpdates.softLabelUpdate, state);
        default:
            return state;
    }
}