import { Action } from "@ngrx/store";
import { ArchivedGoalFilter } from "../../models/archived-goal-filter.model";
import { UserGoalFilter } from "../../models/user-goal-filter.model";
import { ValidationModel } from '../../models/validation-messages';

export enum GoalFiltersActionTypes {
    GetGoalFiltersTriggered = "[Snovasys-PM][GoalFilter Component] Get Goal Filters Triggered",
    GetGoalFiltersCompleted = "[Snovasys-PM][GoalFilter Component] Get Goal Filters Completed",
    GetGoalFiltersFailed = "[Snovasys-PM][GoalFilter Component] Get Goal Filters Failed",
    UpsertGoalFiltersTriggered = "[Snovasys-PM][GoalFilter Component] Upsert Goal Filters Triggered",
    UpsertGoalFiltersCompleted = "[Snovasys-PM][GoalFilter Component] Upsert Goal Filters Completed",
    UpsertGoalFiltersFailed = "[Snovasys-PM][GoalFilter Component] Upsert Goal Filters Failed",
    ArchiveGoalFiltersTriggered = "[Snovasys-PM][GoalFilter Component] Archive Goal Filters Triggered",
    ArchiveGoalFiltersCompleted = "[Snovasys-PM][GoalFilter Component] Archive Goal Filters Completed",
    ArchiveGoalFiltersFailed = "[Snovasys-PM][GoalFilter Component] Archive Goal Filters Failed",
    GoalFiltersExceptionHandled = "[Snovasys-PM][GoalFilter Component] Goal Filters Exception Handled"
}

export class GetGoalFiltersTriggered implements Action {
    type = GoalFiltersActionTypes.GetGoalFiltersTriggered;
    goalFiltersList: UserGoalFilter[];
    goalFilterId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    archivedGoalFilter: ArchivedGoalFilter;
    constructor(public goalFilterModel: UserGoalFilter) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetGoalFiltersCompleted implements Action {
    type = GoalFiltersActionTypes.GetGoalFiltersCompleted;
    goalFilterModel: UserGoalFilter;
    goalFilterId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    archivedGoalFilter: ArchivedGoalFilter;
    constructor(public goalFiltersList: UserGoalFilter[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetGoalFiltersFailed implements Action {
    type = GoalFiltersActionTypes.GetGoalFiltersFailed;
    goalFiltersList: UserGoalFilter[];
    goalFilterModel: UserGoalFilter;
    errorMessage: string;
    archivedGoalFilter: ArchivedGoalFilter;
    goalFilterId: string;
    constructor(public validationMessages: ValidationModel[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class UpsertGoalFiltersTriggered implements Action {
    type = GoalFiltersActionTypes.UpsertGoalFiltersTriggered;
    goalFiltersList: UserGoalFilter[];
    goalFilterId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    archivedGoalFilter: ArchivedGoalFilter;
    constructor(public goalFilterModel: UserGoalFilter) { }
}

// tslint:disable-next-line: max-classes-per-file
export class UpsertGoalFiltersCompleted implements Action {
    type = GoalFiltersActionTypes.UpsertGoalFiltersCompleted;
    goalFiltersList: UserGoalFilter[];
    goalFilterModel: UserGoalFilter;
    validationMessages: ValidationModel[];
    errorMessage: string;
    archivedGoalFilter: ArchivedGoalFilter;
    constructor(public goalFilterId: string) { }
}

// tslint:disable-next-line: max-classes-per-file
export class UpsertGoalFiltersFailed implements Action {
    type = GoalFiltersActionTypes.UpsertGoalFiltersFailed;
    goalFiltersList: UserGoalFilter[];
    goalFilterModel: UserGoalFilter;
    errorMessage: string;
    goalFilterId: string;
    archivedGoalFilter: ArchivedGoalFilter;
    constructor(public validationMessages: ValidationModel[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class ArchiveGoalFiltersTriggered implements Action {
    type = GoalFiltersActionTypes.ArchiveGoalFiltersTriggered;
    goalFiltersList: UserGoalFilter[];
    goalFilterId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    goalFilterModel: UserGoalFilter;
    constructor(public archivedGoalFilter: ArchivedGoalFilter) { }
}

// tslint:disable-next-line: max-classes-per-file
export class ArchiveGoalFiltersCompleted implements Action {
    type = GoalFiltersActionTypes.ArchiveGoalFiltersCompleted;
    goalFiltersList: UserGoalFilter[];
    goalFilterModel: UserGoalFilter;
    validationMessages: ValidationModel[];
    errorMessage: string;
    archivedGoalFilter: ArchivedGoalFilter;
    constructor(public goalFilterId: string) { }
}

// tslint:disable-next-line: max-classes-per-file
export class ArchiveGoalFiltersFailed implements Action {
    type = GoalFiltersActionTypes.ArchiveGoalFiltersFailed;
    goalFiltersList: UserGoalFilter[];
    goalFilterModel: UserGoalFilter;
    errorMessage: string;
    goalFilterId: string;
    archivedGoalFilter: ArchivedGoalFilter;
    constructor(public validationMessages: ValidationModel[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GoalFiltersExceptionHandled implements Action {
    type = GoalFiltersActionTypes.GoalFiltersExceptionHandled;
    goalFiltersList: UserGoalFilter[];
    goalFilterModel: UserGoalFilter;
    goalFilterId: string;
    validationMessages: ValidationModel[];
    archivedGoalFilter: ArchivedGoalFilter;
    constructor(public errorMessage: string) { }
}

export type GoalFilterActions =
    GetGoalFiltersTriggered
    | GetGoalFiltersCompleted
    | GetGoalFiltersFailed
    | UpsertGoalFiltersTriggered
    | UpsertGoalFiltersCompleted
    | UpsertGoalFiltersFailed
    | ArchiveGoalFiltersTriggered
    | ArchiveGoalFiltersCompleted
    | ArchiveGoalFiltersFailed
    | GoalFiltersExceptionHandled;
