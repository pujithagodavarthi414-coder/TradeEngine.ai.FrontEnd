import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { TestRailProjectsActions, TestRailProjectsActionTypes } from '../actions/testrailprojects.actions';
import { ProjectList } from '../../models/projectlist'

export interface State extends EntityState<ProjectList> {
    loadingTestRailProjects: boolean;
    loadingProjectRelatedData: boolean;
    TestRailProjects: ProjectList[];
    ProjectRelatedData: ProjectList;
    projectName: string;
    projectResponsiblePersonName: string;
    testSuiteCount: number;
    openTestRunCount: number;
    openMilestoneCount: number;
    reportCount: number;
}

export const testRailAdapter: EntityAdapter<ProjectList> = createEntityAdapter<ProjectList>({
    selectId: (project: ProjectList) => project.projectId
});

export const initialState: State = testRailAdapter.getInitialState({
    loadingTestRailProjects: false,
    loadingProjectRelatedData: false,
    TestRailProjects: null,
    ProjectRelatedData: null,
    projectName: null,
    projectResponsiblePersonName: null,
    testSuiteCount: -1,
    openTestRunCount: -1,
    openMilestoneCount: -1,
    reportCount: -1
});

export function reducer(
    state: State = initialState,
    action: TestRailProjectsActions
): State {
    switch (action.type) {
        case TestRailProjectsActionTypes.LoadProjectsTriggered:
            return { ...state, loadingTestRailProjects: true };
        case TestRailProjectsActionTypes.LoadProjectsCompleted:
            return testRailAdapter.addAll(action.projectsList, {
                ...state,
                loadingTestRailProjects: false
            });
        // return { ...state, TestRailProjects: action.projectsList};
        case TestRailProjectsActionTypes.LoadProjectRelatedCountsTriggered:
            return { ...state, loadingProjectRelatedData: true };
        case TestRailProjectsActionTypes.LoadProjectRelatedCountsCompleted:
            return {
                ...state,
                loadingProjectRelatedData: false,
                ProjectRelatedData: (action as TestRailProjectsActions).projectData,
                testSuiteCount: (action as TestRailProjectsActions).projectData ? (action as TestRailProjectsActions).projectData.testSuiteCount : -1,
                openTestRunCount: (action as TestRailProjectsActions).projectData ? (action as TestRailProjectsActions).projectData.testRunCount : -1,
                openMilestoneCount: (action as TestRailProjectsActions).projectData ? (action as TestRailProjectsActions).projectData.milestoneCount : -1,
                reportCount: (action as TestRailProjectsActions).projectData ? (action as TestRailProjectsActions).projectData.reportCount : -1,
                projectName: (action as TestRailProjectsActions).projectData ? (action as TestRailProjectsActions).projectData.projectName : null,
                projectResponsiblePersonName: (action as TestRailProjectsActions).projectData ? (action as TestRailProjectsActions).projectData.projectResponsiblePersonName : null
            };
        default:
            return state;
    }
}