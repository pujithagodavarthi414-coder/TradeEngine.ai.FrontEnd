import { Action } from '@ngrx/store';
import { TestCaseDropdownList } from '../../models/testcasedropdown';

export enum TestCaseStatusActionTypes {
    LoadTestCaseStatusListTriggered = '[Snovasys-TM] [Test Case Component] Initial Test Case Status List Load Triggered',
    LoadTestCaseStatusListCompleted = '[Snovasys-TM] [Test Case Component] Initial Test Case Status List Load Completed',
    LoadTestCaseStatusListFromCache = '[Snovasys-TM] [Test Case Component] Initial Test Case Status List Load Cache Completed'
}

export class LoadTestCaseStatusListTriggered implements Action {
    type = TestCaseStatusActionTypes.LoadTestCaseStatusListTriggered;
    testCaseStatusList: TestCaseDropdownList[];
    constructor(public dropDownList: TestCaseDropdownList) { }
}

export class LoadTestCaseStatusListCompleted implements Action {
    type = TestCaseStatusActionTypes.LoadTestCaseStatusListCompleted;
    dropDownList: TestCaseDropdownList;
    constructor(public testCaseStatusList: TestCaseDropdownList[]) { }
}

export class LoadTestCaseStatusListFromCache implements Action {
    type = TestCaseStatusActionTypes.LoadTestCaseStatusListFromCache;
    dropDownList: TestCaseDropdownList;
    testCaseStatusList: TestCaseDropdownList[];
    constructor() { }
}

export type TestCaseStatusActions = LoadTestCaseStatusListTriggered | LoadTestCaseStatusListCompleted | LoadTestCaseStatusListFromCache