import { Dashboard } from "./dashboard.model";

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
