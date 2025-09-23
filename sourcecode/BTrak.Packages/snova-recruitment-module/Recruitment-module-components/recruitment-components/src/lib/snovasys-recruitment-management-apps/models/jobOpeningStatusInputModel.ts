export class JobOpeningStatusInputModel {
    jobOpeningStatusId: string;
    status: string;
    order: number;
    searchText: string;
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirectionAsc: boolean;
    isArchived: boolean;
}
