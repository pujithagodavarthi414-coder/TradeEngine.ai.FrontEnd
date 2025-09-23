import { Action } from "@ngrx/store";
import { UserStory } from "../../models/userStory";
import { Update } from "@ngrx/entity";
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import { ValidationModel } from '../../models/validation-messages';

export enum WorkItemActionTypes {
    UpsertWorkItemTriggered = "[Snovasys-PM][WorkItem Component] Upsert WorkItem Triggered",
    UpsertWorkItemCompleted = "[Snovasys-PM][WorkItem Component] Upsert WorkItem Completed",
    UpsertWorkItemFailed = "[Snovasys-PM][WorkItem Component] Upsert WorkItem Failed",
    TemplateUserStoriesExceptionHandled = "[Snovasys-PM][WorkItem Component] Template UserStoriesExceptionHandled",
    GetWorkItemsTriggered = "[Snovasys-PM][WorkItem Component] Get WorkItem Triggered",
    GetWorkItemsCompleted = "[Snovasys-PM][WorkItem Component] Get WorkItem Completed",
    GetWorkItemsFailed = "[Snovasys-PM][WorkItem Component] Get WorkItem Failed",
    GetWorkItemByIdTriggered = "[Snovasys-PM][WorkItem Component]Get WorkItem By Id Triggered",
    GetWorkItemByIdCompleted = "[Snovasys-PM][WorkItem Component]Get WorkItem By Id Completed",
    GetWorkItemByIdFailed = "[Snovasys-PM][WorkItem Component]Get WorkItem By Id Failed",
    RefreshWorkItemList = "[Snovasys-PM][WorkItem Component] Refresh WorkItem List",
    UpdateWorkItemField = "[Snovasys-PM][WorkItem Component] Update WorkItem Field",
    GetMultipleWorkitemsByIdTriggered = "[Snovasys-PM][WorkItem Component] Get Multiple work items Triggered",
    GetMultipleWorkitemsByIdCompleted = "[Snovasys-PM][WorkItem Component] Get Multiple work items Completed",
    GetMultipleWorkitemsByIdFailed = "[Snovasys-PM][WorkItem Component] Get Multiple work items Failed",
    RefreshMoreWorkItems = "[Snovasys-PM][WorkItem Component] Refresh more work items",
    UpsertMultipleWorkItemTriggered = "[Snovasys-PM][WorkItem Component] Upsert Multiple WorkItem Triggered",
    UpsertMultipleWorkItemCompleted = "[Snovasys-PM][WorkItem Component] Upsert Multiple WorkItem Completed",
    UpsertMultipleWorkItemFailed = "[Snovasys-PM][WorkItem Component] Upsert Multiple WorkItem Failed",
}

export class UpsertWorkItemTriggered implements Action {
    type = WorkItemActionTypes.UpsertWorkItemTriggered;
    WorkItemId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory>};
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    constructor(public WorkItem: UserStory) {}
}

export class UpsertWorkItemCompleted implements Action {
    type = WorkItemActionTypes.UpsertWorkItemCompleted;
    WorkItem: UserStory
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory>};
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    constructor(public WorkItemId: string) {}
}

export class UpsertWorkItemFailed implements Action {
    type = WorkItemActionTypes.UpsertWorkItemFailed;
    WorkItem: UserStory
    WorkItemId: string;
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory>};
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    constructor(public validationMessages: ValidationModel[]) {}
}

export class UpsertMultipleWorkItemTriggered implements Action {
    type = WorkItemActionTypes.UpsertMultipleWorkItemTriggered;
    WorkItemId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory>};
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    constructor(public WorkItem: UserStory) {}
}

export class UpsertMultipleWorkItemCompleted implements Action {
    type = WorkItemActionTypes.UpsertMultipleWorkItemCompleted;
    WorkItem: UserStory
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory>};
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    constructor(public WorkItemId: string) {}
}

export class UpsertMultipleWorkItemFailed implements Action {
    type = WorkItemActionTypes.UpsertMultipleWorkItemFailed;
    WorkItem: UserStory
    WorkItemId: string;
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory>};
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    constructor(public validationMessages: ValidationModel[]) {}
}

export class GetWorkItemsTriggered implements Action {
    type = WorkItemActionTypes.GetWorkItemsTriggered;
    WorkItemId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItem: UserStory;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory>};
    workItemIds: string[];
    constructor(public WorkItemSearch: UserStorySearchCriteriaInputModel) {}
}

