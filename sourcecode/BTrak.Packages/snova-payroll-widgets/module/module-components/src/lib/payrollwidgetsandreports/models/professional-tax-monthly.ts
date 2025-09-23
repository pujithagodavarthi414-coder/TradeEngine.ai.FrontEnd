import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class ProfessionalTaxMonthlyModel extends SearchCriteriaInputModelBase {
    date: string;
    dateFrom: Date;
    dateTo: Date;
    entityId: string
    userId: string;
    isActiveEmployeesOnly: boolean
    locationId: string;
    isFinantialYearBased: boolean;
    employeeNumber: any;
    employeeName: string;
    profBasic: any
    amount: number
    summaryJson: string;
    totalCount: number;
    completeAddress: string;
    branchId: string;
}