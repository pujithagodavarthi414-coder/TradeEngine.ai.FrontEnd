import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { TestSuiteActions, TestSuiteActionTypes } from '../actions/testsuiteslist.action';
import { TestSuiteList } from '../../models/testsuite';

export interface State extends EntityState<TestSuiteList> {
    loadingTestSuite: boolean;
    loadingTestSuiteDelete: boolean;
    loadingTestSuiteList: boolean;
    TestSuiteList: TestSuiteList[];
}

export const testSuiteAdapter: EntityAdapter<TestSuiteList> = createEntityAdapter<TestSuiteList>({
    selectId: (testSuite: TestSuiteList) => testSuite.testSuiteId,
    sortComparer: (testSuiteAsc: TestSuiteList, testSuiteDesc: TestSuiteList) => testSuiteDesc.createdDateTime.toString().localeCompare(testSuiteAsc.createdDateTime.toString())
});

export const initialState: State = testSuiteAdapter.getInitialState({
    loadingTestSuite: false,
    loadingTestSuiteDelete: false,
    loadingTestSuiteList: false,
    TestSuiteList: null
});

export function reducer(
    state: State = initialState,
    action: TestSuiteActions
): State {
    switch (action.type) {
        case TestSuiteActionTypes.LoadTestSuiteTriggered:
            return { ...state, loadingTestSuite: true };
        case TestSuiteActionTypes.LoadTestSuiteCompleted:
            return { ...state, loadingTestSuite: false };
        case TestSuiteActionTypes.LoadTestSuiteDeleteTriggered:
            return { ...state, loadingTestSuiteDelete: true };
        case TestSuiteActionTypes.LoadTestSuiteDeleteCompleted:
            return testSuiteAdapter.removeOne(action.deleteId, state);
        case TestSuiteActionTypes.MoveTestSuiteTriggered:
            return { ...state, loadingTestSuite: true };
        case TestSuiteActionTypes.MoveTestSuiteCompleted:
            return testSuiteAdapter.removeOne(action.deleteId, state);
        case TestSuiteActionTypes.MoveTestSuiteFailed:
            return { ...state, loadingTestSuite: false };
        case TestSuiteActionTypes.LoadTestSuiteListTriggered:
            return { ...state, loadingTestSuiteList: true };
        case TestSuiteActionTypes.LoadTestSuiteListCompleted:
            // return { ...state, loadingTestSuiteList: false, TestSuiteList: action.testSuiteList };
            return testSuiteAdapter.addAll(action.testSuiteList, {
                ...state,
                loadingTestSuiteList: false
            });
        case TestSuiteActionTypes.RefreshTestSuitesList:
            return testSuiteAdapter.upsertOne(action.latestTestSuiteData, state);
        case TestSuiteActionTypes.TestSuiteEditCompletedWithInPlaceUpdate:
            return testSuiteAdapter.updateOne(action.testSuiteUpdates.testSuiteUpdate, state);
        case TestSuiteActionTypes.LoadMultipleTestSuiteByIdCompleted:
            return testSuiteAdapter.updateMany(action.multipleTestSuite.multipleTestSuites, state);
        default:
            return state;
    }
}