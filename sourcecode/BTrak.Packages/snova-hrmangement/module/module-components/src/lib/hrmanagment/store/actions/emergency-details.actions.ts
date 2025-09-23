import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { EmployeeEmergencyContactDetails } from '../../models/employee-emergency-contact-details-model';
import { EmployeeDetailsSearchModel } from '../../models/employee-details-search-model';

export enum EmergencyDetailsActionTypes {
    LoadEmergencyDetailsTriggered = '[HR Widgets Emergency Details Component] Emergency Details Load Triggered',
    LoadEmergencyDetailsCompleted = '[HR Widgets Emergency Details Component] Emergency Details Load Completed',
    LoadEmergencyDetailsFailed = '[HR Widgets Emergency Details Component] Emergency Details Load Failed',
    CreateEmergencyDetailsTriggered = '[HR Widgets Emergency Details Component] Create Emergency Details Triggered',
    CreateEmergencyDetailsCompleted = '[HR Widgets Emergency Details Component] Create Emergency Details Completed',
    DeleteEmergencyContactDetailsCompleted = '[HR Widgets Emergency Details Component] Delete Emergency Details Completed',
    CreateEmergencyDetailsFailed = '[HR Widgets Emergency Details Component] Create Emergency Details Failed',
    GetEmergencyContactByIdTriggered = '[HR Widgets Emergency Details Component] Get Emergency Contact By Id Triggered',
    GetEmergencyContactByIdCompleted = '[HR Widgets Emergency Details Component] Get Emergency Contact Id Completed',
    CreateEmergencyContactCompletedWithInPlaceUpdate = '[HR Widgets Emergency Details Component] Create Emergency Contact Completed With InPlace Update',
    RefreshEmergencyDetails = '[HR Widgets Emergency Details Component] Refresh Emergency Details List',
    ExceptionHandled = '[HR Widgets Emergency Details Component] Handle Exception',
    EmergencyContactAdapter = "EmergencyContactAdapter"
}

export class LoadEmergencyDetailsTriggered implements Action {
    type = EmergencyDetailsActionTypes.LoadEmergencyDetailsTriggered;
    emergencyDetails: EmployeeEmergencyContactDetails[];
    emergencyContact: EmployeeEmergencyContactDetails;
    employeeEmergencyContactId: string;
    validationMessages: any[];
    emergencyDetailsUpdates: { emergencyDetailsUpdate: Update<EmployeeEmergencyContactDetails> };
    errorMessage: string;
    constructor(public emergencyDetailsResult: EmployeeDetailsSearchModel) { }
}

export class LoadEmergencyDetailsCompleted implements Action {
    type = EmergencyDetailsActionTypes.LoadEmergencyDetailsCompleted;
    emergencyDetailsResult: EmployeeDetailsSearchModel;
    emergencyContact: EmployeeEmergencyContactDetails;
    employeeEmergencyContactId: string;
    validationMessages: any[];
    emergencyDetailsUpdates: { emergencyDetailsUpdate: Update<EmployeeEmergencyContactDetails> };
    errorMessage: string;
    constructor(public emergencyDetails: EmployeeEmergencyContactDetails[]) { }
}

