import { SearchCriteriaInputModelBase } from './searchcriteriainputmodelbase';

export class Branch extends SearchCriteriaInputModelBase{
    branchId: string;
    branchName: string;
    searchText: string;
    isArchived: boolean;
}
