import { Action } from '@ngrx/store';
import { LeaveFrequencyTypeSearchInputModel } from '../../models/leave-type-search-model';
import { LeaveApplicabilityModel } from '../../models/leave-applicability-model';

export enum LeaveApplicabilityActionTypes {
    AddNewLeaveLeaveApplicabilityTriggered = '[Leave management Leave Types Component] Upsert Leave Applicability Triggered',
    AddNewLeaveLeaveApplicabilityCompleted = '[Leave management Leave Types Component] Upsert Leave Applicability Completed',
    AddNewLeaveLeaveApplicabilityFailed = '[Leave management Leave Types Component] Upsert Leave Applicability Failed',
    LoadLeaveApplicabilityTriggered = '[Leave management Leave Types Component] Leave Applicability Initial Data Load Triggered',
    LoadLeaveApplicabilityCompleted = '[vLeave Types Component] Leave Applicability Initial Data Load Completed',
    LoadLeaveApplicabilityFailed = '[Leave management Leave Types Component] Leave Applicability Initial Data Load Failed',
    ExceptionHandled = '[Leave management Leave Types Component] Handle Exception',
}

export class AddNewLeaveLeaveApplicabilityTriggered implements Action {
    type = LeaveApplicabilityActionTypes.AddNewLeaveLeaveApplicabilityTriggered;
    leaveApplicabilityId: string;
    validationMessages: any[];
    errorMessage: string;
    leaveTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveTypesList: LeaveApplicabilityModel[];
    leaveApplicabilitySearchModel: LeaveApplicabilityModel;
    constructor(public leaveFrequencyInputModel: LeaveApplicabilityModel) { }
}

export class AddNewLeaveLeaveApplicabilityCompleted implements Action {
    type = LeaveApplicabilityActionTypes.AddNewLeaveLeaveApplicabilityCompleted;
    leaveFrequencyInputModel: LeaveApplicabilityModel;
    validationMessages: any[];
    errorMessage: string;
    leaveTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveTypesList: LeaveApplicabilityModel[];
    leaveApplicabilitySearchModel: LeaveApplicabilityModel;
    constructor(public leaveApplicabilityId: string) { }
}

export class AddNewLeaveLeaveApplicabilityFailed implements Action {
    type = LeaveApplicabilityActionTypes.AddNewLeaveLeaveApplicabilityFailed;
    leaveFrequencyInputModel: LeaveApplicabilityModel;
    leaveApplicabilityId: string;
    errorMessage: string;
    leaveTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveTypesList: LeaveApplicabilityModel[];
    leaveApplicabilitySearchModel: LeaveApplicabilityModel;
    constructor(public validationMessages: any[]) { }
}

export class LoadLeaveApplicabilityTriggered implements Action {
    type = LeaveApplicabilityActionTypes.LoadLeaveApplicabilityTriggered;
    leaveTypesList: LeaveApplicabilityModel[];
    validationMessages: any[];
    leaveApplicabilityId: string;
    errorMessage: string;
    leaveFrequencyInputModel: LeaveApplicabilityModel;
    constructor(public leaveApplicabilitySearchModel: LeaveApplicabilityModel) { }
}

export class LoadLeaveApplicabilityCompleted implements Action {
    type = LeaveApplicabilityActionTypes.LoadLeaveApplicabilityCompleted;
    leaveTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    validationMessages: any[];
    errorMessage: string;
    leaveApplicabilityId: string;
    leaveFrequencyInputModel: LeaveApplicabilityModel;
    leaveApplicabilitySearchModel: LeaveApplicabilityModel;
    constructor(public leaveTypesList: LeaveApplicabilityModel[]) { }
}

export class LoadLeaveApplicabilityFailed implements Action {
    type = LeaveApplicabilityActionTypes.LoadLeaveApplicabilityFailed;
    leaveTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveTypesList: LeaveApplicabilityModel[];
    errorMessage: string;
    leaveApplicabilityId: string;
    leaveFrequencyInputModel: LeaveApplicabilityModel;
    leaveApplicabilitySearchModel: LeaveApplicabilityModel;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = LeaveApplicabilityActionTypes.ExceptionHandled;
    leaveTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveApplicabilityId: string;
    validationMessages: any[];
    leaveTypesList: LeaveApplicabilityModel[];
    leaveFrequencyInputModel: LeaveApplicabilityModel;
    leaveApplicabilitySearchModel: LeaveApplicabilityModel;
    constructor(public errorMessage: string) { }
}

export type LeaveApplicabilityActions = AddNewLeaveLeaveApplicabilityTriggered
    | AddNewLeaveLeaveApplicabilityCompleted
    | AddNewLeaveLeaveApplicabilityFailed
    | LoadLeaveApplicabilityTriggered
    | LoadLeaveApplicabilityCompleted
    | LoadLeaveApplicabilityFailed
    | ExceptionHandled;