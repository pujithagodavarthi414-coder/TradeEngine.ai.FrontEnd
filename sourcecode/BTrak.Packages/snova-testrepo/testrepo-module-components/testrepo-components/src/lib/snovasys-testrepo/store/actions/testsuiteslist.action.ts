import { Action } from '@ngrx/store';
import { TestSuite } from '../../models/testsuite';
import { TestSuiteList } from '../../models/testsuite';
import { Update } from '@ngrx/entity';

export enum TestSuiteActionTypes {
    LoadTestSuiteTriggered = '[Snovasys-TM] [Test suite Component] Initial Test Suite Load Triggered',
    LoadTestSuiteCompleted = '[Snovasys-TM] [Test suite Component] Initial Test Suite Load Completed',
    MoveTestSuiteTriggered = '[Snovasys-TM] [Test suite Component] Move Test Suite Triggered',
    MoveTestSuiteCompleted = '[Snovasys-TM] [Test suite Component] Move Test Suite Completed',
    MoveTestSuiteFailed = '[Snovasys-TM] [Test suite Component] Move Test Suite Failed',
    LoadTestSuiteByIdTriggered = '[Snovasys-TM] [Test suite Component] Initial Test Suite By Id Load Triggered',
    LoadTestSuiteByIdCompleted = '[Snovasys-TM] [Test suite Component] Initial Test Suite By Id Load Completed',
    LoadMultipleTestSuiteByIdTriggered = '[Snovasys-TM] [Test suite Component] Initial Multiple Test Suites Load Triggered',
    LoadMultipleTestSuiteByIdCompleted = '[Snovasys-TM] [Test suite Component] Initial Multiple Test Suites Load Completed',
    LoadTestSuiteDeleteTriggered = '[Snovasys-TM] [Test suite Component] Initial Test Suite Load Delete Triggered',
    LoadTestSuiteDeleteCompleted = '[Snovasys-TM] [Test suite Component] Initial Test Suite Load Delete Completed',
    LoadTestSuiteListTriggered = '[Snovasys-TM] [Test suite Component] Initial Test Suite List Load Triggered',
    LoadTestSuiteListCompleted = '[Snovasys-TM] [Test suite Component] Initial Test Suite List Load Completed',
    RefreshTestSuitesList = '[Snovasys-TM] [Test suite Component] Initial Test Suite Refresh List Load Completed',
    TestSuiteEditCompletedWithInPlaceUpdate = '[Snovasys-TM] [Test suite Component] Initial Test Suite Update Load Completed',
    TestSuiteFailed = '[Snovasys-TM] [Test suite Component] Test Suite Load Failed',
    TestSuiteException = '[Snovasys-TM] [Test suite Component] Test Suite Exception Handled'
}

export class LoadTestSuiteTriggered implements Action {
    type = TestSuiteActionTypes.LoadTestSuiteTriggered;
    projectId: string;
    testSuites: TestSuiteList;
    searchTestSuiteSuccess: TestSuiteList[];
    searchTestSuite: TestSuiteList;
    testSuiteList: TestSuiteList[];
    deleteTestSuite: TestSuite;
    deleteId: string;
    latestTestSuiteData: TestSuiteList;
    searchMultipleTestSuites: TestSuiteList;
    multipleTestSuite: { multipleTestSuites: Update<TestSuiteList>[] };
    testSuiteUpdates: { testSuiteUpdate: Update<TestSuiteList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public testSuite: TestSuite) { }
}

export class LoadTestSuiteCompleted implements Action {
    type = TestSuiteActionTypes.LoadTestSuiteCompleted;
    testSuite: TestSuite;
    testSuites: TestSuiteList;
    searchTestSuiteSuccess: TestSuiteList[];
    searchTestSuite: TestSuiteList;
    testSuiteList: TestSuiteList[];
    deleteTestSuite: TestSuite;
    deleteId: string;
    latestTestSuiteData: TestSuiteList;
    searchMultipleTestSuites: TestSuiteList;
    multipleTestSuite: { multipleTestSuites: Update<TestSuiteList>[] };
    testSuiteUpdates: { testSuiteUpdate: Update<TestSuiteList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public projectId: string) { }
}

