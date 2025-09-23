import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class LicenceTypesModel extends SearchCriteriaInputModelBase{
    licenceTypeId: string;
    licenceTypeName: string;
    createdDate: Date;
    createdByUserId: string;
    isArchived: boolean;
    totalCount: number;
}