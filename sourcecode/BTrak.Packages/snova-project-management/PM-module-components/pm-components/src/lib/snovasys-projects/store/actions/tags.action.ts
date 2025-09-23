import { Action } from "@ngrx/store";
import { TagsModel } from '../../models/tags.model';
import { ValidationModel } from '../../models/validation-messages';
import { CustomTagModel } from '../../models/customTagsModel';


export enum TagsActionTypes {
    LoadTagsTriggred = "[Snovasys-PM][TagsModel]Load Tags Triggered",
    LoadTagsCompleted = "[Snovasys-PM][TagsModel]Load Tags Completed",
    LoadTagsFailed = "[Snovasys-PM][TagsModel]Load Tags Failed",
    TagsExceptionHandled = "[Snovasys-PM][TagsModel]Exception Handled"
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


export class TagsExceptionHandled implements Action {
    type = TagsActionTypes.TagsExceptionHandled
    tagsList: TagsModel[];
    tagsModel: CustomTagModel;
    validationMessages: ValidationModel[];
    
    constructor(public exceptionMessage: string) { }
}

export type TagActions = LoadTagsTriggred 
                        | LoadTagsCompleted
                        | LoadTagsFailed
                        | TagsExceptionHandled