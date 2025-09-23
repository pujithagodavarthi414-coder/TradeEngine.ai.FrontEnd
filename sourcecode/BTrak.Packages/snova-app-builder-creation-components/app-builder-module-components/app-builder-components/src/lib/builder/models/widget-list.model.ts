import { SearchCriteriaInputModelBase } from "./search-criteria-input-base.model";

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
    procName:string;
    widgetTags: string[];
    workSpaceNames: string;
    widgetWorkSpaces: string[];
    isProcess : boolean;
    isEntryApp : boolean;
    isPublished : boolean;
    isEditable: boolean;
    totalCount: number;
}
