import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class DesignationModel extends SearchCriteriaInputModelBase{
    designationId: string;
    designationName: string;
    createdDateTime: Date;
    createdOn: string;
    inActiveDateTime: Date;
    inActiveOn: string;
    timeStamp: any;
    totalCount: number
}
