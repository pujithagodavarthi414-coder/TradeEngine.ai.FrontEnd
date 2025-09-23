export interface WidgetModel {
    widgetId: string;
    widgetName: string;
    roleNames: string;
    isArchived: boolean
    timeStamp: any;
}

export interface TabsModel {
    name: string;
    id: number;
}

export interface DashboardContentModel {
    cols: number;
    rows: number;
    y: number;
    x: number;
    component?: any;
    name: string;
}

export interface ModuleData {
    path: string;
    location: string;
    moduleName: string;
    rootComponent?: string;
    description: string;
    registered?: boolean;
    apps: string[];
}

export interface DashboardModel {
    workspaceId: string;
    dashboardId: string;
    isArchived: boolean;
    dashboard: Array<DashboardContentModel>;
    widgetContent: string;
    totalCount: number;
    timestamp: any;
}

