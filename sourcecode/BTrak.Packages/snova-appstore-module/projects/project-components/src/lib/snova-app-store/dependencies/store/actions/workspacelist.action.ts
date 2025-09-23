import { Update } from "@ngrx/entity";
import { Action } from "@ngrx/store";
import { WorkspaceList } from "../../models/workspaceList";

export enum WorkspacesActionTypes {
    LoadWorkspacesListTriggered = "[Workspace List Component] Initial Workspaces List  Triggered",
    LoadWorkspacesListCompleted = "[Workspace List Component] Initial Workspaces List Completed",
    LoadUnHideWorkspacesListTriggered = "[UnHide Workspace List Component] Initial UnHide Workspaces List  Triggered",
    LoadUnHideWorkspacesListCompleted = "[UnHide Workspace List Component] Initial UnHide Workspaces List Completed",
    WorkspaceFailed = "[Workspace List Component] Workspace List Load Failed",
    WorkspaceException = "[Workspace List Component] Workspace List Exception Handled",
    LoadWorkspacesTriggered = "[Workspace List Component] Initial Workspaces List Load Triggered",
    LoadWorkspacesCompleted = "[Workspace List Component] Initial Workspaces List Load Completed",
    LoadHiddenWorkspacesListTriggered = "[Hidden Workspace List Component] Initial Hidden Workspaces List  Triggered",
    LoadHiddenWorkspacesListCompleted = "[Hidden Workspace List Component] Initial Hidden Workspaces List Completed",
    LoadWorkspaceByIdTriggered = "[Workspace List Component] Initial Workspace By Id Load Triggered",
    LoadWorkspaceByIdCompleted = "[Workspace List Component] Initial Workspace By Id Load Completed",
    LoadWorkspaceDeleteTriggered = "[Workspace List Component] Initial Workspace Load Delete Triggered",
    LoadWorkspaceDeleteCompleted = "[Workspace List Component] Initial Workspace Load Delete Completed",
    RefreshWorkspacesList = "[Refresh List Component] Refresh Workspace List",
    LoadSnackbar = "[Load snackbar Component] loads snackbar",
    WorkspaceEditCompletedWithInPlaceUpdate = "[Workspace List Component] Initial Workspace Update Load Completed",
    RefreshHiddenWorkspacesList = "[Refresh Hidden List Component] Refresh Hidden Workspace List",
    LoadWorkspacesCompletedIfNoId = "[Workspace List Component] Initial Workspaces List Load Completed If No Id",
}

export class LoadWorkspacesListTriggered implements Action {
    type = WorkspacesActionTypes.LoadWorkspacesListTriggered;
    workspaceId: string;
    Workspaces: WorkspaceList;
    searchWorkspacesSuccess: WorkspaceList[];
    searchWorkspace: WorkspaceList;
    WorkspaceList: WorkspaceList[];
    HiddenWorkspaceList: WorkspaceList[];
    unHideWorkspace: WorkspaceList;
    latesthiddenWorkspaceId: string
    UnHiddenWorkspaceId: string
    latestWorkspaceData: WorkspaceList;
    deleteId: string;
    workspaceUpdates: { workspaceUpdate: Update<WorkspaceList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public WorkspacesList: WorkspaceList) { }
}

export class LoadWorkspacesListCompleted implements Action {
    type = WorkspacesActionTypes.LoadWorkspacesListCompleted;
    workspaceId: string;
    Workspaces: WorkspaceList;
    searchWorkspacesSuccess: WorkspaceList[];
    HiddenWorkspaceList: WorkspaceList[];
    latestWorkspaceData: WorkspaceList;
    searchWorkspace: WorkspaceList;
    deleteId: string;
    unHideWorkspace: WorkspaceList;
    latesthiddenWorkspaceId: string
    UnHiddenWorkspaceId: string
    WorkspacesList: WorkspaceList;
    workspaceUpdates: { workspaceUpdate: Update<WorkspaceList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public WorkspaceList: WorkspaceList[]) { }
}


export class LoadWorkspacesTriggered implements Action {
    type = WorkspacesActionTypes.LoadWorkspacesTriggered;
    workspaceId: string;
    Workspaces: WorkspaceList;
    searchWorkspacesSuccess: WorkspaceList[];
    searchWorkspace: WorkspaceList;
    WorkspaceList: WorkspaceList[];
    HiddenWorkspaceList: WorkspaceList[];
    deleteWorkspace: WorkspaceList;
    deleteId: string;
    latestWorkspaceData: WorkspaceList;
    latesthiddenWorkspaceId: string;
    unHideWorkspace: WorkspaceList;
    UnHiddenWorkspaceId: string;
    workspaceUpdates: { workspaceUpdate: Update<WorkspaceList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public workspace: WorkspaceList) { }
}

