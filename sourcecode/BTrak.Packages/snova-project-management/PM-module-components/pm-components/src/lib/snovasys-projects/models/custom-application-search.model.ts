import { SearchCriteriaInputModelBase } from "../../globalDependencies/models/searchCriteriaInputModelBase";

export class CustomApplicationSearchModel extends SearchCriteriaInputModelBase{
    customApplicationId: string;
    formTypeId: string;
    formId: string;
}