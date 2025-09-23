// export class TimeSheetModel {
//     buttonTypeId: string;
//     timeSheetId: string;
//     userId: string;
//     date: string;
//     inTime: string;
//     lunchBreakStartTime: string;
//     lunchBreakEndTime: string;
//     outTime: string;
//     loggedUserId: string;
//     isFeed: boolean;
//     timezoneId: string;
//     isAbesent: boolean;
//     isPresent: boolean;
    
// }

// export class EmployeeLeaveModel {
//     id: string;
//     userId: string;
//     leaveTypeId: string;
//     leaveSessionId: string;
//     date: string;
//     reasonForAbsent: string;
// }

export class BranchModel {
    branchId: string;
    branchName: string;
    
}


// export class TimeSheetPermissionsModel {
//     userId: string;
//     permissionId: string;
//     date: string;
//     duration: string;
//     dateFrom: string;
//     dateTo: string;
//     isMorning: string;
//     isDeleted: string;
//     durationInMinutes: string;
//     hours: string;
//     reasonId: string;
//     permissionReasonId: string;
//     reasonName: string;
//     permissionReason: string;
// }

export class TimeSheetPermissionsInputModel {
    userId: string;
    employeeId :string;
    permissionId: string;
    date: Date;
    duration: string;
    dateFrom: Date;
    dateTo: Date;
    isMorning: string;
    isDeleted: string;
    durationInMinutes: string;
    hours: string;
    reasonId: string;
    permissionReasonId: string;
    reasonName: string;
    permissionReason: string;
    activeTimeInMin: string;
    totalActiveTimeInMin: string;
    //paging
    pageSize: number;
    pageNumber: number;
    companyId: number;
    searchText: number;
    searchGoal: number;
    searchUserStory: number;
    orderByField: number;
    orderByDirection: number;
    isActive: boolean;
    isArchived: boolean;
    sortBy: string;
    sortDirectionAsc: boolean;
    userName: string;
    timeStamp: any;
    employeeName: any;
    review: string;
    EmployeeId: any;
    entityId:string;
}



export class TimeSheetManagementSearchInputModel {

    userId: string;
    dateFrom: string;
    dateTo: string;
    branchId: string;
    teamLeadId: string;
    searchText: string;
    employeeSearchText: string;
    timeZone: number;

     //paging
     pageSize: number;
     pageNumber: number;
     companyId: number;
     searchGoal: number;
     searchUserStory: number;
     orderByField: number;
     orderByDirection: number;
     isActive: boolean;
     isArchived: boolean;
     sortBy: string;
     sortDirectionAsc: boolean;
     includeEmptyRecords: boolean;
     entityId: string;
}


// export class TimeSheetPermissionReason
// {
//  permissionReasonId : string;
// permissionReason:string;
// }
