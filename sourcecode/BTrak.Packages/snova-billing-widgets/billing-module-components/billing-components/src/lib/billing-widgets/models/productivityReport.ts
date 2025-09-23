import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class ProductivityReportModel extends SearchCriteriaInputModelBase{
    userId: string;
    date: Date;
}