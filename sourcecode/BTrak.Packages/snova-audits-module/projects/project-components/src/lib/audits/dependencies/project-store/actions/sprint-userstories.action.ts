import { Action } from "@ngrx/store";
import { ValidationModel } from "../../models/validation-messages";
import { UserStory } from "../../models/userStory";
import { Update } from "@ngrx/entity";
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import { ArchivedUserStoryInputModel } from "../../models/archivedUserStoryModel";
import { ParkUserStoryInputModel } from "../../models/parkedUserstoryModel";
import { UserStoryInputTagsModel } from "../../models/user-story-tags.model";
import { UserStoryReplanModel } from "../../models/userStoryReplanModel";
import { CreateMultipleUserStoriesSplitCompleted } from "./userStory.actions";
import { ArchivedkanbanModel } from "../../models/kanbanViewstatusModel";

export enum SprintWorkItemActionTypes {
    UpsertSprintWorkItemTriggered = "[SnovaAudisModule SprintWorkItem Component] Upsert SprintWorkItem Triggered",
    UpsertSprintWorkItemCompleted = "[SnovaAudisModule SprintWorkItem Component] Upsert SprintWorkItem Completed",
    UpsertSprintWorkItemFailed = "[SnovaAudisModule SprintWorkItem Component] Upsert SprintWorkItem Failed",
    ExceptionHandled = "[SnovaAudisModule SprintWorkItem Component] ExceptionHandled",
    GetSprintWorkItemTriggered = "[SnovaAudisModule SprintWorkItem Component] Get SprintWorkItem Triggered",
    GetSprintWorkItemCompleted = "[SnovaAudisModule SprintWorkItem Component] Get SprintWorkItem Completed",
    GetSprintWorkItemFailed = "[SnovaAudisModule SprintWorkItem Component] Get SprintWorkItem Failed",
    GetSprintWorkItemByIdTriggered = "[SnovaAudisModule SprintWorkItem Component]Get SprintWorkItem By Id Triggered",
    GetSprintWorkItemByIdCompleted = "[SnovaAudisModule SprintWorkItem Component]Get SprintWorkItem By Id Completed",
    GetSprintWorkItemByIdFailed = "[SnovaAudisModule SprintWorkItem Component]Get SprintWorkItem By Id Failed",
    RefreshSprintWorkItemList = "[SnovaAudisModule SprintWorkItem Component] Refresh SprintWorkItem List",
    UpdateSprintWorkItemField = "[SnovaAudisModule SprintWorkItem Component] Update SprintWorkItem Field",
    GetMultipleSprintWorkItemByIdTriggered = "[SnovaAudisModule SprintWorkItem Component] Get Multiple sprint work items Triggered",
    GetMultipleSprintWorkItemByIdCompleted = "[SnovaAudisModule SprintWorkItem Component] Get Multiple sprint work items Completed",
    GetMultipleSprintWorkItemByIdFailed = "[SnovaAudisModule SprintWorkItem Component] Get Multiple sprint work items Failed",
    RefreshMoreSprintWorkItem = "[SnovaAudisModule SprintWorkItem Component] Refresh more sprint work items",
    UpsertMultipleSprintWorkItemTriggered = "[SnovaAudisModule SprintWorkItem Component] Upsert Multiple SprintWorkItem Triggered",
    UpsertMultipleSprintWorkItemCompleted = "[SnovaAudisModule SprintWorkItem Component] Upsert Multiple SprintWorkItem Completed",
    UpsertMultipleSprintWorkItemFailed = "[SnovaAudisModule SprintWorkItem Component] Upsert Multiple SprintWorkItem Failed",
    UpsertSprintSubTaskCompleted = "[SnovaAudisModule SprintWorkItem Component] Upsert Subtask Completed",
    UpdateMultipleSprintWorkItemField = "[SnovaAudisModule SprintWorkItem Component] Update Multiple SprintWorkItem Field",
    ArchiveSprintWorkItemTriggred = "[SnovaAudisModule SprintWorkItem Component] Archive SprintWorkItem Triggered",
    ArchiveSprintWorkItemCompleted = "[SnovaAudisModule SprintWorkItem Component] Archive SprintWorkItem Completed",
    ArchiveSprintWorkItemFailed = "[SnovaAudisModule SprintWorkItem Component] Archive SprintWorkItem Failed",
    ParkSprintWorkItemTriggred = "[SnovaAudisModule SprintWorkItem Component]  Park SprintWorkItem Triggered",
    ParkSprintWorkItemCompleted = "[SnovaAudisModule SprintWorkItem Component] Park SprintWorkItem Completed",
    ParkSprintWorkItemFailed = "[SnovaAudisModule SprintWorkItem Component] Park SprintWorkItem Failed",
    GetUniqueSprintWorkItemByIdTriggered = "[SnovaAudisModule SprintWorkItem Component]Get Unique SprintWorkItem By Id Triggered",
    GetUniqueSprintWorkItemByIdCompleted = "[SnovaAudisModule SprintWorkItem Component]Get Unique SprintWorkItem By Id Completed",
    GetUniqueSprintWorkItemByIdFailed = "[SnovaAudisModule SprintWorkItem Component]Get Unique SprintWorkItem By Id Failed",
    UpsertWorkItemTagsTriggered = "[SnovaAudisModule SprintWorkItem Component] Upsert WorkItem Tags Triggered",
    UpsertWorkItemTagsCompleted = "[SnovaAudisModule SprintWorkItem Component] Upsert WorkItem Tags Completed",
    UpsertWorkItemTagsFailed = "[SnovaAudisModule SprintWorkItem Component] Upsert WorkItem Tags Failed",
    ArchiveUniqueSprintWorkItemTriggred = "[SnovaAudisModule SprintWorkItem Component] Archive Unique SprintWorkItem Triggered",
    ArchiveUniqueSprintWorkItemCompleted = "[SnovaAudisModule SprintWorkItem Component] Archive Unique SprintWorkItem Completed",
    ArchiveUniqueSprintWorkItemFailed = "[SnovaAudisModule SprintWorkItem Component] Archive Unique SprintWorkItem Failed",
    ParkUniqueSprintWorkItemTriggred = "[SnovaAudisModule SprintWorkItem Component]  Park Unique SprintWorkItem Triggered",
    ParkUniqueSprintWorkItemCompleted = "[SnovaAudisModule SprintWorkItem Component] Park Unique SprintWorkItem Completed",
    ParkUniqueSprintWorkItemFailed = "[SnovaAudisModule SprintWorkItem Component] Park Unique SprintWorkItem Failed",
    GetSprintWorkItemSubTasksTriggered = "[SnovaAudisModule SprintWorkItem Component]Get SprintWorkItem SubTasks Triggered",
    GetSprintWorkItemSubTasksCompleted = "[SnovaAudisModule SprintWorkItem Component]Get SprintWorkItem SubTasks Completed",
    GetSprintWorkItemSubTasksFailed = "[SnovaAudisModule SprintWorkItem Component]Get SprintWorkItem SubTasks Failed",
    InsertSprintWorkItemReplanTriggered = "[SnovaAudisModule SprintWorkItem Component] Insert Sprint WorkItem Replan",
    InsertSprintWorkItemReplanCompleted = "[SnovaAudisModule SprintWorkItem Component] Complete  Sprint WorkItem Replan",
    InsertSprintWorkItemReplanFailed = "[SnovaAudisModule SprintWorkItem Component] Failed Sprint WorkItem Replan",
    MoveGoalUserStoryToSprintTriggered = "[SnovaAudisModule SprintWorkItem Component] Move Goal to Sprint Triggered",
    MoveGoalUserStoryToSprintCompleted = "[SnovaAudisModule SprintWorkItem Component] Move Goal to Sprint Completed",
    MoveGoalUserStoryToSprintFailed = "[SnovaAudisModule SprintWorkItem Component] Move Goal to Sprint Failed",
    CreateMultipleSprintUserStoriesTriggered = "[SnovaAudisModule SprintWorkItem Component] Create Multiple Sprint WorkItem Triggered",
    CreateMultiplSprintUserStoriesCompleted = "[SnovaAudisModule SprintWorkItem Component] Create Multiple Sprin tWorkItem Completed",
    CreateMultipleSprintUserStoriesFailed = "[SnovaAudisModule SprintWorkItem Component] Failed Multiple Sprint WorkItem",
    UpdateSprintSubTaskUserStoryTriggered = "[SnovaAudisModule SprintWorkItem Component] Update Sprint SubTask User story Triggered",
    UpdateSprintSubTaskUserStoryCompleted = "[SnovaAudisModule SprintWorkItem Component] Update Sprint SubTask User story Completed",
    UpdateSprintSubTaskUserStoryFailed = "[SnovaAudisModule SprintWorkItem Component] Update Sprint SubTask User story Failed",
    ReOrderSprintUserStoriesTriggred = "[SnovaAudisModule UserStory] ReOrder Sprint UserStories Triggred",
    ReOrderSprintUserStoriesCompleted = "[SnovaAudisModule UserStory] ReOrder Sprint UserStories Completed",
    ReOrderSprintUserStoriesFailed = "[SnovaAudisModule UserStory] ReOrder Sprint  UserStories Failed",
    UpdateUserStorySprintTriggered = "[SnovaAudisModule SprintWorkItem Component] Update UserStory Sprint Triggered",
    UpdateUserStorySprintCompleted = "[SnovaAudisModule SprintWorkItem Component] Update UserStory Sprint Completed",
    UpdateUserStorySprintFailed = "[SnovaAudisModule SprintWorkItem Component]  Update UserStory Sprint Failed",
    ArchiveKanbanSprintsTriggered = "[SnovaAudisModule SprintWorkItem Component] Archive Kanban Sprints Triggered" ,
    ArchiveKanbanSprintsCompleted = "[SnovaAudisModule SprintWorkItem Component] Archive Kanban Sprints Completed" ,
    ArchiveKanbanSprintsFailed = "[SnovaAudisModule SprintWorkItem Component] Archive Kanban Sprints Failed",
}

