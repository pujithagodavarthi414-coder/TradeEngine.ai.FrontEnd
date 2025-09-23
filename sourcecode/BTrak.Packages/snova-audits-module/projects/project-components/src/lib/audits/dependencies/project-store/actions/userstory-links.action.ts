import { Action } from "@ngrx/store";
import { ValidationModel } from "../../models/validation-messages";
import { ArchivedUserStoryLinkModel } from "../../models/archived-user-story-link-model";
import { LinkUserStoryInputModel } from "../../models/link-userstory-input-model";
// tslint:disable-next-line: ordered-imports
import { UserStoryLinkModel } from "../../models/userstory-link-types-model";
import { UserStoryLinksModel } from "../../models/userstory-links.model";
import { ArchiveUserStoryCompleted, ArchiveUserStoryFailed } from "./userStory.actions";

export enum UserStoryLinksActionTypes {
    LoadUserstoryLinksTriggered = "[SnovaAudisModule Userstory Links Component] Intial Data Load Triggered",
    LoadUserstoryLinksCompleted = "[SnovaAudisModule Userstory Links Component] Intial Data Load Completed",
    LoadUserstoryLinksFailed = "[SnovaAudisModule Userstory Links Component] Intial Data Load Failed",
    GetUserStoryLinksTypesTriggered = "[SnovaAudisModule Userstory Links] Get UserStoryLinksTypes Triggered",
    GetUserStoryLinksTypesCompleted = "[SnovaAudisModule Userstory Links] Get UserStoryLinksTypes Completed",
    GetUserStoryLinksTypesFailed = "[SnovaAudisModule Userstory Links] Get UserStoryLinksTypes Failed",
    UpsertUserStoryLinkTriggered = "[SnovaAudisModule Userstory Links] Upsert UserStoryLinks Triggered",
    UpsertUserStoryLinkCompleted = "[SnovaAudisModule Userstory Links] Upsert UserStoryLinks Completed",
    UpsertUserStoryLinkFailed = "[SnovaAudisModule Userstory Links] Upsert UserStoryLinks Failed",
    RefreshUserStoriesLink = "[SnovaAudisModule Userstory Links] Refresh UserStoryLinks",
    ExceptionHandled = "[SnovaAudisModule Userstory Links]Exception Handled",
    ArchiveUserStoryLinkTriggered = "[SnovaAudisModule Userstory Links]Archive UserStory Link Triggered",
    ArchiveUserStoryLinkCompleted = "[SnovaAudisModule Userstory Links]Archive UserStory Link Completed",
    ArchiveUserStoryLinkFailed = "[SnovaAudisModule Userstory Links]Archive UserStory Link Failed"

}

export class LoadUserstoryLinksTriggered implements Action {
    type = UserStoryLinksActionTypes.LoadUserstoryLinksTriggered
    validationMessages: ValidationModel[];
    errorMessage: string;
    userStoryId: string;
    userstoryLinksList: UserStoryLinksModel[];
    linkUserStoryTypesList: UserStoryLinkModel[];
    linkUserStoryModel: UserStoryLinksModel;
    archivedLinkModel: ArchivedUserStoryLinkModel;
    constructor(public linkUserStoryInputModel: LinkUserStoryInputModel) { }
}

