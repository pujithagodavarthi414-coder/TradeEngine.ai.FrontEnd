import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { FeedBackModel } from "../../models/feedbackModel";
import { FeedBackActions, FeedBackActionTypes } from "../actions/feedback.action";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<FeedBackModel> {
    upsertFeedBack: boolean;
    loadingFeedbacks: boolean;
    submitBugFeedback: boolean;
}

export const feedBackAdapter: EntityAdapter<
    FeedBackModel
> = createEntityAdapter<FeedBackModel>({
    selectId: (feedBack: FeedBackModel) => feedBack.feedbackId,
    sortComparer: (feedBackSortAsc: FeedBackModel, feedBackSortDesc: FeedBackModel) =>
        feedBackSortDesc.createdDateTime.toString().localeCompare(feedBackSortAsc.createdDateTime.toString())
});

export const initialState: State = feedBackAdapter.getInitialState({
    upsertFeedBack: false,
    loadingFeedbacks: true,
    submitBugFeedback: false
});

export function reducer(
    state: State = initialState,
    action: FeedBackActions
): State {
    switch (action.type) {
        case FeedBackActionTypes.GetFeedbacksTriggered:
            return initialState;
        case FeedBackActionTypes.GetFeedbacksCompleted:
            return feedBackAdapter.addMany(action.feedBacksList, {
                ...state,
                loadingFeedbacks: false
            });
        case FeedBackActionTypes.GetMoreFeedbacksLoaded:
            return { ...state, loadingFeedbacks: true };
        case FeedBackActionTypes.GetFeedbacksFailed:
            return { ...state, loadingFeedbacks: true };
        case FeedBackActionTypes.SubmitFeedBackTriggered:
            return { ...state, upsertFeedBack: true };
        case FeedBackActionTypes.SubmitFeedBackCompleted:
            return { ...state, upsertFeedBack: false };
        case FeedBackActionTypes.SubmitFeedBackFailed:
            return { ...state, upsertFeedBack: false };
        case FeedBackActionTypes.GetFeedbackByIdCompleted:
            return feedBackAdapter.upsertOne(action.feedBackModel, state);
        case FeedBackActionTypes.SubmitBugFeedbackTriggered:
            return { ...state, submitBugFeedback: true };
        case FeedBackActionTypes.SubmitBugFeedbackCompleted:
            return { ...state, submitBugFeedback: false };
        case FeedBackActionTypes.SubmitBugFeedbackFailed:
            return { ...state, submitBugFeedback: false };
        case FeedBackActionTypes.UpsertMissingFeatureTriggered:
            return { ...state, submitBugFeedback: true };
        case FeedBackActionTypes.UpsertMissingFeatureCompleted:
            return { ...state, submitBugFeedback: false };
        case FeedBackActionTypes.UpsertMissingFeatureFailed:
            return { ...state, submitBugFeedback: false };
        case FeedBackActionTypes.ExceptionHandled:
            return { ...state, upsertFeedBack: false, loadingFeedbacks: false };
        default:
            return state;
    }
}
