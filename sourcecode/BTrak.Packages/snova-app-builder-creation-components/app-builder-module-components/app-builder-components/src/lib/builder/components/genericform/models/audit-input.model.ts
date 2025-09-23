export class AuditInputModel {
    id: string;
    auditId: string;
    auditName: string;
    searchText: string;
    sortBy: string;
    pageSize: number;
    pageNumber: number;
    sortDirectionAsc: boolean;
    isArchived: boolean;
}