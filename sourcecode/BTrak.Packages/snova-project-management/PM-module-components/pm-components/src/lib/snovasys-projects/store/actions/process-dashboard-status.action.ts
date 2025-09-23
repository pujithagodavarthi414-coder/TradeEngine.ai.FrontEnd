import { Action } from "@ngrx/store";
import { ValidationModel } from '../../models/validation-messages';

import {processDashboard} from "../../models/processDashboard";

export enum ProcessDashboardStatusActionTypes {
    LoadProcessDashboardStatusTriggered = "[Snovasys-PM][ProcessDashboard Status Component] Intial Data Load Triggered",
    LoadProcessDashboardStatusCompleted = "[Snovasys-PM][ProcessDashboard Status Component] Intial Data Load Completed",
    LoadProcessDashboardStatusFailed = "[Snovasys-PM][ProcessDashboard Status Component] Intial Data Load Failed",
    ProcessDashboardStatusExceptionHandled = "[Snovasys-PM][ProcessDashboard Status Component]Dashboard Status Exception Handled"
}

export class LoadProcessDashboardStatusTriggered implements Action {
    type = ProcessDashboardStatusActionTypes.LoadProcessDashboardStatusTriggered
    ProcessDashboardStatusList: processDashboard[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    constructor() {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadProcessDashboardStatusCompleted implements Action {
    type = ProcessDashboardStatusActionTypes.LoadProcessDashboardStatusCompleted
    validationMessages: ValidationModel[];
    errorMessage: string;
    constructor(public ProcessDashboardStatusList: processDashboard[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class LoadProcessDashboardStatusFailed implements Action {
    type = ProcessDashboardStatusActionTypes.LoadProcessDashboardStatusFailed
    ProcessDashboardStatusList: processDashboard[];
    errorMessage: string;
    constructor(public validationMessages: ValidationModel[]) {}
}

// tslint:disable-next-line: max-classes-per-file
export class ProcessDashboardStatusExceptionHandled implements Action {
    type = ProcessDashboardStatusActionTypes.ProcessDashboardStatusExceptionHandled
    ProcessDashboardStatusList: processDashboard[];
    validationMessages: ValidationModel[];
    constructor(public errorMessage: string) {}
}

export type ProcessDashboardStatusActions = LoadProcessDashboardStatusTriggered
                                     |LoadProcessDashboardStatusCompleted
                                     |LoadProcessDashboardStatusFailed
                                     |ProcessDashboardStatusExceptionHandled
