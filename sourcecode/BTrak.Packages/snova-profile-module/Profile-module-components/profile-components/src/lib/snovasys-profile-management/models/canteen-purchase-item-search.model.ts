import { SearchCriteriaInputModelBase } from './search-criteria-input-base.model';

export class CanteenPurchaseItemSearchModel extends SearchCriteriaInputModelBase {
   userId: string;
   dateFrom: Date;
   dateTo: Date;
   entityid: string;
}