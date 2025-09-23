import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { TestCaseActions, TestCaseActionTypes } from '../actions/testcaseadd.actions';
import { TestCase, TestCaseHistoryModel } from '../../models/testcase';
import { HistoryModel } from '../../models/history';

export interface State extends EntityState<TestCase> {
    loadingTestCase: boolean;
    loadingTestCaseTitle: boolean;
    loadingTestCaseDetails: boolean;
    loadingTestCaseDetailsBySectionId: boolean;
    loadingBugsByUserStoryId: boolean;
    loadingBugsByGoalId: boolean;
    loadingHistoryByUserStoryId: boolean;
    loadingTestCaseDetailsBySectionIdForRuns: boolean;
    loadingTestCaseScenariosByUserStoryId: boolean;
    loadingSingleTestCaseDetailsByCaseId: boolean;
    loadingSingleTestRunCaseDetailsByCaseId: boolean;
    loadingTestCasesByFilterForRuns: boolean;
    loadingReorderTestCases: boolean;
    loadingMoveTestCases: boolean;
    loadingBugsByTestCaseId: boolean;
    TestCaseDetails: TestCase;
    SingleTestCaseDetailsByCaseId: TestCase;
    SingleTestRunCaseDetailsByCaseId: TestCase;
    TestCasesBySectionId: TestCase[];
    BugsByUserStoryId: TestCase[];
    BugsByTestCaseId: TestCase[];
    BugsByGoalId: TestCase[];
    HistoryDetailsByUserStoryId: TestCaseHistoryModel[];
    TestCasesBySectionIdForRuns: TestCase[];
    FilteredTestCasesForRuns: TestCase[];
    FilteredTestCasesForSuites: TestCase[];
    CreateTestCaseErrors: string[];
    TestCaseExceptionMessage: string;
    historyList: HistoryModel[];
}

export const testCaseAdapter: EntityAdapter<TestCase> = createEntityAdapter<TestCase>({
    selectId: (testCase: TestCase) => testCase.testCaseId
});

export const initialState: State = testCaseAdapter.getInitialState({
    loadingTestCase: false,
    loadingTestCaseTitle: false,
    loadingTestCaseDetails: false,
    loadingTestCaseDetailsBySectionId: false,
    loadingBugsByUserStoryId: false,
    loadingBugsByGoalId: false,
    loadingHistoryByUserStoryId: false,
    loadingTestCaseDetailsBySectionIdForRuns: false,
    loadingTestCaseScenariosByUserStoryId: false,
    loadingSingleTestCaseDetailsByCaseId: false,
    loadingSingleTestRunCaseDetailsByCaseId: false,
    loadingTestCasesByFilterForRuns: false,
    loadingReorderTestCases: false,
    loadingMoveTestCases: false,
    loadingBugsByTestCaseId: false,
    TestCaseDetails: null,
    SingleTestCaseDetailsByCaseId: null,
    SingleTestRunCaseDetailsByCaseId: null,
    TestCasesBySectionId: null,
    BugsByUserStoryId: null,
    BugsByTestCaseId: null,
    BugsByGoalId: null,
    HistoryDetailsByUserStoryId: null,
    TestCasesBySectionIdForRuns: null,
    FilteredTestCasesForRuns: null,
    FilteredTestCasesForSuites: null,
    CreateTestCaseErrors: [''],
    TestCaseExceptionMessage: '',
    historyList: null
});

