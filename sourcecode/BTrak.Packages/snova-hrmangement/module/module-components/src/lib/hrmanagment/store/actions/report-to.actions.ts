import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { ReportToSearchModel } from '../../models/report-to-search-model';
import { ReportToDetailsModel } from '../../models/report-to-details-model';

export enum ReportToActionTypes {
    LoadReportToTriggered = '[HR Widgets  to Component] Report to Load Triggered',
    LoadReportToCompleted = '[HR Widgets Report to Component] Report to Load Completed',
    LoadReportToFailed = '[HR Widgets Report to Component] Report to Load Failed',
    CreateReportToTriggered = '[HR Widgets Report to Component] Create Report to Triggered',
    CreateReportToCompleted = '[HR Widgets Report to Component] Create Report to Completed',
    DeleteReportToCompleted = '[HR Widgets Report to Component] Delete Report to Completed',
    CreateReportToFailed = '[HR Widgets Report to Component] Create Report to Failed',
    GetReportToByIdTriggered = '[HR Widgets Report to Component] Get Report to By Id Triggered',
    GetReportToByIdCompleted = '[HR Widgets Report to Component] Get Report to Id Completed',
    CreateReportToCompletedWithInPlaceUpdate = '[HR Widgets  to Component] Update Report To Details By Id',
    RefreshReports = '[HR Widgets Report to Component] Refresh Reports List',
    ExceptionHandled = '[HR Widgets Report to Component] Handle Exception',
    loadReportToFailed = "[HR Widgets] loadReportToFailed"
}

export class LoadReportToTriggered implements Action {
    type = ReportToActionTypes.LoadReportToTriggered;
    reportToList: ReportToDetailsModel[];
    reportTodetails: ReportToDetailsModel;
    reportToDetailId: string;
    reportToUpdates: { reportToUpdate: Update<ReportToDetailsModel> }
    validationMessages: any[];
    errorMessage: string;
    constructor( public reportToSearchResult: ReportToSearchModel ) { }
}

export class LoadReportToCompleted implements Action {
    type = ReportToActionTypes.LoadReportToCompleted;
    reportToSearchResult: ReportToSearchModel;
    reportTodetails: ReportToDetailsModel;
    reportToDetailId: string;
    reportToUpdates: { reportToUpdate: Update<ReportToDetailsModel> }
    validationMessages: any[];
    errorMessage: string;
    constructor( public reportToList: ReportToDetailsModel[]) { }
}

export class LoadReportToFailed implements Action {
    type = ReportToActionTypes.LoadReportToFailed;
    reportToSearchResult: ReportToSearchModel;
    reportTodetails: ReportToDetailsModel;
    reportToDetailId: string;
    reportToUpdates: { reportToUpdate: Update<ReportToDetailsModel> }
    reportToList: ReportToDetailsModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class CreateReportToTriggered implements Action {
    type = ReportToActionTypes.CreateReportToTriggered;
    reportToSearchResult: ReportToSearchModel;
    reportToList: ReportToDetailsModel[];
    reportToDetailId: string;
    reportToUpdates: { reportToUpdate: Update<ReportToDetailsModel> }
    validationMessages: any[];
    errorMessage: string;
    constructor(public  reportTodetails: ReportToDetailsModel ) { }
}
export class CreateReportToCompleted implements Action {
    type = ReportToActionTypes.CreateReportToCompleted;
    reportToSearchResult: ReportToSearchModel;
    reportTodetails: ReportToDetailsModel;
    reportToList: ReportToDetailsModel[];
    reportToUpdates: { reportToUpdate: Update<ReportToDetailsModel> }
    validationMessages: any[];
    errorMessage: string;
    constructor(public reportToDetailId: string ) { }
}

export class CreateReportToFailed implements Action {
    type = ReportToActionTypes.CreateReportToFailed;
    reportToSearchResult: ReportToSearchModel;
    reportTodetails: ReportToDetailsModel;
    reportToDetailId: string;
    reportToList: ReportToDetailsModel[];
    reportToUpdates: { reportToUpdate: Update<ReportToDetailsModel> }
    errorMessage: string;
    constructor(public validationMessages: any[] ) { }
}

export class DeleteReportToCompleted implements Action {
    type = ReportToActionTypes.DeleteReportToCompleted;
    reportToSearchResult: ReportToSearchModel;
    reportTodetails: ReportToDetailsModel;
    reportToList: ReportToDetailsModel[];
    reportToUpdates: { reportToUpdate: Update<ReportToDetailsModel> }
    validationMessages: any[];
    errorMessage: string;
    constructor(public reportToDetailId: string) {}
}

export class GetReportToByIdTriggered implements Action {
    type = ReportToActionTypes.GetReportToByIdTriggered;
    reportToSearchResult: ReportToSearchModel;
    reportToList: ReportToDetailsModel[];
    reportTodetails: ReportToDetailsModel;
    reportToUpdates: { reportToUpdate: Update<ReportToDetailsModel> }
    validationMessages: any[];
    errorMessage: string;
    constructor(public reportToDetailId: string ) { }
}

export class GetReportToByIdCompleted implements Action {
    type = ReportToActionTypes.GetReportToByIdCompleted;
    reportToSearchResult: ReportToSearchModel;
    reportToDetailId: string;
    reportToList: ReportToDetailsModel[];
    
    reportToUpdates: { reportToUpdate: Update<ReportToDetailsModel> }
    validationMessages: any[];
    errorMessage: string;
    constructor( public reportTodetails: ReportToDetailsModel) { }
}

export class CreateReportToCompletedWithInPlaceUpdate implements Action {
    type = ReportToActionTypes.CreateReportToCompletedWithInPlaceUpdate;
    reportToSearchResult: ReportToSearchModel;
    reportTodetails: ReportToDetailsModel;
    reportToDetailId: string;
    reportToList: ReportToDetailsModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor( public reportToUpdates: { reportToUpdate: Update<ReportToDetailsModel> }) { }
}

export class RefreshReports implements Action {
    type = ReportToActionTypes.RefreshReports;
    reportToSearchResult: ReportToSearchModel;
    reportToDetailId: string;
    reportToList: ReportToDetailsModel[];
    reportToUpdates: { reportToUpdate: Update<ReportToDetailsModel> }
    validationMessages: any[];
    errorMessage: string;
    constructor( public reportTodetails: ReportToDetailsModel ) { }
}


export class ExceptionHandled implements Action {
    type = ReportToActionTypes.ExceptionHandled;
    reportToSearchResult: ReportToSearchModel;
    reportToDetailId: string;
    reportTodetails: ReportToDetailsModel;
    reportToList: ReportToDetailsModel[];
    reportToUpdates: { reportToUpdate: Update<ReportToDetailsModel> }
    validationMessages: any[];
    constructor( public errorMessage: string) { }
}

export type ReportToActions = LoadReportToTriggered
    | LoadReportToCompleted
    | LoadReportToFailed
    | CreateReportToTriggered
    | CreateReportToCompleted
    | CreateReportToFailed
    | DeleteReportToCompleted
    | GetReportToByIdTriggered
    | GetReportToByIdCompleted
    | CreateReportToCompletedWithInPlaceUpdate
    | RefreshReports
    | ExceptionHandled
    

