import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class EmployeeESIModel extends SearchCriteriaInputModelBase {
    date: string;
    dateFrom: Date;
    dateTo: Date;
    entityId: string
    userId: string;
    isActiveEmployeesOnly: boolean
    locationId: string;
    isFinantialYearBased: boolean;

    ipNumber: string;
    ipName: string;
    profileImage: string;
    effectiveDays: number;
    totalWages: string;
    reasonCode: number;
    lastWorkingDay: string;
    totalRecordsCount: number;
}