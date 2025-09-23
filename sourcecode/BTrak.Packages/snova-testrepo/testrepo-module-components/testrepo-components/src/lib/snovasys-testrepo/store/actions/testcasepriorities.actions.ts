import { Action } from '@ngrx/store';
import { TestCaseDropdownList } from '../../models/testcasedropdown';

export enum TestCasePriorityActionTypes {
    LoadTestCasePriorityListTriggered = '[Snovasys-TM] [Test Case Component] Initial Test Case Priority List Load Triggered',
    LoadTestCasePriorityListCompleted = '[Snovasys-TM] [Test Case Component] Initial Test Case Priority List Load Completed',
    LoadTestCasePriorityListFromCache = '[Snovasys-TM] [Test Case Component] Initial Test Case Priority List Load Cache Completed'
}

export class LoadTestCasePriorityListTriggered implements Action {
    type = TestCasePriorityActionTypes.LoadTestCasePriorityListTriggered;
    testCasePriorityList: TestCaseDropdownList[];
    constructor(public dropDownList: TestCaseDropdownList) { }
}

export class LoadTestCasePriorityListCompleted implements Action {
    type = TestCasePriorityActionTypes.LoadTestCasePriorityListCompleted;
    dropDownList: TestCaseDropdownList;
    constructor(public testCasePriorityList: TestCaseDropdownList[]) { }
}

export class LoadTestCasePriorityListFromCache implements Action {
    type = TestCasePriorityActionTypes.LoadTestCasePriorityListFromCache;
    dropDownList: TestCaseDropdownList;
    testCasePriorityList: TestCaseDropdownList[];
    constructor() { }
}

export type TestCasePriorityActions = LoadTestCasePriorityListTriggered | LoadTestCasePriorityListCompleted | LoadTestCasePriorityListFromCache