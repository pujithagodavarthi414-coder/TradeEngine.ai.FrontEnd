import { Action } from '@ngrx/store';
import { ProjectList } from '../../models/projectlist';

export enum TestRailProjectsActionTypes {
    LoadProjectsTriggered = '[Snovasys-TM] [Test rail Component] Initial Data Load Triggered',
    LoadProjectsCompleted = '[Snovasys-TM] [Test rail Component] Initial Data Load Completed',
    LoadProjectRelatedCountsTriggered = '[Snovasys-TM] [Test rail Component] Initial Project Related Counts Data Load Triggered',
    LoadProjectRelatedCountsCompleted = '[Snovasys-TM] [Test rail Component] Initial Project Related Counts Data Load Completed'
}

export class LoadProjectsTriggered implements Action {
    type = TestRailProjectsActionTypes.LoadProjectsTriggered;
    projectsList: ProjectList[];
    public projectId: string;
    public projectData: ProjectList;
    constructor(public getTestrailProjectsInputModel: ProjectList) { }
}

export class LoadProjectsCompleted implements Action {
    type = TestRailProjectsActionTypes.LoadProjectsCompleted;
    public projectId: string;
    public projectData: ProjectList;
    public getTestrailProjectsInputModel: ProjectList;
    constructor(public projectsList: ProjectList[]) { }
}

export class LoadProjectRelatedCountsTriggered implements Action {
    type = TestRailProjectsActionTypes.LoadProjectRelatedCountsTriggered;
    projectsList: ProjectList[];
    public projectData: ProjectList;
    public getTestrailProjectsInputModel: ProjectList;;
    constructor(public projectId: string) { }
}

export class LoadProjectRelatedCountsCompleted implements Action {
    type = TestRailProjectsActionTypes.LoadProjectRelatedCountsCompleted;
    projectsList: ProjectList[];
    public projectId: string;
    public getTestrailProjectsInputModel: ProjectList;;
    constructor(public projectData: ProjectList) { }
}

export type TestRailProjectsActions = LoadProjectsTriggered | LoadProjectsCompleted | LoadProjectRelatedCountsTriggered | LoadProjectRelatedCountsCompleted