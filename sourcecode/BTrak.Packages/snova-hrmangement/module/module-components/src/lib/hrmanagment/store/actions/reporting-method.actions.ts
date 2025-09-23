import { Action } from '@ngrx/store';
import { ReportingMethodDetailsModel } from  '../../models/repoting-method-details-model';
import {ReportingMethodSearchModel} from '../../models/repoting-method-search-model';

export enum ReportingMethodDetailsActionTypes {
  LoadReportingMethodDetailsTriggered = '[HR Widgets Reporting Method Details Component] Initial Data Load Triggered',
  LoadReportingMethodDetailsCompleted = '[HR Widgets  Method Details Component] Initial Data Load Completed',
  LoadReportingMethodDetailsFailed = '[HR Widgets Reporting Method Details Component] Create Reporting Method Details Failed',
  ExceptionHandled = '[HR Widgets Reporting Method Details Component] Handle Exception',
  CreateReportToCompleted = "[HR Widgets CreateReportToCompleted]"
}

export class LoadReportingMethodDetailsTriggered implements Action {
    type = ReportingMethodDetailsActionTypes.LoadReportingMethodDetailsTriggered;
    reportingMethodDetailsList: ReportingMethodDetailsModel[];
    ReportingMethodId: string;
    validationMessages: string[];
    errorMessage: string;
    constructor(public reportingMethodSearchResult: ReportingMethodSearchModel) { }
}

export class LoadReportingMethodDetailsCompleted implements Action {
    type = ReportingMethodDetailsActionTypes.LoadReportingMethodDetailsCompleted;
    reportingMethodSearchResult: ReportingMethodSearchModel
    ReportingMethodId: string;
    validationMessages: string[];
    errorMessage: string;
    constructor(public reportingMethodDetailsList: ReportingMethodDetailsModel[]) { }
}

export class LoadReportingMethodDetailsFailed implements Action {
    type = ReportingMethodDetailsActionTypes.LoadReportingMethodDetailsFailed;
    reportingMethodDetailsList: ReportingMethodDetailsModel[];
    reportingMethodSearchResult: ReportingMethodSearchModel
    ReportingMethodId: string;
    errorMessage: string;
    constructor(public validationMessages: string[]) { }
}

export class ExceptionHandled implements Action {
    type = ReportingMethodDetailsActionTypes.ExceptionHandled;
    reportingMethodDetailsList: ReportingMethodDetailsModel[];
    reportingMethodSearchResult: ReportingMethodSearchModel
    ReportingMethodId: string;
    validationMessages: string[];
    constructor(public errorMessage: string) { }
}

export type ReportingMethodDetailsActions = LoadReportingMethodDetailsTriggered
    | LoadReportingMethodDetailsCompleted
    | LoadReportingMethodDetailsFailed
    | ExceptionHandled;