import { Action } from "@ngrx/store";
import { UserStory } from "../../../../views/projects/models/userStory";
import { ValidationModel } from "../../../../views/assetmanagement/models/validation-messages";
import { AdhocWorkSearchCriteriaInputModel } from "../../models/adhocWorkSearchCriteriaModel";
import { Update } from "@ngrx/entity";
import { ParkUserStoryInputModel } from "app/views/projects/models/parkedUserstoryModel";
import { ArchivedUserStoryInputModel } from "app/views/projects/models/archivedUserStoryModel";
import { UserStoryInputTagsModel } from "app/views/projects/models/user-story-tags.model";
import { CustomTagsModel } from "app/views/projects/models/custom-tags-model";


export enum AdhocWorkActionTypes {
    CreateAdhocWorkTriggered = "[SnovaAudisModule Adhocwork Component] Create Adhoc work triggered",
    CreateAdhocWorkCompleted = "[SnovaAudisModule Adhocwork Component] Create Adhoc work Completed",
    CreateAdhocWorkFailed = "[SnovaAudisModule Adhocwork Component] Create Adhoc work failed",
    ExceptionHandled = "[SnovaAudisModule Adhocwork Component]Exception Handled",
    LoadAdhocUserStoriesTriggered = "[SnovaAudisModule Adhocwork Component]Load Adhocwork userstories triggered",
    LoadMoreAdhocUserStoriesTriggered = "[SnovaAudisModule Adhocwork Component]Load More Adhocwork userstories triggered",
    LoadAdhocUserStoriesCompleted = "[SnovaAudisModule Adhocwork Component]Load Adhocwork userstories completed",
    LoadAdhocUserStoriesFailed = "[SnovaAudisModule Adhocwork Component]Load Adhocwork userstories failed",
    RefreshAhocUserStories = "[SnovaAudisModule Adhocwork Component]Refresh Adhocwork userstories",
    UpdateAdhocUserStories = "[SnovaAudisModule Adhocwork Component]Update Adhocwork userstories",
    GetAdhocWorkUserStoryByIdTriggered = "[SnovaAudisModule Adhocwork Component]Get Adhocwork userstory by Id triggered",
    GetAdhocWorkUserStoryByIdCompleted = "[SnovaAudisModule Adhocwork Component]Get Adhocwork userstory by Id completed",
    GetAdhocWorkUserStoryByIdFailed = "[SnovaAudisModule Adhocwork Component]Get Adhocwork userstory by Id Failed",
    AdhocParkUserStoryTriggered = "[SnovaAudisModule Adhocwork Component]Adhoc  Park UserStory Triggered",
    AdhocParkUserStoryCompleted = "[SnovaAudisModule Adhocwork Component]Adhoc Park UserStory Completed",
    AdhocParkUserStoryFailed = "[SnovaAudisModule Adhocwork Component]Adhoc Park UserStory Failed",
    AdhocArchiveUserStoryTriggered = "[SnovaAudisModule Adhocwork Component] Archive UserStory Triggered",
    AdhocArchiveUserStoryCompleted = "[SnovaAudisModule Adhocwork Component] Archive UserStory Completed",
    AdhocArchiveUserStoryFailed = "[SnovaAudisModule Adhocwork Component] Archive UserStory Failed",
    AdhocWorkStatusChangedTriggered = "[SnovaAudisModule Adhocwork Component] UserStory Status changed Triggered",
    AdhocWorkStatusChangedCompleted = "[SnovaAudisModule Adhocwork Component] UserStory Status changed completed",
    UpsertAdhocUserStoryTagsTriggered = "[SnovaAudisModule Adhocwork Component]Adhoc UserStory Tags Triggered",
    UpsertAdhocUserStoryTagsCompleted = "[SnovaAudisModule Adhocwork Component]Adhoc UserStory Tags Completed",
    UpsertAdhocUserStoryTagsFailed = "[SnovaAudisModule Adhocwork Component]Adhoc UserStory Tags Failed",
    SearchAdhocTagsTriggered = "[SnovaAudisModule Goal] Search Adhoc Tags Triggered",
    SearchAdhocTagsCompleted = "[SnovaAudisModule Goal] Search Adhoc Tags Completed",
    SearchAdhocTagsFailed = "[SnovaAudisModule Goal] Search Adhoc Tags Failed",
    GetAdhocWorkUniqueUserStoryByIdTriggered = "[SnovaAudisModule Adhocwork Component]Get Adhocwork unique userstory by Id triggered",
    GetAdhocWorkUniqueUserStoryByIdCompleted = "[SnovaAudisModule Adhocwork Component]Get Adhocwork unique userstory by Id completed",
    GetAdhocWorkUniqueUserStoryByIdFailed = "[SnovaAudisModule Adhocwork Component]Get Adhocwork unique userstory by Id Failed",
}

export class CreateAdhocWorkTriggered implements Action {
    type = AdhocWorkActionTypes.CreateAdhocWorkTriggered
    userStoryId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    constructor(public userStory: UserStory) { }
}

