import { Action } from '@ngrx/store';

import { ContractTypeSearchModel } from '../../models/contract-type-search-model';
import { ContractTypeModel } from '../../models/contract-type-model';

export enum ContractTypeActionTypes {
    LoadContractTypeTriggered = '[HR Widgets Contract Type Component] Initial Data Load Triggered',
    LoadContractTypeCompleted = '[HR Widgets Contract Type Component] Initial Data Load Completed',
    LoadContractTypeFailed = '[HR Widgets Contract Type Component] Initial Data Load Failed',
    ExceptionHandled = '[HR Widgets Contract Type Component] Handle Exception',
}

export class LoadContractTypeTriggered implements Action {
    type = ContractTypeActionTypes.LoadContractTypeTriggered;
    contractTypeList: ContractTypeModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public contractTypeSearchResult: ContractTypeSearchModel) { }
}

export class LoadContractTypeCompleted implements Action {
    type = ContractTypeActionTypes.LoadContractTypeCompleted;
    contractTypeSearchResult: ContractTypeSearchModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public contractTypeList: ContractTypeModel[]) { }
}

export class LoadContractTypeFailed implements Action {
    type = ContractTypeActionTypes.LoadContractTypeFailed;
    contractTypeSearchResult: ContractTypeSearchModel;
    contractTypeList: ContractTypeModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = ContractTypeActionTypes.ExceptionHandled;
    contractTypeSearchResult: ContractTypeSearchModel;
    contractTypeList: ContractTypeModel[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type ContractTypeActions = LoadContractTypeTriggered
    | LoadContractTypeCompleted
    | LoadContractTypeFailed
    | ExceptionHandled;