import { EntityState, createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { UserStory } from "../../models/userStory";
import { SprintWorkItemActionTypes, SprintWorkItemActions } from "../actions/sprint-userstories.action";

export interface State extends EntityState<UserStory> {
    loadingUserStories: boolean;
    getWorkItemById: boolean;
    upsertWorkItem: boolean;
    archiveWorkItem: boolean;
    parkWorkItem: boolean;
    workItem: UserStory;
    uniqueWorkItem: UserStory;
    upsertTagsLoading: boolean;
    userStories: UserStory[];
    loadingSubTasks: boolean;
    moveUserStorySprint: boolean;
    creatingMultipleUserStories: boolean;
    reOrderUserStories: boolean;
    insertAutoLogTime: boolean;
    archiveKanbanWorkItems: boolean;
}

export const sprintWorkItemAdapter: EntityAdapter<
    UserStory
> = createEntityAdapter<UserStory>({
    selectId: (templates: UserStory) => templates.userStoryId,
    sortComparer: (UserStorySortAsc: UserStory, UserStorySortDesc: UserStory) => UserStorySortDesc.createdDateTime.toString().localeCompare(UserStorySortAsc.createdDateTime.toString())
});

export const initialState: State = sprintWorkItemAdapter.getInitialState({
    loadingUserStories: false,
    getWorkItemById: false,
    upsertWorkItem: false,
    archiveWorkItem: false,
    parkWorkItem: false,
    workItem: null,
    uniqueWorkItem: null,
    upsertTagsLoading: false,
    loadingSubTasks: false,
    moveUserStorySprint: false,
    userStories: [],
    creatingMultipleUserStories: false,
    reOrderUserStories: false,
    insertAutoLogTime: false,
    archiveKanbanWorkItems: false
})

export function reducer(state: State = initialState, action: SprintWorkItemActions): State {
    switch (action.type) {
        case SprintWorkItemActionTypes.GetSprintWorkItemTriggered:
            return { ...initialState, loadingUserStories: true };
        case SprintWorkItemActionTypes.GetSprintWorkItemCompleted:
            return sprintWorkItemAdapter.addAll(action.WorkItemsList, {
                ...state,
                loadingUserStories: false
            })
        case SprintWorkItemActionTypes.GetSprintWorkItemFailed:
            return { ...state, loadingUserStories: false };
        case SprintWorkItemActionTypes.UpsertSprintWorkItemTriggered:
            return { ...state, upsertWorkItem: true };
        case SprintWorkItemActionTypes.UpsertSprintWorkItemCompleted:
            return { ...state, upsertWorkItem: false };
        case SprintWorkItemActionTypes.UpsertSprintWorkItemFailed:
            return { ...state, upsertWorkItem: false };
        case SprintWorkItemActionTypes.UpsertMultipleSprintWorkItemTriggered:
            return { ...state, upsertWorkItem: true };
        case SprintWorkItemActionTypes.UpsertMultipleSprintWorkItemCompleted:
            return { ...state, upsertWorkItem: false };
        case SprintWorkItemActionTypes.UpsertMultipleSprintWorkItemFailed:
            return { ...state, upsertWorkItem: false };
        case SprintWorkItemActionTypes.ExceptionHandled:
            return { ...state, loadingUserStories: false, upsertWorkItem: false, getWorkItemById: false };
        case SprintWorkItemActionTypes.GetSprintWorkItemByIdTriggered:
            return { ...state, getWorkItemById: true };
        case SprintWorkItemActionTypes.GetSprintWorkItemByIdCompleted:
            return { ...state, getWorkItemById: false, workItem: action.SprintWorkItem,insertAutoLogTime: false };
        case SprintWorkItemActionTypes.GetSprintWorkItemByIdFailed:
            return { ...state, getWorkItemById: false };
        case SprintWorkItemActionTypes.GetUniqueSprintWorkItemByIdTriggered:
            return { ...state, getWorkItemById: true };
        case SprintWorkItemActionTypes.GetUniqueSprintWorkItemByIdCompleted:
            return { ...state, getWorkItemById: false, uniqueWorkItem: action.SprintWorkItem };
        case SprintWorkItemActionTypes.GetUniqueSprintWorkItemByIdFailed:
            return { ...state, getWorkItemById: false };
        case SprintWorkItemActionTypes.RefreshSprintWorkItemList:
            return sprintWorkItemAdapter.upsertOne(action.SprintWorkItem, state);
        case SprintWorkItemActionTypes.UpdateSprintWorkItemField:
            return sprintWorkItemAdapter.updateOne(action.WorkItemUpdates.WorkItemUpdate, state);
        case SprintWorkItemActionTypes.RefreshMoreSprintWorkItem:
            return sprintWorkItemAdapter.upsertMany(action.WorkItemsList, state);
        case SprintWorkItemActionTypes.UpsertSprintSubTaskCompleted:
            return { ...state, loadingUserStories: false, archiveWorkItem: false, parkWorkItem: false, upsertWorkItem: false, upsertTagsLoading: false, creatingMultipleUserStories: false };
        case SprintWorkItemActionTypes.UpdateMultipleSprintWorkItemField:
            return sprintWorkItemAdapter.updateMany(action.userStoryUpdatesMultiple.userStoryUpdateMultiple, state);
        case SprintWorkItemActionTypes.ArchiveSprintWorkItemTriggred:
            return { ...state, archiveWorkItem: false };
        case SprintWorkItemActionTypes.ArchiveSprintWorkItemCompleted:
            state = sprintWorkItemAdapter.removeOne(action.WorkItemId, state);
            return { ...state, archiveWorkItem: false };
        case SprintWorkItemActionTypes.ArchiveSprintWorkItemFailed:
            return { ...state, archiveWorkItem: false };
        case SprintWorkItemActionTypes.ParkSprintWorkItemTriggred:
            return { ...state, parkWorkItem: false };
        case SprintWorkItemActionTypes.ParkSprintWorkItemCompleted:
            state = sprintWorkItemAdapter.removeOne(action.WorkItemId, state);
            return { ...state, parkWorkItem: false };
        case SprintWorkItemActionTypes.ParkSprintWorkItemFailed:
            return { ...state, parkWorkItem: false };
        case SprintWorkItemActionTypes.UpsertWorkItemTagsTriggered:
            return { ...state, upsertTagsLoading: true };
        case SprintWorkItemActionTypes.UpsertWorkItemTagsCompleted:
            return { ...state, upsertTagsLoading: false };
        case SprintWorkItemActionTypes.UpsertWorkItemTagsFailed:
            return { ...state, upsertTagsLoading: false };
        case SprintWorkItemActionTypes.GetSprintWorkItemSubTasksTriggered:
            return { ...state, loadingSubTasks: true };
        case SprintWorkItemActionTypes.GetSprintWorkItemSubTasksCompleted:
            return { ...state, loadingSubTasks: false, userStories: action.WorkItemsList };
        case SprintWorkItemActionTypes.GetSprintWorkItemSubTasksFailed:
            return { ...state, loadingSubTasks: false };
        case SprintWorkItemActionTypes.InsertSprintWorkItemReplanTriggered:
            return { ...state, upsertWorkItem: true };
        case SprintWorkItemActionTypes.InsertSprintWorkItemReplanCompleted:
            return { ...state, upsertWorkItem: false };
        case SprintWorkItemActionTypes.InsertSprintWorkItemReplanFailed:
            return { ...state, upsertWorkItem: false };
        case SprintWorkItemActionTypes.MoveGoalUserStoryToSprintTriggered:
            return { ...state, moveUserStorySprint: true };
        case SprintWorkItemActionTypes.MoveGoalUserStoryToSprintCompleted:
            return { ...state, moveUserStorySprint: false };
        case SprintWorkItemActionTypes.MoveGoalUserStoryToSprintFailed:
            return { ...state, moveUserStorySprint: false };
        case SprintWorkItemActionTypes.UpdateUserStorySprintTriggered:
            return { ...state, moveUserStorySprint: true };
        case SprintWorkItemActionTypes.UpdateUserStorySprintCompleted:
            state = sprintWorkItemAdapter.removeOne(action.WorkItemId, state);
            return { ...state, moveUserStorySprint: false };
        case SprintWorkItemActionTypes.UpdateUserStorySprintFailed:
            return { ...state, moveUserStorySprint: false };
        case SprintWorkItemActionTypes.CreateMultipleSprintUserStoriesTriggered:
            return { ...state, creatingMultipleUserStories: true };
        case SprintWorkItemActionTypes.CreateMultiplSprintUserStoriesCompleted:
            return { ...state, creatingMultipleUserStories: false };
        case SprintWorkItemActionTypes.CreateMultipleSprintUserStoriesFailed:
            return { ...state, creatingMultipleUserStories: false };
        case SprintWorkItemActionTypes.UpdateSprintSubTaskUserStoryTriggered:
            return { ...state, upsertWorkItem: true };
        case SprintWorkItemActionTypes.UpdateSprintSubTaskUserStoryCompleted:
            return { ...state, upsertWorkItem: false };
        case SprintWorkItemActionTypes.UpdateSprintSubTaskUserStoryFailed:
            return { ...state, upsertWorkItem: false };
        case SprintWorkItemActionTypes.ReOrderSprintUserStoriesTriggred:
            return { ...state, reOrderUserStories: true };
        case SprintWorkItemActionTypes.ReOrderSprintUserStoriesCompleted:
            return { ...state, reOrderUserStories: false };
        case SprintWorkItemActionTypes.ReOrderSprintUserStoriesFailed:
            return { ...state, reOrderUserStories: false };
        case SprintWorkItemActionTypes.ArchiveKanbanSprintsTriggered:
            return { ...state, archiveKanbanWorkItems: true };
        case SprintWorkItemActionTypes.ArchiveKanbanSprintsCompleted:
            state = sprintWorkItemAdapter.removeMany(action.workItemIds, state);
            return { ...state, archiveKanbanWorkItems: false };
        case SprintWorkItemActionTypes.ArchiveKanbanSprintsFailed:
            return { ...state, archiveKanbanWorkItems: false };
        default:
            return state;
    }
}