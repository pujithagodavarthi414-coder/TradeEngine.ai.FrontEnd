import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { TestCaseStatusActions, TestCaseStatusActionTypes } from '../actions/testcaseStatuses.actions';
import { TestCaseDropdownList } from '../../models/testcasedropdown';

export interface State extends EntityState<TestCaseDropdownList>{
    loadingTestCaseStatuses: boolean;
    TestCaseStatusList: TestCaseDropdownList[];
}

export const testCaseStatusAdapter: EntityAdapter<TestCaseDropdownList> = createEntityAdapter<TestCaseDropdownList>({
    selectId: (testCaseStatus: TestCaseDropdownList) => testCaseStatus.id
});

export const initialState: State = testCaseStatusAdapter.getInitialState({
    loadingTestCaseStatuses: false,
    TestCaseStatusList: null
});

export function reducer(
    state: State = initialState,
    action: TestCaseStatusActions
): State {
    switch (action.type) {
        case TestCaseStatusActionTypes.LoadTestCaseStatusListTriggered:
            return { ...state, loadingTestCaseStatuses: true };
        case TestCaseStatusActionTypes.LoadTestCaseStatusListCompleted:
            return testCaseStatusAdapter.addAll(action.testCaseStatusList, {
                ...state,
                loadingTestCaseStatuses: false
            });
        case TestCaseStatusActionTypes.LoadTestCaseStatusListFromCache:
            return { ...state, loadingTestCaseStatuses: false };
        default:
            return state;
    }
}