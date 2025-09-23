import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { TestRunUserActions, TestRunUsersActionTypes } from '../actions/testrunusers.actions';
import { TestCaseDropdownList } from '@snovasys/snova-testrepo';

export interface State extends EntityState<TestCaseDropdownList>{
    loadingTestRunsList: boolean;
    TestRunUsersList: TestCaseDropdownList[];
}

export const testRunUserdapter: EntityAdapter<TestCaseDropdownList> = createEntityAdapter<TestCaseDropdownList>({
    selectId: (testRunUser: TestCaseDropdownList) => testRunUser.id
});

export const initialState: State = testRunUserdapter.getInitialState({
    loadingTestRunsList: false,
    TestRunUsersList: null
});

export function reducer(
    state: State = initialState,
    action: TestRunUserActions
): State {
    switch (action.type) {
        case TestRunUsersActionTypes.LoadTestRunUsersListTriggered:
            return { ...state, loadingTestRunsList: true };
        case TestRunUsersActionTypes.LoadTestRunUsersListCompleted:
            return testRunUserdapter.addAll(action.testRunUserList, {
                ...state,
                loadingTestRunsList: false
            });
        default:
            return state;
    }
}