export class UpsertSprintWorkItemTriggered implements Action {
    type = SprintWorkItemActionTypes.UpsertSprintWorkItemTriggered;
    WorkItemId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    public sprintId: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public SprintWorkItem: UserStory) { }
}

export class UpsertSprintWorkItemCompleted implements Action {
    type = SprintWorkItemActionTypes.UpsertSprintWorkItemCompleted;
    SprintWorkItem: UserStory
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public WorkItemId: string) { }
}

export class UpsertSprintWorkItemFailed implements Action {
    type = SprintWorkItemActionTypes.UpsertSprintWorkItemFailed;
    SprintWorkItem: UserStory
    WorkItemId: string;
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public validationMessages: ValidationModel[]) { }
}



export class UpdateUserStorySprintTriggered implements Action {
    type = SprintWorkItemActionTypes.UpdateUserStorySprintTriggered;
    WorkItemId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    public sprintId: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public SprintWorkItem: UserStory) { }
}

export class UpdateUserStorySprintCompleted implements Action {
    type = SprintWorkItemActionTypes.UpdateUserStorySprintCompleted;
    SprintWorkItem: UserStory
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public WorkItemId: string) { }
}

export class UpdateUserStorySprintFailed implements Action {
    type = SprintWorkItemActionTypes.UpdateUserStorySprintFailed;
    SprintWorkItem: UserStory
    WorkItemId: string;
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public validationMessages: ValidationModel[]) { }
}

