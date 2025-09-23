export class LeaveOverviewModel{
    userId: string;
    userName: string;
    roleName: string;
    branchName: string;
    rejected: number;
    approved: number;
    waitingForApproval: number;
    totalNoOfLeaves: number;
    balance: number;
    dateFrom: Date;
    dateTo: Date;
    leaveApplicationId: string;
    approvalChain: string;
}