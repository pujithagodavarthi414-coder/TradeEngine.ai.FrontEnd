import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class MembershipModel extends SearchCriteriaInputModelBase{
    membershipId: string;
    masterValue: string;
    createdDateTime: Date;
    inActiveDateTime: Date;
    timeStamp: any;
    totalCount: number;
}