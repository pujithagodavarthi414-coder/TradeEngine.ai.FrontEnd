export class MyLeaveModel {
    leaveApplicationId: string;
    userId: string;
    leaveReason: string;
    leaveTypeId: string;
    leaveStatusId: string;
    overallLeaveStatusId: string;
    leaveDateFrom: Date;
    leaveDateTo: Date;
    isDeleted: boolean;
    isArchived: boolean;
    fromLeaveSessionId: string;
    toLeaveSessionId: string;
    date: Date;
    pageSize: number;
    pageNumber: number;
    sortBy: string;
    sortDirectionAsc: boolean;
    timeStamp: any;
}