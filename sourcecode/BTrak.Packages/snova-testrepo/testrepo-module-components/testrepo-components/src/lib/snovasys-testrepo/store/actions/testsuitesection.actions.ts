import { Action } from '@ngrx/store';
import { TestSuiteSection, TestSuiteCases, TestSuiteRunSections, TestSuiteSections } from '../../models/testsuitesection';

export enum TestSuiteSectionActionTypes {
    LoadTestSuiteSectionTriggered = '[Snovasys-TM] [Test suite Section Component] Initial Test Suite Section Load Triggered',
    LoadTestSuiteSectionCompleted = '[Snovasys-TM] [Test suite Section Component] Initial Test Suite Section Load Completed',
    LoadTestSuiteSectionDeleteTriggered = '[Snovasys-TM] [Test suite Section Component] Initial Test Suite Section Delete Load Triggered',
    LoadTestSuiteSectionDeleteCompleted = '[Snovasys-TM] [Test suite Section Component] Initial Test Suite Section Delete Load Completed',
    LoadTestSuiteSectionListTriggered = '[Snovasys-TM] [Test suite Section Component] Initial Test Suite Section List Load Triggered',
    LoadTestSuiteSectionListCompleted = '[Snovasys-TM] [Test suite Section Component] Initial Test Suite Section List Load Completed',
    LoadTestSuiteSectionFirstTriggered = '[Snovasys-TM] [Test suite Section Component] Initial Test Suite Section First Load Triggered',
    LoadSingleTestSuiteSectionTriggered = '[Test run Section Component] Initial Single Test Suite Section Load Triggered',
    LoadSingleTestSuiteSectionCompleted = '[Test run Section Component] Initial Single Test Suite Section Load Completed',
    LoadTestRunSectionListTriggered = '[Test run Section Component] Initial Test Run Section List Load Triggered',
    LoadTestRunSectionListCompleted = '[Test run Section Component] Initial Test Run Section List Load Completed',
    LoadTestSuiteSectionListForRunsTriggered = '[Snovasys-TM] [Test suite Section Component] Initial Test Suite Section List For Runs Load Triggered',
    LoadTestSuiteSectionListForRunsCompleted = '[Snovasys-TM] [Test suite Section Component] Initial Test Suite Section List For Runs Load Completed',
    LoadTestSuiteSectionEdit = '[Snovasys-TM] [Test suite Section Component] Initial Test Suite Section Edit',
    TestSuiteSectionFailed = '[Snovasys-TM] [Test suite Section Component] Test Suite Section Load Failed',
    TestSuiteSectionException = '[Snovasys-TM] [Test suite Section Component] Test Suite Section Exception Handled'
}

export class LoadTestSuiteSectionTriggered implements Action {
    type = TestSuiteSectionActionTypes.LoadTestSuiteSectionTriggered;
    testSuiteSectionId: string;
    testSuiteRunSection: TestSuiteRunSections;
    sectionsForTestRuns: TestSuiteRunSections;
    testRunSection: TestSuiteRunSections;
    testRunSectionList: TestSuiteCases;
    singleTestSuiteSection: TestSuiteRunSections;
    singleTestSuiteSectionData: TestSuiteSections;
    testSuiteSectionListForRun: TestSuiteCases;
    testSuiteSectionList: TestSuiteCases;
    testSuiteSectionDelete: TestSuiteSection;
    testSuiteSectionDeleteId: string;
    responseMessages: string[];
    errorMessage: string;
    constructor(public testSuiteSection: TestSuiteSection) { }
}

export class LoadTestSuiteSectionCompleted implements Action {
    type = TestSuiteSectionActionTypes.LoadTestSuiteSectionCompleted;
    testSuiteSection: TestSuiteSection;
    testSuiteRunSection: TestSuiteRunSections;
    sectionsForTestRuns: TestSuiteRunSections;
    testRunSection: TestSuiteRunSections;
    testRunSectionList: TestSuiteCases;
    singleTestSuiteSection: TestSuiteRunSections;
    singleTestSuiteSectionData: TestSuiteSections;
    testSuiteSectionListForRun: TestSuiteCases;
    testSuiteSectionList: TestSuiteCases;
    testSuiteSectionDelete: TestSuiteSection;
    testSuiteSectionDeleteId: string;
    responseMessages: string[];
    errorMessage: string;
    constructor(public testSuiteSectionId: string) { }
}

