export class ContractPaySettingsModel{
    contractPaySettingsId: string;
    contractPayTypeId: string;
    contractPayTypeName: string;
    branchName: string
    branchId: string;
    activeFrom: Date;
    activeTo: Date;
    isToBePaid: boolean;
    isToBeDeducted: boolean;
    forPaid: number;
    isArchived: boolean;
    timeStamp: any;
}