export class UpsertMultipleSprintWorkItemTriggered implements Action {
    type = SprintWorkItemActionTypes.UpsertMultipleSprintWorkItemTriggered;
    WorkItemId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public SprintWorkItem: UserStory) { }
}

export class UpsertMultipleSprintWorkItemCompleted implements Action {
    type = SprintWorkItemActionTypes.UpsertMultipleSprintWorkItemCompleted;
    SprintWorkItem: UserStory
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public WorkItemId: string) { }
}

export class UpsertMultipleSprintWorkItemFailed implements Action {
    type = SprintWorkItemActionTypes.UpsertMultipleSprintWorkItemFailed;
    SprintWorkItem: UserStory
    WorkItemId: string;
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public validationMessages: ValidationModel[]) { }
}

export class GetSprintWorkItemTriggered implements Action {
    type = SprintWorkItemActionTypes.GetSprintWorkItemTriggered;
    WorkItemId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemsList: UserStory[];
    SprintWorkItem: UserStory;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public WorkItemSearch: UserStorySearchCriteriaInputModel) { }
}

export class GetSprintWorkItemCompleted implements Action {
    type = SprintWorkItemActionTypes.GetSprintWorkItemCompleted;
    SprintWorkItem: UserStory
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemId: string;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public WorkItemsList: UserStory[]) { }
}


