import { Action } from '@ngrx/store';
import { CandidateSearchtModel } from '../../../snovasys-recruitment-management/models/candidate-search.model';
import { CandidateUpsertModel } from '../../../snovasys-recruitment-management/models/candidateUpsertModel';


export enum CandidateActionTypes {
    LoadCandidateItemsTriggered = '[Candidate Component]Candidate Initial Data Load Triggered',
    LoadCandidateItemsCompleted = '[Candidate Component]Candidate Initial Data Load Completed',
    LoadCandidateItemsDetailsFailed = '[Candidate Component]Candidate Initial Data Load Failed',
    CandidateExceptionHandled = '[Candidate Component] CandidateHandle Exception',
    CreateCandidateItemTriggered = '[Candidate Component] Create Candidate Triggered',
    CreateCandidateItemCompleted = '[Candidate Component] Create Candidate Completed',
    CreateCandidateItemFailed = '[Candidate Component] Create Candidate Failed',
    RefreshCandidatesList = 'RefreshCandidatesList'
}

export class  LoadCandidateItemsTriggered implements Action {
    type = CandidateActionTypes.LoadCandidateItemsTriggered;
    candidate: any[];
    validationMessages: any[];
    errorMessage: string;
    candidateUpsert: CandidateUpsertModel;
    candidateId: string;
    refreshCandidates: CandidateSearchtModel;
    constructor(public candidateSearch: CandidateSearchtModel) {}
}

export class LoadCandidateItemsCompleted implements Action {
    type = CandidateActionTypes.LoadCandidateItemsCompleted;
    candidateSearch: CandidateSearchtModel;
    validationMessages: any[];
    errorMessage: string;
    candidateUpsert: CandidateUpsertModel;
    candidateId: string;
    refreshCandidates: CandidateSearchtModel;
    constructor(public candidate: any[]) {}
}

export class LoadCandidateItemsDetailsFailed implements Action {
    type = CandidateActionTypes.LoadCandidateItemsDetailsFailed;
    candidateSearch: CandidateSearchtModel;
    candidate: any[];
    errorMessage: string;
    candidateUpsert: CandidateUpsertModel;
    candidateId: string;
    refreshCandidates: CandidateSearchtModel;
    constructor(public validationMessages: any[]) {}
}

export class CandidateExceptionHandled implements Action {
    type = CandidateActionTypes.CandidateExceptionHandled;
    candidateSearch: CandidateSearchtModel;
    candidate: any[];
    validationMessages: any[];
    candidateUpsert: CandidateUpsertModel;
    candidateId: string;
    refreshCandidates: CandidateSearchtModel;
    constructor(public errorMessage: string) {}
}

export class CreateCandidateItemTriggered implements Action {
    type = CandidateActionTypes.CreateCandidateItemTriggered;
    candidateSearch: CandidateSearchtModel;
    candidate: any[];
    validationMessages: any[];
    errorMessage: string;
    candidateId: string;
    refreshCandidates: CandidateSearchtModel;
    constructor(public candidateUpsert: CandidateUpsertModel) {}
}

export class CreateCandidateItemCompleted implements Action {
    type = CandidateActionTypes.CreateCandidateItemCompleted;
    candidateSearch: CandidateSearchtModel;
    candidate: any[];
    validationMessages: any[];
    errorMessage: string;
    candidateUpsert: CandidateUpsertModel;
    refreshCandidates: CandidateSearchtModel;
    constructor(public candidateId: string) {}
}

export class CreateCandidateItemFailed implements Action {
    type = CandidateActionTypes.CreateCandidateItemFailed;
    candidateSearch: CandidateSearchtModel;
    candidate: any[];
    errorMessage: string;
    candidateUpsert: CandidateUpsertModel;
    candidateId: string;
    refreshCandidates: CandidateSearchtModel;
    constructor(public validationMessages: any[]) {}
}

export class RefreshCandidatesList implements Action {
    type = CandidateActionTypes.RefreshCandidatesList;
    candidate: any[];
    validationMessages: any[];
    candidateSearch: CandidateSearchtModel;
    errorMessage: string;
    candidateUpsert: CandidateUpsertModel;
    candidateId: string;
    constructor(public refreshCandidates: CandidateSearchtModel) {}
}

export type CandidateActions = LoadCandidateItemsTriggered
    | LoadCandidateItemsCompleted
    | LoadCandidateItemsDetailsFailed
    | CandidateExceptionHandled
    | CreateCandidateItemTriggered
    | CreateCandidateItemCompleted
    | CreateCandidateItemFailed
    | RefreshCandidatesList;