export function reducer(
    state: State = initialState,
    action: TestCaseActions
): State {
    switch (action.type) {
        case TestCaseActionTypes.LoadTestCaseTriggered:
            return { ...state, loadingTestCase: true };
        case TestCaseActionTypes.LoadTestCaseCompleted:
            return { ...state, loadingTestCase: false };
        case TestCaseActionTypes.LoadTestCaseTitleTriggered:
            return { ...state, loadingTestCaseTitle: true };
        case TestCaseActionTypes.LoadTestCaseTitleCompleted:
            return { ...state, loadingTestCaseTitle: false };
        case TestCaseActionTypes.LoadTestCaseDetailsTriggered:
            return { ...state, loadingTestCaseDetails: true };
        case TestCaseActionTypes.LoadTestCasesBySectionIdTriggered:
            return { ...state, loadingTestCaseDetailsBySectionId: true };
        case TestCaseActionTypes.LoadTestCasesBySectionIdCompleted:
            return testCaseAdapter.addAll(action.testCases, {
                ...state,
                loadingTestCaseDetailsBySectionId: false
            });
        case TestCaseActionTypes.LoadTestCasesAfterReorderCompleted:
            return testCaseAdapter.addAll(action.testCases, {
                ...state,
                loadingTestCaseDetailsBySectionId: false
            });
        case TestCaseActionTypes.LoadMultipleTestCasesBySectionIdCompleted:
            return testCaseAdapter.upsertMany(action.multipleTestCases, state);
        case TestCaseActionTypes.LoadMultipleTestCasesByUserStoryIdCompleted:
            return testCaseAdapter.upsertMany(action.multipleTestCasesByUserStoryId, state);
        case TestCaseActionTypes.TestCaseEditWithInPlaceUpdate:
            return testCaseAdapter.updateOne(action.caseEditsUpdate.caseEditUpdate, state);
        case TestCaseActionTypes.LoadTestCaseTitleDeleteCompleted:
            return testCaseAdapter.removeOne(action.testCaseDeleteId, state);
        case TestCaseActionTypes.LoadSingleTestCaseBySectionIdTriggered:
            return { ...state, loadingSingleTestCaseDetailsByCaseId: true };
        case TestCaseActionTypes.LoadSingleTestCaseBySectionIdCompleted:
            return { ...state, loadingSingleTestCaseDetailsByCaseId: false, SingleTestCaseDetailsByCaseId: action.singleCaseDetails };
        case TestCaseActionTypes.LoadSingleTestRunCaseBySectionIdTriggered:
            return { ...state, loadingSingleTestRunCaseDetailsByCaseId: true };
        case TestCaseActionTypes.LoadSingleTestRunCaseBySectionIdCompleted:
            return { ...state, loadingSingleTestRunCaseDetailsByCaseId: false, SingleTestRunCaseDetailsByCaseId: action.singleRunCaseDetails };
        case TestCaseActionTypes.LoadTestCasesByUserStoryIdTriggered:
            return { ...state, loadingTestCaseScenariosByUserStoryId: true };
        case TestCaseActionTypes.LoadTestCasesByUserStoryIdCompleted:
            return testCaseAdapter.addAll(action.testCasesByUserStoryId, {
                ...state,
                loadingTestCaseScenariosByUserStoryId: false
            });
        case TestCaseActionTypes.LoadTestCaseScenarioDeleteCompleted:
            return testCaseAdapter.removeOne(action.testCaseScenarioDeletedId, state);
        case TestCaseActionTypes.LoadTestCasesBySectionIdForRunsTriggered:
            return { ...state, loadingTestCaseDetailsBySectionIdForRuns: true };
        case TestCaseActionTypes.LoadTestCasesBySectionIdForRunsCompleted:
            return { ...state, loadingTestCaseDetailsBySectionIdForRuns: false, TestCasesBySectionIdForRuns: action.testCasesForRuns };
        case TestCaseActionTypes.LoadBugsByUserStoryIdTriggered:
            return { ...state, loadingBugsByUserStoryId: true };
        case TestCaseActionTypes.LoadBugsByUserStoryIdCompleted:
            return { ...state, loadingBugsByUserStoryId: false, BugsByUserStoryId: action.bugsByUserStoryId };
        case TestCaseActionTypes.LoadBugsByTestCaseIdTriggered:
            return { ...state, loadingBugsByTestCaseId: true };
        case TestCaseActionTypes.LoadBugsByTestCaseIdCompleted:
            return { ...state, loadingBugsByTestCaseId: false, BugsByTestCaseId: action.bugsByUserStoryId };
        case TestCaseActionTypes.LoadBugsByGoalIdTriggered:
            return { ...state, loadingBugsByGoalId: true };
        case TestCaseActionTypes.LoadBugsByGoalIdCompleted:
            return { ...state, loadingBugsByGoalId: false, BugsByGoalId: action.bugsByGoalId };
        case TestCaseActionTypes.LoadHistoryByUserStoryIdTriggered:
            return { ...state, loadingHistoryByUserStoryId: true };
        case TestCaseActionTypes.LoadHistoryByUserStoryIdCompleted:
            return { ...state, loadingHistoryByUserStoryId: false, HistoryDetailsByUserStoryId: action.historyByUserStoryId };
        case TestCaseActionTypes.LoadTestCasesByFilterForRunsTriggered:
            return { ...state, loadingTestCasesByFilterForRuns: true };
        case TestCaseActionTypes.LoadTestCasesByFilterForRunsCompleted:
            return { ...state, loadingTestCasesByFilterForRuns: false, FilteredTestCasesForRuns: action.filteredCasesForRuns };
        case TestCaseActionTypes.LoadTestCasesByFilterForSuitesCompleted:
            return { ...state, FilteredTestCasesForSuites: action.filteredCasesForRuns };
        case TestCaseActionTypes.LoadTestCaseDetailsCompleted:
            return { ...state, loadingTestCaseDetails: false, TestCaseDetails: action.testCaseDetails };
        case TestCaseActionTypes.LoadTestCaseReorderTriggered:
            return { ...state, loadingReorderTestCases: true };
        case TestCaseActionTypes.LoadTestCaseReorderCompleted:
            return { ...state, loadingReorderTestCases: false };
        case TestCaseActionTypes.LoadMoveTestCasesTriggered:
            return { ...state, loadingMoveTestCases: true };
        case TestCaseActionTypes.LoadMoveTestCasesCompleted:
            return { ...state, loadingMoveTestCases: false };
        case TestCaseActionTypes.DeleteMultipleTestCases:
            return testCaseAdapter.removeMany(action.deleteMovedCases, state);
        case TestCaseActionTypes.LoadTestCaseFailed:
            return { ...state, loadingTestCase: false, loadingReorderTestCases: false, loadingMoveTestCases: false, CreateTestCaseErrors: action.validationMessages };
        case TestCaseActionTypes.TestCaseExceptionHandled:
            return { ...state, loadingTestCase: false, loadingReorderTestCases: false, loadingMoveTestCases: false, TestCaseExceptionMessage: action.errorMessage };
        default:
            return state;
    }
}