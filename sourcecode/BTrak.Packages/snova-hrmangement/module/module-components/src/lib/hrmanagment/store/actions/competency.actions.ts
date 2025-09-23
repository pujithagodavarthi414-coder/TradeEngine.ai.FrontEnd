import { Action } from '@ngrx/store';
import { CompetenciesSearchModel } from '../../models/competencies-search-model';
import { CompetenciesModel } from '../../models/competencies-model';


export enum CompetencyActionTypes {
    LoadCompetencyTriggered = '[HR Widgets Competency Component] Initial Data Load Triggered',
    LoadCompetencyCompleted = '[HR Widgets Competency Component] Initial Data Load Completed',
    LoadCompetencyFailed = '[HR Widgets Competency Component] Initial Data Load Failed',
    ExceptionHandled = '[HR Widgets Competency Component] Handle Exception',
}

export class LoadCompetencyTriggered implements Action {
    type = CompetencyActionTypes.LoadCompetencyTriggered;
    competencyList: CompetenciesModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public competencySearchResult: CompetenciesSearchModel) { }
}

export class LoadCompetencyCompleted implements Action {
    type = CompetencyActionTypes.LoadCompetencyCompleted;
    competencySearchResult: CompetenciesSearchModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public competencyList: CompetenciesModel[]) { }
}

export class LoadCompetencyFailed implements Action {
    type = CompetencyActionTypes.LoadCompetencyFailed;
    competencySearchResult: CompetenciesSearchModel;
    competencyList: CompetenciesModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = CompetencyActionTypes.ExceptionHandled;
    competencySearchResult: CompetenciesSearchModel;
    competencyList: CompetenciesModel[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type CompetencyActions = LoadCompetencyTriggered
    | LoadCompetencyCompleted
    | LoadCompetencyFailed
    | ExceptionHandled;