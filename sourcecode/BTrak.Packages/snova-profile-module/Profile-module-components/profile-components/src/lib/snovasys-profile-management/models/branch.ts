import { SearchCriteriaInputModelBase } from './search-criteria-input-base.model';

export class Branch extends SearchCriteriaInputModelBase {
    branchId: string;
    branchName: string;
}