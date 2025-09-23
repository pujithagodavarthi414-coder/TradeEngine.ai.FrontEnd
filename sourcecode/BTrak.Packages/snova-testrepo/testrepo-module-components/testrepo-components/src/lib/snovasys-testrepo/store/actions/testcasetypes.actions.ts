import { Action } from '@ngrx/store';
import { TestCaseDropdownList } from '../../models/testcasedropdown';

export enum TestCasesActionTypes {
    LoadTestCaseTypeListTriggered = '[Snovasys-TM] [Test Case Component] Initial Test Case Type List Load Triggered',
    LoadTestCaseTypeListCompleted = '[Snovasys-TM] [Test Case Component] Initial Test Case Type List Load Completed',
    LoadTestCaseTypeListFromCache = '[Snovasys-TM] [Test Case Component] Initial Test Case Type List Load Cache Completed'
}

export class LoadTestCaseTypeListTriggered implements Action {
    type = TestCasesActionTypes.LoadTestCaseTypeListTriggered;
    testCaseTypeList: TestCaseDropdownList[];
    constructor(public dropDownList: TestCaseDropdownList) { }
}

export class LoadTestCaseTypeListCompleted implements Action {
    type = TestCasesActionTypes.LoadTestCaseTypeListCompleted;
    dropDownList: TestCaseDropdownList;
    constructor(public testCaseTypeList: TestCaseDropdownList[]) { }
}

export class LoadTestCaseTypeListFromCache implements Action {
    type = TestCasesActionTypes.LoadTestCaseTypeListFromCache;
    dropDownList: TestCaseDropdownList;
    testCaseTypeList: TestCaseDropdownList[];
    constructor() { }
}

export type TestCaseTypeActions = LoadTestCaseTypeListTriggered | LoadTestCaseTypeListCompleted | LoadTestCaseTypeListFromCache