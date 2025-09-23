import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { JobOpeningStatus } from '../../models/jobOpeningStatus';
import { JobOpeningStatusActionTypes, JobOpeningStatusActions } from '../actions/job-opening-status.actions';

export interface State extends EntityState<JobOpeningStatus> {
    loadingJobOpeningStatus: boolean;
    createJobopeningStatus: boolean;
    createJobOpeningStatusListErrors: string[];
    jobopeningStatusDetailsById: string;
    exceptionMessage: string;
}

export const jobOpeningStatusAdapter: EntityAdapter<
JobOpeningStatus
> = createEntityAdapter<JobOpeningStatus>({
    selectId: (jobOpeningStatus: JobOpeningStatus) => jobOpeningStatus.jobOpeningStatusId
});

export const initialState: State = jobOpeningStatusAdapter.getInitialState({
    loadingJobOpeningStatus: false,
    createJobopeningStatus: false,
    createJobOpeningStatusListErrors: [''],
    jobopeningStatusDetailsById: '',
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: JobOpeningStatusActions
): State {
    switch (action.type) {
        case JobOpeningStatusActionTypes.LoadJobOpeningStatusTriggered:
            return { ...state, loadingJobOpeningStatus: true };
        case JobOpeningStatusActionTypes.LoadJobOpeningStatusCompleted:
            return jobOpeningStatusAdapter.addAll(action.jobOpeningStatusList, {
                ...state, loadingJobOpeningStatus: false
            });
        case JobOpeningStatusActionTypes.LoadJobOpeningStatusFailed:
            return { ...state, loadingJobOpeningStatus: false };
        case JobOpeningStatusActionTypes.ExceptionHandled:
            return { ...state, loadingJobOpeningStatus: false, exceptionMessage: action.errorMessage };
        case JobOpeningStatusActionTypes.CeateJobOpeningStatusTriggered:
            return { ...state, createJobopeningStatus: true };
        case JobOpeningStatusActionTypes.CreateJobOpeningStatusCompleted:
            return { ...state, createJobopeningStatus: false, jobopeningStatusDetailsById: action.jobOppeningStatusId };
        case JobOpeningStatusActionTypes.CreateJobOpeningStatusFailed:
            return { ...state, createJobopeningStatus: false };
        default:
            return state;
    }
}
