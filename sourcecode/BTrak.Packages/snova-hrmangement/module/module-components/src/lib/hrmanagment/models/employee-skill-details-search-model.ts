import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class EmployeeSkillDetailsSearchModel extends SearchCriteriaInputModelBase {
    employeeId: string;
    employeeSkillId:string;
    searchText:string;
}