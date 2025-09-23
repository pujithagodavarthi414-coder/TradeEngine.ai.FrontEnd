export class WebAppUsageSearchModel{
    userId: string[];
    roleId: string[];
    branchId: string[];
    dateFrom: any;
    dateTo: any;
    searchText: string;
    pageSize: number;
    pageNumber: number;
    isApp: boolean;
    sortBy: string;
    sortDirectionAsc: boolean;
    isForLatestScreenshots: boolean;
}