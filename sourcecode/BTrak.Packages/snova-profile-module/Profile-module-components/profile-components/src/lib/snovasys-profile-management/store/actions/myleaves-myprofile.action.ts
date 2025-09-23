import { Action } from '@ngrx/store';
import { MyLeaveModel } from '../../models/myleaves-model';
import { LeaveModel } from '../../models/leave.model';

export enum MyLeavesActionTypes {
    AddNewLeaveTriggered = '[Profile Module Leave Types Component] Upsert Leave Triggered',
    AddNewLeaveCompleted = '[Profile Module Leave Types Component] Upsert Leave Completed',
    AddNewLeaveFailed = '[Profile Module Leave Types Component] Upsert Leave Failed',
    LoadLeavesTriggered = '[Profile Module Leave Types Component] Leaves Initial Data Load Triggered',
    LoadLeavesCompleted = '[Profile Module Leave Types Component] Leaves Initial Data Load Completed',
    LoadLeavesFailed = '[Profile Module Leave Types Component] Leaves Initial Data Load Failed',
    ExceptionHandled = '[Profile Module Leave Types Component] Handle Exception',
}

export class AddNewLeaveTriggered implements Action {
    type = MyLeavesActionTypes.AddNewLeaveTriggered;
    leaveId: string;
    validationMessages: any[];
    errorMessage: string;
    leavesList: MyLeaveModel[];
    leavesSearchModel: LeaveModel;
    constructor(public leavesUpsertModel: LeaveModel) { }
}

export class AddNewLeaveCompleted implements Action {
    type = MyLeavesActionTypes.AddNewLeaveCompleted;
    leavesUpsertModel: LeaveModel;
    validationMessages: any[];
    errorMessage: string;
    leavesList: MyLeaveModel[];
    leavesSearchModel: LeaveModel;
    constructor(public leaveId: string) { }
}

export class AddNewLeaveFailed implements Action {
    type = MyLeavesActionTypes.AddNewLeaveFailed;
    leavesUpsertModel: LeaveModel;
    leaveId: string;
    errorMessage: string;
    leavesList: MyLeaveModel[];
    leavesSearchModel: LeaveModel;
    constructor(public validationMessages: any[]) { }
}

export class LoadLeavesTriggered implements Action {
    type = MyLeavesActionTypes.LoadLeavesTriggered;
    leavesList: MyLeaveModel[];
    validationMessages: any[];
    leaveId: string;
    errorMessage: string;
    leavesUpsertModel: LeaveModel;
    constructor(public leavesSearchModel: LeaveModel) { }
}

export class LoadLeavesCompleted implements Action {
    type = MyLeavesActionTypes.LoadLeavesCompleted;
    validationMessages: any[];
    errorMessage: string;
    leaveId: string;
    leavesUpsertModel: LeaveModel;
    leavesSearchModel: LeaveModel;
    constructor(public leavesList: MyLeaveModel[]) { }
}

export class LoadLeavesFailed implements Action {
    type = MyLeavesActionTypes.LoadLeavesFailed;
    leavesList: MyLeaveModel[];
    errorMessage: string;
    leaveId: string;
    leavesUpsertModel: LeaveModel;
    leavesSearchModel: LeaveModel;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = MyLeavesActionTypes.ExceptionHandled;
    leaveId: string;
    validationMessages: any[];
    leavesList: MyLeaveModel[];
    leavesUpsertModel: LeaveModel;
    leavesSearchModel: LeaveModel;
    constructor(public errorMessage: string) { }
}

export type MyLeavesActions = AddNewLeaveTriggered
    | AddNewLeaveCompleted
    | AddNewLeaveFailed
    | LoadLeavesTriggered
    | LoadLeavesCompleted
    | LoadLeavesFailed
    | ExceptionHandled;