import { SearchCriteriaInputModelBase } from "../models/searchCriteriaInputModelBase";

export class WidgetList extends SearchCriteriaInputModelBase{
    id: number;
    widgetId: string;
    widgetName: string;
    isCustomWidget: boolean;
    isArchived: boolean;
    isReplaceTags: boolean;
    timeStamp: any;
    tags: string;
    isHtml: boolean;
    isProc:boolean;
    isApi:boolean;
    procName:string;
    widgetTags: WidgetTag[];
    workSpaceNames: string;
    widgetWorkSpaces: string[];
    isProcess : boolean;
    isEntryApp : boolean;
    isPublished : boolean;
    isEditable: boolean;
    totalCount: number;
    tagId: string;
}

export class WidgetTag {
    tagId: string;
    tagName: string;
}
