import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { WorkspaceActions, WorkspacesActionTypes } from "../actions/Workspacelist.action";
import { WorkspaceList } from '../../Models/workspace-list.model';

// tslint:disable-next-line: interface-name
export interface State extends EntityState<WorkspaceList> {
    loadingWorkspace: boolean;
    loadingWorkspaceList: boolean;
    loadingWorkspaceDelete: boolean;
    WorkspaceList: WorkspaceList[];
}

export const WorkspaceAdapter: EntityAdapter<WorkspaceList> = createEntityAdapter<WorkspaceList>({
    selectId: (Workspaces: WorkspaceList) => Workspaces.workspaceId
});

export const initialState: State = WorkspaceAdapter.getInitialState({
    loadingWorkspace: false,
    loadingWorkspaceList: false,
    loadingWorkspaceDelete: false,
    WorkspaceList: null
});

export function reducer(
    state: State = initialState,
    action: WorkspaceActions
): State {
    switch (action.type) {
        case WorkspacesActionTypes.LoadWorkspacesListTriggered:
            return { ...state, loadingWorkspaceList: true };
        case WorkspacesActionTypes.LoadWorkspacesListCompleted:
            return WorkspaceAdapter.addAll(action.WorkspaceList, {
                ...state,
                loadingWorkspaceList: false
            });
        case WorkspacesActionTypes.LoadWorkspacesTriggered:
            return { ...state, loadingWorkspace: true };
        case WorkspacesActionTypes.LoadWorkspacesCompleted:
            return { ...state, loadingWorkspace: false };
        case WorkspacesActionTypes.WorkspaceEditCompletedWithInPlaceUpdate:
            return WorkspaceAdapter.updateOne(action.workspaceUpdates.workspaceUpdate, state);
        case WorkspacesActionTypes.RefreshWorkspacesList:
            return WorkspaceAdapter.upsertOne(action.latestWorkspaceData, state);
        case WorkspacesActionTypes.LoadWorkspaceDeleteTriggered:
            return { ...state, loadingWorkspaceDelete: true };
        case WorkspacesActionTypes.LoadWorkspaceDeleteCompleted:
            return WorkspaceAdapter.removeOne(action.deleteId, state);
        default:
            return state;
    }
}
