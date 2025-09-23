import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class PayGradeModel extends SearchCriteriaInputModelBase {
    payGradeId: string;
    payGradeName: string;
    searchText: string;
    isArchived: boolean;
}