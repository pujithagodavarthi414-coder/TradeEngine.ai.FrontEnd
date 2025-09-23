import { Action } from "@ngrx/store";
import { FeedBackModel } from "../../models/feedbackModel";
import { ValidationModel } from "../../models/validation-messages";
import { UserStory } from "../../models/userStory";

export enum FeedBackActionTypes {
    SubmitFeedBackTriggered = "[SnovaAudisModule FeedBack] Submit FeedBack Triggered",
    SubmitFeedBackCompleted = "[SnovaAudisModule FeedBack] Submit FeedBack Completed",
    SubmitFeedBackFailed = "[SnovaAudisModule FeedBack] Submit FeedBack Failed",
    GetFeedbacksTriggered = "[SnovaAudisModule FeedBack] GetFeedbacks Triggered",
    GetFeedbacksCompleted = "[SnovaAudisModule FeedBack] GetFeedbacks Completed",
    GetFeedbacksFailed = "[SnovaAudisModule FeedBack] GetFeedbacks Failed",
    GetFeedbackByIdTriggered = "[SnovaAudisModule FeedBack] Get Feedback by Id Triggered",
    GetFeedbackByIdCompleted = "[SnovaAudisModule FeedBack] Get Feedback by Id Completed",
    GetFeedbackByIdFailed = "[SnovaAudisModule FeedBack] Get Feedback by Id Failed",
    GetMoreFeedbacksLoaded = "[SnovaAudisModule FeedBack] Get More Feedbacks Loaded",
    SubmitBugFeedbackTriggered = "[SnovaAudisModule FeedBack]Submit Bug Feedback Triggered",
    SubmitBugFeedbackCompleted = "[SnovaAudisModule FeedBack]Submit Bug Feedback Completed",
    SubmitBugFeedbackFailed = "[SnovaAudisModule FeedBack]Submit Bug Feedback Failed",
    UpsertMissingFeatureTriggered = "[SnovaAudisModule Feedback]Upsert Missing Feature Triggered",
    UpsertMissingFeatureCompleted = "[SnovaAudisModule Feedback]Upsert Missing Feature Completed",
    UpsertMissingFeatureFailed = "[SnovaAudisModule Feedback]Upsert Missing Feature Failed",
    ExceptionHandled = "[SnovaAudisModule FeedBack]Exception Handled"
}

