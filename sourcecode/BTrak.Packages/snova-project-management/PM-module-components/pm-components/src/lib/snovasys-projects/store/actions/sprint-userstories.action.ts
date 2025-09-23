import { Action } from "@ngrx/store";
import { UserStory } from "../../models/userStory";
import { Update } from "@ngrx/entity";
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import { ArchivedUserStoryInputModel } from "../../models/archivedUserStoryModel";
import { ParkUserStoryInputModel } from "../../models/parkedUserstoryModel";
import { UserStoryInputTagsModel } from "../../models/user-story-tags.model";
import { UserStoryReplanModel } from "../../models/userStoryReplanModel";
import { CreateMultipleUserStoriesSplitCompleted } from "./userStory.actions";
import { ArchivedkanbanModel } from "../../models/kanbanViewstatusModel";
import { ValidationModel } from '../../models/validation-messages';

export enum SprintWorkItemActionTypes {
    UpsertSprintWorkItemTriggered = "[Snovasys-PM][SprintWorkItem Component] Upsert SprintWorkItem Triggered",
    UpsertSprintWorkItemCompleted = "[Snovasys-PM][SprintWorkItem Component] Upsert SprintWorkItem Completed",
    UpsertSprintWorkItemFailed = "[Snovasys-PM][SprintWorkItem Component] Upsert SprintWorkItem Failed",
    SprintUserStoriesExceptionHandled = "[Snovasys-PM][SprintWorkItem Component] Sprint UserStories ExceptionHandled",
    GetSprintWorkItemTriggered = "[Snovasys-PM][SprintWorkItem Component] Get SprintWorkItem Triggered",
    GetSprintWorkItemCompleted = "[Snovasys-PM][SprintWorkItem Component] Get SprintWorkItem Completed",
    GetSprintWorkItemFailed = "[Snovasys-PM][SprintWorkItem Component] Get SprintWorkItem Failed",
    GetSprintWorkItemByIdTriggered = "[Snovasys-PM][SprintWorkItem Component]Get SprintWorkItem By Id Triggered",
    GetSprintWorkItemByIdCompleted = "[Snovasys-PM][SprintWorkItem Component]Get SprintWorkItem By Id Completed",
    GetSprintWorkItemByIdFailed = "[Snovasys-PM][SprintWorkItem Component]Get SprintWorkItem By Id Failed",
    RefreshSprintWorkItemList = "[Snovasys-PM][SprintWorkItem Component] Refresh SprintWorkItem List",
    UpdateSprintWorkItemField = "[Snovasys-PM][SprintWorkItem Component] Update SprintWorkItem Field",
    GetMultipleSprintWorkItemByIdTriggered = "[Snovasys-PM][SprintWorkItem Component] Get Multiple sprint work items Triggered",
    GetMultipleSprintWorkItemByIdCompleted = "[Snovasys-PM][SprintWorkItem Component] Get Multiple sprint work items Completed",
    GetMultipleSprintWorkItemByIdFailed = "[Snovasys-PM][SprintWorkItem Component] Get Multiple sprint work items Failed",
    RefreshMoreSprintWorkItem = "[Snovasys-PM][SprintWorkItem Component] Refresh more sprint work items",
    UpsertMultipleSprintWorkItemTriggered = "[Snovasys-PM][SprintWorkItem Component] Upsert Multiple SprintWorkItem Triggered",
    UpsertMultipleSprintWorkItemCompleted = "[Snovasys-PM][SprintWorkItem Component] Upsert Multiple SprintWorkItem Completed",
    UpsertMultipleSprintWorkItemFailed = "[Snovasys-PM][SprintWorkItem Component] Upsert Multiple SprintWorkItem Failed",
    UpsertSprintSubTaskCompleted = "[Snovasys-PM][SprintWorkItem Component] Upsert Subtask Completed",
    UpdateMultipleSprintWorkItemField = "[Snovasys-PM][SprintWorkItem Component] Update Multiple SprintWorkItem Field",
    ArchiveSprintWorkItemTriggred = "[Snovasys-PM][SprintWorkItem Component] Archive SprintWorkItem Triggered",
    ArchiveSprintWorkItemCompleted = "[Snovasys-PM][SprintWorkItem Component] Archive SprintWorkItem Completed",
    ArchiveSprintWorkItemFailed = "[Snovasys-PM][SprintWorkItem Component] Archive SprintWorkItem Failed",
    ParkSprintWorkItemTriggred = "[Snovasys-PM][SprintWorkItem Component]  Park SprintWorkItem Triggered",
    ParkSprintWorkItemCompleted = "[Snovasys-PM][SprintWorkItem Component] Park SprintWorkItem Completed",
    ParkSprintWorkItemFailed = "[Snovasys-PM][SprintWorkItem Component] Park SprintWorkItem Failed",
    GetUniqueSprintWorkItemByIdTriggered = "[Snovasys-PM][SprintWorkItem Component]Get Unique SprintWorkItem By Id Triggered",
    GetUniqueSprintWorkItemByIdCompleted = "[Snovasys-PM][SprintWorkItem Component]Get Unique SprintWorkItem By Id Completed",
    GetUniqueSprintWorkItemByIdFailed = "[Snovasys-PM][SprintWorkItem Component]Get Unique SprintWorkItem By Id Failed",
    UpsertWorkItemTagsTriggered = "[Snovasys-PM][SprintWorkItem Component] Upsert WorkItem Tags Triggered",
    UpsertWorkItemTagsCompleted = "[Snovasys-PM][SprintWorkItem Component] Upsert WorkItem Tags Completed",
    UpsertWorkItemTagsFailed = "[Snovasys-PM][SprintWorkItem Component] Upsert WorkItem Tags Failed",
    ArchiveUniqueSprintWorkItemTriggred = "[Snovasys-PM][SprintWorkItem Component] Archive Unique SprintWorkItem Triggered",
    ArchiveUniqueSprintWorkItemCompleted = "[Snovasys-PM][SprintWorkItem Component] Archive Unique SprintWorkItem Completed",
    ArchiveUniqueSprintWorkItemFailed = "[Snovasys-PM][SprintWorkItem Component] Archive Unique SprintWorkItem Failed",
    ParkUniqueSprintWorkItemTriggred = "[Snovasys-PM][SprintWorkItem Component]  Park Unique SprintWorkItem Triggered",
    ParkUniqueSprintWorkItemCompleted = "[Snovasys-PM][SprintWorkItem Component] Park Unique SprintWorkItem Completed",
    ParkUniqueSprintWorkItemFailed = "[Snovasys-PM][SprintWorkItem Component] Park Unique SprintWorkItem Failed",
    GetSprintWorkItemSubTasksTriggered = "[Snovasys-PM][SprintWorkItem Component]Get SprintWorkItem SubTasks Triggered",
    GetSprintWorkItemSubTasksCompleted = "[Snovasys-PM][SprintWorkItem Component]Get SprintWorkItem SubTasks Completed",
    GetSprintWorkItemSubTasksFailed = "[Snovasys-PM][SprintWorkItem Component]Get SprintWorkItem SubTasks Failed",
    InsertSprintWorkItemReplanTriggered = "[Snovasys-PM][SprintWorkItem Component] Insert Sprint WorkItem Replan",
    InsertSprintWorkItemReplanCompleted = "[Snovasys-PM][SprintWorkItem Component] Complete  Sprint WorkItem Replan",
    InsertSprintWorkItemReplanFailed = "[Snovasys-PM][SprintWorkItem Component] Failed Sprint WorkItem Replan",
    MoveGoalUserStoryToSprintTriggered = "[Snovasys-PM][SprintWorkItem Component] Move Goal to Sprint Triggered",
    MoveGoalUserStoryToSprintCompleted = "[Snovasys-PM][SprintWorkItem Component] Move Goal to Sprint Completed",
    MoveGoalUserStoryToSprintFailed = "[Snovasys-PM][SprintWorkItem Component] Move Goal to Sprint Failed",
    CreateMultipleSprintUserStoriesTriggered = "[Snovasys-PM][SprintWorkItem Component] Create Multiple Sprint WorkItem Triggered",
    CreateMultiplSprintUserStoriesCompleted = "[Snovasys-PM][SprintWorkItem Component] Create Multiple Sprin tWorkItem Completed",
    CreateMultipleSprintUserStoriesFailed = "[Snovasys-PM][SprintWorkItem Component] Failed Multiple Sprint WorkItem",
    UpdateSprintSubTaskUserStoryTriggered = "[Snovasys-PM][SprintWorkItem Component] Update Sprint SubTask User story Triggered",
    UpdateSprintSubTaskUserStoryCompleted = "[Snovasys-PM][SprintWorkItem Component] Update Sprint SubTask User story Completed",
    UpdateSprintSubTaskUserStoryFailed = "[Snovasys-PM][SprintWorkItem Component] Update Sprint SubTask User story Failed",
    ReOrderSprintUserStoriesTriggred = "[Snovasys-PM][UserStory] ReOrder Sprint UserStories Triggred",
    ReOrderSprintUserStoriesCompleted = "[Snovasys-PM][UserStory] ReOrder Sprint UserStories Completed",
    ReOrderSprintUserStoriesFailed = "[Snovasys-PM][UserStory] ReOrder Sprint  UserStories Failed",
    UpdateUserStorySprintTriggered = "[Snovasys-PM][SprintWorkItem Component] Update UserStory Sprint Triggered",
    UpdateUserStorySprintCompleted = "[Snovasys-PM][SprintWorkItem Component] Update UserStory Sprint Completed",
    UpdateUserStorySprintFailed = "[Snovasys-PM][SprintWorkItem Component]  Update UserStory Sprint Failed",
    ArchiveKanbanSprintsTriggered = "[Snovasys-PM][SprintWorkItem Component] Archive Kanban Sprints Triggered" ,
    ArchiveKanbanSprintsCompleted = "[Snovasys-PM][SprintWorkItem Component] Archive Kanban Sprints Completed" ,
    ArchiveKanbanSprintsFailed = "[Snovasys-PM][SprintWorkItem Component] Archive Kanban Sprints Failed",
    UpdateSingleSprintUserStoryForBugsTriggered = "[Snovasys-PM][UserStory]Update Multiple Sprint UserStories For Bugs Triggered",
    UpdateSingleSprintUserStoryForBugsCompleted = "[Snovasys-PM][UserStory]Update Multiple  Sprint UserStories For Bugs Completed",
    GetUniqueSprintWorkItemByUniqueIdTriggered = "[Snovasys-PM][SprintWorkItem Component]Get Unique SprintWorkItem By Unique Id Triggered"
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
    constructor(public SprintWorkItem: UserStory) { }
}