export class LoadEmergencyDetailsFailed implements Action {
    type = EmergencyDetailsActionTypes.LoadEmergencyDetailsFailed;
    emergencyDetailsResult: EmployeeDetailsSearchModel;
    emergencyDetails: EmployeeEmergencyContactDetails[];
    emergencyContact: EmployeeEmergencyContactDetails;
    employeeEmergencyContactId: string;
    emergencyDetailsUpdates: { emergencyDetailsUpdate: Update<EmployeeEmergencyContactDetails> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}


export class CreateEmergencyDetailsTriggered implements Action {
    type = EmergencyDetailsActionTypes.CreateEmergencyDetailsTriggered;
    emergencyDetails: EmployeeEmergencyContactDetails[];
    emergencyDetailsResult: EmployeeDetailsSearchModel;
    employeeEmergencyContactId: string;
    validationMessages: any[];
    emergencyDetailsUpdates: { emergencyDetailsUpdate: Update<EmployeeEmergencyContactDetails> };
    errorMessage: string;
    constructor(public emergencyContact: EmployeeEmergencyContactDetails) { }
}

export class CreateEmergencyDetailsCompleted implements Action {
    type = EmergencyDetailsActionTypes.CreateEmergencyDetailsCompleted;
    emergencyDetailsResult: EmployeeDetailsSearchModel;
    emergencyDetails: EmployeeEmergencyContactDetails[];
    emergencyContact: EmployeeEmergencyContactDetails;
    validationMessages: any[];
    emergencyDetailsUpdates: { emergencyDetailsUpdate: Update<EmployeeEmergencyContactDetails> };
    errorMessage: string;
    constructor(public employeeEmergencyContactId: string) { }
}

export class DeleteEmergencyContactDetailsCompleted implements Action {
    type = EmergencyDetailsActionTypes.DeleteEmergencyContactDetailsCompleted;
    emergencyDetailsResult: EmployeeDetailsSearchModel;
    emergencyDetails: EmployeeEmergencyContactDetails[];
    emergencyContact: EmployeeEmergencyContactDetails;
    validationMessages: any[];
    emergencyDetailsUpdates: { emergencyDetailsUpdate: Update<EmployeeEmergencyContactDetails> };
    errorMessage: string;
    constructor(public employeeEmergencyContactId: string) { }
}

export class CreateEmergencyDetailsFailed implements Action {
    type = EmergencyDetailsActionTypes.CreateEmergencyDetailsFailed;
    emergencyDetailsResult: EmployeeDetailsSearchModel;
    emergencyDetails: EmployeeEmergencyContactDetails[];
    emergencyContact: EmployeeEmergencyContactDetails;
    employeeEmergencyContactId: string;
    emergencyDetailsUpdates: { emergencyDetailsUpdate: Update<EmployeeEmergencyContactDetails> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class GetEmergencyContactByIdTriggered implements Action {
    type = EmergencyDetailsActionTypes.GetEmergencyContactByIdTriggered;
    emergencyDetailsResult: EmployeeDetailsSearchModel;
    emergencyDetails: EmployeeEmergencyContactDetails[];
    emergencyContact: EmployeeEmergencyContactDetails;
    validationMessages: any[];
    emergencyDetailsUpdates: { emergencyDetailsUpdate: Update<EmployeeEmergencyContactDetails> };
    errorMessage: string;
    constructor(public employeeEmergencyContactId: string) { }
}

export class GetEmergencyContactByIdCompleted implements Action {
    type = EmergencyDetailsActionTypes.GetEmergencyContactByIdCompleted;
    emergencyDetailsResult: EmployeeDetailsSearchModel;
    emergencyDetails: EmployeeEmergencyContactDetails[];
    employeeEmergencyContactId: string;
    validationMessages: any[];
    emergencyDetailsUpdates: { emergencyDetailsUpdate: Update<EmployeeEmergencyContactDetails> };
    errorMessage: string;
    constructor(public emergencyContact: EmployeeEmergencyContactDetails) { }
}

export class CreateEmergencyContactCompletedWithInPlaceUpdate implements Action {
    type = EmergencyDetailsActionTypes.CreateEmergencyContactCompletedWithInPlaceUpdate;
    emergencyDetailsResult: EmployeeDetailsSearchModel;
    emergencyDetails: EmployeeEmergencyContactDetails[];
    emergencyContact: EmployeeEmergencyContactDetails;
    employeeEmergencyContactId: string;
    validationMessages: any[];
    errorMessage: string;
    constructor(public emergencyDetailsUpdates: { emergencyDetailsUpdate: Update<EmployeeEmergencyContactDetails> }) { }
}

export class RefreshEmergencyDetails implements Action {
    type = EmergencyDetailsActionTypes.RefreshEmergencyDetails;
    emergencyDetailsResult: EmployeeDetailsSearchModel;
    emergencyDetails: EmployeeEmergencyContactDetails[];
    employeeEmergencyContactId: string;
    validationMessages: any[];
    errorMessage: string;
    emergencyDetailsUpdates: { emergencyDetailsUpdate: Update<EmployeeEmergencyContactDetails> };
    constructor(public emergencyContact: EmployeeEmergencyContactDetails) { }
}


export class ExceptionHandled implements Action {
    type = EmergencyDetailsActionTypes.ExceptionHandled;
    emergencyDetailsResult: EmployeeDetailsSearchModel;
    emergencyDetails: EmployeeEmergencyContactDetails[];
    emergencyContact: EmployeeEmergencyContactDetails;
    employeeEmergencyContactId: string;
    validationMessages: any[];
    emergencyDetailsUpdates: { emergencyDetailsUpdate: Update<EmployeeEmergencyContactDetails> };
    constructor(public errorMessage: string) { }
}

export type EmergencyDetailsActions = LoadEmergencyDetailsTriggered
    | LoadEmergencyDetailsCompleted
    | CreateEmergencyDetailsTriggered
    | CreateEmergencyDetailsCompleted
    | DeleteEmergencyContactDetailsCompleted
    | CreateEmergencyDetailsFailed
    | GetEmergencyContactByIdTriggered
    | GetEmergencyContactByIdCompleted
    | CreateEmergencyContactCompletedWithInPlaceUpdate
    | RefreshEmergencyDetails
    | ExceptionHandled
    | LoadEmergencyDetailsFailed