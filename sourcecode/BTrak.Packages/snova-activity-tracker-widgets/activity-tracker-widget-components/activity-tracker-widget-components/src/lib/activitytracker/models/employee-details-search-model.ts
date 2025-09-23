import { SearchCriteriaInputModelBase } from "./searchCriteriaInputModelBase";

export class EmployeeDetailsSearchModel extends SearchCriteriaInputModelBase {
    employeeId: string;
    employeeDetailType: string;
    branchId: string;
}