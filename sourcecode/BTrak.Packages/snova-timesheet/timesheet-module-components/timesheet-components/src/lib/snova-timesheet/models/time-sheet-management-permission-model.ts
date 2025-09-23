import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class TimeSheetManagementPermissionModel extends SearchCriteriaInputModelBase {
    userId: string;
    permissionId: string;
    date: Date;
    duration: string;
    isMorning: boolean;
    isDeleted: boolean;
    dateFrom: Date;
    dateTo: Date;
    permissionReasonId: string;
    durationInMinutes: number;
    hours: number;
    fullName: string;
    reasonId: string;
    reasonName: string;
    permissionReason: string;
    totalCount: number;
    createdDateTime: Date;
    createdByUserId: string;
    profileImage: string;
    isDelete:boolean;
    timeStamp:any;

}