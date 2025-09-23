import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';


export class EmployeePFModel extends SearchCriteriaInputModelBase {
    date: string;
    dateFrom: Date;
    dateTo: Date;
    entityId: string
    userId: string;
    isActiveEmployeesOnly: boolean
    locationId: string;
    isFinantialYearBased: boolean;

    uanNumber: string
    employeename: string;
    profileImage: string;
    grossWages: any;
    epfWages: any;
    epsWages: any;
    edliWages: any;
    epfContribution: any;
    epsContribution: any;
    epfanddpsDifference: any;
    ncpDays: any;
    refundOfAdvance: number;
    totalRecordsCount: number
}