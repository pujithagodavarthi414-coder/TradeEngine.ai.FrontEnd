import { Action } from "@ngrx/store";

import { SprintModel } from "../../models/sprints-model";
import { Update } from "@ngrx/entity";
import { ValidationModel } from '../../models/validation-messages';

export enum SprintActionTypes {
    UpsertSprintsTriggered = "[Snovasys-PM][Sprints Component] Upsert Sprints  Triggered",
    UpsertSprintsCompleted = "[Snovasys-PM][Sprints Component] Upsert Sprints  Completed",
    UpsertSprintsFailed = "[Snovasys-PM][Sprints Component] Upsert Sprints  Failed",
    SprintsExceptionHandled = "[Snovasys-PM][Sprints Component] Sprints ExceptionHandled",
    GetSprintsTriggered = "[Snovasys-PM][Sprints Component] Get Sprints  Triggered",
    GetAllSprintsTriggered = "[Snovasys-PM][Sprints Component] Get All Sprints  Triggered",
    GetSprintsCompleted = "[Snovasys-PM][Sprints Component] Get Sprints  Completed",
    GetSprintsFailed = "[Snovasys-PM][Sprints Component] Get Sprints  Failed",
    GetSprintsByIdTriggered = "[Snovasys-PM][Sprints Component]Get Sprints  By Id Triggered",
    GetSprintsByIdCompleted = "[Snovasys-PM][Sprints Component]Get Sprints  By Id Completed",
    GetSprintsByIdFailed = "[Snovasys-PM][Sprints Component]Get Sprints  By Id Failed",
    RefreshSprintsList = "[Snovasys-PM][Sprints Component] Refresh Sprints  List",
    UpdateSprintsField = "[Snovasys-PM][Sprints Component] Update Sprints  Field",
    ArchiveSprintsTriggered = "[Snovasys-PM][Sprints Component] Archive Sprints  Triggered",
    ArchiveSprintsCompleted = "[Snovasys-PM][Sprints Component] Archive Sprints  Completed",
    ArchiveSprintsFailed = "[Snovasys-PM][Sprints Component] Archive Sprints  Failed",
    GetMoreSprintsTriggered = "[Snovasys-PM][Sprints Component] Get More Sprints Triggered",
    SprintStartTriggered = "[Snovasys-PM][Sprints Component] Sprints Start Triggered",
    SprintStartCompleted = "[Snovasys-PM][Sprints Component] Sprints Start  Completed",
    SprintStartFailed = "[Snovasys-PM][Sprints Component]  Sprints Start  Failed",
    ReplanSprintTriggered = "[Snovasys-PM][Sprints Component] Replan Sprint Triggered",
    ReplanSprintCompleted = "[Snovasys-PM][Sprints Component] Replan Sprint  Completed",
    ReplanSprintFailed = "[Snovasys-PM][Sprints Component]  Replan Sprint  Failed",
    UpdateMultipleSprintsTriggered = "[Snovasys-PM][Sprints Component] Update Multiple Sprints Triggered",
    UpdateMultipleSprintsCompleted = "[Snovasys-PM][Sprints Component] Update Multiple Sprints Completed",
    UpdateMultipleSprintsFailed = "[Snovasys-PM][Sprints Component] Update Multiple Sprints Failed",
    CompleteSprintsTriggered = "[Snovasys-PM][Sprints Component] Complete Sprints  Triggered",
    CompleteSprintsCompleted = "[Snovasys-PM][Sprints Component] Complete Sprints  Completed",
    CompleteSprintsFailed = "[Snovasys-PM][Sprints Component] Complete Sprints  Failed",
    GetUniqueSprintsByIdTriggered = "[Snovasys-PM][Sprints Component]Get UNique Sprints  By Id Triggered",
    GetUniqueSprintsByIdCompleted = "[Snovasys-PM][Sprints Component]Get Unique  Sprints  By Id Completed",
    GetUniqueSprintsByIdFailed = "[Snovasys-PM][Sprints Component]Get Unique Sprints  By Id Failed",
    GetUniqueSprintsByUniqueIdTriggered = "[Snovasys-PM][Sprints Component]Get UNique Sprints  By Unique Id Triggered"

}

export class UpsertSprintsTriggered implements Action {
    type = SprintActionTypes.UpsertSprintsTriggered;
    sprintId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    SprintsList: SprintModel[];
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public sprint: SprintModel) { }
}

export class UpsertSprintsCompleted implements Action {
    type = SprintActionTypes.UpsertSprintsCompleted;
    sprint: SprintModel
    validationMessages: ValidationModel[];
    errorMessage: string;
    SprintsList: SprintModel[];
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public sprintId: string) { }
}

