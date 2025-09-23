import { SearchCriteriaInputModelBase } from "./searchCriteriaInputModelBase";
export class ContractModel extends SearchCriteriaInputModelBase {
    productId: string;
    clientId: string;
    contractId: string;
    contractName: string;
    contractUniqueName: string;
    description: string;
    searchText: string;
    gradeId: string;
    dataSetId: string;
    rateOrTon: any;
    contractQuantity: number;
    remaningQuantity: number;
    usedQuantity: number;
    timeStamp: any
    contractDateFrom: string;
    contractDateTo: string;
    contractNumber: string;
    contractDocument: string;
    isArchived: boolean;
    counterParty: string;
    type: string;
    isPagingRequired: boolean;
    ParamsJson: any = [];
    listType: string;
    contractType: string;
    acceptedByUserId: any;
    cancelComments: string;
    isLinking: boolean;
    isAtLinkedContractEdit : boolean;
}
  export interface contractModelPurchaseAndSale {
    isaArchived: boolean;
  }
