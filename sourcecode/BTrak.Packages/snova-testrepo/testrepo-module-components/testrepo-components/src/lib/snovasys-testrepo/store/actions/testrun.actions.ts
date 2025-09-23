import { Action } from '@ngrx/store';
import { TestRun, TestRunList } from '../../models/testrun';
import { Update } from '@ngrx/entity';

export enum TestRunActionTypes {
    LoadTestRunTriggered = '[Snovasys-TM] [Test Run Component] Initial Test Run Load Triggered',
    LoadTestRunCompleted = '[Snovasys-TM] [Test Run Component] Initial Test Run Load Completed',
    LoadTestRunByIdTriggered = '[Snovasys-TM] [Test Run Component] Initial Test Run Load By Id Triggered',
    LoadTestRunByIdCompleted = '[Snovasys-TM] [Test Run Component] Initial Test Run Load By Id Completed',
    LoadTestRunByIdForStatusTriggered = '[Snovasys-TM] [Test Run Component] Initial Test Run Load By Id For Status Triggered',
    LoadTestRunByIdForStatusCompleted = '[Snovasys-TM] [Test Run Component] Initial Test Run Load By Id For Status Completed',
    LoadTestRunDeleteTriggered = '[Snovasys-TM] [Test Run Component] Initial Test Run Delete Load Triggered',
    LoadTestRunDeleteCompleted = '[Snovasys-TM] [Test Run Component] Initial Test Run Delete Load Completed',
    LoadTestRunListTriggered = '[Snovasys-TM] [Test Run Component] Initial Test Run List Load Triggered',
    LoadTestRunListCompleted = '[Snovasys-TM] [Test Run Component] Initial Test Run List Load Completed',
    RefreshTestRunsList = '[Snovasys-TM] [Test Run Component] Initial Test Run Refresh List Load Completed',
    TestRunEditCompletedWithInPlaceUpdate = '[Snovasys-TM] [Test Run Component] Initial Test Run Update Load Completed',
    TestRunEditCompletedWithInPlaceUpdateForStatus = '[Snovasys-TM] [Test Run Component] Initial Test Run Update Load For Status Completed',
    TestRunFailed = '[Snovasys-TM] [Test Run Component] Test Run Load Failed',
    TestRunException = '[Snovasys-TM] [Test Run Component] Test Run Exception Handled'
}

export class LoadTestRunTriggered implements Action {
    type = TestRunActionTypes.LoadTestRunTriggered;
    testRunId: string;
    testRuns: TestRun;
    deleteTestRun: TestRun;
    deleteTestRunId: string;
    searchTestRun: TestRun;
    searchTestRunForStatus: TestRun;
    searchTestRunsListForStatus: TestRunList[];
    testRunUpdatesForStatus: { testRunUpdateForStatus: Update<TestRunList> };
    searchTestRunsList: TestRunList[];
    testRunsList: TestRunList[];
    latestTestRun: TestRunList;
    testRunUpdates: { testRunUpdate: Update<TestRunList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public testRun: TestRun) { }
}

export class LoadTestRunCompleted implements Action {
    type = TestRunActionTypes.LoadTestRunCompleted;
    testRun: TestRun;
    testRuns: TestRun;
    deleteTestRun: TestRun;
    deleteTestRunId: string;
    searchTestRun: TestRun;
    searchTestRunForStatus: TestRun;
    searchTestRunsListForStatus: TestRunList[];
    testRunUpdatesForStatus: { testRunUpdateForStatus: Update<TestRunList> };
    searchTestRunsList: TestRunList[];
    testRunsList: TestRunList[];
    latestTestRun: TestRunList;
    testRunUpdates: { testRunUpdate: Update<TestRunList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public testRunId: string) { }
}

export class LoadTestRunByIdTriggered implements Action {
    type = TestRunActionTypes.LoadTestRunByIdTriggered;
    testRunId: string;
    testRuns: TestRun;
    deleteTestRun: TestRun;
    deleteTestRunId: string;
    searchTestRunForStatus: TestRun;
    searchTestRunsListForStatus: TestRunList[];
    testRunUpdatesForStatus: { testRunUpdateForStatus: Update<TestRunList> };
    searchTestRunsList: TestRunList[];
    testRunsList: TestRunList[];
    latestTestRun: TestRunList;
    testRunUpdates: { testRunUpdate: Update<TestRunList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchTestRun: TestRun) { }
}

