import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { TestCaseActions, TestCaseActionTypes } from '../actions/testcaseadd.actions';
import { TestCase } from '../../models/testcase';

export interface State extends EntityState<TestCase> {
    loadingTestCaseDetailsBySectionAndRunIdForRuns: boolean;
    loadingSingleTestCaseDetails: boolean;
    TestCaseStatusErrors: string[];
    TestCaseStatusExceptionMessage: string;
}

export const testCasesForRunsAdapter: EntityAdapter<TestCase> = createEntityAdapter<TestCase>({
    selectId: (testCase: TestCase) => testCase.testCaseId
});

export const initialState: State = testCasesForRunsAdapter.getInitialState({
    loadingTestCaseDetailsBySectionAndRunIdForRuns: false,
    loadingSingleTestCaseDetails: false,
    TestCaseStatusErrors: [''],
    TestCaseStatusExceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: TestCaseActions
): State {
    switch (action.type) {
        case TestCaseActionTypes.LoadTestCasesBySectionAndRunIdTriggered:
            return { ...state, loadingTestCaseDetailsBySectionAndRunIdForRuns: true };
        case TestCaseActionTypes.LoadTestCasesBySectionAndRunIdCompleted:
            return testCasesForRunsAdapter.addAll(action.testCasesByRuns, {
                ...state,
                loadingTestCaseDetailsBySectionAndRunIdForRuns: false
            });
        case TestCaseActionTypes.TestCaseStatusEditWithInPlaceUpdateForStatus:
            return testCasesForRunsAdapter.updateOne(action.caseStatusesUpdate.caseStatusUpdate, {
                ...state,
                loadingSingleTestCaseDetails: false
            });
        case TestCaseActionTypes.TestCaseStatusEditWithInPlaceUpdateForBugStatus:
            return testCasesForRunsAdapter.updateOne(action.caseStatusesUpdate.caseStatusUpdate, {
                ...state,
                loadingSingleTestCaseDetails: false
            });
        case TestCaseActionTypes.LoadUpdateTestRunResultTriggered:
            return { ...state, loadingSingleTestCaseDetails: true };
        case TestCaseActionTypes.LoadUpdateTestRunResultCompleted:
            return { ...state, loadingSingleTestCaseDetails: true };
        case TestCaseActionTypes.LoadTestCaseStatusFailed:
            return { ...state, loadingTestCaseDetailsBySectionAndRunIdForRuns: false, TestCaseStatusErrors: action.validationMessagesForStatus };
        case TestCaseActionTypes.TestCaseStatusExceptionHandled:
            return { ...state, loadingTestCaseDetailsBySectionAndRunIdForRuns: false, TestCaseStatusExceptionMessage: action.errorMessageForStatus };
        default:
            return state;
    }
}