import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class EmploymentStatusModel{
    employmentStatusId: string
    employmentStatusName: string;
    isPermanent: boolean;
    companyId: string;
    createdDateTime: Date;
    createdByUserId: string;
    timeStamp: any;
    totalCount: number
}

export class EmploymentStatusSearchModel extends SearchCriteriaInputModelBase{
    employmentStatusId: string
    employmentStatusName: string;
    isPermanent: boolean;
}