export class LoadTestRunByIdCompleted implements Action {
    type = TestRunActionTypes.LoadTestRunByIdCompleted;
    testRunId: string;
    testRuns: TestRun;
    deleteTestRun: TestRun;
    deleteTestRunId: string;
    searchTestRun: TestRun;
    searchTestRunForStatus: TestRun;
    searchTestRunsListForStatus: TestRunList[];
    testRunUpdatesForStatus: { testRunUpdateForStatus: Update<TestRunList> };
    testRunsList: TestRunList[];
    latestTestRun: TestRunList;
    testRunUpdates: { testRunUpdate: Update<TestRunList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchTestRunsList: TestRunList[]) { }
}

export class LoadTestRunByIdForStatusTriggered implements Action {
    type = TestRunActionTypes.LoadTestRunByIdForStatusTriggered;
    testRunId: string;
    testRuns: TestRun;
    deleteTestRun: TestRun;
    deleteTestRunId: string;
    searchTestRunsListForStatus: TestRunList[];
    testRunUpdatesForStatus: { testRunUpdateForStatus: Update<TestRunList> };
    searchTestRunsList: TestRunList[];
    testRunsList: TestRunList[];
    latestTestRun: TestRunList;
    testRunUpdates: { testRunUpdate: Update<TestRunList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchTestRunForStatus: TestRun) { }
}

export class LoadTestRunByIdForStatusCompleted implements Action {
    type = TestRunActionTypes.LoadTestRunByIdForStatusCompleted;
    testRunId: string;
    testRuns: TestRun;
    deleteTestRun: TestRun;
    deleteTestRunId: string;
    searchTestRunForStatus: TestRun;
    testRunUpdatesForStatus: { testRunUpdateForStatus: Update<TestRunList> };
    searchTestRunsList: TestRunList[];
    testRunsList: TestRunList[];
    latestTestRun: TestRunList;
    testRunUpdates: { testRunUpdate: Update<TestRunList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchTestRunsListForStatus: TestRunList[]) { }
}

export class LoadTestRunDeleteTriggered implements Action {
    type = TestRunActionTypes.LoadTestRunDeleteTriggered;
    testRunId: string;
    testRuns: TestRun;
    deleteTestRunId: string;
    searchTestRun: TestRun;
    searchTestRunForStatus: TestRun;
    searchTestRunsListForStatus: TestRunList[];
    testRunUpdatesForStatus: { testRunUpdateForStatus: Update<TestRunList> };
    searchTestRunsList: TestRunList[];
    testRunsList: TestRunList[];
    latestTestRun: TestRunList;
    testRunUpdates: { testRunUpdate: Update<TestRunList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public deleteTestRun: TestRun) { }
}

export class LoadTestRunDeleteCompleted implements Action {
    type = TestRunActionTypes.LoadTestRunDeleteCompleted;
    testRunId: string;
    testRuns: TestRun;
    deleteTestRun: TestRun;
    searchTestRun: TestRun;
    searchTestRunForStatus: TestRun;
    searchTestRunsListForStatus: TestRunList[];
    testRunUpdatesForStatus: { testRunUpdateForStatus: Update<TestRunList> };
    searchTestRunsList: TestRunList[];
    testRunsList: TestRunList[];
    latestTestRun: TestRunList;
    testRunUpdates: { testRunUpdate: Update<TestRunList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public deleteTestRunId: string) { }
}

export class LoadTestRunListTriggered implements Action {
    type = TestRunActionTypes.LoadTestRunListTriggered;
    testRun: TestRun;
    testRunId: string;
    deleteTestRun: TestRun;
    deleteTestRunId: string;
    searchTestRun: TestRun;
    searchTestRunForStatus: TestRun;
    searchTestRunsListForStatus: TestRunList[];
    testRunUpdatesForStatus: { testRunUpdateForStatus: Update<TestRunList> };
    searchTestRunsList: TestRunList[];
    testRunsList: TestRunList[];
    latestTestRun: TestRunList;
    testRunUpdates: { testRunUpdate: Update<TestRunList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public testRuns: TestRun) { }
}

export class LoadTestRunListCompleted implements Action {
    type = TestRunActionTypes.LoadTestRunListCompleted;
    testRun: TestRun;
    testRunId: string;
    deleteTestRun: TestRun;
    deleteTestRunId: string;
    searchTestRun: TestRun;
    searchTestRunForStatus: TestRun;
    searchTestRunsListForStatus: TestRunList[];
    testRunUpdatesForStatus: { testRunUpdateForStatus: Update<TestRunList> };
    searchTestRunsList: TestRunList[];
    testRuns: TestRun;
    latestTestRun: TestRunList;
    testRunUpdates: { testRunUpdate: Update<TestRunList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public testRunsList: TestRunList[]) { }
}