export class LoadWorkspacesCompleted implements Action {
    type = WorkspacesActionTypes.LoadWorkspacesCompleted;
    workspace: WorkspaceList;
    Workspaces: WorkspaceList;
    searchWorkspacesSuccess: WorkspaceList[];
    searchWorkspace: WorkspaceList;
    WorkspaceList: WorkspaceList[];
    HiddenWorkspaceList: WorkspaceList[];
    deleteWorkspace: WorkspaceList;
    unHideWorkspace: WorkspaceList;
    latesthiddenWorkspaceId: string;
    UnHiddenWorkspaceId: string;
    deleteId: string;
    latestWorkspaceData: WorkspaceList;
    workspaceUpdates: { workspaceUpdate: Update<WorkspaceList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public workspaceId: string) { }
}

export class LoadWorkspaceByIdTriggered implements Action {
    type = WorkspacesActionTypes.LoadWorkspaceByIdTriggered;
    workspaceId: string;
    Workspaces: WorkspaceList;
    searchWorkspacesSuccess: WorkspaceList[];
    WorkspacesList: WorkspaceList;
    WorkspaceList: WorkspaceList[];
    HiddenWorkspaceList: WorkspaceList[];
    unHideWorkspace: WorkspaceList;
    UnHiddenWorkspaceId: string;
    latesthiddenWorkspaceId: string;
    deleteWorkspace: WorkspaceList;
    deleteId: string;
    latestWorkspaceData: WorkspaceList;
    workspaceUpdates: { workspaceUpdate: Update<WorkspaceList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchWorkspace: WorkspaceList) { }
}

export class LoadWorkspaceByIdCompleted implements Action {
    type = WorkspacesActionTypes.LoadWorkspaceByIdCompleted;
    workspaceId: string;
    Workspaces: WorkspaceList;
    searchWorkspace: WorkspaceList;
    WorkspacesList: WorkspaceList;
    WorkspaceList: WorkspaceList[];
    HiddenWorkspaceList: WorkspaceList[];
    unHideWorkspace: WorkspaceList;
    latesthiddenWorkspaceId: string;
    UnHiddenWorkspaceId: string;
    deleteWorkspace: WorkspaceList;
    deleteId: string;
    latestWorkspaceData: WorkspaceList;
    workspaceUpdates: { workspaceUpdate: Update<WorkspaceList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public searchWorkspacesSuccess: WorkspaceList[]) { }
}

export class WorkspaceEditCompletedWithInPlaceUpdate implements Action {
    type = WorkspacesActionTypes.WorkspaceEditCompletedWithInPlaceUpdate;
    workspaceId: string;
    Workspaces: WorkspaceList;
    searchWorkspace: WorkspaceList;
    WorkspacesList: WorkspaceList;
    WorkspaceList: WorkspaceList[];
    unHideWorkspace: WorkspaceList;
    latesthiddenWorkspaceId: string;
    UnHiddenWorkspaceId: string;
    deleteWorkspace: WorkspaceList;
    deleteId: string;
    searchWorkspacesSuccess: WorkspaceList[];
    HiddenWorkspaceList: WorkspaceList[];
    latestWorkspaceData: WorkspaceList;
    responseMessages: string[];
    errorMessage: string;
    constructor(public workspaceUpdates: { workspaceUpdate: Update<WorkspaceList> }) { }
}

export class RefreshWorkspacesList implements Action {
    type = WorkspacesActionTypes.RefreshWorkspacesList;
    workspaceId: string;
    Workspaces: WorkspaceList;
    deleteId: string;
    searchWorkspacesSuccess: WorkspaceList[];
    searchWorkspace: WorkspaceList;
    WorkspacesList: WorkspaceList;
    WorkspaceList: WorkspaceList[];
    unHideWorkspace: WorkspaceList;
    latesthiddenWorkspaceId: string;
    UnHiddenWorkspaceId: string;
    HiddenWorkspaceList: WorkspaceList[];
    deleteWorkspace: WorkspaceList;
    workspaceUpdates: { workspaceUpdate: Update<WorkspaceList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public latestWorkspaceData: WorkspaceList) { }
}

