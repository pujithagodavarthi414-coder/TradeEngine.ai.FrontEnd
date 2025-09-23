import { Action } from "@ngrx/store";
import { DashboardList } from "../../models/dashboardList";

export enum DashboardsActionTypes {
    LoadDashboardsTriggered = "[Dashboard List Component] Initial Dashboards List Load Triggered",
    LoadDashboardsCompleted = "[Dashboard List Component] Initial Dashboards List Load Completed",
    LoadDashboardsListTriggered = "[Dashboard List Component] Initial Dashboards List  Triggered",
    LoadDashboardsListCompleted = "[Dashboard List Component] Initial Dashboards List Completed",
    DashboardFailed = "[Dashboard List Component] Dashboard List Load Failed",
    DashboardException = "[Dashboard List Component] Dashboard List Exception Handled"
}

export class LoadDashboardsTriggered implements Action {
    type = DashboardsActionTypes.LoadDashboardsTriggered;
    Dashboards: DashboardList;
    searchDashboardsSuccess: DashboardList[];
    searchDashboard: DashboardList;
    DashboardsList: DashboardList;
    DashboardList: DashboardList[];
    responseMessages: string[];
    errorMessage: string;
    constructor() { }
}

// tslint:disable-next-line: max-classes-per-file
export class LoadDashboardsCompleted implements Action {
    type = DashboardsActionTypes.LoadDashboardsCompleted;
    Dashboards: DashboardList;
    searchDashboardsSuccess: DashboardList[];
    searchDashboard: DashboardList;
    DashboardsList: DashboardList;
    DashboardList: DashboardList[];
    responseMessages: string[];
    errorMessage: string;
    constructor() { }
}

// tslint:disable-next-line: max-classes-per-file
export class LoadDashboardsListTriggered implements Action {
    type = DashboardsActionTypes.LoadDashboardsListTriggered;
    Dashboards: DashboardList;
    searchDashboardsSuccess: DashboardList[];
    searchDashboard: DashboardList;
    DashboardList: DashboardList[];
    responseMessages: string[];
    errorMessage: string;
    constructor(public DashboardsList: DashboardList) { }
}

// tslint:disable-next-line: max-classes-per-file
export class LoadDashboardsListCompleted implements Action {
    type = DashboardsActionTypes.LoadDashboardsListCompleted;
    Dashboards: DashboardList;
    searchDashboardsSuccess: DashboardList[];
    searchDashboard: DashboardList;
    DashboardsList: DashboardList;
    responseMessages: string[];
    errorMessage: string;
    constructor(public DashboardList: DashboardList[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class DashboardFailed implements Action {
    type = DashboardsActionTypes.DashboardFailed;
    Dashboards: DashboardList;
    searchDashboardsSuccess: DashboardList[];
    searchDashboard: DashboardList;
    DashboardsList: DashboardList;
    DashboardList: DashboardList[];
    errorMessage: string;
    constructor(public responseMessages: string[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class DashboardException implements Action {
    type = DashboardsActionTypes.DashboardException;
    Dashboards: DashboardList;
    searchDashboardsSuccess: DashboardList[];
    searchDashboard: DashboardList;
    DashboardsList: DashboardList;
    DashboardList: DashboardList[];
    responseMessages: string[];
    constructor(public errorMessage: string) { }
}

// tslint:disable-next-line: max-line-length
export type DashboardActions = LoadDashboardsTriggered | LoadDashboardsCompleted | LoadDashboardsListTriggered | LoadDashboardsListCompleted | DashboardFailed | DashboardException
