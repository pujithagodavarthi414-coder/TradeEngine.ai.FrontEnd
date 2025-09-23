import { FileBytesModel } from "./file-bytes.model";

export class CronExpressionModel {
    cronExpressionId: string;
    cronExpressionName: string;
    cronExpression: string;
    cronExpressionDescription: string;
    isArchived: boolean;
    timeStamp: any;
    customWidgetId: string;
    selectedCharts: string;
    selectedChartName: string;
    templateType: string;
    fileBytes: FileBytesModel[];
    runNow: boolean;
    templateUrl: string;
    jobId: string;
    CustomAppName: string;
}

export class RecurringCronExpressionModel {
    isRecurringWorkItem: boolean;
    customWidgetId: string;
    cronExpression: string;
    cronExpressionId: string;
    cronExpressionTimeStamp: any;
    jobId: any;
    isArchived:boolean;
    isPaused:boolean;
    scheduleEndDate:any;
    conductEndDate:any;
}
