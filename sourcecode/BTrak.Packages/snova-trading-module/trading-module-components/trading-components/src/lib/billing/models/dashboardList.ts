import { Dashboard } from "./dashboard";

export class DashboardList {
    workspaceId: string;
    Id: string;
    isArchived: boolean;
    dashboard: Dashboard[];
    widgetContent: string;
    totalCount: number;
    timestamp: any;
    dashboardId: string;
    isCustomizedFor: string;
    CustomAppVisualizationId: string;
    ExtraVariableJson: string;
}

export class WorkspaceDashboardFilterModel {
    workspaceDashboardId: string;
    workspaceDashboardFilterId: string;
    filterJson: string;
    isCalenderView: boolean;
    searchText: string;
    state: any;
    isArchived: boolean;
}