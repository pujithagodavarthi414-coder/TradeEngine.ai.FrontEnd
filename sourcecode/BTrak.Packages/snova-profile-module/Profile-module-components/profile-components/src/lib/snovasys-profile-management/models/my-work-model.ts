import { EntityRoleFeatureModel } from './entity-role-feature.model';

export class MyWorkModel {
    userStoryId: string;
    goalId: string;
    goalName: string
    goalShortName: string
    projectId: string
    projectName: string
    projectResponsiblePersonId: string
    userStoryName: string
    estimatedTime: any
    deadLineDate: Date
    ownerUserId: string
    ownerName: string
    ownerProfileImage: string
    dependencyUserId: string
    dependencyName: string
    dependencyProfileImage: string
    goalStatusId: string
    userStoryStatusId: string
    userStoryStatusName: string
    userStoryStatusColor: string
    bugCausedUserId: string
    bugCausedUserName: string
    bugCausedUserProfileImage: string
    bugPriorityId: string
    projectFeatureId: string
    boardTypeId: string
    totalCount: number
    userStoryTypeName: string
    uerStoryTypeId: string
    workFlowId: string
    entityFeaturesXml: string;
    entityFeaturesList: EntityRoleFeatureModel[];
    timeStamp: any;
    onboardProcessDate: Date;
    userStoryUniqueName: string;
    totalEstimatedTime: any;
    autoLog: boolean;
    startTime: Date;
    endTime: Date;
    breakType: boolean;
}