export class LoadTestSuiteSectionDeleteTriggered implements Action {
    type = TestSuiteSectionActionTypes.LoadTestSuiteSectionDeleteTriggered;
    testSuiteSectionId: string;
    testSuiteSection: TestSuiteSection;
    sectionsForTestRuns: TestSuiteRunSections;
    testRunSection: TestSuiteRunSections;
    testRunSectionList: TestSuiteCases;
    singleTestSuiteSection: TestSuiteRunSections;
    singleTestSuiteSectionData: TestSuiteSections;
    testSuiteSectionListForRun: TestSuiteCases;
    testSuiteRunSection: TestSuiteRunSections;
    testSuiteSectionList: TestSuiteCases;
    testSuiteSectionDeleteId: string;
    responseMessages: string[];
    errorMessage: string;
    constructor(public testSuiteSectionDelete: TestSuiteSection) { }
}

export class LoadTestSuiteSectionDeleteCompleted implements Action {
    type = TestSuiteSectionActionTypes.LoadTestSuiteSectionDeleteCompleted;
    testSuiteSection: TestSuiteSection;
    testSuiteSectionId: string;
    testSuiteRunSection: TestSuiteRunSections;
    testRunSection: TestSuiteRunSections;
    testRunSectionList: TestSuiteCases;
    singleTestSuiteSection: TestSuiteRunSections;
    singleTestSuiteSectionData: TestSuiteSections;
    sectionsForTestRuns: TestSuiteRunSections;
    testSuiteSectionListForRun: TestSuiteCases;
    testSuiteSectionList: TestSuiteCases;
    testSuiteSectionDelete: TestSuiteSection;
    responseMessages: string[];
    errorMessage: string;
    constructor(public testSuiteSectionDeleteId: string) { }
}

export class LoadTestSuiteSectionListTriggered implements Action {
    type = TestSuiteSectionActionTypes.LoadTestSuiteSectionListTriggered;
    testSuiteSectionId: string;
    sectionsForTestRuns: TestSuiteRunSections;
    testSuiteSectionListForRun: TestSuiteCases;
    testSuiteSection: TestSuiteSection;
    testRunSection: TestSuiteRunSections;
    singleTestSuiteSection: TestSuiteRunSections;
    singleTestSuiteSectionData: TestSuiteSections;
    testRunSectionList: TestSuiteCases;
    testSuiteSectionList: TestSuiteCases;
    testSuiteSectionDelete: TestSuiteSection;
    testSuiteSectionDeleteId: string;
    responseMessages: string[];
    errorMessage: string;
    constructor(public testSuiteRunSection: TestSuiteRunSections) { }
}

export class LoadTestSuiteSectionListCompleted implements Action {
    type = TestSuiteSectionActionTypes.LoadTestSuiteSectionListCompleted;
    testSuiteSectionId: string;
    testSuiteSection: TestSuiteSection;
    testSuiteRunSection: TestSuiteRunSections;
    sectionsForTestRuns: TestSuiteRunSections;
    testRunSection: TestSuiteRunSections;
    singleTestSuiteSection: TestSuiteRunSections;
    singleTestSuiteSectionData: TestSuiteSections;
    testRunSectionList: TestSuiteCases;
    testSuiteSectionListForRun: TestSuiteCases;
    testSuiteSectionDelete: TestSuiteSection;
    testSuiteSectionDeleteId: string;
    responseMessages: string[];
    errorMessage: string;
    constructor(public testSuiteSectionList: TestSuiteCases) { }
}

export class LoadTestSuiteSectionFirstTriggered implements Action {
    type = TestSuiteSectionActionTypes.LoadTestSuiteSectionFirstTriggered;
    testSuiteSectionId: string;
    sectionsForTestRuns: TestSuiteRunSections;
    testSuiteSectionListForRun: TestSuiteCases;
    testSuiteSection: TestSuiteSection;
    testRunSection: TestSuiteRunSections;
    singleTestSuiteSection: TestSuiteRunSections;
    singleTestSuiteSectionData: TestSuiteSections;
    testRunSectionList: TestSuiteCases;
    testSuiteSectionList: TestSuiteCases;
    testSuiteSectionDelete: TestSuiteSection;
    testSuiteSectionDeleteId: string;
    responseMessages: string[];
    errorMessage: string;
    constructor() { }
}

