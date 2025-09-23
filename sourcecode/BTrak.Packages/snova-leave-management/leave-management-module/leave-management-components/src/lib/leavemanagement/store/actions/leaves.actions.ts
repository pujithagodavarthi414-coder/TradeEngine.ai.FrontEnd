import { Action } from '@ngrx/store';
import { LeaveModel } from '../../models/leave-model';
import { Update } from '@ngrx/entity';

export enum LeavesActionTypes {
    AddNewLeaveTriggered = '[Leave management Leaves Component] Upsert Leave Triggered',
    AddNewLeaveCompleted = '[Leave management Leaves Component] Upsert Leave Completed',
    AddNewLeaveFailed = '[Leave management Leaves Component] Upsert Leave Failed',
    LoadLeavesTriggered = '[Leave management Leaves Component] Leaves Initial Data Load Triggered',
    LoadLeavesCompleted = '[Leave management Leaves Component] Leaves Initial Data Load Completed',
    LoadLeavesFailed = '[Leave management Leaves Component] Leaves Initial Data Load Failed',
    ExceptionHandled = '[Leave management Leaves Component] Handle Exception',
    LoadLeavesByIdTriggered = "[Leave management Leaves Component] Load Leaves By Id Triggered",
    LoadLeavesByIdCompleted = "[Leave management Leaves Component] Load Leaves By Id Completed",
    UpdateLeaveById = "[Leave management Leaves Component] Update Leave By Id"
}

export class AddNewLeaveTriggered implements Action {
    type = LeavesActionTypes.AddNewLeaveTriggered;
    leaveId: string;
    validationMessages: any[];
    errorMessage: string;
    leavesList: LeaveModel[];
    leavesSearchModel: LeaveModel;
    getLeaveById: string;
    leaveUpdatedmodels: { leaveUpdatedmodel: Update<LeaveModel> };
    constructor(public leavesUpsertModel: LeaveModel) { }
}

export class AddNewLeaveCompleted implements Action {
    type = LeavesActionTypes.AddNewLeaveCompleted;
    leavesUpsertModel: LeaveModel;
    validationMessages: any[];
    errorMessage: string;
    leavesList: LeaveModel[];
    getLeaveById: string;
    leavesSearchModel: LeaveModel;
    leaveUpdatedmodels: { leaveUpdatedmodel: Update<LeaveModel> };
    constructor(public leaveId: string) { }
}

export class AddNewLeaveFailed implements Action {
    type = LeavesActionTypes.AddNewLeaveFailed;
    leavesUpsertModel: LeaveModel;
    leaveId: string;
    errorMessage: string;
    leavesList: LeaveModel[];
    getLeaveById: string;
    leavesSearchModel: LeaveModel;
    leaveUpdatedmodels: { leaveUpdatedmodel: Update<LeaveModel> };
    constructor(public validationMessages: any[]) { }
}

export class LoadLeavesTriggered implements Action {
    type = LeavesActionTypes.LoadLeavesTriggered;
    leavesList: LeaveModel[];
    validationMessages: any[];
    leaveId: string;
    errorMessage: string;
    getLeaveById: string;
    leavesUpsertModel: LeaveModel;
    leaveUpdatedmodels: { leaveUpdatedmodel: Update<LeaveModel> };
    constructor(public leavesSearchModel: LeaveModel) { }
}

export class LoadLeavesCompleted implements Action {
    type = LeavesActionTypes.LoadLeavesCompleted;
    validationMessages: any[];
    errorMessage: string;
    leaveId: string;
    leavesUpsertModel: LeaveModel;
    getLeaveById: string;
    leavesSearchModel: LeaveModel;
    leaveUpdatedmodels: { leaveUpdatedmodel: Update<LeaveModel> };
    constructor(public leavesList: LeaveModel[]) { }
}

export class LoadLeavesByIdTriggered implements Action {
    type = LeavesActionTypes.LoadLeavesByIdTriggered;
    leavesList: LeaveModel;
    validationMessages: any[];
    leaveId: string;
    errorMessage: string;
    leavesUpsertModel: LeaveModel;
    leaveUpdatedmodels: { leaveUpdatedmodel: Update<LeaveModel> };
    constructor(public getLeaveById: string) { }
}

export class LoadLeavesByIdCompleted implements Action {
    type = LeavesActionTypes.LoadLeavesByIdCompleted;
    validationMessages: any[];
    errorMessage: string;
    leaveId: string;
    leavesList: LeaveModel[];
    getLeaveById: string;
    leavesSearchModel: LeaveModel;
    leaveUpdatedmodels: { leaveUpdatedmodel: Update<LeaveModel> };
    constructor(public leavesUpsertModel: LeaveModel) { }
}

export class UpdateLeaveById implements Action {
    type = LeavesActionTypes.UpdateLeaveById;
    validationMessages: any[];
    errorMessage: string;
    leaveId: string;
    leavesList : LeaveModel[];
    leavesUpsertModel: LeaveModel;
    getLeaveById: string;
    leavesSearchModel: LeaveModel;
    constructor(public leaveUpdatedmodels: { leaveUpdatedmodel: Update<LeaveModel> }) { }
}

export class LoadLeavesFailed implements Action {
    type = LeavesActionTypes.LoadLeavesFailed;
    leavesList: LeaveModel[];
    errorMessage: string;
    leaveId: string;
    leavesUpsertModel: LeaveModel;
    getLeaveById: string;
    leavesSearchModel: LeaveModel;
    leaveUpdatedmodels: { leaveUpdatedmodel: Update<LeaveModel> };
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = LeavesActionTypes.ExceptionHandled;
    leaveId: string;
    validationMessages: any[];
    leavesList: LeaveModel[];
    leavesUpsertModel: LeaveModel;
    getLeaveById: string;
    leavesSearchModel: LeaveModel;
    leaveUpdatedmodels: { leaveUpdatedmodel: Update<LeaveModel> };
    constructor(public errorMessage: string) { }
}

export type LeavesActions = AddNewLeaveTriggered
    | AddNewLeaveCompleted
    | AddNewLeaveFailed
    | LoadLeavesTriggered
    | LoadLeavesCompleted
    | LoadLeavesFailed
    | UpdateLeaveById
    | ExceptionHandled;