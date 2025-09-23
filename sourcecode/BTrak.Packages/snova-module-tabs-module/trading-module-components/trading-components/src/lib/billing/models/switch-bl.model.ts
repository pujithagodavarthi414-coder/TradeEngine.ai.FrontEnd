export class SwitchBlModel {
    vesselId: string;
    vesselOwnerId: string;
    switchBlId: string;
    contractTemplateId: string;
    dataSetId: string;
    dataSourceId: string;
    isSwitchBl: boolean;
    purchaseContracts: any;
    salesContracts: any;
    purchaseBlDetails: any;
    statusName: string;
    switchBlDetails: SwitchBlDetailsModel[];
    selectedClientId: string;
    isShareSwitchBlContract: boolean;
    isContractSharedToVesselOwner: boolean;
    selectedSaleContractId: string;
    createdByUserId: string;
    clientId: string;

    buyerAcceptComment: string;
    buyerRejectComment: string;
    vesselOwnerAcceptComment: string;
    vesselOwnerRejectComment: string;

    contractId: string;
    oldData: any;
    newData: any;
    isObjectChanged: any;
}

export class SwitchBlDetailsModel {
    actionType: string;
    clientId: string;
    isQuantitySplited: boolean;
    isRequiredQuantity: boolean;
    saleContractId: string;
    purchaseContractDetails: PurchaseContractDetails;
    purchaseContractDetailsList: PurchaseContractDetails[];
    splitList: SplitBlModel[];
    draftBlNumber: string;
    vesselBlNumber: string;
    master: string;
    oceanCarriageStowage: string;
    consignee: string;
    consigner: string;
    notifyParty: string;
    buyerAcceptComment: string;
    buyerRejectComment: string;
    vesselOwnerAcceptComment: string;
    vesselOwnerRejectComment: string;
    isSwitchBlBuyerContractAccepted: boolean;
    isSwitchBlBuyerContractRejected: boolean;
    isSwitchBlVesselOwnerAccepted: boolean;
    isSwitchBlVesselOwnerRejected: boolean;
}

export class PurchaseContractDetails {
    purchaseContractId: string;
    purchaseBlId: string;
    saleContractId: string;
    quantity: number;
    formData: string;
    draftBlNumber: string;
    vesselBlNumber: string;
    master: string;
    oceanCarriageStowage: string;
    consignee: string;
    consigner: string;
    notifyParty: string;
    buyerAcceptComment: string;
    buyerRejectComment: string;
    vesselOwnerAcceptComment: string;
    vesselOwnerRejectComment: string;
    isSwitchBlBuyerContractAccepted: boolean;
    isSwitchBlBuyerContractRejected: boolean;
    isSwitchBlVesselOwnerAccepted: boolean;
    isSwitchBlVesselOwnerRejected: boolean;
}

export class SplitBlModel {
    quantity: number;
    draftBlNumber: string;
    vesselBlNumber: string;
    master: string;
    oceanCarriageStowage: string;
    consignee: string;
    consigner: string;
    notifyParty: string;
    buyerAcceptComment: string;
    buyerRejectComment: string;
    vesselOwnerAcceptComment: string;
    vesselOwnerRejectComment: string;
    isSwitchBlBuyerContractAccepted: boolean;
    isSwitchBlBuyerContractRejected: boolean;
    isSwitchBlVesselOwnerAccepted: boolean;
    isSwitchBlVesselOwnerRejected: boolean;
}