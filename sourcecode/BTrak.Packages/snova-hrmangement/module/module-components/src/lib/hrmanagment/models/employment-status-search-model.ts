import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class EmploymentStatusSearchModel extends SearchCriteriaInputModelBase{
    employmentStatusId: string
    employmentStatusName: string;
    isPermanent: boolean;
}