import { SearchCriteriaInputModelBase } from './search-criteria-input-base.model';

export class LeaveFrequencyTypeSearchInputModel extends SearchCriteriaInputModelBase {
    leaveTypeId: string;
    frequencyId: string;
    leaveFrequencyId: string;
    fromDate: Date;
    toDate: Date;
    noOfLeaves: number;
    isToGetLeaveTypes: boolean;
    isApplyLeave: boolean;
    userId: string;
    isArchived: boolean;
}