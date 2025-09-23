import { DashboardFilterModel } from "app/views/widgets/Models/dashboardFilterModel";

export class CustomQueryModel {
    dynamicQuery: string;
    filterQuery: string;
    defaultColumns: string;
    projectId: string;
    submittedFormId: string;
    goalId: string;
    userId: string;
    dashboardFilters: DashboardFilterModel
    workspaceId: string;
    dashboardId: string;
    clickedColumn: string;
    clickedColumnData: string;
    isReportingOnly:boolean;
    isAll: boolean;
    isMyself: boolean;
}
