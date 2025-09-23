import { Action } from '@ngrx/store';
import { TestCaseDropdownList } from '../../models/testcasedropdown';

export enum TestCaseSectionActionTypes {
    LoadTestCaseSectionListTriggered = '[Snovasys-TM] [Test Case Component] Initial Test Case Section List Load Triggered',
    LoadTestCaseSectionListCompleted = '[Snovasys-TM] [Test Case Component] Initial Test Case Section List Load Completed',
    LoadTestCaseSectionListForShiftTriggered = '[Snovasys-TM] [Test Case Component] Initial Test Case Section List For Shift Load Triggered',
    LoadTestCaseSectionListForShiftCompleted = '[Snovasys-TM] [Test Case Component] Initial Test Case Section List For Shift Load Completed'
}

export class LoadTestCaseSectionListTriggered implements Action {
    type = TestCaseSectionActionTypes.LoadTestCaseSectionListTriggered;
    testCaseSectionList: TestCaseDropdownList[];
    suiteForShiftId: string;
    testCaseSectionShiftList: TestCaseDropdownList[];
    constructor(public suiteId: string) { }
}

export class LoadTestCaseSectionListCompleted implements Action {
    type = TestCaseSectionActionTypes.LoadTestCaseSectionListCompleted;
    suiteId: string;
    suiteForShiftId: string;
    testCaseSectionShiftList: TestCaseDropdownList[];
    constructor(public testCaseSectionList: TestCaseDropdownList[]) { }
}

export class LoadTestCaseSectionListForShiftTriggered implements Action {
    type = TestCaseSectionActionTypes.LoadTestCaseSectionListForShiftTriggered;
    testCaseSectionList: TestCaseDropdownList[];
    testCaseSectionShiftList: TestCaseDropdownList[];
    constructor(public suiteForShiftId: string) { }
}

export class LoadTestCaseSectionListForShiftCompleted implements Action {
    type = TestCaseSectionActionTypes.LoadTestCaseSectionListForShiftCompleted;
    suiteId: string;
    testCaseSectionList: TestCaseDropdownList[];
    suiteForShiftId: string;
    constructor(public testCaseSectionShiftList: TestCaseDropdownList[]) { }
}

export type TestCaseSectionActions = LoadTestCaseSectionListTriggered | LoadTestCaseSectionListCompleted | LoadTestCaseSectionListForShiftTriggered | LoadTestCaseSectionListForShiftCompleted