export class GetSprintWorkItemFailed implements Action {
    type = SprintWorkItemActionTypes.GetSprintWorkItemFailed;
    SprintWorkItem: UserStory
    WorkItemId: string;
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public validationMessages: ValidationModel[]) { }
}

export class GetSprintWorkItemSubTasksTriggered implements Action {
    type = SprintWorkItemActionTypes.GetSprintWorkItemSubTasksTriggered;
    WorkItemId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemsList: UserStory[];
    SprintWorkItem: UserStory;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public WorkItemSearch: UserStorySearchCriteriaInputModel) { }
}

export class GetSprintWorkItemSubTasksCompleted implements Action {
    type = SprintWorkItemActionTypes.GetSprintWorkItemSubTasksCompleted;
    SprintWorkItem: UserStory
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemId: string;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public WorkItemsList: UserStory[]) { }
}


export class GetSprintWorkItemSubTasksFailed implements Action {
    type = SprintWorkItemActionTypes.GetSprintWorkItemSubTasksFailed;
    SprintWorkItem: UserStory
    WorkItemId: string;
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public validationMessages: ValidationModel[]) { }
}

export class GetSprintWorkItemByIdFailed implements Action {
    type = SprintWorkItemActionTypes.GetSprintWorkItemByIdFailed;
    SprintWorkItem: UserStory
    WorkItemId: string;
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public validationMessages: ValidationModel[]) { }
}

export class GetSprintWorkItemByIdTriggered implements Action {
    type = SprintWorkItemActionTypes.GetSprintWorkItemByIdTriggered;
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemsList: UserStory[];
    SprintWorkItem: UserStory
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    constructor(public WorkItemId: string,  public isFromSprint: boolean) { }
}

export class GetSprintWorkItemByIdCompleted implements Action {
    type = SprintWorkItemActionTypes.GetSprintWorkItemByIdCompleted;
    WorkItemsList: UserStory[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemId: string;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public SprintWorkItem: UserStory) { }
}

export class GetUniqueSprintWorkItemByIdFailed implements Action {
    type = SprintWorkItemActionTypes.GetUniqueSprintWorkItemByIdFailed;
    SprintWorkItem: UserStory
    WorkItemId: string;
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public validationMessages: ValidationModel[]) { }
}

export class GetUniqueSprintWorkItemByIdTriggered implements Action {
    type = SprintWorkItemActionTypes.GetUniqueSprintWorkItemByIdTriggered;
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemsList: UserStory[];
    SprintWorkItem: UserStory
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public WorkItemId: string) { }
}

export class GetUniqueSprintWorkItemByIdCompleted implements Action {
    type = SprintWorkItemActionTypes.GetUniqueSprintWorkItemByIdCompleted;
    WorkItemsList: UserStory[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemId: string;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public SprintWorkItem: UserStory) { }
}

export class RefreshSprintWorkItemList implements Action {
    type = SprintWorkItemActionTypes.RefreshSprintWorkItemList;
    WorkItemsList: UserStory[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemId: string;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public SprintWorkItem: UserStory) { }
}

