import { Action } from '@ngrx/store';
import { TestCaseDropdownList } from '../../models/testcasedropdown';

export enum TestCaseAutomationActionTypes {
    LoadTestCaseAutomationListTriggered = '[Snovasys-TM] [Test Case Component] Initial Test Case Automation List Load Triggered',
    LoadTestCaseAutomationListCompleted = '[Snovasys-TM] [Test Case Component] Initial Test Case Automation List Load Completed',
    LoadTestCaseAutomationListFromCache = '[Snovasys-TM] [Test Case Component] Initial Test Case Automation List Load Cache Completed'
}

export class LoadTestCaseAutomationListTriggered implements Action {
    type = TestCaseAutomationActionTypes.LoadTestCaseAutomationListTriggered;
    testCaseAutomationList: TestCaseDropdownList[];
    constructor(public dropDownList: TestCaseDropdownList) { }
}

export class LoadTestCaseAutomationListCompleted implements Action {
    type = TestCaseAutomationActionTypes.LoadTestCaseAutomationListCompleted;
    dropDownList: TestCaseDropdownList;
    constructor(public testCaseAutomationList: TestCaseDropdownList[]) { }
}

export class LoadTestCaseAutomationListFromCache implements Action {
    type = TestCaseAutomationActionTypes.LoadTestCaseAutomationListFromCache;
    dropDownList: TestCaseDropdownList;
    testCaseAutomationList: TestCaseDropdownList[];
    constructor() { }
}

export type TestCaseAutomationActions = LoadTestCaseAutomationListTriggered | LoadTestCaseAutomationListCompleted | LoadTestCaseAutomationListFromCache