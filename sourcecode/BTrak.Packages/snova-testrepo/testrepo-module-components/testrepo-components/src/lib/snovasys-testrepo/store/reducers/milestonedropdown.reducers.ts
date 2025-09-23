import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { MileStoneDropdownActions, MileStoneDropdownActionTypes } from '../actions/milestonedropdown.actions';
import { TestCaseDropdownList } from '../../models/testcasedropdown';

export interface State extends EntityState<TestCaseDropdownList>{
    loadingMileStoneDropdownList: boolean;
    MileStoneDropdownList: TestCaseDropdownList[];
}

export const mileStoneDropdownAdapter: EntityAdapter<TestCaseDropdownList> = createEntityAdapter<TestCaseDropdownList>({
    selectId: (mileStoneDropdown: TestCaseDropdownList) => mileStoneDropdown.id
});

export const initialState: State = mileStoneDropdownAdapter.getInitialState({
    loadingMileStoneDropdownList: false,
    MileStoneDropdownList: null
});

export function reducer(
    state: State = initialState,
    action: MileStoneDropdownActions
): State {
    switch (action.type) {
        case MileStoneDropdownActionTypes.LoadMileStoneDropdownListTriggered:
            return { ...state, loadingMileStoneDropdownList: true };
        case MileStoneDropdownActionTypes.LoadMileStoneDropdownListCompleted:
            return { ...state, loadingMileStoneDropdownList: false, MileStoneDropdownList: action.mileStoneDropdownList };
        default:
            return state;
    }
}