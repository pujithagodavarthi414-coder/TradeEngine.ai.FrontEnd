import { Action } from '@ngrx/store';
import { JobOpening } from '../../models/jobOpening.model';
export enum JobOpeningActionTypes {
    LoadJobOpeningItemsTriggered = '[Job Opening Component]Job Opening Initial Data Load Triggered',
    LoadJobOpeningItemsCompleted = '[Job Opening Component]Job Opening Initial Data Load Completed',
    LoadJobOpeningItemsDetailsFailed = '[Job Opening Component]Job Opening Initial Data Load Failed',
    JobOpeningExceptionHandled = '[Job Opening Component] Job OpeningHandle Exception',
    CreateJobOpeningItemTriggered = '[Job Opening Component] Create Job Opening Triggered',
    CreateJobOpeningItemCompleted = '[Job Opening Component] Create Job Opening Completed',
    CreateJobOpeningItemFailed = '[Job Opening Component] Create Job Opening Failed',
    LoadJobOpeningItemsFromCandidatesTriggered = '[Job Opening Component]Job Opening Initial Data Load From Candidates Triggered',
    RefreshJobOpeningList = 'RefreshJobOpeningList',
    LoadJobOpeningList = 'LoadJobOpeningList'
}

export class LoadJobOpeningItemsTriggered implements Action {
    type = JobOpeningActionTypes.LoadJobOpeningItemsTriggered;
    jobOpening: JobOpening[];
    validationMessages: any[];
    errorMessage: string;
    jobOpeningUpsert: JobOpening;
    jobOpeningId: string;
    constructor(public jobOpeningGet: JobOpening) {}
}

export class LoadJobOpeningItemsFromCandidatesTriggered implements Action {
    type = JobOpeningActionTypes.LoadJobOpeningItemsTriggered;
    jobOpening: JobOpening[];
    validationMessages: any[];
    errorMessage: string;
    jobOpeningUpsert: JobOpening;
    jobOpeningId: string;
    refreshJobOpening: JobOpening;
    constructor(public jobOpeningGet: JobOpening) {}
}

export class LoadJobOpeningItemsCompleted implements Action {
    type = JobOpeningActionTypes.LoadJobOpeningItemsCompleted;
    jobOpeningGet: JobOpening;
    validationMessages: any[];
    errorMessage: string;
    jobOpeningUpsert: JobOpening;
    jobOpeningId: string;
    refreshJobOpening: JobOpening;
    constructor(public jobOpening: JobOpening[]) {}
}

export class LoadJobOpeningItemsDetailsFailed implements Action {
    type = JobOpeningActionTypes.LoadJobOpeningItemsDetailsFailed;
    jobOpeningGet: JobOpening;
    jobOpening: JobOpening[];
    errorMessage: string;
    jobOpeningUpsert: JobOpening;
    jobOpeningId: string;
    refreshJobOpening: JobOpening;
    constructor(public validationMessages: any[]) {}
}

export class JobOpeningExceptionHandled implements Action {
    type = JobOpeningActionTypes.JobOpeningExceptionHandled;
    jobOpeningGet: JobOpening;
    jobOpening: JobOpening[];
    validationMessages: any[];
    jobOpeningUpsert: JobOpening;
    jobOpeningId: string;
    refreshJobOpening: JobOpening;
    constructor(public errorMessage: string) { }
}

export class CreateJobOpeningItemTriggered implements Action {
    type = JobOpeningActionTypes.CreateJobOpeningItemTriggered;
    jobOpeningGet: JobOpening;
    jobOpening: JobOpening[];
    validationMessages: any[];
    errorMessage: string;
    jobOpeningId: string;
    refreshJobOpening: JobOpening;
    constructor(public jobOpeningUpsert: JobOpening) {}
}

export class CreateJobOpeningItemCompleted implements Action {
    type = JobOpeningActionTypes.CreateJobOpeningItemCompleted;
    jobOpeningGet: JobOpening;
    jobOpening: JobOpening[];
    validationMessages: any[];
    errorMessage: string;
    jobOpeningUpsert: JobOpening;
    refreshJobOpening: JobOpening;
    constructor(public jobOpeningId: string) {}
}

export class CreateJobOpeningItemFailed implements Action {
    type = JobOpeningActionTypes.CreateJobOpeningItemFailed;
    jobOpeningGet: JobOpening;
    jobOpening: JobOpening[];
    errorMessage: string;
    jobOpeningUpsert: JobOpening;
    jobOpeningId: string;
    refreshJobOpening: JobOpening;
    constructor(public validationMessages: any[]) {}
}

export class RefreshJobOpeningList implements Action {
    type = JobOpeningActionTypes.RefreshJobOpeningList;
    jobOpeningGet: JobOpening;
    jobOpening: JobOpening[];
    validationMessages: any[];
    errorMessage: string;
    jobOpeningUpsert: JobOpening;
    jobOpeningId: string;
    constructor(public refreshJobOpening: JobOpening) {}
}

export type JobOpeningActions = LoadJobOpeningItemsTriggered
    |   LoadJobOpeningItemsFromCandidatesTriggered
    |   LoadJobOpeningItemsCompleted
    |   LoadJobOpeningItemsDetailsFailed
    |   JobOpeningExceptionHandled
    |   CreateJobOpeningItemTriggered
    |   CreateJobOpeningItemCompleted
    |   CreateJobOpeningItemFailed
    |   RefreshJobOpeningList;