export class UpdateSprintWorkItemField implements Action {
    type = SprintWorkItemActionTypes.UpdateSprintWorkItemField;
    WorkItemsList: UserStory[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemId: string;
    SprintWorkItem: UserStory;
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public WorkItemUpdates: { WorkItemUpdate: Update<UserStory> }) { }
}

export class GetMultipleSprintWorkItemByIdTriggered implements Action {
    type = SprintWorkItemActionTypes.GetMultipleSprintWorkItemByIdTriggered;
    WorkItemsList: UserStory[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemId: string;
    SprintWorkItem: UserStory;
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public workItemIds: string[]) { }
}

export class GetMultipleSprintWorkItemByIdCompleted implements Action {
    type = SprintWorkItemActionTypes.GetMultipleSprintWorkItemByIdCompleted;
    workItemIds: string[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemId: string;
    SprintWorkItem: UserStory;
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public WorkItemsList: UserStory[]) { }
}

export class GetMultipleSprintWorkItemByIdFailed implements Action {
    type = SprintWorkItemActionTypes.GetMultipleSprintWorkItemByIdFailed;
    SprintWorkItem: UserStory
    WorkItemId: string;
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public validationMessages: ValidationModel[]) { }
}

export class RefreshMoreSprintWorkItem implements Action {
    type = SprintWorkItemActionTypes.RefreshMoreSprintWorkItem;
    workItemIds: string[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemId: string;
    SprintWorkItem: UserStory;
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public WorkItemsList: UserStory[]) { }
}

export class UpsertSprintSubTaskCompleted implements Action {
    type = SprintWorkItemActionTypes.UpsertSprintSubTaskCompleted;
    WorkItemsList: UserStory[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemId: string;
    SprintWorkItem: UserStory;
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public workItemIds: string[]) { }
}

export class UpdateMultipleSprintWorkItemField implements Action {
    type = SprintWorkItemActionTypes.UpdateMultipleSprintWorkItemField;
    WorkItemsList: UserStory[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemId: string;
    SprintWorkItem: UserStory;
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    workItemIds: string[];
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] }) { }
}

export class ArchiveSprintWorkItemTriggred implements Action {
    type = SprintWorkItemActionTypes.ArchiveSprintWorkItemTriggred;
    WorkItemsList: UserStory[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemId: string;
    SprintWorkItem: UserStory;
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    workItemIds: string[];
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public archiveUserStory: ArchivedUserStoryInputModel) { }
}

export class ArchiveSprintWorkItemCompleted implements Action {
    type = SprintWorkItemActionTypes.ArchiveSprintWorkItemCompleted;
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemsList: UserStory[];
    SprintWorkItem: UserStory
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public WorkItemId: string) { }
}

export class ArchiveSprintWorkItemFailed implements Action {
    type = SprintWorkItemActionTypes.ArchiveSprintWorkItemFailed;
    WorkItemId: string;
    errorMessage: string;
    WorkItemsList: UserStory[];
    SprintWorkItem: UserStory
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public validationMessages: ValidationModel[]) { }
}

export class ParkSprintWorkItemTriggred implements Action {
    type = SprintWorkItemActionTypes.ParkSprintWorkItemTriggred;
    WorkItemsList: UserStory[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemId: string;
    SprintWorkItem: UserStory;
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    workItemIds: string[];
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public parkUserStory: ParkUserStoryInputModel) { }
}

export class ParkSprintWorkItemCompleted implements Action {
    type = SprintWorkItemActionTypes.ParkSprintWorkItemCompleted;
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemsList: UserStory[];
    SprintWorkItem: UserStory
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public WorkItemId: string) { }
}

export class ParkSprintWorkItemFailed implements Action {
    type = SprintWorkItemActionTypes.ParkSprintWorkItemFailed;
    WorkItemId: string;
    errorMessage: string;
    WorkItemsList: UserStory[];
    SprintWorkItem: UserStory
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public validationMessages: ValidationModel[]) { }
}

