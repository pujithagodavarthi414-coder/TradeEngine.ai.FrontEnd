import { Action } from '@ngrx/store';
import { LeaveFrequencyTypeSearchInputModel } from '../../models/leave-type-search-model';
import { LeaveTypeInputModel } from '../../models/leave-type-input.model';
import { LeaveFrequencyTypeModel } from '../../models/leave-frequency-type.model';

export enum LeaveTypeActionTypes {
    LoadLeaveTypesTriggered = '[Dashboard Module Leave Types Component] Initial Data Load Triggered',
    LoadLeaveTypesCompleted = '[Dashboard Module Leave Types Component] Initial Data Load Completed',
    LoadLeaveTypesFailed = '[Dashboard Module Leave Types Component] Initial Data Load Failed',
    LoadLeaveTypeByIdTriggered = '[Dashboard Module Leave Types Component] Leave Type By Id Triggered',
    LoadLeaveTypeByIdCompleted = '[Dashboard Module Leave Types Component] Leave Type By Id Completed',
    LoadLeaveTypeByIdFailed = '[Dashboard Module Leave Types Component] Leave Type By Id Failed',
    AddNewLeaveTypeTriggered = '[Dashboard Module Leave Types Component] New Leave Type Triggered',
    AddNewLeaveTypeCompleted = '[Dashboard Module Leave Types Component] New Leave Type Completed',
    AddNewLeaveTypeFailed = '[Dashboard Module Leave Types Component] New Leave Type Failed',
    UpdateLeaveTypeTriggered = '[Dashboard Module Leave Types Component] Update Type Triggered',
    UpdateLeaveTypeCompleted = '[Dashboard Module Leave Types Component] Update Type Completed',
    UpdateLeaveTypeFailed = '[Dashboard Module Leave Types Component] Update Type Failed',
    ExceptionHandled = '[Dashboard Module Leave Types Component] Handle Exception',
}

export class AddNewLeaveTypeTriggered  implements Action {
    type = LeaveTypeActionTypes.AddNewLeaveTypeTriggered;
    leaveTypeId: string;
    validationMessages: any[];
    errorMessage: string;
    leaveTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveTypesList: LeaveFrequencyTypeModel[];
    leaveTypeById: LeaveFrequencyTypeModel[];
    constructor(public leaveTypeInputModel: LeaveTypeInputModel) { }
}

export class AddNewLeaveTypeCompleted  implements Action {
    type = LeaveTypeActionTypes.AddNewLeaveTypeCompleted;
    leaveTypeInputModel: LeaveTypeInputModel;
    validationMessages: any[];
    errorMessage: string;
    leaveTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveTypesList: LeaveFrequencyTypeModel[];
    leaveTypeById: LeaveFrequencyTypeModel[];
    constructor(public leaveTypeId: string) { }
}

export class AddNewLeaveTypeFailed  implements Action {
    type = LeaveTypeActionTypes.AddNewLeaveTypeFailed;
    leaveTypeInputModel: LeaveTypeInputModel;
    leaveTypeId: string;
    errorMessage: string;
    leaveTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveTypesList: LeaveFrequencyTypeModel[];
    leaveTypeById: LeaveFrequencyTypeModel[];
    constructor(public validationMessages: any[]) { }
}

export class UpdateLeaveTypeTriggered  implements Action {
    type = LeaveTypeActionTypes.UpdateLeaveTypeTriggered;
    leaveTypeId: string;
    validationMessages: any[];
    errorMessage: string;
    leaveTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveTypesList: LeaveFrequencyTypeModel[];
    leaveTypeById: LeaveFrequencyTypeModel[];
    constructor(public leaveTypeInputModel: LeaveTypeInputModel) { }
}

export class UpdateLeaveTypeCompleted  implements Action {
    type = LeaveTypeActionTypes.UpdateLeaveTypeCompleted;
    leaveTypeInputModel: LeaveTypeInputModel;
    validationMessages: any[];
    errorMessage: string;
    leaveTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveTypesList: LeaveFrequencyTypeModel[];
    leaveTypeById: LeaveFrequencyTypeModel[];
    constructor(public leaveTypeId: string) { }
}

