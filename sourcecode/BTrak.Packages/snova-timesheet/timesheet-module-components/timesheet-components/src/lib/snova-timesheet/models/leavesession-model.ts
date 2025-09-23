// export class LeaveSessionsModel
// {
//     leaveSessionId: string;
//     leaveSessionName: string;
//     companyId: string;
//     createdByUserId: string;
//     createdDateTime: Date;
//     updatedByUserId: string;
//     updatedDateTime: Date;   
// }

// export class LeaveTypeModel
// {
//     leaveTypeId: string;
//     leaveTypeName: string;
//     operationsPerformedBy: string;
//     createdByUserId: string;
//     createdDateTime: Date;
//     updatedByUserId: string;
//     updatedDateTime: Date;   
// }

export class PermissionReasons
{
    id: string;
    reasonName: string;
    createdDateTime: Date;
    createdByUserId: string;
    updatedByUserId: Date;
    updatedDateTime: string;
    isDeleted: boolean;   
}

export class TimeZoneModel
{
    timeZoneId: string;
    timeZoneName: string;
    timeZoneTitle: string;
    timeZoneOffset: string;
    timeZone: string;
    operationsPerformedBy: string;
    createdByUserId: string;
    createdDateTime: Date;
    updatedByUserId: string;
    updatedDateTime: Date;   
    isArchived: boolean;
}