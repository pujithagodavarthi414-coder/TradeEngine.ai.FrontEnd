import { Action } from "@ngrx/store";
import { Update } from "@ngrx/entity";
import { ValidationModel } from '../../models/validation-messages';
import { CustomFormFieldModel } from '../../models/custom-fileds-model';

export enum CustomFieldsActionTypes {
    UpsertCustomFieldTriggered = "[Customfields management CustomField Component] Upsert CustomField Triggered",
    UpsertCustomFieldCompleted = "[Customfields management CustomField Component] Upsert CustomField Completed",
    UpsertCustomFieldFailed = "[Customfields management CustomField Component] Upsert CustomField Failed",
    ExceptionHandled = "[Customfields management CustomField Component] ExceptionHandled",
    GetCustomFieldsTriggered = "[Customfields management CustomField Component] Get Custom Field Triggered",
    GetCustomFieldsCompleted = "[Customfields management CustomField Component] Get Custom Field Completed",
    GetCustomFieldsFailed = "[Customfields management CustomField Component] Get Custom Field Failed",
    GetCustomFieldByIdTriggered = "[Customfields management CustomField Component]Get CustomField By Id Triggered",
    GetCustomFieldByIdCompleted = "[Customfields management CustomField Component]Get CustomField By Id Completed",
    GetCustomFieldByIdFailed = "[Customfields management CustomField Component]Get CustomField By Id Failed",
    RefreshCustomFormsList = "[Customfields management CustomField Component] Refresh Custom Forms List",
    ArchiveCustomFieldTriggered = "[Customfields management CustomField Component] Archive CustomField Triggered",
    ArchiveCustomFieldCompleted = "[Customfields management CustomField Component] Archive CustomField Completed",
    ArchiveCustomFieldFailed = "[Customfields management CustomField Component] Archive CustomField Failed",
    UpdateCustomFormField = "[Customfields management CustomField Component] Update CustomForm Field",
    UpdateCustomFieldDataTriggered ="[Customfields management CustomField Component] Update Custom Field Triggered",
    UpdateCustomFieldDataCompleted ="[Customfields management CustomField Component] Update Custom Field Completed",
    UpdateCustomFieldDataFailed ="[Customfields management CustomField Component] Update Custom Field Failed",
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

export class ExceptionHandled implements Action {
    type = CustomFieldsActionTypes.ExceptionHandled;
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
  | ExceptionHandled