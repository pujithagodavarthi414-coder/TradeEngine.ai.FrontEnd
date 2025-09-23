import { SearchCriteriaInputModelBase } from './search-criteria-input-base.model';

export class ProductivityReportModel extends SearchCriteriaInputModelBase{
    userId: string;
    date: Date;
}