export class LoadTestSuiteByIdTriggered implements Action {
    type = TestSuiteActionTypes.LoadTestSuiteByIdTriggered;
    projectId: string;
    testSuite: TestSuite;
    testSuites: TestSuiteList;
    searchTestSuiteSuccess: TestSuiteList[];
    testSuiteList: TestSuiteList[];
    deleteTestSuite: TestSuite;
    deleteId: string;
    latestTestSuiteData: TestSuiteList;
    searchMultipleTestSuites: TestSuiteList;
    multipleTestSuite: { multipleTestSuites: Update<TestSuiteList>[] };
    testSuiteUpdates: { testSuiteUpdate: Update<TestSuiteList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchTestSuite: TestSuiteList) { }
}

export class LoadTestSuiteByIdCompleted implements Action {
    type = TestSuiteActionTypes.LoadTestSuiteByIdCompleted;
    projectId: string;
    testSuite: TestSuite;
    testSuites: TestSuiteList;
    searchTestSuite: TestSuiteList;
    testSuiteList: TestSuiteList[];
    deleteTestSuite: TestSuite;
    deleteId: string;
    latestTestSuiteData: TestSuiteList;
    searchMultipleTestSuites: TestSuiteList;
    multipleTestSuite: { multipleTestSuites: Update<TestSuiteList>[] };
    testSuiteUpdates: { testSuiteUpdate: Update<TestSuiteList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchTestSuiteSuccess: TestSuiteList[]) { }
}

export class LoadMultipleTestSuiteByIdTriggered implements Action {
    type = TestSuiteActionTypes.LoadMultipleTestSuiteByIdTriggered;
    projectId: string;
    testSuite: TestSuite;
    testSuites: TestSuiteList;
    searchTestSuite: TestSuiteList;
    testSuiteList: TestSuiteList[];
    searchTestSuiteSuccess: TestSuiteList[];
    deleteTestSuite: TestSuite;
    deleteId: string;
    latestTestSuiteData: TestSuiteList;
    multipleTestSuite: { multipleTestSuites: Update<TestSuiteList>[] };
    testSuiteUpdates: { testSuiteUpdate: Update<TestSuiteList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchMultipleTestSuites: TestSuiteList) { }
}

export class LoadMultipleTestSuiteByIdCompleted implements Action {
    type = TestSuiteActionTypes.LoadMultipleTestSuiteByIdCompleted;
    projectId: string;
    testSuite: TestSuite;
    testSuites: TestSuiteList;
    searchTestSuite: TestSuiteList;
    testSuiteList: TestSuiteList[];
    searchTestSuiteSuccess: TestSuiteList[];
    deleteTestSuite: TestSuite;
    deleteId: string;
    latestTestSuiteData: TestSuiteList;
    searchMultipleTestSuites: TestSuiteList;
    testSuiteUpdates: { testSuiteUpdate: Update<TestSuiteList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public multipleTestSuite: { multipleTestSuites: Update<TestSuiteList>[] }) { }
}

export class LoadTestSuiteDeleteTriggered implements Action {
    type = TestSuiteActionTypes.LoadTestSuiteDeleteTriggered;
    testSuite: TestSuite;
    projectId: string;
    testSuites: TestSuiteList;
    searchTestSuiteSuccess: TestSuiteList[];
    searchTestSuite: TestSuiteList;
    testSuiteList: TestSuiteList[];
    deleteId: string;
    latestTestSuiteData: TestSuiteList;
    searchMultipleTestSuites: TestSuiteList;
    multipleTestSuite: { multipleTestSuites: Update<TestSuiteList>[] };
    testSuiteUpdates: { testSuiteUpdate: Update<TestSuiteList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public deleteTestSuite: TestSuite) { }
}

