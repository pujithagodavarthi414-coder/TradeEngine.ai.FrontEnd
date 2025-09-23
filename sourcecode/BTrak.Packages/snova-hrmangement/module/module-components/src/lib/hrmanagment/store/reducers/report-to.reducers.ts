import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { ReportToDetailsModel } from '../../models/report-to-details-model';
import { ReportToActionTypes, ReportToActions } from '../actions/report-to.actions';

export interface State extends EntityState<ReportToDetailsModel> {
    loadingReportTo: boolean;
    creatingReportTo: boolean;
    ReportToDetailId: string;
    createReportToErrors: string[];
    loadreportToErrors: string[];
    gettingReportToById: boolean;
    employeeReportToData: ReportToDetailsModel;
    exceptionMessage: string;
}

export const ReportToAdapter: EntityAdapter<
    ReportToDetailsModel
> = createEntityAdapter<ReportToDetailsModel>({
    selectId: (reportToList: ReportToDetailsModel) => reportToList.employeeReportToId
});

export const initialState: State = ReportToAdapter.getInitialState({
    loadingReportTo: false,
    creatingReportTo: false,
    ReportToDetailId: '',
    createReportToErrors: [''],
    loadreportToErrors: [''],
    gettingReportToById: false,
    employeeReportToData: null,
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: ReportToActions
): State {
    switch (action.type) {
        case ReportToActionTypes.LoadReportToTriggered:
            return { ...state, loadingReportTo: true };
        case ReportToActionTypes.LoadReportToCompleted:
            return ReportToAdapter.addAll(action.reportToList, {
                ...state,
                loadingReportTo: false
            });
            case ReportToActionTypes.loadReportToFailed:
                return { ...state, loadingReportTo: false, loadreportToErrors: action.validationMessages };
        case ReportToActionTypes.CreateReportToTriggered:
            return { ...state, creatingReportTo: true };
        case ReportToActionTypes.CreateReportToCompleted:
            return { ...state, creatingReportTo: false, ReportToDetailId: action.reportToDetailId };
        case ReportToActionTypes.DeleteReportToCompleted:
            return ReportToAdapter.removeOne(action.reportToDetailId,{ ...state, creatingReportTo: false});
        case ReportToActionTypes.CreateReportToFailed:
            return { ...state, creatingReportTo: false, createReportToErrors: action.validationMessages };
        case ReportToActionTypes.GetReportToByIdTriggered:
            return { ...state, gettingReportToById: true };
        case ReportToActionTypes.GetReportToByIdCompleted:
            return { ...state, gettingReportToById: false, employeeReportToData: action.reportTodetails };
        case ReportToActionTypes.CreateReportToCompletedWithInPlaceUpdate:
            return ReportToAdapter.updateOne(action.reportToUpdates.reportToUpdate, state);
        case ReportToActionTypes.RefreshReports:
            return ReportToAdapter.upsertOne(action.reportTodetails, state);
        case ReportToActionTypes.ExceptionHandled:
            return { ...state, loadingReportTo: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}