import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class EmployeeBankDetailsModel extends  SearchCriteriaInputModelBase{
    employeeId: string;
    ifscCode: string;
    accountNumber: string;
    accountName: string;
    buildingSocietyRollNumber: string;
    bankName: string;
    branchName: string;
    dateFrom: Date;
    isArchived: boolean;
    employeeBankId: string;
    searchText: string;
    accountNameSearchText: string;
    accountNumberSearchText: string;
    bankNameSearchText: string;
    effectiveFrom: Date;
    effectiveTo: Date;
    firstName:string;
    surname:string;
    email:string;
    inActiveDateTime:Date;
    timeStamp:any;
    totalCount:number;
    bankId: string;
}