export class CreateAdhocWorkCompleted implements Action {
    type = AdhocWorkActionTypes.CreateAdhocWorkCompleted
    userStory: UserStory;
    validationMessages: ValidationModel[];
    errorMessage: string;
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    constructor(public userStoryId: string) { }
}

export class CreateAdhocWorkFailed implements Action {
    type = AdhocWorkActionTypes.CreateAdhocWorkFailed
    userStory: UserStory;
    userStoryId: string;
    errorMessage: string;
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    constructor(public validationMessages: ValidationModel[]) { }
}

export class LoadAdhocUserStoriesTriggered implements Action {
    type = AdhocWorkActionTypes.LoadAdhocUserStoriesTriggered
    userStoryId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    userStory: UserStory;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    constructor(public adhocWorkModel: AdhocWorkSearchCriteriaInputModel) { }
}

export class LoadMoreAdhocUserStoriesTriggered implements Action {
    type = AdhocWorkActionTypes.LoadMoreAdhocUserStoriesTriggered
    userStoryId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    userStory: UserStory;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    constructor(public adhocWorkModel: AdhocWorkSearchCriteriaInputModel) { }
}

export class LoadAdhocUserStoriesCompleted implements Action {
    type = AdhocWorkActionTypes.LoadAdhocUserStoriesCompleted
    userStoryId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    userStory: UserStory;
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    constructor(public userStories: UserStory[]) { }
}

export class LoadAdhocUserStoriesFailed implements Action {
    type = AdhocWorkActionTypes.LoadAdhocUserStoriesFailed
    userStoryId: string;
    userStories: UserStory[];
    errorMessage: string;
    userStory: UserStory;
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    constructor(public validationMessages: ValidationModel[]) { }
}

export class RefreshAhocUserStories implements Action {
    type = AdhocWorkActionTypes.RefreshAhocUserStories
    userStoryId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    constructor(public userStory: UserStory) { }
}

export class UpdateAdhocUserStories implements Action {
    type = AdhocWorkActionTypes.UpdateAdhocUserStories;
    userStoryId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStories: UserStory[];
    userStory: UserStory;
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    constructor(public userStoryUpdate: { userStoryUpdate: Update<UserStory> }) { }
}

export class GetAdhocWorkUserStoryByIdTriggered implements Action {
    type = AdhocWorkActionTypes.GetAdhocWorkUserStoryByIdTriggered
    userStory: UserStory;
    validationMessages: ValidationModel[];
    errorMessage: string;
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    constructor(public userStoryId: string) { }
}


export class GetAdhocWorkUserStoryByIdCompleted implements Action {
    type = AdhocWorkActionTypes.GetAdhocWorkUserStoryByIdCompleted
    userStoryId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    constructor(public userStory: UserStory) { }
}

export class GetAdhocWorkUserStoryByIdFailed implements Action {
    type = AdhocWorkActionTypes.GetAdhocWorkUserStoryByIdFailed
    userStory: UserStory;
    userStoryId: string;
    errorMessage: string;
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    constructor(public validationMessages: ValidationModel[]) { }
}

export class GetAdhocWorkUniqueUserStoryByIdTriggered implements Action {
    type = AdhocWorkActionTypes.GetAdhocWorkUniqueUserStoryByIdTriggered
    userStory: UserStory;
    validationMessages: ValidationModel[];
    errorMessage: string;
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    constructor(public userStoryId: string) { }
}


export class GetAdhocWorkUniqueUserStoryByIdCompleted implements Action {
    type = AdhocWorkActionTypes.GetAdhocWorkUniqueUserStoryByIdCompleted
    userStoryId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    constructor(public userStory: UserStory) { }
}

export class GetAdhocWorkUniqueUserStoryByIdFailed implements Action {
    type = AdhocWorkActionTypes.GetAdhocWorkUniqueUserStoryByIdFailed
    userStory: UserStory;
    userStoryId: string;
    errorMessage: string;
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    constructor(public validationMessages: ValidationModel[]) { }
}


export class AdhocParkUserStoryTriggered implements Action {
    type = AdhocWorkActionTypes.AdhocParkUserStoryTriggered
    userStory: UserStory;
    userStoryId: string;
    validationMessages: ValidationModel[];
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    errorMessage: string;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    constructor(public parkUserStory: ParkUserStoryInputModel) { }
}

export class AdhocParkUserStoryCompleted implements Action {
    type = AdhocWorkActionTypes.AdhocParkUserStoryCompleted
    userStory: UserStory;
    validationMessages: ValidationModel[];
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    errorMessage: string;
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    constructor(public userStoryId: string) { }
}
export class AdhocParkUserStoryFailed implements Action {
    type = AdhocWorkActionTypes.AdhocParkUserStoryFailed
    userStory: UserStory;
    userStoryId: string;
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    errorMessage: string;
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    constructor(public validationMessages: ValidationModel[]) { }
}


export class AdhocArchiveUserStoryTriggered implements Action {
    type = AdhocWorkActionTypes.AdhocArchiveUserStoryTriggered
    userStory: UserStory;
    userStoryId: string;
    validationMessages: ValidationModel[];
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    errorMessage: string;
    parkUserStory: ParkUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    constructor(public archiveUserStory: UserStory) { }
}

