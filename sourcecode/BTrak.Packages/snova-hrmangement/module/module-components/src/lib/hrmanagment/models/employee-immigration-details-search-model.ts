import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class EmployeeImmigrationDetailsSearchModel extends SearchCriteriaInputModelBase {
    employeeImmigrationId: string;
    searchText: string;
    employeeId: string;
}