export class RefreshHiddenWorkspacesList implements Action {
    type = WorkspacesActionTypes.RefreshHiddenWorkspacesList;
    workspaceId: string;
    Workspaces: WorkspaceList;
    deleteId: string;
    searchWorkspacesSuccess: WorkspaceList[];
    searchWorkspace: WorkspaceList;
    latestWorkspaceData: WorkspaceList
    WorkspacesList: WorkspaceList;
    WorkspaceList: WorkspaceList[];
    unHideWorkspace: WorkspaceList;
    UnHiddenWorkspaceId: string;
    HiddenWorkspaceList: WorkspaceList[];
    deleteWorkspace: WorkspaceList;
    workspaceUpdates: { workspaceUpdate: Update<WorkspaceList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public latesthiddenWorkspaceId: string) { }
}

export class LoadWorkspaceDeleteTriggered implements Action {
    type = WorkspacesActionTypes.LoadWorkspaceDeleteTriggered;
    workspaceId: string;
    Workspaces: WorkspaceList;
    searchWorkspacesSuccess: WorkspaceList[];
    searchWorkspace: WorkspaceList;
    WorkspacesList: WorkspaceList;
    WorkspaceList: WorkspaceList[];
    HiddenWorkspaceList: WorkspaceList[];
    deleteId: string;
    unHideWorkspace: WorkspaceList;
    UnHiddenWorkspaceId: string;
    latesthiddenWorkspaceId: string;
    latestWorkspaceData: WorkspaceList;
    workspaceUpdates: { workspaceUpdate: Update<WorkspaceList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public deleteWorkspace: WorkspaceList) { }
}

export class LoadWorkspaceDeleteCompleted implements Action {
    type = WorkspacesActionTypes.LoadWorkspaceDeleteCompleted;
    workspaceId: string;
    Workspaces: WorkspaceList;
    searchWorkspacesSuccess: WorkspaceList[];
    searchWorkspace: WorkspaceList;
    WorkspacesList: WorkspaceList;
    WorkspaceList: WorkspaceList[];
    HiddenWorkspaceList: WorkspaceList[];
    unHideWorkspace: WorkspaceList;
    UnHiddenWorkspaceId: string;
    latesthiddenWorkspaceId: string;
    deleteWorkspace: WorkspaceList;
    latestWorkspaceData: WorkspaceList;
    workspaceUpdates: { workspaceUpdate: Update<WorkspaceList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public deleteId: string) { }
}

export class LoadHiddenWorkspacesListTriggered implements Action {
    type = WorkspacesActionTypes.LoadHiddenWorkspacesListTriggered;
    workspaceId: string;
    Workspaces: WorkspaceList;
    searchWorkspacesSuccess: WorkspaceList[];
    searchWorkspace: WorkspaceList;
    WorkspaceList: WorkspaceList[];
    latestWorkspaceData: WorkspaceList;
    unHideWorkspace: WorkspaceList;
    UnHiddenWorkspaceId: string;
    latesthiddenWorkspaceId: string;
    deleteId: string;
    HiddenWorkspaceList: WorkspaceList[];
    workspaceUpdates: { workspaceUpdate: Update<WorkspaceList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public WorkspacesList: WorkspaceList) { }
}

export class LoadHiddenWorkspacesListCompleted implements Action {
    type = WorkspacesActionTypes.LoadHiddenWorkspacesListCompleted;
    workspaceId: string;
    Workspaces: WorkspaceList;
    searchWorkspacesSuccess: WorkspaceList[];
    latestWorkspaceData: WorkspaceList;
    searchWorkspace: WorkspaceList;
    deleteId: string;
    unHideWorkspace: WorkspaceList;
    UnHiddenWorkspaceId: string;
    latesthiddenWorkspaceId: string;
    WorkspaceList: WorkspaceList[];
    WorkspacesList: WorkspaceList;
    workspaceUpdates: { workspaceUpdate: Update<WorkspaceList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public HiddenWorkspaceList: WorkspaceList[]) { }
}
    
export class LoadUnHideWorkspacesListTriggered implements Action {
    type = WorkspacesActionTypes.LoadUnHideWorkspacesListTriggered;
    workspaceId: string;
    Workspaces: WorkspaceList;
    searchWorkspacesSuccess: WorkspaceList[];
    searchWorkspace: WorkspaceList;
    WorkspaceList: WorkspaceList[];
    HiddenWorkspaceList: WorkspaceList[];
    WorkspacesList: WorkspaceList;
    UnHiddenWorkspaceId: string;
    latestWorkspaceData: WorkspaceList;
    deleteId: string;
    latesthiddenWorkspaceId: string;
    workspaceUpdates: { workspaceUpdate: Update<WorkspaceList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public unHideWorkspace: WorkspaceList ) { }
}