export class ArchiveUniqueSprintWorkItemTriggred implements Action {
    type = SprintWorkItemActionTypes.ArchiveUniqueSprintWorkItemTriggred;
    WorkItemsList: UserStory[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemId: string;
    SprintWorkItem: UserStory;
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    workItemIds: string[];
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public archiveUserStory: ArchivedUserStoryInputModel) { }
}

export class ArchiveUniqueSprintWorkItemCompleted implements Action {
    type = SprintWorkItemActionTypes.ArchiveUniqueSprintWorkItemCompleted;
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemsList: UserStory[];
    SprintWorkItem: UserStory
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public WorkItemId: string) { }
}

export class ArchiveUniqueSprintWorkItemFailed implements Action {
    type = SprintWorkItemActionTypes.ArchiveUniqueSprintWorkItemFailed;
    WorkItemId: string;
    errorMessage: string;
    WorkItemsList: UserStory[];
    SprintWorkItem: UserStory
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public validationMessages: ValidationModel[]) { }
}

export class ParkUniqueSprintWorkItemTriggred implements Action {
    type = SprintWorkItemActionTypes.ParkUniqueSprintWorkItemTriggred;
    WorkItemsList: UserStory[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemId: string;
    SprintWorkItem: UserStory;
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    workItemIds: string[];
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public parkUserStory: ParkUserStoryInputModel) { }
}

export class ParkUniqueSprintWorkItemCompleted implements Action {
    type = SprintWorkItemActionTypes.ParkUniqueSprintWorkItemCompleted;
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemsList: UserStory[];
    SprintWorkItem: UserStory
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public WorkItemId: string) { }
}

export class ParkUniqueSprintWorkItemFailed implements Action {
    type = SprintWorkItemActionTypes.ParkUniqueSprintWorkItemFailed;
    WorkItemId: string;
    errorMessage: string;
    WorkItemsList: UserStory[];
    SprintWorkItem: UserStory
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public validationMessages: ValidationModel[]) { }
}

export class UpsertWorkItemTagsTriggered implements Action {
    type = SprintWorkItemActionTypes.UpsertWorkItemTagsTriggered;
    WorkItemsList: UserStory[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemId: string;
    SprintWorkItem: UserStory;
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    workItemIds: string[];
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public tagsInputModel: UserStoryInputTagsModel) { }
}

export class UpsertWorkItemTagsCompleted implements Action {
    type = SprintWorkItemActionTypes.UpsertWorkItemTagsCompleted;
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemsList: UserStory[];
    SprintWorkItem: UserStory
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public WorkItemId: string) { }
}

export class UpsertWorkItemTagsFailed implements Action {
    type = SprintWorkItemActionTypes.UpsertWorkItemTagsFailed;
    WorkItemId: string;
    errorMessage: string;
    WorkItemsList: UserStory[];
    SprintWorkItem: UserStory
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public validationMessages: ValidationModel[]) { }
}

export class InsertSprintWorkItemReplanTriggered implements Action {
    type = SprintWorkItemActionTypes.InsertSprintWorkItemReplanTriggered;
    WorkItemsList: UserStory[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemId: string;
    SprintWorkItem: UserStory;
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    workItemIds: string[];
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public userStoryReplan: UserStoryReplanModel) { }
}

export class InsertSprintWorkItemReplanCompleted implements Action {
    type = SprintWorkItemActionTypes.InsertSprintWorkItemReplanCompleted;
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemsList: UserStory[];
    SprintWorkItem: UserStory
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public WorkItemId: string) { }
}

export class InsertSprintWorkItemReplanFailed implements Action {
    type = SprintWorkItemActionTypes.InsertSprintWorkItemReplanFailed;
    WorkItemId: string;
    errorMessage: string;
    WorkItemsList: UserStory[];
    SprintWorkItem: UserStory
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public validationMessages: ValidationModel[]) { }
}

export class MoveGoalUserStoryToSprintTriggered implements Action {
    type = SprintWorkItemActionTypes.MoveGoalUserStoryToSprintTriggered;
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemsList: UserStory[];
    SprintWorkItem: UserStory
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public WorkItemId: string, public sprintId: string) { }
}

