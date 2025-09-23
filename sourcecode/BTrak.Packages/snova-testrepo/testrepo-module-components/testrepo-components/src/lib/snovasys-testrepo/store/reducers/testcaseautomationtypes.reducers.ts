import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { TestCaseAutomationActions, TestCaseAutomationActionTypes } from '../actions/testcaseautomationtypes.actions';
import { TestCaseDropdownList } from '../../models/testcasedropdown';

export interface State extends EntityState<TestCaseDropdownList>{
    loadingTestCaseAutomations: boolean;
    TestCaseAutomationList: TestCaseDropdownList[];
}

export const testCaseAutomationAdapter: EntityAdapter<TestCaseDropdownList> = createEntityAdapter<TestCaseDropdownList>({
    selectId: (testCaseAutomation: TestCaseDropdownList) => testCaseAutomation.id
});

export const initialState: State = testCaseAutomationAdapter.getInitialState({
    loadingTestCaseAutomations: false,
    TestCaseAutomationList: null
});

export function reducer(
    state: State = initialState,
    action: TestCaseAutomationActions
): State {
    switch (action.type) {
        case TestCaseAutomationActionTypes.LoadTestCaseAutomationListTriggered:
            return { ...state, loadingTestCaseAutomations: true };
        case TestCaseAutomationActionTypes.LoadTestCaseAutomationListCompleted:
            return testCaseAutomationAdapter.addAll(action.testCaseAutomationList, {
                ...state,
                loadingTestCaseAutomations: false
            });
        case TestCaseAutomationActionTypes.LoadTestCaseAutomationListFromCache:
            return { ...state, loadingTestCaseAutomations: false };
        default:
            return state;
    }
}