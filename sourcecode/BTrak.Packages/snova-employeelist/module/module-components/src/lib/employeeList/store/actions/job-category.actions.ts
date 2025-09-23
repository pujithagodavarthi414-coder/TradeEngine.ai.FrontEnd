import { Action } from '@ngrx/store';

import { JobCategoryModel } from '../../models/job-category-model';
import { JobCategorySearchModel } from '../../models/job-category-search-model';

export enum JobCategoryActionTypes {
    LoadJobCategoryTriggered = '[Employee List Job Category Component] Initial Data Load Triggered',
    LoadJobCategoryCompleted = '[Employee List Job Category Component] Initial Data Load Completed',
    LoadJobCategoryFailed = '[Employee List Job Category Component] Initial Data Load Failed',
    ExceptionHandled = '[Employee List Job Category Component] Handle Exception',
}

export class LoadJobCategoryTriggered implements Action {
    type = JobCategoryActionTypes.LoadJobCategoryTriggered;
    jobCategoryList: JobCategoryModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public jobCategorySearchResult: JobCategorySearchModel) { }
}

export class LoadJobCategoryCompleted implements Action {
    type = JobCategoryActionTypes.LoadJobCategoryCompleted;
    jobCategorySearchResult: JobCategorySearchModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public jobCategoryList: JobCategoryModel[]) { }
}

export class LoadJobCategoryFailed implements Action {
    type = JobCategoryActionTypes.LoadJobCategoryFailed;
    jobCategorySearchResult: JobCategorySearchModel;
    jobCategoryList: JobCategoryModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = JobCategoryActionTypes.ExceptionHandled;
    jobCategorySearchResult: JobCategorySearchModel;
    jobCategoryList: JobCategoryModel[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type LanguageFluencyActions = LoadJobCategoryTriggered
    | LoadJobCategoryCompleted
    | LoadJobCategoryFailed
    | ExceptionHandled;