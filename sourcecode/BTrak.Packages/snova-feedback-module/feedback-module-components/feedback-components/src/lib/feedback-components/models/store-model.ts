export class StoreModel{
    isDefault: boolean;
    isCompany: boolean;
    storeId: string;
    storeName: string;
    storeSize: string;
    storeCount: string;
    description: string;
    timeStamp: any;
    totalCount: number;
    isArchived: boolean;
    overallStoreSize: number;
}

import { SearchCriteriaInputModelBase } from "./searchCriteriaInputModelBase";

export class StoreSearchModel extends SearchCriteriaInputModelBase{
    isDefault: boolean;
    isCompany: boolean;
    storeId: string;
    storeName: string;
}
