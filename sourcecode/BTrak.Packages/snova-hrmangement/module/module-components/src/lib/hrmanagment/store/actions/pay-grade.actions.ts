import { Action } from '@ngrx/store';
import { PayGradeModel } from '../../models/pay-grade-model';

export enum PayGradeListActionTypes {
    LoadPayGradeTriggered = '[HR Widgets PayGrade Component] Initial Data Load Triggered',
    LoadPayGradeCompleted = '[HR Widgets PayGrade Component] Initial Data Load Completed',
    LoadPayGradeFailed = '[HR Widgets PayGrade Component] Initial Data Load Failed',
    ExceptionHandled = '[HR Widgets PayGrade Component] Handle Exception',
}

export class LoadPayGradeTriggered implements Action {
    type = PayGradeListActionTypes.LoadPayGradeTriggered;
    payGradeList: PayGradeModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public payGradeSearchResult: PayGradeModel) { }
}

export class LoadPayGradeCompleted implements Action {
    type = PayGradeListActionTypes.LoadPayGradeCompleted;
    payGradeSearchResult: PayGradeModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public payGradeList: PayGradeModel[]) { }
}

export class LoadPayGradeFailed implements Action {
    type = PayGradeListActionTypes.LoadPayGradeFailed;
    payGradeSearchResult: PayGradeModel;
    payGradeList: PayGradeModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = PayGradeListActionTypes.ExceptionHandled;
    payGradeSearchResult: PayGradeModel;
    payGradeList: PayGradeModel[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type PayGradeListActions = LoadPayGradeTriggered
    | LoadPayGradeCompleted
    | LoadPayGradeFailed
    | ExceptionHandled