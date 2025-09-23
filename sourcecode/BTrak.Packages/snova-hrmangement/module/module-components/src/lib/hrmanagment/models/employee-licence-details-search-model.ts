import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class EmployeeLicenceDetailsSearchModel extends SearchCriteriaInputModelBase{
    employeeId: string;
    searchText: string;
    employeeLicenceId: string;
}