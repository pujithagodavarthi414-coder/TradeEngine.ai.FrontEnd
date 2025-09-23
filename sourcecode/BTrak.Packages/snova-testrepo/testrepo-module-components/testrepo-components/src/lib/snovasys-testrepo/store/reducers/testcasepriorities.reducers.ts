import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { TestCasePriorityActions, TestCasePriorityActionTypes } from '../actions/testcasepriorities.actions';
import { TestCaseDropdownList } from '../../models/testcasedropdown';

export interface State extends EntityState<TestCaseDropdownList>{
    loadingTestCasePriorities: boolean;
    TestCasePriorityList: TestCaseDropdownList[];
}

export const testCasePriorityAdapter: EntityAdapter<TestCaseDropdownList> = createEntityAdapter<TestCaseDropdownList>({
    selectId: (testCasePriority: TestCaseDropdownList) => testCasePriority.id
});

export const initialState: State = testCasePriorityAdapter.getInitialState({
    loadingTestCasePriorities: false,
    TestCasePriorityList: null
});

export function reducer(
    state: State = initialState,
    action: TestCasePriorityActions
): State {
    switch (action.type) {
        case TestCasePriorityActionTypes.LoadTestCasePriorityListTriggered:
            return { ...state, loadingTestCasePriorities: true };
        case TestCasePriorityActionTypes.LoadTestCasePriorityListCompleted:
            return testCasePriorityAdapter.addAll(action.testCasePriorityList, {
                ...state,
                loadingTestCasePriorities: false
            });
        case TestCasePriorityActionTypes.LoadTestCasePriorityListFromCache:
            return { ...state, loadingTestCasePriorities: false };
        default:
            return state;
    }
}