export class MoveGoalUserStoryToSprintCompleted implements Action {
    type = SprintWorkItemActionTypes.MoveGoalUserStoryToSprintCompleted;
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemsList: UserStory[];
    SprintWorkItem: UserStory
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public WorkItemId: string) { }
}

export class MoveGoalUserStoryToSprintFailed implements Action {
    type = SprintWorkItemActionTypes.MoveGoalUserStoryToSprintFailed;
    WorkItemId: string;
    errorMessage: string;
    WorkItemsList: UserStory[];
    SprintWorkItem: UserStory
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public validationMessages: ValidationModel[]) { }
}


export class ExceptionHandled implements Action {
    type = SprintWorkItemActionTypes.ExceptionHandled;
    WorkItemsList: UserStory[];
    validationMessages: ValidationModel[];
    WorkItemId: string;
    SprintWorkItem: UserStory;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public errorMessage: string) { }
}

export class CreateMultipleSprintUserStoriesTriggered implements Action {
    type = SprintWorkItemActionTypes.CreateMultipleSprintUserStoriesTriggered;
    WorkItemId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public SprintWorkItem: UserStory) { }
}

export class CreateMultiplSprintUserStoriesCompleted implements Action {
    type = SprintWorkItemActionTypes.CreateMultiplSprintUserStoriesCompleted;
    SprintWorkItem: UserStory
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public WorkItemId: string) { }
}

export class CreateMultipleSprintUserStoriesFailed implements Action {
    type = SprintWorkItemActionTypes.CreateMultipleSprintUserStoriesFailed;
    SprintWorkItem: UserStory
    WorkItemId: string;
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public validationMessages: ValidationModel[]) { }
}

export class UpdateSprintSubTaskUserStoryTriggered implements Action {
    type = SprintWorkItemActionTypes.UpdateSprintSubTaskUserStoryTriggered;
    WorkItemId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    public sprintId: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public SprintWorkItem: UserStory) { }
}

export class UpdateSprintSubTaskUserStoryCompleted implements Action {
    type = SprintWorkItemActionTypes.UpdateSprintSubTaskUserStoryCompleted;
    SprintWorkItem: UserStory
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public WorkItemId: string) { }
}

export class UpdateSprintSubTaskUserStoryFailed implements Action {
    type = SprintWorkItemActionTypes.UpdateSprintSubTaskUserStoryFailed;
    SprintWorkItem: UserStory
    WorkItemId: string;
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public validationMessages: ValidationModel[]) { }
}

export class ReOrderSprintUserStoriesTriggred implements Action {
    type = SprintWorkItemActionTypes.ReOrderSprintUserStoriesTriggred;
    validationMessages: ValidationModel[];
    errorMessage: string;
    public sprintId: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    SprintWorkItem: UserStory;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public workItemIds: string[], public WorkItemId: string) { }
}

export class ReOrderSprintUserStoriesCompleted implements Action {
    type = SprintWorkItemActionTypes.ReOrderSprintUserStoriesCompleted;
    SprintWorkItem: UserStory
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    sprintId: string;
    WorkItemId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public workItemIds: string[]) { }
}

export class ReOrderSprintUserStoriesFailed implements Action {
    type = SprintWorkItemActionTypes.ReOrderSprintUserStoriesFailed;
    SprintWorkItem: UserStory
    WorkItemId: string;
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public validationMessages: ValidationModel[]) { }
}


