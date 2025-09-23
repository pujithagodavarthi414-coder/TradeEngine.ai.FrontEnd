import { Action } from '@ngrx/store';
import { TestRailReport, ReportsList, ShareReport } from '../../models/reports-list';
import { Update } from '@ngrx/entity';

export enum ReportActionTypes {
    LoadReportTriggered = '[Snovasys-TM] [Report Component] Initial Report Load Triggered',
    LoadReportCompleted = '[Snovasys-TM] [Report Component] Initial Report Load Completed',
    LoadReportByIdTriggered = '[Snovasys-TM] [Report Component] Initial Report By Id Load Triggered',
    LoadReportByIdCompleted = '[Snovasys-TM] [Report Component] Initial Report By Id Load Completed',
    LoadDetailedReportTriggered = '[Snovasys-TM] [Report Component] Initial Detailed Report Load Triggered',
    LoadDetailedReportCompleted = '[Snovasys-TM] [Report Component] Initial Detailed Report Load Completed',
    LoadShareReportTriggered = '[Snovasys-TM] [Report Component] Initial Share Report Load Triggered',
    LoadShareReportCompleted = '[Snovasys-TM] [Report Component] Initial Share Report Load Completed',
    LoadReportDeleteTriggered = '[Snovasys-TM] [Report Component] Initial Report Load Delete Triggered',
    LoadReportDeleteCompleted = '[Snovasys-TM] [Report Component] Initial Report Load Delete Completed',
    LoadReportListTriggered = '[Snovasys-TM] [Report Component] Initial Report List Load Triggered',
    LoadReportListCompleted = '[Snovasys-TM] [Report Component] Initial Report List Load Completed',
    RefreshReportsList = '[Snovasys-TM] [Report Component] Initial Report Refresh List Load Completed',
    ReportFailed = '[Snovasys-TM] [Report Component] Report Load Failed',
    ReportException = '[Snovasys-TM] [Report Component] Report Exception Handled'
}

export class LoadReportTriggered implements Action {
    type = ReportActionTypes.LoadReportTriggered;
    reportId: string;
    searchReport: TestRailReport;
    searchReportSuccess: ReportsList[];
    shareReport: ShareReport;
    reportShared: boolean;
    deleteReport: TestRailReport;
    deleteId: string;
    reportById: TestRailReport;
    detailedReport: ReportsList;
    reports: TestRailReport;
    reportsList: ReportsList[];
    latestReportData: ReportsList;
    responseMessages: string[];
    errorMessage: string;
    constructor(public report: TestRailReport) { }
}

export class LoadReportCompleted implements Action {
    type = ReportActionTypes.LoadReportCompleted;
    report: TestRailReport;
    searchReport: TestRailReport;
    searchReportSuccess: ReportsList[];
    shareReport: ShareReport;
    reportShared: boolean;
    deleteReport: TestRailReport;
    deleteId: string;
    reportById: TestRailReport;
    detailedReport: ReportsList;
    reports: TestRailReport;
    reportsList: ReportsList[];
    latestReportData: ReportsList;
    responseMessages: string[];
    errorMessage: string;
    constructor(public reportId: string) { }
}

export class LoadReportByIdTriggered implements Action {
    type = ReportActionTypes.LoadReportByIdTriggered;
    report: TestRailReport;
    reportId: string;
    searchReportSuccess: ReportsList[];
    shareReport: ShareReport;
    reportShared: boolean;
    deleteReport: TestRailReport;
    deleteId: string;
    reportById: TestRailReport;
    detailedReport: ReportsList;
    reports: TestRailReport;
    reportsList: ReportsList[];
    latestReportData: ReportsList;
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchReport: TestRailReport) { }
}

export class LoadReportByIdCompleted implements Action {
    type = ReportActionTypes.LoadReportByIdCompleted;
    report: TestRailReport;
    reportId: string;
    searchReport: TestRailReport;
    shareReport: ShareReport;
    reportShared: boolean;
    deleteReport: TestRailReport;
    deleteId: string;
    reportById: TestRailReport;
    detailedReport: ReportsList;
    reports: TestRailReport;
    reportsList: ReportsList[];
    latestReportData: ReportsList;
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchReportSuccess: ReportsList[]) { }
}

export class LoadDetailedReportTriggered implements Action {
    type = ReportActionTypes.LoadDetailedReportTriggered;
    reportId: string;
    searchReport: TestRailReport;
    searchReportSuccess: ReportsList[];
    shareReport: ShareReport;
    reportShared: boolean;
    deleteReport: TestRailReport;
    deleteId: string;
    detailedReport: ReportsList;
    reports: TestRailReport;
    reportsList: ReportsList[];
    latestReportData: ReportsList;
    responseMessages: string[];
    errorMessage: string;
    constructor(public reportById: TestRailReport) { }
}

export class LoadDetailedReportCompleted implements Action {
    type = ReportActionTypes.LoadDetailedReportCompleted;
    reportId: string;
    searchReport: TestRailReport;
    searchReportSuccess: ReportsList[];
    shareReport: ShareReport;
    reportShared: boolean;
    deleteReport: TestRailReport;
    deleteId: string;
    reportById: TestRailReport;
    reports: TestRailReport;
    reportsList: ReportsList[];
    latestReportData: ReportsList;
    responseMessages: string[];
    errorMessage: string;
    constructor(public detailedReport: ReportsList) { }
}

