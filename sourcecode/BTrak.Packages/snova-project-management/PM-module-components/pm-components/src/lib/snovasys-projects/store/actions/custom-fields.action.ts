import { Action } from "@ngrx/store";
import { Update } from "@ngrx/entity";
import { ValidationModel } from '../../models/validation-messages';
import { CustomFormFieldModel } from '../../models/custom-fileds-model';

export enum CustomFieldsActionTypes {
    UpsertCustomFieldTriggered = "[Snovasys-PM][CustomField Component] Upsert CustomField Triggered",
    UpsertCustomFieldCompleted = "[Snovasys-PM][CustomField Component] Upsert CustomField Completed",
    UpsertCustomFieldFailed = "[Snovasys-PM][CustomField Component] Upsert CustomField Failed",
    CustomExceptionHandled = "[Snovasys-PM][CustomField Component] Custom ExceptionHandled",
    GetCustomFieldsTriggered = "[Snovasys-PM][CustomField Component] Get Custom Field Triggered",
    GetCustomFieldsCompleted = "[Snovasys-PM][CustomField Component] Get Custom Field Completed",
    GetCustomFieldsFailed = "[Snovasys-PM][CustomField Component] Get Custom Field Failed",
    GetCustomFieldByIdTriggered = "[Snovasys-PM][CustomField Component]Get CustomField By Id Triggered",
    GetCustomFieldByIdCompleted = "[Snovasys-PM][CustomField Component]Get CustomField By Id Completed",
    GetCustomFieldByIdFailed = "[Snovasys-PM][CustomField Component]Get CustomField By Id Failed",
    RefreshCustomFormsList = "[Snovasys-PM][CustomField Component] Refresh Custom Forms List",
    ArchiveCustomFieldTriggered = "[Snovasys-PM][CustomField Component] Archive CustomField Triggered",
    ArchiveCustomFieldCompleted = "[Snovasys-PM][CustomField Component] Archive CustomField Completed",
    ArchiveCustomFieldFailed = "[Snovasys-PM][CustomField Component] Archive CustomField Failed",
    UpdateCustomFormField = "[Snovasys-PM][CustomField Component] Update CustomForm Field",
    UpdateCustomFieldDataTriggered ="[Snovasys-PM][CustomField Component] Update Custom Field Triggered",
    UpdateCustomFieldDataCompleted ="[Snovasys-PM][CustomField Component] Update Custom Field Completed",
    UpdateCustomFieldDataFailed ="[Snovasys-PM][CustomField Component] Update Custom Field Failed",
}

export class UpsertCustomFieldTriggered implements Action {
    type = CustomFieldsActionTypes.UpsertCustomFieldTriggered;
    formId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    customFormComponentsList: CustomFormFieldModel[];
    customFieldId: string;
    customFieldUpdates: { customFieldUpdate: Update<CustomFormFieldModel>};
    constructor(public customFormComponent: CustomFormFieldModel) {}
}

export class UpsertCustomFieldCompleted implements Action {
    type = CustomFieldsActionTypes.UpsertCustomFieldCompleted;
    customFormComponent: CustomFormFieldModel;
    validationMessages: ValidationModel[];
    errorMessage: string;
    customFormComponentsList: CustomFormFieldModel[];
    customFieldId: string;
    customFieldUpdates: { customFieldUpdate: Update<CustomFormFieldModel>};
    constructor(public formId: string) {}
}

export class UpsertCustomFieldFailed implements Action {
    type = CustomFieldsActionTypes.UpsertCustomFieldFailed;
    customFormComponent: CustomFormFieldModel;
    formId: string;
    errorMessage: string;
    customFormComponentsList: CustomFormFieldModel[];
    customFieldId: string;
    customFieldUpdates: { customFieldUpdate: Update<CustomFormFieldModel>};
    constructor(public validationMessages: ValidationModel[]) {}
}

export class GetCustomFieldsTriggered implements Action {
    type = CustomFieldsActionTypes.GetCustomFieldsTriggered;
    formId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    customFormComponentsList: CustomFormFieldModel[];
    customFieldId: string;
    customFieldUpdates: { customFieldUpdate: Update<CustomFormFieldModel>};
    constructor(public customFormComponent: CustomFormFieldModel) {}
}

export class GetCustomFieldsCompleted implements Action {
    type = CustomFieldsActionTypes.GetCustomFieldsCompleted;
    customFormComponent: CustomFormFieldModel;
    validationMessages: ValidationModel[];
    errorMessage: string;
    formId: string;
    customFieldId: string;
    customFieldUpdates: { customFieldUpdate: Update<CustomFormFieldModel>};
    constructor(public customFormComponentsList: CustomFormFieldModel[]) {}
}

export class GetCustomFieldByIdFailed implements Action {
    type = CustomFieldsActionTypes.GetCustomFieldByIdFailed;
    customFormComponent: CustomFormFieldModel;
    formId: string;
    errorMessage: string;
    customFormComponentsList: CustomFormFieldModel[];
    customFieldId: string;
    customFieldUpdates: { customFieldUpdate: Update<CustomFormFieldModel>};
    constructor(public validationMessages: ValidationModel[]) {}
}

export class GetCustomFieldByIdTriggered implements Action {
    type = CustomFieldsActionTypes.GetCustomFieldByIdTriggered;
    formId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    customFormComponentsList: CustomFormFieldModel[];
    customFormComponent: CustomFormFieldModel;
    customFieldUpdates: { customFieldUpdate: Update<CustomFormFieldModel>};
    constructor(public customFieldId: string) {}
}