export class ArchiveKanbanSprintsTriggered implements Action {
    type = SprintWorkItemActionTypes.ArchiveKanbanSprintsTriggered;
    SprintWorkItem: UserStory
    WorkItemId: string;
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    validationMessages: ValidationModel[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    workItemIds: string[];
    isFromSprint: boolean;
    constructor(public  archivedkanbanModel: ArchivedkanbanModel ) { }

}


export class ArchiveKanbanSprintsCompleted implements Action {
    type = SprintWorkItemActionTypes.ArchiveKanbanSprintsCompleted;
    SprintWorkItem: UserStory
    WorkItemId: string;
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    validationMessages: ValidationModel[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public   workItemIds: string[] ) { }

}
export class ArchiveKanbanSprintsFailed implements Action {
    type = SprintWorkItemActionTypes.ArchiveKanbanSprintsFailed;
    SprintWorkItem: UserStory
    WorkItemId: string;
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory> };
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    userStoryUpdatesMultiple: { userStoryUpdateMultiple: Update<UserStory>[] };
    archiveUserStory: ArchivedUserStoryInputModel;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    userStoryReplan: UserStoryReplanModel;
    public sprintId: string;
    archivedkanbanModel: ArchivedkanbanModel;
    isFromSprint: boolean;
    constructor(public validationMessages: ValidationModel[]) { }
}

export type SprintWorkItemActions = UpsertSprintWorkItemCompleted |
    UpsertSprintWorkItemTriggered |
    UpsertSprintWorkItemFailed |
    GetSprintWorkItemTriggered |
    GetSprintWorkItemCompleted |
    GetSprintWorkItemFailed |
    GetSprintWorkItemByIdTriggered |
    GetSprintWorkItemByIdCompleted |
    GetSprintWorkItemByIdFailed |
    RefreshSprintWorkItemList |
    UpdateSprintWorkItemField |
    GetMultipleSprintWorkItemByIdTriggered |
    GetMultipleSprintWorkItemByIdCompleted |
    GetMultipleSprintWorkItemByIdFailed |
    RefreshMoreSprintWorkItem |
    UpsertMultipleSprintWorkItemTriggered |
    UpsertMultipleSprintWorkItemCompleted |
    UpsertMultipleSprintWorkItemFailed |
    UpdateMultipleSprintWorkItemField |
    UpsertSprintSubTaskCompleted |
    ArchiveSprintWorkItemTriggred |
    ArchiveSprintWorkItemCompleted |
    ArchiveSprintWorkItemFailed |
    ParkSprintWorkItemTriggred |
    ParkSprintWorkItemCompleted |
    ParkSprintWorkItemFailed |
    GetUniqueSprintWorkItemByIdTriggered |
    GetUniqueSprintWorkItemByIdCompleted |
    GetUniqueSprintWorkItemByIdFailed |
    UpsertWorkItemTagsTriggered |
    UpsertWorkItemTagsCompleted |
    UpsertWorkItemTagsFailed |
    ArchiveUniqueSprintWorkItemTriggred |
    ArchiveUniqueSprintWorkItemFailed |
    ArchiveUniqueSprintWorkItemFailed |
    ParkUniqueSprintWorkItemTriggred |
    ParkUniqueSprintWorkItemCompleted |
    ParkUniqueSprintWorkItemFailed |
    GetSprintWorkItemSubTasksTriggered |
    GetSprintWorkItemSubTasksCompleted |
    GetSprintWorkItemSubTasksFailed |
    InsertSprintWorkItemReplanTriggered |
    InsertSprintWorkItemReplanCompleted |
    InsertSprintWorkItemReplanFailed |
    MoveGoalUserStoryToSprintTriggered |
    MoveGoalUserStoryToSprintCompleted |
    MoveGoalUserStoryToSprintFailed |
    CreateMultipleSprintUserStoriesTriggered |
    CreateMultiplSprintUserStoriesCompleted |
    CreateMultipleSprintUserStoriesFailed |
    UpdateSprintSubTaskUserStoryTriggered |
    UpdateSprintSubTaskUserStoryCompleted |
    UpdateSprintSubTaskUserStoryFailed |
    ReOrderSprintUserStoriesTriggred |
    ReOrderSprintUserStoriesCompleted |
    ReOrderSprintUserStoriesFailed |
    UpdateUserStorySprintTriggered |
    UpdateUserStorySprintCompleted |
    UpdateUserStorySprintFailed |
    ArchiveKanbanSprintsTriggered |
    ArchiveKanbanSprintsCompleted |
    ArchiveKanbanSprintsFailed

