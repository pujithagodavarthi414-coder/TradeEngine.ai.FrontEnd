import { DashboardFilterModel } from "./dashboard-filter.model";
import { CustomQueryHeadersModel } from "./custom-query-headers.model";

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
    isApi:boolean;
    procName:string;
    goalId: string;
    dashboardFilters: any;
    workspaceId: string;
    subQueryType?: string;
    subQuery?: string;
    getSubQuery?: boolean;
    isReportingOnly:boolean;
    isAll: boolean;
    isMyself: boolean;
    isFormTags: boolean;
    moduleIds: any[];
    cronExpressionName: string;
    templateType: string;
    templateUrl: string;
    testSuiteId: string;
    columnFormatTypeId:string;
    mongoQuery: any;
    isMongoQuery : boolean;
    collectionName : string;
    
}
