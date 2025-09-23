import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { ShareReport } from '../../dependencies/models/reports-list';
import { AuditReport } from '../../models/audit-report.model';

export enum AuditReportActionTypes {
    LoadReportTriggered = '[SnovaAuditsModule Audit Report Component] Initial Report Load Triggered',
    LoadReportCompleted = '[SnovaAuditsModule Audit Report Component] Initial Report Load Completed',
    LoadReportByIdTriggered = '[SnovaAuditsModule Audit Report Component] Initial Report By Id Load Triggered',
    LoadReportByIdCompleted = '[SnovaAuditsModule Audit Report Component] Initial Report By Id Load Completed',
    LoadDetailedReportTriggered = '[SnovaAuditsModule Audit Report Component] Initial Detailed Report Load Triggered',
    LoadDetailedReportCompleted = '[SnovaAuditsModule Audit Report Component] Initial Detailed Report Load Completed',
    LoadShareReportTriggered = '[SnovaAuditsModule Audit Report Component] Initial Share Report Load Triggered',
    LoadShareReportCompleted = '[SnovaAuditsModule Audit Report Component] Initial Share Report Load Completed',
    LoadReportDeleteTriggered = '[SnovaAuditsModule Audit Report Component] Initial Report Load Delete Triggered',
    LoadReportDeleteCompleted = '[SnovaAuditsModule Audit Report Component] Initial Report Load Delete Completed',
    LoadReportListTriggered = '[SnovaAuditsModule Audit Report Component] Initial Report List Load Triggered',
    LoadReportListCompleted = '[SnovaAuditsModule Audit Report Component] Initial Report List Load Completed',
    RefreshReportsList = '[SnovaAuditsModule Audit Report Component] Initial Report Refresh List Load Completed',
    ReportFailed = '[SnovaAuditsModule Audit Report Component] Report Load Failed',
    ReportException = '[SnovaAuditsModule Audit Report Component] Report Exception Handled'
}

export class LoadReportTriggered implements Action {
    type = AuditReportActionTypes.LoadReportTriggered;
    reportId: string;
    searchReport: AuditReport;
    searchReportSuccess: AuditReport[];
    shareReport: ShareReport;
    reportShared: boolean;
    deleteReport: AuditReport;
    deleteId: string;
    reportById: AuditReport;
    detailedReport: AuditReport;
    reports: AuditReport;
    reportsList: AuditReport[];
    latestReportData: AuditReport;
    responseMessages: string[];
    errorMessage: string;
    constructor(public report: AuditReport) { }
}

export class LoadReportCompleted implements Action {
    type = AuditReportActionTypes.LoadReportCompleted;
    report: AuditReport;
    searchReport: AuditReport;
    searchReportSuccess: AuditReport[];
    shareReport: ShareReport;
    reportShared: boolean;
    deleteReport: AuditReport;
    deleteId: string;
    reportById: AuditReport;
    detailedReport: AuditReport;
    reports: AuditReport;
    reportsList: AuditReport[];
    latestReportData: AuditReport;
    responseMessages: string[];
    errorMessage: string;
    constructor(public reportId: string) { }
}

export class LoadReportByIdTriggered implements Action {
    type = AuditReportActionTypes.LoadReportByIdTriggered;
    report: AuditReport;
    reportId: string;
    searchReportSuccess: AuditReport[];
    shareReport: ShareReport;
    reportShared: boolean;
    deleteReport: AuditReport;
    deleteId: string;
    reportById: AuditReport;
    detailedReport: AuditReport;
    reports: AuditReport;
    reportsList: AuditReport[];
    latestReportData: AuditReport;
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchReport: AuditReport) { }
}

export class LoadReportByIdCompleted implements Action {
    type = AuditReportActionTypes.LoadReportByIdCompleted;
    report: AuditReport;
    reportId: string;
    searchReport: AuditReport;
    shareReport: ShareReport;
    reportShared: boolean;
    deleteReport: AuditReport;
    deleteId: string;
    reportById: AuditReport;
    detailedReport: AuditReport;
    reports: AuditReport;
    reportsList: AuditReport[];
    latestReportData: AuditReport;
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchReportSuccess: AuditReport[]) { }
}

export class LoadDetailedReportTriggered implements Action {
    type = AuditReportActionTypes.LoadDetailedReportTriggered;
    reportId: string;
    searchReport: AuditReport;
    searchReportSuccess: AuditReport[];
    shareReport: ShareReport;
    reportShared: boolean;
    deleteReport: AuditReport;
    deleteId: string;
    detailedReport: AuditReport;
    reports: AuditReport;
    reportsList: AuditReport[];
    latestReportData: AuditReport;
    responseMessages: string[];
    errorMessage: string;
    constructor(public reportById: AuditReport) { }
}

export class LoadDetailedReportCompleted implements Action {
    type = AuditReportActionTypes.LoadDetailedReportCompleted;
    reportId: string;
    searchReport: AuditReport;
    searchReportSuccess: AuditReport[];
    shareReport: ShareReport;
    reportShared: boolean;
    deleteReport: AuditReport;
    deleteId: string;
    reportById: AuditReport;
    reports: AuditReport;
    reportsList: AuditReport[];
    latestReportData: AuditReport;
    responseMessages: string[];
    errorMessage: string;
    constructor(public detailedReport: AuditReport) { }
}