// tslint:disable-next-line: max-classes-per-file
export class LoadUserstoryLinksCompleted implements Action {
    type = UserStoryLinksActionTypes.LoadUserstoryLinksCompleted
    userStoryId: string;
    validationMessages: ValidationModel[];
    errorMessage: string;
    linkUserStoryInputModel: LinkUserStoryInputModel;
    linkUserStoryTypesList: UserStoryLinkModel[];
    linkUserStoryModel: UserStoryLinksModel;
    archivedLinkModel: ArchivedUserStoryLinkModel;
    constructor(public userstoryLinksList: UserStoryLinksModel[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class LoadUserstoryLinksFailed implements Action {
    type = UserStoryLinksActionTypes.LoadUserstoryLinksFailed
    userStoryId: string;
    userstoryLinksList: UserStoryLinksModel[];
    errorMessage: string;
    linkUserStoryInputModel: LinkUserStoryInputModel;
    linkUserStoryTypesList: UserStoryLinkModel[];
    linkUserStoryModel: UserStoryLinksModel;
    archivedLinkModel: ArchivedUserStoryLinkModel;
    constructor(public validationMessages: ValidationModel[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetUserStoryLinksTypesTriggered implements Action {
    type = UserStoryLinksActionTypes.GetUserStoryLinksTypesTriggered;
    validationMessages: ValidationModel[];
    errorMessage: string;
    linkUserStoryTypesList: UserStoryLinkModel[];
    userstoryLinksList: UserStoryLinksModel[];
    userStoryId: string;
    linkUserStoryModel: UserStoryLinksModel;
    archivedLinkModel: ArchivedUserStoryLinkModel;
    constructor(public linkUserStoryInputModel: UserStoryLinkModel) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetUserStoryLinksTypesCompleted implements Action {
    type = UserStoryLinksActionTypes.GetUserStoryLinksTypesCompleted;
    validationMessages: ValidationModel[];
    linkUserStoryInputModel: LinkUserStoryInputModel;
    errorMessage: string;
    userstoryLinksList: UserStoryLinksModel[];
    userStoryId: string;
    linkUserStoryModel: UserStoryLinksModel;
    archivedLinkModel: ArchivedUserStoryLinkModel;
    constructor(public linkUserStoryTypesList: UserStoryLinkModel[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class UpsertUserStoryLinkTriggered implements Action {
    type = UserStoryLinksActionTypes.UpsertUserStoryLinkTriggered;
    userstoryLinksList: UserStoryLinksModel[];
    validationMessages: ValidationModel[];
    linkUserStoryTypesList: UserStoryLinkModel[];
    userStoryId: string;
    errorMessage: string;
    linkUserStoryModel: UserStoryLinksModel;
    archivedLinkModel: ArchivedUserStoryLinkModel;
    constructor(public linkUserStoryInputModel: LinkUserStoryInputModel) { }
}

// tslint:disable-next-line: max-classes-per-file
export class UpsertUserStoryLinkCompleted implements Action {
    type = UserStoryLinksActionTypes.UpsertUserStoryLinkCompleted;
    userstoryLinksList: UserStoryLinksModel[];
    validationMessages: ValidationModel[];
    linkUserStoryInputModel: LinkUserStoryInputModel;
    linkUserStoryTypesList: UserStoryLinkModel[];
    errorMessage: string;
    linkUserStoryModel: UserStoryLinksModel;
    archivedLinkModel: ArchivedUserStoryLinkModel;
    constructor(public userStoryId: string) { }
}

// tslint:disable-next-line: max-classes-per-file
export class UpsertUserStoryLinkFailed implements Action {
    type = UserStoryLinksActionTypes.UpsertUserStoryLinkFailed;
    userStoryId: string;
    userstoryLinksList: UserStoryLinksModel[];
    linkUserStoryInputModel: LinkUserStoryInputModel;
    linkUserStoryTypesList: UserStoryLinkModel[];
    errorMessage: string;
    linkUserStoryModel: UserStoryLinksModel;
    archivedLinkModel: ArchivedUserStoryLinkModel;
    constructor(public validationMessages: ValidationModel[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class RefreshUserStoriesLink implements Action {
    type = UserStoryLinksActionTypes.RefreshUserStoriesLink;
    userStoryId: string;
    userstoryLinksList: UserStoryLinksModel[];
    linkUserStoryInputModel: LinkUserStoryInputModel;
    linkUserStoryTypesList: UserStoryLinkModel[];
    errorMessage: string;
    validationMessages: ValidationModel[];
    archivedLinkModel: ArchivedUserStoryLinkModel;
    constructor(public linkUserStoryModel: UserStoryLinksModel) { }
}

// tslint:disable-next-line: max-classes-per-file
export class GetUserStoryLinksTypesFailed implements Action {
    type = UserStoryLinksActionTypes.GetUserStoryLinksTypesFailed;
    linkUserStoryInputModel: UserStoryLinkModel;
    linkUserStoryTypesList: UserStoryLinkModel[];
    errorMessage: string;
    userstoryLinksList: UserStoryLinksModel[];
    userStoryId: string;
    linkUserStoryModel: UserStoryLinksModel;
    archivedLinkModel: ArchivedUserStoryLinkModel;
    constructor(public validationMessages: ValidationModel[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class ExceptionHandled implements Action {
    type = UserStoryLinksActionTypes.ExceptionHandled
    userStoryId: string;
    userstoryLinksList: UserStoryLinksModel[];
    validationMessages: ValidationModel[];
    linkUserStoryInputModel: LinkUserStoryInputModel;
    linkUserStoryTypesList: UserStoryLinkModel[];
    linkUserStoryModel: UserStoryLinksModel;
    archivedLinkModel: ArchivedUserStoryLinkModel;
    constructor(public errorMessage: string) { }
}

// tslint:disable-next-line: max-classes-per-file
export class ArchiveUserStoryLinkTriggered implements Action {
    type = UserStoryLinksActionTypes.ArchiveUserStoryLinkTriggered
    userStoryId: string;
    userstoryLinksList: UserStoryLinksModel[];
    validationMessages: ValidationModel[];
    linkUserStoryInputModel: LinkUserStoryInputModel;
    linkUserStoryTypesList: UserStoryLinkModel[];
    linkUserStoryModel: UserStoryLinksModel;
    errorMessage: string;
    constructor(public archivedLinkModel: ArchivedUserStoryLinkModel) { }

}

// tslint:disable-next-line: max-classes-per-file
export class ArchiveUserStoryLinkCompleted implements Action {
    type = UserStoryLinksActionTypes.ArchiveUserStoryLinkCompleted
    userstoryLinksList: UserStoryLinksModel[];
    validationMessages: ValidationModel[];
    linkUserStoryInputModel: LinkUserStoryInputModel;
    linkUserStoryTypesList: UserStoryLinkModel[];
    linkUserStoryModel: UserStoryLinksModel;
    errorMessage: string;
    archivedLinkModel: ArchivedUserStoryLinkModel;
    constructor(public  userStoryId: string) { }
}

// tslint:disable-next-line: max-classes-per-file
export class ArchiveUserStoryLinkFailed implements Action {
    type = UserStoryLinksActionTypes.ArchiveUserStoryLinkFailed
    userstoryLinksList: UserStoryLinksModel[];
    userStoryId: string;
    linkUserStoryInputModel: LinkUserStoryInputModel;
    linkUserStoryTypesList: UserStoryLinkModel[];
    linkUserStoryModel: UserStoryLinksModel;
    errorMessage: string;
    archivedLinkModel: ArchivedUserStoryLinkModel;
    constructor(public   validationMessages: ValidationModel[]) { }
}
export type UserStoryLinksActions = LoadUserstoryLinksTriggered
    | LoadUserstoryLinksCompleted
    | LoadUserstoryLinksFailed
    | GetUserStoryLinksTypesTriggered
    | GetUserStoryLinksTypesCompleted
    | GetUserStoryLinksTypesFailed
    | UpsertUserStoryLinkTriggered
    | UpsertUserStoryLinkCompleted
    | UpsertUserStoryLinkFailed
    | RefreshUserStoriesLink
    | ArchiveUserStoryLinkTriggered
    | ArchiveUserStoryLinkCompleted
    | ArchiveUserStoryLinkFailed
    | ExceptionHandled
