import { Action } from '@ngrx/store';
import { TestCaseDropdownList } from '../../models/testcasedropdown';

export enum MileStoneDropdownActionTypes {
    LoadMileStoneDropdownListTriggered = '[Snovasys-TM] [Mile Stone Component] Initial Mile Stone Dropdown List Load Triggered',
    LoadMileStoneDropdownListCompleted = '[Snovasys-TM] [Mile Stone Component] Initial Mile Stone Dropdown List Load Completed',
}

export class LoadMileStoneDropdownListTriggered implements Action {
    type = MileStoneDropdownActionTypes.LoadMileStoneDropdownListTriggered;
    mileStoneDropdownList: TestCaseDropdownList[];
    constructor(public projectId: string) { }
}

export class LoadMileStoneDropdownListCompleted implements Action {
    type = MileStoneDropdownActionTypes.LoadMileStoneDropdownListCompleted;
    projectId: string;
    constructor(public mileStoneDropdownList: TestCaseDropdownList[]) { }
}

export type MileStoneDropdownActions = LoadMileStoneDropdownListTriggered | LoadMileStoneDropdownListCompleted