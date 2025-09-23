import { Action } from '@ngrx/store';
import { TestCaseDropdownList } from '../../models/testcasedropdown';

export enum TestCaseTemplateActionTypes {
    LoadTestCaseTemplateListTriggered = '[Snovasys-TM] [Test Case Component] Initial Test Case Template List Load Triggered',
    LoadTestCaseTemplateListCompleted = '[Snovasys-TM] [Test Case Component] Initial Test Case Template List Load Completed',
    LoadTestCaseTemplateListFromCache = '[Snovasys-TM] [Test Case Component] Initial Test Case Template List Load Cache Completed'
}

export class LoadTestCaseTemplateListTriggered implements Action {
    type = TestCaseTemplateActionTypes.LoadTestCaseTemplateListTriggered;
    testCaseTemplateList: TestCaseDropdownList[];
    constructor(public dropDownList: TestCaseDropdownList) { }
}

export class LoadTestCaseTemplateListCompleted implements Action {
    type = TestCaseTemplateActionTypes.LoadTestCaseTemplateListCompleted;
    dropDownList: TestCaseDropdownList;
    constructor(public testCaseTemplateList: TestCaseDropdownList[]) { }
}

export class LoadTestCaseTemplateListFromCache implements Action {
    type = TestCaseTemplateActionTypes.LoadTestCaseTemplateListFromCache;
    dropDownList: TestCaseDropdownList;
    testCaseTemplateList: TestCaseDropdownList[];
    constructor() { }
}

export type TestCaseTemplateActions = LoadTestCaseTemplateListTriggered | LoadTestCaseTemplateListCompleted | LoadTestCaseTemplateListFromCache