export class LoadTestSuiteDeleteCompleted implements Action {
    type = TestSuiteActionTypes.LoadTestSuiteDeleteCompleted;
    testSuite: TestSuite;
    projectId: string;
    searchTestSuiteSuccess: TestSuiteList[];
    searchTestSuite: TestSuiteList;
    testSuites: TestSuiteList;
    testSuiteList: TestSuiteList[];
    deleteTestSuite: TestSuite;
    latestTestSuiteData: TestSuiteList;
    searchMultipleTestSuites: TestSuiteList;
    multipleTestSuite: { multipleTestSuites: Update<TestSuiteList>[] };
    testSuiteUpdates: { testSuiteUpdate: Update<TestSuiteList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public deleteId: string) { }
}

export class MoveTestSuiteTriggered implements Action {
    type = TestSuiteActionTypes.MoveTestSuiteTriggered;
    deleteId: string
    projectId: string;
    searchTestSuiteSuccess: TestSuiteList[];
    searchTestSuite: TestSuiteList;
    testSuites: TestSuiteList;
    testSuiteList: TestSuiteList[];
    deleteTestSuite: TestSuite;
    latestTestSuiteData: TestSuiteList;
    searchMultipleTestSuites: TestSuiteList;
    multipleTestSuite: { multipleTestSuites: Update<TestSuiteList>[] };
    testSuiteUpdates: { testSuiteUpdate: Update<TestSuiteList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public testSuite: TestSuite) { }
}

export class MoveTestSuiteCompleted implements Action {
    type = TestSuiteActionTypes.MoveTestSuiteCompleted;
    testSuite: TestSuite;
    projectId: string;
    searchTestSuiteSuccess: TestSuiteList[];
    searchTestSuite: TestSuiteList;
    testSuites: TestSuiteList;
    testSuiteList: TestSuiteList[];
    deleteTestSuite: TestSuite;
    latestTestSuiteData: TestSuiteList;
    searchMultipleTestSuites: TestSuiteList;
    multipleTestSuite: { multipleTestSuites: Update<TestSuiteList>[] };
    testSuiteUpdates: { testSuiteUpdate: Update<TestSuiteList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public deleteId: string) { }
}


export class MoveTestSuiteFailed implements Action {
    type = TestSuiteActionTypes.MoveTestSuiteFailed;
    projectId: string;
    testSuite: TestSuite;
    searchTestSuiteSuccess: TestSuiteList[];
    searchTestSuite: TestSuiteList;
    testSuites: TestSuiteList;
    testSuiteList: TestSuiteList[];
    deleteTestSuite: TestSuite;
    deleteId: string;
    latestTestSuiteData: TestSuiteList;
    searchMultipleTestSuites: TestSuiteList;
    multipleTestSuite: { multipleTestSuites: Update<TestSuiteList>[] };
    testSuiteUpdates: { testSuiteUpdate: Update<TestSuiteList> };
    errorMessage: string;
    constructor(public responseMessages: string[]) { }
}


export class LoadTestSuiteListTriggered implements Action {
    type = TestSuiteActionTypes.LoadTestSuiteListTriggered;
    projectId: string;
    testSuite: TestSuite;
    searchTestSuiteSuccess: TestSuiteList[];
    searchTestSuite: TestSuiteList;
    testSuiteList: TestSuiteList[];
    deleteTestSuite: TestSuite;
    deleteId: string;
    latestTestSuiteData: TestSuiteList;
    searchMultipleTestSuites: TestSuiteList;
    multipleTestSuite: { multipleTestSuites: Update<TestSuiteList>[] };
    testSuiteUpdates: { testSuiteUpdate: Update<TestSuiteList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public testSuites: TestSuiteList) { }
}

export class LoadTestSuiteListCompleted implements Action {
    type = TestSuiteActionTypes.LoadTestSuiteListCompleted;
    testSuite: TestSuite;
    projectId: string;
    searchTestSuiteSuccess: TestSuiteList[];
    searchTestSuite: TestSuiteList;
    testSuites: TestSuiteList;
    deleteTestSuite: TestSuite;
    deleteId: string;
    latestTestSuiteData: TestSuiteList;
    searchMultipleTestSuites: TestSuiteList;
    multipleTestSuite: { multipleTestSuites: Update<TestSuiteList>[] };
    testSuiteUpdates: { testSuiteUpdate: Update<TestSuiteList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public testSuiteList: TestSuiteList[]) { }
}

