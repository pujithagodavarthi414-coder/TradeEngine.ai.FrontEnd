import { Action } from "@ngrx/store";
import { ValidationModel } from "../../models/validation-messages";
import {CustomFieldHistoryModel} from "../../models/custom-field-history.model";

export enum CustomFieldHistoryActionTypes {
    LoadCustomFieldHistoryTriggered = "[SnovaAuditsModule CustomField History Component] Intial Data Load Triggered",
    LoadCustomFieldHistoryCompleted = "[SnovaAuditsModule CustomField History Component] Intial Data Load Completed",
    LoadCustomFieldHistoryFailed = "[SnovaAuditsModule CustomField History Component] Intial Data Load Failed",
    ExceptionHandled = "[SnovaAuditsModule CustomField History Component]Exception Handled"
}

export class LoadCustomFieldHistoryTriggered implements Action {
    type = CustomFieldHistoryActionTypes.LoadCustomFieldHistoryTriggered
    CustomFieldHistoryList: CustomFieldHistoryModel[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    constructor(public customFieldModel: CustomFieldHistoryModel) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadCustomFieldHistoryCompleted implements Action {
    type = CustomFieldHistoryActionTypes.LoadCustomFieldHistoryCompleted
    customFieldModel: CustomFieldHistoryModel;
    validationMessages: ValidationModel[];
    errorMessage: string;
    constructor(public CustomFieldHistoryList: CustomFieldHistoryModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadCustomFieldHistoryFailed implements Action {
    type = CustomFieldHistoryActionTypes.LoadCustomFieldHistoryFailed
    customFieldModel: CustomFieldHistoryModel;
    CustomFieldHistoryList: CustomFieldHistoryModel[];
    errorMessage: string;
    constructor(public validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ExceptionHandled implements Action {
    type = CustomFieldHistoryActionTypes.ExceptionHandled
    customFieldModel: CustomFieldHistoryModel;
    CustomFieldHistoryList: CustomFieldHistoryModel[];
    validationMessages: ValidationModel[];
    constructor(public errorMessage: string) {}
}

export type CustomFieldHistoryActions = LoadCustomFieldHistoryTriggered
                                     |LoadCustomFieldHistoryCompleted
                                     |LoadCustomFieldHistoryFailed
                                     |ExceptionHandled
