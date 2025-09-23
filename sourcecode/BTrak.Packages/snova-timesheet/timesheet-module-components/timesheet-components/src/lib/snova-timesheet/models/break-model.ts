import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class BreakModel extends SearchCriteriaInputModelBase{
    dateFrom: string;
    dateTo: string;
    userId: string;
    breakId: string;
    timeZoneOffset: string;
    timeZone: string;
    date: Date;
}