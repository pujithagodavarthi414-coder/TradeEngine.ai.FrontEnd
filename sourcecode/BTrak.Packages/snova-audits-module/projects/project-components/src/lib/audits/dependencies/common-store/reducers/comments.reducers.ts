import { EntityState, createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import {
  CommentsActionTypes,
  LoadCommentsByReceiverIdCompleted,
  LoadCommentsCountCompleted,
  LoadBugsCountByUserStoryIdCompleted,
  LoadBugsCountByGoalIdCompleted,
  LoadLinksCountByUserStoryIdCompleted
} from "../actions/comments.actions";
import { Action } from "@ngrx/store";
import { CommentApiReturnModel } from "../../models/commentApiReturnModel";

export interface State extends EntityState<CommentApiReturnModel> {
  loadingCommentsByReceiverId: boolean;
  upsertCommentOperationInProgress: boolean;
  commentsCount:number;
  userStoryLinksCount:number;
  bugsByUserStoryIdCount:number;
  bugsByGoalIdCount:number;
}

export const commentsAdapter: EntityAdapter<
  CommentApiReturnModel
> = createEntityAdapter<CommentApiReturnModel>({
  selectId: (comment: CommentApiReturnModel) => comment.commentId
});

export const initialState: State = commentsAdapter.getInitialState({
  loadingCommentsByReceiverId: false,
  upsertCommentOperationInProgress: false,
  upsertCommentId: null,
  commentsCount:0,
  userStoryLinksCount:0,
  bugsByUserStoryIdCount:0,
  bugsByGoalIdCount:0
});

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CommentsActionTypes.LoadCommentsByReceiverIdTriggered:
      return { ...state, loadingCommentsByReceiverId: true };
    case CommentsActionTypes.LoadCommentsByReceiverIdCompleted:
      return commentsAdapter.addAll(
        (action as LoadCommentsByReceiverIdCompleted).comments,
        {
          ...state,
          loadingCommentsByReceiverId: false,
          upsertCommentOperationInProgress: false
        }
      );
    case CommentsActionTypes.UpsertCommentTriggered:
      return { ...state, upsertCommentOperationInProgress: true };
    case CommentsActionTypes.UpsertCommentCompleted:
      return { ...state, upsertCommentOperationInProgress: false };
    case CommentsActionTypes.UpsertCommentFailed:
        return { ...state, upsertCommentOperationInProgress: false };
    case CommentsActionTypes.LoadCommentsCountCompleted:
      return { ...state,  commentsCount:(action as LoadCommentsCountCompleted).commentsCount.commentsCount};
    case CommentsActionTypes.LoadBugsCountByUserStoryIdCompleted:
      return { ...state,  bugsByUserStoryIdCount:(action as LoadBugsCountByUserStoryIdCompleted).bugsCountByUserStoryId};
    case CommentsActionTypes.LoadBugsCountByGoalIdCompleted:
      return { ...state,  bugsByGoalIdCount:(action as LoadBugsCountByGoalIdCompleted).bugsCountByGoalId};
    case CommentsActionTypes.LoadLinksCountByUserStoryIdCompleted:
        return { ...state,  userStoryLinksCount:(action as LoadLinksCountByUserStoryIdCompleted).linksCount};
    default:
      return state;
  }
}