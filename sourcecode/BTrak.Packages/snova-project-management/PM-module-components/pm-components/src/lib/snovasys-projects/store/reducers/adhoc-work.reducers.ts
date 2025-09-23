import { EntityState, createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { AdhocWorkActionTypes, AdhocWorkActions } from "../actions/adhoc-work.action";
import { UserStory } from "../../models/userStory";
import { ValidationModel } from "../../models/validation-messages";
import { CustomTagsModel } from "../../models/custom-tags-model";


export interface State extends EntityState<UserStory> {
    creatingAdhocWork: boolean;
    loadingAdhocUserStories: boolean;
    loadingAdhocWorkById: boolean;
    loadingUniqueAdhocById: boolean;
    adhocUserStory: UserStory;
    uniqueAdhocUserStory: UserStory;
    exceptionMessage: string;
    validationMessages: ValidationModel[];
    parkUserStory: boolean;
    archiveUserStory: boolean;
    upsertTagsLoading: boolean;
    searchCustomTagsLoading: boolean;
    customTagsModel: CustomTagsModel[];
}

export const adhocWorkAdapter: EntityAdapter<UserStory> = createEntityAdapter<
    UserStory
>(
    {
        selectId: (userStory: UserStory) => userStory.userStoryId,
        sortComparer: (userStoryAsc: UserStory, userStoryDesc: UserStory) =>
            userStoryDesc.createdDateTime.localeCompare(userStoryAsc.createdDateTime)
    }
);

export const initialState: State = adhocWorkAdapter.getInitialState({
    creatingAdhocWork: false,
    loadingAdhocUserStories: true,
    exceptionMessage: '',
    validationMessages: [],
    loadingAdhocWorkById: false,
    adhocUserStory: null,
    parkUserStory: false,
    archiveUserStory: false,
    upsertTagsLoading: false,
    searchCustomTagsLoading: false,
    customTagsModel: [],
    loadingUniqueAdhocById: false,
    uniqueAdhocUserStory: null
});

export function reducer(
    state: State = initialState,
    action: AdhocWorkActions
): State {
    switch (action.type) {
        case AdhocWorkActionTypes.LoadAdhocUserStoriesTriggered:
            return initialState;
        case AdhocWorkActionTypes.LoadAdhocUserStoriesCompleted:
            return adhocWorkAdapter.addAll(action.userStories, {
                ...state,
                loadingAdhocUserStories: false
            });
        case AdhocWorkActionTypes.LoadMoreAdhocUserStoriesTriggered:
            return { ...state, loadingAdhocUserStories: true };
        case AdhocWorkActionTypes.CreateAdhocWorkTriggered:
            return { ...state, creatingAdhocWork: true };
        case AdhocWorkActionTypes.CreateAdhocWorkCompleted:
            return { ...state, creatingAdhocWork: false };
        case AdhocWorkActionTypes.AdhocWorkExceptionHandled:
            return { ...state, exceptionMessage: action.errorMessage, creatingAdhocWork: false,loadingUniqueAdhocById: false };
        case AdhocWorkActionTypes.CreateAdhocWorkFailed:
            return { ...state, validationMessages: action.validationMessages, creatingAdhocWork: false };
        case AdhocWorkActionTypes.GetAdhocWorkUserStoryByIdTriggered:
            return { ...state, loadingAdhocWorkById: true }
        case AdhocWorkActionTypes.GetAdhocWorkUserStoryByIdCompleted:
            return { ...state, adhocUserStory: action.userStory, loadingAdhocWorkById: false }
        case AdhocWorkActionTypes.GetAdhocWorkUserStoryByIdFailed:
            return { ...state, validationMessages: action.validationMessages, loadingAdhocWorkById: false }
        case AdhocWorkActionTypes.GetAdhocWorkUniqueUserStoryByIdTriggered:
            return { ...state, loadingUniqueAdhocById: true }
        case AdhocWorkActionTypes.GetAdhocWorkUniqueUserStoryByIdCompleted:
            return { ...state, uniqueAdhocUserStory: action.userStory, loadingUniqueAdhocById: false }
        case AdhocWorkActionTypes.GetAdhocWorkUniqueUserStoryByIdFailed:
            return { ...state, validationMessages: action.validationMessages, loadingUniqueAdhocById: false }
        case AdhocWorkActionTypes.RefreshAhocUserStories:
            return adhocWorkAdapter.upsertOne(action.userStory, state);
        case AdhocWorkActionTypes.UpdateAdhocUserStories:
            return adhocWorkAdapter.updateOne(action.userStoryUpdate.userStoryUpdate, state);
        case AdhocWorkActionTypes.AdhocParkUserStoryTriggered:
            return { ...state, validationMessages: action.validationMessages, parkUserStory: true };
        case AdhocWorkActionTypes.AdhocParkUserStoryCompleted:
            state = adhocWorkAdapter.removeOne(action.userStoryId, state);
            return { ...state, parkUserStory: false };
        case AdhocWorkActionTypes.AdhocParkUserStoryFailed:
            return { ...state, parkUserStory: false };
        case AdhocWorkActionTypes.AdhocArchiveUserStoryTriggered:
            return { ...state, archiveUserStory: true };
        case AdhocWorkActionTypes.AdhocArchiveUserStoryCompleted:
            state = adhocWorkAdapter.removeOne(action.userStoryId, state);
            return { ...state, archiveUserStory: false };
        case AdhocWorkActionTypes.AdhocArchiveUserStoryFailed:
            return { ...state, archiveUserStory: false };
        case AdhocWorkActionTypes.AdhocWorkStatusChangedTriggered:
            return { ...state, creatingAdhocWork: true };
        case AdhocWorkActionTypes.AdhocWorkStatusChangedCompleted:
            state = adhocWorkAdapter.removeOne(action.userStoryId, state);
            return { ...state, creatingAdhocWork: false };
        case AdhocWorkActionTypes.UpsertAdhocUserStoryTagsTriggered:
            return { ...state, upsertTagsLoading: true };
        case AdhocWorkActionTypes.UpsertAdhocUserStoryTagsCompleted:
            return { ...state, upsertTagsLoading: false }
        case AdhocWorkActionTypes.UpsertAdhocUserStoryTagsFailed:
            return { ...state, upsertTagsLoading: false }
        case AdhocWorkActionTypes.SearchAdhocTagsTriggered:
            return { ...state, searchCustomTagsLoading: true }
        case AdhocWorkActionTypes.SearchAdhocTagsCompleted:
            return { ...state, searchCustomTagsLoading: false, customTagsModel: action.customTagsModel };
        case AdhocWorkActionTypes.SearchAdhocTagsFailed:
            return { ...state, searchCustomTagsLoading: false };
        default:
            return state;
    }
}