export class GetCustomFieldByIdCompleted implements Action {
    type = CustomFieldsActionTypes.GetCustomFieldByIdCompleted;
    customFormComponentsList: CustomFormFieldModel[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    formId: string;
    customFieldId: string;
    customFieldUpdates: { customFieldUpdate: Update<CustomFormFieldModel>};
    constructor(public customFormComponent: CustomFormFieldModel) {}
}

export class GetCustomFieldsFailed implements Action {
    type = CustomFieldsActionTypes.GetCustomFieldsFailed;
    customFormComponent: CustomFormFieldModel;
    formId: string;
    errorMessage: string;
    customFormComponentsList: CustomFormFieldModel[];
    customFieldId: string;
    customFieldUpdates: { customFieldUpdate: Update<CustomFormFieldModel>};
    constructor(public validationMessages: ValidationModel[]) {}
}

export class ArchiveCustomFieldTriggered implements Action {
    type = CustomFieldsActionTypes.ArchiveCustomFieldTriggered;
    formId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    customFormComponentsList: CustomFormFieldModel[];
    customFieldId: string;
    customFieldUpdates: { customFieldUpdate: Update<CustomFormFieldModel>};
    constructor(public customFormComponent: CustomFormFieldModel) {}
}

export class ArchiveCustomFieldCompleted implements Action {
    type = CustomFieldsActionTypes.ArchiveCustomFieldCompleted;
    customFormComponentsList: CustomFormFieldModel[];
    validationMessages: ValidationModel[];
    customFormComponent: CustomFormFieldModel;
    errorMessage: string;
    customFieldId: string;
    customFieldUpdates: { customFieldUpdate: Update<CustomFormFieldModel>};
    constructor(public  formId: string) {}
}

export class ArchiveCustomFieldFailed implements Action {
    type = CustomFieldsActionTypes.ArchiveCustomFieldFailed;
    customFormComponent: CustomFormFieldModel;
    formId: string;
    errorMessage: string;
    customFormComponentsList: CustomFormFieldModel[];
    customFieldId: string;
    customFieldUpdates: { customFieldUpdate: Update<CustomFormFieldModel>};
    constructor(public validationMessages: ValidationModel[]) {}
}

export class UpdateCustomFieldDataTriggered implements Action {
    type = CustomFieldsActionTypes.UpdateCustomFieldDataTriggered;
    formId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    customFormComponentsList: CustomFormFieldModel[];
    customFieldId: string;
    customFieldUpdates: { customFieldUpdate: Update<CustomFormFieldModel>};
    constructor(public customFormComponent: CustomFormFieldModel) {}
}

export class UpdateCustomFieldDataCompleted implements Action {
    type = CustomFieldsActionTypes.UpdateCustomFieldDataCompleted;
    customFormComponentsList: CustomFormFieldModel[];
    validationMessages: ValidationModel[];
    customFormComponent: CustomFormFieldModel;
    errorMessage: string;
    customFieldId: string;
    customFieldUpdates: { customFieldUpdate: Update<CustomFormFieldModel>};
    constructor(public  formId: string) {}
}

export class UpdateCustomFieldDataFailed implements Action {
    type = CustomFieldsActionTypes.UpdateCustomFieldDataFailed;
    customFormComponent: CustomFormFieldModel;
    formId: string;
    errorMessage: string;
    customFormComponentsList: CustomFormFieldModel[];
    customFieldId: string;
    customFieldUpdates: { customFieldUpdate: Update<CustomFormFieldModel>};
    constructor(public validationMessages: ValidationModel[]) {}
}


export class RefreshCustomFormsList implements Action {
    type = CustomFieldsActionTypes.RefreshCustomFormsList;
    customFormComponentsList: CustomFormFieldModel[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    formId: string;
    customFieldId: string;
    customFieldUpdates: { customFieldUpdate: Update<CustomFormFieldModel>};
    constructor(public customFormComponent: CustomFormFieldModel) {}
}

export class UpdateCustomFormField implements Action {
    type = CustomFieldsActionTypes.UpdateCustomFormField;
    customFormComponentsList: CustomFormFieldModel[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    formId: string;
    customFieldId: string;
    customFormComponent: CustomFormFieldModel
    constructor(public  customFieldUpdates: { customFieldUpdate: Update<CustomFormFieldModel>}) {}
}

export class CustomExceptionHandled implements Action {
    type = CustomFieldsActionTypes.CustomExceptionHandled;
    customFormComponent: CustomFormFieldModel;
    formId: string;
    validationMessages: ValidationModel[];
    customFormComponentsList: CustomFormFieldModel[];
    customFieldId: string;
    customFieldUpdates: { customFieldUpdate: Update<CustomFormFieldModel>};
    constructor(public errorMessage: string) {}
}

export type CustomFieldsActions =
  | UpsertCustomFieldTriggered
  | UpsertCustomFieldCompleted
  | UpsertCustomFieldFailed
  | GetCustomFieldsTriggered
  | GetCustomFieldsCompleted
  | GetCustomFieldsFailed
  | GetCustomFieldByIdTriggered
  | GetCustomFieldByIdCompleted
  | GetCustomFieldByIdFailed
  | ArchiveCustomFieldTriggered
  | ArchiveCustomFieldCompleted
  | ArchiveCustomFieldFailed
  | RefreshCustomFormsList
  | UpdateCustomFormField
  | UpdateCustomFieldDataTriggered
  | UpdateCustomFieldDataCompleted
  | UpdateCustomFieldDataFailed
  | CustomExceptionHandled