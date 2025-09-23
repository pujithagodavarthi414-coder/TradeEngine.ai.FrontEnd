export class DashboardFilterModel {
    projectId: string;
    userId: string;
    goalId: string;
    sprintId: string;
    dateFrom: string;
    dateTo: string;
    date: string;
    entityId: string;
    branchId: string;
    designationId: string;
    roleId: string;
    sprintStartdate: Date;
    sprintEndDate: Date;
    departmentId: string;
    isFinancialYear: string;
    isActiveEmployeesOnly: string;
    monthDate: string;
    yearDate: string;
}

export class DragedWidget {
    name: any;
    isCustomWidget: boolean;
    customWidgetId: string;
    widgetId: string;
    visualizationType: string;
    xCoOrdinate: string;
    yCoOrdinate: string;
    customAppVisualizationId: string;
    isHtml: boolean;
    isProc: boolean;
    procName: string;
    isProcess: boolean;
    isEntryApp: boolean;
    isEditable: boolean;
}