export class UpsertSprintsFailed implements Action {
    type = SprintActionTypes.UpsertSprintsFailed;
    sprint: SprintModel
    sprintId: string;
    errorMessage: string;
    SprintsList: SprintModel[];
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public validationMessages: ValidationModel[]) { }
}

export class GetSprintsTriggered implements Action {
    type = SprintActionTypes.GetSprintsTriggered;
    sprintId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    SprintsList: SprintModel[];
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public sprint: SprintModel) { }
}

export class GetAllSprintsTriggered implements Action {
    type = SprintActionTypes.GetAllSprintsTriggered;
    sprintId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    SprintsList: SprintModel[];
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public sprint: SprintModel) { }
}

export class GetMoreSprintsTriggered implements Action {
    type = SprintActionTypes.GetMoreSprintsTriggered;
    sprintId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    SprintsList: SprintModel[];
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public sprint: SprintModel) { }
}


export class GetSprintsCompleted implements Action {
    type = SprintActionTypes.GetSprintsCompleted;
    sprint: SprintModel
    validationMessages: ValidationModel[];
    errorMessage: string;
    sprintId: string;
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public SprintsList: SprintModel[]) { }
}


export class GetSprintsFailed implements Action {
    type = SprintActionTypes.GetSprintsFailed;
    sprint: SprintModel
    sprintId: string;
    errorMessage: string;
    SprintsList: SprintModel[];
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public validationMessages: ValidationModel[]) { }
}

export class GetSprintsByIdFailed implements Action {
    type = SprintActionTypes.GetSprintsByIdFailed;
    sprint: SprintModel
    sprintId: string;
    errorMessage: string;
    SprintsList: SprintModel[];
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public validationMessages: ValidationModel[]) { }
}

export class GetSprintsByIdTriggered implements Action {
    type = SprintActionTypes.GetSprintsByIdTriggered;
    validationMessages: ValidationModel[];
    errorMessage: string;
    SprintsList: SprintModel[];
    sprint: SprintModel
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public sprintId: string) { }
}

export class GetSprintsByIdCompleted implements Action {
    type = SprintActionTypes.GetSprintsByIdCompleted;
    SprintsList: SprintModel[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    sprintId: string;
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public sprint: SprintModel) { }
}

export class RefreshSprintsList implements Action {
    type = SprintActionTypes.RefreshSprintsList;
    SprintsList: SprintModel[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    sprintId: string;
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public sprint: SprintModel) { }
}

export class UpdateSprintsField implements Action {
    type = SprintActionTypes.UpdateSprintsField;
    SprintsList: SprintModel[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    sprintId: string;
    sprint: SprintModel;
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public sprintUpdates: { sprintUpdate: Update<SprintModel> }) { }
}

export class ArchiveSprintsTriggered implements Action {
    type = SprintActionTypes.ArchiveSprintsTriggered;
    sprintId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    SprintsList: SprintModel[];
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public sprint: SprintModel) { }
}

export class ArchiveSprintsCompleted implements Action {
    type = SprintActionTypes.ArchiveSprintsCompleted;
    sprint: SprintModel
    validationMessages: ValidationModel[];
    errorMessage: string;
    SprintsList: SprintModel[];
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public sprintId: string) { }
}

export class ArchiveSprintsFailed implements Action {
    type = SprintActionTypes.ArchiveSprintsFailed;
    sprint: SprintModel
    sprintId: string;
    errorMessage: string;
    SprintsList: SprintModel[];
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public validationMessages: ValidationModel[]) { }
}

export class SprintsExceptionHandled implements Action {
    type = SprintActionTypes.SprintsExceptionHandled;
    SprintsList: SprintModel[];
    validationMessages: ValidationModel[];
    sprintId: string;
    sprint: SprintModel;
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public errorMessage: string) { }
}

export class SprintStartTriggered implements Action {
    type = SprintActionTypes.SprintStartTriggered;
    sprintId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    SprintsList: SprintModel[];
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public sprint: SprintModel) { }
}

export class SprintStartCompleted implements Action {
    type = SprintActionTypes.SprintStartCompleted;
    sprint: SprintModel
    validationMessages: ValidationModel[];
    errorMessage: string;
    SprintsList: SprintModel[];
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public sprintId: string) { }
}

export class SprintStartFailed implements Action {
    type = SprintActionTypes.SprintStartFailed;
    sprint: SprintModel
    sprintId: string;
    errorMessage: string;
    SprintsList: SprintModel[];
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public validationMessages: ValidationModel[]) { }
}

export class ReplanSprintTriggered implements Action {
    type = SprintActionTypes.ReplanSprintTriggered;
    sprintId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    SprintsList: SprintModel[];
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public sprint: SprintModel) { }
}

