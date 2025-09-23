import { Action } from '@ngrx/store';
import { MileStone, MileStonesList, MileStoneWithCount } from '../../models/milestone';
import { TestRun, TestRunList } from '../../models/testrun';
import { Update } from '@ngrx/entity';

export enum MileStoneActionTypes {
    LoadMileStoneTriggered = '[Snovasys-TM] [MileStone Component] Initial Mile Stone Load Triggered',
    LoadMileStoneCompleted = '[Snovasys-TM] [MileStone Component] Initial Mile Stone Load Completed',
    LoadMileStoneByIdTriggered = '[Snovasys-TM] [MileStone Component] Initial Mile Stone Load By Id Triggered',
    LoadMileStoneByIdCompleted = '[Snovasys-TM] [MileStone Component] Initial Mile Stone Load By Id Completed',
    LoadMileStoneDeleteTriggered = '[Snovasys-TM] [MileStone Component] Initial Mile Stone Load Delete Triggered',
    LoadMileStoneDeleteCompleted = '[Snovasys-TM] [MileStone Component] Initial Mile Stone Load Delete Completed',
    LoadMileStoneListTriggered = '[Snovasys-TM] [MileStone Component] Initial Mile Stone List Load Triggered',
    LoadMileStoneListCompleted = '[Snovasys-TM] [MileStone Component] Initial Mile Stone List Load Completed',
    RefreshMileStonesList = '[Snovasys-TM] [MileStone Component] Initial MileStone Refresh List Load Completed',
    MileStoneEditCompletedWithInPlaceUpdate = '[Snovasys-TM] [MileStone Component] Initial MileStone Update Load Completed',
    LoadTestRunsByMileStoneTriggered = '[Snovasys-TM] [MileStone Component] Initial Test runs by mile stone Load Triggered',
    LoadTestRunsByMileStoneCompleted = '[Snovasys-TM] [MileStone Component] Initial Test runs by mile stone Load Completed',
    MileStoneFailed = '[Snovasys-TM] [MileStone Component] Mile Stone Failed',
    MileStoneException = '[Snovasys-TM] [MileStone Component] Mile Stone Exception Handled',
}

export class LoadMileStoneTriggered implements Action {
    type = MileStoneActionTypes.LoadMileStoneTriggered;
    mileStoneId: string;
    searchMileStones: MileStone;
    searchMileStoneSuccess: MileStoneWithCount[];
    mileStoneDelete: MileStone;
    mileStoneDeleteId: string;
    latestMileStoneData: MileStoneWithCount;
    mileStoneUpdates: { mileStoneUpdate: Update<MileStoneWithCount> };
    responseMessages: string[];
    errorMessage: string;
    mileStoneList: MileStoneWithCount[];
    getMileStones: MileStone;
    testRunList: TestRunList[];
    constructor(public mileStone: MileStone) { }
}

export class LoadMileStoneCompleted implements Action {
    type = MileStoneActionTypes.LoadMileStoneCompleted;
    mileStone: MileStone;
    searchMileStones: MileStone;
    searchMileStoneSuccess: MileStoneWithCount[];
    mileStoneDelete: MileStone;
    mileStoneDeleteId: string;
    latestMileStoneData: MileStoneWithCount;
    mileStoneUpdates: { mileStoneUpdate: Update<MileStoneWithCount> };
    responseMessages: string[];
    errorMessage: string;
    mileStoneList: MileStoneWithCount[];
    getMileStones: MileStone;
    testRunList: TestRunList[];
    constructor(public mileStoneId: string) { }
}

export class LoadMileStoneByIdTriggered implements Action {
    type = MileStoneActionTypes.LoadMileStoneByIdTriggered;
    mileStoneId: string;
    searchMileStoneSuccess: MileStoneWithCount[];
    mileStoneDelete: MileStone;
    mileStoneDeleteId: string;
    latestMileStoneData: MileStoneWithCount;
    mileStoneUpdates: { mileStoneUpdate: Update<MileStoneWithCount> };
    responseMessages: string[];
    errorMessage: string;
    mileStoneList: MileStoneWithCount[];
    getMileStones: MileStone;
    testRunList: TestRunList[];
    constructor(public searchMileStones: MileStone) { }
}

