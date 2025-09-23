import { SwitchBlDetailsModel } from "./switch-bl.model";

export class FinalSwitchBlModel {
    saleContractId: string;
    dataSetId: string;
    dataSourceId: string;
    vesselOwnerId: string;
    isShareSwitchBlContract: boolean;
    isContractSharedToVesselOwner: boolean;
    statusName: string;
    purchaseBlDetails: any;
    switchBlDetails: SwitchBlDetailsModel[];
}