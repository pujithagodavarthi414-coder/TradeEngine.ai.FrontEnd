import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { TestCaseTemplateActions, TestCaseTemplateActionTypes } from '../actions/testcasetemplates.actions';
import { TestCaseDropdownList } from '../../models/testcasedropdown';

export interface State extends EntityState<TestCaseDropdownList>{
    loadingTestCaseTemplates: boolean;
    TestCaseTemplateList: TestCaseDropdownList[];
}

export const testCaseTemplateAdapter: EntityAdapter<TestCaseDropdownList> = createEntityAdapter<TestCaseDropdownList>({
    selectId: (testCaseTemplate: TestCaseDropdownList) => testCaseTemplate.id
});

export const initialState: State = testCaseTemplateAdapter.getInitialState({
    loadingTestCaseTemplates: false,
    TestCaseTemplateList: null
});

export function reducer(
    state: State = initialState,
    action: TestCaseTemplateActions
): State {
    switch (action.type) {
        case TestCaseTemplateActionTypes.LoadTestCaseTemplateListTriggered:
            return { ...state, loadingTestCaseTemplates: true };
        case TestCaseTemplateActionTypes.LoadTestCaseTemplateListCompleted:
            return testCaseTemplateAdapter.addAll(action.testCaseTemplateList, {
                ...state,
                loadingTestCaseTemplates: false
            });
        case TestCaseTemplateActionTypes.LoadTestCaseTemplateListFromCache:
            return { ...state, loadingTestCaseTemplates: false };
        default:
            return state;
    }
}