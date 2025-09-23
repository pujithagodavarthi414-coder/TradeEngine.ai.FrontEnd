import { SearchCriteriaInputModelBase } from "./searchCriteriaInputModelBase";
export class ShipAddressModel extends SearchCriteriaInputModelBase {
    addressId: string;
    clientId: string;
    addressName: string;
    description: string;
    comments: string;
    searchText: string;
    timeStamp: any
    isArchived: boolean;
    isShiptoAddress: boolean;
    isVerified: boolean;
}