export class ReplanSprintCompleted implements Action {
    type = SprintActionTypes.ReplanSprintCompleted;
    sprint: SprintModel
    validationMessages: ValidationModel[];
    errorMessage: string;
    SprintsList: SprintModel[];
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public sprintId: string) { }
}

export class ReplanSprintFailed implements Action {
    type = SprintActionTypes.ReplanSprintFailed;
    sprint: SprintModel
    sprintId: string;
    errorMessage: string;
    SprintsList: SprintModel[];
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public validationMessages: ValidationModel[]) { }
}


export class UpdateMultipleSprintsTriggered implements Action {
    type = SprintActionTypes.UpdateMultipleSprintsTriggered;
    validationMessages: ValidationModel[];
    errorMessage: string;
    sprint: SprintModel;
    SprintsList: SprintModel[];
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public  sprintId: string) { }
}

export class UpdateMultipleSprintsCompleted implements Action {
    type = SprintActionTypes.UpdateMultipleSprintsCompleted;
    sprint: SprintModel
    validationMessages: ValidationModel[];
    errorMessage: string;
    SprintsList: SprintModel[];
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintId: string;
    constructor(public sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> }) { }
}

export class UpdateMultipleSprintsFailed implements Action {
    type = SprintActionTypes.UpdateMultipleSprintsFailed;
    sprint: SprintModel
    sprintId: string;
    errorMessage: string;
    SprintsList: SprintModel[];
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public validationMessages: ValidationModel[]) { }
}


export class CompleteSprintsTriggered implements Action {
    type = SprintActionTypes.CompleteSprintsTriggered;
    sprintId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    SprintsList: SprintModel[];
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public sprint: SprintModel) { }
}

export class CompleteSprintsCompleted implements Action {
    type = SprintActionTypes.CompleteSprintsCompleted;
    sprint: SprintModel
    validationMessages: ValidationModel[];
    errorMessage: string;
    SprintsList: SprintModel[];
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public sprintId: string) { }
}

export class CompleteSprintsFailed implements Action {
    type = SprintActionTypes.CompleteSprintsFailed;
    sprint: SprintModel
    sprintId: string;
    errorMessage: string;
    SprintsList: SprintModel[];
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public validationMessages: ValidationModel[]) { }
}


export class GetUniqueSprintsByIdFailed implements Action {
    type = SprintActionTypes.GetUniqueSprintsByIdFailed;
    sprint: SprintModel
    sprintId: string;
    errorMessage: string;
    SprintsList: SprintModel[];
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public validationMessages: ValidationModel[]) { }
}

export class GetUniqueSprintsByIdTriggered implements Action {
    type = SprintActionTypes.GetUniqueSprintsByIdTriggered;
    validationMessages: ValidationModel[];
    errorMessage: string;
    SprintsList: SprintModel[];
    sprint: SprintModel
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public sprintId: string) { }
}

export class GetUniqueSprintsByUniqueIdTriggered implements Action {
    type = SprintActionTypes.GetUniqueSprintsByUniqueIdTriggered;
    validationMessages: ValidationModel[];
    errorMessage: string;
    SprintsList: SprintModel[];
    sprint: SprintModel
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public sprintId: string) { }
}

export class GetUniqueSprintsByIdCompleted implements Action {
    type = SprintActionTypes.GetUniqueSprintsByIdCompleted;
    SprintsList: SprintModel[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    sprintId: string;
    sprintUpdates: { sprintUpdate: Update<SprintModel> };
    sprintUpdatesMultiple: { sprintUpdateMultiple: Array<Update<SprintModel>> };
    constructor(public sprint: SprintModel) { }
}


export type SprintActionsUnion = UpsertSprintsCompleted |
    UpsertSprintsTriggered |
    UpsertSprintsFailed |
    GetSprintsTriggered |
    GetSprintsCompleted |
    GetSprintsFailed |
    GetMoreSprintsTriggered |
    GetSprintsByIdTriggered |
    GetSprintsByIdCompleted |
    GetSprintsByIdFailed |
    RefreshSprintsList |
    UpdateSprintsField |
    ArchiveSprintsTriggered |
    ArchiveSprintsCompleted |
    ArchiveSprintsFailed |
    SprintStartTriggered |
    SprintStartCompleted |
    SprintStartFailed |
    ReplanSprintTriggered |
    ReplanSprintCompleted |
    ReplanSprintFailed |
    CompleteSprintsTriggered |
    CompleteSprintsCompleted |
    CompleteSprintsFailed |
    GetUniqueSprintsByIdTriggered |
    GetUniqueSprintsByIdCompleted |
    GetUniqueSprintsByIdFailed |
    GetUniqueSprintsByUniqueIdTriggered |
    GetAllSprintsTriggered
    
    