export class LoadSingleTestSuiteSectionTriggered implements Action {
    type = TestSuiteSectionActionTypes.LoadSingleTestSuiteSectionTriggered;
    testSuiteSectionId: string;
    sectionsForTestRuns: TestSuiteRunSections;
    testSuiteSectionListForRun: TestSuiteCases;
    testSuiteSection: TestSuiteSection;
    testRunSection: TestSuiteRunSections;
    singleTestSuiteSectionData: TestSuiteSections;
    testRunSectionList: TestSuiteCases;
    testSuiteSectionList: TestSuiteCases;
    testSuiteSectionDelete: TestSuiteSection;
    testSuiteSectionDeleteId: string;
    responseMessages: string[];
    errorMessage: string;
    constructor(public singleTestSuiteSection: TestSuiteRunSections) { }
}

export class LoadSingleTestSuiteSectionCompleted implements Action {
    type = TestSuiteSectionActionTypes.LoadSingleTestSuiteSectionCompleted;
    testSuiteSectionId: string;
    sectionsForTestRuns: TestSuiteRunSections;
    testSuiteSectionListForRun: TestSuiteCases;
    testSuiteSection: TestSuiteSection;
    singleTestSuiteSection: TestSuiteRunSections;
    testRunSection: TestSuiteRunSections;
    testRunSectionList: TestSuiteCases;
    testSuiteSectionList: TestSuiteCases;
    testSuiteSectionDelete: TestSuiteSection;
    testSuiteSectionDeleteId: string;
    responseMessages: string[];
    errorMessage: string;
    constructor(public singleTestSuiteSectionData: TestSuiteSections) { }
}

export class LoadTestRunSectionListTriggered implements Action {
    type = TestSuiteSectionActionTypes.LoadTestRunSectionListTriggered;
    testSuiteSectionId: string;
    sectionsForTestRuns: TestSuiteRunSections;
    testSuiteSectionListForRun: TestSuiteCases;
    testSuiteSection: TestSuiteSection;
    testRunSectionList: TestSuiteCases;
    singleTestSuiteSection: TestSuiteRunSections;
    singleTestSuiteSectionData: TestSuiteSections;
    testSuiteSectionList: TestSuiteCases;
    testSuiteSectionDelete: TestSuiteSection;
    testSuiteSectionDeleteId: string;
    responseMessages: string[];
    errorMessage: string;
    constructor(public testRunSection: TestSuiteRunSections) { }
}

export class LoadTestRunSectionListCompleted implements Action {
    type = TestSuiteSectionActionTypes.LoadTestRunSectionListCompleted;
    testSuiteSectionId: string;
    sectionsForTestRuns: TestSuiteRunSections;
    testSuiteSectionListForRun: TestSuiteCases;
    testSuiteSection: TestSuiteSection;
    testRunSection: TestSuiteRunSections;
    singleTestSuiteSection: TestSuiteRunSections;
    singleTestSuiteSectionData: TestSuiteSections;
    testSuiteSectionList: TestSuiteCases;
    testSuiteSectionDelete: TestSuiteSection;
    testSuiteSectionDeleteId: string;
    responseMessages: string[];
    errorMessage: string;
    constructor(public testRunSectionList: TestSuiteCases) { }
}

export class LoadTestSuiteSectionListForRunsTriggered implements Action {
    type = TestSuiteSectionActionTypes.LoadTestSuiteSectionListForRunsTriggered;
    testSuiteSectionId: string;
    testSuiteSectionListForRun: TestSuiteCases;
    testSuiteSection: TestSuiteSection;
    testRunSection: TestSuiteRunSections;
    testRunSectionList: TestSuiteCases;
    singleTestSuiteSection: TestSuiteRunSections;
    singleTestSuiteSectionData: TestSuiteSections;
    testSuiteSectionList: TestSuiteCases;
    testSuiteSectionDelete: TestSuiteSection;
    testSuiteSectionDeleteId: string;
    responseMessages: string[];
    errorMessage: string;
    constructor(public sectionsForTestRuns: TestSuiteRunSections) { }
}

