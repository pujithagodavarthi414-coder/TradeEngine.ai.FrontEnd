export class EmployeeAppUsageSearch{
    userId: string[];
    branchId: string;
    dateFrom: Date;
    dateTo: Date;
    pageSize: number;
    pageNumber: number;
    isApp: boolean;
    sortBy: string;
    sortDirectionAsc: boolean;
}