export class GetWorkItemsCompleted implements Action {
    type = WorkItemActionTypes.GetWorkItemsCompleted;
    WorkItem: UserStory
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemId: string;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory>};
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    constructor(public WorkItemsList: UserStory[]) {}
}


export class GetWorkItemsFailed implements Action {
    type = WorkItemActionTypes.GetWorkItemsFailed;
    WorkItem: UserStory
    WorkItemId: string;
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory>};
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    constructor(public validationMessages: ValidationModel[]) {}
}

export class GetWorkItemByIdFailed implements Action {
    type = WorkItemActionTypes.GetWorkItemByIdFailed;
    WorkItem: UserStory
    WorkItemId: string;
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory>};
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    constructor(public validationMessages: ValidationModel[]) {}
}

export class GetWorkItemByIdTriggered implements Action {
    type = WorkItemActionTypes.GetWorkItemByIdTriggered;
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItem: UserStory
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory>};
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    constructor(public WorkItemId: string) {}
}

export class GetWorkItemByIdCompleted implements Action {
    type = WorkItemActionTypes.GetWorkItemByIdCompleted;
    WorkItemsList: UserStory[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemId: string;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory>};
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    constructor(public WorkItem: UserStory) {}
}

export class RefreshWorkItemList implements Action {
    type = WorkItemActionTypes.RefreshWorkItemList;
    WorkItemsList: UserStory[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemId: string;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory>};
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    constructor(public WorkItem: UserStory) {}
}

export class UpdateWorkItemField implements Action {
    type = WorkItemActionTypes.UpdateWorkItemField;
    WorkItemsList: UserStory[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemId: string;
    WorkItem: UserStory;
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    constructor(public WorkItemUpdates: { WorkItemUpdate: Update<UserStory>}) {}
}

export class GetMultipleWorkitemsByIdTriggered implements Action {
    type = WorkItemActionTypes.GetMultipleWorkitemsByIdTriggered;
    WorkItemsList: UserStory[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemId: string;
    WorkItem: UserStory;
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory>};
    constructor(public  workItemIds: string[]) {}
}

export class GetMultipleWorkitemsByIdCompleted implements Action {
    type = WorkItemActionTypes.GetMultipleWorkitemsByIdCompleted;
    workItemIds: string[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemId: string;
    WorkItem: UserStory;
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory>};
    constructor(public   WorkItemsList: UserStory[]) {}
}

export class GetMultipleWorkitemsByIdFailed implements Action {
    type = WorkItemActionTypes.GetMultipleWorkitemsByIdFailed;
    WorkItem: UserStory
    WorkItemId: string;
    errorMessage: string;
    WorkItemsList: UserStory[];
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory>};
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    constructor(public validationMessages: ValidationModel[]) {}
}

export class RefreshMoreWorkItems implements Action {
    type = WorkItemActionTypes.RefreshMoreWorkItems;
    workItemIds: string[];
    validationMessages: ValidationModel[];
    errorMessage: string;
    WorkItemId: string;
    WorkItem: UserStory;
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory>};
    constructor(public   WorkItemsList: UserStory[]) {}
}

export class TemplateUserStoriesExceptionHandled implements Action {
    type = WorkItemActionTypes.TemplateUserStoriesExceptionHandled;
    WorkItemsList: UserStory[];
    validationMessages: ValidationModel[];
    WorkItemId: string;
    WorkItem: UserStory;
    WorkItemUpdates: { WorkItemUpdate: Update<UserStory>};
    WorkItemSearch: UserStorySearchCriteriaInputModel;
    workItemIds: string[];
    constructor(public errorMessage: string) {}
}

export type WorkItemActions = UpsertWorkItemCompleted |
                              UpsertWorkItemTriggered |
                              UpsertWorkItemFailed |
                              GetWorkItemsTriggered |
                              GetWorkItemsCompleted |
                              GetWorkItemsFailed |
                              GetWorkItemByIdTriggered |
                              GetWorkItemByIdCompleted |
                              GetWorkItemByIdFailed |
                              RefreshWorkItemList |
                              UpdateWorkItemField|
                              GetMultipleWorkitemsByIdTriggered |
                              GetMultipleWorkitemsByIdCompleted |
                              GetMultipleWorkitemsByIdFailed |
                              RefreshMoreWorkItems |
                              UpsertMultipleWorkItemTriggered |
                              UpsertMultipleWorkItemCompleted |
                              UpsertMultipleWorkItemFailed