export class LoadShareReportTriggered implements Action {
    type = AuditReportActionTypes.LoadShareReportTriggered;
    reportId: string;
    searchReport: AuditReport;
    searchReportSuccess: AuditReport[];
    reportShared: boolean;
    deleteReport: AuditReport;
    deleteId: string;
    reportById: AuditReport;
    detailedReport: AuditReport;
    reports: AuditReport;
    reportsList: AuditReport[];
    latestReportData: AuditReport;
    responseMessages: string[];
    errorMessage: string;
    constructor(public shareReport: ShareReport) { }
}

export class LoadShareReportCompleted implements Action {
    type = AuditReportActionTypes.LoadShareReportCompleted;
    reportId: string;
    searchReport: AuditReport;
    searchReportSuccess: AuditReport[];
    shareReport: ShareReport;
    deleteReport: AuditReport;
    deleteId: string;
    reportById: AuditReport;
    detailedReport: AuditReport;
    reports: AuditReport;
    reportsList: AuditReport[];
    latestReportData: AuditReport;
    responseMessages: string[];
    errorMessage: string;
    constructor(public reportShared: boolean) { }
}

export class LoadReportDeleteTriggered implements Action {
    type = AuditReportActionTypes.LoadReportDeleteTriggered;
    report: AuditReport;
    reportId: string;
    searchReport: AuditReport;
    searchReportSuccess: AuditReport[];
    shareReport: ShareReport;
    reportShared: boolean;
    deleteId: string;
    reportById: AuditReport;
    detailedReport: AuditReport;
    reports: AuditReport;
    reportsList: AuditReport[];
    latestReportData: AuditReport;
    responseMessages: string[];
    errorMessage: string;
    constructor(public deleteReport: AuditReport) { }
}

export class LoadReportDeleteCompleted implements Action {
    type = AuditReportActionTypes.LoadReportDeleteCompleted;
    report: AuditReport;
    reportId: string;
    searchReport: AuditReport;
    searchReportSuccess: AuditReport[];
    shareReport: ShareReport;
    reportShared: boolean;
    deleteReport: AuditReport;
    reportById: AuditReport;
    detailedReport: AuditReport;
    reports: AuditReport;
    reportsList: AuditReport[];
    latestReportData: AuditReport;
    responseMessages: string[];
    errorMessage: string;
    constructor(public deleteId: string) { }
}

export class LoadReportListTriggered implements Action {
    type = AuditReportActionTypes.LoadReportListTriggered;
    report: AuditReport;
    reportId: string;
    searchReport: AuditReport;
    searchReportSuccess: AuditReport[];
    shareReport: ShareReport;
    reportShared: boolean;
    deleteReport: AuditReport;
    deleteId: string;
    reportById: AuditReport;
    detailedReport: AuditReport;
    reportsList: AuditReport[];
    latestReportData: AuditReport;
    responseMessages: string[];
    errorMessage: string;
    constructor(public reports: AuditReport) { }
}

export class LoadReportListCompleted implements Action {
    type = AuditReportActionTypes.LoadReportListCompleted;
    report: AuditReport;
    reportId: string;
    searchReport: AuditReport;
    searchReportSuccess: AuditReport[];
    shareReport: ShareReport;
    reportShared: boolean;
    deleteReport: AuditReport;
    deleteId: string;
    reportById: AuditReport;
    detailedReport: AuditReport;
    reports: AuditReport;
    latestReportData: AuditReport;
    responseMessages: string[];
    errorMessage: string;
    constructor(public reportsList: AuditReport[]) { }
}

export class RefreshReportsList implements Action {
    type = AuditReportActionTypes.RefreshReportsList;
    report: AuditReport;
    reportId: string;
    searchReport: AuditReport;
    searchReportSuccess: AuditReport[];
    shareReport: ShareReport;
    reportShared: boolean;
    deleteReport: AuditReport;
    deleteId: string;
    reportById: AuditReport;
    detailedReport: AuditReport;
    reports: AuditReport;
    reportsList: AuditReport[];
    responseMessages: string[];
    errorMessage: string;
    constructor(public latestReportData: AuditReport) { }
}

export class ReportFailed implements Action {
    type = AuditReportActionTypes.ReportFailed;
    report: AuditReport;
    reportId: string;
    searchReport: AuditReport;
    searchReportSuccess: AuditReport[];
    shareReport: ShareReport;
    reportShared: boolean;
    deleteReport: AuditReport;
    deleteId: string;
    reportById: AuditReport;
    detailedReport: AuditReport;
    reports: AuditReport;
    reportsList: AuditReport[];
    latestReportData: AuditReport;
    errorMessage: string;
    constructor(public responseMessages: string[]) { }
}

export class ReportException implements Action {
    type = AuditReportActionTypes.ReportException;
    report: AuditReport;
    reportId: string;
    searchReport: AuditReport;
    searchReportSuccess: AuditReport[];
    shareReport: ShareReport;
    reportShared: boolean;
    deleteReport: AuditReport;
    deleteId: string;
    reportById: AuditReport;
    detailedReport: AuditReport;
    reports: AuditReport;
    reportsList: AuditReport[];
    latestReportData: AuditReport;
    responseMessages: string[];
    constructor(public errorMessage: string) { }
}

export type AuditReportActions = LoadReportTriggered | LoadReportCompleted | LoadReportByIdTriggered | LoadReportByIdCompleted | LoadDetailedReportTriggered | LoadDetailedReportCompleted | LoadShareReportTriggered | LoadShareReportCompleted | LoadReportDeleteTriggered | LoadReportDeleteCompleted | LoadReportListTriggered | LoadReportListCompleted | RefreshReportsList | ReportFailed | ReportException