export class RefreshTestRunsList implements Action {
    type = TestRunActionTypes.RefreshTestRunsList;
    testRunId: string;
    testRuns: TestRun;
    deleteTestRun: TestRun;
    deleteTestRunId: string;
    searchTestRun: TestRun;
    searchTestRunForStatus: TestRun;
    searchTestRunsListForStatus: TestRunList[];
    testRunUpdatesForStatus: { testRunUpdateForStatus: Update<TestRunList> };
    searchTestRunsList: TestRunList[];
    testRunsList: TestRunList[];
    testRunUpdates: { testRunUpdate: Update<TestRunList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public latestTestRun: TestRunList) { }
}

export class TestRunEditCompletedWithInPlaceUpdate implements Action {
    type = TestRunActionTypes.TestRunEditCompletedWithInPlaceUpdate;
    testRunId: string;
    testRuns: TestRun;
    deleteTestRun: TestRun;
    deleteTestRunId: string;
    searchTestRun: TestRun;
    searchTestRunForStatus: TestRun;
    searchTestRunsListForStatus: TestRunList[];
    testRunUpdatesForStatus: { testRunUpdateForStatus: Update<TestRunList> };
    searchTestRunsList: TestRunList[];
    testRunsList: TestRunList[];
    latestTestRun: TestRunList;
    responseMessages: string[];
    errorMessage: string;
    constructor(public testRunUpdates: { testRunUpdate: Update<TestRunList> }) { }
}

export class TestRunEditCompletedWithInPlaceUpdateForStatus implements Action {
    type = TestRunActionTypes.TestRunEditCompletedWithInPlaceUpdateForStatus;
    testRunId: string;
    testRuns: TestRun;
    deleteTestRun: TestRun;
    deleteTestRunId: string;
    searchTestRun: TestRun;
    searchTestRunForStatus: TestRun;
    searchTestRunsListForStatus: TestRunList[];
    testRunsList: TestRunList[];
    latestTestRun: TestRunList;
    testRunUpdates: { testRunUpdate: Update<TestRunList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public testRunUpdatesForStatus: { testRunUpdateForStatus: Update<TestRunList> }) { }
}

export class TestRunFailed implements Action {
    type = TestRunActionTypes.TestRunFailed;
    testRunId: string;
    testRuns: TestRun;
    deleteTestRun: TestRun;
    deleteTestRunId: string;
    searchTestRun: TestRun;
    searchTestRunForStatus: TestRun;
    searchTestRunsListForStatus: TestRunList[];
    testRunUpdatesForStatus: { testRunUpdateForStatus: Update<TestRunList> };
    searchTestRunsList: TestRunList[];
    testRunsList: TestRunList[];
    latestTestRun: TestRunList;
    testRunUpdates: { testRunUpdate: Update<TestRunList> };
    errorMessage: string;
    constructor(public responseMessages: string[]) { }
}

export class TestRunException implements Action {
    type = TestRunActionTypes.TestRunException;
    testRunId: string;
    testRuns: TestRun;
    deleteTestRun: TestRun;
    deleteTestRunId: string;
    searchTestRun: TestRun;
    searchTestRunForStatus: TestRun;
    searchTestRunsListForStatus: TestRunList[];
    testRunUpdatesForStatus: { testRunUpdateForStatus: Update<TestRunList> };
    searchTestRunsList: TestRunList[];
    testRunsList: TestRunList[];
    latestTestRun: TestRunList;
    testRunUpdates: { testRunUpdate: Update<TestRunList> };
    responseMessages: string[];
    constructor(public errorMessage: string) { }
}

export type TestRunActions = LoadTestRunTriggered | LoadTestRunCompleted | LoadTestRunByIdTriggered | LoadTestRunByIdCompleted | LoadTestRunByIdForStatusTriggered | LoadTestRunByIdForStatusCompleted | LoadTestRunDeleteTriggered | LoadTestRunDeleteCompleted | LoadTestRunListTriggered | LoadTestRunListCompleted | RefreshTestRunsList | TestRunEditCompletedWithInPlaceUpdate | TestRunEditCompletedWithInPlaceUpdateForStatus | TestRunFailed | TestRunException