export class LoadMileStoneByIdCompleted implements Action {
    type = MileStoneActionTypes.LoadMileStoneByIdCompleted;
    mileStoneId: string;
    searchMileStones: MileStone;
    mileStoneDelete: MileStone;
    mileStoneDeleteId: string;
    latestMileStoneData: MileStoneWithCount;
    mileStoneUpdates: { mileStoneUpdate: Update<MileStoneWithCount> };
    responseMessages: string[];
    errorMessage: string;
    mileStoneList: MileStoneWithCount[];
    getMileStones: MileStone;
    testRunList: TestRunList[];
    constructor(public searchMileStoneSuccess: MileStoneWithCount[]) { }
}

export class LoadMileStoneDeleteTriggered implements Action {
    type = MileStoneActionTypes.LoadMileStoneDeleteTriggered;
    mileStoneId: string;
    searchMileStones: MileStone;
    searchMileStoneSuccess: MileStoneWithCount[];
    mileStoneDeleteId: string;
    latestMileStoneData: MileStoneWithCount;
    mileStoneUpdates: { mileStoneUpdate: Update<MileStoneWithCount> };
    responseMessages: string[];
    errorMessage: string;
    mileStoneList: MileStoneWithCount[];
    getMileStones: MileStone;
    testRunList: TestRunList[];
    constructor(public mileStoneDelete: MileStone) { }
}

export class LoadMileStoneDeleteCompleted implements Action {
    type = MileStoneActionTypes.LoadMileStoneDeleteCompleted;
    mileStoneId: string;
    searchMileStones: MileStone;
    searchMileStoneSuccess: MileStoneWithCount[];
    mileStoneDelete: MileStone;
    latestMileStoneData: MileStoneWithCount;
    mileStoneUpdates: { mileStoneUpdate: Update<MileStoneWithCount> };
    responseMessages: string[];
    errorMessage: string;
    mileStoneList: MileStoneWithCount[];
    getMileStones: MileStone;
    testRunList: TestRunList[];
    constructor(public mileStoneDeleteId: string) { }
}

export class LoadMileStoneListTriggered implements Action {
    type = MileStoneActionTypes.LoadMileStoneListTriggered;
    mileStone: MileStone;
    mileStoneId: string;
    searchMileStones: MileStone;
    searchMileStoneSuccess: MileStoneWithCount[];
    mileStoneDelete: MileStone;
    mileStoneDeleteId: string;
    latestMileStoneData: MileStoneWithCount;
    mileStoneUpdates: { mileStoneUpdate: Update<MileStoneWithCount> };
    responseMessages: string[];
    errorMessage: string;
    mileStoneList: MileStoneWithCount[];
    testRunList: TestRunList[];
    constructor(public getMileStones: MileStone) { }
}

export class LoadMileStoneListCompleted implements Action {
    type = MileStoneActionTypes.LoadMileStoneListCompleted;
    mileStone: MileStone;
    searchMileStones: MileStone;
    searchMileStoneSuccess: MileStoneWithCount[];
    mileStoneDelete: MileStone;
    mileStoneDeleteId: string;
    latestMileStoneData: MileStoneWithCount;
    mileStoneUpdates: { mileStoneUpdate: Update<MileStoneWithCount> };
    responseMessages: string[];
    errorMessage: string;
    mileStoneId: string;
    getMileStones: MileStone;
    testRunList: TestRunList[];
    constructor(public mileStoneList: MileStoneWithCount[]) { }
}

export class LoadTestRunsByMileStoneTriggered implements Action {
    type = MileStoneActionTypes.LoadTestRunsByMileStoneTriggered;
    mileStoneId: string;
    searchMileStones: MileStone;
    searchMileStoneSuccess: MileStoneWithCount[];
    mileStoneDelete: MileStone;
    mileStoneDeleteId: string;
    latestMileStoneData: MileStoneWithCount;
    mileStoneUpdates: { mileStoneUpdate: Update<MileStoneWithCount> };
    responseMessages: string[];
    errorMessage: string;
    mileStoneList: MileStoneWithCount[];
    testRunList: TestRunList[];
    constructor(public mileStone: MileStone) { }
}

