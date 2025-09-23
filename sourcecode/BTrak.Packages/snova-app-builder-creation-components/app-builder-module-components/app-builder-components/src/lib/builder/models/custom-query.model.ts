import { DashboardFilterModel } from "./dashboard-filter.model";

export class CustomQueryModel {
    dynamicQuery: string;
    filterQuery: string;
    columnformatQuery: string;
    defaultColumns: string;
    projectId: string;
    submittedFormId: string;
    goalId: string;
    userId: string;
    dashboardFilters: any;
    workspaceId: string;
    dashboardId: string;
    clickedColumn: string;
    clickedColumnData: string;
    isReportingOnly:boolean;
    isAll: boolean;
    isMyself: boolean;
    columnFormatTypes:any;
    columnFormatTypeId?:string;
    columnAltName?:string;
    isMongoQuery: boolean;
    collectionName : string;
    chartColorJson : string;
}
