export class EntityTypeFeatureModel {
    entityFeatureId: string;
    entityTypeId: string;
    entityFeatureName: string;
    searchText: string
    isArchived: boolean;
    createdDateTime: Date;
    inActiveDateTime: Date;
    totalCount: number;
    isActive: boolean;
    parentFeatureId: string;
    featureId: string;
    children: EntityTypeFeatureModel[];
}