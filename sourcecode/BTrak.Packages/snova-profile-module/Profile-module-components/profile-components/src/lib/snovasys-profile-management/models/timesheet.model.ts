export class TimeSheetManagementSearchInputModel {
    userId: string;
    dateFrom: any;
    dateTo: any;
    branchId: string;
    teamLeadId: string;
    searchText: string;
    employeeSearchText: string;
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
