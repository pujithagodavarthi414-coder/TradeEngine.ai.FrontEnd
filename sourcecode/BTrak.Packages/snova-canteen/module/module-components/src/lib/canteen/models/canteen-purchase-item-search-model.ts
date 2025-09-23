import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class CanteenPurchaseItemSearchModel extends SearchCriteriaInputModelBase {
    userId: string;
    dateFrom: Date;
    dateTo: Date;
    entityid: string;
}