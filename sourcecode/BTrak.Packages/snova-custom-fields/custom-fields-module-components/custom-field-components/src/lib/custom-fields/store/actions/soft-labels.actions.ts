import { Action } from "@ngrx/store";
import { Update } from "@ngrx/entity";
import { ValidationModel } from '../../models/validation-messages';
import { SoftLabelConfigurationModel } from '../../models/softlabels-model';


export enum softLabelsActionTypes {
    UpsertsoftLabelTriggered = "[Customfields management softLabel Component] Upsert softLabel Triggered",
    UpsertsoftLabelCompleted = "[Customfields management softLabel Component] Upsert softLabel Completed",
    UpsertsoftLabelFailed = "[Customfields management softLabel Component] Upsert softLabel Failed",
    ExceptionDetailsHandled = "[Customfields management softLabel Component] ExceptionDetailsHandled",
    GetsoftLabelsTriggered = "[Customfields management softLabel Component] Get softLabel Triggered",
    GetsoftLabelsCompleted = "[Customfields management softLabel Component] Get softLabel Completed",
    GetsoftLabelsFailed = "[Customfields management softLabel Component] Get softLabel Failed",
    GetsoftLabelByIdTriggered = "[Customfields management softLabel Component]Get softLabel By Id Triggered",
    GetsoftLabelByIdCompleted = "[Customfields management softLabel Component]Get softLabel By Id Completed",
    GetsoftLabelByIdFailed = "[Customfields management softLabel Component]Get softLabel By Id Failed",
    UpdatesoftLabelField = "[Customfields management softLabel Component] Update softLabel Field",
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

export class ExceptionDetailsHandled implements Action {
    type = softLabelsActionTypes.ExceptionDetailsHandled;
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
                  | ExceptionDetailsHandled