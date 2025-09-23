import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class IncomeSalaryModel extends SearchCriteriaInputModelBase {
    date: string;
    dateFrom: string;
    dateTo: string
    entityId: string;
    userId: string;
    isActiveEmployeesOnly: boolean;
    monthlyIncome: string;
    adhocIncome: string;
    deductions: string;
    totalIncome: string;
    employeeNumber: string;
    employeeName: string;
    panNumber: string;
    gender: string;
    location: string;
    joinedDate: string;
    dateofBirth: string;
    dateOfLeavingService: string;
    isFinantialYearBased: boolean;

}