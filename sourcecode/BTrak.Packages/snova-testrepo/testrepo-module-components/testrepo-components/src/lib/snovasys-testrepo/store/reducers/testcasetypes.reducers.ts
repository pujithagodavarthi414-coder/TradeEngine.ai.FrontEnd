import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { TestCaseTypeActions, TestCasesActionTypes } from '../actions/testcasetypes.actions';
import { TestCaseDropdownList } from '../../models/testcasedropdown';

export interface State extends EntityState<TestCaseDropdownList>{
    loadingTestCaseTypes: boolean;
    TestCaseTypeList: TestCaseDropdownList[];
}

export const testCaseTypeAdapter: EntityAdapter<TestCaseDropdownList> = createEntityAdapter<TestCaseDropdownList>({
    selectId: (testCaseType: TestCaseDropdownList) => testCaseType.id
});

export const initialState: State = testCaseTypeAdapter.getInitialState({
    loadingTestCaseTypes: false,
    TestCaseTypeList: null
});

export function reducer(
    state: State = initialState,
    action: TestCaseTypeActions
): State {
    switch (action.type) {
        case TestCasesActionTypes.LoadTestCaseTypeListTriggered:
            return { ...state, loadingTestCaseTypes: true };
        case TestCasesActionTypes.LoadTestCaseTypeListCompleted:
            return testCaseTypeAdapter.addAll(action.testCaseTypeList, {
                ...state,
                loadingTestCaseTypes: false
            });
        case TestCasesActionTypes.LoadTestCaseTypeListFromCache:
            return { ...state, loadingTestCaseTypes: false };
        default:
            return state;
    }
}