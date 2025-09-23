import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class StoreSearchModel extends SearchCriteriaInputModelBase{
    isDefault: boolean;
    isCompany: boolean;
    storeId: string;
    storeName: string;
}