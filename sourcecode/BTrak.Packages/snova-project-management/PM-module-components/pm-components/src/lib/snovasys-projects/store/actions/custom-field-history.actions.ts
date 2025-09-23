import { Action } from "@ngrx/store";
import {CustomFieldHistoryModel} from "../../models/custom-field-history.model";
import { ValidationModel } from '../../models/validation-messages';

export enum CustomFieldHistoryActionTypes {
    LoadCustomFieldHistoryTriggered = "[Snovasys-PM][CustomField History Component] Intial Data Load Triggered",
    LoadCustomFieldHistoryCompleted = "[Snovasys-PM][CustomField History Component] Intial Data Load Completed",
    LoadCustomFieldHistoryFailed = "[Snovasys-PM][CustomField History Component] Intial Data Load Failed",
    CustomFieldExceptionHandled = "[Snovasys-PM][CustomField History Component]Custom Field Exception Handled"
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
export class CustomFieldExceptionHandled implements Action {
    type = CustomFieldHistoryActionTypes.CustomFieldExceptionHandled
    customFieldModel: CustomFieldHistoryModel;
    CustomFieldHistoryList: CustomFieldHistoryModel[];
    validationMessages: ValidationModel[];
    constructor(public errorMessage: string) {}
}

export type CustomFieldHistoryActions = LoadCustomFieldHistoryTriggered
                                     |LoadCustomFieldHistoryCompleted
                                     |LoadCustomFieldHistoryFailed
                                     |CustomFieldExceptionHandled
