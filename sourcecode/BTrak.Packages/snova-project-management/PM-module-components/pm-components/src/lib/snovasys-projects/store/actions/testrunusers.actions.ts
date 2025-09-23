import { Action } from '@ngrx/store';
import { TestCaseDropdownList } from '@snovasys/snova-testrepo';

export enum TestRunUsersActionTypes {
    LoadTestRunUsersListTriggered = "[Snovasys-PM][Test Run Component] Initial Test Run Users List Load Triggered",
    LoadTestRunUsersListCompleted = "[Snovasys-PM][Test Run Component] Initial Test Run Users List Load Completed",
}

export class LoadTestRunUsersListTriggered implements Action {
    type = TestRunUsersActionTypes.LoadTestRunUsersListTriggered;
    testRunUserList: TestCaseDropdownList[];
    constructor(public projectId: string) {}
}

export class LoadTestRunUsersListCompleted implements Action {
    type = TestRunUsersActionTypes.LoadTestRunUsersListCompleted;
    projectId: string;
    constructor(public testRunUserList: TestCaseDropdownList[]) {}
}

export type TestRunUserActions = LoadTestRunUsersListTriggered | LoadTestRunUsersListCompleted