export class LoadTestRunsByMileStoneCompleted implements Action {
    type = MileStoneActionTypes.LoadTestRunsByMileStoneCompleted;
    mileStone: MileStone;
    searchMileStones: MileStone;
    searchMileStoneSuccess: MileStoneWithCount[];
    mileStoneDelete: MileStone;
    mileStoneDeleteId: string;
    latestMileStoneData: MileStoneWithCount;
    mileStoneUpdates: { mileStoneUpdate: Update<MileStoneWithCount> };
    responseMessages: string[];
    errorMessage: string;
    mileStoneList: MileStoneWithCount[];
    constructor(public testRunList: TestRunList[]) { }
}

export class RefreshMileStonesList implements Action {
    type = MileStoneActionTypes.RefreshMileStonesList;
    mileStoneId: string;
    searchMileStones: MileStone;
    searchMileStoneSuccess: MileStoneWithCount[];
    mileStoneDelete: MileStone;
    mileStoneDeleteId: string;
    mileStoneUpdates: { mileStoneUpdate: Update<MileStoneWithCount> };
    responseMessages: string[];
    errorMessage: string;
    mileStoneList: MileStoneWithCount[];
    getMileStones: MileStone;
    testRunList: TestRunList[];
    constructor(public latestMileStoneData: MileStoneWithCount) { }
}

export class MileStoneEditCompletedWithInPlaceUpdate implements Action {
    type = MileStoneActionTypes.MileStoneEditCompletedWithInPlaceUpdate;
    mileStoneId: string;
    searchMileStones: MileStone;
    searchMileStoneSuccess: MileStoneWithCount[];
    mileStoneDelete: MileStone;
    mileStoneDeleteId: string;
    latestMileStoneData: MileStoneWithCount;
    responseMessages: string[];
    errorMessage: string;
    mileStoneList: MileStoneWithCount[];
    getMileStones: MileStone;
    testRunList: TestRunList[];
    constructor(public mileStoneUpdates: { mileStoneUpdate: Update<MileStoneWithCount> }) { }
}

export class MileStoneFailed implements Action {
    type = MileStoneActionTypes.MileStoneFailed;
    mileStoneId: string;
    searchMileStones: MileStone;
    searchMileStoneSuccess: MileStoneWithCount[];
    mileStoneDelete: MileStone;
    mileStoneDeleteId: string;
    latestMileStoneData: MileStoneWithCount;
    mileStoneUpdates: { mileStoneUpdate: Update<MileStoneWithCount> };
    errorMessage: string;
    mileStoneList: MileStoneWithCount[];
    getMileStones: MileStone;
    testRunList: TestRunList[];
    constructor(public responseMessages: string[]) { }
}

export class MileStoneException implements Action {
    type = MileStoneActionTypes.MileStoneException;
    mileStoneId: string;
    searchMileStones: MileStone;
    searchMileStoneSuccess: MileStoneWithCount[];
    mileStoneDelete: MileStone;
    mileStoneDeleteId: string;
    latestMileStoneData: MileStoneWithCount;
    mileStoneUpdates: { mileStoneUpdate: Update<MileStoneWithCount> };
    responseMessages: string[];
    mileStoneList: MileStoneWithCount[];
    getMileStones: MileStone;
    testRunList: TestRunList[];
    constructor(public errorMessage: string) { }
}

export type MileStoneActions = LoadMileStoneTriggered | LoadMileStoneCompleted | LoadMileStoneByIdTriggered | LoadMileStoneByIdCompleted
    | LoadMileStoneDeleteTriggered | LoadMileStoneDeleteCompleted | LoadMileStoneListTriggered | LoadMileStoneListCompleted
    | RefreshMileStonesList | MileStoneEditCompletedWithInPlaceUpdate | LoadTestRunsByMileStoneTriggered | LoadTestRunsByMileStoneCompleted
    | MileStoneFailed | MileStoneException;
