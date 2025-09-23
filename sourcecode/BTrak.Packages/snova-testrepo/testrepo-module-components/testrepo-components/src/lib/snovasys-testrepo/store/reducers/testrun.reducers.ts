import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { TestRunActions, TestRunActionTypes } from '../actions/testrun.actions';
import { TestRun, TestRunList } from '../../models/testrun';

export interface State extends EntityState<TestRunList> {
    loadingTestRun: boolean;
    loadingTestRunsList: boolean;
    loadingTestRunDelete: boolean;
    TestRunsList: TestRunList[];
}

export const testRunAdapter: EntityAdapter<TestRunList> = createEntityAdapter<TestRunList>({
    selectId: (testRun: TestRunList) => testRun.testRunId,
    sortComparer: (testRunAsc: TestRunList, testRunDesc: TestRunList) => testRunDesc.createdDateTime.toString().localeCompare(testRunAsc.createdDateTime.toString())
});

export const initialState: State = testRunAdapter.getInitialState({
    loadingTestRun: false,
    loadingTestRunsList: false,
    loadingTestRunDelete: false,
    TestRunsList: null
});

export function reducer(
    state: State = initialState,
    action: TestRunActions
): State {
    switch (action.type) {
        case TestRunActionTypes.LoadTestRunTriggered:
            return { ...state, loadingTestRun: true };
        case TestRunActionTypes.LoadTestRunCompleted:
            return { ...state, loadingTestRun: false };
        case TestRunActionTypes.LoadTestRunDeleteTriggered:
            return { ...state, loadingTestRunDelete: true };
        case TestRunActionTypes.LoadTestRunDeleteCompleted:
            return testRunAdapter.removeOne(action.deleteTestRunId, state);
        case TestRunActionTypes.LoadTestRunListTriggered:
            return { ...state, loadingTestRunsList: true };
        case TestRunActionTypes.LoadTestRunListCompleted:
            return testRunAdapter.addAll(action.testRunsList, {
                ...state,
                loadingTestRunsList: false
            });
        case TestRunActionTypes.RefreshTestRunsList:
            return testRunAdapter.upsertOne(action.latestTestRun, state);
        case TestRunActionTypes.TestRunEditCompletedWithInPlaceUpdate:
            return testRunAdapter.updateOne(action.testRunUpdates.testRunUpdate, state);
        case TestRunActionTypes.TestRunEditCompletedWithInPlaceUpdateForStatus:
            return testRunAdapter.updateOne(action.testRunUpdatesForStatus.testRunUpdateForStatus, state);
        default:
            return state;
    }
}