import { Action } from "@ngrx/store";
import { TagsModel } from "../../models/tags.model";
import { ValidationModel } from "../../models/validation-messages";
// import { CustomTagsModel } from "app/views/projects/models/custom-tags-model";
import { CustomTagModel } from "../../models/customTagsModel";


export enum TagsActionTypes {
    LoadTagsTriggred = "[SnovaAudisModule TagsModel]Load Tags Triggered",
    LoadTagsCompleted = "[SnovaAudisModule TagsModel]Load Tags Completed",
    LoadTagsFailed = "[SnovaAudisModule TagsModel]Load Tags Failed",
    ExceptionHandled = "[SnovaAudisModule TagsModel]Exception Handled"
}

export class LoadTagsTriggred implements Action {
    type = TagsActionTypes.LoadTagsTriggred
    tagsList: TagsModel[];
    validationMessages: ValidationModel[];
    exceptionMessage: string;

    constructor(public tagsModel: CustomTagModel) { }
}


export class LoadTagsCompleted implements Action {
    type = TagsActionTypes.LoadTagsCompleted
    tagsModel: CustomTagModel;
    validationMessages: ValidationModel[];
    exceptionMessage: string;

    constructor(public   tagsList: TagsModel[]) { }
}


export class LoadTagsFailed implements Action {
    type = TagsActionTypes.LoadTagsFailed
    tagsList: TagsModel[];
    tagsModel: CustomTagModel;
    exceptionMessage: string;

    constructor(public validationMessages: ValidationModel[]) { }
}


export class ExceptionHandled implements Action {
    type = TagsActionTypes.ExceptionHandled
    tagsList: TagsModel[];
    tagsModel: CustomTagModel;
    validationMessages: ValidationModel[];
    
    constructor(public exceptionMessage: string) { }
}

export type TagActions = LoadTagsTriggred 
                        | LoadTagsCompleted
                        | LoadTagsFailed
                        | ExceptionHandled