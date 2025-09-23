export class PerformanceModel {
    performanceId: string;
    configurationId: string;
    configurationName: string;
    assignedById: string;
    assignedByUser: string;
    assignedByImage: string;
    assignedOn: Date;
    formJson: string;
    formData: string;
    isDraft: boolean;
    isSubmitted: boolean;
    isApproved: boolean;
    approvedBy: string;
    approvedByName: string;
    waitingForApproval: boolean;
    approvedOn: Date;
    submittedBy: string;
    submittedByUser: string;
    submittedOn: Date;
    includeApproved: boolean;
    pageSize: number;
    pageNumber: number;
    totalNumber: number;
}