export class AdhocArchiveUserStoryCompleted implements Action {
    type = AdhocWorkActionTypes.AdhocArchiveUserStoryCompleted
    userStory: UserStory;
    validationMessages: ValidationModel[];
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    errorMessage: string;
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    constructor(public userStoryId: string) { }
}
export class AdhocArchiveUserStoryFailed implements Action {
    type = AdhocWorkActionTypes.AdhocArchiveUserStoryFailed
    userStory: UserStory;
    userStoryId: string;
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    errorMessage: string;
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    constructor(public validationMessages: ValidationModel[]) { }
}

export class ExceptionHandled implements Action {
    type = AdhocWorkActionTypes.ExceptionHandled
    userStory: UserStory;
    userStoryId: string;
    validationMessages: ValidationModel[];
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    constructor(public errorMessage: string) { }
}

export class AdhocWorkStatusChangedTriggered implements Action {
    type = AdhocWorkActionTypes.AdhocWorkStatusChangedTriggered
    userStoryId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    constructor(public userStory: UserStory) { }
}

export class AdhocWorkStatusChangedCompleted implements Action {
    type = AdhocWorkActionTypes.AdhocWorkStatusChangedCompleted
    userStory: UserStory;
    validationMessages: ValidationModel[];
    errorMessage: string;
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    constructor(public userStoryId: string) { }
}

export class UpsertAdhocUserStoryTagsTriggered implements Action {
    type = AdhocWorkActionTypes.UpsertAdhocUserStoryTagsTriggered;
    userStory: UserStory;
    validationMessages: ValidationModel[];
    errorMessage: string;
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    customTagsModel: CustomTagsModel[];
    searchText: string;
    userStoryId: string;
    constructor(public tagsInputModel: UserStoryInputTagsModel) { }
}

export class UpsertAdhocUserStoryTagsCompleted implements Action {
    type = AdhocWorkActionTypes.UpsertAdhocUserStoryTagsCompleted;
    userStory: UserStory;
    validationMessages: ValidationModel[];
    errorMessage: string;
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    constructor(public userStoryId: string) { }
}

export class UpsertAdhocUserStoryTagsFailed implements Action {
    type = AdhocWorkActionTypes.UpsertAdhocUserStoryTagsFailed;
    userStory: UserStory;
    errorMessage: string;
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    userStoryId: string;
    constructor(public validationMessages: ValidationModel[]) { }
}

export class SearchAdhocTagsTriggered implements Action {
    readonly type = AdhocWorkActionTypes.SearchAdhocTagsTriggered;
    userStory: UserStory;
    errorMessage: string;
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    validationMessages: ValidationModel[];
    customTagsModel: CustomTagsModel[];
    constructor(public searchText: string) { }
}

// tslint:disable-next-line: max-classes-per-file
export class SearchAdhocTagsCompleted implements Action {
    readonly type = AdhocWorkActionTypes.SearchAdhocTagsCompleted;
    userStory: UserStory;
    errorMessage: string;
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    validationMessages: ValidationModel[];
    constructor(public customTagsModel: CustomTagsModel[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class SearchAdhocTagsFailed implements Action {
    readonly type = AdhocWorkActionTypes.SearchAdhocTagsFailed;
    userStory: UserStory;
    errorMessage: string;
    adhocWorkModel: AdhocWorkSearchCriteriaInputModel;
    userStories: UserStory[];
    userStoryUpdate: { userStoryUpdate: Update<UserStory> };
    parkUserStory: ParkUserStoryInputModel;
    archiveUserStory: ArchivedUserStoryInputModel;
    tagsInputModel: UserStoryInputTagsModel;
    searchText: string;
    customTagsModel: CustomTagsModel[];
    constructor(public validationMessages: ValidationModel[]) { }
}

export type AdhocWorkActions = CreateAdhocWorkTriggered | CreateAdhocWorkCompleted | CreateAdhocWorkFailed | ExceptionHandled | LoadAdhocUserStoriesTriggered | LoadAdhocUserStoriesCompleted | LoadAdhocUserStoriesFailed | LoadMoreAdhocUserStoriesTriggered
    | AdhocParkUserStoryTriggered
    | AdhocParkUserStoryCompleted
    | AdhocParkUserStoryFailed
    | AdhocArchiveUserStoryTriggered
    | AdhocArchiveUserStoryCompleted
    | AdhocArchiveUserStoryFailed
    | AdhocWorkStatusChangedTriggered
    | AdhocWorkStatusChangedCompleted
    | UpsertAdhocUserStoryTagsTriggered
    | UpsertAdhocUserStoryTagsCompleted
    | UpsertAdhocUserStoryTagsFailed
    | SearchAdhocTagsTriggered
    | SearchAdhocTagsCompleted
    | SearchAdhocTagsFailed
    | GetAdhocWorkUniqueUserStoryByIdTriggered
    | GetAdhocWorkUniqueUserStoryByIdCompleted
    | GetAdhocWorkUniqueUserStoryByIdFailed