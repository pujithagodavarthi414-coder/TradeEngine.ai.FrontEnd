import { SearchCriteriaInputModelBase } from "./searchCriteriaInputModelBase";

export class CustomApplicationSearchModel extends SearchCriteriaInputModelBase{
    customApplicationId: string;
    formTypeId: string;
    formId: string;
}