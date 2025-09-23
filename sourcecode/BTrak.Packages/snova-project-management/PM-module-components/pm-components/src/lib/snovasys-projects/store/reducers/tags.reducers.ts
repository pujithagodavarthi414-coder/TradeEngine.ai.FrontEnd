import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import {TagsActionTypes,TagActions} from "../actions/tags.action";
import { TagsModel } from '../../models/tags.model';


export interface State extends EntityState<TagsModel> {
  loadingTags: boolean;
}

export const tagsAdapter: EntityAdapter<
TagsModel
> = createEntityAdapter<TagsModel>({
    selectId: (tag: TagsModel) => tag.tagId
});


export const initialState: State = tagsAdapter.getInitialState({
    loadingTags: false
});


export function reducer(
    state: State = initialState,
    action: TagActions
): State {
    switch (action.type) {
        case TagsActionTypes.LoadTagsTriggred:
            return {...initialState, loadingTags: true};
        case TagsActionTypes.LoadTagsCompleted:
            return tagsAdapter.addMany(action.tagsList, {
                ...state,
                loadingTags: false
            });
        case TagsActionTypes.LoadTagsFailed:
            return { ...state, loadingTags: true };
        case TagsActionTypes.TagsExceptionHandled:
            return { ...state, loadingTags: false};
        default:
            return state;
    }
}


