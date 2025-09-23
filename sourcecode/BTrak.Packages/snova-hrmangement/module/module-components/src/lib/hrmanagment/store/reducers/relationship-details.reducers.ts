import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { RelationshipDetailsModel } from '../../models/relationship-details-model';
import { RelationshipDetailsActionTypes, RelationshipDetailsActions } from "../actions/relationship-details.actions";


export interface State extends EntityState<RelationshipDetailsModel> {
    gettingRelationshipDetails: boolean;
    gettingRelationshipDetailsById: boolean;
    RelationshipDetailsList: RelationshipDetailsModel[];
    RelationshipDetail: RelationshipDetailsModel;
    RelationshipDetailId: string;
    exceptionMessage: string;
}

export const relationshipDetailsAdapter: EntityAdapter<
    RelationshipDetailsModel
> = createEntityAdapter<RelationshipDetailsModel>({
    selectId: (relationshipDetailsModel: RelationshipDetailsModel) => relationshipDetailsModel.relationshipId
});

export const initialState: State = relationshipDetailsAdapter.getInitialState({
    gettingRelationshipDetails: false,
    gettingRelationshipDetailsById: false,
    selectedRelationshipDetailId: null,
    RelationshipDetailsList: null,
    RelationshipDetail: null,
    RelationshipDetailId: '',
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: RelationshipDetailsActions
): State {
    switch (action.type) {
        case RelationshipDetailsActionTypes.LoadRelationshipDetailsTriggered:
            return { ...state, gettingRelationshipDetails: true };
        case RelationshipDetailsActionTypes.LoadRelationshipDetailsCompleted:
            return relationshipDetailsAdapter.addAll(action.relationshipDetailsList, {
                ...state,
                gettingRelationshipDetails: false, RelationshipDetailsList: action.relationshipDetailsList
            });
        case RelationshipDetailsActionTypes.ExceptionHandled:
            return { ...state, gettingRelationshipDetails: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}