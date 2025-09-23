import { SearchCriteriaInputModelBase } from "./search-criteria-input-base.model";

export class CustomApplicationSearchModel extends SearchCriteriaInputModelBase{
    customApplicationId: string;
    formTypeId: string;
    formId: string;
    isList: boolean;
}