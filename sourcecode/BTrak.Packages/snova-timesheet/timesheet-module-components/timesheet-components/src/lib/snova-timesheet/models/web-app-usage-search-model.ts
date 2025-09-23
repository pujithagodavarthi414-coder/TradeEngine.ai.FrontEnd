export class WebAppUsageSearchModel{
    userId: string[];
    roleId: string[];
    branchId: string[];
    dateFrom: Date;
    dateTo: Date;
    searchText: string;
    pageSize: number;
    pageNumber: number;
    isApp: boolean;
    isAllUser: boolean;
    sortBy: string;
    sortDirectionAsc: boolean;
    applicationType: string;
    userStoryId: string;
    selectedUserId: string;
}