export class LoadTestSuiteSectionListForRunsCompleted implements Action {
    type = TestSuiteSectionActionTypes.LoadTestSuiteSectionListForRunsCompleted;
    testSuiteSectionId: string;
    sectionsForTestRuns: TestSuiteRunSections;
    testSuiteSection: TestSuiteSection;
    testRunSection: TestSuiteRunSections;
    testRunSectionList: TestSuiteCases;
    singleTestSuiteSection: TestSuiteRunSections;
    singleTestSuiteSectionData: TestSuiteSections;
    testSuiteSectionList: TestSuiteCases;
    testSuiteSectionDelete: TestSuiteSection;
    testSuiteSectionDeleteId: string;
    responseMessages: string[];
    errorMessage: string;
    constructor(public testSuiteSectionListForRun: TestSuiteCases) { }
}

export class LoadTestSuiteSectionEdit implements Action {
    type = TestSuiteSectionActionTypes.LoadTestSuiteSectionEdit;
    testSuiteSectionId: string;
    testSuiteRunSection: TestSuiteRunSections;
    sectionsForTestRuns: TestSuiteRunSections;
    testRunSection: TestSuiteRunSections;
    testRunSectionList: TestSuiteCases;
    singleTestSuiteSection: TestSuiteRunSections;
    singleTestSuiteSectionData: TestSuiteSections;
    testSuiteSectionListForRun: TestSuiteCases;
    testSuiteSection: TestSuiteSection;
    testSuiteSectionList: TestSuiteCases;
    testSuiteSectionDelete: TestSuiteSection;
    testSuiteSectionDeleteId: string;
    errorMessage: string;
    constructor() { }
}

export class TestSuiteSectionFailed implements Action {
    type = TestSuiteSectionActionTypes.TestSuiteSectionFailed;
    testSuiteSectionId: string;
    testSuiteRunSection: TestSuiteRunSections;
    sectionsForTestRuns: TestSuiteRunSections;
    testRunSection: TestSuiteRunSections;
    testRunSectionList: TestSuiteCases;
    singleTestSuiteSection: TestSuiteRunSections;
    singleTestSuiteSectionData: TestSuiteSections;
    testSuiteSectionListForRun: TestSuiteCases;
    testSuiteSection: TestSuiteSection;
    testSuiteSectionList: TestSuiteCases;
    testSuiteSectionDelete: TestSuiteSection;
    testSuiteSectionDeleteId: string;
    errorMessage: string;
    constructor(public responseMessages: string[]) { }
}

export class TestSuiteSectionException implements Action {
    type = TestSuiteSectionActionTypes.TestSuiteSectionException;
    testSuiteSectionId: string;
    testSuiteRunSection: TestSuiteRunSections;
    sectionsForTestRuns: TestSuiteRunSections;
    testRunSection: TestSuiteRunSections;
    testRunSectionList: TestSuiteCases;
    singleTestSuiteSection: TestSuiteRunSections;
    singleTestSuiteSectionData: TestSuiteSections;
    testSuiteSectionListForRun: TestSuiteCases;
    testSuiteSection: TestSuiteSection;
    testSuiteSectionList: TestSuiteCases;
    testSuiteSectionDelete: TestSuiteSection;
    testSuiteSectionDeleteId: string;
    responseMessages: string[];
    constructor(public errorMessage: string) { }
}

export type TestSuiteSectionActions = LoadTestSuiteSectionTriggered | LoadTestSuiteSectionCompleted | LoadTestSuiteSectionDeleteTriggered | LoadTestSuiteSectionDeleteCompleted | LoadTestSuiteSectionListTriggered | LoadTestSuiteSectionListCompleted | LoadTestSuiteSectionFirstTriggered | LoadSingleTestSuiteSectionTriggered | LoadSingleTestSuiteSectionCompleted | LoadTestRunSectionListTriggered | LoadTestRunSectionListCompleted | LoadTestSuiteSectionListForRunsTriggered | LoadTestSuiteSectionListForRunsCompleted | LoadTestSuiteSectionEdit | TestSuiteSectionFailed | TestSuiteSectionException