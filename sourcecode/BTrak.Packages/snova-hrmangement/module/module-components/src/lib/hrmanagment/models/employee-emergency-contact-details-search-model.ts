import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class EmployeeEmergencyContactSearchModel extends SearchCriteriaInputModelBase {
    emergencyContactId: string;
    employeeId: string;
    searchText: string;
}