import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { WorkspaceList } from "../../models/workspaceList";
import { WorkspaceActions, WorkspacesActionTypes } from "../actions/Workspacelist.action";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<WorkspaceList> {
    loadingHiddenWorkspaceList: boolean;
    HiddenWorkspaceList: WorkspaceList[];
}

export const HiddenWorkspaceAdapter: EntityAdapter<WorkspaceList> = createEntityAdapter<WorkspaceList>({
    selectId: (HiddenWorkspaces: WorkspaceList) => HiddenWorkspaces.workspaceId
});

export const initialState: State = HiddenWorkspaceAdapter.getInitialState({
    loadingHiddenWorkspaceList: false,
    HiddenWorkspaceList: null
});

export function reducer(
    state: State = initialState,
    action: WorkspaceActions
): State {
    switch (action.type) {
        case WorkspacesActionTypes.LoadHiddenWorkspacesListTriggered:
            return { ...state, loadingHiddenWorkspaceList: true };
        case WorkspacesActionTypes.RefreshHiddenWorkspacesList:
            return { ...state, loadingHiddenWorkspaceList: false };
        case WorkspacesActionTypes.LoadHiddenWorkspacesListCompleted:
            return HiddenWorkspaceAdapter.addAll(action.HiddenWorkspaceList, {
                ...state,
                loadingHiddenWorkspaceList: false
            });
        case WorkspacesActionTypes.LoadUnHideWorkspacesListTriggered:
            return { ...state, loadingHiddenWorkspaceList: true };
        case WorkspacesActionTypes.LoadUnHideWorkspacesListCompleted:
            return HiddenWorkspaceAdapter.removeOne(action.UnHiddenWorkspaceId, {
                ...state,
                loadingHiddenWorkspaceList: false
            });
        default:
            return state;
    }
}
