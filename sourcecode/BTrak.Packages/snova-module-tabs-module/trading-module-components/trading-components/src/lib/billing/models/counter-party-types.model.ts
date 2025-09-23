import { SearchCriteriaInputModelBase } from "./searchCriteriaInputModelBase";
export class CounterPartyTypesModel extends SearchCriteriaInputModelBase {
    clientTypeId: string;
    roleNames: string;
    roleIds: [];
    clientTypeIds: any[];
    order: number;
    clientTypeName: string;
    roleIdsListXml: string;
    searchText: string;
    timeStamp: any
    isArchived: boolean;
}