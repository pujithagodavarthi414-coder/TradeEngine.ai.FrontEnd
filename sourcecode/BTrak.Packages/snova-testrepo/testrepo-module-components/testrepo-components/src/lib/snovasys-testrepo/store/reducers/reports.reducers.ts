import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { ReportActions, ReportActionTypes } from '../actions/reports.actions';
import { ReportsList } from '../../models/reports-list';

export interface State extends EntityState<ReportsList> {
    loadingReport: boolean;
    loadingReportDelete: boolean;
    loadingReportList: boolean;
    loadingDetailedReport: boolean;
    loadingShareReport: boolean;
    ReportsList: ReportsList[];
    DetailedReport: ReportsList;
}

export const reportAdapter: EntityAdapter<ReportsList> = createEntityAdapter<ReportsList>({
    selectId: (report: ReportsList) => report.testRailReportId,
    sortComparer: (reportAsc: ReportsList, reportDesc: ReportsList) => reportDesc.createdDateTime.toString().localeCompare(reportAsc.createdDateTime.toString())
});

export const initialState: State = reportAdapter.getInitialState({
    loadingReport: false,
    loadingReportDelete: false,
    loadingReportList: false,
    loadingDetailedReport: false,
    loadingShareReport: false,
    ReportsList: null,
    DetailedReport: null
});

export function reducer(
    state: State = initialState,
    action: ReportActions
): State {
    switch (action.type) {
        case ReportActionTypes.LoadReportTriggered:
            return { ...state, loadingReport: true };
        case ReportActionTypes.LoadReportCompleted:
            return { ...state, loadingReport: false };
        case ReportActionTypes.LoadShareReportTriggered:
            return { ...state, loadingShareReport: true };
        case ReportActionTypes.LoadShareReportCompleted:
            return { ...state, loadingShareReport: false };
        case ReportActionTypes.LoadReportDeleteTriggered:
            return { ...state, loadingReportDelete: true };
        case ReportActionTypes.LoadReportDeleteCompleted:
            return reportAdapter.removeOne(action.deleteId, state);
        case ReportActionTypes.LoadReportListTriggered:
            return { ...state, loadingReportList: true };
        case ReportActionTypes.LoadReportListCompleted:
            return reportAdapter.addAll(action.reportsList, {
                ...state,
                loadingReportList: false
            });
        case ReportActionTypes.RefreshReportsList:
            return reportAdapter.upsertOne(action.latestReportData, state);
        case ReportActionTypes.LoadDetailedReportTriggered:
            return { ...state, loadingDetailedReport: true };
        case ReportActionTypes.LoadDetailedReportCompleted:
            return { ...state, loadingDetailedReport: false, DetailedReport: action.detailedReport };
        default:
            return state;
    }
}