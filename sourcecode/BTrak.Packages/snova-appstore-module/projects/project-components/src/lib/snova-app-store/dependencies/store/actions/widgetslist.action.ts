import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { WidgetList } from '../../models/widgetlist';

export enum WidgetsActionTypes {
    LoadWidgetsTriggered = '[Widget List Component] Initial Widgets List Load Triggered',
    LoadWidgetsCompleted = '[Widget List Component] Initial Widgets List Load Completed',
    LoadWidgetsListTriggered = '[Widget List Component] Initial Widgets List  Triggered',
    LoadWidgetsListCompleted = '[Widget List Component] Initial Widgets List Completed',
    WidgetFailed = '[Widget List Component] Widget List Load Failed',
    WidgetException = '[Widget List Component] Widget List Exception Handled',
    LoadTagsReorderTriggered = '[[Widget List Component] Widget Tags Reorder Triggered',
    LoadTagsReorderCompleted = '[[Widget List Component] Widget Tags Reorder Completed'
}

export class LoadWidgetsTriggered implements Action {
    type = WidgetsActionTypes.LoadWidgetsTriggered;
    widgets: WidgetList;
    searchWidgetsSuccess: WidgetList[];
    searchWidget: WidgetList;
    widgetsList: WidgetList;
    widgetList: WidgetList[];
    responseMessages: string[];
    errorMessage: string;
    TagIdList: string[];
    constructor() { }
}

export class LoadTagsReorderTriggered implements Action {
    type = WidgetsActionTypes.LoadTagsReorderTriggered;
    widgets: WidgetList;
    searchWidgetsSuccess: WidgetList[];
    searchWidget: WidgetList;
    widgetsList: WidgetList;
    widgetList: WidgetList[];
    responseMessages: string[];
    errorMessage: string;
    constructor(public TagIdList: string[]) { }
}

export class LoadTagsReorderCompleted implements Action {
    type = WidgetsActionTypes.LoadTagsReorderCompleted;
    widgets: WidgetList;
    searchWidgetsSuccess: WidgetList[];
    searchWidget: WidgetList;
    widgetsList: WidgetList;
    widgetList: WidgetList[];
    responseMessages: string[];
    errorMessage: string;
    constructor() { }
}

// tslint:disable-next-line: max-classes-per-file
export class LoadWidgetsCompleted implements Action {
    type = WidgetsActionTypes.LoadWidgetsCompleted;
    widgets: WidgetList;
    searchWidgetsSuccess: WidgetList[];
    searchWidget: WidgetList;
    widgetsList: WidgetList;
    widgetList: WidgetList[];
    responseMessages: string[];
    errorMessage: string;
    TagIdList: string[];
    constructor() { }
}

// tslint:disable-next-line: max-classes-per-file
export class LoadWidgetsListTriggered implements Action {
    type = WidgetsActionTypes.LoadWidgetsListTriggered;
    widgets: WidgetList;
    searchWidgetsSuccess: WidgetList[];
    searchWidget: WidgetList;
    widgetList: WidgetList[];
    responseMessages: string[];
    errorMessage: string;
    TagIdList: string[];
    constructor(public widgetsList: WidgetList) { }
}

// tslint:disable-next-line: max-classes-per-file
export class LoadWidgetsListCompleted implements Action {
    type = WidgetsActionTypes.LoadWidgetsListCompleted;
    widgets: WidgetList;
    searchWidgetsSuccess: WidgetList[];
    searchWidget: WidgetList;
    widgetsList: WidgetList;
    responseMessages: string[];
    errorMessage: string;
    TagIdList: string[];
    constructor(public widgetList: WidgetList[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class WidgetFailed implements Action {
    type = WidgetsActionTypes.WidgetFailed;
    widgets: WidgetList;
    searchWidgetsSuccess: WidgetList[];
    searchWidget: WidgetList;
    widgetsList: WidgetList;
    widgetList: WidgetList[];
    errorMessage: string;
    TagIdList: string[];
    constructor(public responseMessages: string[]) { }
}

// tslint:disable-next-line: max-classes-per-file
export class WidgetException implements Action {
    type = WidgetsActionTypes.WidgetException;
    widgets: WidgetList;
    searchWidgetsSuccess: WidgetList[];
    searchWidget: WidgetList;
    widgetsList: WidgetList;
    widgetList: WidgetList[];
    responseMessages: string[];
    TagIdList: string[];
    constructor(public errorMessage: string) { }
}

// tslint:disable-next-line: max-line-length
export type WidgetActions = LoadWidgetsTriggered | LoadTagsReorderTriggered | LoadWidgetsCompleted | LoadWidgetsListTriggered | LoadWidgetsListCompleted | WidgetFailed | WidgetException
