import { Action } from "@ngrx/store";
import { ValidationModel } from "../../models/validation-messages";
import { ArchivedGoalFilter } from "../../models/archived-goal-filter.model";
import { UserGoalFilter } from "../../models/user-goal-filter.model";

export enum GoalFiltersActionTypes {
    GetGoalFiltersTriggered = "[SnovaAudisModule GoalFilter Component] Get Goal Filters Triggered",
    GetGoalFiltersCompleted = "[SnovaAudisModule GoalFilter Component] Get Goal Filters Completed",
    GetGoalFiltersFailed = "[SnovaAudisModule GoalFilter Component] Get Goal Filters Failed",
    UpsertGoalFiltersTriggered = "[SnovaAudisModule GoalFilter Component] Upsert Goal Filters Triggered",
    UpsertGoalFiltersCompleted = "[SnovaAudisModule GoalFilter Component] Upsert Goal Filters Completed",
    UpsertGoalFiltersFailed = "[SnovaAudisModule GoalFilter Component] Upsert Goal Filters Failed",
    ArchiveGoalFiltersTriggered = "[SnovaAudisModule GoalFilter Component] Archive Goal Filters Triggered",
    ArchiveGoalFiltersCompleted = "[SnovaAudisModule GoalFilter Component] Archive Goal Filters Completed",
    ArchiveGoalFiltersFailed = "[SnovaAudisModule GoalFilter Component] Archive Goal Filters Failed",
    ExceptionHandled = "[SnovaAudisModule GoalFilter Component] Exception Handled"
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
export class ExceptionHandled implements Action {
    type = GoalFiltersActionTypes.ExceptionHandled;
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
    | ExceptionHandled;
