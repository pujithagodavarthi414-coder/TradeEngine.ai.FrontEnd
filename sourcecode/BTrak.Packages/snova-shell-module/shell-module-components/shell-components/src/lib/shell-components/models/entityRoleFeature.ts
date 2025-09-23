import { Guid } from "guid-typescript";

export class EntityRoleFeatureModel{
    entityRoleFeatureId: Guid;
    entityRoleId: Guid;
    entityFeatureId: Guid;
    projectId: string;
    entityRoleName: string;
    entityFeatureName: string;
}