export class LoadUnHideWorkspacesListCompleted implements Action {
    type = WorkspacesActionTypes.LoadUnHideWorkspacesListCompleted;
    workspaceId: string;
    Workspaces: WorkspaceList;
    searchWorkspacesSuccess: WorkspaceList[];
    WorkspaceList: WorkspaceList[];
    unHideWorkspace: WorkspaceList;
    HiddenWorkspaceList: WorkspaceList[];
    latestWorkspaceData: WorkspaceList;
    searchWorkspace: WorkspaceList;
    deleteId: string;
    WorkspacesList: WorkspaceList;
    latesthiddenWorkspaceId: string;
    workspaceUpdates: { workspaceUpdate: Update<WorkspaceList> };
    responseMessages: string[];
    errorMessage: string;
    constructor(public UnHiddenWorkspaceId: string) { }
}

export class WorkspaceFailed implements Action {
    type = WorkspacesActionTypes.WorkspaceFailed;
    workspaceId: string;
    Workspaces: WorkspaceList;
    searchWorkspacesSuccess: WorkspaceList[];
    deleteId: string;
    unHideWorkspace: WorkspaceList;
    UnHiddenWorkspaceId: string;
    searchWorkspace: WorkspaceList;
    latestWorkspaceData: WorkspaceList;
    WorkspacesList: WorkspaceList;
    latesthiddenWorkspaceId: string;
    workspaceUpdates: { workspaceUpdate: Update<WorkspaceList> };
    WorkspaceList: WorkspaceList[];
    HiddenWorkspaceList: WorkspaceList[];
    errorMessage: string;
    constructor(public responseMessages: string[]) { }
}

export class LoadSnackbar implements Action {
    type = WorkspacesActionTypes.LoadSnackbar;
    workspaceId: string;
    Workspaces: WorkspaceList;
    searchWorkspacesSuccess: WorkspaceList[];
    latestWorkspaceData: WorkspaceList;
    searchWorkspace: WorkspaceList;
    unHideWorkspace: WorkspaceList;
    UnHiddenWorkspaceId: string;
    latesthiddenWorkspaceId: string;
    deleteId: string;
    WorkspaceList: WorkspaceList[];
    HiddenWorkspaceList: WorkspaceList[];
    WorkspacesList: WorkspaceList;
    workspaceUpdates: { workspaceUpdate: Update<WorkspaceList> };
    responseMessages: string[];
    errorMessage: string;
    constructor( ) { }
}

export class WorkspaceException implements Action {
    type = WorkspacesActionTypes.WorkspaceException;
    workspaceId: string;
    Workspaces: WorkspaceList;
    searchWorkspacesSuccess: WorkspaceList[];
    unHideWorkspace: WorkspaceList;
    UnHiddenWorkspaceId: string;
    latesthiddenWorkspaceId: string;
    deleteId: string;
    latestWorkspaceData: WorkspaceList;
    searchWorkspace: WorkspaceList;
    WorkspacesList: WorkspaceList;
    workspaceUpdates: { workspaceUpdate: Update<WorkspaceList> };
    WorkspaceList: WorkspaceList[];
    HiddenWorkspaceList: WorkspaceList[];
    responseMessages: string[];
    constructor(public errorMessage: string) { }
}

export class LoadWorkspacesCompletedIfNoId implements Action {
    type = WorkspacesActionTypes.LoadWorkspacesCompletedIfNoId;
    workspaceId: string;
    Workspaces: WorkspaceList;
    searchWorkspacesSuccess: WorkspaceList[];
    searchWorkspace: WorkspaceList;
    WorkspaceList: WorkspaceList[];
    HiddenWorkspaceList: WorkspaceList[];
    unHideWorkspace: WorkspaceList;
    latesthiddenWorkspaceId: string
    UnHiddenWorkspaceId: string
    latestWorkspaceData: WorkspaceList;
    deleteId: string;
    workspaceUpdates: { workspaceUpdate: Update<WorkspaceList> };
    responseMessages: string[];
    errorMessage: string;
    WorkspacesList: WorkspaceList;
    constructor() { }
}

export type WorkspaceActions = LoadWorkspacesTriggered | LoadWorkspacesCompleted | LoadWorkspacesListTriggered | LoadWorkspacesListCompleted | LoadWorkspaceByIdCompleted | LoadWorkspaceDeleteCompleted | LoadWorkspaceDeleteCompleted | LoadWorkspaceDeleteTriggered | RefreshWorkspacesList | WorkspaceEditCompletedWithInPlaceUpdate | WorkspaceFailed | WorkspaceException | LoadHiddenWorkspacesListTriggered | LoadHiddenWorkspacesListCompleted | LoadSnackbar | LoadUnHideWorkspacesListTriggered | LoadUnHideWorkspacesListCompleted | RefreshHiddenWorkspacesList | LoadWorkspacesCompletedIfNoId