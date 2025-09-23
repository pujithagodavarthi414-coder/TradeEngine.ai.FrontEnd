import { Action } from "@ngrx/store";
import { ValidationModel } from "../../models/validation-messages";
import { SoftLabelConfigurationModel } from "../../models/softLabels-model";
import { Update } from "@ngrx/entity";


export enum softLabelsActionTypes {
    UpsertsoftLabelTriggered = "[DropZone softLabel Component] Upsert softLabel Triggered",
    UpsertsoftLabelCompleted = "[DropZone softLabel Component] Upsert softLabel Completed",
    UpsertsoftLabelFailed = "[DropZone softLabel Component] Upsert softLabel Failed",
    ExceptionHandled = "[DropZone softLabel Component] ExceptionHandled",
    GetsoftLabelsTriggered = "[DropZone softLabel Component] Get softLabel Triggered",
    GetsoftLabelsCompleted = "[DropZone softLabel Component] Get softLabel Completed",
    GetsoftLabelsFailed = "[DropZone softLabel Component] Get softLabel Failed",
    GetsoftLabelByIdTriggered = "[DropZone softLabel Component]Get softLabel By Id Triggered",
    GetsoftLabelByIdCompleted = "[DropZone softLabel Component]Get softLabel By Id Completed",
    GetsoftLabelByIdFailed = "[DropZone softLabel Component]Get softLabel By Id Failed",
    UpdatesoftLabelField = "[DropZone softLabel Component] Update softLabel Field",
}

export class UpsertsoftLabelTriggered implements Action {
    type = softLabelsActionTypes.UpsertsoftLabelTriggered;
    formId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    softLabelsList: SoftLabelConfigurationModel[];
    softLabelId: string;
    softLabelUpdates: { softLabelUpdate: Update<SoftLabelConfigurationModel>};
    constructor(public softLabelConfiguration: SoftLabelConfigurationModel) {}
}

export class UpsertsoftLabelCompleted implements Action {
    type = softLabelsActionTypes.UpsertsoftLabelCompleted;
    softLabelConfiguration: SoftLabelConfigurationModel;
    validationMessages: ValidationModel[];
    errorMessage: string;
    softLabelsList: SoftLabelConfigurationModel[];
    softLabelUpdates: { softLabelUpdate: Update<SoftLabelConfigurationModel>};
    constructor(public softLabelId: string) {}
}

export class UpsertsoftLabelFailed implements Action {
    type = softLabelsActionTypes.UpsertsoftLabelFailed;
    softLabelConfiguration: SoftLabelConfigurationModel;
    formId: string;
    errorMessage: string;
    softLabelsList: SoftLabelConfigurationModel[];
    softLabelId: string;
    softLabelUpdates: { softLabelUpdate: Update<SoftLabelConfigurationModel>};
    constructor(public validationMessages: ValidationModel[]) {}
}

export class GetsoftLabelsTriggered implements Action {
    type = softLabelsActionTypes.GetsoftLabelsTriggered;
    formId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    softLabelsList: SoftLabelConfigurationModel[];
    softLabelId: string;
    softLabelUpdates: { softLabelUpdate: Update<SoftLabelConfigurationModel>};
    constructor(public softLabelConfiguration: SoftLabelConfigurationModel) {}
}

export class GetsoftLabelsCompleted implements Action {
    type = softLabelsActionTypes.GetsoftLabelsCompleted;
    softLabelConfiguration: SoftLabelConfigurationModel;
    validationMessages: ValidationModel[];
    errorMessage: string;
    formId: string;
    softLabelId: string;
    softLabelUpdates: { softLabelUpdate: Update<SoftLabelConfigurationModel>};
    constructor(public softLabelsList: SoftLabelConfigurationModel[]) {}
}

export class GetsoftLabelsFailed implements Action {
    type = softLabelsActionTypes.GetsoftLabelsFailed;
    softLabelConfiguration: SoftLabelConfigurationModel;
    formId: string;
    errorMessage: string;
    softLabelsList: SoftLabelConfigurationModel[];
    softLabelId: string;
    softLabelUpdates: { softLabelUpdate: Update<SoftLabelConfigurationModel>};
    constructor(public validationMessages: ValidationModel[]) {}
}

export class GetsoftLabelByIdTriggered implements Action {
    type = softLabelsActionTypes.GetsoftLabelByIdTriggered;
    formId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    softLabelsList: SoftLabelConfigurationModel[];
    softLabelConfiguration: SoftLabelConfigurationModel;
    softLabelUpdates: { softLabelUpdate: Update<SoftLabelConfigurationModel>};
    constructor(public softLabelId: string) {}
}

export class GetsoftLabelByIdCompleted implements Action {
    type = softLabelsActionTypes.GetsoftLabelByIdCompleted;
    softLabelsList: SoftLabelConfigurationModel[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    formId: string;
    softLabelId: string;
    softLabelUpdates: { softLabelUpdate: Update<SoftLabelConfigurationModel>};
    constructor(public softLabelConfiguration: SoftLabelConfigurationModel) {}
}

export class GetsoftLabelByIdFailed implements Action {
    type = softLabelsActionTypes.GetsoftLabelByIdFailed;
    softLabelConfiguration: SoftLabelConfigurationModel;
    formId: string;
    errorMessage: string;
    softLabelsList: SoftLabelConfigurationModel[];
    softLabelId: string;
    softLabelUpdates: { softLabelUpdate: Update<SoftLabelConfigurationModel>};
    constructor(public validationMessages: ValidationModel[]) {}
}

export class UpdatesoftLabelField implements Action {
    type = softLabelsActionTypes.UpdatesoftLabelField;
    softLabelsList: SoftLabelConfigurationModel[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    formId: string;
    softLabelId: string;
    softLabelConfiguration: SoftLabelConfigurationModel
    constructor(public  softLabelUpdates: { softLabelUpdate: Update<SoftLabelConfigurationModel>}) {}
}

export class ExceptionHandled implements Action {
    type = softLabelsActionTypes.ExceptionHandled;
    softLabelConfiguration: SoftLabelConfigurationModel;
    formId: string;
    validationMessages: ValidationModel[];
    softLabelsList: SoftLabelConfigurationModel[];
    softLabelId: string;
    softLabelUpdates: { softLabelUpdate: Update<SoftLabelConfigurationModel>};
    constructor(public errorMessage: string) {}
}


export type SoftLabelActions = UpsertsoftLabelTriggered
                  | UpsertsoftLabelCompleted
                  | UpsertsoftLabelFailed
                  | GetsoftLabelByIdTriggered
                  | GetsoftLabelByIdCompleted
                  | GetsoftLabelByIdFailed
                  | GetsoftLabelsTriggered
                  | GetsoftLabelsCompleted
                  | GetsoftLabelsFailed
                  | UpdatesoftLabelField
                  | ExceptionHandled