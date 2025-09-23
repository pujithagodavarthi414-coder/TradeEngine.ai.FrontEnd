import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { JobOpening } from '../../models/jobOpening.model';
import { JobOpeningActions, JobOpeningActionTypes } from '../actions/job-opening.action';

export interface State extends EntityState<JobOpening> {
    loadingJobopeningList: boolean;
    creatingJobOpeningList: boolean;
    jobOpeningData: JobOpening;
    createJobOpeningListErrors: string[];
    exceptionMessage: string;
    jobopeningDetailsById: string;
}

export const JobOpeningAdapter: EntityAdapter<JobOpening> =
    createEntityAdapter<JobOpening>({
    selectId: (jobOpening: JobOpening) => jobOpening.jobOpeningId
});

export const initialState: State = JobOpeningAdapter.getInitialState({
    jobOpeningData: null,
    loadingJobopeningList: false,
    creatingJobOpeningList: false,
    createJobOpeningListErrors: [''],
    exceptionMessage: '',
    jobopeningDetailsById: ''
});

export function reducer(
    state: State = initialState,
    action: JobOpeningActions
): State {
    switch (action.type) {
        case JobOpeningActionTypes.LoadJobOpeningItemsTriggered:
            return { ...state, loadingJobopeningList: true };
        case JobOpeningActionTypes.LoadJobOpeningItemsFromCandidatesTriggered:
            return { ...state, loadingJobopeningList: true };
        case JobOpeningActionTypes.LoadJobOpeningItemsCompleted:
            return JobOpeningAdapter.addAll(action.jobOpening, {
                ...state,
                loadingJobopeningList: false
            });
        case JobOpeningActionTypes.LoadJobOpeningItemsDetailsFailed:
            return { ...state, loadingJobopeningList: false, createJobOpeningListErrors: action.validationMessages };
        case JobOpeningActionTypes.JobOpeningExceptionHandled:
            return { ...state, loadingJobopeningList: false, exceptionMessage: action.errorMessage };
        case JobOpeningActionTypes.CreateJobOpeningItemTriggered:
            return { ...state, creatingJobOpeningList: true };
        case JobOpeningActionTypes.CreateJobOpeningItemCompleted:
            return { ...state, creatingJobOpeningList: false, jobopeningDetailsById: action.jobOpeningId };
        case JobOpeningActionTypes.CreateJobOpeningItemFailed:
            return { ...state, creatingJobOpeningList: false, createJobOpeningListErrors: action.validationMessages };
        default:
            return state;
    }
}
