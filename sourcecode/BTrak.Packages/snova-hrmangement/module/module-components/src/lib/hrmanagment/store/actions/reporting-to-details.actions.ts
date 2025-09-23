import { Action } from '@ngrx/store';
import { RelationshipDetailsModel } from '../../models/relationship-details-model';

export enum RelationshipDetailsActionTypes {
    LoadRelationshipDetailsTriggered = '[HR Widgets Relationship Details Component] Initial Data Load Triggered',
    LoadRelationshipDetailsCompleted = '[HR Widgets Relationship Details Component] Initial Data Load Completed',
    LoadRelationshipDetailsFailed = '[HR Widgets Relationship Details Component] Create Relationship Details Failed',
    ExceptionHandled = '[HR Widgets Relationship Details Component] Handle Exception',
}

export class LoadRelationshipDetailsTriggered implements Action {
    type = RelationshipDetailsActionTypes.LoadRelationshipDetailsTriggered;
    relationshipDetailsList: RelationshipDetailsModel[];
    relationshipId: string;
    validationMessages: string[];
    errorMessage: string;
    constructor(public relationshipDetails: RelationshipDetailsModel) { }
}

export class LoadRelationshipDetailsCompleted implements Action {
    type = RelationshipDetailsActionTypes.LoadRelationshipDetailsCompleted;
    relationshipDetails: RelationshipDetailsModel;
    relationshipId: string;
    validationMessages: string[];
    errorMessage: string;
    constructor(public relationshipDetailsList: RelationshipDetailsModel[]) { }
}

export class LoadRelationshipDetailsFailed implements Action {
    type = RelationshipDetailsActionTypes.LoadRelationshipDetailsFailed;
    relationshipDetailsList: RelationshipDetailsModel[];
    relationshipDetails: RelationshipDetailsModel;
    relationshipId: string;
    errorMessage: string;
    constructor(public validationMessages: string[]) { }
}

export class ExceptionHandled implements Action {
    type = RelationshipDetailsActionTypes.ExceptionHandled;
    relationshipDetailsList: RelationshipDetailsModel[];
    relationshipDetails: RelationshipDetailsModel;
    relationshipId: string;
    validationMessages: string[];
    constructor(public errorMessage: string) { }
}

export type RelationshipDetailsActions = LoadRelationshipDetailsTriggered
    | LoadRelationshipDetailsCompleted
    | LoadRelationshipDetailsFailed
    | ExceptionHandled;