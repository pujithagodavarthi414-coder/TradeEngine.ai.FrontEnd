import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class PermissionReasonModel extends SearchCriteriaInputModelBase {
    permissionReasonId: string;
    permissionReason: string;
    id: string;
    reasonName: string;
    companyId: string;
    createdDateTime: Date;
    createdByUserId: string;
    inActiveDateTime: Date;
    totalCount: number;
}