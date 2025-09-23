export class LeaveDetails {
    leaveFrequencyId: string;
    dateFrom: Date = new Date();
    dateTo: Date = new Date();
    leaveTypeName: string;
    leavesTaken: number;
    actualBalance: number;
    effectiveBalance: number;
    carryForwardLeaves: number;
    isCarryForward: boolean;
    isPaid: boolean;
    leaveTypeId: string;
    userId: string;
}