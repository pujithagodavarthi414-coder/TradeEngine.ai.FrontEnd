import { Action } from "@ngrx/store";
import { CommentApiReturnModel } from "../../models/commentApiReturnModel";
import { ValidationModel } from "../../models/validation-messages";
import { TestCase } from "../../models/testcase";
import { UserStoryCountModel } from "../../models/userstory-count-model";

export enum CommentsActionTypes {
  LoadCommentsByReceiverIdTriggered = "[SnovaAuditsModule Comments Component] Comments Load By Receiver Id Triggered",
  LoadCommentsByReceiverIdCompleted = "[SnovaAuditsModule Comments Component] Comments Load By Receiver Id Completed",
  UpsertCommentTriggered = "[SnovaAuditsModule Comments Component] Upsert Comment Triggered",
  UpsertCommentCompleted = "[SnovaAuditsModule Comments Component] Upsert Comment Completed",
  UpsertCommentFailed = "[SnovaAuditsModule Comments Component] Upsert Comment Failed",
  LoadCommentsCountTriggered = "[SnovaAuditsModule Comments Component] Comments Count Triggered",
  LoadCommentsCountCompleted = "[SnovaAuditsModule Comments Component] Comments Count Completed",
  LoadBugsCountByUserStoryIdTriggered = "[SnovaAuditsModule Bug Component] Bugs Count By UserStory Id Triggered",
  LoadBugsCountByUserStoryIdCompleted = "[SnovaAuditsModule Bug Component] Bugs Count By UserStory Id Completed",
  LoadLinksCountByUserStoryIdTriggered = "[SnovaAuditsModule Links Component] Links Count By UserStory Id Triggered",
  LoadLinksCountByUserStoryIdCompleted = "[SnovaAuditsModule Links Component] Links Count By UserStory Id Completed",
  LoadBugsCountByGoalIdTriggered = "[SnovaAuditsModule Bugs Component] Bugs Count By Goal Id Triggered",
  LoadBugsCountByGoalIdCompleted = "[SnovaAuditsModule Bugs Component] Bugs Count By Goal Id Completed"
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

