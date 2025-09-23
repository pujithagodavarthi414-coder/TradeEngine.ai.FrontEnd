export class TimeSheetSearchModel {
    userId: string[];
    roleId: string[];
    branchId: string[];
    userIdXml: string;
    dateFrom: Date;
    dateTo: Date;
    pageSize: number;
    pageNumber: number;
    sortBy: string;
    sortDirectionAsc: boolean;
}