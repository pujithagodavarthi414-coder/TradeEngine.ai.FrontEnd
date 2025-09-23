import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { AuditReportActions, AuditReportActionTypes } from '../actions/audit-report.actions';
import { AuditReport } from '../../models/audit-report.model';

export interface State extends EntityState<AuditReport> {
    loadingReport: boolean;
    loadingReportDelete: boolean;
    loadingReportList: boolean;
    loadingDetailedReport: boolean;
    loadingShareReport: boolean;
    AuditReport: AuditReport[];
    detailedReport: AuditReport;
}

export const auditReportAdapter: EntityAdapter<AuditReport> = createEntityAdapter<AuditReport>({
    selectId: (report: AuditReport) => report.auditReportId,
    sortComparer: (reportAsc: AuditReport, reportDesc: AuditReport) => reportDesc.createdDateTime.toString().localeCompare(reportAsc.createdDateTime.toString())
});

export const initialState: State = auditReportAdapter.getInitialState({
    loadingReport: false,
    loadingReportDelete: false,
    loadingReportList: false,
    loadingDetailedReport: false,
    loadingShareReport: false,
    AuditReport: null,
    detailedReport: null
});

export function reducer(
    state: State = initialState,
    action: AuditReportActions
): State {
    switch (action.type) {
        case AuditReportActionTypes.LoadReportTriggered:
            return { ...state, loadingReport: true };
        case AuditReportActionTypes.LoadReportCompleted:
            return { ...state, loadingReport: false };
        case AuditReportActionTypes.LoadReportByIdTriggered:
            return { ...state, loadingReport: true };
        case AuditReportActionTypes.LoadReportByIdCompleted:
            return { ...state, loadingReport: false };
        case AuditReportActionTypes.LoadReportDeleteCompleted:
            return auditReportAdapter.removeOne(action.deleteId, state);
        case AuditReportActionTypes.LoadReportListTriggered:
            return { ...state, loadingReportList: true };
        case AuditReportActionTypes.LoadReportListCompleted:
            return auditReportAdapter.addAll(action.reportsList, {
                ...state,
                loadingReportList: false
            });
        case AuditReportActionTypes.RefreshReportsList:
            return auditReportAdapter.upsertOne(action.latestReportData, state);
        case AuditReportActionTypes.LoadDetailedReportTriggered:
            return { ...state, loadingDetailedReport: true };
        case AuditReportActionTypes.LoadDetailedReportCompleted:
            return { ...state, loadingDetailedReport: false, detailedReport: action.detailedReport };
        case AuditReportActionTypes.ReportFailed:
            return { ...state, loadingReport: false, loadingReportList: false, loadingDetailedReport: false };
        case AuditReportActionTypes.ReportException:
            return { ...state, loadingReport: false, loadingReportList: false, loadingDetailedReport: false }
        default:
            return state;
    }
}