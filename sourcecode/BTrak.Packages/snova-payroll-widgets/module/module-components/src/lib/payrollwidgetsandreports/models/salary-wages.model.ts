import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class SalaryWagesModel extends SearchCriteriaInputModelBase {
    date: string;
    dateFrom: Date;
    dateTo: Date;
    entityId: string
    userId: string;
    isActiveEmployeesOnly: boolean
    locationId: string;
    isFinantialYearBased: boolean;

    employeeNumber: string;
    employeeName: string;
    profileImage: string;
    joinedDate: string;
    employeeSalary: any
    actualEmployeeSalary: any;
    actualDeduction: any;
    actualPaidAmount: any;
    dateOfPayment: string;
    totalRecordsCount: number;
}