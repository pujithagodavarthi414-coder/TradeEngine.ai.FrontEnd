import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class FoodItemSearchInputModel extends SearchCriteriaInputModelBase {
    foodItemId: string;
    dateFrom: Date;
    dateTo: Date;
    entityId: string;
}