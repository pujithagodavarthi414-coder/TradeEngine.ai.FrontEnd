export class RoleFeatureModel {
    featureId : string;
    featureName : string;
    parentFeatureId : string;
    menuItemName : string;
    totalCount : number;
    timeStamp: any;
    isActive: boolean;
    createdDateTime: Date;
    children: RoleFeatureModel[];
}