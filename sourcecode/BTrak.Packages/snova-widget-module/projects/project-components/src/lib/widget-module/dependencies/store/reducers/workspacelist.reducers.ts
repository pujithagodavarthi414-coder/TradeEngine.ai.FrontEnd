import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { WorkspaceList } from "../../models/workspaceList";
import { WorkspaceActions, WorkspacesActionTypes } from "../actions/Workspacelist.action";

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
            case WorkspacesActionTypes.LoadChildWorkspacesTriggered:
                return { ...state, loadingWorkspace: true };
            case WorkspacesActionTypes.LoadChildWorkspacesCompleted:
                return { ...state, loadingWorkspace: false };
        case WorkspacesActionTypes.WorkspaceEditCompletedWithInPlaceUpdate:
            return WorkspaceAdapter.updateOne(action.workspaceUpdates.workspaceUpdate, state);
        case WorkspacesActionTypes.RefreshWorkspacesList:
            return WorkspaceAdapter.upsertOne(action.latestWorkspaceData, state);
        case WorkspacesActionTypes.LoadWorkspaceDeleteTriggered:
            return { ...state, loadingWorkspaceDelete: true };
        case WorkspacesActionTypes.LoadWorkspaceDeleteCompleted:
            return WorkspaceAdapter.removeOne(action.deleteId,{ ...state,  loadingWorkspace: false});
        case WorkspacesActionTypes.WorkspaceFailed: 
            return { ...state, loadingWorkspace: false }
        default:
            return state;
    }
}
