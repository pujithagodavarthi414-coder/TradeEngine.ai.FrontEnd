import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { JobCategoryModel } from '../../models/job-category-model';

import { JobCategoryActionTypes, LanguageFluencyActions } from '../actions/job-category.actions';

export interface State extends EntityState<JobCategoryModel> {
    loadingJobCategoryList: boolean;
    getLoadJobCategoryErrors: string[],
    exceptionMessage: string;
}

export const jobCategoryAdapter: EntityAdapter<
    JobCategoryModel
> = createEntityAdapter<JobCategoryModel>({
    selectId: (jobCategoryModel: JobCategoryModel) => jobCategoryModel.jobCategoryId
});

export const initialState: State = jobCategoryAdapter.getInitialState({
    loadingJobCategoryList: false,
    getLoadJobCategoryErrors: [''],
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: LanguageFluencyActions
): State {
    switch (action.type) {
        case JobCategoryActionTypes.LoadJobCategoryTriggered:
            return { ...state, loadingJobCategoryList: true };
        case JobCategoryActionTypes.LoadJobCategoryCompleted:
            return jobCategoryAdapter.addAll(action.jobCategoryList, {
                ...state,
                loadingJobCategoryList: false
            });
        case JobCategoryActionTypes.LoadJobCategoryFailed:
            return { ...state, loadingJobCategoryList: false, getLoadJobCategoryErrors: action.validationMessages };
        case JobCategoryActionTypes.ExceptionHandled:
            return { ...state, loadingJobCategoryList: false, exceptionMessage: action.errorMessage };
        default:
            return state;
    }
}