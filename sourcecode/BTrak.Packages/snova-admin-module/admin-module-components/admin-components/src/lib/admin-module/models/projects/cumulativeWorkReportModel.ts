import { Guid } from "guid-typescript";

export class CumulativeWorkReportSearchInputModel {
    userId: string;
    projectId: string;
    dateFrom: Date;
    dateTo: Date;
    date: Date;
}

export class CumulativeWorkReport {
    date: Date;
    toDoStatusWorkitemsCount: number
    inprogressStatusWorkitemsCount: number
    doneStatusWorkitemsCount: number
    pendingVerificationStatusWorkitemsCount: number
    verificationCompletedStatusWorkitemsCount: number
    blockedStatusWorkitemsCount: number
}
