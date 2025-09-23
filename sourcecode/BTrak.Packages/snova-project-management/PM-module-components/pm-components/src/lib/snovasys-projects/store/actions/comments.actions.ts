import { Action } from "@ngrx/store";
import { CommentApiReturnModel } from '@snovasys/snova-comments';
import { UserStoryCountModel } from '../../models/userstory-count-model';
import { TestCase } from '@snovasys/snova-testrepo';
import { ValidationModel } from '../../models/validation-messages';


export enum CommentsActionTypes {
  LoadCommentsByReceiverIdTriggered = "[Snovasys-PM][Comments Component] Comments Load By Receiver Id Triggered",
  LoadCommentsByReceiverIdCompleted = "[Snovasys-PM][Comments Component] Comments Load By Receiver Id Completed",
  UpsertCommentTriggered = "[Snovasys-PM][Comments Component] Upsert Comment Triggered",
  UpsertCommentCompleted = "[Snovasys-PM][Comments Component] Upsert Comment Completed",
  UpsertCommentFailed = "[Snovasys-PM][Comments Component] Upsert Comment Failed",
  LoadCommentsCountTriggered = "[Snovasys-PM][Comments Component] Comments Count Triggered",
  LoadCommentsCountCompleted = "[Snovasys-PM][Comments Component] Comments Count Completed",
  LoadBugsCountByUserStoryIdTriggered = "[Snovasys-PM][Bug Component] Bugs Count By UserStory Id Triggered",
  LoadBugsCountByUserStoryIdCompleted = "[Snovasys-PM][Bug Component] Bugs Count By UserStory Id Completed",
  LoadLinksCountByUserStoryIdTriggered = "[Snovasys-PM][Links Component] Links Count By UserStory Id Triggered",
  LoadLinksCountByUserStoryIdCompleted = "[Snovasys-PM][Links Component] Links Count By UserStory Id Completed",
  LoadBugsCountByGoalIdTriggered = "[Snovasys-PM][Bugs Component] Bugs Count By Goal Id Triggered",
  LoadBugsCountByGoalIdCompleted = "[Snovasys-PM][Bugs Component] Bugs Count By Goal Id Completed"
}

export class LoadCommentsByReceiverIdTriggered implements Action {
  type = CommentsActionTypes.LoadCommentsByReceiverIdTriggered;
  comments: CommentApiReturnModel[];
  constructor(public receiverId: string) {}
}

export class LoadCommentsByReceiverIdCompleted implements Action {
  type = CommentsActionTypes.LoadCommentsByReceiverIdCompleted;
  constructor(public comments: CommentApiReturnModel[]) {}
}

export class UpsertCommentTriggered implements Action {
  type = CommentsActionTypes.UpsertCommentTriggered;
  constructor(public receiverId: string, public comment: string) {}
}

export class LoadCommentsCountTriggered implements Action {
  type = CommentsActionTypes.LoadCommentsCountTriggered;
  constructor(public userStoryId: string) {}
}


export class LoadCommentsCountCompleted implements Action {
  type = CommentsActionTypes.LoadCommentsCountCompleted;
  constructor(public commentsCount: UserStoryCountModel) {}
}

export class LoadBugsCountByUserStoryIdTriggered implements Action {
  type = CommentsActionTypes.LoadBugsCountByUserStoryIdTriggered;
  constructor(public countByUserStoryId: TestCase) {}
}

export class LoadBugsCountByUserStoryIdCompleted implements Action {
  type = CommentsActionTypes.LoadBugsCountByUserStoryIdCompleted;
  constructor(public bugsCountByUserStoryId: number) {}
}

export class LoadLinksCountByUserStoryIdTriggered implements Action {
  type = CommentsActionTypes.LoadLinksCountByUserStoryIdTriggered;
  constructor(public userStoryId: string, public isSprintUserStories: boolean) {}
}

export class LoadLinksCountByUserStoryIdCompleted implements Action {
  type = CommentsActionTypes.LoadLinksCountByUserStoryIdCompleted;
  constructor(public linksCount: number) {}
}

export class LoadBugsCountByGoalIdTriggered implements Action {
  type = CommentsActionTypes.LoadBugsCountByGoalIdTriggered;
  constructor(public countByGoalId: TestCase) {}
}

export class LoadBugsCountByGoalIdCompleted implements Action {
  type = CommentsActionTypes.LoadBugsCountByGoalIdCompleted;
  constructor(public bugsCountByGoalId: number) {}
}

export class UpsertCommentCompleted implements Action {
  type = CommentsActionTypes.UpsertCommentCompleted;

  constructor(public receiverId: string, public commentId: string) {}
}

export class UpsertCommentFailed implements Action {
  type = CommentsActionTypes.UpsertCommentFailed;

  constructor(public validationMessages:ValidationModel[]) {}
}

export type LoadCommentsActions =
  | LoadCommentsByReceiverIdTriggered
  | LoadCommentsByReceiverIdCompleted;
export type UpsertCommentsActions =
  | UpsertCommentTriggered
  | UpsertCommentCompleted;

  export type CommentsCountActions =
  | LoadCommentsCountTriggered
  | LoadCommentsCountCompleted
  | LoadBugsCountByUserStoryIdTriggered
  | LoadBugsCountByUserStoryIdCompleted
  | LoadBugsCountByGoalIdTriggered
  | LoadBugsCountByGoalIdCompleted
  | LoadLinksCountByUserStoryIdTriggered
  | LoadLinksCountByUserStoryIdCompleted;