export class SubmitFeedBackTriggered implements Action {
    type = FeedBackActionTypes.SubmitFeedBackTriggered
    feedBacksList: FeedBackModel [];
    validationMessages: ValidationModel[];
    feedBackId: string;
    errorMessage: string;
    userStory: UserStory;
    userStoryId: string;
    constructor(public feedBackModel: FeedBackModel) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetMoreFeedbacksLoaded implements Action {
    type = FeedBackActionTypes.GetMoreFeedbacksLoaded
    feedBacksList: FeedBackModel [];
    validationMessages: ValidationModel[];
    feedBackId: string;
    errorMessage: string;
    userStory: UserStory;
    userStoryId: string;
    constructor(public feedBackModel: FeedBackModel) { }
}

// tslint:disable-next-line: max-classes-per-file
export class SubmitFeedBackCompleted implements Action {
    type = FeedBackActionTypes.SubmitFeedBackCompleted
    feedBacksList: FeedBackModel [];
    validationMessages: ValidationModel[];
    feedBackModel: FeedBackModel;
    errorMessage: string;
    userStory: UserStory;
    userStoryId: string;
    constructor(public feedBackId: string) { }
}

// tslint:disable-next-line: max-classes-per-file
export class SubmitFeedBackFailed implements Action {
    type = FeedBackActionTypes.SubmitFeedBackFailed
    feedBacksList: FeedBackModel [];
    feedBackModel: FeedBackModel;
    feedBackId: string;
    errorMessage: string;
    userStory: UserStory;
    userStoryId: string;
    constructor(public validationMessages: ValidationModel[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetFeedbacksTriggered implements Action {
    type = FeedBackActionTypes.GetFeedbacksTriggered
    feedBacksList: FeedBackModel [];
    validationMessages: ValidationModel[];
    feedBackId: string;
    errorMessage: string;
    userStory: UserStory;
    userStoryId: string;
    constructor(public feedBackModel: FeedBackModel) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetFeedbacksCompleted implements Action {
    type = FeedBackActionTypes.GetFeedbacksCompleted
    validationMessages: ValidationModel[];
    feedBackModel: FeedBackModel;
    errorMessage: string;
    feedBackId: string;
    userStory: UserStory;
    userStoryId: string;
    constructor(public feedBacksList: FeedBackModel []) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetFeedbacksFailed implements Action {
    type = FeedBackActionTypes.GetFeedbacksFailed
    feedBacksList: FeedBackModel [];
    feedBackModel: FeedBackModel;
    feedBackId: string;
    errorMessage: string;
    userStory: UserStory;
    userStoryId: string;
    constructor(public validationMessages: ValidationModel[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetFeedbackByIdTriggered implements Action {
    type = FeedBackActionTypes.GetFeedbackByIdTriggered
    feedBacksList: FeedBackModel [];
    validationMessages: ValidationModel[];
    feedBackModel: FeedBackModel;
    errorMessage: string;
    userStory: UserStory;
    userStoryId: string;
    constructor(public feedBackId: string) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetFeedbackByIdCompleted implements Action {
    type = FeedBackActionTypes.GetFeedbackByIdCompleted
    feedBacksList: FeedBackModel [];
    validationMessages: ValidationModel[];
    feedBackId: string;
    errorMessage: string;
    userStory: UserStory;
    userStoryId: string;
    constructor(public feedBackModel: FeedBackModel) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetFeedbackByIdFailed implements Action {
    type = FeedBackActionTypes.GetFeedbackByIdFailed
    feedBacksList: FeedBackModel [];
    feedBackModel: FeedBackModel;
    feedBackId: string;
    errorMessage: string;
    userStory: UserStory;
    userStoryId: string;
    constructor(public validationMessages: ValidationModel[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class SubmitBugFeedbackTriggered implements Action {
    type = FeedBackActionTypes.SubmitBugFeedbackTriggered
    feedBacksList: FeedBackModel [];
    validationMessages: ValidationModel[];
    feedBackModel: FeedBackModel;
    errorMessage: string;
    feedBackId: string;
    userStoryId: string;
    constructor(public   userStory: UserStory) { }
}

// tslint:disable-next-line: max-classes-per-file
export class SubmitBugFeedbackCompleted implements Action {
    type = FeedBackActionTypes.SubmitBugFeedbackCompleted
    feedBacksList: FeedBackModel [];
    validationMessages: ValidationModel[];
    feedBackId: string;
    errorMessage: string;
    userStory: UserStory;
    feedBackModel: FeedBackModel;
    constructor(public userStoryId: string) { }
}

// tslint:disable-next-line: max-classes-per-file
export class SubmitBugFeedbackFailed implements Action {
    type = FeedBackActionTypes.SubmitBugFeedbackFailed
    feedBacksList: FeedBackModel [];
    feedBackModel: FeedBackModel;
    feedBackId: string;
    errorMessage: string;
    userStory: UserStory;
    userStoryId: string;
    constructor(public validationMessages: ValidationModel[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class UpsertMissingFeatureTriggered implements Action {
    type = FeedBackActionTypes.UpsertMissingFeatureTriggered
    feedBacksList: FeedBackModel [];
    validationMessages: ValidationModel[];
    feedBackModel: FeedBackModel;
    errorMessage: string;
    feedBackId: string;
    userStoryId: string;
    constructor(public   userStory: UserStory) { }
}

// tslint:disable-next-line: max-classes-per-file
export class UpsertMissingFeatureCompleted implements Action {
    type = FeedBackActionTypes.UpsertMissingFeatureCompleted
    feedBacksList: FeedBackModel [];
    validationMessages: ValidationModel[];
    feedBackId: string;
    errorMessage: string;
    userStory: UserStory;
    feedBackModel: FeedBackModel;
    constructor(public userStoryId: string) { }
}

// tslint:disable-next-line: max-classes-per-file
export class UpsertMissingFeatureFailed implements Action {
    type = FeedBackActionTypes.UpsertMissingFeatureFailed
    feedBacksList: FeedBackModel [];
    feedBackModel: FeedBackModel;
    feedBackId: string;
    errorMessage: string;
    userStory: UserStory;
    userStoryId: string;
    constructor(public validationMessages: ValidationModel[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class ExceptionHandled implements Action {
    type = FeedBackActionTypes.ExceptionHandled
    feedBacksList: FeedBackModel [];
    feedBackModel: FeedBackModel;
    feedBackId: string;
    validationMessages: ValidationModel[];
    userStory: UserStory;
    userStoryId: string;
    constructor(public errorMessage: string) { }
}

export type FeedBackActions = SubmitFeedBackTriggered
    | SubmitFeedBackCompleted
    | SubmitFeedBackFailed
    | GetFeedbacksTriggered
    | GetFeedbacksCompleted
    | GetFeedbacksFailed
    | GetFeedbackByIdTriggered
    | GetFeedbackByIdCompleted
    | GetFeedbackByIdFailed
    | GetMoreFeedbacksLoaded
    | SubmitBugFeedbackTriggered
    | SubmitBugFeedbackCompleted
    | SubmitBugFeedbackFailed
    | UpsertMissingFeatureTriggered
    | UpsertMissingFeatureCompleted
    | UpsertMissingFeatureFailed
    | ExceptionHandled
