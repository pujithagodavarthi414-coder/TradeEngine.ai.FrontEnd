import { DashboardFilterModel } from './dashboard-filter.model';

export class ProcInputAndOutputModel {
    customWidgetId: string;
    procName: string;
    inputs: inputsModel[];
    outputs: OutputsModel[];
    isForDashBoard: boolean;
    allChartsDetails: any;
    customStoredProcId: string;
    timeStamp: any;
    customWidgetName: string;
    legends: legendsModel[];
    workspaceId: string;
    dashboardId: string;
    dashboardFilters: any;
}

export class inputsModel {
    parameterName: string;
    dataType: string;
    type: any;
    inputData: any;
    procName: string;
}

export class OutputsModel {
    ParameterName: string
    DataType: string
}

export class legendsModel {
    legendName: string
    value: string
}