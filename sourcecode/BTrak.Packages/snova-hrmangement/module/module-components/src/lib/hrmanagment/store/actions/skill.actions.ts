import { Action } from '@ngrx/store';

import { SkillSearchModel } from '../../models/skill-search-model';
import { SkillDetailsModel } from '../../models/skill-details-model';

export enum SkillActionTypes {
    LoadSkillTriggered = '[HR Widgets Skill Component] Initial Data Load Triggered',
    LoadSkillCompleted = '[HR Widgets Skill Component] Initial Data Load Completed',
    LoadSkillFailed = '[HR Widgets Skill Component] Initial Data Load Failed',
    ExceptionHandled = '[HR Widgets Skill Component] Handle Exception',
}

export class LoadSkillTriggered implements Action {
    type = SkillActionTypes.LoadSkillTriggered;
    SkillList: SkillDetailsModel[];
    validationMessages: any[];
    errorMessage: string
    constructor(public SkillSearchResult: SkillSearchModel) { }
}

export class LoadSkillCompleted implements Action {
    type = SkillActionTypes.LoadSkillCompleted;
    SkillSearchResult: SkillSearchModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public SkillList: SkillDetailsModel[]) { }
}

export class LoadSkillFailed implements Action {
    type = SkillActionTypes.LoadSkillFailed;
    SkillSearchResult: SkillSearchModel;
    SkillList: SkillDetailsModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = SkillActionTypes.ExceptionHandled;
    SkillSearchResult: SkillSearchModel;
    SkillList: SkillDetailsModel[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type SkillActions = LoadSkillTriggered
    | LoadSkillCompleted
    | LoadSkillFailed
    | ExceptionHandled;