export class RefreshTestSuitesList implements Action {
    type = TestSuiteActionTypes.RefreshTestSuitesList;
    projectId: string;
    testSuite: TestSuite;
    testSuites: TestSuiteList;
    searchTestSuiteSuccess: TestSuiteList[];
    searchTestSuite: TestSuiteList;
    testSuiteList: TestSuiteList[];
    deleteTestSuite: TestSuite;
    deleteId: string;
    searchMultipleTestSuites: TestSuiteList;
    multipleTestSuite: { multipleTestSuites: Update<TestSuiteList>[] };
    testSuiteUpdates: { testSuiteUpdate: Update<TestSuiteList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public latestTestSuiteData: TestSuiteList) { }
}

export class TestSuiteEditCompletedWithInPlaceUpdate implements Action {
    type = TestSuiteActionTypes.TestSuiteEditCompletedWithInPlaceUpdate;
    projectId: string;
    testSuite: TestSuite;
    testSuites: TestSuiteList;
    searchTestSuiteSuccess: TestSuiteList[];
    searchTestSuite: TestSuiteList;
    testSuiteList: TestSuiteList[];
    deleteTestSuite: TestSuite;
    deleteId: string;
    latestTestSuiteData: TestSuiteList;
    searchMultipleTestSuites: TestSuiteList;
    multipleTestSuite: { multipleTestSuites: Update<TestSuiteList>[] };
    responseMessages: string[];
    errorMessage: string;
    constructor(public testSuiteUpdates: { testSuiteUpdate: Update<TestSuiteList> }) { }
}

export class TestSuiteFailed implements Action {
    type = TestSuiteActionTypes.TestSuiteFailed;
    projectId: string;
    testSuite: TestSuite;
    searchTestSuiteSuccess: TestSuiteList[];
    searchTestSuite: TestSuiteList;
    testSuites: TestSuiteList;
    testSuiteList: TestSuiteList[];
    deleteTestSuite: TestSuite;
    deleteId: string;
    latestTestSuiteData: TestSuiteList;
    searchMultipleTestSuites: TestSuiteList;
    multipleTestSuite: { multipleTestSuites: Update<TestSuiteList>[] };
    testSuiteUpdates: { testSuiteUpdate: Update<TestSuiteList> };
    errorMessage: string;
    constructor(public responseMessages: string[]) { }
}

export class TestSuiteException implements Action {
    type = TestSuiteActionTypes.TestSuiteException;
    projectId: string;
    testSuite: TestSuite;
    searchTestSuiteSuccess: TestSuiteList[];
    searchTestSuite: TestSuiteList;
    testSuites: TestSuiteList;
    testSuiteList: TestSuiteList[];
    deleteTestSuite: TestSuite;
    deleteId: string;
    latestTestSuiteData: TestSuiteList;
    searchMultipleTestSuites: TestSuiteList;
    multipleTestSuite: { multipleTestSuites: Update<TestSuiteList>[] };
    testSuiteUpdates: { testSuiteUpdate: Update<TestSuiteList> };
    responseMessages: string[];
    constructor(public errorMessage: string) { }
}

export type TestSuiteActions = LoadTestSuiteTriggered | LoadTestSuiteCompleted | LoadTestSuiteByIdTriggered | LoadTestSuiteByIdCompleted | LoadMultipleTestSuiteByIdTriggered | LoadMultipleTestSuiteByIdCompleted | LoadTestSuiteDeleteTriggered | LoadTestSuiteDeleteCompleted | LoadTestSuiteListTriggered | LoadTestSuiteListCompleted | RefreshTestSuitesList | TestSuiteEditCompletedWithInPlaceUpdate | TestSuiteFailed | TestSuiteException | MoveTestSuiteTriggered | MoveTestSuiteCompleted | MoveTestSuiteFailed