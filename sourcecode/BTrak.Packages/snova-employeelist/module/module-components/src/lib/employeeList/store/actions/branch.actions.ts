import { Action } from '@ngrx/store';
import { Branch } from "../../models/branch";

export enum BranchActionTypes {
    LoadBranchTriggered = '[Employee List Branch Component] Initial Data Load Triggered',
    LoadBranchCompleted = '[Employee List Component] Initial Data Load Completed',
    LoadBranchFailed = '[Employee List Component] Initial Data Load Failed',
    ExceptionHandled = '[Employee List Branch Component] HandleException',
}

export class LoadBranchTriggered implements Action {
    type = BranchActionTypes.LoadBranchTriggered;
    branchList: Branch[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public branchSearchResult: Branch) { }
}

export class LoadBranchCompleted implements Action {
    type = BranchActionTypes.LoadBranchCompleted;
    branchSearchResult: Branch;
    validationMessages: any[];
    errorMessage: string;
    constructor(public branchList: Branch[]) { }
}

export class LoadBranchFailed implements Action {
    type = BranchActionTypes.LoadBranchFailed;
    branchSearchResult: Branch;
    branchList: Branch[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = BranchActionTypes.ExceptionHandled;
    branchSearchResult: Branch;
    branchList: Branch[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type BranchActions = LoadBranchTriggered
    | LoadBranchCompleted
    | LoadBranchFailed
    | ExceptionHandled;