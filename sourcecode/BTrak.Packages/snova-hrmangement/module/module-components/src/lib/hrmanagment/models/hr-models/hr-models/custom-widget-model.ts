import { CustomQueryHeadersModel } from "./custom-query-model";

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
    XCoOrdinate: any;
    YCoOrdinate: any;
    defaultColumns: CustomQueryHeadersModel[];
    dashboardId: string;
    name: string;
}