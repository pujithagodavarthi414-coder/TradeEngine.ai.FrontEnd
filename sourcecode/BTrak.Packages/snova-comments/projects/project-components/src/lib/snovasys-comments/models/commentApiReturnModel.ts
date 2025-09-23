import { UserMiniModel } from "./userMiniModel";

export class CommentApiReturnModel {
  commentId: string;
  commentedOnObjectId: string;
  commentedByUser: UserMiniModel;
  comment: string;
  parentCommentId: string;
  originallyCommentedDateTime: string;
  commentUpdatedDateTime: string;
  childComments: CommentApiReturnModel[];
}