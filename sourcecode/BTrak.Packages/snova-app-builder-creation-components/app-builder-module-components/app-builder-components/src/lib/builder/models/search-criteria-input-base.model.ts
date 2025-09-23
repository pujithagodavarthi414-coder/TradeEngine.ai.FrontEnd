export class SearchCriteriaInputModelBase {
  
    userName:string;
    pageSize: number;
    pageNumber: number;
    searchText: string;
    isActive: boolean;
    isArchived: boolean;
    sortBy: string;
    sortDirectionAsc: boolean;
    isReportTo: boolean;
}