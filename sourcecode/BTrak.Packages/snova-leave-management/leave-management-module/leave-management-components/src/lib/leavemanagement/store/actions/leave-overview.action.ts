import { Action } from '@ngrx/store';
import { LeaveOverviewModel } from "../../models/leave-overview-model";

export enum LeaveOverviewActionTypes {
    LoadLeavesOverviewTriggered = '[Leave management Leave Types Component] Leaves Overview Initial Data Load Triggered',
    LoadLeavesOverviewCompleted = '[Leave management Leave Types Component] Leaves Overview Initial Data Load Completed',
    LoadLeavesOverviewFailed = '[Leave management Leave Types Component] Leaves Overview Initial Data Load Failed',
    ExceptionHandled = '[Leave management Leave Types Component] Handle Exception',
}

export class LoadLeavesOverviewTriggered implements Action {
    type = LeaveOverviewActionTypes.LoadLeavesOverviewTriggered;
    leavesOverviewList: LeaveOverviewModel[];
    validationMessages: any[];
    leaveId: string;
    errorMessage: string;
    leavesUpsertModel: LeaveOverviewModel;
    constructor(public leavesSearchModel: LeaveOverviewModel) { }
}

export class LoadLeavesOverviewCompleted implements Action {
    type = LeaveOverviewActionTypes.LoadLeavesOverviewCompleted;
    validationMessages: any[];
    leaveId: string;
    errorMessage: string;
    leavesUpsertModel: LeaveOverviewModel;
    constructor(public leavesOverviewList: LeaveOverviewModel[]) { }
}

export class LoadLeavesOverviewFailed implements Action {
    type = LeaveOverviewActionTypes.LoadLeavesOverviewFailed;
    leavesOverviewList: LeaveOverviewModel[];
    leaveId: string;
    errorMessage: string;
    leavesUpsertModel: LeaveOverviewModel;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = LeaveOverviewActionTypes.ExceptionHandled;
    leavesOverviewList: LeaveOverviewModel[];
    validationMessages: any[];
    leaveId: string;
    leavesUpsertModel: LeaveOverviewModel;
    constructor(public errorMessage: string) { }
}

export type LeaveOverViewActions = LoadLeavesOverviewTriggered
    | LoadLeavesOverviewCompleted
    | LoadLeavesOverviewFailed
    | ExceptionHandled;