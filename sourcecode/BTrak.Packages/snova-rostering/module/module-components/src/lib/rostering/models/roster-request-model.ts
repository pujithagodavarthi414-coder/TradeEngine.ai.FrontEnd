export class RosterRequestModel {
    requestId: string;
    requestName: string;
    requiredFromDate: Date;
    requiredToDate: Date;
    requiredBudget: number;
    requiredEmployee: number;
    requiredBreakMins: number;
    branchId: string;
    branchName: string;
    includeHolidays: number;
    includeWeekends: number;
    totalWorkingDays: number;
    totalWorkingHours: number;
    createdDateTime: Date;
    createdByUserId: string;
    createdByUserName: string;
    statusName: string;
    statusColor: string;
    companyId: string;
    isArchived: boolean;
    totalCount: number;
    currentNumber: number;
    previousValue: string;
    nextValue: string;
    isTemplate: boolean;
}
