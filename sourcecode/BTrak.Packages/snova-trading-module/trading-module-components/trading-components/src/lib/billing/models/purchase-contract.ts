export class PurchaseContractModel {
    PurchaseId: string;
    configurationId: string;
    PurchaseName: string;
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
export class ContractConfigurationModel {
    purchaseId: string;
    purchaseName: string;
    formName:string;
    formId:string;
    formData: string;
    clientId: string;
    clientTypeId :any;
    clientType :string;
    formJson: string;
    timeStamp: any;
    isArchived: boolean;
    createdByUserId: string;
    createdBy: string;
    createdByImage: string;
    createdDatetime: Date;
    isDraft: boolean;
    considerRole: boolean;
    selectedRoleIds: any[];
    roleNames: string;
    ofUserId: string;
}
