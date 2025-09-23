import { EntityState, createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { UserStory } from "../../models/userStory";
import { WorkItemActionTypes, WorkItemActions } from "../actions/template-userstories.action";

export interface State extends EntityState<UserStory> {
    loadingUserStories: boolean;
    getWorkItemById: boolean;
    upsertWorkItem: boolean;
    workItem: UserStory;
}

export const workItemAdapter: EntityAdapter<
    UserStory
> = createEntityAdapter<UserStory>({
    selectId: (templates: UserStory) => templates.userStoryId,
    sortComparer: (UserStorySortAsc: UserStory, UserStorySortDesc: UserStory) => UserStorySortDesc.createdDateTime.toString().localeCompare(UserStorySortAsc.createdDateTime.toString())
});

export const initialState: State = workItemAdapter.getInitialState({
    loadingUserStories: true,
    getWorkItemById: true,
    upsertWorkItem: false,
    workItem: null
})

export function reducer(state: State = initialState, action: WorkItemActions): State {
    switch (action.type) {
        case WorkItemActionTypes.GetWorkItemsTriggered:
            return initialState;
        case WorkItemActionTypes.GetWorkItemsCompleted:
            return workItemAdapter.addAll(action.WorkItemsList, {
                ...state,
                loadingUserStories: false
            })
        case WorkItemActionTypes.GetWorkItemsFailed:
            return { ...state, loadingUserStories: false };
        case WorkItemActionTypes.UpsertWorkItemTriggered:
            return { ...state, upsertWorkItem: true };
        case WorkItemActionTypes.UpsertWorkItemCompleted:
            return { ...state, upsertWorkItem: false };
        case WorkItemActionTypes.UpsertWorkItemFailed:
            return { ...state, upsertWorkItem: false };
        case WorkItemActionTypes.UpsertMultipleWorkItemTriggered:
            return { ...state, upsertWorkItem: true };
        case WorkItemActionTypes.UpsertMultipleWorkItemCompleted:
            return { ...state, upsertWorkItem: false };
        case WorkItemActionTypes.UpsertMultipleWorkItemFailed:
            return { ...state, upsertWorkItem: false };
        case WorkItemActionTypes.ExceptionHandled:
            return { ...state, loadingUserStories: false, upsertWorkItem: false, getWorkItemById: false };
        case WorkItemActionTypes.GetWorkItemByIdTriggered:
            return { ...state, getWorkItemById: true };
        case WorkItemActionTypes.GetWorkItemByIdCompleted:
            return { ...state, getWorkItemById: false, workItem: action.WorkItem };
        case WorkItemActionTypes.GetWorkItemByIdFailed:
            return { ...state, getWorkItemById: false };
        case WorkItemActionTypes.RefreshWorkItemList:
            return workItemAdapter.upsertOne(action.WorkItem, state);
        case WorkItemActionTypes.UpdateWorkItemField:
            return workItemAdapter.updateOne(action.WorkItemUpdates.WorkItemUpdate, state);
        case WorkItemActionTypes.RefreshMoreWorkItems:
            return workItemAdapter.upsertMany(action.WorkItemsList, state);
        default:
            return state;
    }
}