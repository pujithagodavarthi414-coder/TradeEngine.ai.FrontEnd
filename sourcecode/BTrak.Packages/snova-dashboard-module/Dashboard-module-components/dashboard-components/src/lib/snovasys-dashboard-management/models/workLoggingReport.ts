import { SearchCriteriaInputModelBase } from './search-criteria-input-base.model';

export class WorkLoggingReportModel extends SearchCriteriaInputModelBase{
    userId: string;
    dateFrom: Date;
    dateTo: Date;
    goalId: string;
    lineManagerId: string;
    projectId: string;
    columns: any;
    state: any;
}