export class UpdateSingleSprintUserStoryForBugsTriggered implements Action {
    type = SprintWorkItemActionTypes.UpdateSingleSprintUserStoryForBugsTriggered;
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
    isGoalChange : boolean;
    constructor(public WorkItemId: string) { }
}

export class UpdateSingleSprintUserStoryForBugsCompleted implements Action {
    type = SprintWorkItemActionTypes.UpdateSingleSprintUserStoryForBugsCompleted;
    WorkItemsList: UserStory[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemId: string;
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
    SprintWorkItem: UserStory;
    isGoalChange : boolean;
    constructor(public   WorkItemUpdates: { WorkItemUpdate: Update<UserStory> }) { }
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
    constructor(public WorkItemId: string) { }
}

export class GetUniqueSprintWorkItemByUniqueIdTriggered implements Action {
    type = SprintWorkItemActionTypes.GetUniqueSprintWorkItemByUniqueIdTriggered;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    constructor(public WorkItemId: string, public sprintId: string, public isGoalChange : boolean) { }
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
    constructor(public validationMessages: ValidationModel[]) { }
}


export class SprintUserStoriesExceptionHandled implements Action {
    type = SprintWorkItemActionTypes.SprintUserStoriesExceptionHandled;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    isGoalChange : boolean;
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
    ArchiveKanbanSprintsFailed |
    UpdateSingleSprintUserStoryForBugsCompleted |
    UpdateSingleSprintUserStoryForBugsTriggered |
    GetUniqueSprintWorkItemByUniqueIdTriggered

