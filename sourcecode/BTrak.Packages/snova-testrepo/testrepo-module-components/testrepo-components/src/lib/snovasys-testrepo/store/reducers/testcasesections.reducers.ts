import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { TestCaseSectionActions, TestCaseSectionActionTypes } from '../actions/testcasesections.actions';
import { TestCaseDropdownList } from '../../models/testcasedropdown';

export interface State extends EntityState<TestCaseDropdownList> {
    loadingTestCaseSections: boolean;
    TestCaseSectionListForShift: TestCaseDropdownList[];
    TestCaseSectionList: TestCaseDropdownList[];
}

export const testCaseSectionAdapter: EntityAdapter<TestCaseDropdownList> = createEntityAdapter<TestCaseDropdownList>({
    selectId: (testCaseSection: TestCaseDropdownList) => testCaseSection.id
});

export const initialState: State = testCaseSectionAdapter.getInitialState({
    loadingTestCaseSections: false,
    TestCaseSectionListForShift: null,
    TestCaseSectionList: null
});

export function reducer(
    state: State = initialState,
    action: TestCaseSectionActions
): State {
    switch (action.type) {
        case TestCaseSectionActionTypes.LoadTestCaseSectionListTriggered:
            return { ...state, loadingTestCaseSections: true };
        case TestCaseSectionActionTypes.LoadTestCaseSectionListCompleted:
            return testCaseSectionAdapter.addAll(action.testCaseSectionList, {
                ...state,
                loadingTestCaseSections: false
            });
        case TestCaseSectionActionTypes.LoadTestCaseSectionListForShiftCompleted:
            return { ...state, TestCaseSectionListForShift: action.testCaseSectionShiftList };
        default:
            return state;
    }
}