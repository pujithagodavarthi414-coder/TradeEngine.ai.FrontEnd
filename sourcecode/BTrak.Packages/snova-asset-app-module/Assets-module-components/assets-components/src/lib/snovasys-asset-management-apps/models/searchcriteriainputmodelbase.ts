export class SearchCriteriaInputModelBase {
    pageSize: number;
    pageNumber: number;
    searchText: string;
    isActive: boolean;
    isArchived: boolean;
    sortBy: string;
    sortDirectionAsc: boolean;
    isReportTo: boolean;
}