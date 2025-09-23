import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class SalaryForITModel extends SearchCriteriaInputModelBase {
    date: string;
    dateFrom: Date;
    dateTo: Date;
    entityId: string
    userId: string;
    isActiveEmployeesOnly: boolean
    locationId: string;
    isFinantialYearBased: boolean;

    employeeId: string;
    employeeName: string;
    profileImage: string
    panNumber: string;
    dateofBirth: string;
    sectionName: string;
    parentSectionName: string;
    isParent: boolean;
    age: number;
    maxInvestment: any;
    investment: any;
    tax: any;
    netSalary: any;
    taxableAmount: any;
    totalTax: any;
}