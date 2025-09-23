import { Guid } from "guid-typescript";

export class RoleFeatureModel {
  roleFeatureId: Guid;
  roleId: Guid;
  featureId: Guid;
  parentFeatureId: Guid;
  roleName: string;
  featureName: string;
  parentFeatureName: string;
}
