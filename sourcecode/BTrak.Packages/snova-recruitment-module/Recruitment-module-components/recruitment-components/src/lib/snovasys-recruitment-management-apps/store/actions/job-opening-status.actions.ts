import { Action } from '@ngrx/store';
import { JobOpeningStatusInputModel } from '../../models/jobOpeningStatusInputModel';
import { JobOpeningStatus } from '../../models/jobOpeningStatus';
import { JobOpeningStausUpsert } from '../../models/job-opening-status-upsert.model';

export enum JobOpeningStatusActionTypes {
    LoadJobOpeningStatusTriggered = '[Job Opening Status Component] Initial Data Load Triggered',
    LoadJobOpeningStatusCompleted = '[Job Opening Status Component] Initial Data Load Completed',
    LoadJobOpeningStatusFailed = '[Job Opening Status Component] Initial Data Load Failed',
    CeateJobOpeningStatusTriggered = '[Job Opening Status Component] Create Job Opening Status Triggered',
    CreateJobOpeningStatusCompleted = '[Job Opening Status Component] Create Job Opening Status Completed',
    CreateJobOpeningStatusFailed = '[Job Opening Status Component] Create Job Opening Status Failed',
    ExceptionHandled = '[Job Opening Status Component] HandleException',
}

export class LoadJobOpeningStatusTriggered implements Action {
    type = JobOpeningStatusActionTypes.LoadJobOpeningStatusTriggered;
    jobOpeningStatusList: JobOpeningStatus[];
    validationMessages: any[];
    errorMessage: string;
    jobOppeningStatusId: string;
    jobOpeningStatus: JobOpeningStausUpsert;
    constructor(public jobOpeningStatusSearchResult: JobOpeningStatusInputModel) { }
}

export class LoadJobOpeningStatusCompleted implements Action {
    type = JobOpeningStatusActionTypes.LoadJobOpeningStatusCompleted;
    jobOpeningStatusSearchResult: JobOpeningStatusInputModel;
    validationMessages: any[];
    errorMessage: string;
    jobOppeningStatusId: string;
    jobOpeningStatus: JobOpeningStausUpsert;
    constructor(public jobOpeningStatusList: JobOpeningStatus[]) { }
}

export class LoadJobOpeningStatusFailed implements Action {
    type = JobOpeningStatusActionTypes.LoadJobOpeningStatusFailed;
    jobOpeningStatusSearchResult: JobOpeningStatusInputModel;
    jobOpeningStatusList: JobOpeningStatus[];
    errorMessage: string;
    jobOppeningStatusId: string;
    jobOpeningStatus: JobOpeningStausUpsert;
    constructor(public validationMessages: any[]) { }
}

export class CeateJobOpeningStatusTriggered implements Action {
    type = JobOpeningStatusActionTypes.CeateJobOpeningStatusTriggered;
    jobOpeningStatusSearchResult: JobOpeningStatusInputModel;
    jobOpeningStatusList: JobOpeningStatus[];
    errorMessage: string;
    jobOppeningStatusId: string;
    constructor(public jobOpeningStatus: JobOpeningStausUpsert) {}
}

export class CreateJobOpeningStatusCompleted implements Action {
    type = JobOpeningStatusActionTypes.CreateJobOpeningStatusCompleted;
    jobOpeningStatusSearchResult: JobOpeningStatusInputModel;
    jobOpeningStatusList: JobOpeningStatus[];
    errorMessage: string;
    jobOpeningStatus: JobOpeningStausUpsert;
    constructor(public jobOppeningStatusId: string) {}
}

export class CreateJobOpeningStatusFailed implements Action {
    type = JobOpeningStatusActionTypes.CreateJobOpeningStatusFailed;
    jobOpeningStatusSearchResult: JobOpeningStatusInputModel;
    jobOpeningStatusList: JobOpeningStatus[];
    errorMessage: string;
    jobOppeningStatusId: string;
    jobOpeningStatus: JobOpeningStausUpsert;
    constructor(public validationMessages: any[]) {}
}

export class ExceptionHandled implements Action {
    type = JobOpeningStatusActionTypes.ExceptionHandled;
    jobOpeningStatusSearchResult: JobOpeningStatusInputModel;
    jobOpeningStatusList: JobOpeningStatus[];
    validationMessages: any[];
    jobOppeningStatusId: string;
    jobOpeningStatus: JobOpeningStausUpsert;
    constructor(public errorMessage: string) { }
}

export type JobOpeningStatusActions = LoadJobOpeningStatusTriggered
    | LoadJobOpeningStatusCompleted
    | LoadJobOpeningStatusFailed
    | CeateJobOpeningStatusTriggered
    | CreateJobOpeningStatusCompleted
    | CreateJobOpeningStatusFailed
    | ExceptionHandled;
