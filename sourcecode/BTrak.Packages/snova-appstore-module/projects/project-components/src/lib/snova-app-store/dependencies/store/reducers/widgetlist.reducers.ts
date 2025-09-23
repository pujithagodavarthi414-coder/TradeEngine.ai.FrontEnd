import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { WidgetList } from '../../models/widgetlist';
import { WidgetsActionTypes, WidgetActions } from '../actions/widgetslist.action';


export interface State extends EntityState<WidgetList>{
    loadingWidget: boolean;    
    loadingWidgetList: boolean;
    loadingTagsReorder: boolean,
    widgetList: WidgetList[];
}

export const widgetAdapter: EntityAdapter<WidgetList> = createEntityAdapter<WidgetList>({
    selectId: (widgets: WidgetList) => widgets.id
});

export const initialState: State = widgetAdapter.getInitialState({
    loadingWidget: false,    
    loadingWidgetList: false,
    loadingTagsReorder: false,
    widgetList: null
});

export function reducer(
    state: State = initialState,
    action: WidgetActions
): State {
    switch (action.type) {
        case WidgetsActionTypes.LoadWidgetsTriggered:
            return { ...state, loadingWidget: true };
        case WidgetsActionTypes.LoadWidgetsCompleted:
            return { ...state, loadingWidget: false };
        case WidgetsActionTypes.LoadWidgetsListTriggered:
            return { ...state, loadingWidgetList: true };
        case WidgetsActionTypes.LoadWidgetsListCompleted:               
            return widgetAdapter.addAll(action.widgetList, {
                    ...state,
                    loadingWidgetList: false
                });
        case WidgetsActionTypes.LoadTagsReorderTriggered:
            return { ...state, loadingTagsReorder: true };
        case WidgetsActionTypes.LoadTagsReorderCompleted:
            return { ...state, loadingTagsReorder: false };
        default:
            return state;
    }
}