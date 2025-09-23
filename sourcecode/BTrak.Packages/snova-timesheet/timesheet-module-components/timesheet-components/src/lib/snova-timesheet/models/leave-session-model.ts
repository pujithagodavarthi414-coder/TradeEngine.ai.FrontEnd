import { SearchCriteriaInputModelBase } from "./searchCriteriaInputModelBase";

export class LeaveSessionModel extends SearchCriteriaInputModelBase {
    leaveSessionId: string;
    leaveSessionName: string;
    createdDateTime: Date;
    createdByUserId: string;
    companyId: string;
}