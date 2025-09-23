import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { TestSuiteSectionActions, TestSuiteSectionActionTypes } from '../actions/testsuitesection.actions';
import { TestSuiteCases, TestSuiteSections } from '../../models/testsuitesection';

export interface State extends EntityState<TestSuiteSections> {
    loadingTestSuiteSection: boolean;
    loadingTestSuiteSectionList: boolean;
    loadingTestRunSectionList: boolean;
    loadingTestSuiteSectionListForRuns: boolean;
    TestSuiteSectionList: TestSuiteCases;
    TestRunSectionList: TestSuiteCases;
    TestSuiteSectionListForRuns: TestSuiteCases;
}

export const testSuiteSectionAdapter: EntityAdapter<TestSuiteSections> = createEntityAdapter<TestSuiteSections>({
    selectId: (testSuiteSection: TestSuiteSections) => testSuiteSection.sectionId
});

export const initialState: State = testSuiteSectionAdapter.getInitialState({
    loadingTestSuiteSection: false,
    loadingTestSuiteSectionList: false,
    loadingTestRunSectionList: false,
    loadingTestSuiteSectionListForRuns: false,
    TestSuiteSectionList: null,
    TestRunSectionList: null,
    TestSuiteSectionListForRuns: null
});

export function reducer(
    state: State = initialState,
    action: TestSuiteSectionActions
): State {
    switch (action.type) {
        case TestSuiteSectionActionTypes.LoadTestSuiteSectionTriggered:
            return { ...state, loadingTestSuiteSection: true };
        case TestSuiteSectionActionTypes.LoadTestSuiteSectionCompleted:
            return { ...state, loadingTestSuiteSection: false };
        case TestSuiteSectionActionTypes.LoadTestSuiteSectionListTriggered:
            return { ...state, loadingTestSuiteSectionList: true };
        case TestSuiteSectionActionTypes.LoadTestSuiteSectionListCompleted:
            return { ...state, loadingTestSuiteSectionList: false, TestSuiteSectionList: action.testSuiteSectionList };
        case TestSuiteSectionActionTypes.LoadTestRunSectionListTriggered:
            return { ...state, loadingTestRunSectionList: true };
        case TestSuiteSectionActionTypes.LoadTestRunSectionListCompleted:
            return { ...state, loadingTestRunSectionList: false, TestRunSectionList: action.testRunSectionList };
        case TestSuiteSectionActionTypes.LoadTestSuiteSectionListForRunsTriggered:
            return { ...state, loadingTestSuiteSectionListForRuns: true };
        case TestSuiteSectionActionTypes.LoadTestSuiteSectionListForRunsCompleted:
            return { ...state, loadingTestSuiteSectionListForRuns: false, TestSuiteSectionListForRuns: action.testSuiteSectionListForRun };
        default:
            return state;
    }
}