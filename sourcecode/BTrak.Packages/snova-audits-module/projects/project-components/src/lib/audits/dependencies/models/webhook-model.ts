import { SearchCriteriaInputModelBase } from "./searchCriteriaInputModelBase";

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
