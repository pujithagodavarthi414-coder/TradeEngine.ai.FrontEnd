import { Action } from '@ngrx/store';
import { MembershipModel } from '../../models/membership-model';

export enum MembershipListActionTypes {
    LoadMembershipTriggered = '[HR Widgets Membership Component] Initial Data Load Triggered',
    LoadMembershipCompleted = '[HR Widgets Membership Component] Initial Data Load Completed',
    LoadMembershipFailed= '[HR Widgets Membership Component] Initial Data Load Failed',
    ExceptionHandled = '[HR Widgets Membership Component] Handle Exception',
}

export class LoadMembershipTriggered implements Action {
    type = MembershipListActionTypes.LoadMembershipTriggered;
    MembershipList: MembershipModel[];
    validationMessages: any[];
    errorMessage: string;
    constructor(public membershipSearchResult: MembershipModel) { }
}

export class LoadMembershipCompleted implements Action {
    type = MembershipListActionTypes.LoadMembershipCompleted;
    membershipSearchResult: MembershipModel;
    validationMessages: any[];
    errorMessage: string;
    constructor(public MembershipList: MembershipModel[]) { }
}

export class LoadMembershipFailed implements Action {
    type = MembershipListActionTypes.LoadMembershipFailed;
    membershipSearchResult: MembershipModel;
    MembershipList: MembershipModel[];
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class ExceptionHandled implements Action {
    type = MembershipListActionTypes.ExceptionHandled;
    membershipSearchResult: MembershipModel;
    MembershipList: MembershipModel[];
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type MembershipListActions = LoadMembershipTriggered
    | LoadMembershipCompleted
    | LoadMembershipFailed
    | ExceptionHandled