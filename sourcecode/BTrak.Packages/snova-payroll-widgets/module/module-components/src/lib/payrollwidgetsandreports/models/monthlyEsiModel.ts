import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';


export class MonthlyESIModel extends SearchCriteriaInputModelBase {
    date: string;
    dateFrom: string;
    dateTo: string
    entityId: string;
    userId: string;
    isActiveEmployeesOnly: boolean
}