export class AuditDetailsModel {
    branchName: string;
    branchId: string;
    submittedAudits: number;
    auditDetails: any;
    nonComplaintAudits: number;
    questionName: string;
    auditName: string;
    complaincePercentage: any;
    nonCompalincePercentage: any;
}

export class AuditComplainceInputModel {
    dateFrom: any;
    dateTo: any;
    branchId: string;
    auditId: string;
    projectId: string;
}