import { Action } from "@ngrx/store";
import { TemplateModel } from "../../models/templates-model";
import { Update } from "@ngrx/entity";
import { ValidationModel } from '../../models/validation-messages';

export enum TemplateActionTypes {
    UpsertTemplatesTriggered = "[Snovasys-PM][Templates Component] Upsert Templates Triggered",
    UpsertTemplatesCompleted = "[Snovasys-PM][Templates Component] Upsert Templates Completed",
    UpsertTemplatesFailed = "[Snovasys-PM][Templates Component] Upsert Templates Failed",
    InsertDuplicateTemplateTriggered = "[Snovasys-PM][Templates Component] Insert Duplicate Template Triggered",
    InsertDuplicateTemplateCompleted = "[Snovasys-PM][Templates Component] Insert Duplicate Template Completed",
    TemplatesExceptionHandled = "[Snovasys-PM][Templates Component] TemplatesExceptionHandled",
    GetTemplatesTriggered = "[Snovasys-PM][Templates Component] Get Templates Triggered",
    GetTemplatesCompleted = "[Snovasys-PM][Templates Component] Get Templates Completed",
    GetTemplatesFailed = "[Snovasys-PM][Templates Component] Get Templates Failed",
    GetTemplatesByIdTriggered = "[Snovasys-PM][Templates Component]Get Templates By Id Triggered",
    GetTemplatesByIdCompleted = "[Snovasys-PM][Templates Component]Get Templates By Id Completed",
    GetTemplatesByIdFailed = "[Snovasys-PM][Templates Component]Get Templates By Id Failed",
    RefreshTemplatesList = "[Snovasys-PM][Templates Component] Refresh Templates List",
    UpdateTemplatesField = "[Snovasys-PM][Templates Component] Update Templates Field",
    InsertGoalTemplateTriggered = "[Snovasys-PM][Templates Component] Insert Goal Template Triggered",
    InsertGoalTemplateCompleted = "[Snovasys-PM][Templates Component] Insert Goal Template Completed",
    InsertGoalTemplateFailed = "[Snovasys-PM][Templates Component] Insert Goal Templates Failed",
    ArchiveTemplatesTriggered = "[Snovasys-PM][Templates Component] Archive Templates Triggered",
    ArchiveTemplatesCompleted = "[Snovasys-PM][Templates Component] Archive Templates Completed",
    ArchiveTemplatesFailed = "[Snovasys-PM][Templates Component] Archive Templates Failed",
}

export class UpsertTemplatesTriggered implements Action {
    type = TemplateActionTypes.UpsertTemplatesTriggered;
    templateId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    templatesList: TemplateModel[];
    templateUpdates: { templateUpdate: Update<TemplateModel>};
    constructor(public template: TemplateModel) {}
}

export class UpsertTemplatesCompleted implements Action {
    type = TemplateActionTypes.UpsertTemplatesCompleted;
    template: TemplateModel
    validationMessages: ValidationModel[];
    errorMessage: string;
    templatesList: TemplateModel[];
    templateUpdates: { templateUpdate: Update<TemplateModel>};
    constructor(public templateId: string) {}
}

export class InsertDuplicateTemplateTriggered implements Action {
    type = TemplateActionTypes.InsertDuplicateTemplateTriggered;
    templateId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    templatesList: TemplateModel[];
    templateUpdates: { templateUpdate: Update<TemplateModel>};
    constructor(public template: TemplateModel) {}
}

export class InsertDuplicateTemplateCompleted implements Action {
    type = TemplateActionTypes.InsertDuplicateTemplateCompleted;
    template: TemplateModel
    validationMessages: ValidationModel[];
    errorMessage: string;
    templatesList: TemplateModel[];
    templateUpdates: { templateUpdate: Update<TemplateModel>};
    constructor(public templateId: string) {}
}

export class UpsertTemplatesFailed implements Action {
    type = TemplateActionTypes.UpsertTemplatesFailed;
    template: TemplateModel
    templateId: string;
    errorMessage: string;
    templatesList: TemplateModel[];
    templateUpdates: { templateUpdate: Update<TemplateModel>};
    constructor(public validationMessages: ValidationModel[]) {}
}

export class GetTemplatessTriggered implements Action {
    type = TemplateActionTypes.GetTemplatesTriggered;
    templateId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    templatesList: TemplateModel[];
    templateUpdates: { templateUpdate: Update<TemplateModel>};
    constructor(public template: TemplateModel) {}
}

export class GetTemplatesCompleted implements Action {
    type = TemplateActionTypes.GetTemplatesCompleted;
    template: TemplateModel
    validationMessages: ValidationModel[];
    errorMessage: string;
    templateId: string;
    templateUpdates: { templateUpdate: Update<TemplateModel>};
    constructor(public templatesList: TemplateModel[]) {}
}


export class GetTemplatesFailed implements Action {
    type = TemplateActionTypes.GetTemplatesFailed;
    template: TemplateModel
    templateId: string;
    errorMessage: string;
    templatesList: TemplateModel[];
    templateUpdates: { templateUpdate: Update<TemplateModel>};
    constructor(public validationMessages: ValidationModel[]) {}
}

