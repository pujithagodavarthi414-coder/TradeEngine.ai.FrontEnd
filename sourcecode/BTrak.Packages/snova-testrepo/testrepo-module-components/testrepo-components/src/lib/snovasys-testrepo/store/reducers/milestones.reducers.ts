import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { MileStoneActions, MileStoneActionTypes } from '../actions/milestones.actions';
import { MileStoneWithCount } from '../../models/milestone';
import { TestRunList } from '../../models/testrun';

export interface State extends EntityState<MileStoneWithCount> {
    loadingMileStone: boolean;
    loadingMileStoneDetails: boolean;
    loadingMileStoneDelete: boolean;
    MileStoneList: MileStoneWithCount[];
    TestRunList: TestRunList[];
}

export const mileStoneAdapter: EntityAdapter<MileStoneWithCount> = createEntityAdapter<MileStoneWithCount>({
    selectId: (milestone: MileStoneWithCount) => milestone.milestoneId,
    sortComparer: (milestonesSortAsc: MileStoneWithCount, milestonesSortDesc: MileStoneWithCount) => milestonesSortDesc.createdDateTime.toString().localeCompare(milestonesSortAsc.createdDateTime.toString())
});

export const initialState: State = mileStoneAdapter.getInitialState({
    loadingMileStone: false,
    loadingMileStoneDetails: false,
    loadingMileStoneDelete: false,
    MileStoneList: null,
    TestRunList: null
});

export function reducer(
    state: State = initialState,
    action: MileStoneActions
): State {
    switch (action.type) {
        case MileStoneActionTypes.LoadMileStoneTriggered:
            return { ...state, loadingMileStone: true };
        case MileStoneActionTypes.LoadMileStoneCompleted:
            return { ...state, loadingMileStone: false };
        case MileStoneActionTypes.LoadMileStoneDeleteTriggered:
            return { ...state, loadingMileStoneDelete: true };
        case MileStoneActionTypes.LoadMileStoneDeleteCompleted:
            return mileStoneAdapter.removeOne(action.mileStoneDeleteId, state);
        case MileStoneActionTypes.LoadMileStoneListTriggered:
            return { ...state, loadingMileStoneDetails: true };
        case MileStoneActionTypes.LoadMileStoneListCompleted:
            return mileStoneAdapter.addAll(action.mileStoneList, {
                ...state,
                loadingMileStoneDetails: false
            });
        case MileStoneActionTypes.RefreshMileStonesList:
            return mileStoneAdapter.upsertOne(action.latestMileStoneData, state);
        case MileStoneActionTypes.MileStoneEditCompletedWithInPlaceUpdate:
            return mileStoneAdapter.updateOne(action.mileStoneUpdates.mileStoneUpdate, state);
        case MileStoneActionTypes.LoadTestRunsByMileStoneTriggered:
            return { ...state, loadingMileStone: true };
        case MileStoneActionTypes.LoadTestRunsByMileStoneCompleted:
            return { ...state, loadingMileStone: false, TestRunList: action.testRunList };
        default:
            return state;
    }
}
