import { SearchCriteriaInputModelBase } from "./search-criteria-input-base.model";

export class WebHookModel extends SearchCriteriaInputModelBase {
    webHookId: string;
    webHookName: string;
    webHookUrl: string;
    createdDateTime: Date;
    createdOn: string;
    inActiveDateTime: Date;
    timeStamp: any;
    totalCount: number;
}
