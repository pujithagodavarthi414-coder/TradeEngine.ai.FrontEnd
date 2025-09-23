import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class FeatureSearchModel extends SearchCriteriaInputModelBase{
    featureId: string;
    featureName: string;
    parentFeatureId: string;
}