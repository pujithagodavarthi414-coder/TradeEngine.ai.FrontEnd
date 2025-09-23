import { SearchCriteriaInputModelBase } from "./searchCriteriaInputModelBase";

export class LeaveTypeModel extends SearchCriteriaInputModelBase {
    leaveTypeId: string;
    leaveTypeName: string;
    companyId: string;
    createdByUserId: string;
    createdDateTime: Date;
    totalCount: number;
    timeStamp: any;
}