export class GetTemplatesByIdFailed implements Action {
    type = TemplateActionTypes.GetTemplatesByIdFailed;
    template: TemplateModel
    templateId: string;
    errorMessage: string;
    templatesList: TemplateModel[];
    templateUpdates: { templateUpdate: Update<TemplateModel>};
    constructor(public validationMessages: ValidationModel[]) {}
}

export class GetTemplatesByIdTriggered implements Action {
    type = TemplateActionTypes.GetTemplatesByIdTriggered;
    validationMessages: ValidationModel[];
    errorMessage: string;
    templatesList: TemplateModel[];
    template: TemplateModel
    templateUpdates: { templateUpdate: Update<TemplateModel>};
    constructor(public templateId: string) {}
}

export class GetTemplatesByIdCompleted implements Action {
    type = TemplateActionTypes.GetTemplatesByIdCompleted;
    templatesList: TemplateModel[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    templateId: string;
    templateUpdates: { templateUpdate: Update<TemplateModel>};
    constructor(public template: TemplateModel) {}
}

export class RefreshTemplatesList implements Action {
    type = TemplateActionTypes.RefreshTemplatesList;
    templatesList: TemplateModel[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    templateId: string;
    templateUpdates: { templateUpdate: Update<TemplateModel>};
    constructor(public template: TemplateModel) {}
}

export class UpdateTemplatesField implements Action {
    type = TemplateActionTypes.UpdateTemplatesField;
    templatesList: TemplateModel[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    templateId: string;
    template: TemplateModel;
    constructor(public templateUpdates: { templateUpdate: Update<TemplateModel>}) {}
}

export class InsertGoalTemplateTriggered implements Action {
    type = TemplateActionTypes.InsertGoalTemplateTriggered;
    template: TemplateModel
    validationMessages: ValidationModel[];
    errorMessage: string;
    templatesList: TemplateModel[];
    templateUpdates: { templateUpdate: Update<TemplateModel>};
    constructor(public templateId: string) {}
}

export class InsertGoalTemplateCompleted implements Action {
    type = TemplateActionTypes.InsertGoalTemplateCompleted;
    template: TemplateModel
    validationMessages: ValidationModel[];
    errorMessage: string;
    templatesList: TemplateModel[];
    templateUpdates: { templateUpdate: Update<TemplateModel>};
    constructor(public templateId: string) {}
}

export class InsertGoalTemplateFailed implements Action {
    type = TemplateActionTypes.InsertGoalTemplateFailed;
    template: TemplateModel
    templateId: string;
    errorMessage: string;
    templatesList: TemplateModel[];
    templateUpdates: { templateUpdate: Update<TemplateModel>};
    constructor(public validationMessages: ValidationModel[]) {}
}

export class ArchiveTemplatesTriggered implements Action {
    type = TemplateActionTypes.ArchiveTemplatesTriggered;
    templateId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    templatesList: TemplateModel[];
    templateUpdates: { templateUpdate: Update<TemplateModel>};
    constructor(public  template: TemplateModel) {}
}

export class ArchiveTemplatesCompleted implements Action {
    type = TemplateActionTypes.ArchiveTemplatesCompleted;
    template: TemplateModel
    validationMessages: ValidationModel[];
    errorMessage: string;
    templatesList: TemplateModel[];
    templateUpdates: { templateUpdate: Update<TemplateModel>};
    constructor(public templateId: string) {}
}

export class ArchiveTemplatesFailed implements Action {
    type = TemplateActionTypes.ArchiveTemplatesFailed;
    template: TemplateModel
    templateId: string;
    errorMessage: string;
    templatesList: TemplateModel[];
    templateUpdates: { templateUpdate: Update<TemplateModel>};
    constructor(public validationMessages: ValidationModel[]) {}
}

export class TemplatesExceptionHandled implements Action {
    type = TemplateActionTypes.TemplatesExceptionHandled;
    templatesList: TemplateModel[];
    validationMessages: ValidationModel[];
    templateId: string;
    template: TemplateModel;
    templateUpdates: { templateUpdate: Update<TemplateModel>};
    constructor(public errorMessage: string) {}
}

export type TemplateActions = UpsertTemplatesCompleted |
                              UpsertTemplatesTriggered |
                              InsertDuplicateTemplateTriggered |
                              InsertDuplicateTemplateCompleted |
                              UpsertTemplatesFailed |
                              GetTemplatessTriggered |
                              GetTemplatesCompleted |
                              GetTemplatesFailed |
                              GetTemplatesByIdTriggered |
                              GetTemplatesByIdCompleted |
                              GetTemplatesByIdFailed |
                              RefreshTemplatesList |
                              UpdateTemplatesField |
                              InsertGoalTemplateTriggered |
                              InsertGoalTemplateCompleted |
                              InsertGoalTemplateFailed |
                              ArchiveTemplatesTriggered |
                              ArchiveTemplatesCompleted |
                              ArchiveTemplatesFailed