export class LoadShareReportTriggered implements Action {
    type = ReportActionTypes.LoadShareReportTriggered;
    reportId: string;
    searchReport: TestRailReport;
    searchReportSuccess: ReportsList[];
    reportShared: boolean;
    deleteReport: TestRailReport;
    deleteId: string;
    reportById: TestRailReport;
    detailedReport: ReportsList;
    reports: TestRailReport;
    reportsList: ReportsList[];
    latestReportData: ReportsList;
    responseMessages: string[];
    errorMessage: string;
    constructor(public shareReport: ShareReport) { }
}

export class LoadShareReportCompleted implements Action {
    type = ReportActionTypes.LoadShareReportCompleted;
    reportId: string;
    searchReport: TestRailReport;
    searchReportSuccess: ReportsList[];
    shareReport: ShareReport;
    deleteReport: TestRailReport;
    deleteId: string;
    reportById: TestRailReport;
    detailedReport: ReportsList;
    reports: TestRailReport;
    reportsList: ReportsList[];
    latestReportData: ReportsList;
    responseMessages: string[];
    errorMessage: string;
    constructor(public reportShared: boolean) { }
}

export class LoadReportDeleteTriggered implements Action {
    type = ReportActionTypes.LoadReportDeleteTriggered;
    report: TestRailReport;
    reportId: string;
    searchReport: TestRailReport;
    searchReportSuccess: ReportsList[];
    shareReport: ShareReport;
    reportShared: boolean;
    deleteId: string;
    reportById: TestRailReport;
    detailedReport: ReportsList;
    reports: TestRailReport;
    reportsList: ReportsList[];
    latestReportData: ReportsList;
    responseMessages: string[];
    errorMessage: string;
    constructor(public deleteReport: TestRailReport) { }
}

export class LoadReportDeleteCompleted implements Action {
    type = ReportActionTypes.LoadReportDeleteCompleted;
    report: TestRailReport;
    reportId: string;
    searchReport: TestRailReport;
    searchReportSuccess: ReportsList[];
    shareReport: ShareReport;
    reportShared: boolean;
    deleteReport: TestRailReport;
    reportById: TestRailReport;
    detailedReport: ReportsList;
    reports: TestRailReport;
    reportsList: ReportsList[];
    latestReportData: ReportsList;
    responseMessages: string[];
    errorMessage: string;
    constructor(public deleteId: string) { }
}

export class LoadReportListTriggered implements Action {
    type = ReportActionTypes.LoadReportListTriggered;
    report: TestRailReport;
    reportId: string;
    searchReport: TestRailReport;
    searchReportSuccess: ReportsList[];
    shareReport: ShareReport;
    reportShared: boolean;
    deleteReport: TestRailReport;
    deleteId: string;
    reportById: TestRailReport;
    detailedReport: ReportsList;
    reportsList: ReportsList[];
    latestReportData: ReportsList;
    responseMessages: string[];
    errorMessage: string;
    constructor(public reports: TestRailReport) { }
}

export class LoadReportListCompleted implements Action {
    type = ReportActionTypes.LoadReportListCompleted;
    report: TestRailReport;
    reportId: string;
    searchReport: TestRailReport;
    searchReportSuccess: ReportsList[];
    shareReport: ShareReport;
    reportShared: boolean;
    deleteReport: TestRailReport;
    deleteId: string;
    reportById: TestRailReport;
    detailedReport: ReportsList;
    reports: TestRailReport;
    latestReportData: ReportsList;
    responseMessages: string[];
    errorMessage: string;
    constructor(public reportsList: ReportsList[]) { }
}

export class RefreshReportsList implements Action {
    type = ReportActionTypes.RefreshReportsList;
    report: TestRailReport;
    reportId: string;
    searchReport: TestRailReport;
    searchReportSuccess: ReportsList[];
    shareReport: ShareReport;
    reportShared: boolean;
    deleteReport: TestRailReport;
    deleteId: string;
    reportById: TestRailReport;
    detailedReport: ReportsList;
    reports: TestRailReport;
    reportsList: ReportsList[];
    responseMessages: string[];
    errorMessage: string;
    constructor(public latestReportData: ReportsList) { }
}

export class ReportFailed implements Action {
    type = ReportActionTypes.ReportFailed;
    report: TestRailReport;
    reportId: string;
    searchReport: TestRailReport;
    searchReportSuccess: ReportsList[];
    shareReport: ShareReport;
    reportShared: boolean;
    deleteReport: TestRailReport;
    deleteId: string;
    reportById: TestRailReport;
    detailedReport: ReportsList;
    reports: TestRailReport;
    reportsList: ReportsList[];
    latestReportData: ReportsList;
    errorMessage: string;
    constructor(public responseMessages: string[]) { }
}

export class ReportException implements Action {
    type = ReportActionTypes.ReportException;
    report: TestRailReport;
    reportId: string;
    searchReport: TestRailReport;
    searchReportSuccess: ReportsList[];
    shareReport: ShareReport;
    reportShared: boolean;
    deleteReport: TestRailReport;
    deleteId: string;
    reportById: TestRailReport;
    detailedReport: ReportsList;
    reports: TestRailReport;
    reportsList: ReportsList[];
    latestReportData: ReportsList;
    responseMessages: string[];
    constructor(public errorMessage: string) { }
}

export type ReportActions = LoadReportTriggered | LoadReportCompleted | LoadReportByIdTriggered | LoadReportByIdCompleted | LoadDetailedReportTriggered | LoadDetailedReportCompleted | LoadShareReportTriggered | LoadShareReportCompleted | LoadReportDeleteTriggered | LoadReportDeleteCompleted | LoadReportListTriggered | LoadReportListCompleted | RefreshReportsList | ReportFailed | ReportException