export class UpdateLeaveTypeFailed  implements Action {
    type = LeaveTypeActionTypes.UpdateLeaveTypeFailed;
    leaveTypeInputModel: LeaveTypeInputModel;
    leaveTypeId: string;
    errorMessage: string;
    leaveTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveTypesList: LeaveFrequencyTypeModel[];
    leaveTypeById: LeaveFrequencyTypeModel[];
    constructor(public validationMessages: any[]) { }
}

export class LoadLeaveTypesTriggered implements Action {
    type = LeaveTypeActionTypes.LoadLeaveTypesTriggered;
    leaveTypesList: LeaveFrequencyTypeModel[];
    validationMessages: any[];
    leaveTypeId: string;
    errorMessage: string;
    leaveTypeInputModel: LeaveTypeInputModel;
    leaveTypeById: LeaveFrequencyTypeModel[];
    constructor(public leaveTypeSearchModel: LeaveFrequencyTypeSearchInputModel) { }
}

export class LoadLeaveTypesCompleted implements Action {
    type = LeaveTypeActionTypes.LoadLeaveTypesCompleted;
    leaveTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    validationMessages: any[];
    errorMessage: string;
    leaveTypeId: string;
    leaveTypeInputModel: LeaveTypeInputModel;
    leaveTypeById: LeaveFrequencyTypeModel[];
    constructor(public leaveTypesList: LeaveFrequencyTypeModel[]) { }
}

export class LoadLeaveTypesFailed implements Action {
    type = LeaveTypeActionTypes.LoadLeaveTypesFailed;
    leaveTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveTypesList: LeaveFrequencyTypeModel[];
    errorMessage: string;
    leaveTypeId: string;
    leaveTypeInputModel: LeaveTypeInputModel;
    leaveTypeById: LeaveFrequencyTypeModel[];
    constructor(public validationMessages: any[]) { }
}

export class LoadLeaveTypeByIdTriggered implements Action {
    type = LeaveTypeActionTypes.LoadLeaveTypeByIdTriggered;
    leaveTypesList: LeaveFrequencyTypeModel[];
    validationMessages: any[];
    leaveTypeId: string;
    errorMessage: string;
    leaveTypeInputModel: LeaveTypeInputModel;
    leaveTypeById: LeaveFrequencyTypeModel[];
    constructor(public leaveTypeSearchModel: LeaveFrequencyTypeSearchInputModel) { }
}

export class LoadLeaveTypeByIdCompleted implements Action {
    type = LeaveTypeActionTypes.LoadLeaveTypeByIdCompleted;
    leaveTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    validationMessages: any[];
    errorMessage: string;
    leaveTypeId: string;
    leaveTypesList: LeaveFrequencyTypeModel[];
    leaveTypeInputModel: LeaveTypeInputModel;
    constructor(public leaveTypeById: LeaveFrequencyTypeModel[]) { }
}

export class LoadLeaveTypeByIdFailed implements Action {
    type = LeaveTypeActionTypes.LoadLeaveTypeByIdFailed;
    leaveTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveTypesList: LeaveFrequencyTypeModel[];
    errorMessage: string;
    leaveTypeId: string;
    leaveTypeInputModel: LeaveTypeInputModel;
    leaveTypeById: LeaveFrequencyTypeModel[];
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = LeaveTypeActionTypes.ExceptionHandled;
    leaveTypeSearchModel: LeaveFrequencyTypeSearchInputModel;
    leaveTypeId: string;
    validationMessages: any[];
    leaveTypesList: LeaveFrequencyTypeModel[];
    leaveTypeInputModel: LeaveTypeInputModel;
    leaveTypeById: LeaveFrequencyTypeModel[];
    constructor(public errorMessage: string) { }
}

export type LeaveFrequencyActions = AddNewLeaveTypeTriggered
    | AddNewLeaveTypeCompleted
    | AddNewLeaveTypeFailed
    | LoadLeaveTypesTriggered
    | LoadLeaveTypesCompleted
    | LoadLeaveTypesFailed
    | LoadLeaveTypeByIdTriggered
    | LoadLeaveTypeByIdCompleted
    | LoadLeaveTypeByIdFailed
    | ExceptionHandled;