import { DashboardFilterModel } from "app/views/widgets/Models/dashboardFilterModel";
import { CustomQueryHeadersModel } from "./custom-query-headers-model";

export class CustomWidgetsModel {
    customWidgetId: string;
    roleNames: string;
    roleIds: string;
    selectedRoleIds: any[];
    customWidgetName: string;
    widgetQuery: string;
    filterQuery: string;
    isArchived: boolean;
    description: string;
    visualizationType: any;
    visualizationName: any;
    XCoOrdinate: any;
    YCoOrdinate: any;
    defaultColumns: CustomQueryHeadersModel[];
    dashboardId: string;
    name: string;
    chartsDetails: any;
    projectId: string;
    userId: string;
    submittedFormId: string;
    isHtml: boolean;
    isProc:boolean;
    procName:string;
    goalId: string;
    dashboardFilters: DashboardFilterModel
    workspaceId: string;
    subQueryType?: string;
    subQuery?: string;
    getSubQuery?: boolean;
    isReportingOnly:boolean;
    isAll: boolean;
    isMyself: boolean;
    isFormTags: boolean;
}
