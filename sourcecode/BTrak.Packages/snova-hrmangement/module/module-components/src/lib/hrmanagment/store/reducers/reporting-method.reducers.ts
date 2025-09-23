import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { ReportingMethodDetailsModel } from  '../../models/repoting-method-details-model';
import {ReportingMethodSearchModel} from '../../models/repoting-method-search-model';
import { ReportingMethodDetailsActionTypes, ReportingMethodDetailsActions } from "../actions/reporting-method.actions";


export interface State extends EntityState<ReportingMethodDetailsModel> {
    loadingReportingMethodDetails: boolean;
    loadingReportingMethodDetailsById: boolean;
    reportingMethodDetailsList: ReportingMethodDetailsModel[];
    reportingMethodDetail: ReportingMethodDetailsModel;
    reportingMethodDetailId: string;
    exceptionMessage: string;
}

export const ReportingMethodDetailsAdapter: EntityAdapter<
ReportingMethodDetailsModel
> = createEntityAdapter<ReportingMethodDetailsModel>({
    selectId: (ReportingMethodDetailsModel: ReportingMethodDetailsModel) => ReportingMethodDetailsModel.reportingMethodId
});

export const initialState: State = ReportingMethodDetailsAdapter.getInitialState({
    loadingReportingMethodDetails: false,
    loadingReportingMethodDetailsById: false,
    reportingMethodDetailsList: null,
    reportingMethodDetail: null,
    reportingMethodDetailId: '',
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: ReportingMethodDetailsActions
): State {
    switch (action.type) {
        case ReportingMethodDetailsActionTypes.LoadReportingMethodDetailsTriggered:
            return { ...state, loadingReportingMethodDetails: true };
        case ReportingMethodDetailsActionTypes.LoadReportingMethodDetailsCompleted:
            return ReportingMethodDetailsAdapter.addAll(action.reportingMethodDetailsList, {
                ...state,
                loadingReportingMethodDetails: false, ReportingMethodDetailsList: action.reportingMethodDetailsList
            });
        case ReportingMethodDetailsActionTypes.ExceptionHandled:
            return { ...state, loadingReportingMethodDetails: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}