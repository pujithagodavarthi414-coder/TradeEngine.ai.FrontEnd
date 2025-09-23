import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { DashboardList } from "../../models/dashboardList";
import { DashboardActions, DashboardsActionTypes } from "../actions/dashboardlist.action";

// tslint:disable-next-line: interface-name
export interface State extends EntityState<DashboardList>{
    loadingDashboard: boolean;
    loadingDashboardList: boolean;
    dashboardList: DashboardList[];
}

export const DashboardAdapter: EntityAdapter<DashboardList> = createEntityAdapter<DashboardList>({
    selectId: (Dashboards: DashboardList) => Dashboards.workspaceId
});

export const initialState: State = DashboardAdapter.getInitialState({
    loadingDashboard: false,
    loadingDashboardList: false,
    dashboardList: null
});

export function reducer(
    state: State = initialState,
    action: DashboardActions
): State {
    switch (action.type) {
        case DashboardsActionTypes.LoadDashboardsTriggered:
            return { ...state, loadingDashboard: true };
        case DashboardsActionTypes.LoadDashboardsCompleted:
            return { ...state, loadingDashboard: false };
        case DashboardsActionTypes.LoadDashboardsListTriggered:
            return { ...state, loadingDashboardList: true };
        case DashboardsActionTypes.LoadDashboardsListCompleted:
            return DashboardAdapter.addAll(action.DashboardList, {
                    ...state,
                    loadingDashboardList: false
                });
        default:
            return state;
    }
}
